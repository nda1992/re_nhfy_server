const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const { DataTypes, Op } = require('sequelize')
const sequelize = require('../../database/connection')
const Menu = require('../../models/menu')
const Advice = require('../../models/advice')
const Video = require('../../models/video')
const News = require('../../models/news')
const Doctor = require('../../models/doctor')
const { WEBSITE_VIDEO_UPLOAD, WEBSITE_VIDEO_DOWNLOAD, VIDEO_COVER_UPLOAD, VIDEO_COVER_DOWNLOAD } = require('../../config/network')
const moment = require('moment-timezone')
    // 设置时区
moment.tz.setDefault('Asia/Shanghai')
    // 获取所有menus
router.get('/getMenusList', async(req, res, next) => {
  let id = 1
  await Menu(sequelize, DataTypes).findAll().then((result) => {
  if (result) {
    // 保存临时的children menus
    let ctemp = []
    const parents = result.filter(c => c.parent === '无')
    const childrens = result.filter(c => c.parent !== '无')
          // 最终要返回的menus数组
    const items = parents.map(e => {
        let item_temp = []
        childrens.forEach(c => {
            if (c.parent === e.name) {
                ctemp.push({ name: c.name, index: c.index })
            }
        })
        item_temp = { id: id, parent: { name: e.name, index: e.index }, children: ctemp }
        ctemp = []
        id++
        return item_temp
    })
      res.json({ code: 200, items: items })
    } else {
      res.json({ code: 201, msg: '获取数据失败' })
    }
  })
})

// 查询指定parent的所有menus
router.get('/getMenusByParent', async(req, res, next) => {
    await Menu(sequelize, DataTypes).findAll({
        where: {
            parent: {
                [Op.notIn]: ['无']
            }
        }
    }).then(result => {
        if (result) {
            const items = result.map(e => {
                return { name: e.name, index: e.index }
            })
            res.json({ code: 200, items: items })
        } else {
            res.json({ code: 201, msg: 'error' })
        }
    })
})

// 用户提交过来的建议
router.post('/advice', async(req, res, next) => {
    const { content } = req.body
    await Advice(sequelize, DataTypes).create({ userCode: 1, content: content }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '建议已提交,感谢您的反馈,我们会及时处理' })
        } else {
            res.json({ code: 201, msg: '建议提交失败' })
        }
    })
})

// 管理员上传视频
const videoPath = WEBSITE_VIDEO_UPLOAD
const Filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, videoPath)
    },
    filename: (req, file, cb) => {
        const filename = file.originalname
        cb(null, filename)
    }
})
const Fileuploader = multer({ storage: Filestorage })
router.post('/uploadVideo', Fileuploader.array('file'), async(req, res, next) => {
    const fileUrl = WEBSITE_VIDEO_DOWNLOAD
    const { userCode, deptName, title, category } = req.body
    const files = req.files
    let temp = files.map(e => {
        const uuid = uuidv4()
        const basename = path.basename(e.path) //源文件名
        const suffix = path.extname(e.path) //文件后缀
        const newname = uuid + suffix //新文件名
        fs.rename(videoPath + basename, videoPath + newname, err => {
            // console.log(err)
        })
        return { file: fileUrl + newname }
    })
    await Video(sequelize, DataTypes).create({ url: temp[0].file, userCode: userCode, status: 0, deptName: deptName, clickNum: 0, category: category, title: title }).then(result => {
        if (result) {
            const tempUrl = { id: result.id, url: result.url }
            res.json({ code: 200, msg: '视频上传成功', file: tempUrl })
        } else {
            res.json({ code: 201, msg: '视频上传失败' })
        }
    })
})

// 上传视频封面
const coverPath = VIDEO_COVER_UPLOAD
const CoverFilestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, coverPath)
    },
    filename: (req, file, cb) => {
        const filename = file.originalname
        cb(null, filename)
    }
})
const Coveruploader = multer({ storage: CoverFilestorage })
router.post('/uploadCover', Coveruploader.array('file'), async(req, res, next) => {
    const { id } = req.body
    const fileUrl = VIDEO_COVER_DOWNLOAD
    const files = req.files
    let temp = files.map(e => {
        const uuid = uuidv4()
        const basename = path.basename(e.path) //源文件名
        const suffix = path.extname(e.path) //文件后缀
        const newname = uuid + suffix //新文件名
        fs.rename(coverPath + basename, coverPath + newname, err => {
            // console.log(err)
        })
        return { file: fileUrl + newname }
    })
    await Video(sequelize, DataTypes).update({ cover: temp[0].file }, { where: { id: id } }).then(result => {
        if (result) {
            const tempUrl = { url: temp[0].file }
            res.json({ code: 200, msg: '封面上传成功', item: tempUrl })
        } else {
            res.json({ code: 201, msg: '上传封面失败' })
        }
    })
})

// 管理员根据userCode获取所有的视频列表
router.get('/getAllVideos', async(req, res, next) => {
  const { userCode, limit, page } = req.query
  let num = 0
  await Video(sequelize, DataTypes).findAll({ where: { userCode: userCode } }).then(result => {
    if (result) {
      const Videoitems = result.map(e => {
        let Switch = e.status === 1 ? true : false
        if (e.status === 1) num++
        const tempDate = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
        return { id: e.id, url: e.url, title: e.title, deptName: e.deptName, userCode: e.userCode, category: e.category, Switch: Switch, createdDate: tempDate, clickNum: e.clickNum, cover: e.cover }
      })
      const pageList = Videoitems.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      res.json({ code: 200, msg: '获取视频列表成功', items: pageList, total: Videoitems.length, num: num })
    } else {
      res.json({ code: 201, msg: '获取视频列表失败' })
    }
  })
})

// 获取所有status=1的视频，在官网展示
router.get('/getVideoListByStatus', async (req, res, next) => {
  const { category, limit, page } = req.query
  await Video(sequelize, DataTypes).findAll({ where: { status: 1, category: category} }).then(result => {
    if (result) {
      const items = result.map(e => {
        return { id: e.id, url: e.url, title: e.title, cover: e.cover }
      })
      const pageList = items.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      res.json({ code: 200, items: pageList, total: items.length})
    } else {
      res.json({ code: 201, msg: '获取视频失败' })
    }
  })
})

// 更新视频状态
router.get('/SetVideoStatus', async(req, res, next) => {
    const { Switch, id } = req.query
    if (JSON.parse(Switch)) {
        await Video(sequelize, DataTypes).update({ status: 1 }, { where: { id: id } }).then((result) => {
            if (result) {
                res.json({ code: 200, msg: '状态已更新' })
            } else {
                res.json({ code: 201, msg: '状态更新失败' })
            }
        })
    } else {
        await Video(sequelize, DataTypes).update({ status: 0 }, { where: { id: id } }).then((result) => {
            if (result) {
                res.json({ code: 200, msg: '状态已更新' })
            } else {
                res.json({ code: 201, msg: '状态更新失败' })
            }
        })
    }
})

// 删除视频
router.post('/deleteVideoById', async(req, res, next) => {
    const { id, url } = req.body
    const filename = url.split('/').slice(-1)[0]
    await Video(sequelize, DataTypes).destroy({ where: { id: id } }).then(result => {
        if (result) {
            // 同时也删除本地文件
            const fullPath = videoPath + filename
            fs.unlink(fullPath, function(err) { if (err) { throw err } })
            console.log('视频已删除')
            res.json({ code: 200, msg: '图片视频已删除' })
        } else {
            res.json({ code: 201, msg: '视频删除失败' })
        }
    })
})

// 获取学科荟萃信息
router.get('/getSubjectAssembleList', async(req, res, next) => {
  const { category, limit, page } = req.query
  await News(sequelize, DataTypes).findAll({ where: { category: category, status: 'published' } }).then(result => {
    if (result) {
      const newsItems = result.map(e => {
        return {
          id: e.id,
          deptName: e.deptName,
          title: e.title
        }
      })
      const pageList = newsItems.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      res.json({ code: 200, items: pageList, total: newsItems.length })
    } else {
      res.json({ code: 201, msg: '获取数据失败' })
    }
  })
})

// 获取专家列表
router.get('/getAllExpertList', async(req, res, next) => {
  const { grade, page, limit } = req.query
  await Doctor(sequelize, DataTypes).findAll({ where: { grade: grade } }).then(result => {
    if (result) {
      const doctorsItems = result.map(e => {
          return {
            id: e.id,
            avatar: e.avatar,
            username: e.username,
            jobTitle: e.jobTitle,
            deptName: e.deptName
          }
      })
      const pageList = doctorsItems.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      res.json({ code: 200, items: pageList, total: doctorsItems.length })
    } else {
      res.json({ code: 201, msg: '获取列表失败' })
    }
  })
})

// 根据id获取医生详细信息
router.get('/getDoctorDetailById', async(req, res, next) => {
  const { id } = req.query
  await Doctor(sequelize, DataTypes).findOne({ where: { id: id } }).then(result => {
    if (result) {
      const item = {
          username: result.username,
          deptName: result.deptName,
          avatar: result.avatar,
          jobTitle: result.jobTitle,
          education: result.education,
          desc: result.desc,
          email: result.email,
          professional: result.professional
      }
      res.json({ code: 200, item: item })
    } else {
      res.json({ code: 201, msg: '获取信息失败' })
    }
  })
})

module.exports = router