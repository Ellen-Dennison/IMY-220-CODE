// Student Number: u23849259
import Post from "./Post";

function PostList({ posts, onDelete }) {
    if (posts.length === 0) {
        return (
            <section className="post-list">
                <p className="empty">No posts found.</p>
            </section>
        );
    }

    return (
        <section className="post-list">
            {posts.map(post => (
                <Post key={post.id} post={post} onDelete={onDelete} />
            ))}
        </section>
    );
}

export default PostList;