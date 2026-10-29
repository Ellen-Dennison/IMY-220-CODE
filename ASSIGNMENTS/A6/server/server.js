import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(mongoURI);

let db;

async function connectDB() {
    await client.connect();

    db = client.db("photoshare");

    console.log("Connected to MongoDB");

    const postsCollection = db.collection("posts");

    const postCount = await postsCollection.countDocuments();

    if (postCount === 0) {
        await postsCollection.insertMany([
            {
                username: "sarah",
                caption: "Beautiful day!"
            },
            {
                username: "john",
                caption: "Working on IMY 220"
            },
            {
                username: "mia",
                caption: "Coffee first"
            }
        ]);

        console.log("Sample posts added");
    }
}

app.get("/api/posts", async (req, res) => {
    try {
        const posts = await db.collection("posts").find().toArray();

        res.json(posts);
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve posts"
        });
    }
});

app.post("/api/posts", async (req, res) => {
    try {
        const { username, caption } = req.body;

        if (!username || !caption) {
            return res.status(400).json({
                message: "Username and caption are required"
            });
        }

        const newPost = {
            username,
            caption
        };

        const result = await db.collection("posts").insertOne(newPost);

        const createdPost = {
            _id: result.insertedId,
            ...newPost
        };

        res.status(201).json(createdPost);
    } catch (error) {
        res.status(500).json({
            message: "Unable to create post"
        });
    }
});

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });