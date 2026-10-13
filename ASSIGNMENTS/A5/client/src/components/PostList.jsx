// Student Number: u23849259
import Post from "./Post";

function PostList({ posts }) {
    return (
        <section className="flex flex-col gap-6"> 
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </section>
    );
}

export default PostList;