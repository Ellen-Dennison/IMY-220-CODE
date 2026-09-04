import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Post from '../components/Post.jsx'
import EditPost from '../components/EditPost.jsx'

function PostPage({ posts, users }) {
  const { id } = useParams()
  const [editing, setEditing] = useState(false)
  const [postList, setPostList] = useState(posts)

  const post = postList.find((p) => p.id === id)
  const getUserById = (uid) => users.find((u) => u.id === uid)

  if (!post) {
    return <p>No post found for id "{id}".</p>
  }

  const author = getUserById(post.authorId)

  const handleSave = (updatedPost) => {
    setPostList(postList.map((p) => (p.id === updatedPost.id ? updatedPost : p)))
    setEditing(false)
  }

  return (
    <div className="post-page">
      {editing ? (
        <EditPost
          post={post}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <Post post={post} author={author} getUserById={getUserById} />
          <button onClick={() => setEditing(true)}>Edit Post</button>
        </>
      )}
    </div>
  )
}

export default PostPage
