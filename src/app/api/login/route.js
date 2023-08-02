import { User } from '@/models/User'
import { NextResponse } from 'next/server'
import { connectDB } from '@/connectDB'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

connectDB()

export async function POST(request) {
  const reqBody = await request.json()
  const { email, password } = reqBody

  const user = await User.findOne({ email })
  if (!user) {
    return NextResponse.json({ error: 'User does not exist' }, { status: 400 })
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password)

  if (!passwordIsCorrect) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 400 })
  }

  const tokenData = {
    id: user._id,
    name: user.name,
    email: user.email,
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
}
