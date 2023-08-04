import { NextResponse } from 'next/server'
import { getUserIdFromToken } from '@/getUserIdFromToken'
import { Todo } from '@/models/Todo'
import { User } from '@/models/User'

export async function DELETE(request, { params }) {
  try {
    const todoId = params.id
    const userId = getUserIdFromToken(request)

    const user = await User.findById(userId, { password: 0 })
    const isAuthorized = user.todos.includes(todoId)

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Not Authorized' }, { status: 401 })
    }

    const deletedTodo = await Todo.findByIdAndDelete(todoId)
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $pull: { todos: deletedTodo._id },
    })

    return NextResponse.json({ message: 'Deleted successfully', deletedTodo })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
