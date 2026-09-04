import PostPreview from './PostPreview.jsx'

function PostsList({ posts = [], getUserById }) {
  return (
    <div className="posts-list">
      {posts.map((post) => (
        <PostPreview
          key={post.id}
          post={post}
          author={getUserById ? getUserById(post.authorId) : null}
        />
      ))}
    </div>
  )
}

export default PostsList
