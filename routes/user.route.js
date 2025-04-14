const express = require('express')
const {v4: uniqueID} = require('uuid')
const multer = require('multer')
const { signup, login } = require('../controller/user.controller')
const { createFile, fetchFiles, deleteFile, downloadFile } = require('../controller/file.controller')
const { fetchDashboard } = require('../controller/dashboard.controller')
const { verifyToken } = require('../controller/token.controller')
const { shareFile, fetchShared } = require('../controller/share.controller')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, 'uploads/')
  },
  filename: (req, file, next) => {
    const ext = file.originalname.split('.').pop()
    next(null, `${uniqueID()}.${ext}`)
  }
})
const upload = multer({storage: storage})

router.post('/signup', signup)
router.post('/login', login)
router.get('/file', AuthMiddleware, fetchFiles)
router.get('/file/download/:id', downloadFile)
router.get('/dashboard', AuthMiddleware, fetchDashboard)
router.get('/share', AuthMiddleware, fetchShared)
router.post('/file', AuthMiddleware, upload.single('file'), createFile)
router.post('/token/verify', verifyToken)
router.post('/share', AuthMiddleware, shareFile)
router.delete('/file/:id', AuthMiddleware, deleteFile)

module.exports = router
