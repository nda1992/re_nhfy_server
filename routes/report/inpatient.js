const express = require('express')
const router = express.Router()
const { Oracleconnection } = require('../../utils/oracleConnection')

// 查询住院科室的药耗占比、医疗有效收入、医疗服务收入等
router.post('/getinpatientMedicineMaterialProp', async (req, res, next) => {
    const { startDate,endDate } = req.body
    const start = startDate.concat(' 00:00:00')
    const end = endDate.concat(' 23:59:59')
    sql = `
    with temp as (
        SELECT * FROM (
        SELECT
            dept_name as DEPT_NAME,
            SUM(CASE WHEN STATITEM_CODE IN('21') then 金额 else 0 end) 床位费,
            SUM(CASE WHEN STATITEM_CODE IN('06','63') then 金额 else 0 end) 诊查费,
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
            SUM(CASE WHEN STATITEM_CODE IN('23','30','32','35','44','45','46','47','48','49','57','58','67','71','74','75','21','06','63','24','40','41','42','43','53','54','55','56','60','61','62','65','66','68','69','70','73','59','22','26','27','29','31','39','51','28','33','34','72','77','36','01','02','03','05','38','50','64','76','52','25') then 金额 else 0 end) 总收入
        FROM 
        (select a.dept_name,a.STATITEM_CODE,b.ITEM_NAME,sum(a.RETAIL_VALUE) 金额 from CHG.CHG_INPATIENT_FEE_SPECI a 
        left join BASEDATA.BAS_STAT_ITEM b
        on a.STATITEM_CODE = b.CODE
        where a.CHARGE_DATE between to_date('${start}','yyyy-MM-dd HH24:mi:ss') and to_date('${end}','yyyy-MM-dd HH24:mi:ss') and a.IS_DELETE='N' group by a.dept_name,a.STATITEM_CODE,b.ITEM_NAME
        ) GROUP BY DEPT_NAME
        ) A
        LEFT JOIN
        (
        SELECT * FROM 
        (
        SELECT '住院' 类别,
                 cifs.location_deptid 编码,
                 cifs.location_deptname 科室,
                 SUM(CASE WHEN wyn.shh is not null THEN RETAIL_VALUE ELSE 0 END) AS 国家谈判品种
            FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
            LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
              ON cifs.ID = ciofs.FEE_ID
             AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
            left join chk.wz_yzhzb_no wyn
              on wyn.wz_id = cifs.item_id
             and cifs.item_type = '1'
           WHERE ((cifs.charge_date_two is not null and
                 cifs.charge_date_two BETWEEN
                 to_date('${start}','yyyy-MM-dd HH24:mi:ss') AND
                 to_date('${end}','yyyy-MM-dd HH24:mi:ss')) or
                 (cifs.charge_date_two is null and
                 cifs.CHARGE_DATE BETWEEN
                 to_date('${start}','yyyy-MM-dd HH24:mi:ss') AND
                 to_date('${end}','yyyy-MM-dd HH24:mi:ss')))
             and cifs.inpatient_id not in
                 (select inpatient_id from INP.INP_INPAT_TEST) -- 排除测试病人 
             and cifs.CHARGE_BIT = 1
             AND cifs.IS_DELETE = 'N'
             and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
             AND cifs.location_deptid <> '186' -- 排除测试科
             AND CIFS.DEPT_ID<> '80'  --排除麻醉科
                 group by cifs.location_deptid,cifs.location_deptname
             UNION ALL
             SELECT '住院' 类别,
                 cifs.DEPT_ID 编码,
                 cifs.Dept_Name 科室,
                 SUM(CASE WHEN wyn.shh is not null THEN RETAIL_VALUE ELSE 0 END) AS 国家谈判品种
            FROM CHG.CHG_INPATIENT_FEE_SPECI cifs
            LEFT JOIN CHG.CHG_INPATIENT_ORDER_FEE_SPE_TYPE ciofs
              ON cifs.ID = ciofs.FEE_ID
             AND ciofs.DICT_CATALOG_ID = 'SFTJ_003' --住院发票分类
            left join chk.wz_yzhzb_no wyn
              on wyn.wz_id = cifs.item_id
             and cifs.item_type = '1'
           WHERE ((cifs.charge_date_two is not null and
                 cifs.charge_date_two BETWEEN
                 to_date('${start}','yyyy-MM-dd HH24:mi:ss') AND
                 to_date('${end}','yyyy-MM-dd HH24:mi:ss')) or
                 (cifs.charge_date_two is null and
                 cifs.CHARGE_DATE BETWEEN
                 to_date('${start}','yyyy-MM-dd HH24:mi:ss') AND
                 to_date('${end}','yyyy-MM-dd HH24:mi:ss')))
             and cifs.inpatient_id not in
                 (select inpatient_id from INP.INP_INPAT_TEST) -- 排除测试病人 
             and cifs.CHARGE_BIT = 1
             AND cifs.IS_DELETE = 'N'
             and (cifs.order_id <> '0000000000' or cifs.order_id is null) -- 排除导入费用 
             AND cifs.location_deptid <> '186' -- 排除测试科
             AND CIFS.DEPT_ID= '80'  --麻醉科
            group by cifs.DEPT_ID,cifs.Dept_Name
        )
        ) B
        ON A.DEPT_NAME=B.科室
        )
        SELECT XH,病人所在科室,总收入,(总收入-高值耗材费-卫生材料费-西药费-中药饮片费-中成药费) 医疗有效收入,
        (总收入-高值耗材费-卫生材料费-西药费-中药饮片费-中成药费-检查费-化验费) 医疗服务收入,
        ROUND(DECODE((西药费+中成药费-国家谈判品种),0,0,(西药费+中成药费-国家谈判品种)/(总收入)*100),2) 药占比,
        ROUND(DECODE((卫生材料费+高值耗材费),0,0,(卫生材料费+高值耗材费)/(总收入-西药费-中药饮片费-中成药费)*100),2) 耗占比,
        ROUND(DECODE((总收入-高值耗材费-卫生材料费-西药费-中药饮片费-中成药费),0,0,(总收入-高值耗材费-卫生材料费-西药费-中药饮片费-中成药费)/总收入)*100,2) 医疗有效收入占比,
        ROUND(DECODE(总收入-高值耗材费-卫生材料费-西药费-中药饮片费-中成药费-检查费-化验费,0,0,(总收入-高值耗材费-卫生材料费-西药费-中药饮片费-中成药费-检查费-化验费)/总收入)*100,2) 医疗服务收入占比
        FROM (
        SELECT ROW_NUMBER() OVER (ORDER BY DEPT_NAME) AS xh,DEPT_NAME as 病人所在科室,总收入,(CASE WHEN 国家谈判品种 IS NULL  THEN 0 ELSE 国家谈判品种 END)国家谈判品种,高值耗材费,卫生材料费,西药费,中药饮片费,中成药费,检查费,化验费 FROM temp
        )`
    const result = (await Oracleconnection).execute(sql)
    items = (await result).rows
    const lists = items.map(e => {
        return {
            '序号': e.XH,
            '病人所在科室': e.病人所在科室,
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


module.exports = router
