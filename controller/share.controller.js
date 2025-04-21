const ActivityModel = require("../model/activity.model");
const ShareModel = require("../model/share.model");
const nodemailer = require('nodemailer');
const { getEmailTemplate } = require("../utils/getEmailTemplate");

const conn = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
})

const shareFile = async (req, res) => {
  try {
    const {email, fileId, message} = req.body
    const link = `${process.env.DOMAIN}/api/file/download/${fileId}`

    const options = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'CloudShare - New File Received',
      html: getEmailTemplate(link, req.user.fullname, message)
    }

    const payload = {
        user: req.user.id,
        receiverEmail: email,
        file: fileId
    }

    const share = await ShareModel.create(payload)

    const activityPayload = {
        user: req.user.id,
        action: 'share',
        fileId: fileId,
        shareId: share._id,
      }

    await Promise.all([
        conn.sendMail(options),
        ActivityModel.create(activityPayload)
    ])

    res.status(200).json({message: "Email Sent!"})
    
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

const fetchShared = async (req, res) =>{
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const total = await ShareModel.countDocuments({user:req.user.id})
        const history = await ShareModel.find({user: req.user.id}).skip(skip).limit(limit).sort({createdAt: -1}).populate('file')

        res.status(200).json({history, currentPage: page, totalPages: Math.ceil(total / limit), total})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

module.exports = {
  shareFile,
  fetchShared
}