const ActivityModel = require("../model/activity.model");
const ShareModel = require("../model/share.model");
const nodemailer = require('nodemailer');
const crypto = require('crypto')
const { getEmailTemplate } = require("../utils/getEmailTemplate");
const LinkModel = require("../model/link.model");
const TrackModel = require("../model/track.model");

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
    const token = crypto.randomBytes(16).toString('hex')
    const expiresAt = new Date(Date.now() + 3600000)
    const readableExpiry = expiresAt.toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const link = `${process.env.DOMAIN}/api/track/email-open/${token}`

    const options = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'CloudShare - New File Received',
      html: getEmailTemplate(link, req.user.fullname, message, readableExpiry, token)
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

    const shareLinkPayload = {
      file: fileId,
      token,
      email,
      expiresAt
    }

    const trackPayload = {
      token,
      email,
      file: fileId,
    };
    

    await Promise.all([
        conn.sendMail(options),
        ActivityModel.create(activityPayload),
        LinkModel.create(shareLinkPayload),
        TrackModel.create(trackPayload)
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

const emailTrack = async (req, res) => {
  try {
    const {token} = req. params
    const track = await TrackModel.findOne({token})

    if(track && !track.seenAt){
      track.seenAt = new Date();
      await track.save()
    }

  res.redirect(`${process.env.DOMAIN}/api/shared/download/${token}`);

  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

module.exports = {
  shareFile,
  fetchShared,
  emailTrack
}