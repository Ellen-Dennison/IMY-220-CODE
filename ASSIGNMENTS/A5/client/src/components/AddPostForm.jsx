// Student Number: u23849259
import { useState, useRef } from "react";

function AddPostForm({ onAddPost }) {
    const [username, setUsername] = useState("");
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);

    async function handleSubmit(e) 
    {
        e.preventDefault();
        if (!username || !caption || !image) return;

        const formData = new FormData();
        formData.append("username", username);
        formData.append("caption", caption);
        formData.append("image", image);

        try {
            const response = await fetch("http://localhost:3001/api/posts", {
                method: "POST",
                body: formData
            });
            if (!response.ok) throw new Error("Upload failed");

            const newPost = await response.json();
            onAddPost(newPost);

            setUsername("");
            setCaption("");
            setImage(null);
            fileInputRef.current.value = "";
        } 
        catch (err) 
        { console.error(err);}
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-emerald-50 rounded-2xl shadow-lg p-5 mb-7 flex flex-col"
        >
            <h2 className="text-xl font-bold text-gray-800">Create a post</h2>
            <label className="flex flex-col text-sm font-semibold text-gray-700 gap-1">
                Username
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="border border-emerald-200 rounded-md px-4 py-2 font-normal bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                />
            </label>

            <label className="flex flex-col text-sm font-semibold text-gray-700 gap-1">
                Caption
                <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    required
                    className="border border-emerald-200 rounded-md px-4 py-2 font-normal bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                />
            </label>

            <label className="flex flex-col text-sm font-semibold text-gray-700 gap-1">
                Image
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => setImage(e.currentTarget.files[0] || null)}
                    required
                    className="text-sm font-normal text-emerald-700 border border-emerald-200 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-emerald-100 file:text-emerald-700 file:font-semibold hover:file:bg-emerald-200"
                />
            </label>

            <button
                type="submit"
                className="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-emerald-700 transition-all duration-200"
            >
                Add Post
            </button>
        </form>
    );
}

export default AddPostForm;