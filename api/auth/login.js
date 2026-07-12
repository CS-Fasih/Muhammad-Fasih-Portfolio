const {
  HttpError,
  handleApiError,
  methodNotAllowed,
  readJsonBody,
  sendError,
  setNoStore,
} = require('../../lib/api');
const {
  credentialsAreValid,
  createSessionToken,
  makeSessionCookie,
  requireTrustedOrigin,
} = require('../../lib/auth');

function validateLoginBody(body) {
  const unknownFields = Object.keys(body).filter(
    (field) => !['email', 'password'].includes(field),
  );

  if (unknownFields.length) {
    throw new HttpError(
      400,
      'Invalid login request.',
      'INVALID_LOGIN_REQUEST',
    );
  }

  if (
    typeof body.email !== 'string' ||
    body.email.length > 254 ||
    !/^\S+@\S+\.\S+$/.test(body.email)
  ) {
    throw new HttpError(
      400,
      'Enter a valid email address and password.',
      'INVALID_LOGIN_REQUEST',
    );
  }

  if (
    typeof body.password !== 'string' ||
    body.password.length < 1 ||
    body.password.length > 256
  ) {
    throw new HttpError(
      400,
      'Enter a valid email address and password.',
      'INVALID_LOGIN_REQUEST',
    );
  }

  return { email: body.email, password: body.password };
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
    if (!requireTrustedOrigin(req, res)) return;

    const body = await readJsonBody(req, 4 * 1024);
    const credentials = validateLoginBody(body);

    if (!(await credentialsAreValid(credentials.email, credentials.password))) {
      return sendError(
        res,
        401,
        'Invalid email or password.',
        'INVALID_CREDENTIALS',
      );
    }

    const token = createSessionToken();
    res.setHeader('Set-Cookie', makeSessionCookie(token));
    setNoStore(res);

    return res.status(200).json({
      authenticated: true,
      user: { email: credentials.email.trim().toLowerCase() },
    });
  } catch (error) {
    return handleApiError(res, error);
  }
};
