const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const moment = require('moment-timezone')
const { positionInstance, jobSeekerInstance, post2positionInstance } = require('../../database/models/associate')
const sequelize = require('../../database/connection')
const Swiper = require('../../models/swiper')
const { DataTypes } = require('sequelize')
const { SWIPER_IMAGES_URL_UPLOAD, SWIPER_IMAGES_URL_DOWNLOAD } = require('../../config/network')
    // 设置时区
moment.tz.setDefault('Asia/Shanghai')

// 获取所有的岗位列表
router.get('/getPositionList', async(req, res, next) => {
    const { role, limit, page } = req.query
    await positionInstance.findAll().then(result => {
        if (result) {
            let positions = result.map(e => {
                let createTime = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
                    // 也返回一个YYYY-MM-DD格式的时间
                let simpleDate = moment(e.createdAt).format('YYYY-MM-DD')
                    // 状态更新：Switch
                let Switch = ''
                    // 招聘状态
                let statusTemp = ''
                e.status === 1 ? statusTemp = '在招' : statusTemp = '已结束'
                    // 岗位类别
                let typeTemp = ''
                e.type === 1 ? typeTemp = '事业编' : typeTemp = '非事业编'
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
                return { id: e.id, positionName: e.positionName, deptName: e.deptName, address: e.address, requireNum: e.requireNum, type: typeTemp, Switch: Switch, status: statusTemp, Handlestatus: HandlestatusTemp, userCode: e.userCode, age: e.age, english: e.english, professional: e.professional, desc: e.desc, degree: e.degree, createDate: createTime, simpleDate: simpleDate }
            })
            const pageList = positions.filter((item, index) => index < limit * page && index >= limit * (page - 1))
            res.json({ code: 200, msg: '获取岗位列表成功', positions: pageList, total: positions.length })
        } else {
            res.json({ code: 201, msg: '获取岗位列表失败' })
        }
    })
})

// 新增岗位
router.post('/addPosition', async(req, res, next) => {
    const data = req.body
    await positionInstance.create({ positionName: data.positionName, deptName: data.deptName, address: data.address, requireNum: data.requireNum, type: data.type, userCode: data.userCode, age: data.age, degree: data.degree, english: data.english, professional: data.professional, status: data.status, Handlestatus: data.Handlestatus, contactPhone: data.contactPhone, desc: data.desc }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '添加成功' })
        } else {
            res.json({ code: 201, msg: '添加失败' })
        }
    })
})

// switch更新状态
router.post('/updatepositionStatus', async(req, res, next) => {
    const { id, Switch } = req.body
        // 审核通过
    if (Switch) {
        let HandlestatusTemp = 2 // 审核已通过
        await positionInstance.update({ Handlestatus: HandlestatusTemp }, { where: { id: id } }).then(result => {
                if (result) {
                    res.json({ code: 200, msg: '状态更新成功' })
                } else {
                    res.json({ code: 201, msg: '状态更新失败' })
                }
            })
            // 审核不通过
    } else {
        const HandlestatusTemp = 3
        await positionInstance.update({ Handlestatus: HandlestatusTemp }, { where: { id: id } }).then(result => {
            if (result) {
                res.json({ code: 200, msg: '状态更新成功' })
            } else {
                res.json({ code: 201, msg: '状态更新失败' })
            }
        })
    }
})

// 根据id删除岗位（更新status=2）
router.delete('/deletePosition', async(req, res, next) => {
    const { id } = req.query
    await positionInstance.update({ status: 2, Handlestatus: 1 }, { where: { id: id } }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '删除成功' })
        } else {
            res.json({ code: 201, msg: '删除失败' })
        }
    })
})

// 根据id修改status
router.post('/recoverpositionStatus', async(req, res, next) => {
    const { id, status, Handlestatus } = req.body
    await positionInstance.update({ status: status, Handlestatus: Handlestatus }, { where: { id: id } }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '更新成功' })
        } else {
            res.json({ code: 201, msg: '更新失败' })
        }
    })
})

// 更新岗位信息
router.post('/updatePosition', async(req, res, next) => {
    const data = req.body
    await positionInstance.update({ positionName: data.positionName, deptName: data.deptName, address: data.address, requireNum: data.requireNum, type: data.type, userCode: data.userCode, age: data.age, degree: data.degree, english: data.english, professional: data.professional, desc: data.desc }, { where: { id: data.id } }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '岗位信息更新成功' })
        } else {
            res.json({ code: 201, msg: '岗位信息更新失败' })
        }
    })
})

// 管理员接收到的消息
router.post('/getReceiveMsg2Admin', async(req, res, next) => {
    const { receive_id, limit, page } = req.body
        // 未阅读的消息条数
    let num = 0
    const sql = `select a.*,b.username,b.faceimgUrl from (
        select * from messages where receive_id=${receive_id} and remove_receive_id<>${receive_id}
        )a left join jobseekers b on a.send_id=b.id`
    const result = await sequelize.query(sql)
    if (result) {
        const resultMsgList = result[0].map(e => {
            let send_dateTemp = moment(e.send_date).format('YYYY-MM-DD HH:mm:ss')
            if (e.is_read === 0) num++
                return Object.assign({}, e, { format_send_date: send_dateTemp })
        })
        const pageList = resultMsgList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
        res.json({ code: 200, msg: '获取消息成功', msgList: pageList, total: resultMsgList.length, no_read_num: num })
    } else {
        res.json({ code: 201, msg: '获取消息失败' })
    }
})

// 管理员已发送的所有消息
router.post('/getSendMsg2Admin', async(req, res, next) => {
    const { send_id, limit, page } = req.body
    const sql = `select a.*,b.username,b.faceimgUrl from (
        select * from messages where send_id=${send_id} and remove_send_id<>${send_id}
        )a left join jobseekers b on a.receive_id=b.id`
    const result = await sequelize.query(sql)
    if (result) {
        const resultMsgList = result[0].map(e => {
            let send_dateTemp = moment(e.send_date).format('YYYY-MM-DD HH:mm:ss')
            return Object.assign({}, e, { format_send_date: send_dateTemp })
        })
        const pageList = resultMsgList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
        res.json({ code: 200, msg: '获取消息成功', msgList: pageList, total: resultMsgList.length })
    } else {
        res.json({ code: 201, msg: '获取消息失败' })
    }
})

// 管理员上传图片到招聘系统的轮播图中
// 1.管理员上传轮播图
// const swiperPath = path.join(__dirname,'../../public/swipers/')
const swiperPath = SWIPER_IMAGES_URL_UPLOAD
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, swiperPath)
    },
    filename: (req, file, cb) => {
        const filename = file.originalname
        cb(null, filename)
    }
})
const swiperUploader = multer({ storage: avatarStorage })
router.post('/uploadSwiper', swiperUploader.array('file'), async(req, res, next) => {
    const { userCode } = req.body
    const imgOrigin = SWIPER_IMAGES_URL_DOWNLOAD
    const files = req.files
    let temp = files.map(e => {
        const uuid = uuidv4()
        const basename = path.basename(e.path) //源文件名
        const suffix = path.extname(e.path) //文件后缀
        const newname = uuid + suffix //新文件名
        fs.rename(swiperPath + basename, swiperPath + newname, err => {
            // console.log(err)
        })
        return { file: imgOrigin + newname }
    })
    await Swiper(sequelize, DataTypes).create({ url: temp[0].file, userCode: userCode, status: 0, websiteStatus: 0 }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '图片上传成功', file: result })
        } else {
            res.json({ code: 201, msg: '图片上传失败' })
        }
    })
})


//2. 查询某个管理员已经上传的所有轮播图链接
router.get('/getAllSwiperImgs', async(req, res, next) => {
    const { userCode, limit, page } = req.query
        // 计数器，status=1和websiteStatus=1的数量，用来控制只能最多选择多少张轮播图
    let num = 0
    let websiteNum = 0
    await Swiper(sequelize, DataTypes).findAll({ where: { userCode: userCode } }).then(result => {
        if (result) {
            const resultTemp = result.map(e => {
                const createTemp = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
                if (e.status === 1) num++
                    if (e.websiteStatus === 1) websiteNum++
                        return { url: e.url, createdDate: createTemp, userCode: userCode, id: e.id, status: e.status, Switch: e.status === 1, websiteSwitch: e.websiteStatus === 1 }
            })
            const pageList = resultTemp.filter((item, index) => index < limit * page && index >= limit * (page - 1))
            res.json({ code: 200, files: pageList, total: result.length, num: num, websiteNum: websiteNum })
        } else {
            res.json({ code: 201, msg: '获取图片链接失败' })
        }
    })
})

// 3.根据id删除轮播图片
router.post('/deleteImgById', async(req, res, next) => {
    const { id, url } = req.body
    const filename = url.split('/').slice(-1)[0]
    await Swiper(sequelize, DataTypes).destroy({ where: { id: id } }).then(result => {
        if (result) {
            // 同时也删除本地文件
            const fullPath = swiperPath + filename
            fs.unlink(fullPath, function(err) { if (err) { throw err } })
            console.log('图片已删除')
            res.json({ code: 200, msg: '图片已删除' })
        } else {
            res.json({ code: 201, msg: '图片删除失败' })
        }
    })
})

// 4.更新status状态，是否为轮播图
router.get('/SetSwiperStatus', async(req, res, next) => {
    const { Switch, id } = req.query
        // Switch=true,status=1
    if (JSON.parse(Switch)) {
        await Swiper(sequelize, DataTypes).update({ status: 1 }, { where: { id: id } }).then((result) => {
            if (result) {
                res.json({ code: 200, msg: '状态已更新' })
            } else {
                res.json({ code: 201, msg: '状态更新失败' })
            }
        })
    } else {
        await Swiper(sequelize, DataTypes).update({ status: 0 }, { where: { id: id } }).then((result) => {
            if (result) {
                res.json({ code: 200, msg: '状态已更新' })
            } else {
                res.json({ code: 201, msg: '状态更新失败' })
            }
        })
    }
})

// 5.获取轮播图到招聘系统中
router.get('/getSwiperImgs2Run', async(req, res, next) => {
    await Swiper(sequelize, DataTypes).findAll({ where: { status: 1 } }).then((swiper) => {
        if (swiper) {
            res.json({ code: 200, swipers: swiper })
        } else {
            res.json({ code: 201, msg: '获取图片失败' })
        }
    })
})

module.exports = router