const UserModel = require("../model/user.model");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const forgotPasswordTemplete = require('../utils/forgotPasswordTemplate')


const conn = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
})


const signup = async (req, res) => {
  try {
    await UserModel.create(req.body)
    res.status(200).json({message: "Account created successfully! Redirecting..."})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const login = async (req, res) => {
  try {
    const {email, password} = req.body
    const user = await UserModel.findOne({email: email})

    if(!user)
      return res.status(404).json({message: "User doesn't exits!"})

    const isLogin = bcrypt.compareSync(password, user.password)

    if(!isLogin)
      return res.status(401).json({message: "Password Didn't Match!"})

    const payload = {
      fullname: user.fullname,
      mobile: user.mobile,
      email: user.email,
      id: user._id,
      storageUsed: user.storageUsed,
      storageLimit: user.storageLimit
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'})

    res.status(200).json({message: "Login Success!", token: token})
    
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

const forgotPassword = async (req, res) => {
  try {
    const {email} = req.body
    const user = await UserModel.findOne({email})

    if(!user)
      return res.status(404).json({message: "User not found! Please check the email and try again."})

    const token = crypto.randomBytes(32).toString('hex')
    const link = `${process.env.DOMAIN}/api/reset-password?token=${token}`
    
    user.resetToken = token
    user.resetTokenExpires = Date.now() 
    await user.save()

    const options = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Reset Your CloudShare Password",
      html: forgotPasswordTemplete(link)
    }

    await conn.sendMail(options)


    res.status(200).json({message: "Check your inbox for a link to reset your password."})

  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

const resetPassword = async(req, res) => {
  try {
    const {token} = req.query
    const {password} = req.body

    const user = await UserModel.findOne({resetToken: token})

    if(!user)
      return res.status(404).json({message: "Token invalid or expired"})

    user.password = password
    user.resetToken = undefined
    user.resetTokenExpires = undefined
    await user.save()

    res.status(201).json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

const updateImage = async (req, res) => {
  try {
    const {destination, filename} = req.file
    const user = await UserModel.findByIdAndUpdate(req.user.id, {image: (destination + filename)})

    if(!user)
      return res.status(401).json({message: "Invalid Request"})

    res.status(200).json({image: user.image})
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateImage
}