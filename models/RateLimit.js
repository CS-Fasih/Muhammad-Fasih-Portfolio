const mongoose = require('mongoose');

const rateLimitSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      maxlength: 160,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.models.RateLimit
  || mongoose.model('RateLimit', rateLimitSchema);
