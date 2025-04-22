const {Schema, model, mongoose} = require('mongoose')

const linkSchema = new Schema({
  file: {
    type: mongoose.Types.ObjectId,
    ref: "File",
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {timestamps: true})

const LinkModel = model('Link', linkSchema)

module.exports = LinkModel