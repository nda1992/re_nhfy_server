// 收入主题的路由
const express = require('express')
const router = express.Router()
const { connection } = require('../../../utils/oracleConnection')

// 门诊和住院各科室财务收入分类
router.post('/kssrfl', async (req, res, next) => {
    const { startDate, endDate, type } = req.body
    const start = startDate.concat(' 00:00:00')
    const end = endDate.concat(' 23:59:59')
    let sql = ``
    switch (type) {
        case '1':
            sql = `SELECT ROW_NUMBER() OVER (ORDER BY DEPT_NAME) AS xh, DEPT_NAME,
            SUM(CASE WHEN 财务分类 IN ('诊查费','病理会诊') THEN 金额 ELSE 0 END) 诊察费,
            SUM(CASE WHEN 财务分类 IN ('检查','CT','放射','核磁','黑白B超','腔内B超','浅表B超','腹部B超','脑电图','心电图','心脏B超','血管B超','尸体病检','B超费','X线胶片','骨密度') THEN 金额 ELSE 0 END) 检查费,
            SUM(CASE WHEN 财务分类 IN ('免疫','细菌','组织学诊断','化验','输血前化验','内分泌糖尿病','内分泌甲状腺','分子病理诊断','病理图像分析','免疫组化','内分泌肾上腺','细胞学诊断','生化','临检','肿瘤实验室','核医学科SPECI','肝病研究中心') THEN 金额 ELSE 0 END) 化验费,
            SUM(CASE WHEN 财务分类 IN ('护理') THEN 金额 ELSE 0 END) 护理费,
            SUM(CASE WHEN 财务分类 IN ('治疗','输氧','护婴','DSA','碎石','注射','血液透析','床位') THEN 金额 ELSE 0 END) 治疗费,
            SUM(CASE WHEN 财务分类 IN ('接生','手术','麻醉','眼科晶状体手术') THEN 金额 ELSE 0 END) 手术费,
            SUM(CASE WHEN 财务分类 IN ('高值耗材') THEN 金额 ELSE 0 END) 高值耗材费,
            SUM(CASE WHEN 财务分类 IN ('材料') THEN 金额 ELSE 0 END) 其他耗材费,
            SUM(CASE WHEN 财务分类 IN ('西药') THEN 金额 ELSE 0 END) 西药费,
            SUM(CASE WHEN 财务分类 IN ('中草药') THEN 金额 ELSE 0 END) 中药饮片费,
            SUM(CASE WHEN 财务分类 IN ('中成药') THEN 金额 ELSE 0 END) 中成药费,
            SUM(CASE WHEN 财务分类 IN ('输血','其他','空调降温','血液制品','病理摄影','营养制剂') THEN 金额 ELSE 0 END) 其他费,
            SUM(CASE WHEN 财务分类 IN ('免疫','细菌','组织学诊断','化验','输血前化验','内分泌糖尿病','内分泌甲状腺','分子病理诊断','病理图像分析','免疫组化','内分泌肾上腺','细胞学诊断','生化','临检','肿瘤实验室','核医学科SPECI','肝病研究中心','诊查费','病理会诊','检查','CT','放射','核磁','黑白B超','腔内B超','浅表B超','腹部B超','脑电图','心电图','心脏B超','血管B超','尸体病检','B超费','X线胶片','骨密度','护理','治疗','输氧','护婴','DSA','碎石','注射','血液透析','床位','接生','手术','麻醉','眼科晶状体手术','材料','高值耗材','西药','中草药','中成药','输血','其他','空调降温','血液制品','病理摄影','营养制剂') THEN 金额 ELSE 0 END) 总费用 
            FROM (SELECT DEPT_NAME,STAT_DXM_NAME 财务分类,SUM(ACVALUE) 金额 FROM CHG.CHG_OUTPATIENT_COST WHERE CHARGE_TIME BETWEEN TO_DATE('${start}','yyyy-MM-dd hh24:mi:ss') AND TO_DATE('${end}', 'yyyy-MM-dd hh24:mi:ss') AND IS_DELETE='N' GROUP BY STAT_DXM_NAME,DEPT_NAME ORDER BY DEPT_NAME)temp GROUP BY DEPT_NAME`
        case '2':
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
            SUM(CASE WHEN STATITEM_CODE IN('36') then 金额 else 0 end) 其他耗材费,
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
    const items = (await result).rows
    const sum = Math.floor((items.map(v => v.总费用).reduce((cur, acc) => cur + acc)) * 100) / 100
    res.json({code:200,msg:'数据获取成功',items:items, sum: sum})
})

// 门诊住院药品和耗材明细
router.post('/deptMaterialMedicineDetail', async (req, res, next) => {
    const { startDate, endDate, limit, page, role, Depttype, Catetype, deptName } = req.body
    const start = startDate.concat(' 00:00:00')
    const end = endDate.concat(' 23:59:59')
    let sql = ``
    let flag = ``
    let title = ``
    if (Depttype==='1'&&Catetype==='1') {
        switch (deptName) {
            case '':
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
            A.CHARGE_TIME between to_date('${start}','yyyy-MM-dd HH24:mi:ss') and to_date('${end}','yyyy-MM-dd HH24:mi:ss') 
            GROUP BY A.DEPT_NAME,A.ITEM_ID,A.ITEM_NAME,A.STAT_DXM_CODE,B.ITEM_NAME,A.UNIT_NAME,A.PRICE,wyn.shh,bdsp.id,bdsp1.id,bdsp2.id,bdsp3.id,bdsp4.id,bdsp5.id,bdsp6.id
            ORDER BY A.DEPT_NAME)`
            flag = '1'
            title = `门诊全部科室药品明细`
            break
            default:
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
            A.DEPT_NAME = '${deptName}' AND
            A.CHARGE_TIME between to_date('${start}','yyyy-MM-dd HH24:mi:ss') and to_date('${end}','yyyy-MM-dd HH24:mi:ss') 
            GROUP BY A.DEPT_NAME,A.ITEM_ID,A.ITEM_NAME,A.STAT_DXM_CODE,B.ITEM_NAME,A.UNIT_NAME,A.PRICE,wyn.shh,bdsp.id,bdsp1.id,bdsp2.id,bdsp3.id,bdsp4.id,bdsp5.id,bdsp6.id
            ORDER BY A.DEPT_NAME)`
            flag = '1'
            title = `${deptName}药品明细`
        }
        // const result = (await connection).execute(sql)
        // res.json({code:200,msg:'数据获取成功',items:(await result).rows})
    // 住院药品
    } else if (Depttype==='2'&&Catetype==='1') {
        switch (deptName) {
            case '':
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
                    A.CHARGE_DATE between to_date('${start}','yyyy-MM-dd HH24:mi:ss') and to_date('${end}','yyyy-MM-dd HH24:mi:ss') 
                    GROUP BY A.DEPT_NAME,A.ITEM_NAME,A.STATITEM_CODE,B.ITEM_NAME,A.UNIT,A.RETAIL_PRICE,wyn.shh,bdsp.id,bdsp1.id,bdsp2.id,bdsp3.id,bdsp4.id,bdsp5.id,bdsp6.id
                    ORDER BY A.DEPT_NAME
                    )`
                flag = '2'
                title = '住院所有科室药品明细'
                break
            default:
                sql = `SELECT ROW_NUMBER() OVER (ORDER BY 开单科室) AS xh,开单科室,项目代码,项目名称,大项目名称,单位,数量,单价,总金额,
                CASE WHEN 大项目名称='中草药' THEN '是' ELSE '否' END 是否中草药,
                CASE WHEN 国家谈判品种 IS NOT NULL THEN '是' ELSE '否' END 是否国家谈判品种,
                CASE WHEN 重点监管药品 IS NOT NULL THEN '是' ELSE '否' END 是否重点监管药品,
                CASE WHEN 国家辅助用药 IS NOT NULL THEN '是' ELSE '否' END 是否国家辅助用药,
                CASE WHEN PPI IS NOT NULL THEN '是' ELSE '否' END 是否PPI,
                CASE WHEN 抗菌药品 IS NOT NULL THEN '是' ELSE '否' END 是否抗菌药品,
                CASE WHEN 中枢止吐 IS NOT NULL THEN '是' ELSE '否' END 是否中枢止吐,
                CASE WHEN 口服中成药 IS NOT NULL THEN '是' ELSE '否' END 是否口服中成药,
                CASE WHEN 中药注射剂 IS NOT NULL THEN '是' ELSE '否' END 是否中药注射剂
                FROM (
                SELECT A.DEPT_NAME 开单科室,A.STATITEM_CODE 项目代码,A.ITEM_NAME 项目名称,B.ITEM_NAME 大项目名称,A.UNIT 单位,sum(A.NUM) 数量,A.RETAIL_PRICE 单价,(sum(A.NUM)*A.RETAIL_PRICE) 总金额,wyn.shh 国家谈判品种,bdsp.id 重点监管药品,bdsp1.id 国家辅助用药,bdsp2.id PPI,bdsp3.id 抗菌药品,bdsp4.id 中枢止吐,bdsp5.id 口服中成药,bdsp6.id 中药注射剂
                FROM CHG.CHG_INPATIENT_FEE_SPECI A
                LEFT JOIN BASEDATA.BAS_STAT_ITEM B
                ON A.STATITEM_CODE = B.CODE
                left join basedata.bas_drg_dictionary bdd 
                        on A.item_id = bdd.comid
                        and A.item_type='1'
                     left join BASEDATA.Bas_Drg_Specs_Property bdsp
                      on bdsp.specid = bdd.specid
                      and bdsp.control_value='1'
                      and bdsp.dict_code='2004'  --重点监管药品
                    left join BASEDATA.Bas_Drg_Specs_Property bdsp1
                    on bdsp1.specid = bdd.specid
                    and bdsp1.control_value='1'
                    and bdsp1.dict_code='255490861625262080'  --国家辅助用药
                    left join BASEDATA.Bas_Drg_Specs_Property bdsp2
                      on bdsp2.specid = bdd.specid
                      and bdsp2.control_value='1'
                      and bdsp2.dict_code='255503438896328704'  --PPI
                     left join BASEDATA.Bas_Drg_Specs_Property bdsp3
                      on bdsp3.specid = bdd.specid
                      and bdsp3.control_value='1'
                      and bdsp3.dict_code='2003'  --抗菌药品
                     left join BASEDATA.Bas_Drg_Specs_Property bdsp4
                      on bdsp4.specid = bdd.specid
                      and bdsp4.control_value='1'
                      and bdsp4.dict_code='255503805985603584'  --中枢止吐
                     left join BASEDATA.Bas_Drg_Specs_Property bdsp5
                      on bdsp5.specid = bdd.specid
                      and bdsp5.control_value='1'
                      and bdsp5.dict_code='口服中成药'  --口服中成药
                     left join BASEDATA.Bas_Drg_Specs_Property bdsp6
                      on bdsp6.specid = bdd.specid
                      and bdsp6.control_value='1'
                      and bdsp6.dict_code='1005'  --中药注射剂
                        left join chk.wz_yzhzb_no wyn  --国家谈判品种
                        on wyn.wz_id = A.item_id
                WHERE
                A.DEPT_ID<>'186' AND
                A.IS_DELETE='N' AND
                A.STATITEM_CODE IN ('01','02','03') AND
                A.INPATIENT_ID NOT IN (select inpatient_id from INP.INP_INPAT_TEST) AND -- 排除测试病人
                A.CHARGE_DATE between to_date('${start}','yyyy-MM-dd HH24:mi:ss') and to_date('${end}','yyyy-MM-dd HH24:mi:ss') AND
                A.DEPT_NAME='${deptName.trim()}'
                GROUP BY A.DEPT_NAME,A.ITEM_NAME,A.STATITEM_CODE,B.ITEM_NAME,A.UNIT,A.RETAIL_PRICE,wyn.shh,bdsp.id,bdsp1.id,bdsp2.id,bdsp3.id,bdsp4.id,bdsp5.id,bdsp6.id
                ORDER BY A.DEPT_NAME
                )`
                flag = '2'
                title = `${deptName}药品明细`
        }
        
    // 门诊耗材
    } else if (Depttype==='1'&&Catetype==='2') {
        switch (deptName) {
            case '':
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
                break
            default:
                sql = `select ROW_NUMBER() OVER (ORDER BY DEPT_NAME) AS xh,A.DEPT_NAME 开单科室,A.ITEM_ID 项目编码,A.ITEM_NAME 项目名称,A.STAT_DXM_CODE 大项目编码,B.ITEM_NAME 大项目名称,A.UNIT_NAME 单位,A.PRICE 单价,sum(A.AMOUNT) 数量,(sum(A.AMOUNT)*A.PRICE) 总金额,
                CASE WHEN A.STAT_DXM_CODE IN ('77') THEN '是' ELSE '否' END 是否高值耗材
                from chg.chg_outpatient_cost A
                LEFT JOIN BASEDATA.BAS_STAT_ITEM B
                ON A.STAT_DXM_CODE = B.CODE
                WHERE 
                A.IS_DELETE='N' AND
                A.DEPT_ID <> '186' AND 
                A.STAT_DXM_CODE IN ('77','36') AND
                A.DEPT_NAME='${deptName.trim()}' AND
                A.CREATE_DATE between to_date('${start}','yyyy-MM-dd HH24:mi:ss') and to_date('${end}','yyyy-MM-dd HH24:mi:ss') 
                GROUP BY A.DEPT_NAME,A.ITEM_ID,A.ITEM_NAME,A.STAT_DXM_CODE,B.ITEM_NAME,A.UNIT_NAME,A.PRICE
                ORDER BY A.DEPT_NAME`
                flag = '3'
                title = `${deptName}耗材明细`
        }
    // 住院耗材
    } else if (Depttype==='2'&&Catetype==='2') {
        switch (deptName) {
            case '':
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
                A.CHARGE_DATE between to_date('${start}','yyyy-MM-dd HH24:mi:ss') and to_date('${end}','yyyy-MM-dd HH24:mi:ss')
                GROUP BY A.DEPT_NAME,A.ITEM_NAME,A.STATITEM_CODE,B.ITEM_NAME,A.UNIT,A.RETAIL_PRICE
                ORDER BY A.DEPT_NAME`
                flag = '4'
                title = '住院耗材明细'
                break
            default:
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
                A.DEPT_NAME='${deptName.trim()}' AND
                A.CHARGE_DATE between to_date('${start}','yyyy-MM-dd HH24:mi:ss') and to_date('${end}','yyyy-MM-dd HH24:mi:ss')
                GROUP BY A.DEPT_NAME,A.ITEM_NAME,A.STATITEM_CODE,B.ITEM_NAME,A.UNIT,A.RETAIL_PRICE
                ORDER BY A.DEPT_NAME`
                flag = '4'
                title = `${deptName}耗材明细`
        }
    }
    const result = (await connection).execute(sql)
    const items = (await result).rows
    // 总金额
    const sum = Math.floor((items.map(v => v.总金额).reduce((cur, acc) => cur + acc)) * 100) / 100
    // 翻页
    if (page !== undefined || limit !== undefined) {
        const pageList = items.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
        res.json({ code:200,msg:'数据获取成功',items: pageList, flag:flag, title:title, total: items.length, sum: sum })
    // 下载    
    }else{
        res.json({ code:200,msg:'数据获取成功',items: items })
    }
})

// 住院科室耗占比
router.post('/deptMaterialProportion', async (req, res, next) => {
    const data = req.body
    const start = data['startDate'].concat(' 00:00:00')
    const end = data['endDate'].concat(' 23:59:59')
    sql = `select * from (
               select 类别,编码,科室,sum(费用总计) 费用总计,sum(药费费用) 药费费用,sum(草药费用) 草药费用,sum(国家谈判品种) 国家谈判品种,sum(耗材费用) 耗材费用,
               nvl(c.xh,99999) as xh,
               sum(重点监管药品) 重点监管药品 ,
               sum(国家辅助用药) 国家辅助用药,
               sum(PPI) PPI,
               sum(抗菌药品) 抗菌药品,
               sum(中枢止吐) 中枢止吐,
               sum(口服中成药) 口服中成药,
               sum(中药注射剂) 中药注射剂
          from (
            select '门诊' 类别,
                 coc.dept_id 编码,
                 coc.dept_name 科室,
                 coc.item_name 项目名,
                 coc.acvalue 费用总计,
                 0 药费费用,
                 0 草药费用,
                 0 国家谈判品种,
                 decode(bps.dict_detail_id, '14', coc.acvalue, 0)  耗材费用,
                 0 重点监管药品,
                 0 国家辅助用药,
                 0 PPI,
                 0 抗菌药品,
                 0 中枢止吐,
                 0 口服中成药,
                 0 中药注射剂
            from chg.chg_outpatient_cost coc
            left join basedata.bas_price_stat bps
              on coc.item_id = bps.price_items_id
             and bps.dict_catalog_id = 'SFTJ_004' --门诊发票项目
           where coc.charge_time between
                 to_date('2021-08-01 00:00:00', 'yyyy-mm-dd hh24:mi:ss') and
                 to_date('2021-08-01 23:59:59', 'yyyy-mm-dd hh24:mi:ss')
             and coc.acvalue <> 0
             and coc.item_type = '2' --项目
             and coc.is_delete = 'N'
          union all
          select '门诊' 类别,
                 coc.dept_id 编码,
                 coc.dept_name 科室,
                 coc.item_name 项目名,
                 coc.acvalue 费用总计,
                 coc.acvalue 药费费用,
                 decode(bdss.control_value, '1', coc.acvalue, 0) 草药费用,
                 case  when wyn.shh is not null then coc.acvalue else 0 end 国家谈判品种,
                 decode(bdss.control_value, '14', coc.acvalue, 0) 耗材费用,
                 (case when bdsp.id is not null then coc.acvalue else 0 end) 重点监管药品,
                 (case when bdsp1.id is not null then coc.acvalue else 0 end) 国家辅助用药,
                 (case when bdsp2.id is not null then coc.acvalue else 0 end) PPI,
                 (case when bdsp3.id is not null then coc.acvalue else 0 end) 抗菌药品,
                 (case when bdsp4.id is not null then coc.acvalue else 0 end) 中枢止吐,
                 (case when bdsp5.id is not null then coc.acvalue else 0 end) 口服中成药,
                 (case when bdsp6.id is not null then coc.acvalue else 0 end) 中药注射剂
            from chg.chg_outpatient_cost coc
           inner join BASEDATA.BAS_DRG_DICTIONARY bdd
              on coc.item_id = bdd.comid
           inner join BASEDATA.BAS_DRG_SPECS_STAT bdss
              on bdss.specid = bdd.specid
             and bdss.clascode = 'SFTJ_004' --门诊发票项目
            left join chk.wz_yzhzb_no wyn
              on wyn.wz_id = coc.item_id
            left join BASEDATA.Bas_Drg_Specs_Property bdsp
              on bdsp.specid = bdd.specid
              and bdsp.control_value='1'
              and bdsp.dict_code='2004'  --重点监管药品
            left join BASEDATA.Bas_Drg_Specs_Property bdsp1
            on bdsp1.specid = bdd.specid
            and bdsp1.control_value='1'
            and bdsp1.dict_code='255490861625262080'  --国家辅助用药
            left join BASEDATA.Bas_Drg_Specs_Property bdsp2
              on bdsp2.specid = bdd.specid
              and bdsp2.control_value='1'
              and bdsp2.dict_code='255503438896328704'  --PPI
             left join BASEDATA.Bas_Drg_Specs_Property bdsp3
              on bdsp3.specid = bdd.specid
              and bdsp3.control_value='1'
              and bdsp3.dict_code='2003'  --抗菌药品
             left join BASEDATA.Bas_Drg_Specs_Property bdsp4
              on bdsp4.specid = bdd.specid
              and bdsp4.control_value='1'
              and bdsp4.dict_code='255503805985603584'  --中枢止吐
             left join BASEDATA.Bas_Drg_Specs_Property bdsp5
              on bdsp5.specid = bdd.specid
              and bdsp5.control_value='1'
              and bdsp5.dict_code='口服中成药'  --口服中成药
             left join BASEDATA.Bas_Drg_Specs_Property bdsp6
              on bdsp6.specid = bdd.specid
              and bdsp6.control_value='1'
              and bdsp6.dict_code='1005'  --中药注射剂
           where coc.charge_time between
                 to_date('${start}', 'yyyy-mm-dd hh24:mi:ss') and
                 to_date('${end}', 'yyyy-mm-dd hh24:mi:ss')
             and coc.acvalue <> 0
             and coc.item_type = '1' --药品
             and coc.is_delete = 'N'
          UNION ALL 
          SELECT '住院' 类别,
                 cifs.location_deptid 编码,
                 cifs.location_deptname 科室,
                 cifs.item_name 项目名,
                 (RETAIL_VALUE) AS 费用总计,
                 (CASE WHEN cifs.ITEM_TYPE = 1 THEN RETAIL_VALUE ELSE 0 END) AS 药费费用,
                 (CASE WHEN ciofs.DICT_DETAIL_ID = '1' THEN RETAIL_VALUE ELSE 0 END) AS 草药费用,
                 (CASE WHEN wyn.shh is not null THEN RETAIL_VALUE ELSE 0 END) AS 国家谈判品种,
                 (CASE WHEN ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 耗材费用,
                 (case when bdsp.id is not null then RETAIL_VALUE else 0 end) 重点监管药品,
                 (case when bdsp1.id is not null then RETAIL_VALUE else 0 end) 国家辅助用药,
                 (case when bdsp2.id is not null then RETAIL_VALUE else 0 end) PPI,
                 (case when bdsp3.id is not null then RETAIL_VALUE else 0 end) 抗菌药品,
                 (case when bdsp4.id is not null then RETAIL_VALUE else 0 end) 中枢止吐,
                 (case when bdsp5.id is not null then RETAIL_VALUE else 0 end) 口服中成药,
                 (case when bdsp6.id is not null then RETAIL_VALUE else 0 end) 中药注射剂
            FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
            LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
              ON cifs.ID = ciofs.FEE_ID
             AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
            left join chk.wz_yzhzb_no wyn
              on wyn.wz_id = cifs.item_id
             and cifs.item_type = '1'
             left join basedata.bas_drg_dictionary bdd 
                on cifs.item_id = bdd.comid
                and cifs.item_type='1'
             left join BASEDATA.Bas_Drg_Specs_Property bdsp
              on bdsp.specid = bdd.specid
              and bdsp.control_value='1'
              and bdsp.dict_code='2004'  --重点监管药品
            left join BASEDATA.Bas_Drg_Specs_Property bdsp1
            on bdsp1.specid = bdd.specid
            and bdsp1.control_value='1'
            and bdsp1.dict_code='255490861625262080'  --国家辅助用药
            left join BASEDATA.Bas_Drg_Specs_Property bdsp2
              on bdsp2.specid = bdd.specid
              and bdsp2.control_value='1'
              and bdsp2.dict_code='255503438896328704'  --PPI
             left join BASEDATA.Bas_Drg_Specs_Property bdsp3
              on bdsp3.specid = bdd.specid
              and bdsp3.control_value='1'
              and bdsp3.dict_code='2003'  --抗菌药品
             left join BASEDATA.Bas_Drg_Specs_Property bdsp4
              on bdsp4.specid = bdd.specid
              and bdsp4.control_value='1'
              and bdsp4.dict_code='255503805985603584'  --中枢止吐
             left join BASEDATA.Bas_Drg_Specs_Property bdsp5
              on bdsp5.specid = bdd.specid
              and bdsp5.control_value='1'
              and bdsp5.dict_code='口服中成药'  --口服中成药
             left join BASEDATA.Bas_Drg_Specs_Property bdsp6
              on bdsp6.specid = bdd.specid
              and bdsp6.control_value='1'
              and bdsp6.dict_code='1005'  --中药注射剂
           WHERE ((cifs.charge_date_two is not null and
                 cifs.charge_date_two BETWEEN
                 to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
                 to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')) or
                 (cifs.charge_date_two is null and
                 cifs.CHARGE_DATE BETWEEN
                 to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
                 to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')))
             and cifs.inpatient_id not in
                 (select inpatient_id from INP.INP_INPAT_TEST) -- 排除测试病人 
             and cifs.CHARGE_BIT = 1
             AND cifs.IS_DELETE = 'N'
             and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
             AND cifs.location_deptid <> '186' -- 排除测试科
             AND CIFS.DEPT_ID<> '80'  --排除麻醉科
             UNION ALL
             SELECT '住院' 类别,
                 cifs.DEPT_ID 编码,
                 cifs.Dept_Name 科室,
                 cifs.item_name 项目名,
                 (RETAIL_VALUE) AS 费用总计,
                 (CASE WHEN cifs.ITEM_TYPE = 1 THEN RETAIL_VALUE ELSE 0 END) AS 药费费用,
                 (CASE WHEN ciofs.DICT_DETAIL_ID = '1' THEN RETAIL_VALUE ELSE 0 END) AS 草药费用,
                 (CASE WHEN wyn.shh is not null THEN RETAIL_VALUE ELSE 0 END) AS 国家谈判品种,
                 (CASE WHEN ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 耗材费用,
                 (case when bdsp.id is not null then RETAIL_VALUE else 0 end) 重点监管药品,
                 (case when bdsp1.id is not null then RETAIL_VALUE else 0 end) 国家辅助用药,
                 (case when bdsp2.id is not null then RETAIL_VALUE else 0 end) PPI,
                 (case when bdsp3.id is not null then RETAIL_VALUE else 0 end) 抗菌药品,
                 (case when bdsp4.id is not null then RETAIL_VALUE else 0 end) 中枢止吐,
                 (case when bdsp5.id is not null then RETAIL_VALUE else 0 end) 口服中成药,
                 (case when bdsp6.id is not null then RETAIL_VALUE else 0 end) 中药注射剂
            FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
            LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
              ON cifs.ID = ciofs.FEE_ID
             AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
            left join chk.wz_yzhzb_no wyn
              on wyn.wz_id = cifs.item_id
             and cifs.item_type = '1'
            left join basedata.bas_drg_dictionary bdd 
                on cifs.item_id = bdd.comid
                and cifs.item_type='1'
             left join BASEDATA.Bas_Drg_Specs_Property bdsp
              on bdsp.specid = bdd.specid
              and bdsp.control_value='1'
              and bdsp.dict_code='2004'  --重点监管药品
            left join BASEDATA.Bas_Drg_Specs_Property bdsp1
            on bdsp1.specid = bdd.specid
            and bdsp1.control_value='1'
            and bdsp1.dict_code='255490861625262080'  --国家辅助用药
            left join BASEDATA.Bas_Drg_Specs_Property bdsp2
              on bdsp2.specid = bdd.specid
              and bdsp2.control_value='1'
              and bdsp2.dict_code='255503438896328704'  --PPI
             left join BASEDATA.Bas_Drg_Specs_Property bdsp3
              on bdsp3.specid = bdd.specid
              and bdsp3.control_value='1'
              and bdsp3.dict_code='2003'  --抗菌药品
             left join BASEDATA.Bas_Drg_Specs_Property bdsp4
              on bdsp4.specid = bdd.specid
              and bdsp4.control_value='1'
              and bdsp4.dict_code='255503805985603584'  --中枢止吐
             left join BASEDATA.Bas_Drg_Specs_Property bdsp5
              on bdsp5.specid = bdd.specid
              and bdsp5.control_value='1'
              and bdsp5.dict_code='口服中成药'  --口服中成药
             left join BASEDATA.Bas_Drg_Specs_Property bdsp6
              on bdsp6.specid = bdd.specid
              and bdsp6.control_value='1'
              and bdsp6.dict_code='1005'  --中药注射剂
           WHERE ((cifs.charge_date_two is not null and
                 cifs.charge_date_two BETWEEN
                 to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
                 to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')) or
                 (cifs.charge_date_two is null and
                 cifs.CHARGE_DATE BETWEEN
                 to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
                 to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')))
             and cifs.inpatient_id not in
                 (select inpatient_id from INP.INP_INPAT_TEST) -- 排除测试病人 
             and cifs.CHARGE_BIT = 1
             AND cifs.IS_DELETE = 'N'
             and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
             AND cifs.location_deptid <> '186' -- 排除测试科
             AND CIFS.DEPT_ID= '80'  --麻醉科
            ) a left join basedata.YZHZB_PX c on a.科室=c.name
         group by 类别, 编码, 科室,c.xh) x
        order by x.类别,x.xh asc`
    const result = (await connection).execute(sql)
    const items = (await result).rows
    const resultItems = []
    // 药品总费用
    let sum = 0
    // 序号
    let num = 0
    items.forEach(e=>{
        num++
        let yzb = Math.floor((e.药费费用-e.国家谈判品种-e.草药费用)*10000/e.费用总计)/100
        sum+=e.药费费用
        resultItems.push(Object.assign({},e,{"药占比":yzb,xh:num}))
    })
    res.json({ code:200,msg:'数据获取成功',items: resultItems, sum: sum})
})

// 全院药占比
router.post('/deptMedicientProportion', async (req,res,next) => {
    const data = req.body
    const start = data['startDate'].concat(' 00:00:00')
    const end = data['endDate'].concat(' 23:59:59')
    sql = `select * from (
               select 类别,编码,科室,sum(费用总计) 费用总计,sum(药费费用) 药费费用,sum(草药费用) 草药费用,sum(国家谈判品种) 国家谈判品种,sum(耗材费用) 耗材费用,
               nvl(c.xh,99999) as xh,
               sum(重点监管药品) 重点监管药品 ,
               sum(国家辅助用药) 国家辅助用药,
               sum(PPI) PPI,
               sum(抗菌药品) 抗菌药品,
               sum(中枢止吐) 中枢止吐,
               sum(口服中成药) 口服中成药,
               sum(中药注射剂) 中药注射剂
          from (
            select '门诊' 类别,
                 coc.dept_id 编码,
                 coc.dept_name 科室,
                 coc.item_name 项目名,
                 coc.acvalue 费用总计,
                 0 药费费用,
                 0 草药费用,
                 0 国家谈判品种,
                 decode(bps.dict_detail_id, '14', coc.acvalue, 0)  耗材费用,
                 0 重点监管药品,
                 0 国家辅助用药,
                 0 PPI,
                 0 抗菌药品,
                 0 中枢止吐,
                 0 口服中成药,
                 0 中药注射剂
            from chg.chg_outpatient_cost coc
            left join basedata.bas_price_stat bps
              on coc.item_id = bps.price_items_id
             and bps.dict_catalog_id = 'SFTJ_004' --门诊发票项目
           where coc.charge_time between
                 to_date('2021-08-01 00:00:00', 'yyyy-mm-dd hh24:mi:ss') and
                 to_date('2021-08-01 23:59:59', 'yyyy-mm-dd hh24:mi:ss')
             and coc.acvalue <> 0
             and coc.item_type = '2' --项目
             and coc.is_delete = 'N'
          union all
          select '门诊' 类别,
                 coc.dept_id 编码,
                 coc.dept_name 科室,
                 coc.item_name 项目名,
                 coc.acvalue 费用总计,
                 coc.acvalue 药费费用,
                 decode(bdss.control_value, '1', coc.acvalue, 0) 草药费用,
                 case  when wyn.shh is not null then coc.acvalue else 0 end 国家谈判品种,
                 decode(bdss.control_value, '14', coc.acvalue, 0) 耗材费用,
                 (case when bdsp.id is not null then coc.acvalue else 0 end) 重点监管药品,
                 (case when bdsp1.id is not null then coc.acvalue else 0 end) 国家辅助用药,
                 (case when bdsp2.id is not null then coc.acvalue else 0 end) PPI,
                 (case when bdsp3.id is not null then coc.acvalue else 0 end) 抗菌药品,
                 (case when bdsp4.id is not null then coc.acvalue else 0 end) 中枢止吐,
                 (case when bdsp5.id is not null then coc.acvalue else 0 end) 口服中成药,
                 (case when bdsp6.id is not null then coc.acvalue else 0 end) 中药注射剂
            from chg.chg_outpatient_cost coc
           inner join BASEDATA.BAS_DRG_DICTIONARY bdd
              on coc.item_id = bdd.comid
           inner join BASEDATA.BAS_DRG_SPECS_STAT bdss
              on bdss.specid = bdd.specid
             and bdss.clascode = 'SFTJ_004' --门诊发票项目
            left join chk.wz_yzhzb_no wyn
              on wyn.wz_id = coc.item_id
            left join BASEDATA.Bas_Drg_Specs_Property bdsp
              on bdsp.specid = bdd.specid
              and bdsp.control_value='1'
              and bdsp.dict_code='2004'  --重点监管药品
            left join BASEDATA.Bas_Drg_Specs_Property bdsp1
            on bdsp1.specid = bdd.specid
            and bdsp1.control_value='1'
            and bdsp1.dict_code='255490861625262080'  --国家辅助用药
            left join BASEDATA.Bas_Drg_Specs_Property bdsp2
              on bdsp2.specid = bdd.specid
              and bdsp2.control_value='1'
              and bdsp2.dict_code='255503438896328704'  --PPI
             left join BASEDATA.Bas_Drg_Specs_Property bdsp3
              on bdsp3.specid = bdd.specid
              and bdsp3.control_value='1'
              and bdsp3.dict_code='2003'  --抗菌药品
             left join BASEDATA.Bas_Drg_Specs_Property bdsp4
              on bdsp4.specid = bdd.specid
              and bdsp4.control_value='1'
              and bdsp4.dict_code='255503805985603584'  --中枢止吐
             left join BASEDATA.Bas_Drg_Specs_Property bdsp5
              on bdsp5.specid = bdd.specid
              and bdsp5.control_value='1'
              and bdsp5.dict_code='口服中成药'  --口服中成药
             left join BASEDATA.Bas_Drg_Specs_Property bdsp6
              on bdsp6.specid = bdd.specid
              and bdsp6.control_value='1'
              and bdsp6.dict_code='1005'  --中药注射剂
           where coc.charge_time between
                 to_date('${start}', 'yyyy-mm-dd hh24:mi:ss') and
                 to_date('${end}', 'yyyy-mm-dd hh24:mi:ss')
             and coc.acvalue <> 0
             and coc.item_type = '1' --药品
             and coc.is_delete = 'N'
          UNION ALL 
          SELECT '住院' 类别,
                 cifs.location_deptid 编码,
                 cifs.location_deptname 科室,
                 cifs.item_name 项目名,
                 (RETAIL_VALUE) AS 费用总计,
                 (CASE WHEN cifs.ITEM_TYPE = 1 THEN RETAIL_VALUE ELSE 0 END) AS 药费费用,
                 (CASE WHEN ciofs.DICT_DETAIL_ID = '1' THEN RETAIL_VALUE ELSE 0 END) AS 草药费用,
                 (CASE WHEN wyn.shh is not null THEN RETAIL_VALUE ELSE 0 END) AS 国家谈判品种,
                 (CASE WHEN ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 耗材费用,
                 (case when bdsp.id is not null then RETAIL_VALUE else 0 end) 重点监管药品,
                 (case when bdsp1.id is not null then RETAIL_VALUE else 0 end) 国家辅助用药,
                 (case when bdsp2.id is not null then RETAIL_VALUE else 0 end) PPI,
                 (case when bdsp3.id is not null then RETAIL_VALUE else 0 end) 抗菌药品,
                 (case when bdsp4.id is not null then RETAIL_VALUE else 0 end) 中枢止吐,
                 (case when bdsp5.id is not null then RETAIL_VALUE else 0 end) 口服中成药,
                 (case when bdsp6.id is not null then RETAIL_VALUE else 0 end) 中药注射剂
            FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
            LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
              ON cifs.ID = ciofs.FEE_ID
             AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
            left join chk.wz_yzhzb_no wyn
              on wyn.wz_id = cifs.item_id
             and cifs.item_type = '1'
             left join basedata.bas_drg_dictionary bdd 
                on cifs.item_id = bdd.comid
                and cifs.item_type='1'
             left join BASEDATA.Bas_Drg_Specs_Property bdsp
              on bdsp.specid = bdd.specid
              and bdsp.control_value='1'
              and bdsp.dict_code='2004'  --重点监管药品
            left join BASEDATA.Bas_Drg_Specs_Property bdsp1
            on bdsp1.specid = bdd.specid
            and bdsp1.control_value='1'
            and bdsp1.dict_code='255490861625262080'  --国家辅助用药
            left join BASEDATA.Bas_Drg_Specs_Property bdsp2
              on bdsp2.specid = bdd.specid
              and bdsp2.control_value='1'
              and bdsp2.dict_code='255503438896328704'  --PPI
             left join BASEDATA.Bas_Drg_Specs_Property bdsp3
              on bdsp3.specid = bdd.specid
              and bdsp3.control_value='1'
              and bdsp3.dict_code='2003'  --抗菌药品
             left join BASEDATA.Bas_Drg_Specs_Property bdsp4
              on bdsp4.specid = bdd.specid
              and bdsp4.control_value='1'
              and bdsp4.dict_code='255503805985603584'  --中枢止吐
             left join BASEDATA.Bas_Drg_Specs_Property bdsp5
              on bdsp5.specid = bdd.specid
              and bdsp5.control_value='1'
              and bdsp5.dict_code='口服中成药'  --口服中成药
             left join BASEDATA.Bas_Drg_Specs_Property bdsp6
              on bdsp6.specid = bdd.specid
              and bdsp6.control_value='1'
              and bdsp6.dict_code='1005'  --中药注射剂
           WHERE ((cifs.charge_date_two is not null and
                 cifs.charge_date_two BETWEEN
                 to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
                 to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')) or
                 (cifs.charge_date_two is null and
                 cifs.CHARGE_DATE BETWEEN
                 to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
                 to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')))
             and cifs.inpatient_id not in
                 (select inpatient_id from INP.INP_INPAT_TEST) -- 排除测试病人 
             and cifs.CHARGE_BIT = 1
             AND cifs.IS_DELETE = 'N'
             and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
             AND cifs.location_deptid <> '186' -- 排除测试科
             AND CIFS.DEPT_ID<> '80'  --排除麻醉科
             UNION ALL
             SELECT '住院' 类别,
                 cifs.DEPT_ID 编码,
                 cifs.Dept_Name 科室,
                 cifs.item_name 项目名,
                 (RETAIL_VALUE) AS 费用总计,
                 (CASE WHEN cifs.ITEM_TYPE = 1 THEN RETAIL_VALUE ELSE 0 END) AS 药费费用,
                 (CASE WHEN ciofs.DICT_DETAIL_ID = '1' THEN RETAIL_VALUE ELSE 0 END) AS 草药费用,
                 (CASE WHEN wyn.shh is not null THEN RETAIL_VALUE ELSE 0 END) AS 国家谈判品种,
                 (CASE WHEN ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 耗材费用,
                 (case when bdsp.id is not null then RETAIL_VALUE else 0 end) 重点监管药品,
                 (case when bdsp1.id is not null then RETAIL_VALUE else 0 end) 国家辅助用药,
                 (case when bdsp2.id is not null then RETAIL_VALUE else 0 end) PPI,
                 (case when bdsp3.id is not null then RETAIL_VALUE else 0 end) 抗菌药品,
                 (case when bdsp4.id is not null then RETAIL_VALUE else 0 end) 中枢止吐,
                 (case when bdsp5.id is not null then RETAIL_VALUE else 0 end) 口服中成药,
                 (case when bdsp6.id is not null then RETAIL_VALUE else 0 end) 中药注射剂
            FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
            LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
              ON cifs.ID = ciofs.FEE_ID
             AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
            left join chk.wz_yzhzb_no wyn
              on wyn.wz_id = cifs.item_id
             and cifs.item_type = '1'
            left join basedata.bas_drg_dictionary bdd 
                on cifs.item_id = bdd.comid
                and cifs.item_type='1'
             left join BASEDATA.Bas_Drg_Specs_Property bdsp
              on bdsp.specid = bdd.specid
              and bdsp.control_value='1'
              and bdsp.dict_code='2004'  --重点监管药品
            left join BASEDATA.Bas_Drg_Specs_Property bdsp1
            on bdsp1.specid = bdd.specid
            and bdsp1.control_value='1'
            and bdsp1.dict_code='255490861625262080'  --国家辅助用药
            left join BASEDATA.Bas_Drg_Specs_Property bdsp2
              on bdsp2.specid = bdd.specid
              and bdsp2.control_value='1'
              and bdsp2.dict_code='255503438896328704'  --PPI
             left join BASEDATA.Bas_Drg_Specs_Property bdsp3
              on bdsp3.specid = bdd.specid
              and bdsp3.control_value='1'
              and bdsp3.dict_code='2003'  --抗菌药品
             left join BASEDATA.Bas_Drg_Specs_Property bdsp4
              on bdsp4.specid = bdd.specid
              and bdsp4.control_value='1'
              and bdsp4.dict_code='255503805985603584'  --中枢止吐
             left join BASEDATA.Bas_Drg_Specs_Property bdsp5
              on bdsp5.specid = bdd.specid
              and bdsp5.control_value='1'
              and bdsp5.dict_code='口服中成药'  --口服中成药
             left join BASEDATA.Bas_Drg_Specs_Property bdsp6
              on bdsp6.specid = bdd.specid
              and bdsp6.control_value='1'
              and bdsp6.dict_code='1005'  --中药注射剂
           WHERE ((cifs.charge_date_two is not null and
                 cifs.charge_date_two BETWEEN
                 to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
                 to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')) or
                 (cifs.charge_date_two is null and
                 cifs.CHARGE_DATE BETWEEN
                 to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
                 to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')))
             and cifs.inpatient_id not in
                 (select inpatient_id from INP.INP_INPAT_TEST) -- 排除测试病人 
             and cifs.CHARGE_BIT = 1
             AND cifs.IS_DELETE = 'N'
             and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
             AND cifs.location_deptid <> '186' -- 排除测试科
             AND CIFS.DEPT_ID= '80'  --麻醉科
            ) a left join basedata.YZHZB_PX c on a.科室=c.name
         group by 类别, 编码, 科室,c.xh) x
        order by x.类别,x.xh asc`
    const result = (await connection).execute(sql)
    const items = (await result).rows
    const resultItems = []
    // 药品总费用
    let sum = 0
    // 序号
    let num = 0
    items.forEach(e=>{
        num++
        let yzb = Math.floor((e.药费费用-e.国家谈判品种-e.草药费用)*10000/e.费用总计)/100
        sum+=e.药费费用
        resultItems.push(Object.assign({},e,{"药占比":yzb,xh:num}))
    })
    res.json({ code:200,msg:'数据获取成功',items: resultItems, sum: sum})
})

module.exports = router