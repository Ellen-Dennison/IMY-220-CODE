const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    io.emit("systemMessage", { text: "A user connected." });
    io.emit("userCount", io.engine.clientsCount);

    socket.on("message", (data) => {
         
        const username = data.username.trim();
        const text =    data.text.trim();

        if (!username || !text) 
        {
            socket.emit("errorMessage", { text: "Username and message cannot be empty." });
            return;
        }

        io.emit("message", {
            username,
            text,
            timestamp: new Date().toISOString()
        });
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        io.emit("systemMessage", { text: "A user disconnected." });
        io.emit("userCount", io.engine.clientsCount);
    });
    
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});