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

export async function PUT(request) {
  try {
    const { todoId } = await request.json()
    const userId = getDataFromToken(request)
    const user = await User.findById(userId, { password: 0 })

    const isAuthorized = user.todos.includes(todoId)

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const todo = await Todo.findById(todoId)

    todo.done = !todo.done
    const updatedTodo = await todo.save()

    return NextResponse.json({ updatedTodo })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
