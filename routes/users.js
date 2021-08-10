const express = require('express');
const router = express.Router();
const User = require("../models/user")
const Token = require("../models/token")
const {createToken} = require('../utils/token')
const {DataTypes} = require('sequelize')
const sequelize = require('../database/connection')
const jwt = require('jsonwebtoken')
const saltPasswd = require('../utils/saltPasswd')
const comparePasswd = require('../utils/saltPasswd')
//用户注册
router.post("/register",async (req,res,next)=>{
  const data = req.body;
  //注册码
  const regCode="nhfy@123";
  //注册成功后默认点击次数为0
  const loginNum=0;
  const role = "普通用户" //默认角色
  //对密码进行加密
  const hash = await saltPasswd.saltPasswd(data.password)
  await User(sequelize,DataTypes).findOne({where:{userCode:data.userCode}}).then(async result=>{
    if(result){ //是否存在需要注册的用户?
      res.json({code:203,msg:"该用户已经注册，请注意检查"})
    }else if(regCode===data.regcode){
      await User(sequelize,DataTypes).create(
          {userCode:data.userCode,username:data.username,password:hash,email:data.email,role:role,deptCode:data.deptName,desc:data.desc,loginNum:loginNum}
      ).then(result=>{
        if(result){
          res.json({code:200,msg:"用户注册成功"})
        }else{
          res.json({code:201,msg:"用户注册失败"})
        }
      })
    }else{
      res.json({code:202,msg:"注册码不正确，请联系管理员"})
    }
  })
});

//用户登录
router.post("/login",async (req,res,next)=>{
  const {userCode,password} = req.body;
  if(!userCode||!password){
    res.json({code:201,msg:"用户名或密码不能为空,登录失败"})
  }else{
    await User(sequelize,DataTypes).findOne({where:{userCode:userCode}}).then(async result=>{
      if(!result){
        res.json({code:202,msg:"用户不存在,请先注册"})
      }else{
        //密码对比
        const hash = await comparePasswd.comparePasswd(password,result.password)
        if(hash){
          const token = createToken()
          const token_ = Token(sequelize,DataTypes).create({userCode:result.userCode,user_token:token})
          let {loginNum} = result;
          loginNum++;
          result.loginNum=loginNum;
          await User(sequelize,DataTypes).update({loginNum: loginNum},{where:{userCode:userCode}}).then(result1=>{
            res.json({code:200,msg:"登录成功",token:token,userCode:result.userCode})
          })
        }else{
          res.json({code:203,msg:"密码错误,登录失败"})
        }
      }
    })
  }
});

//web端用户密码更新
router.post("/updatePasswd",async (req,res,next)=>{
  const {userCode,password} = req.body;
  await User(sequelize,DataTypes).findOne({where:{userCode:userCode}}).then(async result=>{
    if(!result){
      res.json({code:201,msg:'该用户不存在，请先注册'})
    }else{
      await User(sequelize,DataTypes).update({password:password},{where:{userCode:userCode}}).then(result1=>{
        if(result1){
          res.json({code:200,msg:'密码更新成功'})
        }else{
          res.json({code:202,msg:'密码更新失败'})
        }
      })
    }
  }).catch(err=>{
    console.error(err)
  })
});

//登录成功后，携带token拉取用户的信息
router.get("/info",async (req,res,next)=>{
  const {userCode} = req.query
  await User(sequelize,DataTypes).findOne({where:{userCode:userCode}}).then(result=>{
    if(result){

      res.json({code:200,msg:'获取用户信息成功',info:result})
    }else{
      res.json({code:201,msg:'获取用户信息失败'})
    }
  })
})

module.exports = router;
