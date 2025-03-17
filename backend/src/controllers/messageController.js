const Message = require('../models/message');

// 获取所有消息
const getAllMessages = async(req, res) => {
    try {
        const messages = await Message.getAll();
        res.json(messages);
    } catch (error) {
        console.error('获取消息错误:', error);
        res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
};

// 创建新消息
const createMessage = async(req, res) => {
    try {
        console.log('请求体内容:', req.body);
        const { content, type = 'text', ...otherData } = req.body;
        const userId = req.user.id;

        if (!content) {
            return res.status(400).json({ message: '消息内容不能为空' });
        }

        // 创建消息，支持不同类型
        const messageData = {
            content,
            userId,
            type,
            ...otherData
        };

        console.log('准备创建消息:', messageData);
        const message = await Message.create(messageData);
        console.log('创建的消息:', message);

        // 通知 Socket.IO 服务器有新消息
        req.io.emit('message', message);

        res.status(201).json(message);
    } catch (error) {
        console.error('创建消息错误详情:', error);
        res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
};

module.exports = {
    getAllMessages,
    createMessage
};