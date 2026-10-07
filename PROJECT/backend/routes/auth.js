import { Router } from 'express'

const router = Router()

// TODO (next step): replace with real MongoDB-backed signin/signup using the
// User model — check credentials / hash+store password instead of returning
// dummy data. Kept as-is for now so the server still boots while you wire up
// posts first.

router.post('/signin', (req, res) => {
  const { email } = req.body || {}
  res.status(200).json({
    success: true,
    message: 'Signed in successfully (dummy data — replace next)',
    user: { id: 'u1', name: 'Alex Morgan', email: email || 'alex@example.com' },
  })
})

router.post('/signup', (req, res) => {
  const { name, email } = req.body || {}
  res.status(201).json({
    success: true,
    message: 'Signed up successfully (dummy data — replace next)',
    user: { id: `u${Date.now()}`, name: name || 'New User', email: email || 'new@example.com' },
  })
})

export default router
