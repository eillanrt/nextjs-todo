import { User } from '@/models/User'
import { NextResponse } from 'next/server'
import { connectDB } from '@/connectDB'
import bcrypt from 'bcryptjs'

connectDB()

export async function POST(request) {
  try {
    const reqBody = await request.json()
    const { name, email, password } = reqBody

    // check if user already exists
    const user = await User.findOne({ email })
    if (user) {
      return NextResponse.json(
        {
          error: 'User already exists',
        },
        { status: 400 }
      )
    }
    // Create user
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    })
    const savedUser = await newUser.save()
    return NextResponse.json(
      {
        message: 'User created',
        data: savedUser,
      },
      { status: 201 }
    )
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
