import { getDataFromToken } from '@/getDataFromToken'
import { User } from '@/models/User'
import { Todo } from '@/models/Todo'
import { NextResponse } from 'next/server'
import { connectDB } from '@/connectDB'

connectDB()

export async function GET(request) {
  try {
    const userId = getDataFromToken(request)

    const user = await User.findById(userId, { password: 0 })
    const todos = await Todo.find({ _id: { $in: user.todos } })

    return NextResponse.json({ user, todos })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json()
    const userId = getDataFromToken(request)
    const newTodo = new Todo({ name })
    const savedTodo = await newTodo.save()

    const updatedUser = await User.findByIdAndUpdate(userId, {
      $push: { todos: savedTodo._id },
    })
    return NextResponse.json(
      { message: 'Added todo successfully', savedTodo },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
