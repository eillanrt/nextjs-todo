import mongoose, { Schema } from 'mongoose'

const todoSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 30,
  },
  done: {
    type: Boolean,
    default: false,
    required: true,
  },
})

export const Todo =
  mongoose.models.Todo || mongoose.model('Todo', todoSchema, 'todos')
