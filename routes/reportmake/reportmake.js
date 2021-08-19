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
    const data = req.body
    console.log(data)
    await tableTitle(sequelize,DataTypes).create({title:data.tableTitle,desc:data.desc}).then(result=>{
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


module.exports=router