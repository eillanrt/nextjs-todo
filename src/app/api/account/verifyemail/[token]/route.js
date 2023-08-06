import { NextResponse } from 'next/server'
import { User } from '@/models/User'
import { getUserIdFromToken } from '@/getUserIdFromToken'

export async function PATCH(request, { params }) {
  try {
    // verify email token
    const token = params.token

    const tokenUser = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    })

    if (!tokenUser) {
      throw new Error('Error 400', { cause: 'Invalid token' })
    }

    // is authorized (the token matches with the verify email token of the logged in user)
    const userId = getUserIdFromToken(request)
    const user = await User.findById(userId)

    if (user._id !== tokenUser._id) {
      throw new Error('Error 401', { cause: 'Not authorized' })
    }

    user.isVerified = true
    const verifiedUser = await user.save()

    return NextResponse.json({
      message: 'User successfully verified',
      success: true,
      verifiedUser,
    })
  } catch (error) {
    console.log(error)
    // If error is from the user side
    const userErrorPattern = /^Error (4\d{2})/

    if (userErrorPattern.test(error.message)) {
      const errStatus = Number(error.message.match(userErrorPattern)[1])

      return NextResponse.json({ error: error.cause }, { status: errStatus })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
