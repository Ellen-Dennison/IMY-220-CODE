// Student Number: u23849259

function Post({ post, onDelete }) {
    return (
        <article className="post">
            <h3>{post.username}</h3>
            <p>{post.caption}</p>
            <button onClick={() => onDelete(post.id)}>Delete</button>
        </article>
    );
}

export default Post;