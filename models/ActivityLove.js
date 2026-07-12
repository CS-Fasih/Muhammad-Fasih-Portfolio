const mongoose = require('mongoose');

const activityLoveSchema = new mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: true,
      index: true,
    },
    visitorHash: {
      type: String,
      required: true,
      maxlength: 64,
    },
  },
  { timestamps: true },
);

activityLoveSchema.index({ activity: 1, visitorHash: 1 }, { unique: true });

module.exports = mongoose.models.ActivityLove
  || mongoose.model('ActivityLove', activityLoveSchema);
