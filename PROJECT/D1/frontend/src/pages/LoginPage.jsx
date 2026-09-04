import { useState } from 'react'
import { Link } from 'react-router-dom'
import SignInForm from '../components/SignInForm.jsx'
import SignUpForm from '../components/SignUpForm.jsx'

function LoginPage({ initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode)

  return (
    <div className="login-page">
      <h1>Welcome back</h1>
      <div className="auth-toggle">
        <button
          className={mode === 'signin' ? 'active' : ''}
          onClick={() => setMode('signin')}
        >
          Sign In
        </button>
        <button
          className={mode === 'signup' ? 'active' : ''}
          onClick={() => setMode('signup')}
        >
          Sign Up
        </button>
      </div>

      {mode === 'signin' ? <SignInForm /> : <SignUpForm />}

      <p className="muted">
        Just exploring? <Link to="/home">Continue to Home</Link>
      </p>
    </div>
  )
}

export default LoginPage
