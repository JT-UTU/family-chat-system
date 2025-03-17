const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDatabase() {
    // 从环境变量获取数据库配置
    const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    };

    // 创建数据库连接
    const connection = await mysql.createConnection(dbConfig);
    console.log('数据库连接成功');

    try {
        // 检查 messages 表是否存在 type 和 extraData 列
        const [columns] = await connection.query(`
      SHOW COLUMNS FROM messages
    `);

        const columnNames = columns.map(col => col.Field);

        // 如果 type 列不存在，添加它
        if (!columnNames.includes('type')) {
            console.log('添加 type 列...');
            await connection.query(`
        ALTER TABLE messages
        ADD COLUMN type VARCHAR(50) DEFAULT 'text' AFTER userId
      `);
            console.log('type 列已添加');
        } else {
            console.log('type 列已存在');
        }

        // 如果 extraData 列不存在，添加它
        if (!columnNames.includes('extraData')) {
            console.log('添加 extraData 列...');
            await connection.query(`
        ALTER TABLE messages
        ADD COLUMN extraData TEXT AFTER type
      `);
            console.log('extraData 列已添加');
        } else {
            console.log('extraData 列已存在');
        }

        console.log('数据库结构更新完毕');
    } catch (error) {
        console.error('更新数据库结构时出错:', error);
    } finally {
        await connection.end();
        console.log('数据库连接已关闭');
    }
}

// 执行更新
updateDatabase();