import { NextResponse } from 'next/server'
import { User } from '@/models/User'
import { connectDB } from '@/connectDB'
import { Todo } from '@/models/Todo'

connectDB()

export async function DELETE(request, { params }) {
  try {
    const token = params.token
    const deletedAccount = await User.findOneAndDelete({
      revokeAccountToken: token,
    })

    if (!deletedAccount) {
      throw new Error('Error 400', { cause: 'Invalid token' })
    }

    await Todo.deleteMany({ _id: { $in: deletedAccount.todos } })

    return NextResponse.json({
      message: 'Account revoked successfully',
      success: true,
      deletedAccountid: deletedAccount._id,
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
