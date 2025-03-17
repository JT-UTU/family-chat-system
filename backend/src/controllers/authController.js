const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// 用户注册
const register = async(req, res) => {
    try {
        const { username, password } = req.body;

        // 验证用户名和密码
        if (!username || !password) {
            return res.status(400).json({ message: '用户名和密码不能为空' });
        }

        // 检查用户名是否已存在
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: '用户名已存在' });
        }

        // 创建新用户
        const user = await User.create({ username, password });

        res.status(201).json({ message: '注册成功', user: { id: user.id, username: user.username } });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
};

// 用户登录
const login = async(req, res) => {
    try {
        const { username, password } = req.body;

        // 验证用户名和密码
        if (!username || !password) {
            return res.status(400).json({ message: '用户名和密码不能为空' });
        }

        // 查找用户
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        // 验证密码
        const isPasswordValid = await User.validatePassword(password, user);
        if (!isPasswordValid) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        // 生成 JWT
        const token = jwt.sign({ id: user.id, username: user.username },
            process.env.JWT_SECRET, { expiresIn: '24h' }
        );

        res.json({
            message: '登录成功',
            token,
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
};

module.exports = {
    register,
    login
};