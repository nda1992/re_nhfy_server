const express = require('express')
const router = express.Router()
const {connection} = require('../../utils/mysqlConnection')
const mysql = require('mysql')
const tableTitle = require('../../models/tabletitle')
const {DataTypes} = require('sequelize')
const sequelize = require('../../database/connection')
const moment = require('moment')
// 定制报表标题
router.post('/createTableTitle',async (req,res,next)=>{
    const data = req.query
    console.log(data)
    await tableTitle(sequelize,DataTypes).create({title:data.title,desc:data.desc}).then(result=>{
        if(result){
            res.json({code:200,msg:'创建成功'})    
        }else{
            res.json({code:201,msg:'创建失败'})
        }
    })
})
//获取表格标题的列表
router.get('/getTableTitleList',async (req,res,next)=>{
    const data = req.query
    if(data.role!=='admin'){
        res.json({code:201,msg:'您没有权限查看该页面的内容'})
    }else{
        await tableTitle(sequelize,DataTypes).findAll().then((result)=>{
            let obj=[]
            result.forEach(item=>{
                let temp={}
                temp.id = item.id
                temp.title = item.title
                temp.desc = item.desc
                temp.createdDate = moment(item.createdAt).format('YYYY-MM-DD')
                obj.push(temp)
            })
            res.json({code:200,msg:'获取列表成功',items:obj})
        })
    }
})
//更新表格标题
router.post('/updateTableTitle',async (req,res,next)=>{
    const data = req.body
    // console.log(data)
    if(data.role!=='admin'){
        res.json({code:201,msg:'您没有权限进行更新'})
    }else{
        await tableTitle(sequelize,DataTypes).update({title:data.title,desc:data.desc},{where:{id:data.id}}).then(result=>{
            if(result){
                res.json({code:200,msg:'更新成功'})
            }else{
                res.json({code:202,msg:'更新失败'})
            }
        })
    }
})

//删除表格标题
router.delete('/deleteTableTitle',async (req,res,next)=>{
    const data = req.body
    console.log(data)
    if(data.role!=='admin'){
        res.json({code:201,msg:'您没有权限删除'})
    }else{
        await tableTitle(sequelize,DataTypes).destroy({where:{id:data.id}}).then(result=>{
            if(result){
                res.json({code:200,msg:'删除成功'})
            }else{
                res.json({code:202,msg:'删除失败'})
            }
        })
    }
})


module.exports=router