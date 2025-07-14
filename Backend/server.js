import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import connectDB from './config/db.js';
import messageRoutes from './routes/messageRoute.js';
import userRoutes from './routes/userRoute.js';
dotenv.config();

const app = express();
app.use(cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))
app.use(express.json());
connectDB();

const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    },
});

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user-joined', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
        io.emit('online-users', Object.values(users));
    });

    socket.on('send', (message) => {
        io.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
        io.emit('online-users', Object.values(users));
    });
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/auth', userRoutes);
app.use('/api/chat',messageRoutes);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
