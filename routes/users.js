const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path');
const fs = require('fs');
const User = require("../models/user")
const Token = require("../models/token")
const Avatar = require("../models/avatar")
const Dept = require('../models/dept')
const {createToken} = require('../utils/token')
const {DataTypes, Op} = require('sequelize')
const sequelize = require('../database/connection')
const saltPasswd = require('../utils/saltPasswd')
const comparePasswd = require('../utils/saltPasswd')
const { v4: uuidv4 } = require('uuid')
const { ADMIN_AVATAR_URL_UPLOAD, ADMIN_AVATAR_URL_DOWNLOAD, ADMIN_DEFAULT_AVATAR_URL_DOWNLOAD } = require('../config/network')
//用户注册
router.post("/register",async (req,res,next)=>{
  const data = req.body;
  //注册码
  const regCode="nhfy@123";
  //注册成功后默认点击次数为0
  const loginNum=0;
  const role = "common" //默认角色
  //对密码进行加密
  const hash = await saltPasswd.saltPasswd(data.password)
  await User(sequelize,DataTypes).findOne({where:{userCode:data.userCode}}).then(async result=>{
    if(result){ //是否存在需要注册的用户?
      res.json({code:203,msg:"该用户已经注册，请注意检查"})
    }else if(regCode===data.regcode){
      await User(sequelize,DataTypes).create(
          {userCode:data.userCode,username:data.username,password:hash,email:data.email,role:role,deptCode:data.deptName,desc:data.desc,loginNum:loginNum}
      ).then(async result=>{
        if(result){
          // 创建一张默认头像给该用户
          await Avatar(sequelize, DataTypes).create({userCode:data.userCode,url:ADMIN_DEFAULT_AVATAR_URL_DOWNLOAD}).then(result2 => {
            res.json({code:200,msg:"用户注册成功"})
          })
        }else{
          res.json({code:201,msg:"用户注册失败"})
        }
      })
    }else{
      res.json({code:202,msg:"注册码不正确，请联系管理员"})
    }
  })
});


// 用户注册时，远程获取科室名称
router.post('/searchDept',async (req,res,next)=>{
  const data = req.body
  let obj = []
  await Dept(sequelize,DataTypes).findAll({where: {deptName:{[Op.like]:`%${data.keyword}%`}}}).then(result=>{
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

//用户登录
router.post("/login",async (req,res,next)=>{
  const { username, password } = req.body
  if(!username||!password){
    res.json({code:201,msg:"用户名或密码不能为空,登录失败"})
  }else{
    await User(sequelize,DataTypes).findOne({where:{userCode:username}}).then(async result=>{
      if(!result){
        res.json({code:202,msg:"用户不存在,请先注册"})
      }else{
        //密码对比
        const hash = await comparePasswd.comparePasswd(password,result.password)
        if(hash){
          const token = createToken()
          const token_ = Token(sequelize,DataTypes).create({userCode:result.userCode,user_token:token})
          let { loginNum } = result
          loginNum++
          result.loginNum=loginNum
          await User(sequelize,DataTypes).update({loginNum: loginNum},{where:{userCode:username}}).then(async result1=>{
            res.json({code:200,msg:"登录成功",data:{token:token,userCode:result.userCode,username:result.username,role:result.role}})
          })
        }else{
          res.json({code:203,msg:"密码错误,登录失败"})
        }
      }
    })
  }
});

//管理后台用户密码更新
router.post("/updatePassword",async (req,res,next)=>{
  const { username, email, userCode, password } = req.body
  const hash = await saltPasswd.saltPasswd(password)
  await User(sequelize,DataTypes).findOne({ where: { userCode: userCode, username: username, email: email } }).then(async result=>{
    if(!result){
      res.json({code:201,msg:'该用户不存在，请先注册'})
    }else{
      await User(sequelize,DataTypes).update({ password: hash },{ where:{ userCode: userCode, username: username, email: email } }).then(result1=>{
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
  const { userCode } = req.query
  await User(sequelize,DataTypes).findOne({ where: { userCode: userCode }}).then(async result=>{
    if(result){
      await Avatar(sequelize,DataTypes).findOne({where:{userCode:result.userCode}}).then(avatar=>{
        if(avatar){
          res.json({code:200,msg:'获取用户信息成功',data:{usercode:result.userCode,avatar:avatar.url,deptname:"科技部",name:result.username}})
        }else{
          res.json({code:202,msg:'查询头像失败'})
        }
      })
    }else{
      res.json({code:201,msg:'获取用户信息失败'})
    }
  })
})

router.post('/logout',(req,res,next)=>{
  res.json({code:200,msg:"logout"})
})

//处理用户头像上传
const pathname = ADMIN_AVATAR_URL_UPLOAD
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,pathname)
  },
  filename:(req,file,cb)=>{
    const fullPath = file.originalname
    cb(null,fullPath)
  }
})
const uploader = multer({storage:storage})
router.post('/uploadAvatar',uploader.array('file'),async (req,res,next)=>{
  const avatarPath = ADMIN_AVATAR_URL_DOWNLOAD
  const {userCode,avatar}= req.body
  const files = req.files
  const temp = files.map(e => {
    const uuid = uuidv4()
    const basename = path.basename(e.path)    //源文件名
    const suffix = path.extname(e.path)       //文件后缀
    const newname = uuid+suffix               //新文件名
    fs.rename(pathname+basename,pathname+newname,err=>{
      // console.log(err)
  })
    return {file:avatarPath+newname}
  })
  await Avatar(sequelize,DataTypes).update({url:temp[0].file},{where:{userCode:userCode}}).then (result => {
    if(result) {
      const originfileName = avatar.split("\/").slice(-1)
      if(originfileName[0]!=="defaultImg.png"){  //默认头像不要删除
        const FILE_PATH = ADMIN_AVATAR_URL_UPLOAD+`${originfileName}`
        fs.unlink(FILE_PATH,()=>{console.log('删除图片成功')})
      }
      res.json({code:200,msg:"头像上传成功",avatar:temp[0].file})
    }
  })
})


module.exports = router;