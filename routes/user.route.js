const express = require('express')
const {v4: uniqueID} = require('uuid')
const multer = require('multer')
const { signup, login, updateImage, forgotPassword, resetPassword } = require('../controller/user.controller')
const { createFile, fetchFiles, deleteFile, downloadFile, fetchFileDetails, sharedDownloadFile } = require('../controller/file.controller')
const { fetchDashboard } = require('../controller/dashboard.controller')
const { verifyToken } = require('../controller/token.controller')
const { shareFile, fetchShared, emailTrack } = require('../controller/share.controller')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const { fetchActivity } = require('../controller/activity.controller')
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
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/profile-picture', AuthMiddleware, upload.single('picture'), updateImage)
router.get('/file', AuthMiddleware, fetchFiles)
router.get('/file/download/:id', downloadFile)
router.get('/shared/download/:token', sharedDownloadFile)
router.get('/file-details', AuthMiddleware, fetchFileDetails)
router.get('/dashboard', AuthMiddleware, fetchDashboard)
router.get('/share', AuthMiddleware, fetchShared)
router.get('/activity', AuthMiddleware, fetchActivity)
router.get('/track/email-open/:token', emailTrack)
router.post('/file', AuthMiddleware, upload.single('file'), createFile)
router.post('/token/verify', verifyToken)
router.post('/share', AuthMiddleware, shareFile)
router.delete('/file/:id', AuthMiddleware, deleteFile)


module.exports = router
