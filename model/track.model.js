const { Schema, model, mongoose } = require("mongoose");

const trackSchema = new Schema(
  {
    token: { 
      type: String, 
      required: true, 
      unique: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    seenAt: { 
      type: Date 
    },
    file: { 
      type: mongoose.Types.ObjectId, 
      ref: "File" 
    },
  },
  { timestamps: true });

const TrackModel = model("Track", trackSchema);

module.exports = TrackModel;
