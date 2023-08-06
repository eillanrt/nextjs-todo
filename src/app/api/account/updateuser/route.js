import { getUserIdFromToken } from '@/getUserIdFromToken'
import { NextResponse } from 'next/server'
import { User } from '@/models/User'
import isEmail from 'validator/lib/isEmail'
import bcrypt from 'bcryptjs'

export async function PATCH(request) {
  try {
    const { name, email, password, newPassword, confirmNewPassword } =
      await request.json()

    const userId = getUserIdFromToken(request)
    const user = await User.findById(userId)

    if (name !== user.name) {
      user.name = name
    }

    if (email.toLowerCase().trim() !== user.email) {
      if (!isEmail(email)) {
        throw new Error('Error 400', { cause: 'Not a valid email address' })
      }

      const emailIsTaken = await User.findOne({
        email: email.toLowerCase().trim(),
      })

      if (emailIsTaken) {
        throw new Error('Error 400', { cause: 'Email address alreay taken' })
      }
      user.email = email
    }

    if (password !== '') {
      const passwordIsCorrect = await bcrypt.compare(password, user.password)

      if (!passwordIsCorrect) {
        throw new Error('Error 401', { cause: 'Wrong password' })
      }

      if (newPassword !== confirmNewPassword) {
        throw new Error('Error 401', { cause: 'Password mismatch' })
      }

      if (newPassword.length < 8) {
        throw new Error('Error 400', {
          cause: 'Password must at least 8 characters long',
        })
      }

      const salt = await bcrypt.genSalt(10)
      const updatedPassword = await bcrypt.hash(newPassword, salt)

      user.password = updatedPassword
    }

    const updatedUser = await user.save()

    return NextResponse.json({
      message: 'Changes saved',
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

    return NextResponse.json({ error: error.message })
  }
}
