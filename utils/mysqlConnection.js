const mysql = require('mysql');
const connection = mysql.createConnection({
    host:'192.168.100.78',
    user:'nhf1dc78',
    password:'788279404',
    port:'3306',
    database:'nhf1dc78'
});
exports.connection = connection;

