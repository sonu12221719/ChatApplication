import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoute.js';
import messageRoutes from './routes/messageRoute.js'
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))
app.use(express.json());
connectDB();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/auth', userRoutes);
app.use('/api/chat',messageRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})
