const pool = require('../config/db');

class Message {
    static async getAll() {
        try {
            const [rows] = await pool.query(`
        SELECT m.*, u.username 
        FROM messages m
        JOIN users u ON m.userId = u.id
        ORDER BY m.createdAt ASC
      `);

            // 处理每条消息的extraData
            return rows.map(message => {
                if (message.extraData) {
                    try {
                        const extraData = JSON.parse(message.extraData);
                        Object.assign(message, extraData);
                    } catch (e) {
                        console.error('解析额外数据错误:', e);
                    }
                    // 从结果中删除extraData字段
                    delete message.extraData;
                }
                return message;
            });
        } catch (error) {
            throw error;
        }
    }

    static async create(messageData) {
        try {
            // 提取基本字段
            const { content, userId, type = 'text' } = messageData;
            console.log('消息数据:', messageData);

            // 将其他数据字段序列化为JSON字符串
            const extraData = {};
            Object.keys(messageData).forEach(key => {
                if (!['content', 'userId', 'type'].includes(key)) {
                    extraData[key] = messageData[key];
                }
            });

            const extraDataJson = Object.keys(extraData).length > 0 ?
                JSON.stringify(extraData) :
                null;

            console.log('序列化的额外数据:', extraDataJson);

            // 插入消息数据
            try {
                const [result] = await pool.query(
                    'INSERT INTO messages (content, userId, type, extraData) VALUES (?, ?, ?, ?)', [content, userId, type, extraDataJson]
                );
                console.log('插入结果:', result);

                // 获取刚刚创建的消息，包括用户名
                const [rows] = await pool.query(`
                    SELECT m.*, u.username 
                    FROM messages m
                    JOIN users u ON m.userId = u.id
                    WHERE m.id = ?
                `, [result.insertId]);

                // 处理返回的消息对象，解析extraData
                const message = rows[0];
                if (message.extraData) {
                    try {
                        const extraData = JSON.parse(message.extraData);
                        Object.assign(message, extraData);
                    } catch (e) {
                        console.error('解析额外数据错误:', e);
                    }
                    // 从结果中删除extraData字段
                    delete message.extraData;
                }

                return message;
            } catch (sqlError) {
                console.error('SQL错误:', sqlError);
                throw sqlError;
            }
        } catch (error) {
            console.error('创建消息错误:', error);
            throw error;
        }
    }
}

module.exports = Message;