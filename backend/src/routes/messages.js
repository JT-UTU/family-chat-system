const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// 获取所有消息
router.get('/', auth, messageController.getAllMessages);

// 创建新消息
router.post('/', auth, messageController.createMessage);

module.exports = router;