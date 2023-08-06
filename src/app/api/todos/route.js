import { getUserIdFromToken } from '@/getUserIdFromToken'
import { User } from '@/models/User'
import { Todo } from '@/models/Todo'
import { NextResponse } from 'next/server'
import { connectDB } from '@/connectDB'

connectDB()

export async function GET(request) {
  try {
    const userId = getUserIdFromToken(request)

    const user = await User.findById(userId)
    const todos = await Todo.find({ _id: { $in: user.todos } })

    return NextResponse.json({ user, todos })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json()
    const userId = getUserIdFromToken(request)
    const newTodo = new Todo({ name })
    await newTodo.validate()
    const savedTodo = await newTodo.save()

    const updatedUser = await User.findByIdAndUpdate(userId, {
      $push: { todos: savedTodo._id },
    })
    return NextResponse.json(
      { message: 'Added todo successfully', savedTodo },
      { status: 201 }
    )
  } catch (error) {
    if (error._message === 'Todo validation failed') {
      return NextResponse.json(
        { error: 'Invalid Todo! Must be 1-30 characters only' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
