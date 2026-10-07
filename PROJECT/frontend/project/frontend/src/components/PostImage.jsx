function PostImage({ src, alt }) {
  if (!src) return null
  return (
    <div className="post-image">
      <img src={src} alt={alt || 'Post image'} />
    </div>
  )
}

export default PostImage
