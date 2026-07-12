const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { getHeader, sendError } = require('./api');

const SESSION_COOKIE = 'mf_admin_session';
const SESSION_SECONDS = 8 * 60 * 60;
const TOKEN_ISSUER = 'muhammad-fasih-portfolio';
const TOKEN_AUDIENCE = 'activity-admin';

class AuthenticationConfigurationError extends Error {
  constructor(message = 'Admin authentication is not configured.') {
    super(message);
    this.name = 'AuthenticationConfigurationError';
  }
}

function getAuthConfiguration({ requirePassword = false } = {}) {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const jwtSecret = process.env.JWT_SECRET;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new AuthenticationConfigurationError('ADMIN_EMAIL is invalid.');
  }

  if (!jwtSecret || jwtSecret.length < 32) {
    throw new AuthenticationConfigurationError(
      'JWT_SECRET must contain at least 32 characters.',
    );
  }

  if (
    requirePassword &&
    (!passwordHash ||
      !/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(passwordHash))
  ) {
    throw new AuthenticationConfigurationError(
      'ADMIN_PASSWORD_HASH is not a valid bcrypt hash.',
    );
  }

  return { email, jwtSecret, passwordHash };
}

async function credentialsAreValid(submittedEmail, submittedPassword) {
  const { email, passwordHash } = getAuthConfiguration({
    requirePassword: true,
  });

  // Always run bcrypt so a wrong email follows the same expensive path.
  const passwordMatches = await bcrypt.compare(
    submittedPassword,
    passwordHash,
  );

  return submittedEmail.trim().toLowerCase() === email && passwordMatches;
}

function createSessionToken() {
  const { email, jwtSecret } = getAuthConfiguration();

  return jwt.sign(
    { role: 'admin', email },
    jwtSecret,
    {
      algorithm: 'HS256',
      audience: TOKEN_AUDIENCE,
      expiresIn: SESSION_SECONDS,
      issuer: TOKEN_ISSUER,
      subject: email,
    },
  );
}

function readSessionToken(req) {
  const cookieHeader = getHeader(req, 'cookie');
  if (!cookieHeader) return null;

  try {
    for (const item of cookieHeader.split(';')) {
      const separator = item.indexOf('=');
      if (separator === -1) continue;
      const name = item.slice(0, separator).trim();
      if (name === SESSION_COOKIE) {
        return decodeURIComponent(item.slice(separator + 1).trim()) || null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function getAdminSession(req) {
  const token = readSessionToken(req);
  if (!token) return null;

  try {
    const { email, jwtSecret } = getAuthConfiguration();
    const payload = jwt.verify(token, jwtSecret, {
      algorithms: ['HS256'],
      audience: TOKEN_AUDIENCE,
      issuer: TOKEN_ISSUER,
      subject: email,
    });

    if (payload.role !== 'admin' || payload.email !== email) return null;
    return { email };
  } catch (error) {
    if (error instanceof AuthenticationConfigurationError) throw error;
    return null;
  }
}

function requireAdmin(req, res) {
  const session = getAdminSession(req);
  if (session) return session;

  sendError(res, 401, 'Authentication required.', 'AUTH_REQUIRED');
  return null;
}

function isProductionRequest() {
  return process.env.NODE_ENV === 'production';
}

function serializeSessionCookie(value, { expires, maxAge }) {
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(value)}`,
    `Max-Age=${maxAge}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (expires) parts.push(`Expires=${expires.toUTCString()}`);
  if (isProductionRequest()) parts.push('Secure');
  return parts.join('; ');
}

function makeSessionCookie(token) {
  return serializeSessionCookie(token, {
    maxAge: SESSION_SECONDS,
  });
}

function makeExpiredSessionCookie() {
  return serializeSessionCookie('', {
    expires: new Date(0),
    maxAge: 0,
  });
}

function firstForwardedValue(value) {
  return value?.split(',')[0]?.trim();
}

function hasTrustedOrigin(req) {
  const fetchSite = getHeader(req, 'sec-fetch-site');
  if (fetchSite === 'cross-site') return false;

  const origin = getHeader(req, 'origin');
  if (!origin) return true;
  if (origin === 'null') return false;

  let parsedOrigin;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    return false;
  }

  if (!['http:', 'https:'].includes(parsedOrigin.protocol)) return false;

  const expectedHosts = new Set(
    [
      getHeader(req, 'host'),
      firstForwardedValue(getHeader(req, 'x-forwarded-host')),
      process.env.VERCEL_URL,
    ]
      .filter(Boolean)
      .map((host) => host.toLowerCase()),
  );

  return expectedHosts.has(parsedOrigin.host.toLowerCase());
}

function requireTrustedOrigin(req, res) {
  if (hasTrustedOrigin(req)) return true;

  sendError(res, 403, 'Request origin is not allowed.', 'INVALID_ORIGIN');
  return false;
}

module.exports = {
  AuthenticationConfigurationError,
  SESSION_COOKIE,
  credentialsAreValid,
  createSessionToken,
  getAdminSession,
  makeExpiredSessionCookie,
  makeSessionCookie,
  requireAdmin,
  requireTrustedOrigin,
};
