const mysql = require('mysql2/promise');

const mysqlPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'average_db'
});

module.exports = mysqlPool;
