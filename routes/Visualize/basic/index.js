const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const { Oracleconnection } = require('../../../utils/oracleConnection')
const { connection } = require('../../../utils/mysqlConnection')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Shanghai')
// 全院汇总主题的所有路由

router.get('/getDailyData', async (req, res, next) => {
    const today = moment()
    const temp_date = today.subtract(1, 'days').format('YYYY-MM-DD')
    let sql = `
    select (a.门诊人次+a.急诊人次)门急诊人次,a.入院人数,a.出院人数,
    (a.门急诊诊察收入+a.门急诊检查收入+a.门急诊化验收入+a.门急诊护理收入+a.门急诊治疗收入+a.门急诊手术收入+a.门急诊卫生材料收入+a.门急诊西药收入+a.门急诊中药饮片收入+a.门急诊中成药收入+a.门急诊其他收入)门急诊收入,
    (a.住院床位收入+a.住院诊察收入+a.住院检查收入+a.住院化验收入+a.住院手术收入+a.住院治疗收入+a.住院护理收入+a.住院西药收入+a.住院中药饮片收入+a.住院中成药收入+a.住院高值卫生材料收入+a.住院其他卫生材料收入+a.住院其他收入)住院收入,
    (a.门急诊诊察收入+a.门急诊检查收入+a.门急诊化验收入+a.门急诊护理收入+a.门急诊治疗收入+a.门急诊手术收入+a.门急诊卫生材料收入+a.门急诊西药收入+a.门急诊中药饮片收入+a.门急诊中成药收入+a.门急诊其他收入+a.住院床位收入+a.住院诊察收入+a.住院检查收入+a.住院化验收入+a.住院手术收入+a.住院治疗收入+a.住院护理收入+a.住院西药收入+a.住院中药饮片收入+a.住院中成药收入+a.住院高值卫生材料收入+a.住院其他卫生材料收入+a.住院其他收入)全院收入,
    ROUND((a.住院西药收入+a.住院中成药收入-b.住院国家谈判品种+a.门急诊西药收入+a.门急诊中成药收入-b.门急诊国家谈判品种)/(a.住院床位收入+a.住院诊察收入+a.住院检查收入+a.住院化验收入+a.住院治疗收入+a.住院护理收入+a.住院手术收入+a.住院高值卫生材料收入+a.住院其他卫生材料收入+a.住院西药收入+a.住院中成药收入+a.住院中药饮片收入+a.住院其他收入+a.门急诊诊察收入+a.门急诊检查收入+a.门急诊化验收入+a.门急诊护理收入+a.门急诊治疗收入+a.门急诊手术收入+a.门急诊卫生材料收入+a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入+a.门急诊其他收入),4)*100 药占比,
    ROUND((a.住院高值卫生材料收入+a.住院其他卫生材料收入+a.门急诊卫生材料收入)/((a.门急诊诊察收入+a.门急诊检查收入+a.门急诊化验收入+a.门急诊护理收入+a.门急诊治疗收入+a.门急诊手术收入+a.门急诊卫生材料收入+a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入+a.门急诊其他收入+a.住院床位收入+a.住院诊察收入+a.住院检查收入+a.住院化验收入+a.住院治疗收入+a.住院护理收入+a.住院手术收入+a.住院高值卫生材料收入+a.住院其他卫生材料收入+a.住院西药收入+a.住院中成药收入+a.住院中药饮片收入+a.住院其他收入)-(a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入+a.住院西药收入+a.住院中成药收入+a.住院中药饮片收入)),4)*100 耗占比
    from basic a left join basic_new b on a.统计时间=b.统计时间 where a.统计时间 between ? and ?`
    const inserts = [ temp_date, temp_date ]
    sql = mysql.format(sql,inserts)
    connection.query(sql, function(err, result) {
        const temp_inpatient = Math.floor(parseFloat(result[0].门急诊收入)*100,2)/100
        const temp_outpatient = Math.floor(parseFloat(result[0].住院收入)*100,2)/100
        const temp_all = Math.floor(parseFloat(result[0].全院收入)*100,2)/100
        const temp_mjz = parseInt(result[0].门急诊人次)
        const temp_ry = parseInt(result[0].入院人数)
        const temp_cy = parseInt(result[0].出院人数)
        const temp_yzb = result[0].药占比
        const temp_hzb = result[0].耗占比
        const temp_json = {
            '门急诊人次': temp_mjz,
            '入院人数': temp_ry,
            '出院人数': temp_cy,
            '门急诊收入': temp_inpatient,
            '住院收入': temp_outpatient,
            '全院收入': temp_all,
            '药占比': temp_yzb,
            '耗占比': temp_hzb
        }
        res.json({code:200,result:temp_json})
    })
})

module.exports = router