const ActivityModel = require("../model/activity.model")

const fetchActivity = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [activities, total, uploads, downloads] = await Promise.all([
      ActivityModel.find()
        .populate('fileId')
        .populate('shareId')
        .sort({ createdAt: -1 }) // Latest first
        .skip(skip)
        .limit(limit),
      
      ActivityModel.countDocuments(), // Total count
      ActivityModel.countDocuments({ action: 'upload' }),
      ActivityModel.countDocuments({ action: 'download' })
    ]);
    
    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      totalUploads: uploads,
      totalDownloads: downloads,
      activities
    });

  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

module.exports = {
  fetchActivity
}