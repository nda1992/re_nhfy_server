/*
求职者和岗位相关的路由：
- 用户简历投递
- 用户收藏岗位
- 用户更新个人信息
- 获取岗位列表
- 查看和回复消息
- 确认参加考试
*/
const express = require('express')
const router = express.Router()
const mammoth = require('mammoth')
// const docxConverter = require('docx-pdf')
const sequelize = require('../../database/connection')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const multer = require('multer')
const moment = require('moment-timezone')
const saltPasswd = require('../../utils/saltPasswd')
const comparePasswd = require('../../utils/saltPasswd')
const { positionInstance, jobSeekerInstance,post2positionInstance, get2CollectInstance } = require('../../database/models/associate')
const Message = require('../../models/message')
const Swiper = require('../../models/swiper')
const { DataTypes } = require('sequelize')
const { JOBSEEKER_DEFAULT_AVATAR_URL_DOWNLOAD, JOBSEEKER_AVATAR_URL_UPLOAD, JOBSEEKER_AVATAR_URL_DOWNLOAD, JOBSEEKER_RESUME_URL_UPLOAD ,JOBSEEKER_RESUME_URL_DOWNLOAD } = require('../../config/network')
// 设置时区
moment.tz.setDefault('Asia/Shanghai')


// 求职者注册
router.post('/positionRegister',async (req,res,next) => {
    const { username, password, phone, email } = req.body
    const defaultAvatar = JOBSEEKER_DEFAULT_AVATAR_URL_DOWNLOAD
    const role = 'jobseeker'
    const hash = await saltPasswd.saltPasswd(password)
    await jobSeekerInstance.findOne({where:{username:username,phone:phone}}).then(async user => {
        if(user){
            res.json({code:202,msg:'该用户的手机号已经注册了,可直接登录'})
        }else{
            await jobSeekerInstance.create({openid:'openid',username:username,password:hash,phone:phone,email:email,faceimgUrl:defaultAvatar,role:role}).then(result => {
                if(result){
                    res.json({code:200,msg:'注册成功,你可以进行登录了'})
                }else{
                    res.json({code:201,msg:'注册失败'})
                }
            })
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
                            res.json({code:200,msg:"登录成功",data:{id:result.id,username:result.username,role:result.role,phone:result.phone,email:result.email,avatar:result.faceimgUrl,file:result.attachmentUrl}})
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
                            res.json({code:200,msg:"登录成功",data:{id:result.id,username:result.username,role:result.role, phone:result.phone,email:result.email,avatar:result.faceimgUrl, file:result.attachmentUrl}})
                        })
                    }else{
                        res.json({code:203,msg:'密码错误,登录失败'})
                    }
                }
            })
        }
    }
})

//根据jobseekerid拉取用户的所有信息
router.get('/UserinfoDetail', async (req,res,next) => {
    const { uid } = req.query
    await jobSeekerInstance.findOne({where: {id:uid}}).then(result => {
        if (result){
            // 一个判断用户信息是否完善的标记
            const doneUserinfo = Object.values(result.dataValues).includes(null)    // 如果包含有null的属性，返回true，则提醒用户完善信息
            res.json({code:200,userinfo:result,doneUserinfo:!doneUserinfo})
        }else{
            res.json({code:201,msg:'拉取信息失败'})
        }
    })
})

// 用户更新个人信息
router.post('/updateUserinfo',async (req,res,next) => {
    const data = req.body
    const { basic } = req.body
    const returnData = { username:data.username,avatar:data.faceimgUrl,email: data.email,phone: data.phone }
    // 更新详细信息
    if(basic){
        await jobSeekerInstance.update({sex:data.sex,age:data.age,birthday:data.birthday,nation:data.nation,address:data.address,degree:data.degree,school:data.school,professional: data.professional,undergraduateTime:data.undergraduateTime,faceimgUrl: data.faceimgUrl,attachmentUrl:data.attachmentUrl},{where:{id:data.id}}).then((result) => {
            if(result){
                res.json({code:200,msg:'更新信息成功',data:returnData})
            }else{ 
                res.json({code:201,msg:'信息更新失败'})
            }
        })
    // 更新基本信息    
    }else{
        await jobSeekerInstance.update({username:data.username,avatar:data.avatar,phone:data.phone,email:data.email},{where:{id:data.id}}).then(result => {
            if(result){
                res.json({code:200,msg:'更新信息成功', data:returnData})
            }else{
                res.json({code:201,msg:'信息更新失败'})
            }
        })
    }
})

// 用户密码更新
router.post('/updatePasswd', async (req, res, next) => {
    const { phone, password } = req.body
    //密码加盐
    const hash = await saltPasswd.saltPasswd(password)
    await jobSeekerInstance.findOne({where: {phone: phone}}).then(async (result) => {
        if(result){
            await jobSeekerInstance.update({password:hash},{where:{phone: phone}}).then( info => {
                if(info){
                    res.json({code:200,msg:'密码更新成功'})
                }else{
                    res.json({code:200,msg:'密码更新失败'})
                }
            })
        }else{
            res.json({code:201,msg:'该手机号没有注册'})
        }
    })
})

// 头像上传
const avatarPath = JOBSEEKER_AVATAR_URL_UPLOAD
const avatarStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,avatarPath)
    }, 
    filename: (req,file,cb)=>{
        const filename = file.originalname
        cb(null,filename)
    }
})
const avatarUploader = multer({storage:avatarStorage})
router.post('/uploadAvatar',avatarUploader.array('file'),async (req,res,next)=>{
    const { id, avatar } = req.body
    // 需要删除上一张头像的文件名
    const filename = avatar.split('/').slice(-1)[0]
    const imgOrigin = JOBSEEKER_AVATAR_URL_DOWNLOAD
    const originpath = JOBSEEKER_AVATAR_URL_UPLOAD
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
    })
    await jobSeekerInstance.update({faceimgUrl:temp[0].file},{where:{id:id}}).then(result => {
        if(result){
            const fullPath = avatarPath+filename
            fs.unlink(fullPath,function(err){ if(err){throw err}})
            res.json({code:200,msg:'头像上传成功',files:temp})
        }else{
        res.json({code:201,msg:'头像上传失败'})
        }
    })
})

// 文件上传
const filePath = JOBSEEKER_RESUME_URL_UPLOAD
const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,filePath)
    }, 
    filename: (req,file,cb)=>{
        const filename = file.originalname
        cb(null,filename)
    }
})
const fileUploader = multer({storage:fileStorage})
router.post('/uploadFile',fileUploader.array('file'),async (req,res,next) => {
    const { id, file } = req.body
    const fileOrigin = JOBSEEKER_RESUME_URL_DOWNLOAD
    const files = req.files
    let temp = files.map(e=>{
        const uuid = uuidv4()
        let basename = path.basename(e.originalname)    //源文件名
        let suffix = path.extname(e.originalname)       //文件后缀
        let newname = uuid+suffix               //新文件名
        fs.rename(filePath+basename,filePath+newname,err=>{
            // console.log(err)
        })
        return {file:fileOrigin+newname}
    })
    await jobSeekerInstance.update({attachmentUrl:temp[0].file},{where:{id:id}}).then(result=>{
        if(result){
            // 只有用户上传过简历后，才可以进行前一个文件的删除
            if(file!==undefined){
                const filename =file.split('/').slice(-1)[0]
                const fullPath = filePath+filename
                fs.unlink(fullPath,function(err){ if(err){throw err}})
            }
            res.json({code:200,msg:'简历上传成功',files:temp})
        }else{
            res.json({code:201,msg:'简历上传失败',files:temp})
        }
    })
})

// 查看docx文档
router.post('/getResumeFile', async (req, res, next) => {
    const { url } = req.body
    const docxfilePath = JOBSEEKER_RESUME_URL_UPLOAD
    const arr = url.split('/').slice(-1)
    const files = fs.readdirSync(docxfilePath)
    let file = ''
    for(let f in files) {
        if(files[f]===arr[0]){
            file=files[f]
            break
        }
    }
    let html = ''
    const fullPath = path.join(docxfilePath,file)
    mammoth.convertToHtml({path: fullPath}).then(function(result){
        html = result.value; // The generated HTML
        res.json({code:200,html:html})
    }).done();
})

// 将docx转为pdf
// router.get('/toPdf', async (req, res) => {
//     const docxfilePath = JOBSEEKER_RESUME_URL_UPLOAD
//     const filename= '83027c09-ba02-4510-821c-7ec2b80a2bec.docx'
//     const fullPath = path.join(docxfilePath,filename)
//     docxConverter(fullPath,path.join(docxfilePath,'output.pdf'),function(err,result){
//         if(err){
//           console.log(err);
//         }
//         console.log('result'+result);
//       });
//     res.json({code:200})
// })

// 用户收藏岗位
router.post('/handleCollect', async (req,res,next) => {
    const { positionId, jobSeekerId, isCollected } = req.body
    let isPosted = 0    // 默认未投递
    // 要收藏的岗位是否已经投递了？
    await post2positionInstance.findOne({where: { PositionId:positionId, jobSeekerId:jobSeekerId } }).then(result => {
        if (result) isPosted = 1
    })
    // 如果isCollected=true，说明已经收藏，再次点击时，则取消收藏
    if (isCollected) {
        await get2CollectInstance.destroy({ where: { PositionId:positionId, jobSeekerId:jobSeekerId }}).then(result1 =>{
            if(result1) {
                res.json({code:200,msg:'已取消收藏'})
            }else{
                res.json({code:200,msg:'取消收藏失败'})
            }
        })
    }else{
        await get2CollectInstance.create({ PositionId:positionId, jobSeekerId:jobSeekerId, status: isPosted }).then(result => {
            if (result){
                res.json({code:200,msg:'收藏岗位成功'})
            }else{
                res.json({code:201,msg:'收藏岗位失败'})
            }
        })
    }
})

// 用户投递简历
router.post('/postPosition',async (req,res,next) => {
    const { positionId, jobSeekerId } = req.body
    // 判断收藏列表中是否已经存在了投递的岗位
    const isPosted = await get2CollectInstance.findOne({where:{PositionId:positionId, jobSeekerId:jobSeekerId}})
    console.log(isPosted)
    // status=1：已投递，未阅读;isPosted=true:表示已投递;confirm:是否确定参加笔试和面试，1=参加、0=不参加
    post2positionInstance.create({jobSeekerId:jobSeekerId, PositionId:positionId,status:1,isPosted:1,confirm:0}).then(async result => {
        if(result){
            // 只有isPosted存在时，才会将status=1，表示该收藏的岗位已经投递了
            if(isPosted) {
                await get2CollectInstance.update({status:1},{where:{PositionId:positionId, jobSeekerId:jobSeekerId}}).then(result2 => {})
            }
            res.json({code:200,msg:'简历投递成功'})
        }else{
            res.json({code:201,msg:'简历投递失败'})
        }
    })
})

// 不带条件获取所有岗位的列表（用于管理员）
router.get('/getAllPositionList', async (req, res, next) => {
    const { limit, page } = req.query
    await positionInstance.findAll().then(result => {
        if(result) {
            let positions = result.map( e => {
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
                return { id:e.id,positionName:e.positionName,deptName:e.deptName,address:e.address,requireNum:e.requireNum,type:typeTemp,Switch:Switch,status:statusTemp,Handlestatus:HandlestatusTemp,userCode:e.userCode,age:e.age,english:e.english,professional:e.professional,desc:e.desc,degree:e.degree,contactPhone:e.contactPhone,createDate:createTime,simpleDate:simpleDate,isPosted:false,isCollected:false}
            })
            const pageList = positions.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
            res.json({code:200,msg:'获取岗位列表成功',positions:pageList,total:positions.length})
        } else {
            res.json({code:201,msg:'获取岗位列表失败'})
        }
    })
})

// 获取岗位列表（用于招聘系统和用户登录后查看到的岗位列表）
router.get('/getPositionList',async (req,res,next) => {
    const { limit, page, jobseekerId } = req.query
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
        return { id:e.id,positionName:e.positionName,deptName:e.deptName,address:e.address,requireNum:e.requireNum,type:typeTemp,Switch:Switch,status:statusTemp,Handlestatus:HandlestatusTemp,userCode:e.userCode,age:e.age,english:e.english,professional:e.professional,desc:e.desc,degree:e.degree,contactPhone:e.contactPhone,createDate:createTime,simpleDate:simpleDate,isPosted:false,isCollected:false}
    })
    if (jobseekerId === undefined || jobseekerId === '' || jobseekerId === null) {
        const pageList = positions.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
        res.json({code:200,msg:'获取岗位列表成功',positions:pageList,total:positions.length})
    } else {
        let resultTemp = []
        // 1.先查询投递映射表
        const postedPositions = await post2positionInstance.findAll({where: {jobseekerId:jobseekerId}})
        // 2.查找收藏映射表
        const collectedPositions = await get2CollectInstance.findAll({where:{jobSeekerId:jobseekerId}})
            // 已经投递的岗位id
            const pids = postedPositions.map(v => v.PositionId)
            // 已经收藏的岗位id
            const cids = collectedPositions.map( v=> v.PositionId)
            positionList.forEach(e => {
                let createTime = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
                // 也返回一个YYYY-MM-DD格式的时间
                let simpleDate = moment(e.createdAt).format('YYYY-MM-DD')
                // 招聘状态
                let statusTemp = ''
                e.status===1 ? statusTemp='在招' : statusTemp = '已结束'
                // 岗位类别
                let typeTemp = ''
                e.type===1 ? typeTemp='事业编' :typeTemp='非事业编'
                // 说明该jobseeker已经投递了该岗位的简历
                if (pids.includes(e.id)){
                    if (cids.includes(e.id)){
                        resultTemp.push(Object.assign({},e.dataValues,{isPosted:true, isCollected:true},{type:typeTemp,createDate:createTime,simpleDate:simpleDate,status:statusTemp}))
                    }else{
                        resultTemp.push(Object.assign({},e.dataValues,{isPosted:true, isCollected:false},{type:typeTemp,createDate:createTime,simpleDate:simpleDate,status:statusTemp}))
                    }
                }else{
                    if (cids.includes(e.id)){
                        resultTemp.push(Object.assign({},e.dataValues,{isPosted:false, isCollected:true},{type:typeTemp,createDate:createTime,simpleDate:simpleDate,status:statusTemp}))
                    }else{
                        resultTemp.push(Object.assign({},e.dataValues,{isPosted:false, isCollected:false},{type:typeTemp,createDate:createTime,simpleDate:simpleDate,status:statusTemp}))
                    }
                }
            })
        const pageList = resultTemp.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
        res.json({code:200,msg:'获取岗位列表成功',positions:pageList,total:resultTemp.length})
    }
 })

// 获取post2positions、get2collects对应的jobseekers和positions
router.get('/getPost2PositionListByUid', async (req, res, next) => {
    const queryid = parseInt(req.query.jobseekerId)
    const { limit, page } = req.query
    // 不提供jobseekerid时，获取全部（管理员专用的查询）
    if(req.query.jobseekerId === undefined) {
        const Allsql = `select c.id,c.positionName,b.status,b.approveDate,a.id as jobseekerId,a.username,a.professional,a.age,a.school,a.phone,a.email,a.attachmentUrl,b.createdAt from jobseekers a left join post2positions b on a.id = b.jobSeekerId left join positions c on b.PositionId = c.id  where c.Handlestatus=2`
        const AllPostedPositions = await sequelize.query(Allsql)
        const AllpostedPositionsList = AllPostedPositions[0].map( s => {
            // 审核按钮
            let Switch = false
            // 投递时间
            const createdTime = moment(s.createdAt).format('YYYY-MM-DD HH:mm:ss')
            const approveDate = moment(s.approveDate).format('YYYY-MM-DD HH:mm:ss')
            const jobseekerId = s.jobseekerId
            const username = s.username
            const professional = s.professional
            const school = s.school
            const phone = s.phone
            const email = s.email
            const attachmentUrl = s.attachmentUrl
            let statusTemp = ''
            if(s.status===1) {
                statusTemp = '未审核'
            }else if (s.status===2){
                statusTemp = '已审核通过'
                Switch = true
            }else if (s.status===3) {
                statusTemp = '审核未通过'
            } else if (s.status===4) {
                statusTemp = '求职者已确认'
            }
            return {id:s.id,jobseekerId:jobseekerId,createdTime:createdTime,approveDate:approveDate,positionName:s.positionName,username:username,professional:professional,school:school,phone:phone,email:email,attachmentUrl:attachmentUrl,status:statusTemp,Switch:Switch}
        })
        const pageList = AllpostedPositionsList.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
        res.json({code:200,msg:'数据获取成功',items:pageList,total:AllpostedPositionsList.length})
    }else{
        /*因为涉及了三表关联，所以使用了sequelize提供的原生SQL查询，当然，这里不使用sequelize提供的表关联也是可以的（而且更方便），因为从前端传递过来的uid和pid肯定存在的数据，所以在对get2collectd
        和post2positions这两个表进行create即可，不用担心数据不存在的问题。所以可以不用配置关联，这样反而更方便一些，我这里懒得修改了*/ 
        // 收藏的岗位列表
        const Collectedsql = `select c.status as positionStatus,c.id,c.positionName,c.address,c.requireNum,c.type,c.age,c.degree,c.professional,c.desc,b.createdAt,b.status,c.deptName,c.english from jobseekers a left join get2collects b on a.id = b.jobSeekerId left join positions c on b.PositionId = c.id  where a.id = ${queryid} and c.Handlestatus<>1`
        // 投递的岗位列表
        const Postedsql = `select b.approveDate,c.status as positionStatus,c.id,c.positionName,c.address,c.requireNum,c.type,c.age,c.degree,c.professional,c.desc,b.status,b.confirm,b.createdAt,c.deptName,c.english from jobseekers a left join post2positions b on a.id = b.jobSeekerId left join positions c on b.PositionId = c.id  where a.id = ${queryid} and c.Handlestatus<>1`
        const postedPositions = await sequelize.query(Postedsql)
        const CollectedPositions = await sequelize.query(Collectedsql)
        // 对投递的岗位列表进行处理
        const postedPositionsList = postedPositions[0].map( e => {
            const createdTime = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            const approveDate = moment(e.approveDate).format('YYYY-MM-DD HH:mm:ss')
            const typeTemp = e.type === 1?'事业编':'非事业编'
            let statusTemp = ''
            if (e.status===1 && e.confirm===0){
                statusTemp = '未审核'
            }else if (e.status===2 && e.confirm===0){
                statusTemp = '管理员审核已通过'
            }else if (e.status===4 && e.confirm===1){
                statusTemp = '已确认'
            }else if (e.status===3 && e.confirm===0){
                statusTemp = '审核未通过'
            }
            currentStatusTemp = e.positionStatus === 1 ? '在招' : '已结束' 
            return {id:e.id,positionName:e.positionName,address:e.address,requireNum:e.requireNum,type:typeTemp,age:e.age,degree:e.degree,professional:e.professional,status:statusTemp,desc:e.desc,createdTime:createdTime,approveDate:approveDate,deptName:e.deptName,english:e.english,currentStatus:currentStatusTemp}
        })
        // 对收藏的岗位列表进行处理
        const collectedPositionsList = CollectedPositions[0].map(e => {
            const createdTime = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            const typeTemp = e.type === 1?'事业编':'非事业编'
            currentStatusTemp = e.positionStatus === 1 ? '在招' : '已结束'
            return {id:e.id,positionName:e.positionName,address:e.address,requireNum:e.requireNum,type:typeTemp,age:e.age,degree:e.degree,professional:e.professional,desc:e.desc,createdTime:createdTime,deptName:e.deptName,english:e.english,currentStatus:currentStatusTemp,isCollected:true,isPosted:e.status}
        })
        const PostedpageList = postedPositionsList.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
        const CollectedpageList = collectedPositionsList.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
        res.json({code:200,postedPositions:PostedpageList,collectedPositions:CollectedpageList,postedTotal:postedPositionsList.length,collectedTotal:collectedPositionsList.length})
    }
})

// 用户取消某个已经投递的岗位
router.get('/cancelPostedByPid', async (req, res, next) => {
    const { pid, uid } = req.query
    // 判断收藏列表中是否已经存在了投递的岗位
    const isPosted = await get2CollectInstance.findOne({where:{PositionId:pid, jobSeekerId:uid}})
    await post2positionInstance.destroy({where:{PositionId: pid,jobSeekerId:uid}}).then(async (result) => {
        if(result){
            // 取消投递时，收藏列表中的status也需要设置为0
            if(isPosted) {  await get2CollectInstance.update({ status: 0 }, {where: { PositionId: pid, jobSeekerId: uid }}).then(result2 => {}) }
                res.json({code:200,msg:'已取消投递的岗位'})
            
        }else{
            res.json({code:201,msg:'取消失败'})
        }
    })
})

//用户确认参加考试
router.get('/confirmStauts',async (req, res, next) => {
    const { pid, uid } = req.query
    await post2positionInstance.update({ status: 4, confirm:1 },{where:{PositionId: pid, jobSeekerId: uid}}).then((result) => {
        if(result){
            res.json({code:200,msg:'你已确认,请密切关注考试时间'})
        }else{
            res.json({code:201,msg:'更新状态失败'})
        }
    })
})

// 管理员审核求职者的简历状态
router.post('/setPositionStatus',async (req,res,next) => {
    const { id, jobseekerId, Switch } = req.body
    // 审核通过时间
    const approveDate = new Date()
    // Switch=true:已阅读，审核通过，Switch=false：阅读审核未通过
    if(!Switch){
        await post2positionInstance.update({ status: 3 },{where: {PositionId: id, jobSeekerId: jobseekerId}}).then((result) => {
            if(result){
                res.json({code: 200, msg:'状态已更新'})
            }else{
                res.json({code: 201, msg:'更新状态失败'})
            }
        })
    }else{
        await post2positionInstance.update({ status: 2, approveDate: approveDate },{where: {PositionId: id, jobSeekerId: jobseekerId}}).then((result) => {
            if(result){
                res.json({code: 200, msg:'状态已更新,已通知求职者'})
            }else{
                res.json({code: 201, msg:'更新状态失败'})
            }
        })
    }
})

// 管理员删除求职者已经投递的岗位（谨慎使用，删除该条记录后，求职者的投递列表中也会相应删除该条记录）
router.delete('/deletePost2Position', async (req,res,next) => {
    const { pid, uid } = req.query
    await post2positionInstance.destroy({where: {pid: pid, uid:uid}}).then((result) => {
        if(result){
            res.json({code:200,msg:'已删除投递的岗位'})
        }else{
            res.json({code:201,msg:'删除失败'})
        }
    })

})

// 给求职者发送消息
router.post('/sendMessage', async (req, res, next) => {
    const { msgList } = req.body
    await Message(sequelize,DataTypes).bulkCreate(msgList).then((result) =>{
        if(result){
            res.json({code:200,msg:'发送信息成功'})
        }else{
            res.json({code:201,msg:'发送消息失败'})
        }
    })
})

// 求职者或管理员回复消息
router.post('/replyMessage', async (req, res, next) => {
    const { receive_id, send_id, content, send_date, is_read, remove_receive_id, remove_send_id, replycontent } = req.body
    const send_dateTemp = moment(send_date).format('YYYY-MM-DD HH:mm:ss')
    await Message(sequelize,DataTypes).create({receive_id:receive_id,content:content,replycontent:replycontent,send_id:send_id,send_date:send_dateTemp,is_read:is_read,remove_receive_id:remove_receive_id,remove_send_id:remove_send_id}).then(result => {
        if(result) {
            res.json({code:200,msg:'回复消息成功'})
        }else{
            res.json({code:201,msg:'回复消息失败'})
        }
    })
})

// 求职者接接收到的所有消息
router.post('/getReceiveMsg', async (req, res, next) => {
    const { receive_id, limit, page } = req.body
    // 未阅读的消息条数
    let num = 0
    const sql = `select a.*,b.username,c.url from (select * from messages where receive_id=${receive_id} and remove_receive_id<>${receive_id})a left join users b on a.send_id=b.userCode left join avatars c on b.userCode=c.userCode`
    const result = await sequelize.query(sql)
    // console.log(result)
    if(result) {
        const resultMsgList = result[0].map(e => {
            let send_dateTemp = moment(e.send_date).format('YYYY-MM-DD HH:mm:ss')
            if(e.is_read===0) num++
            return Object.assign({},e,{format_send_date:send_dateTemp})
        })
        const pageList = resultMsgList.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
        res.json({code:200,msg:'获取消息成功',msgList:pageList,total:resultMsgList.length,no_read_num:num})
    }else{
        res.json({code:201,msg:'获取消息失败'})
    }
})

// 求职者发送的所有消息
router.post('/getSendMsg', async (req, res, next) => {
    const { send_id, limit, page } = req.body
    const sql = `select a.*,b.username,c.url from (
        select * from messages where send_id=${send_id} and remove_send_id<>${send_id}
        )a left join users b on a.receive_id=b.userCode left join avatars c on b.userCode=c.userCode`
    const result = await sequelize.query(sql)
    if(result){
        const resultMsgList = result[0].map(e => {
            let send_dateTemp = moment(e.send_date).format('YYYY-MM-DD HH:mm:ss')
            return Object.assign({},e,{format_send_date:send_dateTemp})
        })
        const pageList = resultMsgList.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
        res.json({code:200,msg:'获取消息成功',msgList:pageList,total:resultMsgList.length})
    }else{
        res.json({code:201,msg:'获取消息失败'})
    }
})

// 根据jobseekerid更新消息为已读
router.post('/updateIsread', async (req, res, next) => {
    const { receive_id } = req.body
    const queryid = parseInt(receive_id)
    // 阅读时间
    const read_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    await Message(sequelize,DataTypes).update({is_read:1,read_date:read_date},{where:{receive_id:queryid}}).then(result => {
        if(result) {
            res.json({code:200,msg:'更新消息成功'})
        }else{
            res.json({code:201,msg:'更新消息失败'})
        }
    })
})

// receive_id删除一条信息
router.post('/receiveRemoveMsg',async (req,res,next) => {
    const { id, receive_id } = req.body
    await Message(sequelize,DataTypes).update({remove_receive_id:receive_id},{where:{id:id}}).then(result => {
        if(result){
            res.json({code:200,msg:'已经删除消息'})
        }else{
            res.json({code:201,msg:'删除消息失败'})
        }
    })
})

// 接收者删除所有接收到的消息
router.post('/removeAllReceiveMsg',async (req, res, next) => {
    const { msgList } = req.body
    await Message(sequelize, DataTypes).bulkCreate(msgList, {updateOnDuplicate:["remove_receive_id"]}).then(result => {
        if(result) {
            res.json({code:200,msg:'已删除所有已收到的消息'})
        }else{
            res.json({code:201,msg:'删除消息失败'})
        }
    })
})

// 求职者删除他发送的某条消息
router.post('/removeSendMsg', async (req, res, next) => {
    const { id, send_id } = req.body
    await Message(sequelize,DataTypes).update({remove_send_id:send_id},{where:{id:id}}).then(result => {
        if(result){
            res.json({code:200,msg:'删除消息成功'})
        }else{
            res.json({code:201,msg:'删除消息失败'})
        }
    })
})

// 求职者删除所有已发送的消息
router.post('/removeAllSendMsg', async (req, res, next) => {
    const { msgList } = req.body
    await Message(sequelize, DataTypes).bulkCreate(msgList, {updateOnDuplicate:["remove_send_id"]}).then(result => {
        if(result) {
            res.json({code:200,msg:'已删除所有已发送的消息'})
        }else{
            res.json({code:201,msg:'删除消息失败'})
        }
    })
})

// (不用token认证，求职者可以访问所有的轮播图)获取轮播图到招聘系统中
router.get('/getSwiperImgs2Run', async (req, res, next) => {
    await Swiper(sequelize,DataTypes).findAll({where:{status:1}}).then((swiper) => {
        if(swiper){
            res.json({code:200,swipers:swiper})
        }else{
            res.json({code:201,msg:'获取图片失败'})
        }
    })
})

// 多条件过滤岗位列表
/*因为sequelize没有提供动态where条件查询，所有只能使用下面这种拼接sql的方法来实现了啊🤣*/
router.post('/filterPositions', async (req,res ,next) => {
    const { type, english, degree, age, num,deptName,limit,page } = req.body
    sql = `select * from positions where userCode<>0 `
    if(type!=='不限') {
        const tempType = type === '事业编' ? 1 : 2
        console.log(tempType)
        sql += ` and type = ${tempType} `
    }
    if(english!=='不限') {
        sql += `and english = '${english}'`
    }
    if(degree!=='不限') {
        sql += `and age = '${degree}'`
    }
    if(age!=='不限') {
        sql += `and age = '${age}'`
    }
    if(num!=='不限') {
        if (typeof num === 'number') {  // 1，2，3
            sql += `and requireNum = ${num}`
        }else{
            sql += `and requireNum>=4`   // 4个及以上
        }
    }
    if(deptName!=='不限') {
        sql += `and deptName = '${deptName}'`
    }
    const positions = await sequelize.query(sql)
    const ResultPositions =positions[0].map( e => {
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
        return { id:e.id,positionName:e.positionName,deptName:e.deptName,address:e.address,requireNum:e.requireNum,type:typeTemp,Switch:Switch,status:statusTemp,Handlestatus:HandlestatusTemp,userCode:e.userCode,age:e.age,english:e.english,professional:e.professional,desc:e.desc,degree:e.degree,contactPhone:e.contactPhone,createDate:createTime,simpleDate:simpleDate,isPosted:false,isCollected:false}
    })
    const pageList = ResultPositions.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
    res.json({code:200,msg:'过滤岗位列表成功',positions:pageList,total:ResultPositions.length})
})

module.exports = router