-- 创建数据库
CREATE DATABASE IF NOT EXISTS chat_system;
USE chat_system;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建消息表
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  userId INT NOT NULL,
  type VARCHAR(50) DEFAULT 'text',
  extraData TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- 添加索引
CREATE INDEX idx_messages_userId ON messages(userId);
CREATE INDEX idx_messages_createdAt ON messages(createdAt); 