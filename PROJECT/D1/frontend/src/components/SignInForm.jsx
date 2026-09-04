import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignInForm() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const navigate = useNavigate()

  const validate = () => {
    const next = {}
    if (!form.email.trim()) {
      next.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address.'
    }
    if (!form.password) {
      next.password = 'Password is required.'
    } else if (form.password.length < 6) {
      next.password = 'Password must be at least 6 characters.'
    }
    return next
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('loading')
    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setStatus('success')
      navigate('/home')
      console.log('Sign-in response:', data)
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h3>Sign In</h3>
      <label>
        Email
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </label>
      {errors.email && <p className="field-error">{errors.email}</p>}

      <label>
        Password
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
      </label>
      {errors.password && <p className="field-error">{errors.password}</p>}

      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Signing in...' : 'Sign In'}
      </button>
      {status === 'error' && <p className="field-error">Sign in failed.</p>}
    </form>
  )
}

export default SignInForm
