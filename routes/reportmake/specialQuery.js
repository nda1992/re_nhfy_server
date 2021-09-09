const express = require('express')
const router = express.Router()
const {connection} = require('../../utils/oracleConnection')


// 住院耗占比
router.post('/searchDeptOperate/getdeptMaterialProportion',async (req,res,next) => {
    const data = req.body
    const start = data['startDate'].concat(' 00:00:00')
    const end = data['endDate'].concat(' 23:59:59')
    const sql = `
        SELECT * FROM (
            select ROW_NUMBER() OVER(ORDER BY 科室) XH,类别,
                科室,
                sum(费用总计) 费用总计,
                sum(耗材费用) 耗材总费用,
                sum(护理耗材) 护理耗材,
                sum(case when 耗材类型='高值耗材' then 耗材费用 else 0 end) 高值耗材,
                sum(case when 耗材类型='普通耗材' then 耗材费用 else 0 end) 普通耗材,
                sum(药费费用) 药品总费用
            from (
                SELECT '住院' 类别,
                    cifs.DEPT_ID 编码,
                    cifs.DEPT_NAME 科室,
                    cifs.item_name 项目名,
                    cifs.ORDER_DOCNAME 开单医生,
                    cifs.NUM 数量,
                            cifs.RETAIL_PRICE 单价,
                    (RETAIL_VALUE) AS 费用总计,
                    (CASE WHEN ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 耗材费用,
                    (CASE WHEN cifs.ITEM_TYPE = 1 THEN RETAIL_VALUE ELSE 0 END) AS 药费费用,
                    (CASE WHEN mb.MEMBER_ROLE = 2 AND ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 护理耗材,
                    (case when cifs.STATITEM_CODE='36' then '普通耗材' WHEN cifs.STATITEM_CODE='77' then '高值耗材' else ' ' end)  耗材类型 
                FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
                LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
                ON cifs.ID = ciofs.FEE_ID
                AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
                LEFT JOIN BASEDATA.BAS_ORG_MEMBER mb
                on cifs.ORDER_DOCID = mb.ID 
            WHERE ((cifs.charge_date_two is not null and
                    cifs.charge_date_two BETWEEN
                    to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
                    to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')) or
                    (cifs.charge_date_two is null and cifs.CHARGE_DATE BETWEEN
                    to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
                    to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')))
                and cifs.inpatient_id not in
                    (select inpatient_id from INP.INP_INPAT_TEST) -- 排除测试病人 
                ---and ciofs.DICT_DETAIL_ID = '14'
                and cifs.item_name not like '%达芬奇%'
                and cifs.CHARGE_BIT = 1
                AND cifs.IS_DELETE = 'N'
                and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
                AND cifs.location_deptid <> '186' -- 排除测试科
                AND CIFS.DEPT_ID<> '80'  --排除麻醉科  
                AND CIFS.DEPT_ID<> '219'  --排除手术室 DSA  
                AND CIFS.DEPT_ID<> '374'  --排除手术室 DSA  
                AND CIFS.DEPT_ID<> '218'  --排除手术室 DSA  
                --- and CIFS.location_deptname in ('手足外科','脊柱外科二病室','心内科二病室','心胸外科病室','骨科一病室','脊柱外科一病室','创伤骨科','整形外科病室','心内科三病室','神经内科重症监护病房','心内科一病室','心血管重症监护室','神经外科重症加护病房','胃肠外科二','胃肠外科一','眼科病室','乳甲外科','泌尿外科二病室','肝胆脾胰外科') 
                UNION ALL
                SELECT '住院' 类别,
                    cifs.DEPT_ID 编码,
                    cifs.Dept_Name 科室,
                    cifs.item_name 项目名,
                    cifs.ORDER_DOCNAME 开单医生,
                    cifs.NUM 数量,
                            cifs.RETAIL_PRICE 单价,
                    (RETAIL_VALUE) AS 费用总计,
                    (CASE WHEN ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 耗材费用,
                    (CASE WHEN cifs.ITEM_TYPE = 1 THEN RETAIL_VALUE ELSE 0 END) AS 药费费用,
                    (CASE WHEN mb.MEMBER_ROLE = 2 AND ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 护理耗材,
                    (case when cifs.STATITEM_CODE='36' then '普通耗材' WHEN cifs.STATITEM_CODE='77' then '高值耗材' else ' ' end)  耗材类型 
                FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
                LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
                ON cifs.ID = ciofs.FEE_ID
                AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
                LEFT JOIN BASEDATA.BAS_ORG_MEMBER mb
                on cifs.ORDER_DOCID = mb.ID 
            WHERE ((cifs.charge_date_two is not null and
                    cifs.charge_date_two BETWEEN
                    to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
                    to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')) or
                    (cifs.charge_date_two is null and cifs.CHARGE_DATE BETWEEN
                    to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
                    to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')))
                and cifs.inpatient_id not in
                    (select inpatient_id from INP.INP_INPAT_TEST) -- 排除测试病人  
                ---and ciofs.DICT_DETAIL_ID = '14'
                and cifs.item_name not like '%达芬奇%'
                and cifs.CHARGE_BIT = 1
                AND cifs.IS_DELETE = 'N'
                and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
                AND cifs.location_deptid <> '186' -- 排除测试科
                AND CIFS.DEPT_ID= '80'  --麻醉科
                UNION ALL
                SELECT '住院' 类别,
                    cifs.DEPT_ID 编码,
                    cifs.location_deptname 科室,
                    cifs.item_name 项目名,
                    cifs.ORDER_DOCNAME 开单医生,
                    cifs.NUM 数量,
                            cifs.RETAIL_PRICE 单价,
                    (RETAIL_VALUE) AS 费用总计,
                    (CASE WHEN ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 耗材费用,
                    (CASE WHEN cifs.ITEM_TYPE = 1 THEN RETAIL_VALUE ELSE 0 END) AS 药费费用,
                    (CASE WHEN mb.MEMBER_ROLE = 2 AND ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 护理耗材,
                    (case when cifs.STATITEM_CODE='36' then '普通耗材' WHEN cifs.STATITEM_CODE='77' then '高值耗材' else ' ' end)  耗材类型 
                FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
                LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
                ON cifs.ID = ciofs.FEE_ID
                AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
                LEFT JOIN BASEDATA.BAS_ORG_MEMBER mb
                on cifs.ORDER_DOCID = mb.ID 
            WHERE ((cifs.charge_date_two is not null and cifs.charge_date_two BETWEEN
                    to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
                    to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')) or
                    (cifs.charge_date_two is null and
                    cifs.CHARGE_DATE BETWEEN
                    to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
                    to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')))
                and cifs.inpatient_id not in (select inpatient_id from INP.INP_INPAT_TEST) -- 排除测试病人  
                ---and ciofs.DICT_DETAIL_ID = '14'
                and cifs.item_name not like '%达芬奇%'
                and cifs.CHARGE_BIT = 1
                AND cifs.IS_DELETE = 'N'
                and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
                AND cifs.location_deptid <> '186' -- 排除测试科
                AND (CIFS.DEPT_ID= '219' or  CIFS.DEPT_ID= '374' or  CIFS.DEPT_ID= '218') -- 手术室 DSA
                ) temp GROUP BY 类别, 科室
            ) x order by x.类别,x.科室 asc`

    const result = (await connection).execute(sql)
    const items = (await result).rows
    // hzb:耗占比
    const resultItems = []
    // 耗材总费用
    let sum = 0
    items.forEach( e=>{
        let hzb = Math.floor((e.耗材总费用/(e.费用总计-e.药品总费用))*10000)/100
        sum+=e.耗材总费用
        resultItems.push(Object.assign({},e,{"耗占比":hzb}))
    })
    res.json({code:200,msg:'数据获取成功',items:resultItems, sum:Math.floor(sum*100)/100})
})

// 全院药占比
router.post('/searchDeptOperate/getdeptMedicientProportion', async (req,res,next) => {
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

// 科室金额排名前20的耗材
router.post('/searchDeptOperate/deptMaterialAmountTop20',async (req,res,next) => {
    const data = req.body
    const { page, limit, role } = req.body
    const start = data['startDate'].concat(' 00:00:00')
    const end = data['endDate'].concat(' 23:59:59')
    const sql = `select ROW_NUMBER() OVER(ORDER BY 科室) XH,科室,排序,项目名,耗材类型,数量,单价,金额,(case when 护理耗材>0 then '是' else '否' end) 是否护理类  
    from (select 类别,
          科室,
          项目名,
          耗材类型,
          row_number() over(partition by 科室 order by sum(耗材费用) DESC) 排序,
          sum(数量) 数量,
                单价,
          sum(耗材费用) 金额,
          sum(护理耗材) 护理耗材
     from (
       SELECT '住院' 类别,
            cifs.DEPT_ID 编码,
            cifs.DEPT_NAME 科室,
            cifs.item_name 项目名,
            cifs.ORDER_DOCNAME 开单医生,
            cifs.NUM 数量,
            cifs.RETAIL_PRICE 单价,
            (RETAIL_VALUE) AS 费用总计,
            (CASE WHEN ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 耗材费用,
            (CASE WHEN cifs.ITEM_TYPE = 1 THEN RETAIL_VALUE ELSE 0 END) AS 药费费用,
            (CASE WHEN mb.MEMBER_ROLE = 2 AND ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 护理耗材,
            (case when cifs.STATITEM_CODE='36' then '普通耗材' WHEN cifs.STATITEM_CODE='77' then '高值耗材' else ' ' end)  耗材类型 
       FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
       LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
         ON cifs.ID = ciofs.FEE_ID
        AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
       LEFT JOIN BASEDATA.BAS_ORG_MEMBER mb
        on cifs.ORDER_DOCID = mb.ID 
      WHERE ((cifs.charge_date_two is not null and
            cifs.charge_date_two BETWEEN
            to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
            to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')) or
            (cifs.charge_date_two is null and cifs.CHARGE_DATE BETWEEN
            to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
            to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')))
        and cifs.inpatient_id not in
            (select inpatient_id from INP.INP_INPAT_TEST) -- 排除测试病人 
        ---and ciofs.DICT_DETAIL_ID = '14'
        and cifs.item_name not like '%达芬奇%'
        and cifs.CHARGE_BIT = 1
        AND cifs.IS_DELETE = 'N'
        and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
        AND cifs.location_deptid <> '186' -- 排除测试科
        AND CIFS.DEPT_ID<> '80'  --排除麻醉科  
        AND CIFS.DEPT_ID<> '219'  --排除手术室 DSA  
        AND CIFS.DEPT_ID<> '374'  --排除手术室 DSA  
        AND CIFS.DEPT_ID<> '218'  --排除手术室 DSA  
        --- and CIFS.location_deptname in ('手足外科','脊柱外科二病室','心内科二病室','心胸外科病室','骨科一病室','脊柱外科一病室','创伤骨科','整形外科病室','心内科三病室','神经内科重症监护病房','心内科一病室','心血管重症监护室','神经外科重症加护病房','胃肠外科二','胃肠外科一','眼科病室','乳甲外科','泌尿外科二病室','肝胆脾胰外科') 
        UNION ALL
        SELECT '住院' 类别,
            cifs.DEPT_ID 编码,
            cifs.Dept_Name 科室,
            cifs.item_name 项目名,
            cifs.ORDER_DOCNAME 开单医生,
            cifs.NUM 数量,
                    cifs.RETAIL_PRICE 单价,
            (RETAIL_VALUE) AS 费用总计,
            (CASE WHEN ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 耗材费用,
            (CASE WHEN cifs.ITEM_TYPE = 1 THEN RETAIL_VALUE ELSE 0 END) AS 药费费用,
            (CASE WHEN mb.MEMBER_ROLE = 2 AND ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 护理耗材,
            (case when cifs.STATITEM_CODE='36' then '普通耗材' WHEN cifs.STATITEM_CODE='77' then '高值耗材' else ' ' end)  耗材类型 
       FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
       LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
         ON cifs.ID = ciofs.FEE_ID
        AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
       LEFT JOIN BASEDATA.BAS_ORG_MEMBER mb
        on cifs.ORDER_DOCID = mb.ID 
     WHERE ((cifs.charge_date_two is not null and
            cifs.charge_date_two BETWEEN
            to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
            to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')) or
            (cifs.charge_date_two is null and cifs.CHARGE_DATE BETWEEN
            to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
            to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')))
        and cifs.inpatient_id not in
            (select inpatient_id from INP.INP_INPAT_TEST) -- 排除测试病人  
        ---and ciofs.DICT_DETAIL_ID = '14'
        and cifs.item_name not like '%达芬奇%'
        and cifs.CHARGE_BIT = 1
        AND cifs.IS_DELETE = 'N'
        and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
        AND cifs.location_deptid <> '186' -- 排除测试科
        AND CIFS.DEPT_ID= '80'  --麻醉科
        UNION ALL
        SELECT '住院' 类别,
            cifs.DEPT_ID 编码,
            cifs.location_deptname 科室,
            cifs.item_name 项目名,
            cifs.ORDER_DOCNAME 开单医生,
            cifs.NUM 数量,
                    cifs.RETAIL_PRICE 单价,
            (RETAIL_VALUE) AS 费用总计,
            (CASE WHEN ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 耗材费用,
            (CASE WHEN cifs.ITEM_TYPE = 1 THEN RETAIL_VALUE ELSE 0 END) AS 药费费用,
            (CASE WHEN mb.MEMBER_ROLE = 2 AND ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 护理耗材,
            (case when cifs.STATITEM_CODE='36' then '普通耗材' WHEN cifs.STATITEM_CODE='77' then '高值耗材' else ' ' end)  耗材类型 
       FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
       LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
         ON cifs.ID = ciofs.FEE_ID
        AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
       LEFT JOIN BASEDATA.BAS_ORG_MEMBER mb
        on cifs.ORDER_DOCID = mb.ID 
     WHERE ((cifs.charge_date_two is not null and cifs.charge_date_two BETWEEN
            to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
            to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')) or
            (cifs.charge_date_two is null and
            cifs.CHARGE_DATE BETWEEN
            to_date('${start}', 'yyyy-MM-dd hh24:mi:ss') AND
            to_date('${end}', 'yyyy-MM-dd hh24:mi:ss')))
        and cifs.inpatient_id not in (select inpatient_id from INP.INP_INPAT_TEST) -- 排除测试病人  
        ---and ciofs.DICT_DETAIL_ID = '14'
        and cifs.item_name not like '%达芬奇%'
        and cifs.CHARGE_BIT = 1
        AND cifs.IS_DELETE = 'N'
        and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
        AND cifs.location_deptid <> '186' -- 排除测试科
        AND (CIFS.DEPT_ID= '219' or  CIFS.DEPT_ID= '374' or  CIFS.DEPT_ID= '218') -- 手术室 DSA
       ) where 耗材费用<>0 
    group by 类别,科室,项目名,耗材类型,单价) x where 排序<=20
    order by 类别,科室,排序 asc`
    const result = (await connection).execute(sql)
    const items = (await result).rows
    if (page !== undefined || limit !== undefined) {
        const pageList = items.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
        res.json({code:200,msg:'获取数据成功',items:pageList,total:items.length})
    }else{
        res.json({code:200,msg:'获取数据成功',items:items})
    }
})

// 住院科室耗材排名
router.post('/searchDeptOperate/deptMaterialSorted', async (req,res,next) => {
    const data = req.body
    const start = data['startDate'].concat(' 00:00:00')
    const end = data['endDate'].concat(' 23:59:59')
    sql = `select  科室,row_number() over(order by 金额 DESC) 排序,金额
    from (select 类别,科室,sum(耗材费用) 金额
    from (SELECT '住院' 类别,cifs.DEPT_ID 编码,cifs.DEPT_NAME 科室,cifs.item_name 项目名,cifs.ORDER_DOCNAME 开单医生,cifs.NUM 数量,cifs.RETAIL_PRICE 单价,
            (RETAIL_VALUE) AS 费用总计,
            (CASE WHEN ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 耗材费用,
            (CASE WHEN cifs.ITEM_TYPE = 1 THEN RETAIL_VALUE ELSE 0 END) AS 药费费用,
            (CASE WHEN mb.MEMBER_ROLE = 2 AND ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 护理耗材,
            (case when cifs.STATITEM_CODE='36' then '普通耗材' WHEN cifs.STATITEM_CODE='77' then '高值耗材' else ' ' end)  耗材类型 
       FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
       LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
         ON cifs.ID = ciofs.FEE_ID
        AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
       LEFT JOIN BASEDATA.BAS_ORG_MEMBER mb
        on cifs.ORDER_DOCID = mb.ID 
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
        ---and ciofs.DICT_DETAIL_ID = '14'
        and cifs.item_name not like '%达芬奇%'
        and cifs.CHARGE_BIT = 1
        AND cifs.IS_DELETE = 'N'
        and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
        AND cifs.location_deptid <> '186' -- 排除测试科
        AND CIFS.DEPT_ID<> '80'  --排除麻醉科  
        AND CIFS.DEPT_ID<> '219'  --排除手术室 DSA  
        AND CIFS.DEPT_ID<> '374'  --排除手术室 DSA  
        AND CIFS.DEPT_ID<> '218'  --排除手术室 DSA  
        --- and CIFS.location_deptname in ('手足外科','脊柱外科二病室','心内科二病室','心胸外科病室','骨科一病室','脊柱外科一病室','创伤骨科','整形外科病室','心内科三病室','神经内科重症监护病房','心内科一病室','心血管重症监护室','神经外科重症加护病房','胃肠外科二','胃肠外科一','眼科病室','乳甲外科','泌尿外科二病室','肝胆脾胰外科') 
        UNION ALL
        SELECT '住院' 类别,cifs.DEPT_ID 编码,cifs.Dept_Name 科室,cifs.item_name 项目名,cifs.ORDER_DOCNAME 开单医生,cifs.NUM 数量,cifs.RETAIL_PRICE 单价,
            (RETAIL_VALUE) AS 费用总计,
            (CASE WHEN ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 耗材费用,
            (CASE WHEN cifs.ITEM_TYPE = 1 THEN RETAIL_VALUE ELSE 0 END) AS 药费费用,
            (CASE WHEN mb.MEMBER_ROLE = 2 AND ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 护理耗材,
            (case when cifs.STATITEM_CODE='36' then '普通耗材' WHEN cifs.STATITEM_CODE='77' then '高值耗材' else ' ' end)  耗材类型 
       FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
       LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
         ON cifs.ID = ciofs.FEE_ID
        AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
       LEFT JOIN BASEDATA.BAS_ORG_MEMBER mb
        on cifs.ORDER_DOCID = mb.ID 
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
        ---and ciofs.DICT_DETAIL_ID = '14'
        and cifs.item_name not like '%达芬奇%'
        and cifs.CHARGE_BIT = 1
        AND cifs.IS_DELETE = 'N'
        and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
        AND cifs.location_deptid <> '186' -- 排除测试科
        AND CIFS.DEPT_ID= '80'  --麻醉科
        UNION ALL
        SELECT '住院' 类别,cifs.DEPT_ID 编码,cifs.location_deptname 科室,cifs.item_name 项目名,cifs.ORDER_DOCNAME 开单医生,cifs.NUM 数量,cifs.RETAIL_PRICE 单价,
            (RETAIL_VALUE) AS 费用总计,
            (CASE WHEN ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 耗材费用,
            (CASE WHEN cifs.ITEM_TYPE = 1 THEN RETAIL_VALUE ELSE 0 END) AS 药费费用,
            (CASE WHEN mb.MEMBER_ROLE = 2 AND ciofs.DICT_DETAIL_ID IN ('14') THEN RETAIL_VALUE ELSE 0 END) AS 护理耗材,
            (case when cifs.STATITEM_CODE='36' then '普通耗材' WHEN cifs.STATITEM_CODE='77' then '高值耗材' else ' ' end)  耗材类型 
       FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
       LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
         ON cifs.ID = ciofs.FEE_ID
        AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
       LEFT JOIN BASEDATA.BAS_ORG_MEMBER mb
        on cifs.ORDER_DOCID = mb.ID 
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
        ---and ciofs.DICT_DETAIL_ID = '14'
        and cifs.item_name not like '%达芬奇%'
        and cifs.CHARGE_BIT = 1
        AND cifs.IS_DELETE = 'N'
        and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
        AND cifs.location_deptid <> '186' -- 排除测试科
        AND (CIFS.DEPT_ID= '219' or  CIFS.DEPT_ID= '374' or  CIFS.DEPT_ID= '218') -- 手术室 DSA
       ) where 耗材费用<>0 
    group by 类别,科室) x
    order by 金额 DESC`
    const result = (await connection).execute(sql)
    const items = (await result).rows
    let sum = 0
    items.forEach(e => {
        sum+=e.金额
    })
    res.json({code:200,msg:'获取数据成功',items:items,sum:sum})
})

module.exports = router