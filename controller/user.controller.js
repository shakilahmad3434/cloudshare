const UserModel = require("../model/user.model");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
      id: user._id
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'})

    res.status(200).json({message: "Login Success!", token: token})
    
  } catch (error) {
    res.status(500).json({message: error.message})
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
  updateImage
}