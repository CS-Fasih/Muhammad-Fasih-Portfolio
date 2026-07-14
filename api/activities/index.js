const {
  HttpError,
  getSingleQuery,
  handleApiError,
  methodNotAllowed,
  parsePositiveInteger,
  readJsonBody,
  setNoStore,
} = require('../../lib/api');
const { requireAdmin, requireTrustedOrigin } = require('../../lib/auth');
const { connectDB } = require('../../lib/db');
const { verifyActivityImages } = require('../../lib/cloudinary');
const {
  Activity,
  createActivityWithUniqueSlug,
  getActivityLoveCounts,
  getViewerLovedActivityIds,
  serializeActivity,
} = require('../../lib/activities');
const { getVisitorToken } = require('../../lib/visitor');
const { enforceRateLimit } = require('../../lib/rate-limit');
const {
  ACTIVITY_STATUSES,
  normalizeCategory,
  validateActivityInput,
} = require('../../lib/validation');

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

function parseCategoryQuery(req) {
  const value = getSingleQuery(req, 'category');
  if (value === undefined) return null;
  if (typeof value !== 'string') {
    throw new HttpError(400, 'Unknown activity category.', 'INVALID_CATEGORY');
  }
  if (value.trim().toLowerCase() === 'all') return null;

  const category = normalizeCategory(value);
  if (!category) {
    throw new HttpError(
      400,
      'Unknown activity category.',
      'INVALID_CATEGORY',
    );
  }

  return category;
}

async function listActivities(req, res) {
  const adminView = parseAdminView(req);
  if (adminView && !requireAdmin(req, res)) return;
  if (!adminView) {
    await enforceRateLimit(req, {
      scope: 'activity-read',
      limit: 180,
      windowMs: 10 * 60 * 1000,
    });
  }

  const category = parseCategoryQuery(req);
  const page = parsePositiveInteger(
    getSingleQuery(req, 'page'),
    'page',
    1,
    100,
  );
  const limit = parsePositiveInteger(
    getSingleQuery(req, 'limit'),
    'limit',
    adminView ? 20 : 6,
    adminView ? 50 : 24,
  );

  const status = getSingleQuery(req, 'status');
  if (status !== undefined && !adminView) {
    throw new HttpError(
      400,
      'The status filter is available only to administrators.',
      'INVALID_QUERY',
    );
  }
  if (status !== undefined && status !== 'all' && !ACTIVITY_STATUSES.includes(status)) {
    throw new HttpError(400, 'Unknown activity status.', 'INVALID_STATUS');
  }

  const query = adminView
    ? status && status !== 'all'
      ? { status }
      : {}
    : { status: 'published' };
  if (category) query.category = category;

  await connectDB();

  const skip = (page - 1) * limit;
  const [documents, total] = await Promise.all([
    Activity.find(query)
      .sort({ featured: -1, occurredAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .maxTimeMS(5000),
    Activity.countDocuments(query).maxTimeMS(5000),
  ]);
  const activityIds = documents.map(({ _id }) => _id);
  const [loveCounts, viewerLovedIds] = await Promise.all([
    getActivityLoveCounts(activityIds),
    getViewerLovedActivityIds(activityIds, getVisitorToken(req)),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  // Do not cache published records: an unpublish/delete must take effect
  // immediately instead of leaving a former public version in a CDN cache.
  setNoStore(res);

  return res.status(200).json({
    activities: documents.map((document) =>
      serializeActivity(document, {
        admin: adminView,
        loves: loveCounts.get(String(document._id)) || 0,
        viewerLoved: viewerLovedIds.has(String(document._id)),
      }),
    ),
    pagination: {
      hasMore: page * limit < total,
      hasNextPage: page * limit < total,
      limit,
      page,
      total,
      totalPages,
    },
  });
}

async function createActivity(req, res) {
  if (!requireTrustedOrigin(req, res)) return;
  if (!requireAdmin(req, res)) return;
  await enforceRateLimit(req, {
    scope: 'admin-activity-write',
    limit: 120,
    windowMs: 60 * 60 * 1000,
  });

  const body = await readJsonBody(req, 64 * 1024);
  const input = validateActivityInput(body);

  await connectDB();
  await verifyActivityImages(input.images);

  const activity = await createActivityWithUniqueSlug(input);

  setNoStore(res);
  return res.status(201).json({
    activity: serializeActivity(activity, { admin: true }),
  });
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') return await listActivities(req, res);
    if (req.method === 'POST') return await createActivity(req, res);
    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    return handleApiError(res, error);
  }
};
