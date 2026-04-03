const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'mindcare123',
    database: process.env.DB_NAME || 'mindcare_ai',
    port: process.env.DB_PORT || 3306,
    socketPath: process.env.DB_SOCKET || '/var/run/mysqld/mysqld.sock',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

pool.getConnection()
    .then(connection => {
        console.log('✅ MySQL Database connected successfully');
        console.log(`📊 Database: ${process.env.DB_NAME}`);
        connection.release();
    })
    .catch(err => {
        console.error('❌ MySQL connection failed:', err.message);
    });

module.exports = pool;
