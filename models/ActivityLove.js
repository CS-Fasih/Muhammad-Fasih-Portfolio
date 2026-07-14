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
    reactionVersion: {
      type: Number,
      required: true,
      default: 2,
      index: true,
    },
  },
  { timestamps: true },
);

activityLoveSchema.index(
  { activity: 1, reactionVersion: 1, visitorHash: 1 },
  { unique: true, name: 'activity_reaction_version_visitor_unique' },
);

module.exports = mongoose.models.ActivityLove
  || mongoose.model('ActivityLove', activityLoveSchema);
