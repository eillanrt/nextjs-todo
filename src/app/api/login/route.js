import { User } from '@/models/User'
import { NextResponse } from 'next/server'
import { connectDB } from '@/connectDB'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

connectDB()

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      throw new Error('Error 400', { cause: 'Account does not exist' })
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    if (!passwordIsCorrect) {
      throw new Error('Error 400', { cause: 'Wrong password' })
    }

    const tokenData = {
      id: user._id,
    }

    const token = jwt.sign(tokenData, process.env.SECRET_TOKEN, {
      expiresIn: '1d',
    })

    const response = NextResponse.json({
      message: 'Login successfully',
      success: true,
    })

    response.cookies.set('token', token, { httpOnly: true })
    return response
  } catch (error) {
    // If error is from the user side
    const userErrorPattern = /^Error (4\d{2})/

    if (userErrorPattern.test(error.message)) {
      const errStatus = Number(error.message.match(userErrorPattern)[1])

      return NextResponse.json({ error: error.cause }, { status: errStatus })
    }

    return Response.json({ error: error.message }, { status: 500 })
  }
}
