const {
  HttpError,
  handleApiError,
  methodNotAllowed,
  readJsonBody,
  setNoStore,
} = require('../lib/api');
const { requireTrustedOrigin } = require('../lib/auth');
const { enforceRateLimit } = require('../lib/rate-limit');

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const ALLOWED_FIELDS = new Set(['name', 'email', 'subject', 'message', 'website']);

function cleanSingleLine(value, field, maximum) {
  if (typeof value !== 'string') {
    throw new HttpError(400, `${field} is required.`, 'INVALID_CONTACT_FORM');
  }

  const cleaned = value
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned || cleaned.length > maximum) {
    throw new HttpError(400, `${field} is invalid.`, 'INVALID_CONTACT_FORM');
  }
  return cleaned;
}

function cleanMessage(value) {
  if (typeof value !== 'string') {
    throw new HttpError(400, 'Message is required.', 'INVALID_CONTACT_FORM');
  }
  const cleaned = value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim();
  if (!cleaned || cleaned.length > 5000) {
    throw new HttpError(400, 'Message is invalid.', 'INVALID_CONTACT_FORM');
  }
  return cleaned;
}

function validateContactBody(body) {
  if (Object.keys(body).some((field) => !ALLOWED_FIELDS.has(field))) {
    throw new HttpError(400, 'Invalid contact form.', 'INVALID_CONTACT_FORM');
  }

  // Honeypot fields are intentionally accepted with a success response later.
  const website = typeof body.website === 'string' ? body.website.trim() : '';
  const name = cleanSingleLine(body.name, 'Name', 100);
  const email = cleanSingleLine(body.email, 'Email', 254).toLowerCase();
  const subject = cleanSingleLine(body.subject, 'Subject', 160);
  const message = cleanMessage(body.message);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, 'Email is invalid.', 'INVALID_CONTACT_FORM');
  }

  return { email, message, name, subject, website };
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
    if (!requireTrustedOrigin(req, res)) return;

    await enforceRateLimit(req, {
      scope: 'contact',
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });

    const input = validateContactBody(await readJsonBody(req, 8 * 1024));
    setNoStore(res);

    // Silently accept obvious bots so the honeypot cannot be used as an oracle.
    if (input.website) return res.status(200).json({ success: true });

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      throw new HttpError(503, 'Contact service is unavailable.', 'SERVICE_NOT_CONFIGURED');
    }

    const providerResponse = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        from_name: 'Muhammad Fasih Portfolio',
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    const providerResult = await providerResponse.json().catch(() => null);
    if (!providerResponse.ok || !providerResult?.success) {
      throw new HttpError(502, 'Message could not be delivered.', 'CONTACT_DELIVERY_FAILED');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return handleApiError(res, error);
  }
};
