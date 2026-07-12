const mongoose = require('mongoose');

const Activity = require('../models/Activity');
const ActivityLove = require('../models/ActivityLove');
const { HttpError } = require('./api');
const { slugify } = require('./validation');

function identifierFilter(identifier) {
  if (typeof identifier !== 'string' || !identifier.trim()) {
    throw new HttpError(
      400,
      'An activity identifier is required.',
      'INVALID_IDENTIFIER',
    );
  }

  const normalized = identifier.trim();
  if (normalized.length > 200) {
    throw new HttpError(
      400,
      'Activity identifier is invalid.',
      'INVALID_IDENTIFIER',
    );
  }

  if (/^[a-f\d]{24}$/i.test(normalized) && mongoose.isObjectIdOrHexString(normalized)) {
    return { _id: normalized };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    throw new HttpError(
      400,
      'Activity identifier is invalid.',
      'INVALID_IDENTIFIER',
    );
  }

  return { slug: normalized };
}

async function findActivity(identifier, additionalFilter = {}) {
  return Activity.findOne({
    ...identifierFilter(identifier),
    ...additionalFilter,
  });
}

function slugCandidate(base, suffix) {
  if (suffix === 0) return base;

  const ending = `-${suffix + 1}`;
  const prefix = base.slice(0, 100 - ending.length).replace(/-+$/g, '');
  return `${prefix || 'activity'}${ending}`;
}

function isSlugDuplicate(error) {
  return (
    error?.code === 11000 &&
    (error?.keyPattern?.slug ||
      Object.prototype.hasOwnProperty.call(error?.keyValue || {}, 'slug') ||
      /slug/i.test(error?.message || ''))
  );
}

async function createActivityWithUniqueSlug(input) {
  const base = slugify(input.title);

  for (let suffix = 0; suffix < 100; suffix += 1) {
    const slug = slugCandidate(base, suffix);

    // Avoid an expected duplicate-key round trip in the normal single-admin
    // flow, while still relying on the unique index for concurrent requests.
    // eslint-disable-next-line no-await-in-loop
    if (await Activity.exists({ slug })) continue;

    try {
      // eslint-disable-next-line no-await-in-loop
      return await Activity.create({ ...input, slug });
    } catch (error) {
      if (isSlugDuplicate(error)) continue;
      throw error;
    }
  }

  throw new HttpError(
    409,
    'Could not generate a unique slug for this activity.',
    'SLUG_CONFLICT',
  );
}

async function countActivityLoves(activityId) {
  return ActivityLove.countDocuments({ activity: activityId });
}

async function getActivityLoveCounts(activityIds) {
  if (!activityIds.length) return new Map();

  const counts = await ActivityLove.aggregate([
    { $match: { activity: { $in: activityIds } } },
    { $group: { _id: '$activity', count: { $sum: 1 } } },
  ]);

  return new Map(counts.map(({ _id, count }) => [String(_id), count]));
}

function serializeActivity(document, { admin = false, loves } = {}) {
  const activity = document.toJSON
    ? document.toJSON()
    : JSON.parse(JSON.stringify(document));

  delete activity.pendingImageDeletes;
  activity.loves = Number.isInteger(loves) ? loves : Math.max(0, activity.loves || 0);

  if (!admin) {
    activity.images = (activity.images || []).map(({ url, alt }) => ({
      url,
      alt,
    }));
  }

  return activity;
}

module.exports = {
  Activity,
  countActivityLoves,
  createActivityWithUniqueSlug,
  findActivity,
  getActivityLoveCounts,
  serializeActivity,
};
