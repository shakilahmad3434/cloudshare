const express = require('express')
const path = require('path')
const router = express.Router()

router.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "index.html"))
})

router.get('/signup', (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "signup.html"))
})

router.get('/login', (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "login.html"))
})

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "app/dashboard.html"))
})

router.get('/files', (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "app/files.html"))
})

router.get('/history', (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "app/history.html"))
})

module.exports = router;