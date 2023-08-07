import mongoose from 'mongoose'

export async function connectDB() {
  try {
    mongoose.connect(process.env.MONGODB_URI)

    const connection = mongoose.connection

    connection.on('connected', () => {
      console.log('Connected to mongodb successsfully')
    })

    connection.on('error', () => {
      process.exit(1)
    })
  } catch (err) {
    console.error(err)
  }
}
