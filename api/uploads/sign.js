const crypto = require('crypto');

const {
  HttpError,
  handleApiError,
  methodNotAllowed,
  readJsonBody,
  setNoStore,
} = require('../../lib/api');
const { requireAdmin, requireTrustedOrigin } = require('../../lib/auth');
const { createUploadSignature } = require('../../lib/cloudinary');
const {
  CLOUDINARY_FOLDER,
  MAX_IMAGE_BYTES,
} = require('../../lib/validation');

const MIME_FORMATS = Object.freeze({
  'image/gif': ['gif'],
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
});

function validateFileMetadata(body) {
  const unknownFields = Object.keys(body).filter(
    (field) => !['fileName', 'fileSize', 'mimeType'].includes(field),
  );
  if (unknownFields.length) {
    throw new HttpError(
      400,
      'Upload metadata contains unsupported fields.',
      'INVALID_UPLOAD',
    );
  }

  const { fileName, fileSize, mimeType } = body;

  if (
    typeof fileName !== 'string' ||
    !fileName.trim() ||
    fileName.length > 255
  ) {
    throw new HttpError(400, 'A valid file name is required.', 'INVALID_UPLOAD');
  }

  if (
    !Number.isSafeInteger(fileSize) ||
    fileSize < 1 ||
    fileSize > MAX_IMAGE_BYTES
  ) {
    throw new HttpError(
      400,
      'Images must be no larger than 5 MB.',
      'INVALID_UPLOAD_SIZE',
    );
  }

  const extensions = MIME_FORMATS[mimeType];
  if (!extensions) {
    throw new HttpError(
      400,
      'Only JPEG, PNG, WebP, and GIF images are supported.',
      'INVALID_UPLOAD_TYPE',
    );
  }

  const extension = fileName.split('.').pop()?.toLowerCase();
  if (!extensions.includes(extension)) {
    throw new HttpError(
      400,
      'The file extension does not match its image type.',
      'INVALID_UPLOAD_TYPE',
    );
  }
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
    if (!requireTrustedOrigin(req, res)) return;
    if (!requireAdmin(req, res)) return;

    const body = await readJsonBody(req, 4 * 1024);
    validateFileMetadata(body);

    const uploadParams = {
      allowed_formats: 'jpg,jpeg,png,webp,gif',
      // Organize assets in Cloudinary's current dynamic-folder mode while the
      // public ID prefix keeps ownership checks and delivery URLs stable.
      asset_folder: CLOUDINARY_FOLDER,
      overwrite: false,
      public_id: `${CLOUDINARY_FOLDER}/${crypto.randomUUID()}`,
      timestamp: Math.floor(Date.now() / 1000),
    };

    const signed = createUploadSignature(uploadParams);

    setNoStore(res);
    return res.status(200).json({
      ...signed,
      allowedFormats: Object.keys(MIME_FORMATS),
      maxFileSize: MAX_IMAGE_BYTES,
    });
  } catch (error) {
    return handleApiError(res, error);
  }
};
