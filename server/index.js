const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Allow CORS from your frontend origin (adjust if needed)
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});

app.use(cors()); // For any REST API, if used

const users = {};

io.on('connection', socket => {

    //when a new user joins, let other users know
    socket.on('new-user-joined', name => {
        console.log(`${name} has joined the chat`);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    //when a user sends a message, broadcast it to others
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    //when a user leaves, let others know
    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

server.listen(8000, () => {
    console.log("Server running on http://localhost:8000");
});
