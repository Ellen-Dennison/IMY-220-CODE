import { useEffect, useState } from "react";
import AddPostForm from "./components/AddPostForm";
import PostList from "./components/PostList";

function App() {
    const [posts, setPosts] = useState([]);

    async function loadPosts() {
        const response = await fetch("http://localhost:3001/api/posts");
        const data = await response.json();
        setPosts(data);
    }

    useEffect(() => {
        loadPosts();
    }, []);

    function addPost(post) {
        setPosts([...posts, post]);
    }

    return (
        <main>
            <h1>PhotoShare</h1>

            <AddPostForm onAddPost={addPost} />

            <PostList posts={posts} />
        </main>
    );
}

export default App;