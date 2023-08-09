import { NextResponse } from 'next/server'
import { User } from '@/models/User'
import { generateUUID } from '@/generateUUID'
import { connectDB } from '@/connectDB'
import { sendMail } from '@/mailer'
import { forgotPasswordEmailBody } from '@/emailBody'
import isEmail from 'validator/lib/isEmail'

connectDB()

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!isEmail(email)) {
      throw new Error('Error 400', { cause: 'Not a valid email address' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })

    if (!user) {
      throw new Error('Error 404', { cause: 'Account does not exists' })
    }

    let willUpdate = true // We shall only update when we generate new token

    if (
      user.forgotPasswordToken !== undefined &&
      user.forgotPasswordTokenExpiry !== undefined
    ) {
      if (user.forgotPasswordTokenExpiry > Date.now()) {
        willUpdate = false
      }
    }

    if (!willUpdate) {
      return NextResponse.json({
        message: 'Generated forgot password token successfully',
        didSendNewEmail: false,
        success: true,
      })
    }

    user.forgotPasswordToken = generateUUID()
    user.forgotPasswordTokenExpiry = Date.now() + 900_000
    const updatedUser = await user.save()
    const emailBody = await forgotPasswordEmailBody(updatedUser)

    await sendMail(
      {
        sender: process.env.EMAIL_USER,
        recipient: updatedUser.email,
        subject: 'RESET PASSWORD',
        body: emailBody,
      },
      { useHTMLBody: true }
    )

    return NextResponse.json({
      message: 'Generated forgot password token successfully',
      didSendNewEmail: true,
      success: true,
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
