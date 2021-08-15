const express = require('express')
const router = express.Router();
const User = require("../../models/user")
const {DataTypes} = require('sequelize')
const sequelize = require('../database/connection')
//获取所有用户的列表
router.get('/userList', async (req, res) => {
    const {role} = req.query
    if(role!=='admin'){
        res.json({code:201,msg:"您没有该页面的权限"})
    }else{
        await User(sequelize,DataTypes).findAll({where: {role: role}}).then(result=>{
            let users = [];
            result.forEach(user=>{users.push({userCode:user.userCode,username:user.username,email:user.email,role:user.role,deptname:user.deptname})})
        })
    }
})

module.exports = router