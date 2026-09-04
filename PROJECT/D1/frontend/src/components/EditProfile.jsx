import { useState } from 'react'

function EditProfile({ user, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Name cannot be empty.')
      return
    }
    setError('')
    if (onSave) onSave({ ...user, ...form })
  }

  return (
    <form className="edit-profile" onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} />
      </label>
      <label>
        Bio
        <textarea name="bio" value={form.bio} onChange={handleChange} />
      </label>
      {error && <p className="field-error">{error}</p>}
      <div className="edit-post-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default EditProfile
