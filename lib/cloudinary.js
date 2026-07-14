const cloudinary = require('cloudinary').v2;

const { CLOUDINARY_FOLDER, MAX_IMAGE_BYTES } = require('./validation');

const ALLOWED_IMAGE_FORMATS = new Set(['gif', 'jpeg', 'jpg', 'png', 'webp']);

class CloudinaryConfigurationError extends Error {
  constructor() {
    super('Cloudinary credentials are not configured.');
    this.name = 'CloudinaryConfigurationError';
  }
}

function getCloudinaryConfiguration() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (
    !cloudName ||
    !/^[a-zA-Z0-9_-]+$/.test(cloudName) ||
    !apiKey ||
    !apiSecret
  ) {
    throw new CloudinaryConfigurationError();
  }

  cloudinary.config({
    api_key: apiKey,
    api_secret: apiSecret,
    cloud_name: cloudName,
    secure: true,
  });

  return { apiKey, apiSecret, cloudName };
}

function createUploadSignature(uploadParams) {
  const { apiKey, apiSecret, cloudName } = getCloudinaryConfiguration();
  const signature = cloudinary.utils.api_sign_request(uploadParams, apiSecret);

  return {
    apiKey,
    cloudName,
    signature,
    uploadParams,
    uploadUrl: `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
  };
}

async function destroyImage(publicId) {
  getCloudinaryConfiguration();

  const result = await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: 'image',
  });

  if (!['ok', 'not found'].includes(result?.result)) {
    throw new Error('Cloudinary asset deletion was not confirmed.');
  }
}

async function destroyImages(publicIds) {
  const uniquePublicIds = [...new Set(publicIds.filter(Boolean))];
  if (!uniquePublicIds.length) return { failed: [] };

  const results = await Promise.allSettled(uniquePublicIds.map(destroyImage));
  const failed = results.flatMap((result, index) =>
    result.status === 'rejected' ? [uniquePublicIds[index]] : [],
  );

  return { failed };
}

async function verifyActivityImages(images) {
  if (!images?.length) return;
  getCloudinaryConfiguration();

  const results = await Promise.all(images.map((image) => new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const error = new Error('Cloudinary image verification timed out.');
      error.name = 'CloudinaryProviderError';
      reject(error);
    }, 8000);

    try {
      cloudinary.api.resource(
        image.publicId,
        { resource_type: 'image', type: 'upload' },
        (error, result) => {
          clearTimeout(timeout);
          if (error) {
            const wrapped = new Error(
              error.http_code === 404
                ? 'The uploaded image could not be found.'
                : 'Cloudinary image verification failed.',
            );
            wrapped.name = error.http_code === 404
              ? 'CloudinaryAssetValidationError'
              : 'CloudinaryProviderError';
            return reject(wrapped);
          }
          resolve(result);
        },
      );
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  })));

  results.forEach((result, index) => {
    if (
      !Number.isSafeInteger(result?.bytes)
      || result.bytes < 1
      || result.bytes > MAX_IMAGE_BYTES
      || !ALLOWED_IMAGE_FORMATS.has(String(result.format || '').toLowerCase())
    ) {
      const error = new Error(`Image ${index + 1} exceeds the allowed upload policy.`);
      error.name = 'CloudinaryAssetValidationError';
      throw error;
    }
  });
}

module.exports = {
  CLOUDINARY_FOLDER,
  CloudinaryConfigurationError,
  createUploadSignature,
  destroyImages,
  verifyActivityImages,
};
