const mongoose = require('mongoose');

const {
  ACTIVITY_CATEGORIES,
  ACTIVITY_STATUSES,
  MAX_IMAGES,
  cloudinaryUrlMatchesPublicId,
  isCloudinaryImageUrl,
  isOwnedPublicId,
  isWebUrl,
} = require('../lib/validation');

const plainTextValidator = {
  validator(value) {
    return !/<\s*\/?\s*[a-z][^>]*>/i.test(value || '');
  },
  message: '{PATH} must be plain text, not HTML.',
};

const activityImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required.'],
      maxlength: 2048,
      validate: {
        validator(value) {
          return (
            isCloudinaryImageUrl(value) &&
            (!this.publicId || cloudinaryUrlMatchesPublicId(value, this.publicId))
          );
        },
        message: 'Image URL must match its secure Cloudinary publicId.',
      },
    },
    publicId: {
      type: String,
      required: [true, 'Image publicId is required.'],
      maxlength: 255,
      validate: {
        validator: isOwnedPublicId,
        message: 'Image publicId is outside the activity folder.',
      },
    },
    alt: {
      type: String,
      required: [true, 'Image alt text is required.'],
      trim: true,
      maxlength: 200,
      validate: plainTextValidator,
    },
  },
  { _id: false },
);

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      minlength: 2,
      maxlength: 160,
      validate: plainTextValidator,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug is invalid.'],
    },
    content: {
      type: String,
      required: [true, 'Content is required.'],
      trim: true,
      minlength: 2,
      maxlength: 12000,
      validate: plainTextValidator,
    },
    category: {
      type: String,
      required: [true, 'Category is required.'],
      enum: ACTIVITY_CATEGORIES,
    },
    status: {
      type: String,
      enum: ACTIVITY_STATUSES,
      default: 'draft',
      index: true,
    },
    images: {
      type: [activityImageSchema],
      default: [],
      validate: {
        validator(images) {
          return images.length <= MAX_IMAGES;
        },
        message: `A maximum of ${MAX_IMAGES} images is allowed.`,
      },
    },
    tags: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 40,
          validate: plainTextValidator,
        },
      ],
      default: [],
      validate: {
        validator(tags) {
          return tags.length <= 12;
        },
        message: 'A maximum of 12 tags is allowed.',
      },
    },
    externalLink: {
      type: String,
      maxlength: 2048,
      validate: {
        validator(value) {
          return value === undefined || isWebUrl(value);
        },
        message: 'External link must be a valid HTTP or HTTPS URL.',
      },
    },
    externalLinkLabel: {
      type: String,
      trim: true,
      maxlength: 80,
      validate: [
        plainTextValidator,
        {
          validator(value) {
            return !value || Boolean(this.externalLink);
          },
          message: 'External link is required when a link label is provided.',
        },
      ],
    },
    location: {
      type: String,
      trim: true,
      maxlength: 160,
      validate: plainTextValidator,
    },
    eventName: {
      type: String,
      trim: true,
      maxlength: 160,
      validate: plainTextValidator,
    },
    occurredAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    // Internal retry queue for cross-provider cleanup. This is deliberately
    // removed by the API serializer and is never accepted from request bodies.
    pendingImageDeletes: {
      type: [
        {
          type: String,
          maxlength: 255,
          validate: {
            validator: isOwnedPublicId,
            message: 'Pending image publicId is outside the activity folder.',
          },
        },
      ],
      default: [],
      validate: {
        validator(publicIds) {
          return publicIds.length <= 50;
        },
        message: 'Too many pending image deletions.',
      },
    },
  },
  {
    strict: 'throw',
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: {
      transform(_document, output) {
        delete output.__v;
        return output;
      },
    },
  },
);

activitySchema.index({
  status: 1,
  featured: -1,
  occurredAt: -1,
  createdAt: -1,
});
activitySchema.index({
  status: 1,
  category: 1,
  featured: -1,
  occurredAt: -1,
  createdAt: -1,
});

module.exports =
  mongoose.models.Activity || mongoose.model('Activity', activitySchema);
