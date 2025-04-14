const FileModel = require("../model/file.model");
const fs = require('fs')
const path = require('path')

const getType = (type) => {
  const ext = type.split('/').pop()
  if(ext === "x-msdownload")
    return 'application/exe'

  if(ext === "octet-stream")
    return 'application/msi'

  return type
}

//uploading file coding
const createFile = async (req, res) => {
  console.log(req.user)
  try {
    const {filename} = req.body
    const file = req.file;
    const payload = {
      user: req.user.id,
      path: (file.destination + file.filename),
      filename: filename,
      type: getType(file.mimetype),
      size: file.size,
    };

    const data = await FileModel.create(payload);
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const fetchFiles = async (req, res) => {
  try {
    const {limit} = req.query
    const file = await FileModel.find({user: req.user.id}).sort({createdAt: -1}).limit(limit)
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
    const ext = getType(file.type)
    if(!file)
      res.status(404).json({message: "File not found!"})
    
    const filePath = path.join(process.cwd(), file.path)

    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}.${ext.split('/').pop()}"`)

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
