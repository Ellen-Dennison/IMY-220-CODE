const express = require("express");

const app = express();

const posts = [
  {
    id: 1,
    caption: "Sunset over campus",
    hashtags: ["#sunset", "#campus"],
  },
  {
    id: 2,
    caption: "Coffee before lectures",
    hashtags: ["#coffee", "#studentlife"],
  },
  {
    id: 3,
    caption: "Working on my IMY 220 practical",
    hashtags: ["#docker", "#imy220"],
  },
];

const port = process.env.PORT || 5000;
const appName = process.env.APP_NAME || "PhotoShare API";
const appEnvironment = process.env.APP_ENV || "development";

app.get("/", (req, res) => {
  res.json({
    name: appName,
    message: "Welcome to the PhotoShare API.",
  });
});

app.get("/api/posts", (req, res) => {
  res.json(posts);
});

app.get("/api/status", (req, res) => {
  res.json({
    name: appName,
    environment: appEnvironment,
    status: "running",
  });
});

app.listen(port, () => {
  console.log(`${appName} is running on port ${port}`);
});