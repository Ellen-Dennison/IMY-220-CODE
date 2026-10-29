import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreateAlbum() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) 
  {
    e.preventDefault()
    if (!name.trim()) return setError('Name is required')
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, description, hashtags })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      navigate(`/album/${data._id}`)
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  if (!open) 
  {
    return (
      <button onClick={() => setOpen(true)}
        className="bg-azure text-white font-bold px-4 py-2 border-2 border-ink">
        + New Album
      </button>
    )
  }

  return (
    <div className="bg-white border-4 border-ink p-6 rounded-lg text-ink">
      <h2 className="font-display text-2xl mb-3">Create Album</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Album name *"
          className="w-full border-2 border-ink p-2 font-mono" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description"
          className="w-full border-2 border-ink p-2 font-mono" rows={2} />
        <input value={hashtags} onChange={e => setHashtags(e.target.value)}
          placeholder="Hashtags (comma-separated)" className="w-full border-2 border-ink p-2 font-mono" />
        {error && <p className="text-hot font-bold">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={busy}
            className="bg-azure text-white font-bold px-4 py-2 border-2 border-ink disabled:opacity-50">
            {busy ? 'Creating…' : 'Create'}
          </button>
          <button type="button" onClick={() => { setOpen(false); setError('') }}
            className="bg-white font-bold px-4 py-2 border-2 border-ink">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}