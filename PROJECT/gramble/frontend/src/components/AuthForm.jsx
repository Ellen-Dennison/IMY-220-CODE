import { useId, useState } from 'react'

// One form component driving both login and registration.
const FIELDS = 
{
  login: [
    { name: 'identifier', label: 'Username or email', type: 'text', autoComplete: 'username' },
    { name: 'password', label: 'Password', type: 'password', autoComplete: 'current-password' },
  ],
  register: [
    { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name' },
    { name: 'username', label: 'Username', type: 'text', autoComplete: 'username' },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
    { name: 'password', label: 'Password (8+ characters)', type: 'password', autoComplete: 'new-password' },
  ],
}

const COPY = 
{
  login: { title: 'Welcome back', action: 'Log in', switchText: 'New here?', switchTo: 'register', switchLabel: 'Create an account' },
  register: { title: 'Join Gramble', action: 'Sign up', switchText: 'Already have an account?', switchTo: 'login', switchLabel: 'Log in' },
}

export default function AuthForm({ mode, onSuccess, onSwitch, onClose }) 
{
  const uid = useId()
  const [values, setValues] = useState({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const copy = COPY[mode]

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value })

  async function handleSubmit(e) 
  {
    e.preventDefault()
    setError('')

    if (mode === 'register' && (values.password || '').length < 8) 
    {
      setError('Your password needs at least 8 characters.')
      return
    }

    setBusy(true)
    try 
    {
      const res = await fetch(`/api/auth/${mode}`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'That did not work. Check your details and try again.')
      onSuccess(data.user)
    } 
    catch (err) 
    {
      setError(
        err instanceof TypeError
          ? 'Cannot reach the server. Check that the backend is running and try again.'
          : err.message
      )
    } 
    finally { setBusy(false) }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-3xl border-[0.5rem] border-leaf bg-white p-6 text-ink"
    >
      <h2 className="mb-5 font-display text-3xl">{copy.title}</h2>

      {FIELDS[mode].map(({ name, label, type, autoComplete }) => (
        <div key={name} className="mb-4">
          <label htmlFor={`${uid}-${name}`} className="mb-1 block text-sm font-semibold">
            {label}
          </label>
          <input
            id={`${uid}-${name}`}
            name={name}
            type={type}
            autoComplete={autoComplete}
            required
            value={values[name] || ''}
            onChange={handleChange}
            className="w-full border-2 border-ink bg-white px-3 py-2 focus-visible:outline-azure"
          />
        </div>
      ))}

      {error && (
        <p role="alert" className="mb-4 border-2 border-hot bg-hot/10 px-3 py-2 text-sm font-semibold text-hot">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full cursor-pointer bg-azure px-6 py-3 text-lg font-semibold text-white hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
      >
        {busy ? 'Please wait…' : copy.action}
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span>
          {copy.switchText}{' '}
          <button type="button" onClick={() => onSwitch(copy.switchTo)} className="cursor-pointer font-semibold underline">
            {copy.switchLabel}
          </button>
        </span>
        <button type="button" onClick={onClose} className="cursor-pointer font-semibold underline">
          Back
        </button>
      </div>
    </form>
  )
}