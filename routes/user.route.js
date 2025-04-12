const express = require('express')
const {v4: uniqueID} = require('uuid')
const multer = require('multer')
const { signup, login } = require('../controller/user.controller')
const { createFile, fetchFiles, deleteFile, downloadFile } = require('../controller/file.controller')
const { fetchDashboard } = require('../controller/dashboard.controller')
const { verifyToken } = require('../controller/token.controller')
const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, 'files/')
  },
  filename: (req, file, next) => {
    const ext = file.originalname.split('.').pop()
    next(null, `${uniqueID()}.${ext}`)
  }
})
const upload = multer({storage: storage})

router.get('/file', fetchFiles)
router.get('/file/download/:id', downloadFile)
router.get('/dashboard', fetchDashboard)
router.post('/signup', signup)
router.post('/login', login)
router.post('/file', upload.single('file'), createFile)
router.post('/token/verify', verifyToken)
router.delete('/file/:id', deleteFile)

module.exports = router
