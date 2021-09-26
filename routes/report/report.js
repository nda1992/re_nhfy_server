const express = require('express')
const router = express.Router()
const {connection} = require('../../utils/mysqlConnection')
const mysql = require('mysql')
const Advice  = require('../../models/advice')
const {DataTypes} = require('sequelize')
const sequelize = require('../../database/connection')
const dayjs = require('dayjs')
//医疗收入情况表
router.get('/medicalRevenue',(req,res,next)=>{
    const {role,start_date,end_date} = req.query
    const start = start_date
    const end = end_date
    // 返回给前端的object
    let items = []
    if(role!=='admin'){
        res.json({code:404,msg:"您没有权限访问该页面"})
    }else{
        sql="SELECT * FROM web_month_report where 统计时间 between ? and ?"
        const inserts = [start,end]
        sql=mysql.format(sql,inserts)
        connection.query(sql,(err,results)=>{
            for(let result of results) {
                if(result.门诊诊察收入===undefined || result.门诊诊察收入===null||result.门诊诊察收入==='') {
                    continue
                }
                let obj = {}
                obj.时间=result.统计时间.slice(0,4)+'年'+result.统计时间.slice(5,7)+'月'
                //门诊总收入
                const inpatient_revenue = parseFloat(result.门诊医疗总收入)
                //住院总收入
                const outpatient_revenue = parseFloat(result.住院医疗总收入)
                //门诊药品收入
                const inpatient_medicine = parseFloat(result.门诊药品收入)
                //住院药品收入
                const outpatient_medicine = parseFloat(result.住院药品收入)
                //门诊医疗服务收入
                const inpatient_service_revenue = inpatient_revenue-parseFloat(result.门诊检查收入)-parseFloat(result.门诊化验收入)-inpatient_medicine-parseFloat(result.门诊卫生材料收入)
                //门诊医疗有效收入
                const inpatient_useful_revenue = inpatient_revenue-inpatient_medicine-parseFloat(result.门诊卫生材料收入)
                //住院医疗服务收入
                const outpatient_service_revenue = outpatient_revenue-parseFloat(result.住院检查收入)-parseFloat(result.住院化验收入)-outpatient_medicine-parseFloat(result.住院卫生材料收入)
                //住院医疗有效收入
                const outpatient_useful_revenue = outpatient_revenue-outpatient_medicine-parseFloat(result.住院卫生材料收入)
                obj.医疗总收入= parseFloat(result.医疗总收入).toFixed(2)
                obj.门诊总收入= inpatient_revenue.toFixed(2)
                obj.门诊诊察收入=parseFloat(result.门诊诊察收入)
                obj.门诊检查收入=parseFloat(result.门诊检查收入)
                obj.门诊化验收入=parseFloat(result.门诊化验收入)
                obj.门诊治疗收入=parseFloat(result.门诊治疗收入)
                obj.门诊手术收入=parseFloat(result.门诊手术收入)
                obj.门诊卫生材料收入=parseFloat(result.门诊卫生材料收入)
                obj.门诊药品收入=inpatient_medicine.toFixed(2)
                obj.门诊西药收入=parseFloat(result.门诊西药收入)
                obj.门诊中成药收入=parseFloat(result.门诊中成药收入)
                obj.门诊中药饮片收入=parseFloat(result.门诊中药饮片收入)
                obj.门诊其他收入=parseFloat(result.门诊其他收入)
                obj.门诊医疗服务收入= (inpatient_service_revenue).toFixed(2)
                obj.门诊医疗有效收入= (inpatient_useful_revenue).toFixed(2)
                obj.住院总收入 = outpatient_revenue.toFixed(2)
                obj.住院床位收入=parseFloat(result.住院床位收入)
                obj.住院诊察收入=parseFloat(result.住院诊察收入)
                obj.住院检查收入=parseFloat(result.住院检查收入)
                obj.住院化验收入=parseFloat(result.住院化验收入)
                obj.住院治疗收入=parseFloat(result.住院治疗收入)
                obj.住院手术收入=parseFloat(result.住院手术收入)
                obj.住院护理收入=parseFloat(result.住院护理收入)
                obj.住院卫生材料收入=parseFloat(result.住院卫生材料收入)
                obj.住院药品收入 = outpatient_medicine.toFixed(2)
                obj.住院西药收入=parseFloat(result.住院西药收入)
                obj.住院中成药收入=parseFloat(result.住院中成药收入)
                obj.住院中草药收入=parseFloat(result.住院中药饮片收入)
                obj.住院其他收入=parseFloat(result.住院其他收入)
                obj.住院医疗服务收入= outpatient_service_revenue.toFixed(2)
                obj.住院医疗有效收入= outpatient_useful_revenue.toFixed(2)
                obj.医疗服务收入 = (inpatient_service_revenue + outpatient_service_revenue).toFixed(2)
                obj.医疗有效收入 = (inpatient_useful_revenue + outpatient_useful_revenue).toFixed(2)
                obj.药占比 = parseFloat(result.药占比).toFixed(2)
                obj.耗占比 = parseFloat(result.耗占比).toFixed(2)
                obj.门急诊人次 = result.门急诊人次
                obj.门急诊人均费用 = (inpatient_revenue/result.门急诊人次).toFixed(2)
                obj.住院人次 = result.住院人次
                obj.住院人均费用 = (outpatient_revenue/result.住院人次).toFixed(2)
                obj.平均住院日 = result.平均住院日
                items.push(obj)
                }
            res.json({code:200,msg:'获取数据成功',items:items})
    })
    }
})


//用户提交的反馈
router.post('/usersAdvice',async (req,res,next)=>{
    const { userCode, content } = req.query
    await Advice(sequelize,DataTypes).create({userCode:userCode,content:content}).then(result=>{
        if(result){
            res.json({code:200,msg:'提交成功，感谢您的反馈'})
        }else{
            res.json({code:201,msg:'提交失败'})
        }
    })
})

module.exports=router