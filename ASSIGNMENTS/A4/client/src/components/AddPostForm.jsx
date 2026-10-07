// Student Number: u23849259
import { useState } from "react";

function AddPostForm({ onAddPost }) {
    const [username, setUsername] = useState("");
    const [caption, setCaption] = useState("");

    async function handleSubmit(e) {
        e.preventDefault(); 

        const cleanUsername = username.trim();
        const cleanCaption = caption.trim();

        if (!cleanUsername || !cleanCaption) {
            return;
        }
        
        const success = await onAddPost(cleanUsername, cleanCaption);

        if (success) {
            setUsername("");
            setCaption("");
        }
    }

    return (
        <section className="add-post">
            <h2>Add Post</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Caption"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                />

                <button type="submit">Add Post</button>
            </form>
        </section>
    );
}

export default AddPostForm;