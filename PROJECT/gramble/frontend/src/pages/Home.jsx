import { useState, useEffect } from 'react'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'

export default function Home() 
{
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch initial posts
  useEffect(() => 
  {
    fetch('/api/posts', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Add new post to the top of the feed without reloading
  const handlePostCreated = (newPost) => 
  {
    setPosts([newPost, ...posts])
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <CreatePost onPostCreated={handlePostCreated} />
      
      <div className="mt-8">
        <h2 className="font-display text-4xl text-white mb-6">Global Feed</h2>
        
        {loading ? (
          <p className="text-white font-mono">Loading feed...</p>
        ) : posts.length === 0 ? (
          <p className="text-white font-mono bg-white/10 p-4 rounded-lg">No posts yet. Be the first to share!</p>
        ) : (
          posts.map(post => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  )
}