const oracledb = require('oracledb')
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

const connection = oracledb.getConnection({
    user: 'user_self',
    password: 'user_123',
    connectString: '192.168.0.185:1521/ORCL'
})

exports.connection = connection;