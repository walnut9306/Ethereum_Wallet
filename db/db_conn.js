const mysql = require('mysql');
const con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1111',
    database: 'wallet'
});

con.connect();
console.log('DB Connected Complete 3306 port'); //mysql 기본 포트가 3306

module.exports =con;