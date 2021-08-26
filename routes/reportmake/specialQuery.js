const express = require('express')
const router = express.Router()
const {connection} = require('../../utils/oracleConnection')
const oracledb = require('oracledb')


// 门诊和住院各科室财务分类收入
router.post('/searchDeptOperate/ksflsr',async (req,res,next)=>{    // 门诊科室分类收入
    const data = req.body
    const start = data.startDate.concat(' 00:00:00')
    const end = data.endDate.concat(' 23:59:59')
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

router.post('/searchDeptOperate/deptMaterialMedicineDetail',async (req,res,next)=>{
    const data = req.body
    console.log(data)
    // const { startDate, endDate, Depttype, Catetype } = req.body
    const start = data['startDate'].concat(' 00:00:00')
    const end = data['endDate'].concat(' 23:59:59')
    let sql = ``
    let flag = ``
    let title = ``
    // 门诊药品
    if (data.Depttype==='1'&&data.Catetype==='1') {
        sql = `select ROW_NUMBER() OVER (ORDER BY 开单科室) AS xh,开单科室,项目编码,项目名称,大项目编码,大项目名称,单位,单价,数量,总金额,
        CASE WHEN 大项目名称='中草药' THEN '是' ELSE '否' END 是否中草药,
        CASE WHEN 国家谈判品种 IS NOT NULL THEN '是' ELSE '否' END 是否国家谈判品种,
        CASE WHEN 重点监管药品 IS NOT NULL THEN '是' ELSE '否' END 是否重点监管药品,
        CASE WHEN 国家辅助用药 IS NOT NULL THEN '是' ELSE '否' END 是否国家辅助用药,
        CASE WHEN PPI IS NOT NULL THEN '是' ELSE '否' END 是否PPI,
        CASE WHEN 抗菌药品 IS NOT NULL THEN '是' ELSE '否' END 是否抗菌药品,
        CASE WHEN 中枢止吐 IS NOT NULL THEN '是' ELSE '否' END 是否中枢止吐,
        CASE WHEN 口服中成药 IS NOT NULL THEN '是' ELSE '否' END 是否口服中成药,
        CASE WHEN 中药注射剂 IS NOT NULL THEN '是' ELSE '否' END 是否中药注射剂
        FROM (select A.DEPT_NAME 开单科室,A.ITEM_ID 项目编码,A.ITEM_NAME 项目名称,A.STAT_DXM_CODE 大项目编码,B.ITEM_NAME 大项目名称,A.UNIT_NAME 单位,A.PRICE 单价,sum(A.AMOUNT) 数量,(sum(A.AMOUNT)*A.PRICE) 总金额,
        wyn.shh 国家谈判品种,bdsp.id 重点监管药品,bdsp1.id 国家辅助用药,bdsp2.id PPI,bdsp3.id 抗菌药品,bdsp4.id 中枢止吐,bdsp5.id 口服中成药,bdsp6.id 中药注射剂
        from chg.chg_outpatient_cost A LEFT JOIN BASEDATA.BAS_STAT_ITEM B
        ON A.STAT_DXM_CODE = B.CODE
        inner join BASEDATA.BAS_DRG_DICTIONARY bdd on A.item_id = bdd.comid
        left join BASEDATA.Bas_Drg_Specs_Property bdsp on bdsp.specid = bdd.specid and bdsp.control_value='1' and bdsp.dict_code='2004'
            left join BASEDATA.Bas_Drg_Specs_Property bdsp1
            on bdsp1.specid = bdd.specid
            and bdsp1.control_value='1'
            and bdsp1.dict_code='255490861625262080'
            left join BASEDATA.Bas_Drg_Specs_Property bdsp2
              on bdsp2.specid = bdd.specid
              and bdsp2.control_value='1'
              and bdsp2.dict_code='255503438896328704'
             left join BASEDATA.Bas_Drg_Specs_Property bdsp3
              on bdsp3.specid = bdd.specid
              and bdsp3.control_value='1'
              and bdsp3.dict_code='2003'
             left join BASEDATA.Bas_Drg_Specs_Property bdsp4
              on bdsp4.specid = bdd.specid
              and bdsp4.control_value='1'
              and bdsp4.dict_code='255503805985603584'
             left join BASEDATA.Bas_Drg_Specs_Property bdsp5
              on bdsp5.specid = bdd.specid
              and bdsp5.control_value='1'
              and bdsp5.dict_code='口服中成药'
             left join BASEDATA.Bas_Drg_Specs_Property bdsp6
              on bdsp6.specid = bdd.specid
              and bdsp6.control_value='1'
              and bdsp6.dict_code='1005'
                left join chk.wz_yzhzb_no wyn
                on wyn.wz_id = A.item_id
            WHERE 
            A.IS_DELETE='N' AND
            A.DEPT_ID <> '186' AND 
            A.STAT_DXM_CODE IN ('01','02','03') AND
            A.CREATE_DATE between to_date('${start}','yyyy-MM-dd HH24:mi:ss') and to_date('${end}','yyyy-MM-dd HH24:mi:ss') 
            GROUP BY A.DEPT_NAME,A.ITEM_ID,A.ITEM_NAME,A.STAT_DXM_CODE,B.ITEM_NAME,A.UNIT_NAME,A.PRICE,wyn.shh,bdsp.id,bdsp1.id,bdsp2.id,bdsp3.id,bdsp4.id,bdsp5.id,bdsp6.id
            ORDER BY A.DEPT_NAME)`
            flag = '1'
            title = '门诊药品明细'
        // const result = (await connection).execute(sql)
        // res.json({code:200,msg:'数据获取成功',items:(await result).rows})
    // 住院药品
    } else if (data.Depttype==='2'&&data.Catetype==='1') {
        sql = `SELECT ROW_NUMBER() OVER (ORDER BY 开单科室) AS xh,开单科室,大项目编码,项目名称,大项目名称,单位,数量,单价,总金额,
        CASE WHEN 大项目名称='中草药' THEN '是' ELSE '否' END 是否中草药,
        CASE WHEN 国家谈判品种 IS NOT NULL THEN '是' ELSE '否' END 是否国家谈判品种,
        CASE WHEN 重点监管药品 IS NOT NULL THEN '是' ELSE '否' END 是否重点监管药品,
        CASE WHEN 国家辅助用药 IS NOT NULL THEN '是' ELSE '否' END 是否国家辅助用药,
        CASE WHEN PPI IS NOT NULL THEN '是' ELSE '否' END 是否PPI,
        CASE WHEN 抗菌药品 IS NOT NULL THEN '是' ELSE '否' END 是否抗菌药品,
        CASE WHEN 中枢止吐 IS NOT NULL THEN '是' ELSE '否' END 是否中枢止吐,
        CASE WHEN 口服中成药 IS NOT NULL THEN '是' ELSE '否' END 是否口服中成药,
        CASE WHEN 中药注射剂 IS NOT NULL THEN '是' ELSE '否' END 是否中药注射剂
        FROM (SELECT A.DEPT_NAME 开单科室,A.STATITEM_CODE 大项目编码,A.ITEM_NAME 项目名称,B.ITEM_NAME 大项目名称,A.UNIT 单位,sum(A.NUM) 数量,A.RETAIL_PRICE 单价,(sum(A.NUM)*A.RETAIL_PRICE) 总金额,wyn.shh 国家谈判品种,bdsp.id 重点监管药品,bdsp1.id 国家辅助用药,bdsp2.id PPI,bdsp3.id 抗菌药品,bdsp4.id 中枢止吐,bdsp5.id 口服中成药,bdsp6.id 中药注射剂
        FROM CHG.CHG_INPATIENT_FEE_SPECI A
        LEFT JOIN BASEDATA.BAS_STAT_ITEM B
        ON A.STATITEM_CODE = B.CODE
        left join basedata.bas_drg_dictionary bdd on A.item_id = bdd.comid and A.item_type='1' left join BASEDATA.Bas_Drg_Specs_Property bdsp
        on bdsp.specid = bdd.specid and bdsp.control_value='1' and bdsp.dict_code='2004'
            left join BASEDATA.Bas_Drg_Specs_Property bdsp1
            on bdsp1.specid = bdd.specid
            and bdsp1.control_value='1'
            and bdsp1.dict_code='255490861625262080'
            left join BASEDATA.Bas_Drg_Specs_Property bdsp2
              on bdsp2.specid = bdd.specid
              and bdsp2.control_value='1'
              and bdsp2.dict_code='255503438896328704'
             left join BASEDATA.Bas_Drg_Specs_Property bdsp3
              on bdsp3.specid = bdd.specid
              and bdsp3.control_value='1'
              and bdsp3.dict_code='2003'  --抗菌药品
             left join BASEDATA.Bas_Drg_Specs_Property bdsp4
              on bdsp4.specid = bdd.specid
              and bdsp4.control_value='1'
              and bdsp4.dict_code='255503805985603584'
             left join BASEDATA.Bas_Drg_Specs_Property bdsp5
              on bdsp5.specid = bdd.specid
              and bdsp5.control_value='1'
              and bdsp5.dict_code='口服中成药'
             left join BASEDATA.Bas_Drg_Specs_Property bdsp6
              on bdsp6.specid = bdd.specid
              and bdsp6.control_value='1'
              and bdsp6.dict_code='1005'
            left join chk.wz_yzhzb_no wyn
            on wyn.wz_id = A.item_id
            WHERE
            A.DEPT_ID<>'186' AND
            A.IS_DELETE='N' AND
            A.STATITEM_CODE IN ('01','02','03') AND
            A.INPATIENT_ID NOT IN (select inpatient_id from INP.INP_INPAT_TEST) AND
            A.DEPT_NAME IS NOT NULL AND
            A.CHARGE_DATE between to_date('${start}','yyyy-MM-dd HH24:mi:ss') and to_date('${end}','yyyy-MM-dd HH24:mi:ss') 
            GROUP BY A.DEPT_NAME,A.ITEM_NAME,A.STATITEM_CODE,B.ITEM_NAME,A.UNIT,A.RETAIL_PRICE,wyn.shh,bdsp.id,bdsp1.id,bdsp2.id,bdsp3.id,bdsp4.id,bdsp5.id,bdsp6.id
            ORDER BY A.DEPT_NAME
        )`
        flag = '2'
        title = '住院药品明细'
    // 门诊耗材
    } else if (data.Depttype==='1'&&data.Catetype==='2') {
        sql = `select ROW_NUMBER() OVER (ORDER BY DEPT_NAME) AS xh,A.DEPT_NAME 开单科室,A.ITEM_ID 项目编码,A.ITEM_NAME 项目名称,A.STAT_DXM_CODE 大项目编码,B.ITEM_NAME 大项目名称,A.UNIT_NAME 单位,A.PRICE 单价,sum(A.AMOUNT) 数量,(sum(A.AMOUNT)*A.PRICE) 总金额,
        CASE WHEN A.STAT_DXM_CODE IN ('77') THEN '是' ELSE '否' END 是否高值耗材
        from chg.chg_outpatient_cost A
        LEFT JOIN BASEDATA.BAS_STAT_ITEM B
        ON A.STAT_DXM_CODE = B.CODE
        WHERE 
        A.IS_DELETE='N' AND
        A.DEPT_ID <> '186' AND 
        A.STAT_DXM_CODE IN ('77','36') AND
        A.CREATE_DATE between to_date('${start}','yyyy-MM-dd HH24:mi:ss') and to_date('${end}','yyyy-MM-dd HH24:mi:ss') 
        GROUP BY A.DEPT_NAME,A.ITEM_ID,A.ITEM_NAME,A.STAT_DXM_CODE,B.ITEM_NAME,A.UNIT_NAME,A.PRICE
        ORDER BY A.DEPT_NAME`
        flag = '3'
        title = '门诊耗材明细'
    // 住院耗材
    } else if (data.Depttype==='2'&&data.Catetype==='2') {
        sql = `SELECT ROW_NUMBER() OVER (ORDER BY DEPT_NAME) AS xh,A.DEPT_NAME 开单科室,A.STATITEM_CODE 项目编码,A.ITEM_NAME 项目名称,B.ITEM_NAME 大项目名称,A.UNIT 单位,sum(A.NUM) 数量,A.RETAIL_PRICE 单价,(sum(A.NUM)*A.RETAIL_PRICE) 总金额,
        case when A.STATITEM_CODE in ('77') then '是' else '否' end 是否高值耗材
        FROM CHG.CHG_INPATIENT_FEE_SPECI A 
        LEFT JOIN BASEDATA.BAS_STAT_ITEM B
        ON A.STATITEM_CODE = B.CODE
        WHERE
        A.DEPT_ID<>'186' and
        A.IS_DELETE='N' and
        A.STATITEM_CODE IN ('36','77') AND
        A.INPATIENT_ID NOT IN (select inpatient_id from INP.INP_INPAT_TEST) AND
        A.DEPT_NAME IS NOT NULL AND
        A.CHARGE_DATE between to_date('${start}','yyyy-MM-dd HH24:mi:ss') and to_date('${end}','yyyy-MM-dd HH24:mi:ss')
        GROUP BY A.DEPT_NAME,A.ITEM_NAME,A.STATITEM_CODE,B.ITEM_NAME,A.UNIT,A.RETAIL_PRICE
        ORDER BY A.DEPT_NAME`
        flag = '4'
        title = '住院耗材明细'
    }
    const result = (await connection).execute(sql)
    res.json({ code:200,msg:'数据获取成功',items:(await result).rows, flag:flag, title:title })
})

module.exports = router