/*
岗位相关的路由：
- 用户简历投递
- 用户收藏岗位
- 用户分享岗位
*/
const express = require('express')
const router = express.Router()
const mammoth = require('mammoth')
const docxConverter = require('docx-pdf');
const sequelize = require('../../database/connection')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const multer = require('multer')
const moment = require('moment-timezone')
const saltPasswd = require('../../utils/saltPasswd')
const comparePasswd = require('../../utils/saltPasswd')
const { Op } = require('sequelize')
const { positionInstance, jobSeekerInstance,post2positionInstance, get2CollectInstance } = require('../../database/models/associate');
// 设置时区
moment.tz.setDefault('Asia/Shanghai')


// 求职者注册
router.post('/positionRegister',async (req,res,next) => {
    const { username, password, phone, email } = req.body
    const defaultAvatar = 'http://localhost:3000/jobseekersAvatar/default.jpg'
    const hash = await saltPasswd.saltPasswd(password)
    await jobSeekerInstance.findOne({where:{username:username,phone:phone}}).then(async user => {
        if(user){
            res.json({code:202,msg:'该用户的手机号已经注册了,可直接登录'})
        }else{
            await jobSeekerInstance.create({openid:'openid',username:username,password:hash,phone:phone,email:email,faceimgUrl:defaultAvatar}).then(result => {
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

//根据jobseekerid拉取用户的所有信息
router.get('/UserinfoDetail', async (req,res,next) => {
    const { uid } = req.query
    // 一个判断用户信息是否完善的标记
    await jobSeekerInstance.findOne({where: {id:uid}}).then(result => {
        if (result){
            const doneUserinfo = Object.values(result.dataValues).includes(null)    // 如果包含有null的属性，则提醒用户完善信息
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
const avatarPath = path.join(__dirname,'../../public/jobseekersAvatar/')
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
    const { id } = req.body
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
    await jobSeekerInstance.update({faceimgUrl:temp[0].file},{where:{id:id}}).then(result => {
        if(result){
            res.json({code:200,msg:'头像上传成功',files:temp})
        }else{
        res.json({code:201,msg:'头像上传失败'})
        }
    })
})

// 文件上传
const filePath = path.join(__dirname,'../../public/jobseekersFiles/')
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
    const { id } = req.body
    const fileOrigin = 'http://localhost:3000/jobseekersFiles/'
    const files = req.files
    console.log(files)
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
            res.json({code:200,msg:'简历上传成功',files:temp})
        }else{
            res.json({code:201,msg:'简历上传失败',files:temp})
        }
    })
})


// 查看docx文档
router.post('/getResumeFile', async (req, res, next) => {
    const { url } = req.body
    const docxfilePath = path.join(__dirname,'../../public/jobseekersFiles/')
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
//     const docxfilePath = path.join(__dirname,'../../public/jobseekersFiles/')
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
    // 如果isCollected=true，说明已经收藏，再次点击时，则取消收藏
    if (isCollected) {
        await get2CollectInstance.destroy({where:{PositionId:positionId, jobSeekerId:jobSeekerId}}).then((result) =>{
            if(result) {
                res.json({code:200,msg:'已取消收藏'})
            }else{
                res.json({code:200,msg:'取消收藏失败'})
            }
        })
    }else{
        await get2CollectInstance.create({ PositionId:positionId, jobSeekerId:jobSeekerId}).then(result => {
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
    // status=1：已投递，未阅读;isPosted=true:表示已投递;confirm:是否确定参加笔试和面试，1=参加、0=不参加
    post2positionInstance.create({jobSeekerId:jobSeekerId, PositionId:positionId,status:1,isPosted:1,confirm:0}).then(result => {
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
        return { id:e.id,positionName:e.positionName,deptName:e.deptName,address:e.address,requireNum:e.requireNum,type:typeTemp,Switch:Switch,status:statusTemp,Handlestatus:HandlestatusTemp,userCode:e.userCode,age:e.age,english:e.english,professional:e.professional,desc:e.desc,degree:e.degree,createDate:createTime,simpleDate:simpleDate,isPosted:false,isCollected:false}
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
                // 说明该jobseeker已经投递了该岗位的简历
                if (pids.includes(e.id)){
                    if (cids.includes(e.id)){
                        resultTemp.push(Object.assign({},e.dataValues,{isPosted:true, isCollected:true}))
                    }else{
                        resultTemp.push(Object.assign({},e.dataValues,{isPosted:true, isCollected:false}))
                    }
                }else{
                    if (cids.includes(e.id)){
                        resultTemp.push(Object.assign({},e.dataValues,{isPosted:false, isCollected:true}))
                    }else{
                        resultTemp.push(Object.assign({},e.dataValues,{isPosted:false, isCollected:false}))
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
        const Allsql = `select c.id,c.positionName,b.status,a.id as jobseekerId,a.username,a.professional,a.age,a.school,a.phone,a.email,a.attachmentUrl,c.createdAt from jobseekers a left join post2positions b on a.id = b.jobSeekerId left join positions c on b.PositionId = c.id  where c.Handlestatus=2`
        const AllPostedPositions = await sequelize.query(Allsql)
        const AllpostedPositionsList = AllPostedPositions[0].map( s => {
            // 审核按钮
            let Switch = false
            // 投递时间
            const createdTime = moment(s.createdAt).format('YYYY-MM-DD HH:mm:ss')
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
            return {id:s.id,jobseekerId:jobseekerId,createdTime:createdTime,positionName:s.positionName,username:username,professional:professional,school:school,phone:phone,email:email,attachmentUrl:attachmentUrl,status:statusTemp,Switch:Switch}
        })
        const pageList = AllpostedPositionsList.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
        res.json({code:200,msg:'数据获取成功',items:pageList,total:AllpostedPositionsList.length})
        // await positionInstance.findAll({include:jobSeekerInstance}).then((result) =>{
        //     const items = result.filter(item => item.jobSeekers.length !== 0 && item.Handlestatus === 2).map( e => {
        //         // 遍历该岗位的所有已经投递简历的求职者
        //         const positions = e.jobSeekers.map( s => {
        //         // 审核按钮
        //         let Switch = false
        //         // 投递时间
        //         const createdTime = moment(s.post2position.createdAt).format('YYYY-MM-DD HH:mm:ss')
        //         const jobseekerId = s.id
        //         const username = s.username
        //         const professional = s.professional
        //         const school = s.school
        //         const phone = s.phone
        //         const email = s.email
        //         const attachmentUrl = s.attachmentUrl
        //         let statusTemp = ''
        //         if(s.post2position.status===1) {
        //             statusTemp = '未审核'
        //         }else if (s.post2position.status===2){
        //             statusTemp = '已审核通过'
        //             Switch = true
        //         }else if (s.post2position.status===3) {
        //             statusTemp = '审核未通过'
        //         } else if (s.post2position.status===4) {
        //             statusTemp = '求职者已确认'
        //         }
        //         return {id:e.id,jobseekerId:jobseekerId,createdTime:createdTime,positionName:e.positionName,username:username,professional:professional,school:school,phone:phone,email:email,attachmentUrl:attachmentUrl,status:statusTemp,Switch:Switch}
        //         })
        //         return positions
        //     })
        //     const resultPositions = []
        //     for(let i of items) {
        //         for(let j of i){
        //             resultPositions.push(j)
        //         }
        //     }
        //     const pageList = resultPositions.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
        //     res.json({code:200,msg:'数据获取成功',items:pageList,total:resultPositions.length})
        //     // const items = result.filter(item => item.jobSeekers.length !== 0 && item.Handlestatus === 2)
        //     // res.json({items:resultPositions})
        // })
    }else{
        /*因为涉及了三表关联，所以使用了sequelize提供的原生SQL查询，当然，这里不使用sequelize提供的表关联也是可以的（而且更方便），因为从前端传递过来的uid和pid都是实实在在存在的数据，所以在对get2collectd
        和post2positions这两个表进行create即可，不用担心数据不存在的问题。所以可以不用配置关联，这样反而更方便一些，我这里懒得修改了*/ 
        // 投递的岗位列表
        const Collectedsql = `select c.status as positionStatus,c.id,c.positionName,c.address,c.requireNum,c.type,c.age,c.degree,c.professional,c.desc,b.createdAt,c.deptName,c.english from jobseekers a left join get2collects b on a.id = b.jobSeekerId left join positions c on b.PositionId = c.id  where a.id = ${queryid} and c.Handlestatus<>1`
        // 收藏的岗位列表
        const Postedsql = `select c.status as positionStatus,c.id,c.positionName,c.address,c.requireNum,c.type,c.age,c.degree,c.professional,c.desc,b.status,b.confirm,b.createdAt,c.deptName,c.english from jobseekers a left join post2positions b on a.id = b.jobSeekerId left join positions c on b.PositionId = c.id  where a.id = ${queryid} and c.Handlestatus<>1`
        const postedPositions = await sequelize.query(Postedsql)
        const CollectedPositions = await sequelize.query(Collectedsql)
        // 对投递的岗位列表进行处理
        const postedPositionsList = postedPositions[0].map( e => {
            const createdTime = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
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
            return {id:e.id,positionName:e.positionName,address:e.address,requireNum:e.requireNum,type:typeTemp,age:e.age,degree:e.degree,professional:e.professional,status:statusTemp,desc:e.desc,createdTime:createdTime,deptName:e.deptName,english:e.english,currentStatus:currentStatusTemp}
        })
        // 对收藏的岗位列表进行处理
        const collectedPositionsList = CollectedPositions[0].map(e => {
            const createdTime = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            const typeTemp = e.type === 1?'事业编':'非事业编'
            currentStatusTemp = e.positionStatus === 1 ? '在招' : '已结束'
            return {id:e.id,positionName:e.positionName,address:e.address,requireNum:e.requireNum,type:typeTemp,age:e.age,degree:e.degree,professional:e.professional,desc:e.desc,createdTime:createdTime,deptName:e.deptName,english:e.english,currentStatus:currentStatusTemp,isCllected:true}
        })
        const PostedpageList = postedPositionsList.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
        const CollectedpageList = collectedPositionsList.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
        res.json({code:200,postedPositions:PostedpageList,collectedPositions:CollectedpageList,postedTotal:postedPositionsList.length,collectedTotal:collectedPositionsList.length})
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
    // Switch=true:已阅读，审核通过，Switch=false：阅读审核未通过
    if(!Switch){
        await post2positionInstance.update({ status: 3 },{where: {PositionId: id, jobSeekerId: jobseekerId}}).then((result) => {
            if(result){
                res.json({code: 200, msg:'已更新状态'})
            }else{
                res.json({code: 201, msg:'更新状态失败'})
            }
        })
    }else{
        await post2positionInstance.update({ status: 2 },{where: {PositionId: id, jobSeekerId: jobseekerId}}).then((result) => {
            if(result){
                res.json({code: 200, msg:'已更新状态,已发送通知'})
            }else{
                res.json({code: 201, msg:'更新状态失败'})
            }
        })
    }
})


// 管理员删除求职者已经投递的岗位
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


module.exports = router