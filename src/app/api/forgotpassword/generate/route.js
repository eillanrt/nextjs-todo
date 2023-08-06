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
    const user = await User.findOne({ email: email.toLowerCase().toString() })

    if (!user) {
      throw new Error('Error 404', { cause: 'Account does not exists' })
    }

    user.forgotPasswordToken = generateUUID()
    // token expires 15 minutes upon creation
    user.forgotPasswordTokenExpiry = Date.now() + 900_000
    const updatedUser = await user.save()

    sendMail(
      {
        sender: process.env.EMAIL_USER,
        recipient: updatedUser.email,
        subject: 'RESET PASSWORD',
        body: forgotPasswordEmailBody(updatedUser),
      },
      { useHTMLBody: true }
    )

    return NextResponse.json({
      message: 'Generated forgot password token successfully',
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
