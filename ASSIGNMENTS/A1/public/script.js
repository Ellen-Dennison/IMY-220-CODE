const socket = io();

const messageForm = document.getElementById("messageForm");
const usernameInput = document.getElementById("messageUsername");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const responseMessage = document.getElementById("responseMessage");
const userCount = document.getElementById("userCount");
 

// Log the client's socket ID
socket.on("connection", () => {
   console.log(`socket id: ${socket.id}`);
});


// Display received system messages
socket.on("systemMessage", (message) => {
   console.log(`System message: ${message.text}`);
});


// Display received messages
socket.on("message", (message) => {
    const time = new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    addMessage(`${time} - ${message.username}: ${message.text}`);
});

messageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = usernameInput.value;
    const text = messageInput.value;

    socket.emit("message", { username, text });

    messageInput.value = "";
    messageInput.focus();
});


// Display the number of connected users
socket.on("userCount", (count) => {
    userCount.textContent = `Users online: ${count}`;
});

// Display validation errors
socket.on("errorMessage", (error) => {
    responseMessage.textContent = error.text;
});


function addMessage(text) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    messages.appendChild(paragraph);
} 