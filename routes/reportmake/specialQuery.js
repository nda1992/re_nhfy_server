const express = require('express')
const router = express.Router()
const {connection} = require('../../utils/oracleConnection')
const oracledb = require('oracledb')


// 门诊和住院各科室财务分类收入
router.post('/searchDeptOperate/ksflsr',async (req,res,next)=>{    // 门诊科室分类收入
    const data = req.body
    const start = data['startDate'].concat(' 00:00:00')
    const end = data['endDate'].concat(' 23:59:59')
    let sql = ``
    // const start = '2021-08-05 00:00:00'
    // const end = '2021-08-05 23:59:59'
    if (data.type==='1') {
        sql = `SELECT ROW_NUMBER() OVER (ORDER BY DEPT_NAME) AS xh, DEPT_NAME,
        SUM(CASE WHEN 财务分类 IN ('诊查费','病理会诊') THEN 金额 ELSE 0 END) 诊察费,
        SUM(CASE WHEN 财务分类 IN ('检查','CT','放射','核磁','黑白B超','腔内B超','浅表B超','腹部B超','脑电图','心电图','心脏B超','血管B超','尸体病检','B超费','X线胶片','骨密度') THEN 金额 ELSE 0 END) 检查费,
        SUM(CASE WHEN 财务分类 IN ('免疫','细菌','组织学诊断','化验','输血前化验','内分泌糖尿病','内分泌甲状腺','分子病理诊断','病理图像分析','免疫组化','内分泌肾上腺','细胞学诊断','生化','临检','肿瘤实验室','核医学科SPECI','肝病研究中心') THEN 金额 ELSE 0 END) 化验费,
        SUM(CASE WHEN 财务分类 IN ('护理') THEN 金额 ELSE 0 END) 护理费,
        SUM(CASE WHEN 财务分类 IN ('治疗','输氧','护婴','DSA','碎石','注射','血液透析','床位') THEN 金额 ELSE 0 END) 治疗费,
        SUM(CASE WHEN 财务分类 IN ('接生','手术','麻醉','眼科晶状体手术') THEN 金额 ELSE 0 END) 手术费,
        SUM(CASE WHEN 财务分类 IN ('材料','高值耗材') THEN 金额 ELSE 0 END) 卫生材料费,
        SUM(CASE WHEN 财务分类 IN ('西药') THEN 金额 ELSE 0 END) 西药费,
        SUM(CASE WHEN 财务分类 IN ('中草药') THEN 金额 ELSE 0 END) 中药饮片费,
        SUM(CASE WHEN 财务分类 IN ('中成药') THEN 金额 ELSE 0 END) 中成药费,
        SUM(CASE WHEN 财务分类 IN ('输血','其他','空调降温','血液制品','病理摄影','营养制剂') THEN 金额 ELSE 0 END) 其他费,
        SUM(CASE WHEN 财务分类 IN ('免疫','细菌','组织学诊断','化验','输血前化验','内分泌糖尿病','内分泌甲状腺','分子病理诊断','病理图像分析','免疫组化','内分泌肾上腺','细胞学诊断','生化','临检','肿瘤实验室','核医学科SPECI','肝病研究中心','诊查费','病理会诊','检查','CT','放射','核磁','黑白B超','腔内B超','浅表B超','腹部B超','脑电图','心电图','心脏B超','血管B超','尸体病检','B超费','X线胶片','骨密度','护理','治疗','输氧','护婴','DSA','碎石','注射','血液透析','床位','接生','手术','麻醉','眼科晶状体手术','材料','高值耗材','西药','中草药','中成药','输血','其他','空调降温','血液制品','病理摄影','营养制剂') THEN 金额 ELSE 0 END) 总费用 
        FROM (SELECT DEPT_NAME,STAT_DXM_NAME 财务分类,SUM(ACVALUE) 金额 FROM CHG.CHG_OUTPATIENT_COST WHERE CHARGE_TIME BETWEEN TO_DATE('${start}','yyyy-MM-dd hh24:mi:ss') AND TO_DATE('${end}', 'yyyy-MM-dd hh24:mi:ss') AND IS_DELETE='N' GROUP BY STAT_DXM_NAME,DEPT_NAME ORDER BY DEPT_NAME)temp GROUP BY DEPT_NAME`
    } else if (data.type==='2') {
        sql = `SELECT ROW_NUMBER() OVER (ORDER BY DEPT_NAME) AS xh, 
		dept_name as DEPT_NAME,
        SUM(CASE WHEN STATITEM_CODE IN('21') then 金额 else 0 end) 床位费,
        SUM(CASE WHEN STATITEM_CODE IN('06','63') then 金额 else 0 end) 诊察费,
        SUM(CASE WHEN STATITEM_CODE IN('23','30','32','35','44','45','46','47','48','49','57','58','67','71','74','75') then 金额 else 0 end) 检查费,
        SUM(CASE WHEN STATITEM_CODE IN('24','40','41','42','43','53','54','55','56','60','61','62','65','66','68','69','70','73') then 金额 else 0 end) 化验费,
        SUM(CASE WHEN STATITEM_CODE IN('59') then 金额 else 0 end) 护理费,
        SUM(CASE WHEN STATITEM_CODE IN('22','26','27','29','31','39','51') then 金额 else 0 end) 治疗费,
        SUM(CASE WHEN STATITEM_CODE IN('28','33','34','72') then 金额 else 0 end) 手术费,
        SUM(CASE WHEN STATITEM_CODE IN('77') then 金额 else 0 end) 高值耗材费,
        SUM(CASE WHEN STATITEM_CODE IN('36') then 金额 else 0 end) 卫生材料费,
        SUM(CASE WHEN STATITEM_CODE IN('01') then 金额 else 0 end) 西药费,
        SUM(CASE WHEN STATITEM_CODE IN('03') then 金额 else 0 end) 中药饮片费,
        SUM(CASE WHEN STATITEM_CODE IN('02') then 金额 else 0 end) 中成药费,
        SUM(CASE WHEN STATITEM_CODE IN('05','38','50','64','76','52','25') then 金额 else 0 end) 其他费,
        SUM(CASE WHEN STATITEM_CODE IN('23','30','32','35','44','45','46','47','48','49','57','58','67','71','74','75','21','06','63','24','40','41','42','43','53','54','55','56','60','61','62','65','66','68','69','70','73','59','22','26','27','29','31','39','51','28','33','34','72','77','36','01','02','03','05','38','50','64','76','52','25') then 金额 else 0 end) 总费用
        FROM (select a.dept_name,a.STATITEM_CODE,b.ITEM_NAME,sum(a.RETAIL_VALUE) 金额 from CHG.CHG_INPATIENT_FEE_SPECI a 
        left join BASEDATA.BAS_STAT_ITEM b
        on a.STATITEM_CODE = b.CODE 
        where a.CHARGE_DATE between to_date('${start}','yyyy-MM-dd hh24:mi:ss') and to_date('${end}','yyyy-MM-dd hh24:mi:ss') and a.IS_DELETE='N' group by a.dept_name,a.STATITEM_CODE,b.ITEM_NAME
        )temp GROUP BY DEPT_NAME`
    } 
    const result = (await connection).execute(sql)
    res.json({code:200,msg:'数据获取成功',items:(await result).rows})
    // res.json({code:200,msg:data})
})
module.exports = router