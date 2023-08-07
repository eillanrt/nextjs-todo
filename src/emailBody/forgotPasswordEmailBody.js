export function forgotPasswordEmailBody(user) {
  const link =
    process.env.BASE_URL + `/resetpassword?token=${user.forgotPasswordToken}`

  return `<!DOCTYPE html>
  <html>
  <head>
      <title>Password Reset</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
          }
          .logo {
              text-align: center;
          }
          .link {
              display: block;
              width: 100%;
              text-align: center;
              margin: 20px 0;
          }
          .footer {
              text-align: center;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="logo">
              <h1>Forgot Password</h1>
          </div>
          <p>Hello ${user.name}!</p>
          <p>We received a request to reset your password. Click the link below to reset your password: <br/> 
          Please note that the link is valid for only 15 minutes.</p>
          <a class="link" href="${link}">Reset Password</a>
          <p>If the link above doesn't work, try copy and pasting the link below in your browser<br/>
          ${link}
          </p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Best regards,<br>Your App Team</p>
          <div class="footer">
              <p>© 2023 Your App. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `
}
