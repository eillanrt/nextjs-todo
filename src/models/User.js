import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  todos: {
    type: [mongoose.Types.ObjectId],
    required: true,
    default: [],
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
})

export const User =
  mongoose.models.User || mongoose.model('User', userSchema, 'users')
