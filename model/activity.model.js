const {Schema, model, mongoose} = require('mongoose');

const activitySchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['upload', 'download', 'delete', 'rename', 'create', 'share', 'shared-download']
  },
  fileId: {
    type: mongoose.Types.ObjectId,
    ref: 'File',
    required: false
  },
  filename: {
    type: String
  },
  shareId: {
    type: mongoose.Types.ObjectId,
    ref: 'Share'
  },
  details: {
    type: String
  },

}, {timestamps: true});

const ActivityModel = model('Activity', activitySchema)

module.exports = ActivityModel