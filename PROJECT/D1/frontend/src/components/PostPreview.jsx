import { Link } from 'react-router-dom'

function PostPreview({ post, author }) {
  if (!post) return null
  return (
    <Link to={`/post/${post.id}`} className="post-preview">
      {author && <span className="post-preview-author">{author.name}</span>}
      <p className="post-preview-text">
        {post.text.length > 80 ? `${post.text.slice(0, 80)}...` : post.text}
      </p>
    </Link>
  )
}

export default PostPreview
