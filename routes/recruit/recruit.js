const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')
const { positionInstance, jobSeekerInstance,post2positionInstance } = require('../../database/models/associate')
const sequelize = require('../../database/connection')
const Message = require('../../models/message')
const { DataTypes, Op } = require('sequelize')
// 设置时区
moment.tz.setDefault('Asia/Shanghai')

// 获取所有的岗位列表
router.get('/getPositionList',async (req,res,next) => {
    const { role, limit, page } = req.query
    await positionInstance.findAll().then(result => {
        if (result) {
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
                return { id:e.id,positionName:e.positionName,deptName:e.deptName,address:e.address,requireNum:e.requireNum,type:typeTemp,Switch:Switch,status:statusTemp,Handlestatus:HandlestatusTemp,userCode:e.userCode,age:e.age,english:e.english,professional:e.professional,desc:e.desc,degree:e.degree,createDate:createTime,simpleDate:simpleDate}
            })
            const pageList = positions.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
            res.json({code:200,msg:'获取岗位列表成功',positions:pageList,total:positions.length})
        }else {
            res.json({code:201,msg:'获取岗位列表失败'})
        }
    })
})

// 新增岗位
router.post('/addPosition',async (req,res,next) => {
    const data = req.body
    await positionInstance.create({positionName: data.positionName,deptName: data.deptName,address: data.address,requireNum: data.requireNum,type: data.type,userCode: data.userCode,age: data.age,degree: data.degree,english: data.english,professional:data.professional,status: data.status,Handlestatus: data.Handlestatus,contactPhone:data.contactPhone,desc:data.desc}).then( result => {
        if (result) {
            res.json({code:200,msg:'添加成功'})
        }else{
            res.json({code:201,msg:'添加失败'})
        }
    } )
})

// switch更新状态
router.post('/updatepositionStatus',async (req,res,next) => {
    const { id, role, Switch } = req.body
    // 审核通过
    if (Switch) {
        let HandlestatusTemp = 2    // 审核已通过
        await positionInstance.update({Handlestatus:HandlestatusTemp},{where:{id:id}}).then( result => {
            if(result){
                res.json({code:200,msg:'状态更新成功'})
            }else{
                res.json({code:201,msg:'状态更新失败'})
            }
        })
        // 审核不通过
    }else{
        const HandlestatusTemp = 3
        await positionInstance.update({Handlestatus:HandlestatusTemp},{where:{id:id}}).then( result => {
            if(result){
                res.json({code:200,msg:'状态更新成功'})
            }else{
                res.json({code:201,msg:'状态更新失败'})
            }
        })
    }
})

// 根据id删除岗位（更新status=2）
router.delete('/deletePosition',async (req,res,next) => {
    const {id} = req.query
    await positionInstance.update({status:2,Handlestatus:1},{where:{id:id}}).then( result => {
        if(result){
            res.json({code:200,msg:'删除成功'})
        }else{
            res.json({code:201,msg:'删除失败'})
        }
    })
})

// 根据id修改status
router.post('/recoverpositionStatus',async (req,res,next) => {
    const { id, status, Handlestatus } = req.body
    await positionInstance.update({status:status,Handlestatus:Handlestatus},{where:{id:id}}).then( result => {
        if(result){
            res.json({code:200,msg:'更新成功'})
        }else{
            res.json({code:201,msg:'更新失败'})
        }
    })
})

// 更新岗位信息
router.post('/updatePosition',async (req,res,next) => {
    const data = req.body
    await positionInstance.update({positionName: data.positionName,deptName: data.deptName,address: data.address,requireNum: data.requireNum,type: data.type,userCode: data.userCode,age: data.age,degree: data.degree,english: data.english,professional: data.professional,desc:data.desc},{where:{id:data.id}}).then( result => {
        if(result){
            res.json({code:200,msg:'岗位信息更新成功'})
        }else{
            res.json({code:201,msg:'岗位信息更新失败'})
        }    
    })
})

// 管理员接收到的消息
router.post('/getReceiveMsg2Admin', async (req, res, next) => {
    const { receive_id, limit, page } = req.body
    // 未阅读的消息条数
    let num = 0
    const sql = `select a.*,b.username,b.faceimgUrl from (
        select * from messages where receive_id=${receive_id} and remove_receive_id<>${receive_id}
        )a left join jobseekers b on a.send_id=b.id`
    const result = await sequelize.query(sql)
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

// 管理员已发送的所有消息
router.post('/getSendMsg2Admin', async (req, res, next) => {
    const { send_id, limit, page } = req.body
    const sql = `select a.*,b.username,b.faceimgUrl from (
        select * from messages where send_id=${send_id} and remove_send_id<>${send_id}
        )a left join jobseekers b on a.receive_id=b.id`
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

module.exports = router