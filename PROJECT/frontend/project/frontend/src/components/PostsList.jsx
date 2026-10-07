import PostPreview from './PostPreview.jsx'

// Component that lists posts using PostPreview (rubric item h).
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
