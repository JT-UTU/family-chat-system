const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// 中间件
app.use(cors());
app.use(express.json());

// 将 Socket.IO 实例添加到请求对象
app.use((req, res, next) => {
    req.io = io;
    next();
});

// 静态文件服务 - 上传的文件
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

// Socket.IO 认证中间件
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('认证失败'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    } catch (error) {
        next(new Error('认证失败'));
    }
});

// Socket.IO 连接处理
io.on('connection', (socket) => {
    console.log(`用户已连接: ${socket.user.username}`);

    socket.on('disconnect', () => {
        console.log(`用户已断开连接: ${socket.user.username}`);
    });
});

// 启动服务器
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('未处理的拒绝:', error);
});