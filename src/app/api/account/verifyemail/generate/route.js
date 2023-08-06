import { NextResponse } from 'next/server'
import { User } from '@/models/User'
import { getUserIdFromToken } from '@/getUserIdFromToken'
import { generateUUID } from '@/generateUUID'
import { sendMail } from '@/mailer'

export async function POST(request) {
  try {
    const userId = getUserIdFromToken(request)

    const user = await User.findById(userId)

    if (!user) {
      throw new Error('Error 404', { cause: 'User not found' })
    }

    if (user.isVerified) {
      throw new Error('Error 400', { cause: 'User is already verified' })
    }

    if (
      user.verifyToken !== undefined &&
      user.verifyTokenExpiry !== undefined
    ) {
      if (user.verifyTokenExpiry > Date.now()) {
        throw new Error('Error 400', {
          cause: 'You still have an active token',
        })
      }
    }

    user.verifyToken = generateUUID()
    // verifyTokenExpiry is 15 minutes upon creation
    user.verifyTokenExpiry = Date.now() + 900_000

    const updatedUser = await user.save()
    sendMail(
      {
        sender: process.env.EMAIL_USER,
        recipient: user.email,
        subject: 'VERIFY YOUR EMAIL',
        body: `<!DOCTYPE html>
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
            <a href="${process.env.DOMAIN}/verifyemail?token=${user.verifyToken}">Verify Email Link</a>
          </div>
          <p>If the link above doesn't work, try copy and pasting the link below in your browser to verify your email:</p>
          <p class="expiry-note">Note that the link is only valid for 15 minutes</p>
          <p class="expiry-link">${process.env.DOMAIN}/verifyemail?token=${user.verifyToken}</p>
        </body>
        </html>`,
      },
      { useHTMLBody: true }
    )

    return NextResponse.json({
      message: 'Generated token successfully',
      success: true,
      updatedUser,
    })
  } catch (error) {
    // If error is from the user side
    const userErrorPattern = /^Error (4\d{2})/

    if (userErrorPattern.test(error.message)) {
      const errStatus = Number(error.message.match(userErrorPattern)[1])

      return NextResponse.json({ error: error.cause }, { status: errStatus })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
