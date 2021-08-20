const express = require('express')
const router = express.Router()
const {connection} = require('../../utils/oracleConnection')

// test
router.get('/test',async (req,res,next)=>{
    const start = '2021-08-05 00:00:00'
    const end = '2021-08-05 23:59:59'
    // const sql = `SELECT DEPT_NAME,SUM(CASE WHEN 财务分类 IN ('诊查费','病理会诊') THEN 金额 ELSE 0 END) 诊察费,SUM(CASE WHEN 财务分类 IN ('检查','CT','放射','核磁','黑白B超','腔内B超','浅表B超','腹部B超','脑电图','心电图','心脏B超','血管B超','尸体病检','B超费','X线胶片','骨密度') THEN 金额 ELSE 0 END) 检查费,SUM(CASE WHEN 财务分类 IN ('免疫','细菌','组织学诊断','化验','输血前化验','内分泌糖尿病','内分泌甲状腺','分子病理诊断','病理图像分析','免疫组化','内分泌肾上腺','细胞学诊断','生化','临检','肿瘤实验室','核医学科SPECI','肝病研究中心') THEN 金额 ELSE 0 END) 化验费,SUM(CASE WHEN 财务分类 IN ('护理') THEN 金额 ELSE 0 END) 护理费,SUM(CASE WHEN 财务分类 IN ('治疗','输氧','护婴','DSA','碎石','注射','血液透析','床位') THEN 金额 ELSE 0 END) 治疗费,SUM(CASE WHEN 财务分类 IN ('接生','手术','麻醉','眼科晶状体手术') THEN 金额 ELSE 0 END) 手术费,SUM(CASE WHEN 财务分类 IN ('材料','高值耗材') THEN 金额 ELSE 0 END) 卫生材料费,SUM(CASE WHEN 财务分类 IN ('西药') THEN 金额 ELSE 0 END) 西药费,SUM(CASE WHEN 财务分类 IN ('中草药') THEN 金额 ELSE 0 END) 中药饮片费,SUM(CASE WHEN 财务分类 IN ('中成药') THEN 金额 ELSE 0 END) 中成药费,SUM(CASE WHEN 财务分类 IN ('输血','其他','空调降温','血液制品','病理摄影','营养制剂') THEN 金额 ELSE 0 END) 其他费 FROM (SELECT DEPT_NAME,STAT_DXM_NAME 财务分类,SUM(ACVALUE) 金额 FROM CHG.CHG_OUTPATIENT_COST WHERE CHARGE_TIME BETWEEN TO_DATE('${start}','yyyy-MM-dd hh24:mi:ss') AND TO_DATE('${end}', 'yyyy-MM-dd hh24:mi:ss') AND IS_DELETE='N' GROUP BY STAT_DXM_NAME,DEPT_NAME ORDER BY DEPT_NAME)temp GROUP BY DEPT_NAME`
    const sql = `SELECT * FROM CHG.CHG_OUTPATIENT_COST WHERE CHARGE_TIME BETWEEN TO_DATE('${start}', 'yyyy-mm-dd hh24:mi:ss') AND TO_DATE('${end}', 'yyyy-mm-dd hh24:mi:ss') AND DEPT_NAME='门诊呼吸内科' AND ROWNUM<6`
    // res.json({code:200,msg:sql})
   (await connection).execute(sql,function(err,result){
       console.log(result)
       res.json({code:200,msg:'success'})
   })
})
module.exports = router