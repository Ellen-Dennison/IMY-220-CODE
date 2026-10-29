import { useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'

export default function PostCard({ post, onReport }) 
{
  const [showReport, setShowReport] = useState(false)

  const author = post?.author || { name: 'Deleted User', username: 'deleted', profilePicture: '' }

  async function submitReport(reason) {
    try 
    {
      const res = await fetch(`/api/posts/${post._id}/report`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason })
      })
      if (res.ok) 
      {
        alert('Post reported. It will be hidden if reported enough times.')
        setShowReport(false)
        if (onReport) onReport(post._id)
      } 
      else 
      {
        const d = await res.json()
        alert(d.error)
      }
    } catch (err) { alert('Failed to report') }
  }

  return (
    <div className="bg-white border-4 border-ink rounded-lg overflow-hidden mb-6 text-ink shadow-[8px_8px_0px_rgba(5,5,0,1)] relative">
      
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b-2 border-gray-200">
        <Avatar user={author} size="sm" />
        <div>
          <Link to={`/profile/${author.username}`} className="font-bold hover:underline hover:text-azure">
            {author.name}
          </Link>
          <p className="text-xs text-gray-500">@{author.username} • {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
        
        {/* Report Button */}
        <div className="ml-auto relative">
          <button onClick={() => setShowReport(!showReport)} className="text-gray-400 hover:text-hot font-bold">
            Report
          </button>
          {showReport && (
            <div className="absolute right-0 top-6 bg-white border-2 border-ink p-2 z-10 w-48 shadow-lg">
              <p className="text-xs font-bold mb-2">Reason:</p>
              <button onClick={() => submitReport('Inappropriate image')} className="block text-left w-full text-sm hover:bg-gray-100 p-1">Inappropriate image</button>
              <button onClick={() => submitReport('Spam')} className="block text-left w-full text-sm hover:bg-gray-100 p-1">Spam</button>
              <button onClick={() => submitReport('Harassment')} className="block text-left w-full text-sm hover:bg-gray-100 p-1">Harassment</button>
            </div>
          )}
        </div>
      </div>

    
      <Link to={`/post/${post._id}`} className="block cursor-pointer group">
        <img 
          src={post.imageUrl} 
          alt={post.description} 
          className="w-full max-h-[500px] object-cover border-b-2 border-ink group-hover:opacity-95 transition-opacity" 
        />
      </Link>

      {/* Body */}
      <div className="p-4">
        <p className="font-mono mb-3">{post.description}</p>
        
        {post.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {post.hashtags.map(tag => (
              <Link key={tag} to={`/search?q=${tag}`} className="text-azure font-bold hover:underline">
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
    
        <Link 
          to={`/post/${post._id}`} 
          className="text-sm text-gray-500 hover:text-azure font-bold block mt-2 border-t-2 border-gray-100 pt-3 transition-colors"
        >
          View full post & comments →
        </Link>
      </div>
    </div>
  )
}