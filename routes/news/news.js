//新闻模块的相关路由
const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const News = require('../../models/news')
const { DataTypes, Op } = require('sequelize')
const sequelize = require('../../database/connection')
const User = require('../../models/user')
const Category = require('../../models/category')
const Dept = require('../../models/dept')
const moment = require('moment-timezone')
// 设置时区
moment.tz.setDefault('Asia/Shanghai')
//搜索作者
router.get('/searchUser',async (req,res,next)=>{
    const data = req.query
    let obj = []
    await User(sequelize,DataTypes).findAll({where: {username:{[Op.like]: `%${data['0']}%`}}}).then(result=>{
        if(result){
            result.forEach(e=>{
                let temp = {}
                temp.username = e.username
                obj.push(temp)
            })
            res.json({code:200,items:obj})
        }else{
            res.json({code:201,items:'查询失败'})
        }
    })
})

// 模糊搜索新闻类别
router.get('/searchCategory',async (req,res,next)=>{
    const data = req.query
    let obj = []
    await Category(sequelize,DataTypes).findAll({where: {name:{[Op.like]:`%${data['0']}%`}}}).then(result=>{
        if(result){
            result.forEach(e=>{
                let temp = {}
                temp.name = e.name
                obj.push(temp)
            })
            res.json({code:200,items:obj})
        }else{
            res.json({code:201,items:'查询失败'})
        }
    })
})

// 添加新闻类别
router.post('/createCategory',async (req,res,next)=>{
    const data = req.body
    await Category(sequelize,DataTypes).create({name:data.name,username:data.username}).then(result=>{
        if(result){
            res.json({code:200,msg:'添加成功'})
        }else{
            res.json({code:201,msg:'添加失败'})
        }
    })
})
// 模糊搜索部门
router.get('/searchDept',async (req,res,next)=>{
    const data = req.query
    let obj = []
    await Dept(sequelize,DataTypes).findAll({where: {deptName:{[Op.like]:`%${data['0']}%`}}}).then(result=>{
        if(result){
            result.forEach(e=>{
                let temp = {}
                temp.name = e.deptName
                obj.push(temp)
            })
            res.json({code:200,items:obj})
        }else{
            res.json({code:201,items:'查询失败'})
        }
    })
})

// --------------------------------------文章相关路由---------------------------------------------------

// 发布文章
router.post('/releaseNews',async (req,res,next)=>{
    const { id, author, status, title, content, display_time, platforms, category, deptName, type, role, newsStatus, loginuserCode } = req.body
    // console.log(req.body)
    // console.log(req.headers)
    if(role!=='admin'){
        res.json({code:404,msg:"您没有权限发布新闻"})
    }else{
        // res.json({code:200,msg:"新闻发表成功"})
        let plateform = 0
        if(platforms.length===1 && platforms[0]==='院内网站'){
            plateform = 1
        }else if(platforms.length===1 && platforms[0]==='院外网站'){
            plateform=2
        }else{
            plateform=3
        }
        await News(sequelize,DataTypes).findOne({where: {id:id}}).then(async item=>{
            //不存在，则创建新纪录
            if(!item){
                await News(sequelize,DataTypes).create({title:title,content:content,userName:author,deptName:deptName,createTime:moment(display_time).format('YYYY-MM-DD HH:mm:ss'),category:category,clickNum:0,status:status,type:type,newsStatus:newsStatus,plateform:plateform,loginuserCode:loginuserCode}).then((result)=>{
                    if(result){
                        res.json({code:200,msg:"新闻发表成功"})
                    }else{
                        res.json({code:201,msg:"新闻发表失败"})
                    }
                })
            }else{
                //存在记录，则进行更新
                await News(sequelize,DataTypes).update({title:title,content:content,userName:author,deptName:deptName,createTime:moment(display_time).format('YYYY-MM-DD HH:mm:ss'),category:category,clickNum:0,status:status,type:type,newsStatus:newsStatus,plateform:plateform,loginuserCode:loginuserCode},{where:{id:id}}).then(result=>{
                    if(result){
                        res.json({code:200,msg:"新闻更新成功"})
                    }else{
                        res.json({code:202,msg:"新闻发表失败"})
                    }
                })
            }
        })
    }
})

// 无条件获取文章草稿标题
router.get('/getDraftList',async (req,res,next)=>{
    const data = req.query
    const type = 2
    console.log(data)
    if (data.role!=='admin') {
        res.json({code:201,msg:'您没有权限获取内容'})
    }else{
        await News(sequelize,DataTypes).findAll({where: {type:type,loginuserCode:data.loginuserCode}}).then(result=>{
            if(result){
                res.json({code:200,msg:'获取内容成功',items:result})
            }else{
                res.json({code:202,msg:'获取内容失败'})
            }
        })
    }
})


// 根据新闻id查询草稿
router.get('/getDraftByTitle',async (req,res,next)=>{
    const data = req.query
    await News(sequelize,DataTypes).findOne({where: {id: data.id}}).then(result=>{
        if(result){
            res.json({code:200,msg:'数据获取成功',result:result})
        }else{
            res.json({code:201,msg:'数据获取失败'})
        }
    })
})


// 获取所有文章记录
router.get('/getnewsList',async (req,res,next)=>{
    const { role, limit, page } = req.query
    if(role!=='admin'){
        res.json({code:201,msg:"您没有权限访问该页面"})
    }else{
        await News(sequelize,DataTypes).findAll().then(result=>{
            if(result){
                let news = result.map(e => {
                    let timeTemp = moment(e.createTime).format('YYYY-MM-DD HH:mm:ss')
                    let newstatus = e.status === 'draft' ? '草稿' : '已发布'
                    return { id:e.id, title:e.title, content:e.content,createTime:timeTemp,type:e.type,newsStatus:e.newsStatus,userName:e.userName,deptName:e.deptName,clickNum:e.clickNum,status:newstatus,plateform:e.plateform,category:e.category}
                })
                const pageList =news.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
                res.json({code:200,msg:'获取新闻成功',items:pageList,total:news.length})
            }else{
                res.json({code:201,msg:'获取数据失败'})
            }
        })
    }
})


// 文章图片上传
const filePath = path.join(__dirname,'../../public/images/news')
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,filePath)
    }, 
    filename: (req,file,cb)=>{
        const filename = file.originalname
        cb(null,filename)
    }
})
const uploader = multer({storage:storage})
router.post('/upload',uploader.array('file'),(req,res,next)=>{
    const imgOrigin = 'http://localhost:3000/images/news/'
    const originpath = path.join(__dirname,'../../public/images/news/')
    // const fileName = req.files.originalname
    // const currentFileName = imgOrigin+uuid+path.extname(fileName)
    const files = req.files
    console.log(files)
    let temp = files.map(e=>{
        const uuid = uuidv4()
        let basename = path.basename(e.path)    //源文件名
        let suffix = path.extname(e.path)       //文件后缀
        let newname = uuid+suffix               //新文件名
        // console.log(newname)
        fs.rename(originpath+basename,originpath+newname,err=>{
            // console.log(err)
        })
        return {file:imgOrigin+newname}
        // return {file:imgOrigin+e.originalname}
    })
    res.json({errno:0,files:temp})
})
module.exports = router