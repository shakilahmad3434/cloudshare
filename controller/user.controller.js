const UserModel = require("../model/user.model");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const path = require('path')
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

    if(user.resetToken && new Date(user.resetTokenExpires).getTime() > Date.now())
      return res.status(200).json({message: "A password reset link has already been sent. Please check your email."});

    const token = crypto.randomBytes(32).toString('hex')
    const link = `${process.env.DOMAIN}/reset-password?token=${token}`
    
    user.resetToken = token
    user.resetTokenExpires = new Date(Date.now() + 3600000); 
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
    const {password, token} = req.body

    const user = await UserModel.findOne({resetToken: token})

    if(!user)
      return res.status(404).json({message: "Token invalid or expired"})

    if(!user.resetTokenExpires || new Date(user.resetTokenExpires).getTime() < Date.now())
      return res.status(404).json({message: "Reset link has expired. Please request a new one."})

    const isMatch = await bcrypt.compareSync(password, user.password)

    if(isMatch)
      return res.status(409).json({message: "You've entered your current password. Please choose a new password to continue."})

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
    const {destination, filename} = req.file;
    console.log(destination + filename)

    const user = await UserModel.findByIdAndUpdate(req.user.id, {image: (destination + filename)})

    if(!user)
      return res.status(401).json({message: "Invalid Request"})

    res.status(200).json({image: process.cwd()+user.image})
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

const fetchImage = async (req, res)=>{
    try {
        const {image} = await UserModel.findById(req.user.id)
        if(!image)
          return res.status(404).json({message: 'Image not found'})
        
        const file = path.join(process.cwd(), image)

        res.sendFile(file, (err)=>{
            if(err)
                res.status(404).json({message: 'Image not found'})
        })
    }
    catch(err)
    {
        res.status(500).json({message: err.message})
    } 
}

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateImage,
  fetchImage
}