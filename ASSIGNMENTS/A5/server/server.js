const express = require("express");
const cors = require("cors");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


const app = express();
const PORT = 3001;
let increment = 0;

app.use(cors());
app.use(express.json());

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


// POST 
app.post("/upload", upload.single('image'), (req, res) => {
    
    const username = req.body.username;
    const caption = req.body.caption;
    const image = req.file;

    if (!username || !caption) 
    { return; }

    const newPost = 
    {
        id: increment++,
        key: increment++,
        username,
        caption,
        image,
    };
    res.status(201).json(newPost);

});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});