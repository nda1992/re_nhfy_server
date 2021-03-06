const express = require('express')
const router = express.Router()
const { connection } = require('../../utils/mysqlConnection')
const moment = require('moment')
const mysql = require('mysql')
// 1.获取展示数据的路由
router.get('/getDailyData', async (req, res, next) => {
    const today = moment()
    const temp_date = today.subtract(1, 'days').format('YYYY-MM-DD')
    let sql = `
    select (a.门诊人次+a.急诊人次)门急诊人次,a.入院人数,a.出院人数,a.在院人数,
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
        const zyrs = parseInt(result[0].在院人数)
        const temp_json = {
            '门急诊人次': temp_mjz,
            '入院人数': temp_ry,
            '出院人数': temp_cy,
            '门急诊收入': temp_inpatient,
            '住院收入': temp_outpatient,
            '全院收入': temp_all,
            '药占比': temp_yzb,
            '耗占比': temp_hzb,
            '在院人数': zyrs
        }
        res.json({code:200,result:temp_json})
    })
})
// 按时间段统计门急诊、住院或全院费用
router.post('/getRevenue', async (req, res, next) => {
    const { startDate, endDate, type } = req.body   // type=1:门诊，type=2:住院，type=3:全院
    let sql = ``
    let tip = ``
    switch (type) {
			// 门诊
			case '门诊':
					sql = `SELECT
					SUM(a.门诊人次) 门诊人次,
					SUM(a.急诊人次) 急诊人次,
					SUM(a.门急诊诊察收入+a.门急诊检查收入+a.门急诊化验收入+a.门急诊护理收入+a.门急诊治疗收入+a.门急诊手术收入+a.门急诊卫生材料收入+a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入+a.门急诊其他收入) 门急诊总收入,
					SUM(a.门急诊诊察收入+a.门急诊护理收入+a.门急诊治疗收入+a.门急诊手术收入+a.门急诊其他收入) 门急诊医疗服务收入,
					SUM(a.门急诊诊察收入+a.门急诊检查收入+a.门急诊化验收入+a.门急诊护理收入+a.门急诊治疗收入+a.门急诊手术收入+a.门急诊其他收入) 门急诊医疗有效收入,
					SUM(a.门急诊诊察收入)门急诊诊察收入,SUM(a.门急诊检查收入)门急诊检查收入,
					SUM(a.门急诊化验收入)门急诊化验收入,SUM(a.门急诊护理收入)门急诊护理收入,SUM(a.门急诊治疗收入)门急诊治疗收入,
					SUM(a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入) 门急诊药品收入,
					SUM(a.门急诊手术收入)门急诊手术收入,SUM(a.门急诊卫生材料收入) 门急诊卫生材料收入,SUM(a.门急诊西药收入)门急诊西药收入,
					SUM(a.门急诊中成药收入)门急诊中成药收入,SUM(a.门急诊中药饮片收入)门急诊中药饮片收入,SUM(a.门急诊其他收入)门急诊其他收入,
					ROUND(SUM(a.门急诊西药收入+a.门急诊中成药收入-b.门急诊国家谈判品种)/SUM(a.门急诊诊察收入+a.门急诊检查收入+a.门急诊化验收入+a.门急诊护理收入+a.门急诊治疗收入+a.门急诊手术收入+a.门急诊卫生材料收入+a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入+a.门急诊其他收入),4)*100 药占比,
					ROUND(SUM(a.门急诊卫生材料收入)/(SUM(a.门急诊诊察收入+a.门急诊检查收入+a.门急诊化验收入+a.门急诊护理收入+a.门急诊治疗收入+a.门急诊手术收入+a.门急诊卫生材料收入+a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入+a.门急诊其他收入)-SUM(a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入)),4)*100 耗占比
					FROM basic a LEFT JOIN basic_new b on a.统计时间=b.统计时间 WHERE a.统计时间 BETWEEN ? AND ?`
					tip = '新系统门急诊收入和药耗占比'
					break
			// 住院
			case '住院':
					sql = `SELECT
					SUM(a.入院人数) 入院人数,
					SUM(a.出院人数) 出院人数,
					ROUND(SUM(a.住院床位收入+a.住院诊察收入+a.住院检查收入+a.住院化验收入+a.住院治疗收入+a.住院护理收入+a.住院手术收入+a.住院高值卫生材料收入+a.住院其他卫生材料收入+a.住院西药收入+a.住院中药饮片收入+a.住院中成药收入+a.住院其他收入),2) 住院总收入,
					ROUND(SUM(a.住院床位收入+a.住院诊察收入+a.住院治疗收入+a.住院护理收入+a.住院手术收入+a.住院其他收入),2) 住院医疗服务收入,
					ROUND(SUM(a.住院床位收入+a.住院诊察收入+a.住院检查收入+a.住院化验收入+a.住院治疗收入+a.住院护理收入+a.住院手术收入+a.住院其他收入),2) 住院医疗有效收入,
					ROUND(SUM(a.住院西药收入+a.住院中药饮片收入+a.住院中成药收入),2) 住院药品收入,
					SUM(a.住院高值卫生材料收入+a.住院其他卫生材料收入) 住院卫生材料收入,
					SUM(a.住院床位收入)住院床位收入,SUM(a.住院诊察收入)住院诊察收入,SUM(a.住院检查收入)住院检查收入,
					SUM(a.住院化验收入)住院化验收入,SUM(a.住院治疗收入)住院治疗收入,SUM(a.住院护理收入)住院护理收入,SUM(a.住院手术收入)住院手术收入,
					SUM(a.住院高值卫生材料收入)住院高值卫生材料收入,SUM(a.住院其他卫生材料收入)住院其他卫生材料收入,SUM(a.住院西药收入)住院西药收入,
					SUM(a.住院中药饮片收入)住院中药饮片收入,SUM(a.住院中成药收入)住院中成药收入,SUM(a.住院其他收入)住院其他收入,
					ROUND(SUM(a.住院西药收入+a.住院中成药收入-b.住院国家谈判品种)/SUM(a.住院床位收入+a.住院诊察收入+a.住院检查收入+a.住院化验收入+a.住院治疗收入+a.住院护理收入+a.住院手术收入+a.住院高值卫生材料收入+a.住院其他卫生材料收入+a.住院西药收入+a.住院中成药收入+a.住院中药饮片收入+a.住院其他收入),4)*100 药占比,
					ROUND(SUM(a.住院高值卫生材料收入+a.住院其他卫生材料收入)/(SUM(a.住院床位收入+a.住院诊察收入+a.住院检查收入+a.住院化验收入+a.住院治疗收入+a.住院护理收入+a.住院手术收入+a.住院高值卫生材料收入+a.住院其他卫生材料收入+a.住院西药收入+a.住院中成药收入+a.住院中药饮片收入+a.住院其他收入)-SUM(a.住院西药收入+a.住院中成药收入+a.住院中药饮片收入)),4)*100 耗占比
					FROM basic a LEFT JOIN basic_new b ON a.统计时间=b.统计时间 WHERE a.统计时间 BETWEEN ? AND ?`
					tip = '新系统住院收入和药耗占比'
					break
			// 全院    
			case '全院':
					sql = `SELECT
					SUM(a.门诊人次) 门诊人次,
					SUM(a.急诊人次) 急诊人次,
					SUM(a.入院人数) 入院人数,
					SUM(a.出院人数) 出院人数,
					ROUND(SUM(a.门急诊诊察收入+a.门急诊检查收入+a.门急诊化验收入+a.门急诊护理收入+a.门急诊治疗收入+a.门急诊手术收入+a.门急诊卫生材料收入+a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入+a.门急诊其他收入)/SUM(a.门诊人次+a.急诊人次),2) 门诊人均费用,
					ROUND(SUM(a.住院床位收入+a.住院诊察收入+a.住院检查收入+a.住院化验收入+a.住院治疗收入+a.住院护理收入+a.住院手术收入+a.住院高值卫生材料收入+a.住院其他卫生材料收入+a.住院西药收入+a.住院中药饮片收入+a.住院中成药收入+a.住院其他收入)/SUM(a.出院人数),2) 住院人均费用,
					SUM(a.住院床位收入+a.住院诊察收入+a.门急诊诊察收入+a.住院检查收入+a.门急诊检查收入+a.住院化验收入+a.门急诊化验收入+a.住院治疗收入+a.门急诊治疗收入+a.住院护理收入+a.门急诊护理收入+a.住院手术收入+a.门急诊手术收入+a.住院高值卫生材料收入+a.门急诊卫生材料收入+a.住院其他卫生材料收入+a.住院西药收入+a.住院中药饮片收入+a.住院中成药收入+a.门急诊西药收入+a.门急诊中成药收入+a.门急诊中药饮片收入+a.住院其他收入+a.门急诊其他收入) 全院总收入,
					SUM(a.住院床位收入+a.住院诊察收入+a.门急诊诊察收入+a.住院治疗收入+a.门急诊治疗收入+a.住院护理收入+a.门急诊护理收入+a.住院手术收入+a.门急诊手术收入+a.住院其他收入+a.门急诊其他收入)全院医疗服务收入,
					SUM(a.住院床位收入+a.住院诊察收入+a.门急诊诊察收入+a.住院检查收入+a.门急诊检查收入+a.住院化验收入+a.门急诊化验收入+a.住院治疗收入+a.门急诊治疗收入+a.住院护理收入+a.门急诊护理收入+a.住院手术收入+a.门急诊手术收入+a.住院其他收入+a.门急诊其他收入)全院医疗有效收入,
					SUM(a.住院床位收入)全院床位收入,
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
					tip = '新系统全院收入和药耗占比'
					break
        }
    const inserts = [ startDate, endDate ]
    sql = mysql.format(sql, inserts)
    connection.query(sql,function(err, results){
      res.json({code:200,items: results, msg: 'success',tip: tip})
    })
})
module.exports = router