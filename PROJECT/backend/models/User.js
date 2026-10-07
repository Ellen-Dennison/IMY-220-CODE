import mongoose from 'mongoose'

// Minimal for now — Part 5/6 (profile, friend requests) will extend this
// with friends, friendRequests, avatar, etc.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
