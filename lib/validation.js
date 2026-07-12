const { HttpError } = require('./api');

const ACTIVITY_CATEGORIES = Object.freeze([
  'Building',
  'Learning',
  'Event',
  'Achievement',
  'Certification',
  'Open Source',
  'Experiment',
]);

const ACTIVITY_STATUSES = Object.freeze(['draft', 'published']);
const CLOUDINARY_FOLDER = 'muhammad-fasih-portfolio/activities';
const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_TAGS = 12;

const ACTIVITY_FIELDS = new Set([
  'title',
  'content',
  'category',
  'status',
  'images',
  'tags',
  'externalLink',
  'externalLinkLabel',
  'location',
  'eventName',
  'occurredAt',
  'featured',
]);

const HTML_TAG_PATTERN = /<\s*\/?\s*[a-z][^>]*>/i;

function validationError(message, field) {
  return new HttpError(
    400,
    'Activity validation failed.',
    'VALIDATION_ERROR',
    [{ field, message }],
  );
}

function normalizeLineEndings(value) {
  return value.replace(/\r\n?/g, '\n');
}

function cleanString(
  value,
  field,
  { required = false, minimum = 0, maximum, multiline = false } = {},
) {
  if (value === undefined || value === null || value === '') {
    if (required) throw validationError(`${field} is required.`, field);
    return undefined;
  }

  if (typeof value !== 'string') {
    throw validationError(`${field} must be text.`, field);
  }

  let cleaned = normalizeLineEndings(value);
  cleaned = multiline
    ? cleaned.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    : cleaned
        .replace(/[\u0000-\u001f\u007f]/g, ' ')
        .replace(/\s+/g, ' ');
  cleaned = cleaned.trim();

  if (!cleaned && required) {
    throw validationError(`${field} is required.`, field);
  }

  if (!cleaned) return undefined;

  if (cleaned.length < minimum) {
    throw validationError(
      `${field} must contain at least ${minimum} characters.`,
      field,
    );
  }

  if (maximum && cleaned.length > maximum) {
    throw validationError(
      `${field} must contain at most ${maximum} characters.`,
      field,
    );
  }

  if (HTML_TAG_PATTERN.test(cleaned)) {
    throw validationError(`${field} must be plain text, not HTML.`, field);
  }

  return cleaned;
}

function normalizeCategory(value) {
  if (typeof value !== 'string') return null;

  const normalized = value.trim().toLowerCase().replace(/[-_]+/g, ' ');
  const aliases = {
    building: 'Building',
    learning: 'Learning',
    event: 'Event',
    events: 'Event',
    achievement: 'Achievement',
    achievements: 'Achievement',
    certification: 'Certification',
    certifications: 'Certification',
    'open source': 'Open Source',
    opensource: 'Open Source',
    experiment: 'Experiment',
    experiments: 'Experiment',
  };

  return aliases[normalized] || null;
}

function parseCategory(value, { field = 'category' } = {}) {
  const category = normalizeCategory(value);
  if (!category) {
    throw validationError(
      `${field} must be one of: ${ACTIVITY_CATEGORIES.join(', ')}.`,
      field,
    );
  }
  return category;
}

function isWebUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) return false;

  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function parseExternalUrl(value) {
  const cleaned = cleanString(value, 'externalLink', { maximum: 2048 });
  if (cleaned === undefined) return undefined;

  if (!isWebUrl(cleaned)) {
    throw validationError(
      'externalLink must be a valid HTTP or HTTPS URL.',
      'externalLink',
    );
  }

  return cleaned;
}

function isCloudinaryImageUrl(value) {
  if (!isWebUrl(value)) return false;

  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com') {
    return false;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  if (!cloudName) return /\/image\/upload\//.test(url.pathname);

  return url.pathname.startsWith(`/${cloudName}/image/upload/`);
}

function isOwnedPublicId(value) {
  if (typeof value !== 'string' || value.length > 255) return false;

  const escapedFolder = CLOUDINARY_FOLDER.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  );

  return new RegExp(
    `^${escapedFolder}/[a-zA-Z0-9_-]+(?:/[a-zA-Z0-9_-]+)*$`,
  ).test(value);
}

function cloudinaryUrlMatchesPublicId(value, publicId) {
  if (!isCloudinaryImageUrl(value) || !isOwnedPublicId(publicId)) return false;

  try {
    const url = new URL(value);
    const marker = '/image/upload/';
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex === -1) return false;

    const segments = url.pathname
      .slice(markerIndex + marker.length)
      .split('/')
      .filter(Boolean)
      .map((segment) => decodeURIComponent(segment));

    // Cloudinary's original secure_url normally includes an asset version.
    if (/^v\d+$/.test(segments[0] || '')) segments.shift();
    if (segments.length === 0) return false;

    const fileName = segments.pop();
    const extensionIndex = fileName.lastIndexOf('.');
    if (extensionIndex <= 0) return false;
    segments.push(fileName.slice(0, extensionIndex));

    return segments.join('/') === publicId;
  } catch {
    return false;
  }
}

function parseImages(value) {
  if (!Array.isArray(value)) {
    throw validationError('images must be an array.', 'images');
  }

  if (value.length > MAX_IMAGES) {
    throw validationError(
      `A maximum of ${MAX_IMAGES} images is allowed.`,
      'images',
    );
  }

  const seenPublicIds = new Set();

  return value.map((image, index) => {
    if (
      !image ||
      typeof image !== 'object' ||
      Array.isArray(image) ||
      Object.getPrototypeOf(image) !== Object.prototype
    ) {
      throw validationError(
        `images[${index}] must be an object.`,
        `images.${index}`,
      );
    }

    const unknownFields = Object.keys(image).filter(
      (key) => !['url', 'publicId', 'alt'].includes(key),
    );
    if (unknownFields.length) {
      throw validationError(
        `images[${index}] contains unsupported fields.`,
        `images.${index}`,
      );
    }

    const url = cleanString(image.url, `images.${index}.url`, {
      required: true,
      maximum: 2048,
    });
    const publicId = cleanString(
      image.publicId,
      `images.${index}.publicId`,
      { required: true, maximum: 255 },
    );
    const alt = cleanString(image.alt, `images.${index}.alt`, {
      required: true,
      maximum: 200,
    });

    if (!isCloudinaryImageUrl(url)) {
      throw validationError(
        'Each image URL must be a secure Cloudinary image URL.',
        `images.${index}.url`,
      );
    }

    if (!isOwnedPublicId(publicId)) {
      throw validationError(
        'Each image publicId must belong to the activity upload folder.',
        `images.${index}.publicId`,
      );
    }

    if (!cloudinaryUrlMatchesPublicId(url, publicId)) {
      throw validationError(
        'Each image URL must match its Cloudinary publicId.',
        `images.${index}.url`,
      );
    }

    if (seenPublicIds.has(publicId)) {
      throw validationError(
        'The same uploaded image cannot be added more than once.',
        `images.${index}.publicId`,
      );
    }

    seenPublicIds.add(publicId);
    return { url, publicId, alt };
  });
}

function normalizeTags(value) {
  if (!Array.isArray(value)) {
    throw validationError('tags must be an array.', 'tags');
  }

  if (value.length > MAX_TAGS * 2) {
    throw validationError(`A maximum of ${MAX_TAGS} tags is allowed.`, 'tags');
  }

  const tags = [];
  const seen = new Set();

  for (const rawTag of value) {
    let tag = cleanString(rawTag, 'tags', { maximum: 40 });
    if (!tag) continue;

    tag = tag.replace(/^#+/, '').trim();
    if (!tag) continue;

    const key = tag.toLocaleLowerCase('en-US');
    if (seen.has(key)) continue;

    seen.add(key);
    tags.push(tag);
  }

  if (tags.length > MAX_TAGS) {
    throw validationError(`A maximum of ${MAX_TAGS} tags is allowed.`, 'tags');
  }

  return tags;
}

function parseDate(value) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw validationError('occurredAt must be a valid date.', 'occurredAt');
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw validationError('occurredAt must be a valid date.', 'occurredAt');
  }

  return parsed;
}

function parseBoolean(value, field) {
  if (typeof value !== 'boolean') {
    throw validationError(`${field} must be a boolean.`, field);
  }
  return value;
}

function validateActivityInput(body, { partial = false } = {}) {
  const unknownFields = Object.keys(body).filter(
    (field) => !ACTIVITY_FIELDS.has(field),
  );

  if (unknownFields.length) {
    throw validationError(
      `Unsupported field${unknownFields.length > 1 ? 's' : ''}: ${unknownFields.join(', ')}.`,
      unknownFields[0],
    );
  }

  if (partial && Object.keys(body).length === 0) {
    throw validationError('At least one activity field is required.', 'body');
  }

  const output = {};
  const has = (field) => Object.prototype.hasOwnProperty.call(body, field);

  if (!partial || has('title')) {
    output.title = cleanString(body.title, 'title', {
      required: true,
      minimum: 2,
      maximum: 160,
    });
  }

  if (!partial || has('content')) {
    output.content = cleanString(body.content, 'content', {
      required: true,
      minimum: 2,
      maximum: 12000,
      multiline: true,
    });
  }

  if (!partial || has('category')) {
    output.category = parseCategory(body.category);
  }

  if (has('status')) {
    if (!ACTIVITY_STATUSES.includes(body.status)) {
      throw validationError(
        `status must be one of: ${ACTIVITY_STATUSES.join(', ')}.`,
        'status',
      );
    }
    output.status = body.status;
  } else if (!partial) {
    output.status = 'draft';
  }

  if (has('images')) output.images = parseImages(body.images);
  else if (!partial) output.images = [];

  if (has('tags')) output.tags = normalizeTags(body.tags);
  else if (!partial) output.tags = [];

  if (has('externalLink')) output.externalLink = parseExternalUrl(body.externalLink);

  if (has('externalLinkLabel')) {
    output.externalLinkLabel = cleanString(
      body.externalLinkLabel,
      'externalLinkLabel',
      { maximum: 80 },
    );
  }

  if (has('location')) {
    output.location = cleanString(body.location, 'location', { maximum: 160 });
  }

  if (has('eventName')) {
    output.eventName = cleanString(body.eventName, 'eventName', {
      maximum: 160,
    });
  }

  if (!partial || has('occurredAt')) {
    output.occurredAt = parseDate(body.occurredAt);
  }

  if (has('featured')) output.featured = parseBoolean(body.featured, 'featured');
  else if (!partial) output.featured = false;

  if (
    output.externalLinkLabel &&
    ((!partial && !output.externalLink) ||
      (has('externalLink') && !output.externalLink))
  ) {
    throw validationError(
      'externalLink is required when externalLinkLabel is provided.',
      'externalLink',
    );
  }

  return output;
}

function slugify(value) {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');

  return slug || 'activity';
}

module.exports = {
  ACTIVITY_CATEGORIES,
  ACTIVITY_STATUSES,
  CLOUDINARY_FOLDER,
  MAX_IMAGE_BYTES,
  MAX_IMAGES,
  cloudinaryUrlMatchesPublicId,
  isCloudinaryImageUrl,
  isOwnedPublicId,
  isWebUrl,
  normalizeCategory,
  normalizeTags,
  slugify,
  validateActivityInput,
};
