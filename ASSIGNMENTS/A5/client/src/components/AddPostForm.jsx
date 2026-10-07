import { useState } from "react";

function AddPostForm({ onAddPost }) {

    const [username, setUsername] = useState("");
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");



    /* Image stuff*/
    //const imageInput = document.getElementById("imageInput");
    

    async function handleSubmit(e) {

        e.preventDefault();
        
    
        if (!username || !caption) {
            return;
        }

        /* Setting form data to the values given */
        const formData = new FormData();
        formData.append("username", username);
        formData.append("caption", caption);
        formData.append("image", image);
        

        /* Post method */
        const response = await fetch("http://localhost:3001/upload", 
        {
            method: 'POST',
            body: formData

        });
        onAddPost(response);
       
        /* Clearing and resetinng elements */
        setUsername("");
        setCaption("");
        document.getElementById("myForm").reset(); //Not sure it this is needed
        
    }

    return (
        <form onSubmit={handleSubmit} id="myForm">
            <label>
                Username
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </label>

            <label>
                Caption
                <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    required
                />
            </label>

            <label>
                Image
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.currentTarget.files[0])}
                    id="imageInput"
                    required
                />
            </label>

            <button type="submit">Add Post</button>
        </form>
    );
}

export default AddPostForm;