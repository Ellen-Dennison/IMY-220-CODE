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
        <div className="min-h-screen bg-emerald-100">
            <main className="max-w-xl mx-auto p-6">
                <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">PhotoShare</h1>
                <AddPostForm onAddPost={addPost} />
                <PostList posts={posts} />
            </main>
        </div>
    );
}

export default App;