// basic表的相关路由
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const {connection} = require('../../../utils/mysqlConnection')

// 按时间段统计门急诊人次
router.post('/getOupatientAmount', async (req, res, next) => {
    const { startDate, endDate } = req.body
    let sql = `SELECT SUM(门诊人次+急诊人次)门急诊人次 FROM basic WHERE 统计时间 BETWEEN ? AND ?`
    const inserts = [ startDate, endDate ]
    sql = mysql.format(sql, inserts)
    connection.query(sql, function(err, results){
        res.json({code:200,items: results})
    })
})

// 按时间段统计门急诊、住院或全院费用
router.post('/getOutpatientRevenue', async (req, res, next) => {
    console.log(req.body)
    const { startDate, endDate, type } = req.body   // type=1:门诊，type=2:住院，type=3:全院
    let sql = ``
    switch (parseInt(type)) {
        // 门诊
        case 1:
            sql = `SELECT SUM(a.门急诊诊察收入)门急诊诊察收入,SUM(a.门急诊检查收入)门急诊检查收入,
            SUM(a.门急诊化验收入)门急诊化验收入,SUM(a.门急诊护理收入)门急诊护理收入,SUM(a.门急诊治疗收入)门急诊治疗收入,
            SUM(a.门急诊手术收入)门急诊手术收入,SUM(a.门急诊卫生材料收入)门急诊卫生材料收入,SUM(a.门急诊西药收入)门急诊西药收入,
            SUM(a.门急诊中成药收入)门急诊中成药收入,SUM(a.门急诊中药饮片收入)门急诊中药饮片收入,SUM(a.门急诊其他收入)门急诊其他收入,
            ROUND(SUM(a.门急诊西药收入+a.门急诊中成药收入-b.门急诊国家谈判品种)/SUM(a.门急诊诊察收入+a.门急诊检查收入+a.门急诊化验收入+a.门急诊护理收入+a.门急诊治疗收入+a.门急诊手术收入+a.门急诊卫生材料收入+a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入+a.门急诊其他收入),4)*100 药占比,
            ROUND(SUM(a.门急诊卫生材料收入)/(SUM(a.门急诊诊察收入+a.门急诊检查收入+a.门急诊化验收入+a.门急诊护理收入+a.门急诊治疗收入+a.门急诊手术收入+a.门急诊卫生材料收入+a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入+a.门急诊其他收入)-SUM(a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入)),4)*100 耗占比
            FROM basic a LEFT JOIN basic_new b on a.统计时间=b.统计时间 WHERE a.统计时间 BETWEEN ? AND ?`
            break
        // 住院
        case 2:
            sql = `SELECT SUM(a.住院床位收入)住院床位收入,SUM(a.住院诊察收入)住院诊察收入,SUM(a.住院检查收入)住院检查收入,
            SUM(a.住院化验收入)住院化验收入,SUM(a.住院治疗收入)住院治疗收入,SUM(a.住院护理收入)住院护理收入,SUM(a.住院手术收入)住院手术收入,
            SUM(a.住院高值卫生材料收入)住院高值卫生材料收入,SUM(a.住院其他卫生材料收入)住院其他卫生材料收入,SUM(a.住院西药收入)住院西药收入,
            SUM(a.住院中药饮片收入)住院中药饮片收入,SUM(a.住院中成药收入)住院中成药收入,SUM(a.住院其他收入)住院其他收入,
            ROUND(SUM(a.住院西药收入+a.住院中成药收入-b.住院国家谈判品种)/SUM(a.住院床位收入+a.住院诊察收入+a.住院检查收入+a.住院化验收入+a.住院治疗收入+a.住院护理收入+a.住院手术收入+a.住院高值卫生材料收入+a.住院其他卫生材料收入+a.住院西药收入+a.住院中成药收入+a.住院中药饮片收入+a.住院其他收入),4)*100 药占比,
            ROUND(SUM(a.住院高值卫生材料收入+a.住院其他卫生材料收入)/(SUM(a.住院床位收入+a.住院诊察收入+a.住院检查收入+a.住院化验收入+a.住院治疗收入+a.住院护理收入+a.住院手术收入+a.住院高值卫生材料收入+a.住院其他卫生材料收入+a.住院西药收入+a.住院中成药收入+a.住院中药饮片收入+a.住院其他收入)-SUM(a.住院西药收入+a.住院中成药收入+a.住院中药饮片收入)),4)*100 耗占比
            FROM basic a LEFT JOIN basic_new b ON a.统计时间=b.统计时间 WHERE a.统计时间 BETWEEN ? AND ?`
            break
        // 全院    
        case 3:
            sql = `SELECT SUM(a.住院床位收入)全院床位收入,
            SUM(a.住院诊察收入+a.门急诊诊察收入)全院诊察收入,
            SUM(a.住院检查收入+a.门急诊检查收入)全院检查收入,
            SUM(a.住院化验收入+a.门急诊化验收入)全院化验收入,
            SUM(a.住院治疗收入+a.门急诊治疗收入)全院治疗收入,
            SUM(a.住院护理收入+a.门急诊护理收入)全院护理收入,
            SUM(a.住院手术收入+a.门急诊手术收入)全院手术收入,
            SUM(a.住院高值卫生材料收入+a.门急诊卫生材料收入+a.住院其他卫生材料收入)全院卫生材料收入,
            SUM(a.住院西药收入+a.住院中药饮片收入+a.住院中成药收入+a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入)全院药品收入,
            SUM(a.住院其他收入+a.门急诊其他收入)全院其他收入,
            ROUND(SUM(a.住院西药收入+a.住院中成药收入-b.住院国家谈判品种+a.门急诊西药收入+a.门急诊中成药收入-b.门急诊国家谈判品种)/SUM(a.住院床位收入+a.住院诊察收入+a.住院检查收入+a.住院化验收入+a.住院治疗收入+a.住院护理收入+a.住院手术收入+a.住院高值卫生材料收入+a.住院其他卫生材料收入+a.住院西药收入+a.住院中成药收入+a.住院中药饮片收入+a.住院其他收入+a.门急诊诊察收入+a.门急诊检查收入+a.门急诊化验收入+a.门急诊护理收入+a.门急诊治疗收入+a.门急诊手术收入+a.门急诊卫生材料收入+a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入+a.门急诊其他收入),4)*100 药占比,
            ROUND(SUM(a.住院高值卫生材料收入+a.住院其他卫生材料收入+a.门急诊卫生材料收入)/(SUM(a.门急诊诊察收入+a.门急诊检查收入+a.门急诊化验收入+a.门急诊护理收入+a.门急诊治疗收入+a.门急诊手术收入+a.门急诊卫生材料收入+a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入+a.门急诊其他收入+a.住院床位收入+a.住院诊察收入+a.住院检查收入+a.住院化验收入+a.住院治疗收入+a.住院护理收入+a.住院手术收入+a.住院高值卫生材料收入+a.住院其他卫生材料收入+a.住院西药收入+a.住院中成药收入+a.住院中药饮片收入+a.住院其他收入)-SUM(a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入+a.住院西药收入+a.住院中成药收入+a.住院中药饮片收入)),4)*100 耗占比
            FROM basic a LEFT JOIN basic_new b ON a.统计时间 = b.统计时间 WHERE a.统计时间 BETWEEN ? AND ?`
            break
    }
    const inserts = [ startDate, endDate ]
    sql = mysql.format(sql, inserts)
    connection.query(sql,function(err, results){
        res.json({code:200,items: results, msg: 'success'})
    })
})
module.exports = router