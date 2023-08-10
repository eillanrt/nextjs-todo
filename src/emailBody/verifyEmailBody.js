export function verifyEmailBody({ name, verifyToken }) {
  const link = process.env.BASE_URL + `/verifyemail?token=${verifyToken}`

  return `
  <div style="font-family: Arial, sans-serif; background-color: #f1f1f1;">
    <h1 style="color: #4285f4;">Hello, ${name}</h1>
    <div style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); max-width: 400px; margin: 20px auto;">
        <p style="color: #333;">Note that the link below is only valid for 15 mins</p>
        <a style="display: inline-block; padding: 10px 20px; background-color: #4285f4; color: #fff; text-decoration: none; border-radius: 3px;" href="${link}">Verify Email</a>
    </div>
    <p>If the link above doesn't work, try copy and pasting the link below in your browser to verify your email:</p>
    <p style="margin-top: 10px; color: #999;">Note that the link is only valid for 15 minutes</p>
    <p style="word-break: break-all;">${link}</p>
    <div style="text-align: center; margin-top: 20px">
      <p>© ${new Date().getFullYear()} Allan Robert Tan. All rights reserved.</p>
  </div>
</div>

    `
}
