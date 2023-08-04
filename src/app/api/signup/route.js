import { User } from '@/models/User'
import { NextResponse } from 'next/server'
import { connectDB } from '@/connectDB'
import isEmail from 'validator/lib/isEmail'
import bcrypt from 'bcryptjs'

connectDB()

export async function POST(request) {
  try {
    const { name, email, password, confirmPassword } = await request.json()

    if (password !== confirmPassword) {
      throw new Error('Error 400', { cause: 'Password mismatch' })
    }

    if (password.length < 8) {
      throw new Error('Error 400', {
        cause: 'Password must be at least 8 character long',
      })
    }

    if (!isEmail(email)) {
      throw new Error('Error 400', { cause: 'Not a valid email address' })
    }

    if (name.length > 20 || name.length < 1) {
      throw new Error('Error 400', {
        cause: 'Name must be 1-20 characers only',
      })
    }

    // check if user already exists
    const user = await User.findOne({ email: email.toLowerCase() })

    if (user) {
      throw new Error('Error 400', { cause: 'Email address already taken' })
    }

    // Create user
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    })

    await newUser.validate()

    const savedUser = await newUser.save()

    return NextResponse.json(
      {
        message: 'User created',
        success: true,
      },
      { status: 201 }
    )
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
