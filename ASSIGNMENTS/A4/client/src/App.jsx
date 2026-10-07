// Student Number: u23849259
import { useState, useEffect, useCallback } from "react";
import AddPostForm from "/src/components/AddPostForm.jsx";
import SearchPosts from "/src/components/SearchPosts.jsx";
import PostList from "/src/components/PostList.jsx";

const API_URL = "http://localhost:3001/api/posts";

function App() {
    
    const [posts, setPosts] = useState([]);          
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState("");          
    const [searchTerm, setSearchTerm] = useState(""); 

    
    const loadPosts = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Request failed");
            }

            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError("Unable to load posts.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    // ---------- Add a post (POST) ----------
    async function handleAddPost(username, caption) {
        setError("");

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, caption })
            });

            if (!response.ok) {
                throw new Error("Request failed");
            }

            const newPost = await response.json();
            setPosts(prevPosts => [...prevPosts, newPost]);
            return true;
        } catch (err) {
            setError("Unable to add post.");
            return false;
        }
    }

    // ---------- Delete a post (DELETE) ----------
    async function handleDeletePost(id) {
        setError("");

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Request failed");
            }

            setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
        } catch (err) {
            setError("Unable to delete post.");
        }
    }

    // ---------- Search ----------
    const term = searchTerm.trim().toLowerCase();
    const filteredPosts = posts.filter(post =>
        post.username.toLowerCase().includes(term) ||
        post.caption.toLowerCase().includes(term)
    );

    return (
        <main className="app">
            <h1>PhotoShare</h1>

            <AddPostForm onAddPost={handleAddPost} />

            <SearchPosts value={searchTerm} onChange={setSearchTerm} />

            <button onClick={loadPosts}>Refresh Posts</button>

            {error && <p className="error">{error}</p>}

            {isLoading ? (
                <p className="loading">Loading posts...</p>
            ) : (
                <PostList posts={filteredPosts} onDelete={handleDeletePost} />
            )}
        </main>
    );
}

export default App;