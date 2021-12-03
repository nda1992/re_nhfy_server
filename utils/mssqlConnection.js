const mssql = require('mssql')

const config = {
    user: 'andsoft',
    password: 'andsoft@123',
    database: 'OESv6',
    server: 'www.OESv6.com',
    options: {
        encrypt: false,
        trustServerCertificate: false
    }
}

const getConnction = async () => {
    let connectionPool
    connectionPool = await mssql.connect(config)
    return connectionPool
}

// 封装的查询方法
const querySql = async (sql) => {
    const pool = await getConnction()
    const request = pool.request()
    const result = await request.query(sql)
    return result
}

exports.querySql = querySql