const getEmailTemplate = (link, SENDER_NAME, OPTIONAL_MESSAGE, EXPIRATION_DATE = "23 Apr 2025") => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CloudShare - Shared File</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f7fa; color: #333333;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-spacing: 0; border-radius: 10px">
        <tr>
            <td style="padding: 20px 0; text-align: center; background-color: oklch(69.6% 0.17 162.48)">
                <h1 style="text-align: center; color: #fff;">CloudShare</h1>
                <p style="margin: 5px 0 0; color: #ffffff; font-size: 14px; font-style: italic;">India's best file sharing platform</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">
                <h1 style="margin: 0 0 20px; font-size: 24px; color: #2c82c9;">File Shared With You</h1>
                <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">${SENDER_NAME} has shared a file with you via CloudShare.</p>
                
                <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">
                    <strong>Message from ${SENDER_NAME}:</strong> ${OPTIONAL_MESSAGE}
                </p>
                
                <p style="margin: 0 0 5px; font-size: 14px; color: #e74c3c;">
                    <strong>⏰ This link will expire on ${EXPIRATION_DATE}</strong>
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
    </table>
</body>
</html>`
}

module.exports = {
  getEmailTemplate
}