const FileModel = require("../model/file.model");
const fs = require('fs')
const path = require('path')

//uploading file coding
const createFile = async (req, res) => {
  try {
    const {filename} = req.body
    const file = req.file;
    const payload = {
      path: (file.destination + file.filename),
      filename: filename,
      type: file.mimetype.split("/")[0],
      size: file.size,
    };

    const newFile = await FileModel.create(payload);
    res.status(200).json(newFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const fetchFiles = async (req, res) => {
  try {
    const file = await FileModel.find()
    res.status(200).json(file)
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
      res.status(404).json({message: "File not found!"})

    const filePath = path.join(process.cwd(), file.path)

    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`)

    res.sendFile(filePath, (err) => {
      if(err)
        res.status(404).json({message: "File not found!"})
    })
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

module.exports = {
  createFile,
  fetchFiles,
  deleteFile,
  downloadFile
};
