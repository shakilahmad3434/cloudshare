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

router.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "forgot-password.html"))
})

router.get('/reset-password', (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "reset-password.html"))
})

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "app/dashboard.html"))
})

router.get('/files', (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "app/files.html"))
})

router.get('/shared', (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "app/shared.html"))
})

router.get('/history', (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "app/history.html"))
})

router.get('/favorites', (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "app/favorites.html"))
})

module.exports = router;