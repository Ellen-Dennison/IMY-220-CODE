// Student Number: u23849259
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) 
    { cb(null, path.join(__dirname, "uploads")); },
    filename: function (req, file, cb) 
    { cb(null, Date.now() + "-" + file.originalname); }
});
const upload = multer({ storage: storage });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

let posts = [
    {
        id: 1,
        username: "@sarah",
        caption: "Studying React today!",
        image: null
    },
    {
        id: 2,
        username: "@john",
        caption: "Finished my practical.",
        image: null
    }
];


app.get("/api/posts", (req, res) => {
    res.json(posts);
});

let increment = 3;
app.post("/api/posts", upload.single("image"), (req, res) => {
    const { username, caption } = req.body;

    if (!username || !caption || !req.file) 
    {  return res.status(400).json({ error: "Username, caption and image are required" }); }

    const newPost = {
        id: increment++,
        username,
        caption,
        image: `/uploads/${req.file.filename}`
    };
    posts.push(newPost);
    res.status(201).json(newPost);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});