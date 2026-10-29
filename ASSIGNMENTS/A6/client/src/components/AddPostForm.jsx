import { useState } from "react";

function AddPostForm({ onAddPost }) {
    const [username, setUsername] = useState("");
    const [caption, setCaption] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        if (!username.trim() || !caption.trim()) {
            return;
        }

        await onAddPost(username, caption);

        setUsername("");
        setCaption("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
            </div>

            <div>
                <label htmlFor="caption">Caption</label>
                <input
                    id="caption"
                    type="text"
                    value={caption}
                    onChange={(event) => setCaption(event.target.value)}
                />
            </div>

            <button type="submit">Add Post</button>
        </form>
    );
}

export default AddPostForm;