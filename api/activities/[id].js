const {
  HttpError,
  getSingleQuery,
  handleApiError,
  methodNotAllowed,
  readJsonBody,
  setNoStore,
} = require('../../lib/api');
const { requireAdmin, requireTrustedOrigin } = require('../../lib/auth');
const { destroyImages } = require('../../lib/cloudinary');
const { connectDB } = require('../../lib/db');
const { findActivity, serializeActivity } = require('../../lib/activities');
const { validateActivityInput } = require('../../lib/validation');

function parseAdminView(req) {
  const value = getSingleQuery(req, 'admin');
  if (value === undefined) return false;
  if (value === 'true' || value === '1') return true;

  throw new HttpError(
    400,
    'Query parameter "admin" must be true when provided.',
    'INVALID_QUERY',
  );
}

function getIdentifier(req) {
  return getSingleQuery(req, 'id');
}

async function getActivity(req, res) {
  const adminView = parseAdminView(req);
  if (adminView && !requireAdmin(req, res)) return;

  await connectDB();

  const activity = await findActivity(
    getIdentifier(req),
    adminView ? {} : { status: 'published' },
  );

  if (!activity) {
    throw new HttpError(404, 'Activity not found.', 'ACTIVITY_NOT_FOUND');
  }

  // A previously published activity may become a draft. Avoid serving a
  // stale public copy after that state change.
  setNoStore(res);

  return res.status(200).json({
    activity: serializeActivity(activity, { admin: adminView }),
  });
}

async function updateActivity(req, res) {
  if (!requireTrustedOrigin(req, res)) return;
  if (!requireAdmin(req, res)) return;

  const body = await readJsonBody(req, 64 * 1024);
  const input = validateActivityInput(body, { partial: true });

  await connectDB();

  const activity = await findActivity(getIdentifier(req));
  if (!activity) {
    throw new HttpError(404, 'Activity not found.', 'ACTIVITY_NOT_FOUND');
  }

  const oldPublicIds = activity.images.map((image) => image.publicId);

  for (const [field, value] of Object.entries(input)) {
    activity.set(field, value);
  }

  if (Object.prototype.hasOwnProperty.call(input, 'images')) {
    const retainedIds = new Set(activity.images.map((image) => image.publicId));
    const removedIds = oldPublicIds.filter((publicId) => !retainedIds.has(publicId));
    activity.pendingImageDeletes = [
      ...new Set([...(activity.pendingImageDeletes || []), ...removedIds]),
    ];
  }

  // Persist removed IDs before calling Cloudinary so a transient provider
  // failure never makes the cleanup work unrecoverable.
  await activity.save();

  let cleanup = { failed: [] };
  if ((activity.pendingImageDeletes || []).length) {
    cleanup = await destroyImages([...activity.pendingImageDeletes]);
    activity.pendingImageDeletes = cleanup.failed;
    await activity.save();
  }

  const cleanupPending = cleanup.failed.length;

  setNoStore(res);

  const response = {
    activity: serializeActivity(activity, { admin: true }),
  };

  if (cleanupPending) {
    response.warning =
      'Activity saved, but one or more removed images could not be deleted from Cloudinary. Save the activity again to retry cleanup.';
    response.cleanupPending = cleanupPending;
    response.cleanupPendingPublicIds = cleanup.failed;
  }

  return res.status(200).json(response);
}

async function deleteActivity(req, res) {
  if (!requireTrustedOrigin(req, res)) return;
  if (!requireAdmin(req, res)) return;

  await connectDB();

  const activity = await findActivity(getIdentifier(req));
  if (!activity) {
    throw new HttpError(404, 'Activity not found.', 'ACTIVITY_NOT_FOUND');
  }

  const cleanup = await destroyImages(
    [
      ...new Set([
        ...activity.images.map((image) => image.publicId),
        ...(activity.pendingImageDeletes || []),
      ]),
    ],
  );

  if (cleanup.failed.length) {
    throw new HttpError(
      502,
      'The activity was not deleted because its images could not be cleaned up. Please retry.',
      'IMAGE_CLEANUP_FAILED',
    );
  }

  await activity.deleteOne();

  setNoStore(res);
  return res.status(200).json({ message: 'Activity deleted successfully.' });
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') return await getActivity(req, res);
    if (req.method === 'PATCH') return await updateActivity(req, res);
    if (req.method === 'DELETE') return await deleteActivity(req, res);
    return methodNotAllowed(res, ['GET', 'PATCH', 'DELETE']);
  } catch (error) {
    return handleApiError(res, error);
  }
};
