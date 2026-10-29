import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Avatar from '../components/Avatar'
import FriendButton from '../components/FriendButton'
import PostCard from '../components/PostCard'
import CreateAlbum from '../components/CreateAlbum'

export default function Profile({ currentUser }) {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ name: '', bio: '' })
  const [saving, setSaving] = useState(false)
  const [avatarBusy, setAvatarBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [albums, setAlbums] = useState([])
  const avatarInput = useRef(null)

  const isSelf = currentUser?.username === username

  
  // Fetch profile + posts + albums whenever username changes
    useEffect(() => {
    setLoading(true)
    setError('')
    Promise.all([
        fetch(`/api/users/${username}`, { credentials: 'include' }),
        fetch(`/api/users/${username}/posts`, { credentials: 'include' }),
        fetch(`/api/users/${username}/albums`, { credentials: 'include' })
    ])
        .then(async ([pRes, poRes, aRes]) => {
        if (!pRes.ok) throw new Error('User not found')
        const pData = await pRes.json()
        const poData = poRes.ok ? await poRes.json() : []
        const aData = aRes.ok ? await aRes.json() : []
        return {
            profile: pData.user,
            posts: Array.isArray(poData) ? poData : [],
            albums: Array.isArray(aData) ? aData : []
        }
        })
        .then(({ profile, posts, albums }) => {
        setProfile(profile)
        setPosts(posts)
        setAlbums(albums)
        setDraft({ name: profile.name, bio: profile.bio || '' })
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))
    }, [username])

  async function saveProfile() {
    setSaving(true)
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(draft)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setProfile({ ...profile, ...data.user })
      setEditing(false)
    } catch (err) { alert(err.message) }
    finally { setSaving(false) }
  }

  async function uploadAvatar(file) {
    if (!file || !file.type.startsWith('image/')) return
    setAvatarBusy(true)
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await fetch('/api/users/me/avatar', {
        method: 'POST', credentials: 'include', body: fd
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setProfile({ ...profile, profilePicture: data.user.profilePicture })
    } catch (err) { alert(err.message) }
    finally { setAvatarBusy(false) }
  }

  // Drag-and-drop bonus for avatar
  function onDragOver(e) { e.preventDefault(); setDragging(true) }
  function onDragLeave() { setDragging(false) }
  function onDrop(e) {
    e.preventDefault(); setDragging(false)
    uploadAvatar(e.dataTransfer.files[0])
  }

  if (loading) return <div className="max-w-4xl mx-auto p-8 text-white">Loading…</div>
  if (error) return <div className="max-w-4xl mx-auto p-8 text-white font-bold"> {error}</div>

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* HEADER */}
      <div className="bg-white border-4 border-ink rounded-lg p-6 mb-8 text-ink shadow-[8px_8px_0px_rgba(5,5,0,1)]">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">

          {/* Avatar (with drag-drop if self) */}
          <div
            className={`relative ${isSelf ? 'cursor-pointer' : ''} ${dragging ? 'ring-4 ring-azure rounded-full' : ''}`}
            onClick={isSelf ? () => avatarInput.current?.click() : undefined}
            onDragOver={isSelf ? onDragOver : undefined}
            onDragLeave={isSelf ? onDragLeave : undefined}
            onDrop={isSelf ? onDrop : undefined}
            title={isSelf ? 'Click or drop image to update avatar' : ''}
          >
            <Avatar user={profile} size="lg" />
            {isSelf && (
              <>
                <input
                  ref={avatarInput} type="file" accept="image/*" hidden
                  onChange={e => uploadAvatar(e.target.files[0])}
                />
                <div className="absolute -bottom-2 -right-2 bg-azure text-white text-xs font-bold px-2 py-1 rounded border-2 border-ink">
                  {avatarBusy ? '…' : 'Edit'}
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 w-full">
            {editing ? (
              <div className="space-y-3">
                <input
                  value={draft.name}
                  onChange={e => setDraft({ ...draft, name: e.target.value })}
                  className="w-full border-2 border-ink px-3 py-2 font-display text-2xl"
                  placeholder="Name"
                />
                <textarea
                  value={draft.bio}
                  onChange={e => setDraft({ ...draft, bio: e.target.value })}
                  className="w-full border-2 border-ink px-3 py-2 font-mono"
                  placeholder="Bio (max 200 chars)"
                  rows={2}
                  maxLength={200}
                />
                <div className="flex gap-3">
                  <button onClick={saveProfile} disabled={saving}
                    className="bg-azure text-white font-bold px-4 py-2 border-2 border-ink disabled:opacity-50">
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button onClick={() => { setEditing(false); setDraft({ name: profile.name, bio: profile.bio || '' }) }}
                    className="bg-white font-bold px-4 py-2 border-2 border-ink">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-3xl">{profile.name}</h1>
                  <span className="text-gray-600 font-mono">@{profile.username}</span>
                  {isSelf && (
                    <button onClick={() => setEditing(true)}
                      className="bg-white border-2 border-ink px-3 py-1 text-sm font-bold ml-auto">
                      Edit Profile
                    </button>
                  )}
                </div>

                {profile.bio !== undefined && (
                  <p className="font-mono mt-3 text-ink">{profile.bio || '— no bio yet —'}</p>
                )}

                {/* Friend button (only when viewing someone else) */}
                {!isSelf && profile.relationship && (
                  <div className="mt-4">
                    <FriendButton
                      user={profile}
                      onRelationshipChange={(rel) => setProfile({ ...profile, relationship: rel })}
                    />
                  </div>
                )}

                {/* Notice for non-friends */}
                {!isSelf && profile.relationship === 'none' && (
                  <p className="mt-4 text-sm text-gray-500 font-mono">
                    Add <strong>{profile.name}</strong> as a friend to see their posts and friend list.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {isSelf && (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
            <h2 className="font-display text-3xl text-white">My Albums</h2>
            <CreateAlbum />
            </div>
            {albums.length === 0 ? (
            <p className="text-white font-mono">No albums yet.</p>
            ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {albums.map(a => (
                <Link key={a._id} to={`/album/${a._id}`}
                    className="bg-white border-4 border-ink rounded-lg p-3 hover:bg-azure/10 block">
                    <p className="font-display text-lg text-ink truncate">{a.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{a.posts?.length || 0} posts</p>
                </Link>
                ))}
            </div>
            )}
        </div>
        )}

        {/* Friends + requests lists */}
        {profile.friends && (
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <h2 className="font-display text-xl mb-3">
              Friends ({profile.friends.length})
            </h2>
            {profile.friends.length === 0 ? (
              <p className="text-gray-500 font-mono text-sm">No friends yet.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {profile.friends.map(f => (
                  <Link key={f._id} to={`/profile/${f.username}`}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-azure/20 border-2 border-ink px-3 py-1 rounded-full">
                    <Avatar user={f} size="sm" />
                    <span className="font-mono text-sm font-bold">{f.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pending incoming requests (self only) */}
        {isSelf && profile.friendRequests && profile.friendRequests.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <h2 className="font-display text-xl mb-3 text-hot">
              Friend Requests ({profile.friendRequests.length})
            </h2>
            <div className="flex flex-wrap gap-3">
              {profile.friendRequests.map(r => (
                <Link key={r._id} to={`/profile/${r.username}`}
                  className="flex items-center gap-2 bg-yellow-100 border-2 border-ink px-3 py-1 rounded-full">
                  <Avatar user={r} size="sm" />
                  <span className="font-mono text-sm font-bold">{r.name}</span>
                </Link>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 font-mono">
              Click a name to visit their profile and accept.
            </p>
          </div>
        )}
      </div>

      {/* POSTS */}
      {(isSelf || profile.friends !== undefined) && (
        <div>
          <h2 className="font-display text-3xl text-white mb-4">Posts ({posts.length})</h2>
          {posts.length === 0 ? (
            <div className="bg-white border-4 border-ink rounded-lg p-6 text-ink font-mono">
              No posts yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(post => <PostCard key={post._id} post={post} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}