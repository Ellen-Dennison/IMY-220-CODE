function Post({ post }) {
    return (
        <article>
            <h2>@{post.username}</h2>
            <p>{post.caption}</p>
        </article>
    );
}

export default Post;