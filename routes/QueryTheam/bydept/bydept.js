const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const { Oracleconnection } = require('../../../utils/oracleConnection')
const { connection } = require('../../../utils/mysqlConnection')

// 根据科室名称查询人数
router.post('/getNumCountByDept', async (req, res, next) => {
    const { sys, type, dept, startDate, endDate } = req.body
    const start = startDate.concat(' 00:00:00')
    const end = endDate.concat(' 23:59:59')
    let items = new Object()
    sql = ``
    switch(sys) {
        case '新系统':
            if (type === '门诊') {
                sql = `SELECT COUNT(*) 总人次 FROM REG.REG_RECORD WHERE STATUS=0 AND pay_status>=1 AND is_delete='N' AND DEPT_ID NOT IN (9356,9280,186,132,141) AND
                reg_date BETWEEN TO_DATE('${start}', 'yyyy-mm-dd hh24:mi:ss') AND TO_DATE('${end}', 'yyyy-mm-dd hh24:mi:ss') AND DEPT_NAME='${dept}'`
            } else if (type === '入院') {
                sql = `SELECT COUNT(*) 总人数 FROM INP.INP_INPATIENT II WHERE II.IS_DELETE='N' AND II.STATUS<>10 AND II.STATUS<>1 AND II.DEPT_ID<>186 AND II.ID NOT IN (SELECT INPATIENT_ID FROM INP.INP_INPAT_TEST) AND II.ORG_CODE='NHFY' 
                AND IN_DATE>=TO_DATE('${start}', 'yyyy-mm-dd hh24:mi:ss')
                AND IN_DATE<=TO_DATE('${end}', 'yyyy-mm-dd hh24:mi:ss')
                AND II.DEPT_NAME='${dept}'`
            } else if (type === '出院') {
                sql = `SELECT COUNT(*) 总人数 FROM INP.INP_INPATIENT II WHERE II.IS_DELETE='N' AND II.STATUS IN (4,5,6,7) AND II.DEPT_ID<>186 
                AND II.ID NOT IN (SELECT INPATIENT_ID FROM INP.INP_INPAT_TEST) AND II.ORG_CODE='NHFY' 
                AND PATIENT_TYPE_NAME<>'留观'
                AND OUT_DATE>=TO_DATE('${start}', 'yyyy-mm-dd hh24:mi:ss')
                AND OUT_DATE<=TO_DATE('${end}', 'yyyy-mm-dd hh24:mi:ss')
                AND II.DEPT_NAME ='${dept}'`
            }
            break
        case '旧系统':
            if (type === '门诊') {
                sql = `SELECT SUM(门诊人次) 门诊人次 FROM db2各科室门急诊人次 WHERE 统计时间 BETWEEN ? AND ? AND 科室名称=?`
            } else if (type === '入院') {
                sql = `SELECT SUM(入院人数) 入院人数 FROM db2各科室入院人数 WHERE 统计时间 BETWEEN ? AND ? AND 科室名称=?`
            } else if (type === '出院') {
                sql = `SELECT SUM(出院人数) 出院人数 FROM db2各科室出院人数 WHERE 统计时间 统计时间 BETWEEN ? AND ? AND 科室名称=?`
            }
            break
        }
        if (sys === '新系统') {
            const result = (await Oracleconnection).execute(sql)
            items = (await result).rows
            res.json({ code:200, items:items, 科室名称: dept })
        } else {
            const inserts = [ startDate, endDate, dept ]
            sql = mysql.format(sql, inserts)
            // console.log(sql)
            connection.query(sql, function(err, results){
                res.json({ code:200, items: result, 科室名称: dept })
            })
        }
})

module.exports = router