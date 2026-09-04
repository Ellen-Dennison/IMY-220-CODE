import { Router } from 'express'

const router = Router()

router.post('/signin', (req, res) => {
  const { email } = req.body || {}

  const dummyUser = {
    id: 'u1',
    name: 'Alex Morgan',
    email: email || 'alex@example.com',
    token: 'dummy-jwt-token-123',
  }

  res.status(200).json({
    success: true,
    message: 'Signed in successfully (dummy data)',
    user: dummyUser,
  })
})


router.post('/signup', (req, res) => {
  const { name, email } = req.body || {}

  const dummyUser = {
    id: `u${Date.now()}`,
    name: name || 'New User',
    email: email || 'newuser@example.com',
    token: 'dummy-jwt-token-456',
  }

  res.status(201).json({
    success: true,
    message: 'Signed up successfully (dummy data)',
    user: dummyUser,
  })
})

export default router
