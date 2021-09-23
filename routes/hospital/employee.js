const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')
const { DataTypes } = require('sequelize')
const sequelize = require('../../database/connection')
const User = require('../../models/user')
// 设置时区
moment.tz.setDefault('Asia/Shanghai')
// 获取当前系统所有用户(只允许employee_admin角色的用户查看)
router.get('/getAllEmployees', async (req, res, next) => {
    const { role, limit, page } = req.query
    if (role !== 'admin') {
        res.json({code:201,msg:'你没有权限查看该页面的内容'})
    } else {
        await User(sequelize, DataTypes).findAll().then(result => {
            if (result) {
                const userLists = result.map(e => {
                // 是否通过审核的按钮开关
                let Switch = ''
                e.status === 1 ? Switch = true : Switch = false
                // 当前用户状态， 0=未通过审核，1=通过审核，2=已注销
                let userStuts = ''
                if (e.status===0) userStuts = '审核未通过'
                else if (e.status===1) userStuts = '审核已通过'
                else userStuts = '已注销'
                const createDate = moment(e.createdAt).format('YYYY-MM-DD HH:ss:mm')
                return { id:e.id,userCode:e.userCode, username:e.username,email:e.email,role:e.role,deptName:e.deptCode,loginNum:e.loginNum,status:userStuts,Switch:Switch,createDate:createDate }
            })
            const pageList = userLists.filter((item,index)=>index < limit * page && index >= limit * (page - 1))
            res.json({code:200,msg:'获取数据成功', users: pageList, total: userLists.length})
            } else {
                res.json({code: 202,msg:'查询失败'})
            }
        }).catch(err => {
            res.json({err:err,msg:'error'})
        }) 
    }
})

// 更新用户状态
router.get('/updateUserStatus', async (req, res, next) => {
    const { role, id, Switch } = req.query
    if(role !== 'admin') {
        res.json({code:201,msg:'你没有权限进行操作'})
    } else {
        if (JSON.parse(Switch)) {
            await User(sequelize, DataTypes).update({status:1},{where:{id:id}}).then(result => {
                if(result) {
                    res.json({code:200,msg:'状态更新成功'})
                } else {
                    res.json({code:202,msg:'状态更新失败'})
                }
            })
        } else {
            await User(sequelize, DataTypes).update({status:0},{where:{id:id}}).then(result => {
                if(result) {
                    res.json({code:200,msg:'状态更新成功'})
                } else {
                    res.json({code:202,msg:'状态更新失败'})
                }
            })
        }
    }
})

// 删除用户
router.get('/deleteUser', async (req, res, next) => {
    const { role, id } = req.query
    if(role !== 'admin') {
        res.json({code:201,msg:'你没有权限进行操作'})
    } else {
        await User(sequelize, DataTypes).update({status:2},{where:{id:id}}).then(result => {
            if(result) {
                res.json({code:200,msg:'用户删除成功'})
            } else {
                res.json({code:202,msg:'用户删除失败'})
            }
        })
    }
})

module.exports = router