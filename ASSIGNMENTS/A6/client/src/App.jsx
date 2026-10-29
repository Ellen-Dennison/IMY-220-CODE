import { useEffect, useState } from "react";
import AddPostForm from "./components/AddPostForm";
import PostList from "./components/PostList";

function App() {
    const [posts, setPosts] = useState([]);

    async function loadPosts() {
        try {
            const response = await fetch("http://localhost:3001/api/posts");
            const data = await response.json();

            setPosts(data);
        } catch (error) {
            console.error("Unable to load posts:", error);
        }
    }

    async function addPost(username, caption) {
        try {
            const response = await fetch("http://localhost:3001/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    caption
                })
            });

            if (!response.ok) {
                throw new Error("Unable to create post");
            }

            const newPost = await response.json();

            setPosts([...posts, newPost]);
        } catch (error) {
            console.error("Unable to create post:", error);
        }
    }

    useEffect(() => {
        loadPosts();
    }, []);

    return (
        <main>
            <h1>PhotoShare</h1>

            <AddPostForm onAddPost={addPost} />

            <PostList posts={posts} />
        </main>
    );
}

export default App;