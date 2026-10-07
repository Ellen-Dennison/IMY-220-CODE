import mongoose from 'mongoose'

// Connects once and reuses the connection across the app.
// Set MONGODB_URI in your environment (docker-compose.yml or a .env file).
export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error(
      'MONGODB_URI is not set. Add it to your environment (see .env.example).'
    )
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

export default connectDB
