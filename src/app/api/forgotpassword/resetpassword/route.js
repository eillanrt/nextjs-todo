import { NextResponse } from 'next/server'
import { User } from '@/models/User'
import { connectDB } from '@/connectDB'
import bcrypt from 'bcryptjs'

connectDB()

export async function PATCH(request) {
  try {
    const { currentPassword, newPassword, token } = await request.json()

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      throw new Error('Error 400', {
        cause: 'Invalid token',
      })
    }

    if (currentPassword !== newPassword) {
      throw new Error('Error 400', {
        cause: 'Password mismatch',
      })
    }

    if (currentPassword.length < 8) {
      throw new Error('Error 400', {
        cause: 'Password must be at least 8 characters long',
      })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)

    user.forgotPasswordToken = undefined
    user.forgotPasswordTokenExpiry = undefined
    const updatedUser = await user.save()

    return NextResponse.json({
      message: 'Changed password successfully',
      success: true,
      updatedUserId: updatedUser._id,
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
