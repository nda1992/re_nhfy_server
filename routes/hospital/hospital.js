/*
hospital模块的相关路由
*/
const express = require('express')
const router = express.Router();
const Dept = require('../../models/dept')
const {DataTypes} = require('sequelize')
const sequelize = require('../../database/connection')
//1.医院管理——部门管理
//添加部门
router.post('/addDept',async (req,res,next)=>{
    const { deptName,deptCode,deptAddr,deptLeader,desc,level } = req.body
    await Dept(sequelize,DataTypes).findOne({where:{deptcode:deptCode}}).then(async result=>{
        if(result){
            res.json({code:201,msg:"该部门编号已经存在,请输入唯一的部门编号值"})
        }else{
            await Dept(sequelize,DataTypes).create({deptName:deptName,deptCode:deptCode,deptAddr:deptAddr,deleteBit:1,deptLeader:deptLeader,desc:desc,level:level}).then(result=>{
                if(result){
                    res.json({code:200,msg:"部门添加成功"})
                }else{
                    res.json({code:201,msg:"部门添加失败"})
                }        
            })
        }
    })
})

//获取部门列表
router.get('/getdeptList',async (req,res,next)=>{
    const { page,limit,role } = req.query
    if(role!=='admin'){
        res.json({code:201,msg:"您没有权限访问该页面"})
    }else{
        await Dept(sequelize,DataTypes).findAll().then(result=>{
            let depts = []
            result.forEach(dept=>{
                depts.push({id:dept.id,deptName:dept.deptName,deptCode:dept.deptCode,deptAddr:dept.deptAddr,deptLeader:dept.deptLeader,desc:dept.desc,level:dept.level})
            })
            const pageList = depts.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
            res.json({code:200,msg:"获取部门列表成功",depts:pageList,total:depts.length})
        })
    }
})

//更新部门信息
router.post('/updateDept',async (req,res,next)=>{
    const {id,deptCode,deptName,deptAddr,deptLeader,level,desc} = req.body
    await Dept(sequelize,DataTypes).findOne({where: {id:id}}).then(async dept=>{
        if(dept){
            await Dept(sequelize,DataTypes).update({deptCode:deptCode,deptName:deptName,deptAddr:deptAddr,deptLeader:deptLeader,level:level,desc:desc},{where:{id:id}}).then(result=>{
            res.json({code:200,msg:"更新成功"})
            })
        }else{
            res.json({code:201,msg:'更新的科室不存在'})
        }
    })
})


//删除部门
router.delete('/deleteDept',async (req, res,next) => {
    const {id} = req.query
    await Dept(sequelize,DataTypes).findOne({where:{id:id}}).then(async dept => {
        if(dept){
            await Dept(sequelize,DataTypes).destroy({where:{id:id}}).then(result=>{
                res.json({code:200,msg:"删除成功"})
            })
        }else{
            res.json({code:201,msg:"部门不存在，删除失败"})
        }
    })
})



module.exports = router