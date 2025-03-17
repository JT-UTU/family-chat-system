const pool = require('../config/db');
const crypto = require('crypto');

class User {
    static async findByUsername(username) {
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(userData) {
        try {
            // 使用简单的加密方法替代 bcrypt
            const salt = crypto.randomBytes(16).toString('hex');
            const hash = crypto
                .pbkdf2Sync(userData.password, salt, 1000, 64, 'sha512')
                .toString('hex');

            const [result] = await pool.query(
                'INSERT INTO users (username, password, salt) VALUES (?, ?, ?)', [userData.username, hash, salt]
            );

            return { id: result.insertId, username: userData.username };
        } catch (error) {
            throw error;
        }
    }

    static async validatePassword(password, user) {
        try {
            const hash = crypto
                .pbkdf2Sync(password, user.salt, 1000, 64, 'sha512')
                .toString('hex');

            return hash === user.password;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;