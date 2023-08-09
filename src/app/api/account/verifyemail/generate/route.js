import { NextResponse } from 'next/server'
import { User } from '@/models/User'
import { getUserIdFromToken } from '@/getUserIdFromToken'
import { generateUUID } from '@/generateUUID'
import { connectDB } from '@/connectDB'
import { verifyEmailBody } from '@/emailBody'
import { sendMail } from '@/mailer'

connectDB()

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
    const emailBody = await verifyEmailBody(user)

    await sendMail(
      {
        sender: process.env.EMAIL_USER,
        recipient: user.email,
        subject: 'VERIFY YOUR EMAIL',
        body: emailBody,
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
