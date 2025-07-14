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

const allowedOrigins = [
  process.env.CLIENT_URL || 'https://chatapplication-3-d91z.onrender.com',
  'http://localhost:5173'
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS error: origin ${origin} not allowed.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
);

app.use(express.json());

/* Connect to MongoDB */
connectDB();

/* ───────────── Socket.IO setup ───────────── */
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Socket.IO CORS: origin ${origin} not allowed.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const users = {};

io.on('connection', socket => {
  console.log(`🔌  Socket connected: ${socket.id}`);

  socket.on('new-user-joined', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
    io.emit('online-users', Object.values(users));
  });

  socket.on('send', message => {
    io.emit('receive', { message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
    io.emit('online-users', Object.values(users));
    console.log(`🔌  Socket disconnected: ${socket.id}`);
  });
});

/* ───────────── REST routes ───────────── */
app.get('/', (_req, res) => res.send('Hello, World!'));
app.get('/health', (_req, res) => res.json({ status: 'OK' }));

app.use('/api/auth', userRoutes);
app.use('/api/chat', messageRoutes);

/* ───────────── Server start ───────────── */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀  Server running on port ${PORT}`);
});

export default app;
