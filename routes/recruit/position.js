/*
岗位相关的路由：
- 用户简历投递
- 用户收藏岗位
- 用户分享岗位
*/

const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')
const saltPasswd = require('../../utils/saltPasswd')
const { positionInstance, jobSeekerInstance,post2positionInstance } = require('../../database/models/associate')
// 设置时区
moment.tz.setDefault('Asia/Shanghai')


// （小程序端或web端）求职者注册
router.post('/jobSeekerRegister',async (req,res,next) => {
    const data = req.body
    // 所有的注册用户均为jobseeker角色
    const role = 'jobseeker'
    // 密码加密
    const hash = await saltPasswd.saltPasswd(data.password)
    await jobSeekerInstance.findOne({where:{openid:data.openid}}).then( async result => {
        // 用户不存在，新建
        if(!result){
            await jobSeekerInstance.create({openid:data.openid,
                username:data.username,password:hash,faceimgUrl:data.faceimgUrl,
                phone:data.phone,sex:data.sex,age:data.age,birthday:data.birthday,
                nation:data.nation,degree:data.degree,professional:data.professional,
                undergraduateTime:data.undergraduateTime,attachmentUrl:data.attachmentUrl,
                role:role,email:data.email,address:data.address,school:data.school}).then( user => {
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



module.exports = router