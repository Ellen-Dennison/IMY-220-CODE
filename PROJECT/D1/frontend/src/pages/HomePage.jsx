import { useState } from 'react'
import CreatePost from '../components/CreatePost.jsx'
import PostsList from '../components/PostsList.jsx'
import { getUserById } from '../data/dummyData.js'


function HomePage({ users, posts }) {
  const [localPosts, setLocalPosts] = useState(posts)

  const handleCreate = (newPost) => {
    setLocalPosts([{ ...newPost, authorId: users[0].id }, ...localPosts])
  }

  return (
    <div className="home-page">
      <h1>Home</h1>
      <CreatePost onCreate={handleCreate} />
      <PostsList posts={localPosts} getUserById={getUserById} />
    </div>
  )
}

export default HomePage
