import Post from "./Post";

function PostList({ posts }) {
    return (
        <section>
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </section>
    );
}

export default PostList;