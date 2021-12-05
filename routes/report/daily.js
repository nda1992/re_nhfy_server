const express = require('express')
const router = express.Router()
const { querySql } = require('../../utils/mssqlConnection')
const { connection } = require('../../utils/mysqlConnection')
const mysql = require('mysql')

// 分类查询（在编、卫生技术人员（如果时专业技术人员，则只要包含有专技的都算进来）、医师、护理）
router.post('/getEmployeeNum', async (req, res, next) => {
	// type为类别
	const { type, endDate } = req.body
	let sql = ``
	switch (type) {
		case "在岗人数":
			sql = `select count(1)总人数 from v_hrp_emp where 在职状态 not in ('已离职','已退休','未在职','离休','离职','离退休') and 人员类别 like '%在册%' and ([进单位时间] < '${endDate}' or [进单位时间] is null)`
			break
		case '在编':
			sql = `select count(*)总人数 from v_hrp_emp where 在职状态 not in ('已离职','已退休','未在职','离休','离职','离退休') and 人员类别 like '%在册%' and 用工形式 like '%编%' and ([进单位时间] < '${endDate}' or [进单位时间] is null) `
			break
		case '技术人员':
			sql = `select count(*)总人数 from v_hrp_emp where 在职状态 not in ('已离职','已退休','未在职','离休','离职','离退休') and 人员类别 like '%在册%' and (卫生人员类别 like '%医%' or 卫生人员类别 like '%护%' or 卫生人员类别 like '%药%' ) and ([进单位时间] < '${endDate}' or [进单位时间] is null)`
			break
		case '专业技术人员':
			sql = `select count(*)总人数 from v_hrp_emp where 在职状态 not in ('已离职','已退休','未在职','离休','离职','离退休') and 人员类别 like '%在册%' and (卫生人员类别 like '%专技%') and ([进单位时间] < '${endDate}' or [进单位时间] is null)`
			break
		case '医师':
			sql = `select count(*)总人数 from v_hrp_emp where 在职状态 not in ('已离职','已退休','未在职','离休','离职','离退休') and 人员类别 like '%在册%' and (卫生人员类别 like '%医师%') and ([进单位时间] < '${endDate}' or [进单位时间] is null) `
			break
		case '护理':
			sql = `select count(*)总人数 from v_hrp_emp where 在职状态 not in ('已离职','已退休','未在职','离休','离职','离退休') and 人员类别 like '%在册%' and (卫生人员类别 like '%护%') and ([进单位时间] < '${endDate}' or [进单位时间] is null) `
			break
		case '按学历汇总':
			sql = `select 学历,COUNT(1)人数 from v_hrp_emp where 在职状态 not in ('已离职','已退休','未在职','离休','离职','离退休') and 人员类别 like '%在册%' and ([进单位时间] < '${endDate}' or [进单位时间] is null) group by 学历 order by 人数 desc`
			break
		case '按人员类别汇总':
			sql = `select SUBSTRING([卫生人员类别], 1, 2)人员类别,count(*)人数 from v_hrp_emp where 在职状态 not in ('已离职','已退休','未在职','离休','离职','离退休') and 人员类别 like '%在册%' and ([进单位时间] < '${endDate}' or [进单位时间] is null) group by SUBSTRING([卫生人员类别], 1, 2) order by 人数 desc`
			break
	}
	const result = await querySql(sql)
	res.json({code: 200,item: result.recordsets[0]})
})

// 病案室月度数据查询
// 1. 平均住院日
router.post('/getAvgInpatientDay', async (req, res, next) => {
	const { startDate, endDate } = req.body
	let div = parseInt(endDate.slice(-2))-parseInt(startDate.slice(-2)) || 1
	let sql = `SELECT 科室名称,ROUND(SUM(出院者平均住院日)/?,2)平均住院日 from 病案月度详细数据 where 统计时间 between ? and ? group by 科室名称`
	const inserts = [div, startDate, endDate]
	sql = mysql.format(sql, inserts)
	let num = 0
	connection.query(sql,(err, results) => {
		if (results) {
			const items = results.map(e => {
				num++
				return {
					序号: num,
					科室名称: e.科室名称,
					平均住院日: e.平均住院日
				}
			})
			res.json({code:200,items: items })
		} else {
			res.json({code: 201, msg: '查询的数据不存在'})
		}
	})
})

// 病床使用率
router.post('/getInpatientBedRate', async(req, res, next) => {
	const { startDate, endDate } = req.body
	let sql = `SELECT 科室名称,ROUND(SUM(实际占用总床日数)/SUM(实际开放总床日数)*100,2)病床使用率 from 病案月度详细数据 where 统计时间 between ? and ? group by 科室名称`
	const inserts = [startDate, endDate]
	sql = mysql.format(sql, inserts)
	let num = 0
	connection.query(sql, (err, results) => {
		if (results) {
			const items = results.map(e => {
				num++
				return {
					序号: num,
					科室名称: e.科室名称,
					平均住院日: e.病床使用率
				}
			})
			res.json({code: 200, items: items})
		} else {
			res.json({code: 201, msg: '查询的数据不存在'})
		}
	})
})

module.exports = router