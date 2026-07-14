const crypto = require('crypto');

const { getHeader } = require('./api');

const COOKIE_SECONDS = 365 * 24 * 60 * 60;
const TOKEN_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HOSTED_HTTPS = ['production', 'preview'].includes(process.env.VERCEL_ENV)
  || process.env.NODE_ENV === 'production';

class VisitorConfigurationError extends Error {
  constructor(variable = 'REACTION_HASH_SECRET') {
    super(`${variable} is not configured.`);
    this.name = 'VisitorConfigurationError';
  }
}

function cookieName() {
  return HOSTED_HTTPS
    ? '__Host-mf_activity_visitor'
    : 'mf_activity_visitor';
}

function readCookie(req, name) {
  const header = getHeader(req, 'cookie');
  if (!header) return null;

  try {
    for (const item of header.split(';')) {
      const separator = item.indexOf('=');
      if (separator === -1) continue;
      if (item.slice(0, separator).trim() === name) {
        return decodeURIComponent(item.slice(separator + 1).trim());
      }
    }
  } catch {
    return null;
  }
  return null;
}

function getVisitorToken(req) {
  const token = readCookie(req, cookieName());
  return TOKEN_PATTERN.test(token || '') ? token : null;
}

function setVisitorCookie(res, token) {
  const parts = [
    `${cookieName()}=${encodeURIComponent(token)}`,
    `Max-Age=${COOKIE_SECONDS}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
  ];
  if (HOSTED_HTTPS) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

function getOrCreateVisitorToken(req, res) {
  const existing = getVisitorToken(req);
  if (existing) return existing;

  const token = crypto.randomUUID();
  setVisitorCookie(res, token);
  return token;
}

function hashVisitorForActivity(token, activityId) {
  const secret = process.env.REACTION_HASH_SECRET;
  if (!secret || secret.length < 32) throw new VisitorConfigurationError();

  return crypto
    .createHmac('sha256', secret)
    .update(`activity-reaction:v1\0${activityId}\0${token}`)
    .digest('hex');
}

module.exports = {
  TOKEN_PATTERN,
  VisitorConfigurationError,
  getOrCreateVisitorToken,
  getVisitorToken,
  hashVisitorForActivity,
};
