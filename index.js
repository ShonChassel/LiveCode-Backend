import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http'; // Change import to createServer
import { Server as SocketServer } from 'socket.io';

import authRoute from './routes/auth.js';
import usersRoute from './routes/users.js';
import tasksRoute from './routes/tasks.js';

import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const httpServer = createServer(app); // Create an HTTP server separately
const io = new SocketServer(httpServer, {
    cors: {
        origin: 'https://livecode-com.onrender.com', // Update the origin to your Render frontend URL
        methods: ['GET', 'POST', 'PUT'],
    },
});


dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('connected to mongoDB');
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on('disconnected', () => {
    console.log('mongoDB disconnected');
});

mongoose.connection.on('connected', () => {
    console.log('mongoDB connected');
});

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/tasks', tasksRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'Something went wrong';
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

io.on('connection', (socket) => {
    console.log(`connected ${socket.id}`);

    socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', data);
    });
});

const PORT = process.env.PORT || 8800;

httpServer.listen(PORT, async () => {
    await connect();
    console.log(`Server running on port ${PORT}`);
});
