//新闻模块的相关路由
const express = require('express')
const router = express.Router();
const News = require('../../models/news')
const {DataTypes} = require('sequelize')
const sequelize = require('../../database/connection')

// 添加新闻
router.post('/addNews',async (req,res,next)=>{
    const data = req.body
    if(data.role!=='admin'){
        res.json({code:404,msg:"您没有权限发布新闻"})
    }else{
        await News(sequelize,DataTypes).create({title:data.title,content:data.content,userName:data.userName,deptName:data.deptName,createTime:data.createTime,category:data.category,clickNum:0,status:2}).then((result)=>{
            if(result){
                res.json({code:200,msg:"新闻发表成功"})
            }else{
                res.json({code:201,msg:"新闻发表失败"})
            }
        })
    }
})


module.exports = router