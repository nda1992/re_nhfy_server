// 官网管理的相关路由
const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const { DataTypes, Op } = require('sequelize')
const sequelize = require('../../database/connection')
const Doctor = require('../../models/doctor')
const usuallyWebsite = require('../../models/usuallywebsite')
const { DOCTOR_AVATAR_DOWNLOAD, DOCTOR_AVATAR_UPLOAD, USUALLY_WEBSITE_IMG_UPLOAD, USUALLY_WEBSITE_IMG_DOWNLOAD } = require('../../config/network')
const moment = require('moment-timezone')
const usuallywebsite = require('../../models/usuallywebsite')
    // 设置时区
moment.tz.setDefault('Asia/Shanghai')

// -----------医生信息管理-----------------
// 添加医生基本信息
router.post('/addDoctorInfo', async(req, res, next) => {
    const data = req.body
    await Doctor(sequelize, DataTypes).create({
        userCode: data.userCode,
        username: data.username,
        age: data.age,
        jobTitle: data.jobTitle,
        grade: data.grade,
        education: data.education,
        school: data.school,
        deptName: data.deptName,
        topDept: data.topDept,
        phone: data.phone,
        email: data.email,
        avatar: data.avatar,
        desc: data.desc,
        status: 1,
        currentStatus: data.currentStatus,
        professional: data.professional
    }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '医生信息上传成功' })
        } else {
            res.json({ code: 201, msg: '医生信息上传失败' })
        }
    })
})

// 更新医生基本信息
router.put('/updateDoctorInfo', async(req, res, next) => {
    const data = req.body
    await Doctor(sequelize, DataTypes).update({
        userCode: data.userCode,
        username: data.username,
        age: data.age,
        jobTitle: data.jobTitle,
        grade: data.grade,
        education: data.education,
        school: data.school,
        deptName: data.deptName,
        topDept: data.topDept,
        phone: data.phone,
        email: data.email,
        avatar: data.avatar,
        desc: data.desc,
        status: data.status === '正常' ? 1 : 0,
        currentStatus: data.currentStatus,
        professional: data.professional
    }, { where: { id: data.id } }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '信息更新成功' })
        } else {
            res.json({ code: 201, msg: '信息更新失败' })
        }
    })

})

// 无条件查询所有医生信息(管理员专用)
router.get('/getAllDoctorInfo', async(req, res, next) => {
    const { page, limit } = req.query
    await Doctor(sequelize, DataTypes).findAll().then(result => {
        if (result) {
            const Doctoritems = result.map(e => {
                const tempDate = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
                const tempStatus = e.status === 0 ? '已删除' : '正常'
                return { id: e.id, userCode: e.userCode, username: e.username, age: e.age, jobTitle: e.jobTitle, education: e.education, school: e.school, deptName: e.deptName, topDept: e.topDept, phone: e.phone, email: e.email, avatar: e.avatar, status: tempStatus, createTime: tempDate, grade: e.grade, currentStatus: e.currentStatus, professional: e.professional, desc: e.desc }
            })
            const pageList = Doctoritems.filter((item, index) => index < limit * page && index >= limit * (page - 1))
            res.json({ code: 200, items: pageList, total: Doctoritems.length })
        } else {
            res.json({ code: 201, msg: '获取信息失败' })
        }
    })
})

// 根据科室名城查询医生信息(官网学科荟萃页面中使用)
router.get('/getDoctorInfoByDeptName', async(req, res, next) => {
    res.json({ code: 200, msg: 'success' })
})

// 根据grade查询专家(官网专家介绍页面中使用)
router.get('/getDoctorInfoByGrade', async(req, res, next) => {
    res.json({ code: 200, msg: 'success' })
})

// 根据id删除医生个人信息，将status设置为0
router.get('/deleteDoctorInfo', async(req, res, next) => {
    const { id } = req.query
    await Doctor(sequelize, DataTypes).update({ status: 0 }, { where: { id: id } }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '已成功删除' })
        } else {
            res.json({ code: 201, msg: '删除失败' })
        }
    })
})

// 根据医生id恢复已删除的信息
router.get('/recoverDoctorInfo', async(req, res, next) => {
    const { id } = req.query
    await Doctor(sequelize, DataTypes).update({ status: 1 }, { where: { id: id } }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '已成功恢复' })
        } else {
            res.json({ code: 201, msg: '恢复失败' })
        }
    })
})

// 上传医生头像
const avatarPath = DOCTOR_AVATAR_UPLOAD
const AvatarFilestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatarPath)
    },
    filename: (req, file, cb) => {
        const filename = file.originalname
        cb(null, filename)
    }
})
const Avataruploader = multer({ storage: AvatarFilestorage })
router.post('/uploadAvatar', Avataruploader.array('file'), async(req, res, next) => {
    const fileUrl = DOCTOR_AVATAR_DOWNLOAD
    const files = req.files
    let temp = files.map(e => {
        const uuid = uuidv4()
        const basename = path.basename(e.path) //源文件名
        const suffix = path.extname(e.path) //文件后缀
        const newname = uuid + suffix //新文件名
        fs.rename(avatarPath + basename, avatarPath + newname, err => {
            // console.log(err)
        })
        return { file: fileUrl + newname }
    })
    res.json({ code: 200, msg: '照片上传成功', url: temp[0].file })
})

// -----------常用网站管理-------------
// 添加常用网站的全部信息
router.post('/addUsuallyWebsite', async(req, res, next) => {
    const data = req.body
    await usuallyWebsite(sequelize, DataTypes).create({ userCode: data.userCode, deptName: data.deptName, url: data.url, img: data.img, title: data.title, status: 1 }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '添加成功' })
        } else {
            res.json({ code: 201, msg: '添加失败' })
        }
    })

})

// 查询所有的常用网站
router.get('/getAllUsuallyWebsite', async(req, res, next) => {
    const { website, limit, page } = req.query
        // website='manager':查询所有(管理员)；// website='website':正常status=1（未删除，官网）
    if (website === 'manager') {
        await usuallyWebsite(sequelize, DataTypes).findAll().then(result => {
            const items = result.map(e => {
                const tempStatus = e.status === 1 ? '正常' : '已删除'
                const tempDate = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
                return { id: e.id, title: e.title, userCode: e.userCode, deptName: e.deptName, url: e.url, img: e.img, createTime: tempDate, status: tempStatus }
            })
            const pageList = items.filter((item, index) => index < limit * page && index >= limit * (page - 1))
            res.json({ code: 200, items: pageList, total: items.length })
        })
    } else if (website === 'website') {
        await usuallyWebsite(sequelize, DataTypes).findAll({ where: { status: 1 } }).then(result => {
            const items = result.map(e => {
                const tempDate = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
                return { id: e.id, title: e.title, url: e.url, img: e.img, createTime: tempDate }
            })
            const pageList = items.filter((item, index) => index < limit * page && index >= limit * (page - 1))
            res.json({ code: 200, allItems: items, lessItems: pageList, total: items.length })
        })
    }
})

// 更新常用网站信息
router.put('/updateUsuallyWebsite', async(req, res, next) => {
    const data = req.body
    await usuallyWebsite(sequelize, DataTypes).update({ deptName: data.deptName, title: data.title, url: data.url, img: data.img }, { where: { id: data.id } }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '更新成功' })
        } else {
            res.json({ code: 201, msg: '更新失败' })
        }
    })
})

// 根据id删除常用网站
router.get('/deleteUsualleWebsiteById', async(req, res, next) => {
    const { id } = req.query
    await usuallyWebsite(sequelize, DataTypes).update({ status: 0 }, { where: { id: id } }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '删除成功' })
        } else {
            res.json({ code: 201, msg: '删除失败' })
        }
    })
})

// 根据id恢复常用网站
router.get('/recoverUsualleWebsiteById', async(req, res, next) => {
    const { id } = req.query
    await usuallyWebsite(sequelize, DataTypes).update({ status: 1 }, { where: { id: id } }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '恢复成功' })
        } else {
            res.json({ code: 201, msg: '恢复失败' })
        }
    })
})

// 上传常用网站图片
const imgPath = USUALLY_WEBSITE_IMG_UPLOAD
const ImgFilestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imgPath)
    },
    filename: (req, file, cb) => {
        const filename = file.originalname
        cb(null, filename)
    }
})
const Imguploader = multer({ storage: ImgFilestorage })
router.post('/uploadImg', Imguploader.array('file'), async(req, res, next) => {
    const fileUrl = USUALLY_WEBSITE_IMG_DOWNLOAD
    const files = req.files
    let temp = files.map(e => {
        const uuid = uuidv4()
        const basename = path.basename(e.path) //源文件名
        const suffix = path.extname(e.path) //文件后缀
        const newname = uuid + suffix //新文件名
        fs.rename(imgPath + basename, imgPath + newname, err => {
            // console.log(err)
        })
        return { file: fileUrl + newname }
    })
    res.json({ code: 200, msg: '照片上传成功', url: temp[0].file })
})

module.exports = router