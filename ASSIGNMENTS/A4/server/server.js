import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let posts = [
    {
        id: 1,
        username: "@sarah",
        caption: "Studying React today!"
    },
    {
        id: 2,
        username: "@john",
        caption: "Finished my assignment."
    },
    {
        id: 3,
        username: "@leanne",
        caption: "Sunset over campus."
    }
];

let nextId = 4;

app.get("/api/posts", (req, res) => {
    res.json(posts);
});

app.post("/api/posts", (req, res) => {
    const { username, caption } = req.body;

    if (!username?.trim() || !caption?.trim()) {
        return res.status(400).json({
            error: "Username and caption are required."
        });
    }

    const newPost = {
        id: nextId++,
        username: username.trim(),
        caption: caption.trim()
    };

    posts.push(newPost);

    res.status(201).json(newPost);
});

app.delete("/api/posts/:id", (req, res) => {
    const id = Number(req.params.id);

    const postExists = posts.some(post => post.id === id);

    if (!postExists) {
        return res.status(404).json({
            error: "Post not found."
        });
    }

    posts = posts.filter(post => post.id !== id);

    res.json({
        message: "Post deleted successfully."
    });
});

app.listen(PORT, () => {
    console.log(`PhotoShare API running on http://localhost:${PORT}`);
});