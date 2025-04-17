const ActivityModel = require("../model/activity.model")

const fetchActivity = async (req, res) => {
  try {
    const activity = await ActivityModel.find().populate('fileId').populate('shareId')
    
    res.status(200).json(activity)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

module.exports = {
  fetchActivity
}