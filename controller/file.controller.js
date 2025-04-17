const FileModel = require("../model/file.model");
const fs = require('fs');
const path = require('path');
const { getAccurateExtension } = require('../utils/getAccurateExtension');
const { default: mongoose } = require("mongoose");
const ActivityModel = require("../model/activity.model");

//uploading file coding
const createFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { filename } = req.body;
    const file = req.file;

    const displayFilename = filename || file.originalname || 'unnamed_file';
    
    const extension = getAccurateExtension(file.mimetype, file.originalname);
    
    const payload = {
      user: req.user.id,
      filename: displayFilename,
      path: (file.destination + file.filename),
      type: file.mimetype,
      extension: extension,
      size: file.size,
    };

    const data = await FileModel.create(payload);
    console.log(data)
    // Log the Delete activity
    try {
      await ActivityModel.create({
        user: req.user.id,
        action: 'upload',
        fileId: data._id,
      });
    } catch (logError) {
      console.error("Error logging activity:", logError);
    }

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

const fetchFiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const userId = new mongoose.Types.ObjectId(req.user.id)

    const result = await FileModel.aggregate([
      { $match: { user: userId } },
      {
        $facet: {
          files: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
          ],
          total: [
            { $count: "count" }
          ]
        }
      }
    ]);

    const files = result[0].files;
    const total = result[0].total[0]?.count || 0;

    res.status(200).json({ files, total, page, totalPages: Math.ceil(total / limit) });

  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const deleteFile = async (req, res) => {
  try {
    const {id} = req.params
    const file = await FileModel.findByIdAndDelete(id)

    if(!file)
      return res.status(404).json({message: "File doesn't exits"})

    if(file.path && fs.existsSync(file.path)){
      fs.unlinkSync(file.path)
    }

    // Log the Delete activity
    try {
      await ActivityModel.create({
        user: req.user.id,
        action: 'delete',
        filename: `${file.filename}.${file.extension}`,
      });
    } catch (logError) {
      console.error("Error logging activity:", logError);
    }
    console.log(file)
    res.status(200).json({message: `File deleted successfully`})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const downloadFile = async (req, res) => {
  try {
    const {id} = req.params
    const file = await FileModel.findById(id)
    if(!file)
      return res.status(404).json({message: "File not found!"})
    
    const filePath = path.join(process.cwd(), file.path)

    if(!fs.existsSync(filePath))
      return res.status(404).json({message: "File not found on server!"})

    // Log the download activity
    try {
      await ActivityModel.create({
        user: req.user.id, // Make sure your auth middleware adds user to req
        action: 'download',
        fileId: file._id,
      });
    } catch (logError) {
      // Just log the error but don't stop the download
      console.error("Error logging activity:", logError);
    }

    res.setHeader('Content-Type', file.type || 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.filename)}.${file.extension}"`)

    const stats = fs.statSync(filePath)
    res.setHeader('Content-Length', stats.size)

    const fileStream = fs.createReadStream(filePath)

    fileStream.on('error', (err) => {
      console.log('File stream error:', err)
      if(!res.headersSent) {
        return res.status(500).json({message: "Error streaming file"})
      }
    })

    // Send the file as a stream
    fileStream.pipe(res)

  } catch (error) {
    console.error("Download error:", error)
    if(!res.headersSent) {
      return res.status(500).json({message: error.message})
    }
  }
}

const fetchFileDetails = async (req, res) => {
  try {
    const file = await FileModel.find({user: req.user.id})

    const payload = {
      file,
      MAX_STORAGE_PER_USER: process.env.MAX_STORAGE_PER_USER
    }

    res.status(200).json(payload)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

module.exports = {
  createFile,
  fetchFiles,
  deleteFile,
  downloadFile,
  fetchFileDetails
};
