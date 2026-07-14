const crypto = require('crypto');

const { HttpError, getHeader } = require('./api');
const { connectDB } = require('./db');
const RateLimit = require('../models/RateLimit');

function getClientAddress(req) {
  const forwarded = getHeader(req, 'x-vercel-forwarded-for')
    || getHeader(req, 'x-forwarded-for');
  const address = forwarded?.split(',')[0]?.trim()
    || getHeader(req, 'x-real-ip')
    || req.socket?.remoteAddress
    || 'unknown';

  return String(address).slice(0, 128);
}

function hashIdentifier(value) {
  const secret = process.env.RATE_LIMIT_HASH_SECRET;
  if (!secret || secret.length < 32) {
    const error = new Error('Rate limiting is not configured.');
    error.name = 'AuthenticationConfigurationError';
    throw error;
  }

  return crypto
    .createHmac('sha256', secret)
    .update(`rate-limit:v1\0${value}`)
    .digest('hex');
}

async function enforceRateLimit(
  req,
  { scope, limit, windowMs, identifier = getClientAddress(req) },
) {
  const now = Date.now();
  const bucket = Math.floor(now / windowMs);
  const key = `${scope}:${bucket}:${hashIdentifier(String(identifier))}`;
  const expiresAt = new Date((bucket + 1) * windowMs + 60_000);

  await connectDB();
  const update = {
    $inc: { count: 1 },
    $setOnInsert: { expiresAt },
  };
  let result;
  try {
    result = await RateLimit.findOneAndUpdate(
      { key },
      update,
      { new: true, upsert: true, projection: { count: 1 } },
    ).lean();
  } catch (error) {
    // Two cold serverless instances can race to create the same bucket.
    if (error?.code !== 11000) throw error;
    result = await RateLimit.findOneAndUpdate(
      { key },
      { $inc: { count: 1 } },
      { new: true, projection: { count: 1 } },
    ).lean();
  }

  if (result.count > limit) {
    throw new HttpError(
      429,
      'Too many requests. Please wait before trying again.',
      'RATE_LIMITED',
    );
  }

  return {
    limit,
    remaining: Math.max(0, limit - result.count),
    resetAt: (bucket + 1) * windowMs,
  };
}

module.exports = { enforceRateLimit, getClientAddress };
