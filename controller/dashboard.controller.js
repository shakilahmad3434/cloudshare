const FileModel = require('../model/file.model')

const fetchDashboard = async (req, res) => {
  try {

    const reports = await FileModel.aggregate([
      {
        $group: {
          _id: "$type",
          total: {$sum: 1}
        }
      },
      {
        $addFields: {
          type: '$_id'
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ])

    res.status(200).json(reports)
    
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

module.exports = {
  fetchDashboard
}