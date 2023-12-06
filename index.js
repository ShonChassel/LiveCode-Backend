import express from "express"
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Server as SocketServer } from 'socket.io';
import http from 'http'

import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import tasksRoute from './routes/tasks.js'

import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
const server = http.createServer(app)
dotenv.config()

const connect = async () => {

    try {
        await mongoose.connect(process.env.MONGO);
        console.log('connected to mongoDB')
    } catch (error) {
        throw error
    }
}

mongoose.connection.on('disconnected', () => {
    console.log('mongoDB disconnected');
})

mongoose.connection.on('connected', () => {
    console.log('mongoDB connected');
})



//? middlewares 
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.use('/api/tasks', tasksRoute)



app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || 'Something went wrong'
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    })
})

const io = new SocketServer(server, {
    path: '/',
    cors: {
        origin: 'https://livecode-com.onrender.com',
        methods: ['GET', 'POST', 'PUT']
    }
});

io.on("connection", (socket) => {
    console.log(`conect ${socket.id}`);

    socket.on("send_message", (data) => {
        socket.broadcast.emit("receive_message", data)
    })
})

server.listen(8800, () => {
    connect()
    console.log('connected to back!');
})