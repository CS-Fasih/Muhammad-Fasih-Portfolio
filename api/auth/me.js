const {
  handleApiError,
  methodNotAllowed,
  sendError,
  setNoStore,
} = require('../../lib/api');
const { getAdminSession } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

    setNoStore(res);
    const session = getAdminSession(req);

    if (!session) {
      return sendError(
        res,
        401,
        'Authentication required.',
        'AUTH_REQUIRED',
      );
    }

    return res.status(200).json({
      authenticated: true,
      user: { email: session.email },
    });
  } catch (error) {
    return handleApiError(res, error);
  }
};
