import { User } from '@/models/User'
import { Todo } from '@/models/Todo'
import { NextResponse } from 'next/server'
import { getDataFromToken } from '@/getDataFromToken'

export async function PUT(request, { params }) {
  try {
    const todoId = params.id
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
