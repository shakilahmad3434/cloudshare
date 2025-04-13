const {Schema, model, mongoose} = require('mongoose')

const shareSchema = new Schema({
  from: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  to: {
    type: String,
    required: true
  },
  file: {
    type: mongoose.Types.ObjectId,
    ref: "File",
    required: true
  }
},{timestamps: true})

const ShareModel = model('Share', shareSchema)

module.exports = ShareModel