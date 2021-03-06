const express = require('express')
const router = express.Router()
const { Oracleconnection } = require('../../utils/oracleConnection')

// 门诊药品和耗材占比
router.post('/getoutpatientMedicineMaterialProp', async (req, res, next) => {
    const { startDate, endDate } = req.body
    const start = startDate.concat(' 00:00:00')
    const end = endDate.concat(' 23:59:59')
    sql = `WITH TEMP AS (
        SELECT ROW_NUMBER() OVER (ORDER BY DEPT_NAME) AS xh, DEPT_NAME 开单科室,
        SUM(CASE WHEN 财务分类 IN ('诊查费','病理会诊') THEN 金额 ELSE 0 END) 诊察费,
        SUM(CASE WHEN 财务分类 IN ('检查','CT','放射','核磁','黑白B超','腔内B超','浅表B超','腹部B超','脑电图','心电图','心脏B超','血管B超','尸体病检','B超费','X线胶片','骨密度') THEN 金额 ELSE 0 END) 检查费,
        SUM(CASE WHEN 财务分类 IN ('免疫','细菌','组织学诊断','化验','输血前化验','内分泌糖尿病','内分泌甲状腺','分子病理诊断','病理图像分析','免疫组化','内分泌肾上腺','细胞学诊断','生化','临检','肿瘤实验室','核医学科SPECI','肝病研究中心') THEN 金额 ELSE 0 END) 化验费,
        SUM(CASE WHEN 财务分类 IN ('护理') THEN 金额 ELSE 0 END) 护理费,
        SUM(CASE WHEN 财务分类 IN ('治疗','输氧','护婴','DSA','碎石','注射','血液透析','床位') THEN 金额 ELSE 0 END) 治疗费,
        SUM(CASE WHEN 财务分类 IN ('接生','手术','麻醉','眼科晶状体手术') THEN 金额 ELSE 0 END) 手术费,
        SUM(CASE WHEN 财务分类 IN ('材料') THEN 金额 ELSE 0 END) 其他卫生材料费,
        SUM(CASE WHEN 财务分类 IN ('高值耗材') THEN 金额 ELSE 0 END) 高值耗材费,
        SUM(CASE WHEN 财务分类 IN ('西药') THEN 金额 ELSE 0 END) 西药费,
        SUM(CASE WHEN 财务分类 IN ('中草药') THEN 金额 ELSE 0 END) 中药饮片费,
        SUM(CASE WHEN 财务分类 IN ('中成药') THEN 金额 ELSE 0 END) 中成药费,
        SUM(CASE WHEN 财务分类 IN ('输血','其他','空调降温','血液制品','病理摄影','营养制剂') THEN 金额 ELSE 0 END) 其他费,
        SUM(CASE WHEN 财务分类 IN ('免疫','细菌','组织学诊断','化验','输血前化验','内分泌糖尿病','内分泌甲状腺','分子病理诊断','病理图像分析','免疫组化','内分泌肾上腺','细胞学诊断','生化','临检','肿瘤实验室','核医学科SPECI','肝病研究中心','诊查费','病理会诊','检查','CT','放射','核磁','黑白B超','腔内B超','浅表B超','腹部B超','脑电图','心电图','心脏B超','血管B超','尸体病检','B超费','X线胶片','骨密度','护理','治疗','输氧','护婴','DSA','碎石','注射','血液透析','床位','接生','手术','麻醉','眼科晶状体手术','材料','高值耗材','西药','中草药','中成药','输血','其他','空调降温','血液制品','病理摄影','营养制剂') THEN 金额 ELSE 0 END) 总收入,
        sum(case when shh is not null then 金额 else 0 end) 国家谈判品种
        FROM (
        SELECT coc.DEPT_NAME,coc.STAT_DXM_NAME 财务分类,SUM(coc.ACVALUE) 金额,wyn.shh as shh FROM CHG.CHG_OUTPATIENT_COST coc 
        LEFT join BASEDATA.BAS_DRG_DICTIONARY bdd
              on coc.item_id = bdd.comid
           LEFT join BASEDATA.BAS_DRG_SPECS_STAT bdss
              on bdss.specid = bdd.specid
             and bdss.clascode = 'SFTJ_004' --门诊发票项目
            left join chk.wz_yzhzb_no wyn
              on wyn.wz_id = coc.item_id
        WHERE coc.CHARGE_TIME BETWEEN TO_DATE('${start}','yyyy-MM-dd hh24:mi:ss') AND TO_DATE('${end}', 'yyyy-MM-dd hh24:mi:ss') AND coc.IS_DELETE='N' GROUP BY coc.STAT_DXM_NAME,coc.DEPT_NAME,wyn.shh
        )temp1 GROUP BY DEPT_NAME
        )
        
        SELECT xh,开单科室,总收入,
        (总收入-其他卫生材料费-高值耗材费-西药费-中药饮片费-中成药费) 医疗有效收入,
        (总收入-其他卫生材料费-高值耗材费-西药费-中药饮片费-中成药费-检查费-化验费) 医疗服务收入,
        ROUND(DECODE((西药费+中成药费-国家谈判品种),0,0,(西药费+中成药费-国家谈判品种)/(总收入)*100),2) 药占比,
        ROUND(DECODE((其他卫生材料费+高值耗材费),0,0,(其他卫生材料费+高值耗材费)/(总收入-西药费-中药饮片费-中成药费)*100),2) 耗占比,
        ROUND(DECODE((总收入-其他卫生材料费-高值耗材费-西药费-中药饮片费-中成药费),0,0,(总收入-其他卫生材料费-高值耗材费-西药费-中药饮片费-中成药费)/总收入*100),2)医疗有效收入占比,
        ROUND(DECODE((总收入-其他卫生材料费-高值耗材费-西药费-中药饮片费-中成药费-检查费-化验费),0,0,(总收入-其他卫生材料费-高值耗材费-西药费-中药饮片费-中成药费-检查费-化验费)/总收入*100),2)医疗服务收入占比
        FROM TEMP
        ORDER BY 开单科室`
    const result = (await Oracleconnection).execute(sql)
    items = (await result).rows
    const lists = items.map(e => {
        return {
            '序号': e.XH,
            '开单科室': e.开单科室,
            '总收入': Math.floor(e.总收入*100)/100,
            '医疗有效收入': Math.floor(e.医疗有效收入*100)/100,
            '医疗服务收入': Math.floor(e.医疗服务收入*100)/100,
            '药占比': Math.floor(e.药占比*100)/100,
            '耗占比': Math.floor(e.耗占比*100)/100,
            '医疗有效收入占比': Math.floor(e.医疗有效收入占比*100)/100,
            '医疗服务收入占比': Math.floor(e.医疗服务收入占比*100)/100,
            '统计时间': startDate.slice(0,7)
        }
    })
    res.json({ code:200, items:lists })
})

// 各科室门诊人均费用
router.post('/getAvgRevenueByDept', async (req, res, next) => {
    const { startDate, endDate } = req.body
    const start = startDate.concat(' 00:00:00')
    const end = endDate.concat(' 23:59:59')
    let sql = `-- 门诊各科室人均费用排名
    WITH T1 AS (
    SELECT DEPT_NAME 科室名称,COUNT(*)总人次 FROM REG.REG_RECORD WHERE STATUS=0 AND pay_status>=1 AND is_delete='N' AND DEPT_ID NOT IN (186) AND
    reg_date BETWEEN TO_DATE('${start}', 'yyyy-mm-dd hh24:mi:ss') AND TO_DATE('${end}', 'yyyy-mm-dd hh24:mi:ss')
    GROUP BY DEPT_NAME
    )
    SELECT T1.科室名称,T1.总人次,T2.总费用,ROUND(DECODE(T2.总费用,0,0,(T2.总费用/T1.总人次)),2) 人均费用 FROM T1 FULL JOIN
    (SELECT DEPT_NAME 科室名称,SUM(ACVALUE) 总费用 FROM CHG.CHG_OUTPATIENT_COST WHERE CHARGE_TIME BETWEEN TO_DATE('${start}','yyyy-MM-dd hh24:mi:ss') AND TO_DATE('${end}', 'yyyy-MM-dd hh24:mi:ss')
    AND IS_DELETE='N' GROUP BY DEPT_NAME) T2 ON T1.科室名称=T2.科室名称 WHERE T1.科室名称 IS NOT NULL AND T1.总人次 IS NOT NULL AND T2.总费用 IS NOT NULL ORDER BY 人均费用 DESC`
    const result = (await Oracleconnection).execute(sql)
    const results = (await result).rows
    let num = 1
    let items = []
    results.forEach(e => {
        let temp =  {
        序号: num,
        科室名称:e.科室名称,
        总人次: e.总人次,
        总费用: Math.floor(e.总费用*100)/100,
        人均费用: Math.floor(e.人均费用*100)/100
        }
        items.push(temp)
        num++
    });
    res.json({code: 200, items: items})
})

router.post('/getAvgRevenueByDoctor', async (req, res, next) => {
    const { startDate, endDate } = req.body
    const start = startDate.concat(' 00:00:00')
    const end = endDate.concat(' 23:59:59')
    sql = `-- 门急诊医生人均费用
    WITH T1 AS (
    SELECT DOCTOR_NAME 开单医生,COUNT(*)总人次 FROM REG.REG_RECORD WHERE STATUS=0 AND pay_status>=1 AND is_delete='N' AND DEPT_ID NOT IN (186) AND
    reg_date BETWEEN TO_DATE('${start}', 'yyyy-mm-dd hh24:mi:ss') AND TO_DATE('${end}', 'yyyy-mm-dd hh24:mi:ss')
    GROUP BY DOCTOR_NAME
    )
    
    SELECT T1.开单医生,T1.总人次,T2.总费用,ROUND(DECODE(T2.总费用,0,0,(T2.总费用/T1.总人次)),2) 人均费用 FROM T1 LEFT JOIN (
    SELECT DOC_NAME 开单医生,SUM(ACVALUE) 总费用 FROM CHG.CHG_OUTPATIENT_COST WHERE CHARGE_TIME BETWEEN TO_DATE('${start}','yyyy-MM-dd hh24:mi:ss') AND TO_DATE('${end}', 'yyyy-MM-dd hh24:mi:ss') AND IS_DELETE='N' GROUP BY DOC_NAME
    ) T2 ON T1.开单医生=T2.开单医生 WHERE T2.总费用 IS NOT NULL ORDER BY 人均费用 DESC`
    const result = (await Oracleconnection).execute(sql)
    const results = (await result).rows
    let num = 1
    let items = []
    results.forEach(e => {
        let temp =  {
        序号: num,
        开单医生:e.开单医生,
        总人次: e.总人次,
        总费用: Math.floor(e.总费用*100)/100,
        人均费用: Math.floor(e.人均费用*100)/100
        }
        items.push(temp)
        num++
    });
    res.json({code: 200, items: items})
})

module.exports = router