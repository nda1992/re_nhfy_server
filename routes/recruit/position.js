/*
岗位相关的路由：
- 用户简历投递
- 用户收藏岗位
- 用户分享岗位
*/
const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const multer = require('multer')
const moment = require('moment-timezone')
const saltPasswd = require('../../utils/saltPasswd')
const comparePasswd = require('../../utils/saltPasswd')
const { Op } = require('sequelize')
const { positionInstance, jobSeekerInstance,post2positionInstance } = require('../../database/models/associate')
// 设置时区
moment.tz.setDefault('Asia/Shanghai')



// 求职者注册
router.post('/positionRegister',async (req,res,next) => {
    const { username, password, phone, email } = req.body
    const hash = await saltPasswd.saltPasswd(password)
    await jobSeekerInstance.findOne({where:{username:username,phone:phone}}).then(async user => {
        if(user){
            res.json({code:202,msg:'该用户的手机号已经注册了,可直接登录'})
        }else{
            await jobSeekerInstance.create({username:username,password:hash,phone:phone,email:email}).then(result => {
                if(result){
                    res.json({code:200,msg:'注册成功,你可以进行登录了'})
                }else{
                    res.json({code:201,msg:'注册失败'})
                }
            })
        }
    })
})

// 求职者信息完善
router.post('/jobSeekerInfoComplete',async (req,res,next) => {
    const data = req.body
    // 所有的注册用户均为jobseeker角色
    const role = 'jobseeker'
    // 密码加密
    const hash = await saltPasswd.saltPasswd(data.password)
    // 登录次数
    const loginNum = 0
    await jobSeekerInstance.findOne({where:{openid:data.openid}}).then( async result => {
        // 用户不存在，新建
        if(!result){
            await jobSeekerInstance.create({openid:data.openid,
                username:data.username,password:hash,faceimgUrl:data.faceimgUrl,
                phone:data.phone,sex:data.sex,age:data.age,birthday:data.birthday,
                nation:data.nation,degree:data.degree,professional:data.professional,
                undergraduateTime:data.undergraduateTime,attachmentUrl:data.attachmentUrl,
                role:role,email:data.email,address:data.address,school:data.school,loginNum:loginNum}).then( user => {
                if(user){
                    res.json({code:200, msg:'注册成功'})
                }else{
                    res.json({code:201, msg:'注册失败'})
                }
            } )
        }else{
            res.json({code:202, msg:'该用户已经注册了，可直接进行登录'})
        }
    })
})

// jobseeker登录
router.post('/positionLogin',async (req,res,next) => {
    const { account, password } = req.body
    // 手机号登录
    if (!account || !password) {
        res.json({code:201, msg:'账号或密码不能为空'})
    }else {
        // 手机号登录
        if (account.indexOf('@') === -1) {
            await jobSeekerInstance.findOne({where: {phone: account}}).then(async (result) => {
                if(!result) {
                    res.json({code:202, msg:'账号不存在,登录失败'})
                } else {
                    const hash = await comparePasswd.comparePasswd(password,result.password)
                    if(hash){
                        let { loginNum } = result
                        loginNum++;
                        result.loginNum=loginNum;
                        await jobSeekerInstance.update({loginNum:loginNum},{where:{phone:account}}).then(result1 => {
                            res.json({code:200,msg:"登录成功",data:{id:result.id,username:result.username,role:result.role}})
                        })
                    }else{
                        res.json({code:203,msg:'密码错误,登录失败'})
                    }
                }
            })
            // 邮箱登录
        }else{
            await jobSeekerInstance.findOne({where: {email: account}}).then(async (result) => {
                if(!result) {
                    res.json({code:202, msg:'账号不存在,登录失败'})
                } else {
                    const hash = await comparePasswd.comparePasswd(password,result.password)
                    if(hash){
                        let { loginNum } = result
                        loginNum++;
                        await jobSeekerInstance.update({loginNum:loginNum},{where:{email:account}}).then(result1 => {
                            res.json({code:200,msg:"登录成功",data:{id:result.id,username:result.username,role:result.role, phone:result.phone,email:result.email,avatar:result.faceimgUrl}})
                        })
                    }else{
                        res.json({code:203,msg:'密码错误,登录失败'})
                    }
                }
            })
        }
    }
})

// 头像上传
const avatarPath = path.join(__dirname,'../../public/jobseekersAvatar/')
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,avatarPath)
    }, 
    filename: (req,file,cb)=>{
        const filename = file.originalname
        cb(null,filename)
    }
})
const uploader = multer({storage:storage})
router.post('/uploadAvatar',uploader.array('file'),async (req,res,next)=>{
    const {id} = req.body
    const imgOrigin = 'http://localhost:3000/jobseekersAvatar/'
    const originpath = path.join(__dirname,'../../public/jobseekersAvatar/')
    // const fileName = req.files.originalname
    // const currentFileName = imgOrigin+uuid+path.extname(fileName)
    const files = req.files
    let temp = files.map(e=>{
        const uuid = uuidv4()
        let basename = path.basename(e.path)    //源文件名
        let suffix = path.extname(e.path)       //文件后缀
        let newname = uuid+suffix               //新文件名
        fs.rename(originpath+basename,originpath+newname,err=>{
            // console.log(err)
        })
        return {file:imgOrigin+newname}
        // return {file:imgOrigin+e.originalname}
    })
    await jobSeekerInstance.findOne({where:{id:id}}).then(result => {
        if(result){}
    })
    res.json({errno:0,files:temp})
})

// 文件上传



// 用户投递简历
router.post('/postPosition',async (req,res,next) => {
    const { positionlId, jobSeekerId } = req.body
    // status=1：已投递，未阅读;isPosted=true:表示已投递;confirm:是否确定参加笔试和面试，1=参加、0=不参加
    post2positionInstance.create({jobSeekerId:jobSeekerId, PositionId:positionlId,status:1,isPosted:1,confirm:0}).then(result => {
        if(result){
            res.json({code:200,msg:'简历投递成功'})
        }else{
            res.json({code:201,msg:'简历投递失败'})
        }
    })
})

// 获取岗位列表
router.get('/getPositionList',async (req,res,next) => {
    const { role, limit, page, jobseekerId } = req.query
    // jobseekerId为空时，表示用户还没有登录，直接返回所有的岗位列表
    const positionList = await positionInstance.findAll({where: {Handlestatus:2}})  //只查询出Handlestatus=2（表示已通过审核的岗位）
    let positions = positionList.map( e => {
        let createTime = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
        // 也返回一个YYYY-MM-DD格式的时间
        let simpleDate = moment(e.createdAt).format('YYYY-MM-DD')
        // 状态更新：Switch
        let Switch = ''
        // 招聘状态
        let statusTemp = ''
        e.status===1 ? statusTemp='在招' : statusTemp = '已结束'
        // 岗位类别
        let typeTemp = ''
        e.type===1 ? typeTemp='事业编' :typeTemp='非事业编'
        // 当前状态
        let HandlestatusTemp = ''
        switch (e.Handlestatus) {
            case 1: 
                HandlestatusTemp = '已删除'
                Switch = false
                break
            case 2: 
                HandlestatusTemp = '审核已通过'
                Switch = true
                break
            case 3: 
                HandlestatusTemp = '未审核'
                Switch = false
                break
        }
        // isPosted=false:未投递，isPosted=true：已投递
        return { id:e.id,positionName:e.positionName,deptName:e.deptName,address:e.address,requireNum:e.requireNum,type:typeTemp,Switch:Switch,status:statusTemp,Handlestatus:HandlestatusTemp,userCode:e.userCode,age:e.age,english:e.english,professional:e.professional,desc:e.desc,degree:e.degree,createDate:createTime,simpleDate:simpleDate,isPosted:false}
    })
    if (jobseekerId === undefined || jobseekerId === '' || jobseekerId === null) {
        const pageList = positions.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
        res.json({code:200,msg:'获取岗位列表成功',positions:pageList,total:positions.length})
    } else {
        // 1.先查询投递映射表
        await post2positionInstance.findAll({where: {jobseekerId:jobseekerId}}).then(result => {
            // 已经投递的岗位id
            const pids = result.map(v => v.PositionId)
            let resultTemp = []
            positionList.forEach(e => {
                // 说明该jobseeker已经投递了该岗位的简历
                if (pids.includes(e.id)){
                    resultTemp.push(Object.assign({},e.dataValues,{isPosted:true}))
                }else{
                    resultTemp.push(Object.assign({},e.dataValues,{isPosted:false}))
                }
            })
            const pageList = resultTemp.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
            res.json({code:200,msg:'获取岗位列表成功',positions:pageList,total:resultTemp.length})
        })
    }
 })


// 获取post2position对应的jobseeker和position
router.get('/getPost2PositionListByUid', async (req, res, next) => {
    const queryid = parseInt(req.query.jobseekerId)
    // 不提供jobseekerid时，获取全部（管理员专用的查询）
    if(req.query.jobseekerId === undefined) {
        await positionInstance.findAll({include:jobSeekerInstance}).then((result) =>{
            const items = result.filter(item => item.jobSeekers.length !== 0 && item.Handlestatus !== 1).map( e => {
                // 审核按钮
                let Switch = false
                // 投递时间
                const createdTime = moment(e.jobSeekers[0].post2position.createdAt).format('YYYY-MM-DD HH:mm:ss')
                const username = e.jobSeekers[0].username
                const professional = e.jobSeekers[0].professional
                const school = e.jobSeekers[0].school
                const phone = e.jobSeekers[0].phone
                const email = e.jobSeekers[0].email
                const attachmentUrl = e.jobSeekers[0].attachmentUrl
                let statusTemp = ''
                if(e.jobSeekers[0].post2position.status===1) {
                    statusTemp = '未审核'
                }else if (e.jobSeekers[0].post2position.status===2){
                    statusTemp = '已审核通过'
                    Switch = true
                }else if (e.jobSeekers[0].post2position.status===3) {
                    statusTemp = '审核未通过'
                } else if (e.jobSeekers[0].post2position.status===4) {
                    statusTemp = '求职者已确认'
                }
                return {createdTime:createdTime,positionName:e.positionName,username:username,professional:professional,school:school,phone:phone,email:email,attachmentUrl:attachmentUrl,status:statusTemp,Switch:Switch}
            })
            res.json({code:200,msg:'数据获取成功',items:items})
        })
    }else{
        await jobSeekerInstance.findAll({where: {id:queryid},include:positionInstance}).then((result) =>{
            const positions = result[0].Positions.filter( p => p.Handlestatus !== 1).map( e => {
                const createdTime = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
                const typeTemp = e.type === 1?'事业编':'非事业编'
                let statusTemp = ''
                // 未审核，未确认
                if (e.post2position.status===1 && e.post2position.confirm===0){
                    statusTemp = '未审核'
                }else if (e.post2position.status===2 && e.post2position.confirm===0){
                    statusTemp = '审核已通过'
                }else if (e.post2position.status===2 && e.post2position.confirm===1){
                    statusTemp = '已确认'
                }else if (e.post2position.status===3 && e.post2position.confirm===0){
                    statusTemp = '审核未通过'
                }
                // currentStatusTemp = e.status === 1 ? '在招' : '已结束' 
                return {id:e.id,positionName:e.positionName,address:e.address,requireNum:e.requireNum,type:typeTemp,age:e.age,degree:e.degree,professional:e.professional,status:statusTemp,desc:e.desc,createdTime:createdTime,deptName:e.deptName,english:e.english}
            })
            res.json({code:200,items:positions})
        })
    }
})

// 用户取消某个已经投递的岗位
router.get('/cancelPostedByPid', async (req, res, next) => {
    const { pid, uid } = req.query
    await post2positionInstance.destroy({where:{PositionId: pid,jobSeekerId:uid}}).then((result) => {
        if(result){
            res.json({code:200,msg:'已取消投递的岗位'})
        }else{
            res.json({code:201,msg:'取消失败'})
        }
    })
})

//用户确认参加考试
router.get('/confirmStauts',async (req, res, next) => {
    const { pid, uid } = req.query
    await post2positionInstance.update({confirm:1},{where:{PositionId: pid,jobSeekerId: uid}}).then((result) => {
        if(result){
            res.json({code:200,msg:'你已确认,请密切关注考试时间'})
        }else{
            res.json({code:201,msg:'更新状态失败'})
        }
    })
})

module.exports = router