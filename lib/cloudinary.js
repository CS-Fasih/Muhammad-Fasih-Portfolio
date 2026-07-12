const cloudinary = require('cloudinary').v2;

const { CLOUDINARY_FOLDER } = require('./validation');

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

module.exports = {
  CLOUDINARY_FOLDER,
  CloudinaryConfigurationError,
  createUploadSignature,
  destroyImages,
};
