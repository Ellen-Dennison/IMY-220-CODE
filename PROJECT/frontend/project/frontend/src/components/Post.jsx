import { Link } from 'react-router-dom'
import PostImage from './PostImage.jsx'
import Comments from './Comments.jsx'

function Post({ post, author, getUserById }) {
  if (!post) return <p>Post not found.</p>

  return (
    <article className="post">
      <header className="post-header">
        {author && (
          <Link to={`/profile/${author.id}`} className="post-author">
            <img src={author.avatar} alt={author.name} className="avatar-sm" />
            <span>{author.name}</span>
          </Link>
        )}
        <span className="muted">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </header>
      <p className="post-text">{post.text}</p>
      <PostImage src={post.image} alt="Post attachment" />
      <Comments comments={post.comments} getUserById={getUserById} />
    </article>
  )
}

export default Post
