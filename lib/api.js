class HttpError extends Error {
  constructor(status, message, code = 'REQUEST_ERROR', details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function getHeader(req, name) {
  const value = req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function setNoStore(res) {
  res.setHeader('Cache-Control', 'no-store');
}

function sendError(res, status, message, code = 'REQUEST_ERROR', details) {
  setNoStore(res);

  const payload = { error: message, code };
  if (details !== undefined) payload.details = details;

  return res.status(status).json(payload);
}

function methodNotAllowed(res, allowedMethods) {
  res.setHeader('Allow', allowedMethods.join(', '));
  return sendError(
    res,
    405,
    'Method not allowed.',
    'METHOD_NOT_ALLOWED',
  );
}

function getSingleQuery(req, name) {
  const value = req.query?.[name];

  if (Array.isArray(value)) {
    throw new HttpError(
      400,
      `Query parameter "${name}" must be provided once.`,
      'INVALID_QUERY',
    );
  }

  return value;
}

function parsePositiveInteger(value, name, fallback, maximum) {
  if (value === undefined || value === '') return fallback;

  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw new HttpError(
      400,
      `Query parameter "${name}" must be a positive integer.`,
      'INVALID_QUERY',
    );
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > maximum) {
    throw new HttpError(
      400,
      `Query parameter "${name}" must be between 1 and ${maximum}.`,
      'INVALID_QUERY',
    );
  }

  return parsed;
}

function assertJsonContentType(req) {
  const contentType = getHeader(req, 'content-type');
  if (contentType && !contentType.toLowerCase().includes('application/json')) {
    throw new HttpError(
      415,
      'Content-Type must be application/json.',
      'UNSUPPORTED_MEDIA_TYPE',
    );
  }
}

function assertPlainObject(value) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    (Object.getPrototypeOf(value) !== Object.prototype &&
      Object.getPrototypeOf(value) !== null)
  ) {
    throw new HttpError(
      400,
      'Request body must be a JSON object.',
      'INVALID_JSON',
    );
  }
}

async function readJsonBody(req, maximumBytes = 64 * 1024) {
  assertJsonContentType(req);

  const contentLength = Number(getHeader(req, 'content-length'));
  if (Number.isFinite(contentLength) && contentLength > maximumBytes) {
    throw new HttpError(
      413,
      'Request payload is too large.',
      'PAYLOAD_TOO_LARGE',
    );
  }

  let body = req.body;

  if (body === undefined) {
    const chunks = [];
    let totalBytes = 0;

    for await (const chunk of req) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += buffer.length;

      if (totalBytes > maximumBytes) {
        throw new HttpError(
          413,
          'Request payload is too large.',
          'PAYLOAD_TOO_LARGE',
        );
      }

      chunks.push(buffer);
    }

    body = Buffer.concat(chunks).toString('utf8');
  }

  if (Buffer.isBuffer(body)) body = body.toString('utf8');

  if (typeof body === 'string') {
    if (Buffer.byteLength(body, 'utf8') > maximumBytes) {
      throw new HttpError(
        413,
        'Request payload is too large.',
        'PAYLOAD_TOO_LARGE',
      );
    }

    try {
      body = JSON.parse(body);
    } catch {
      throw new HttpError(400, 'Malformed JSON body.', 'INVALID_JSON');
    }
  } else {
    let serialized;
    try {
      serialized = JSON.stringify(body);
    } catch {
      throw new HttpError(400, 'Malformed JSON body.', 'INVALID_JSON');
    }

    if (!serialized || Buffer.byteLength(serialized, 'utf8') > maximumBytes) {
      throw new HttpError(
        413,
        'Request payload is too large.',
        'PAYLOAD_TOO_LARGE',
      );
    }
  }

  assertPlainObject(body);
  return body;
}

function handleApiError(res, error) {
  if (error instanceof HttpError) {
    return sendError(
      res,
      error.status,
      error.message,
      error.code,
      error.details,
    );
  }

  if (error?.name === 'ValidationError') {
    const details = Object.values(error.errors || {}).map((item) => ({
      field: item.path,
      message: item.message,
    }));

    return sendError(
      res,
      400,
      'Activity validation failed.',
      'VALIDATION_ERROR',
      details,
    );
  }

  if (error?.name === 'CastError' || error?.name === 'StrictModeError') {
    return sendError(res, 400, 'Invalid request data.', 'VALIDATION_ERROR');
  }

  if (error?.name === 'CloudinaryAssetValidationError') {
    return sendError(res, 400, error.message, 'INVALID_IMAGE');
  }

  if (error?.name === 'CloudinaryProviderError') {
    return sendError(res, 502, 'Image verification is temporarily unavailable.', 'CLOUDINARY_UNAVAILABLE');
  }

  if (error?.code === 11000) {
    return sendError(
      res,
      409,
      'An activity with this slug already exists.',
      'SLUG_CONFLICT',
    );
  }

  if (error?.name === 'VersionError') {
    return sendError(
      res,
      409,
      'This activity changed while it was being edited. Reload it and try again.',
      'ACTIVITY_CONFLICT',
    );
  }

  if (
    error?.name === 'DatabaseConfigurationError' ||
    error?.name === 'CloudinaryConfigurationError' ||
    error?.name === 'AuthenticationConfigurationError' ||
    error?.name === 'VisitorConfigurationError'
  ) {
    return sendError(
      res,
      503,
      'This service is not configured yet.',
      'SERVICE_NOT_CONFIGURED',
    );
  }

  if (
    error?.name === 'MongooseServerSelectionError' ||
    error?.name === 'MongoNetworkError'
  ) {
    return sendError(
      res,
      503,
      'The activity service is temporarily unavailable.',
      'SERVICE_UNAVAILABLE',
    );
  }

  // Keep operational details and environment values out of API responses.
  console.error('[activity-api] Unexpected error type:', error?.name || 'Error');
  return sendError(
    res,
    500,
    'An unexpected server error occurred.',
    'INTERNAL_ERROR',
  );
}

module.exports = {
  HttpError,
  getHeader,
  getSingleQuery,
  handleApiError,
  methodNotAllowed,
  parsePositiveInteger,
  readJsonBody,
  sendError,
  setNoStore,
};
