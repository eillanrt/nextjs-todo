export function verifyEmailBody(user) {
  const link = process.env.BASE_URL + `/verifyemail?token=${user.verifyToken}`

  return `
  <div>
    <h1>Hello, ${user.name}</h1>
    <div class="link">
      <p>Note that the link below is only valid for 15 mins</p>
      <a href="${link}">Verify Email Link</a>
    </div>
    <p>If the link above doesn't work, try copy and pasting the link below in your browser to verify your email:</p>
    <p class="expiry-note">Note that the link is only valid for 15 minutes</p>
    <p class="expiry-link">${link}</p>
  </div>
    `
}
