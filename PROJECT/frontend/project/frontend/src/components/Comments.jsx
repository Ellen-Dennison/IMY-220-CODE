function Comments({ comments = [], getUserById }) {
  return (
    <div className="comments">
      <h4>Comments ({comments.length})</h4>
      {comments.length === 0 && <p className="muted">No comments yet.</p>}
      <ul>
        {comments.map((comment) => {
          const author = getUserById ? getUserById(comment.authorId) : null
          return (
            <li key={comment.id} className="comment">
              <strong>{author ? author.name : 'Unknown user'}:</strong>{' '}
              {comment.text}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Comments
