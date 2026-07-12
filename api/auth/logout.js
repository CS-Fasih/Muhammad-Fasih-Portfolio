const {
  handleApiError,
  methodNotAllowed,
  setNoStore,
} = require('../../lib/api');
const {
  makeExpiredSessionCookie,
  requireTrustedOrigin,
} = require('../../lib/auth');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
    if (!requireTrustedOrigin(req, res)) return;

    res.setHeader('Set-Cookie', makeExpiredSessionCookie());
    setNoStore(res);

    return res.status(200).json({
      authenticated: false,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    return handleApiError(res, error);
  }
};
