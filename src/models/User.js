import mongoose, { Schema } from 'mongoose'
import isEmail from 'validator/lib/isEmail'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      maxLength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      validate: [isEmail, 'Please provide a valid email address'],
      lowercase: true,
      unique: true,
      trim: true,
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
    revokeAccountToken: String,
    revokeAccountTokenExpiry: Date,
  },
  { timestamps: true }
)

export const User =
  mongoose.models.User || mongoose.model('User', userSchema, 'users')
