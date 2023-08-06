export function verifyEmailBody(user) {
  const link = process.env.DOMAIN + `/verifyemail?token=${user.verifyToken}`

  return `<!DOCTYPE html>
  <html>
  <head>
    <title>Email Verification</title>
    <style>
      /* Your CSS styles go here */
      body {
        font-family: Arial, sans-serif;
        background-color: #f1f1f1;
      }

      h1 {
        color: #4285f4;
      }

      .link {
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        margin: 20px auto;
      }

      .link p {
        color: #333;
      }

      .link a {
        display: inline-block;
        padding: 10px 20px;
        background-color: #4285f4;
        color: #fff;
        text-decoration: none;
        border-radius: 3px;
      }

      .link a:hover {
        background-color: #3367d6;
      }

      .expiry-note {
        margin-top: 10px;
        color: #999;
      }

      .expiry-link {
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <h1>Hello, ${user.name}</h1>
    <div class="link">
      <p>Note that the link below is only valid for 15 mins</p>
      <a href="${link}">Verify Email Link</a>
    </div>
    <p>If the link above doesn't work, try copy and pasting the link below in your browser to verify your email:</p>
    <p class="expiry-note">Note that the link is only valid for 15 minutes</p>
    <p class="expiry-link">${link}</p>
  </body>
  </html>`
}
