import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/api', authRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'D1 backend is running' })
})

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`)
})
