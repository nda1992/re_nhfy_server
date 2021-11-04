const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const { Oracleconnection } = require('../../../utils/oracleConnection')
const { connection } = require('../../../utils/mysqlConnection')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Shanghai')
// 用于可视化的所有路由

//1.NEW_HIS门急诊人次
router.get('/getOutpatientSumm', async(req, res, next) => {
    sql = `select a.门急诊诊察收入,a.门急诊检查收入,a.门急诊化验收入,a.门急诊护理收入,a.门急诊治疗收入,a.门急诊手术收入,a.门急诊卫生材料收入,a.门急诊西药收入,a.门急诊中药饮片收入,a.门急诊中成药收入,a.门急诊其他收入 from basic a where a.统计时间 between '2021-10-15' and '2021-10-15'`
    connection.query(sql, function(err, result) {
        res.json({code: 200, result: result})
    })
})
module.exports = router