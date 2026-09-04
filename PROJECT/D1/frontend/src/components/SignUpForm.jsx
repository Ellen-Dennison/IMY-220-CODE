import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignUpForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const navigate = useNavigate()

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required.'
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
    if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Passwords do not match.'
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
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setStatus('success')
      navigate('/home')
      console.log('Sign-up response:', data)
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h3>Sign Up</h3>
      <label>
        Name
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </label>
      {errors.name && <p className="field-error">{errors.name}</p>}

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

      <label>
        Confirm Password
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
        />
      </label>
      {errors.confirmPassword && (
        <p className="field-error">{errors.confirmPassword}</p>
      )}

      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Signing up...' : 'Sign Up'}
      </button>
      {status === 'error' && <p className="field-error">Sign up failed.</p>}
    </form>
  )
}

export default SignUpForm
