import express from 'express'
import cors from 'cors'
import connectDB from './db/connect.js'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Connect to MongoDB before accepting requests that need it.
connectDB()

app.use('/api', authRoutes)
app.use('/api/posts', postRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'D2 backend is running' })
})

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`)
})
