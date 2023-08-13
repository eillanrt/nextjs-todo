import { getUserIdFromToken } from '@/getUserIdFromToken'
import { NextResponse } from 'next/server'
import { User } from '@/models/User'
import { connectDB } from '@/connectDB'
import isEmail from 'validator/lib/isEmail'
import bcrypt from 'bcryptjs'
import { generateUUID } from '@/generateUUID'
import { sendMail } from '@/mailer'
import { accountCreatedEmailBody } from '@/emailBody/accountCreatedEmailBody'

connectDB()

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
      user.isVerified = false
      user.revokeAccountToken = generateUUID()

      await sendMail(
        {
          sender: process.env.EMAIL_FROM,
          recipient: user.email,
          subject: 'Account created using this email',
          body: accountCreatedEmailBody(user),
        },
        { useHTMLBody: true }
      )
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
      user.password = await bcrypt.hash(newPassword, salt)
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
