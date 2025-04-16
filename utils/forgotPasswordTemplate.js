const forgotPasswordTemplate = (link) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - CloudShare</title>
</head>
<body style="margin:0; padding:0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f9fafb; color:#1f2937;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color:#ffffff; padding: 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header with Logo Banner -->
          <tr>
            <td style="background-color: #3b82f6; padding: 24px 0; text-align: center;">
              <h1 style="color:#ffffff; margin:0; font-size: 28px; font-weight: 700;">CloudShare</h1>
              <p style="margin: 6px 0 0; color:#e0f2fe; font-size: 14px;">Secure file management made simple</p>
            </td>
          </tr>
          
          <!-- Email Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color:#1f2937; margin-top: 0; margin-bottom: 16px; font-size: 22px; font-weight: 600;">Password Reset Request</h2>
              
              <p style="font-size:16px; color:#4b5563; line-height:1.6; margin-bottom: 24px;">
                We received a request to reset your password. To create a new password for your CloudShare account, click the button below:
              </p>
              
              <!-- Action Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${link}" 
                       style="display:inline-block; padding:14px 32px; background-color:#3b82f6; 
                       color:#ffffff; text-decoration:none; font-size:16px; font-weight:600; 
                       border-radius:6px; transition: all 0.2s ease;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="font-size:15px; color:#6b7280; margin-bottom: 20px;">
                This link will expire in 24 hours. If you didn't request a password reset, you can safely ignore this email.
              </p>
              
              <div style="padding: 20px; background-color:#f3f4f6; border-radius: 8px; margin-top: 30px;">
                <p style="font-size:14px; color:#4b5563; margin: 0 0 8px 0;">
                  <strong>For security reasons:</strong>
                </p>
                <ul style="font-size:14px; color:#4b5563; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 4px;">This link can be used only once</li>
                  <li style="margin-bottom: 4px;">Never share this email with anyone</li>
                  <li>We'll never ask for your password in an email</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Help Section -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <p style="font-size:14px; color:#6b7280; margin-bottom: 6px;">
                Need help? <a href="http://localhost:8080/help" style="color:#3b82f6; text-decoration:none;">Contact our support team</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f3f4f6; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="font-size:13px; color:#6b7280; margin: 0 0 8px 0;">
                © 2025 CloudShare. All rights reserved.
              </p>
              <p style="font-size:12px; color:#9ca3af; margin: 0;">
                Brookfield, Bengaluru, KA 560037
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

module.exports = forgotPasswordTemplate