# 可视化路由文档

## 1.概述

一级路由：/visualize/

### 主题分类
#### 全院汇总主题

二级路由：/summary/

1. **门诊费用汇总**

   router：/outpatientRevenueCount/

   描述：汇总门急诊的总费用（周期：每日、每周、每月、季度和年度）

2. **住院费用汇总**
  router：/inpatientRevenueCount/

  描述：汇总住院的总费用（周期：每日、每周、每月、季度和年度）

3. **门急诊人次汇总**
  router：/outpatientCount/

  描述：门急诊总人次（周期：每日、每周、每月、季度和年度）

4. **入院人数汇总**
  router：/inpatientComeCount/

5. **出院人数汇总**
  router：/inpatientOutCount/

6. **药占比汇总**

   router：/medicineProportion/

7. **耗占比汇总**

   router：/materialProportion/

8. **手术量汇总**

   router：/operationCount/

#### 科室Top10主题

将费用、人次等以科室为单位进行分类汇总

二级路由： /groupByDept/

1. 科室收入

   router: /revenue/

2. 科室门诊人次

   router: /outpatient/

3. 科室入院人数

   router: /inpatientCome/

4. 科室出院人数

   router: /inpatientOut/

5. 科室门诊收入

   router: /outpatientRevenueCount/

6. 科室门诊医疗有效收入

   router: /outpatientRevenueEffective/

7. 科室门诊医疗服务收入

   router: /outpatientRevenueService/

8. 科室门诊药品收入

   router: /outpatientRevenueMedicine/

9. 科室门诊材料收入

   router:  /outpatientRevenueMaterial/

10. 科室门诊药占比

    router: /outpatientMedicineProportion/

11. 科室门诊耗占比

    router: /outpatientMaterialProportaion/

12. 科室住院收入

    router: /inpatientRevenueCount/

13. 科室住院医疗有效收入

    rotuer: /inpatientRevenueEffective/

14. 科室住院医疗服务收入

    rotuer: /inpatientRevenueService/

15. 科室住院药品收入

    rotuer: /inpatientRevenueMedicine/

16. 科室住院材料收入

    rotuer: /inpatientRevenueMaterial/

17. 科室住院药占比

    rotuer: /inpatientMedicineProportion/

18. 科室住院耗占比

    rotuer: /inpatientMaterialProportion/



#### 项目构成主题

router: /componentPart/

描述：门诊收入构成、住院收入构成、门诊患者地域构成、门诊患者年龄构成、门诊患者性别构成



## 2.数据库构建

| parentTopic   | parentUrl       | childrenTopic        | childrenUrl                     |
| ------------- | --------------- | -------------------- | ------------------------------- |
| 全院汇总主题  | /summary/       | 全院总收入           | /allRevenueCount/               |
| 全院汇总主题  | /summary/       | 门诊医疗收入         | /outpatientRevenueCount/        |
| 全院汇总主题  | /summary/       | 门诊医疗有效收入     | /outpatientRevenueEffective/    |
| 全院汇总主题  | /summary/       | 门诊医疗服务收入     | /outpatientRevenueService/      |
| 全院汇总主题  | /summary/       | 门诊药品收入         | /outpatientRevenueMedicine/     |
| 全院汇总主题  | /summary/       | 门诊材料收入         | /outpatientRevenueMaterial/     |
| 全院汇总主题  | /summary/       | 门急诊人次汇总       | /outpatientNumCount/            |
| 全院汇总主题  | /summary/       | 住院医疗收入         | /inpatientRevenueCount/         |
| 全院汇总主题  | /summary/       | 住院医疗有效收入     | /inpatientRevenueEffective/     |
| 全院汇总主题  | /summary/       | 住院医疗服务收入     | /inpatientRevenueService/       |
| 全院汇总主题  | /summary/       | 住院药品收入         | /inpatientRevenueMedicine/      |
| 全院汇总主题  | /summary/       | 住院材料收入         | /inpatientRevenueMaterial/      |
| 全院汇总主题  | /summary/       | 药占比汇总           | /medicineProportion/            |
| 全院汇总主题  | /summary/       | 耗占比汇总           | /materialProportion/            |
| 全院汇总主题  | /summary/       | 门诊药占比           | /outpatientMedicineProportion/  |
| 全院汇总主题  | /summary/       | 门诊耗占比           | /outpatientMaterialProportion/  |
| 全院汇总主题  | /summary/       | 住院药占比           | /inpatientMedicineProportion/   |
| 全院汇总主题  | /summary/       | 住院耗占比           | /inpatientMaterialProportion/   |
| 全院汇总主题  | /summary/       | 入院人数             | /inpatientComeCount/            |
| 全院汇总主题  | /summary/       | 出院人数             | /inpatientOutCount/             |
| 全院汇总主题  | /summary/       | 手术量汇总           | /operationCount/                |
| 科室Top10主题 | /deptTop10/     | 门诊科室医疗收入     | /outpatientRevenueCount/        |
| 科室Top10主题 | /deptTop10/     | 门诊科室医疗有效收入 | /outpatientRevenueEffective/    |
| 科室Top10主题 | /deptTop10/     | 门诊科室医疗服务收入 | /outpatientRevenueService/      |
| 科室Top10主题 | /deptTop10/     | 门诊科室药品收入     | /outpatientRevenueMedicine/     |
| 科室Top10主题 | /deptTop10/     | 门诊科室材料收入     | /outpatientRevenueMaterial/     |
| 科室Top10主题 | /deptTop10/     | 门诊科室患者人次     | /outpatientNumCount/            |
| 科室Top10主题 | /deptTop10/     | 住院科室医疗收入     | /inpatientRevenueCount/         |
| 科室Top10主题 | /deptTop10/     | 住院科室医疗有效收入 | /inpatientRevenueEffective/     |
| 科室Top10主题 | /deptTop10/     | 住院科室医疗服务收入 | /inpatientRevenueService/       |
| 科室Top10主题 | /deptTop10/     | 住院科室药品收入     | /inpatientRevenueMedicine/      |
| 科室Top10主题 | /deptTop10/     | 住院科室材料收入     | /inpatientRevenueMaterial/      |
| 科室Top10主题 | /deptTop10/     | 门诊科室药占比       | /outpatientMedicineProportion/  |
| 科室Top10主题 | /deptTop10/     | 门诊科室耗占比       | /outpatientMaterialProportaion/ |
| 科室Top10主题 | /deptTop10/     | 住院科室药占比       | /inpatientMedicineProportion/   |
| 科室Top10主题 | /deptTop10/     | 住院科室耗占比       | /inpatientMaterialProportaion/  |
| 科室Top10主题 | /deptTop10/     | 门诊医生工作量       | /outpatientDoctorJobs/          |
| 科室Top10主题 | /deptTop10/     | 住院医生工作量       | /inpatientDoctorJobs/           |
| 项目构成主题  | /componentPart/ | 门诊收入构成         | /outpatientRevenueComponent/    |
| 项目构成主题  | /componentPart/ | 住院收入构成         | /inpatientRevenueComponent/     |
| 项目构成主题  | /componentPart/ | 门诊患者地域构成     | /patientRegion/                 |
| 项目构成主题  | /componentPart/ | 门诊患者年龄构成     | /patientAge/                    |
| 项目构成主题  | /componentPart/ | 门诊患者性别构成     | /patientSex/                    |

