const ActivityModel = require("../model/activity.model");
const ShareModel = require("../model/share.model");
const nodemailer = require('nodemailer')

const conn = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
})

const getEmailTemplate = (link) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CloudShare - Shared File</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f7fa; color: #333333;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-spacing: 0;">
        <tr>
            <td style="padding: 20px 0; text-align: center; background-color: #2c82c9;">
                <img src="/api/placeholder/150/50" alt="CloudShare Logo" style="height: 50px; max-width: 150px;" />
                <p style="margin: 5px 0 0; color: #ffffff; font-size: 14px; font-style: italic;">India's best file sharing platform</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">
                <h1 style="margin: 0 0 20px; font-size: 24px; color: #2c82c9;">File Shared With You</h1>
                <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">Hello [RECIPIENT_NAME],</p>
                <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">[SENDER_NAME] has shared a file with you via CloudShare.</p>
                
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9f9f9; border-radius: 5px; margin: 30px 0;">
                    <tr>
                        <td style="padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="width: 40px; vertical-align: top;">
                                        <img src="/api/placeholder/32/32" alt="File Icon" style="width: 32px; height: 32px;" />
                                    </td>
                                    <td style="vertical-align: top; padding-left: 15px;">
                                        <p style="margin: 0 0 5px; font-size: 16px; font-weight: bold;">[FILE_NAME]</p>
                                        <p style="margin: 0 0 5px; font-size: 14px; color: #777777;">[FILE_SIZE]</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">
                    <strong>Message from [SENDER_NAME]:</strong> [OPTIONAL_MESSAGE]
                </p>
                
                <p style="margin: 0 0 5px; font-size: 14px; color: #e74c3c;">
                    <strong>⏰ This link will expire on [EXPIRATION_DATE]</strong>
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${link}" style="display: inline-block; padding: 12px 30px; background-color: #2c82c9; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 4px;">Download File</a>
                </div>
                
                <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.5; color: #777777;">
                    If you have trouble accessing the file, copy and paste this link into your browser:<br>
                    <a href="${link}" style="color: #2c82c9; word-break: break-all;">${link}</a>
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px 30px; background-color: #f4f7fa; text-align: center;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="padding: 0 0 20px; text-align: center;">
                            <img src="/api/placeholder/120/40" alt="CloudShare" style="height: 40px; max-width: 120px;" />
                            <p style="margin: 5px 0 0; color: #666666; font-size: 12px; font-style: italic;">India's best file sharing platform</p>
                        </td>
                    </tr>
                </table>
                <p style="margin: 0 0 10px; font-size: 14px; color: #777777;">
                    This is an automated message from CloudShare. Please do not reply to this email.
                </p>
                <p style="margin: 0; font-size: 12px; color: #999999;">
                    &copy; 2025 CloudShare. All rights reserved.
                </p>
                <p style="margin: 10px 0 0; font-size: 12px;">
                    <a href="[UNSUBSCRIBE_LINK]" style="color: #999999; text-decoration: underline;">Unsubscribe</a> |
                    <a href="[PRIVACY_POLICY_LINK]" style="color: #999999; text-decoration: underline;">Privacy Policy</a> |
                    <a href="[TERMS_LINK]" style="color: #999999; text-decoration: underline;">Terms of Service</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`
}

const shareFile = async (req, res) => {
  try {
    const {email, fileId} = req.body
    const link = `${process.env.DOMAIN}/api/file/download/${fileId}`
    console.log(link)
    const options = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'CloudShare - New File Received',
      html: getEmailTemplate(link)
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
        await ActivityModel.create(activityPayload)
    ])

    res.status(200).json({message: "Email Sent!"})
    
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

const fetchShared = async (req, res) =>{
    try {
        const {limit} = req.query
        const history = await ShareModel.find({user: req.user.id}).populate('file').sort({createdAt: -1}).limit(limit)
        res.status(200).json(history)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

module.exports = {
  shareFile,
  fetchShared
}