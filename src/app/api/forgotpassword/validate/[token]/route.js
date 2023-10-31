import { NextResponse } from 'next/server'
import { User } from '@/models/User'
import { connectDB } from '@/connectDB'

connectDB()

export async function GET(request, { params }) {
  try {
    const token = params.token

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      throw new Error('Error 401', { cause: 'Invalid token' })
    }

    return NextResponse.json({
      message: 'Token is valid',
      success: true,
      tokenIsValid: true,
      userId: user._id,
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
