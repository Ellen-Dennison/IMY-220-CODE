import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Avatar from '../components/Avatar'

export default function Post({ currentUser }) {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [post, setPost] = useState(null)
  const [albums, setAlbums] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Edit state
  const [editing, setEditing] = useState(false)
  const [draftDesc, setDraftDesc] = useState('')
  const [draftTags, setDraftTags] = useState('')
  
  // Comment state
  const [newComment, setNewComment] = useState('')

  // Fetch Post and Comments
  useEffect(() => 
  {
    setLoading(true)
    Promise.all([
      fetch(`/api/posts/${id}`, { credentials: 'include' }),
      fetch(`/api/posts/${id}/comments`, { credentials: 'include' })
    ])
      .then(async ([postRes, comRes]) => 
      {
        if (!postRes.ok) throw new Error('Post not found')
        const postData = await postRes.json()
        const comData = await comRes.json()
        return { postData, comData }
      })
      .then(({ postData, comData }) => {
        setPost(postData.post)
        setAlbums(postData.albums || [])
        setComments(Array.isArray(comData) ? comData : [])
        setDraftDesc(postData.post.description)
        setDraftTags(postData.post.hashtags.join(', '))
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  // Handle Delete
  async function deletePost() 
  {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try 
    {
      const res = await fetch(`/api/posts/${id}`, 
      { 
        method: 'DELETE', 
        credentials: 'include' 
      })
      
      if (!res.ok) 
      {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete')
      }
      
      navigate('/') // Go home after deletion
    } 
    catch (err) 
    { alert(err.message) }
  }

  // Handle Edit Save
  async function saveEdit() 
  {
    try 
    {
      const res = await fetch(`/api/posts/${id}`, 
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ description: draftDesc, hashtags: draftTags })
      })
      if (!res.ok) throw new Error('Failed to update')
      
      // Update local state without refreshing
      setPost({
        ...post,
        description: draftDesc,
        hashtags: draftTags.split(',').map(t => t.trim().replace('#', '')).filter(Boolean)
      })
      setEditing(false)
    } catch (err) { alert(err.message) }
  }

  // Handle Comment Submit
  async function addComment(e) 
  {
    e.preventDefault()
    if (!newComment.trim()) return
    
    try 
    {
      const res = await fetch(`/api/posts/${id}/comments`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: newComment })
      })
      if (!res.ok) throw new Error('Failed to post comment')
      
      // Refresh comments
      const comRes = await fetch(`/api/posts/${id}/comments`)
      setComments(await comRes.json())
      setNewComment('')
    } catch (err) { alert(err.message) }
  }

  if (loading) return <div className="text-center text-white p-8 font-mono">Loading post...</div>
  if (error) return <div className="text-center text-white p-8 font-bold"> {error}</div>
  if (!post) return null

  const isOwner = currentUser && currentUser._id === post.author._id

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      
      {/* POST CARD */}
      <div className="bg-white border-4 border-ink rounded-lg overflow-hidden mb-8 text-ink shadow-[8px_8px_0px_rgba(5,5,0,1)]">
        
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b-2 border-gray-200">
          <Avatar user={post.author} size="sm" />
          <div>
            <Link to={`/profile/${post.author.username}`} className="font-bold hover:underline hover:text-azure">
              {post.author.name}
            </Link>
            <p className="text-xs text-gray-500">
              @{post.author.username} • {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
          
          {/* Edit/Delete Buttons*/}
          {isOwner && (
            <div className="ml-auto flex gap-2">
              {!editing && (
                <button onClick={() => setEditing(true)} className="text-sm font-bold bg-gray-100 hover:bg-gray-200 px-3 py-1 border-2 border-ink">
                  Edit
                </button>
              )}
              <button onClick={deletePost} className="text-sm font-bold bg-hot text-white px-3 py-1 border-2 border-ink hover:brightness-110">
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Image */}
        <img src={post.imageUrl} alt={post.description} className="w-full max-h-[600px] object-contain bg-black border-b-2 border-ink" />

        {/* Body */}
        <div className="p-6">
          {editing ? (
            <div className="space-y-3 bg-gray-50 p-4 border-2 border-gray-200 rounded">
              <label className="block text-sm font-bold">Description</label>
              <textarea 
                value={draftDesc} 
                onChange={e => setDraftDesc(e.target.value)}
                className="w-full border-2 border-ink p-2 font-mono" 
                rows={3} 
              />
              <label className="block text-sm font-bold">Hashtags (comma separated)</label>
              <input 
                value={draftTags} 
                onChange={e => setDraftTags(e.target.value)}
                className="w-full border-2 border-ink p-2 font-mono" 
              />
              <div className="flex gap-2 pt-2">
                <button onClick={saveEdit} className="bg-azure text-white font-bold px-4 py-2 border-2 border-ink">Save Changes</button>
                <button onClick={() => setEditing(false)} className="bg-white font-bold px-4 py-2 border-2 border-ink">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p className="font-mono text-lg mb-4">{post.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {post.hashtags.map(tag => (
                  <Link key={tag} to={`/search?q=${tag}`} className="text-azure font-bold hover:underline bg-azure/10 px-2 py-1 rounded">
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Associated Albums */}
              {albums.length > 0 && (
                <div className="border-t-2 border-gray-100 pt-4">
                  <p className="text-sm font-bold text-gray-500 mb-2">This post is featured in:</p>
                  <div className="flex gap-2 flex-wrap">
                    {albums.map(a => (
                      <Link key={a._id} to={`/album/${a._id}`} className="text-sm font-bold bg-white border-2 border-ink px-3 py-1 hover:bg-azure hover:text-white transition-colors">
                      {a.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* COMMENTS SECTION */}
      <div className="bg-white border-4 border-ink rounded-lg p-6 text-ink shadow-[8px_8px_0px_rgba(5,5,0,1)]">
        <h2 className="font-display text-2xl mb-4">Comments ({comments.length})</h2>
        
        {/* Add Comment */}
        <form onSubmit={addComment} className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border-2 border-ink px-3 py-2 font-mono"
            required
          />
          <button type="submit" className="bg-azure text-white font-bold px-4 py-2 border-2 border-ink hover:brightness-110">
            Post
          </button>
        </form>

        {/* List Comments */}
        {comments.length === 0 ? (
          <p className="text-gray-500 font-mono text-sm">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {comments.map(c => (
              <div key={c._id} className="flex gap-3">
                <Avatar user={c.author} size="sm" />
                <div className="flex-1 bg-gray-50 p-3 rounded border-2 border-gray-100">
                  <div className="flex justify-between items-baseline mb-1">
                    <Link to={`/profile/${c.author.username}`} className="font-bold text-sm hover:underline">
                      {c.author.name}
                    </Link>
                    <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-mono text-sm">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}