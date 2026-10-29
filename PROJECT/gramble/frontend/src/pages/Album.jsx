import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'

export default function Album({ currentUser }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [myPosts, setMyPosts] = useState([])
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({})
  const [busy, setBusy] = useState(false)

  async function refresh() 
  {
    const res = await fetch(`/api/albums/${id}`, { credentials: 'include' })
    if (!res.ok) throw new Error('Album not found')
    return res.json()
  }

  useEffect(() => 
  {
    setLoading(true)
    refresh()
      .then(a => {
        setAlbum(a)
        setDraft({ name: a.name, description: a.description, hashtags: a.hashtags.join(', ') })
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const isOwner = album && currentUser && album.author._id === currentUser._id

  useEffect(() => 
  {
    if (!isOwner) return
    fetch(`/api/users/${currentUser.username}/posts`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => Array.isArray(d) ? setMyPosts(d) : [])
      .catch(() => {})
  }, [isOwner, currentUser])

  async function save() 
  {
    setBusy(true)
    try {
      const res = await fetch(`/api/albums/${id}`, 
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(draft)
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      setAlbum(await refresh())
      setEditing(false)
    } catch (err) { alert(err.message) }
    finally { setBusy(false) }
  }

  async function togglePost(postId, inAlbum) 
  {
    const method = inAlbum ? 'DELETE' : 'POST'
    await fetch(`/api/albums/${id}/posts/${postId}`, { method, credentials: 'include' })
    setAlbum(await refresh())
  }

  async function deleteAlbum() 
  {
    if (!confirm('Delete this album permanently?')) return
    const res = await fetch(`/api/albums/${id}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) navigate('/')
  }

  if (loading) return <div className="max-w-4xl mx-auto p-8 text-white">Loading…</div>
  if (error) return <div className="max-w-4xl mx-auto p-8 text-white font-bold"> {error}</div>

  const albumPostIds = new Set(album.posts.map(p => p._id))

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white border-4 border-ink rounded-lg p-6 mb-8 text-ink shadow-[8px_8px_0px_rgba(5,5,0,1)]">
        {editing ? (
          <div className="space-y-3">
            <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })}
              className="w-full border-2 border-ink p-2 font-display text-2xl" />
            <textarea value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })}
              className="w-full border-2 border-ink p-2 font-mono" rows={3} />
            <input value={draft.hashtags} onChange={e => setDraft({ ...draft, hashtags: e.target.value })}
              className="w-full border-2 border-ink p-2 font-mono" placeholder="hashtags" />
            <div className="flex gap-2">
              <button onClick={save} disabled={busy}
                className="bg-azure text-white font-bold px-4 py-2 border-2 border-ink">
                {busy ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => setEditing(false)}
                className="bg-white font-bold px-4 py-2 border-2 border-ink">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-display text-4xl">{album.name}</h1>
                <p className="text-sm text-gray-600 font-mono">
                  by @{album.author.username} • {new Date(album.createdAt).toLocaleDateString()}
                </p>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(true)}
                    className="bg-white border-2 border-ink px-3 py-1 text-sm font-bold">Edit</button>
                  <button onClick={deleteAlbum}
                    className="bg-hot text-white border-2 border-ink px-3 py-1 text-sm font-bold">Delete</button>
                </div>
              )}
            </div>
            <p className="font-mono mt-3">{album.description || '— no description —'}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {album.hashtags.map(t => (
                <span key={t} className="text-azure font-bold">#{t}</span>
              ))}
            </div>
          </>
        )}
      </div>

      {isOwner && myPosts.length > 0 && (
        <div className="bg-white border-4 border-ink rounded-lg p-6 mb-8 text-ink">
          <h2 className="font-display text-2xl mb-2">Your Posts</h2>
          <p className="text-sm text-gray-500 mb-3 font-mono">
            Click a post to toggle it in/out of this album. ✓ = currently in album.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {myPosts.map(p => {
              const inAlbum = albumPostIds.has(p._id)
              return (
                <button key={p._id} onClick={() => togglePost(p._id, inAlbum)}
                  className={`relative aspect-square border-2 overflow-hidden ${inAlbum ? 'border-leaf ring-4 ring-leaf/30' : 'border-gray-300'}`}>
                  <img src={p.imageUrl} alt={p.description} className="w-full h-full object-cover" />
                  {inAlbum && (
                    <span className="absolute top-1 right-1 bg-leaf text-ink text-xs font-bold px-1.5 rounded">✓</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <h2 className="font-display text-3xl text-white mb-4">Posts in Album ({album.posts.length})</h2>
      {album.posts.length === 0 ? (
        <div className="bg-white border-4 border-ink p-6 text-ink font-mono">
          No posts in this album yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {album.posts.map(p => <PostCard key={p._id} post={p} />)}
        </div>
      )}
    </div>
  )
}
