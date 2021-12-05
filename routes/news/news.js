//新闻模块的相关路由
const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const News = require('../../models/news')
const { DataTypes, Op } = require('sequelize')
const sequelize = require('../../database/connection')
const User = require('../../models/user')
const Category = require('../../models/category')
const Dept = require('../../models/dept')
const Menu = require('../../models/menu')
const moment = require('moment-timezone')
const { NEWS_IMAGES_URL_UPLOAD, NEWS_IMAGES_URL_DOWNLOAD, NEWS_ATTACHMENTFILE_URL_UPLOAD, NEWS_ATTACHMENTFILE_URL_DOWNLOAD } = require('../../config/network')
    // 设置时区
moment.tz.setDefault('Asia/Shanghai')
    //搜索作者
router.get('/searchUser', async(req, res, next) => {
    const data = req.query
    let obj = []
    await User(sequelize, DataTypes).findAll({
        where: {
            username: {
                [Op.like]: `%${data['0']}%`
            }
        }
    }).then(result => {
        if (result) {
            result.forEach(e => {
                let temp = {}
                temp.username = e.username
                obj.push(temp)
            })
            res.json({ code: 200, items: obj })
        } else {
            res.json({ code: 201, items: '查询失败' })
        }
    })
})

// 模糊搜索新闻类别
router.get('/searchCategory', async(req, res, next) => {
    const data = req.query
    let obj = []
    await Category(sequelize, DataTypes).findAll({
        where: {
            name: {
                [Op.like]: `%${data['0']}%`
            }
        }
    }).then(result => {
        if (result) {
            result.forEach(e => {
                let temp = {}
                temp.name = e.name
                obj.push(temp)
            })
            res.json({ code: 200, items: obj })
        } else {
            res.json({ code: 201, items: '查询失败' })
        }
    })
})

// 添加新闻类别
router.post('/createCategory', async(req, res, next) => {
        const data = req.body
        await Category(sequelize, DataTypes).create({ name: data.name, username: data.username }).then(result => {
            if (result) {
                res.json({ code: 200, msg: '添加成功' })
            } else {
                res.json({ code: 201, msg: '添加失败' })
            }
        })
    })
    // 模糊搜索部门
router.get('/searchDept', async(req, res, next) => {
    const data = req.query
    let obj = []
    await Dept(sequelize, DataTypes).findAll({
        where: {
            deptName: {
                [Op.like]: `%${data['0']}%`
            }
        }
    }).then(result => {
        if (result) {
            result.forEach(e => {
                let temp = {}
                temp.name = e.deptName
                obj.push(temp)
            })
            res.json({ code: 200, items: obj })
        } else {
            res.json({ code: 201, items: '查询失败' })
        }
    })
})

// --------------------------------------文章相关路由---------------------------------------------------

// 发布文章
router.post('/releaseNews', async(req, res, next) => {
    const { id, author, status, title, content, display_time, platforms, category, deptName, type, role, newsStatus, loginuserCode, currentRoute, newsBackgroundUrl } = req.body
    if (role !== 'admin') {
        res.json({ code: 404, msg: "您没有权限发布新闻" })
    } else {
        // res.json({code:200,msg:"新闻发表成功"})
        let plateform = 0
        if (platforms.length === 1 && platforms[0] === '院内网站') {
            plateform = 1
        } else if (platforms.length === 1 && platforms[0] === '院外网站') {
            plateform = 2
        } else {
            plateform = 3
        }
        // 保存为草稿
        if (type === 1) {
            // SQL的注释：如果status=publised,说明该条记录不是草稿，如果用户将不是草稿的记录保存为草稿，也需要创建一条新记录
            // 表示该条记录是草稿，则进行更新
            if (status === 'draft' && currentRoute !== '/news/release') { // 如果是从release页面过来，表示新创建一条草根
                await News(sequelize, DataTypes).update({ title: title, content: content, userName: author, deptName: deptName, createTime: moment(display_time).format('YYYY-MM-DD HH:mm:ss'), category: category, clickNum: 0, status: 'draft', type: type, newsStatus: newsStatus, plateform: plateform, loginuserCode: loginuserCode, url: newsBackgroundUrl }, { where: { id: id, status: status } }).then(result => {
                    if (result) {
                        res.json({ code: 200, msg: "草稿更新成功" })
                    } else {
                        res.json({ code: 202, msg: "草稿发表失败" })
                    }
                })
            } else {
                await News(sequelize, DataTypes).create({ title: title, content: content, userName: author, deptName: deptName, createTime: moment(display_time).format('YYYY-MM-DD HH:mm:ss'), category: category, clickNum: 0, status: 'draft', type: type, newsStatus: newsStatus, plateform: plateform, loginuserCode: loginuserCode, url: newsBackgroundUrl }).then((result) => {
                    if (result) {
                        res.json({ code: 200, msg: "草稿创建成功" })
                    } else {
                        res.json({ code: 201, msg: "草稿创建失败" })
                    }
                })
            }
        } else {
            // 发表文章
            await News(sequelize, DataTypes).findOne({ where: { id: id } }).then(async item => {
                //不存在，则创建新纪录
                if (!item) {
                    await News(sequelize, DataTypes).create({ title: title, content: content, userName: author, deptName: deptName, createTime: moment(display_time).format('YYYY-MM-DD HH:mm:ss'), category: category, clickNum: 0, status: status, type: type, newsStatus: newsStatus, plateform: plateform, loginuserCode: loginuserCode, url: newsBackgroundUrl }).then((result) => {
                        if (result) {
                            res.json({ code: 200, msg: "新闻提交成功，等待审核" })
                        } else {
                            res.json({ code: 201, msg: "新闻发表失败" })
                        }
                    })
                } else {
                    //存在记录，则进行更新
                    await News(sequelize, DataTypes).update({ title: title, content: content, userName: author, deptName: deptName, createTime: moment(display_time).format('YYYY-MM-DD HH:mm:ss'), category: category, clickNum: 0, status: status, type: type, newsStatus: newsStatus, plateform: plateform, loginuserCode: loginuserCode, url: newsBackgroundUrl }, { where: { id: id } }).then(result => {
                        if (result) {
                            res.json({ code: 200, msg: "新闻提交成功，等待审核" })
                        } else {
                            res.json({ code: 202, msg: "新闻发表失败" })
                        }
                    })
                }
            })
        }
    }
})

// 无条件获取文章草稿标题
router.get('/getDraftList', async(req, res, next) => {
    const data = req.query
    const type = 1 // type=1：表示草稿
    if (data.role !== 'admin') {
        res.json({ code: 201, msg: '您没有权限获取内容' })
    } else {
        await News(sequelize, DataTypes).findAll({ where: { type: type, loginuserCode: data.loginuserCode } }).then(result => {
            if (result) {
                res.json({ code: 200, msg: '获取内容成功', items: result })
            } else {
                res.json({ code: 202, msg: '获取内容失败' })
            }
        })
    }
})

// 根据新闻id查询草稿
router.get('/getDraftById', async(req, res, next) => {
    const data = req.query
    await News(sequelize, DataTypes).findOne({ where: { id: data.id } }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '数据获取成功', result: result })
        } else {
            res.json({ code: 201, msg: '数据获取失败' })
        }
    })
})

// 获取所有文章记录
router.get('/getnewsList', async(req, res, next) => {
    const { role, limit, page } = req.query
    if (role !== 'admin') {
        res.json({ code: 201, msg: "您没有权限访问该页面" })
    } else {
        await News(sequelize, DataTypes).findAll().then(result => {
            if (result) {
                let news = result.map(e => {
                    // 发布的平台
                    let platformTemp = ''
                        //审核状态
                    let newsStatusTemp = ''
                        //发布状态
                    let statusTemp = ''
                        //切换开关（审核通过=1，审核未通过=0）
                    let Switch = ''
                        //发布时间
                    let timeTemp = moment(e.createTime).format('YYYY-MM-DD HH:mm:ss')

                    if (e.newsStatus === 1 && e.status === 'published') {
                        newsStatusTemp = '已审核'
                        statusTemp = '已发布'
                        Switch = true
                    } else if (e.newsStatus === 2 && e.status === 'published') {
                        newsStatusTemp = '未审核'
                        statusTemp = '未发布'
                        Switch = false
                    } else if (e.newsStatus === 3 && e.status === 'published') {
                        statusTemp = '未发布'
                        newsStatusTemp = '不通过'
                        Switch = false
                    } else if (e.newsStatus === 4) {
                        statusTemp = '草稿'
                        newsStatusTemp = '草稿'
                        Switch = false
                    } else {
                        newsStatusTemp = '已删除'
                        statusTemp = '已删除'
                        Switch = 0
                    }
                    // 发布的平台
                    if (e.plateform === 1) {
                        platformTemp = ['院内网站']
                    } else if (e.plateform === 2) {
                        platformTemp = ['院外网站']
                    } else {
                        platformTemp = ['院内网站', '院外网站']
                    }
                    return { id: e.id, title: e.title, content: e.content, createTime: timeTemp, type: e.type, newsStatus: newsStatusTemp, userName: e.userName, deptName: e.deptName, clickNum: e.clickNum, status: statusTemp, platforms: platformTemp, category: e.category, Switch: Switch }
                })
                const pageList = news.filter((item, index) => index < limit * page && index >= limit * (page - 1))
                res.json({ code: 200, msg: '获取新闻成功', items: pageList, total: news.length })
            } else {
                res.json({ code: 201, msg: '获取数据失败' })
            }
        })
    }
})

// 根据switch的值更新文章的发表状态
router.post('/updateNewsStatus', async(req, res, next) => {
  const { id, role, Switch } = req.body
  const update_time = new Date()
        // 审核通过
    if (Switch) {
        const newsStatusTemp = 1
        const statusTemp = 'published'
        await News(sequelize, DataTypes).update({ newsStatus: newsStatusTemp, status: statusTemp, createTime: moment(update_time).format('YYYY-MM-DD HH:mm:ss') }, { where: { id: id } }).then(result => {
                if (result) {
                    res.json({ code: 200, msg: "更新成功" })
                } else {
                    res.json({ code: 201, msg: "更新失败" })
                }
            })
            // 审核未通过
    } else {
        const newsStatusTemp = 3
        const statusTemp = 'published'
        await News(sequelize, DataTypes).update({ newsStatus: newsStatusTemp, createTime: moment(update_time).format('YYYY-MM-DD HH:mm:ss') }, { where: { id: id } }).then(result => {
            if (result) {
                res.json({ code: 200, msg: "更新成功" })
            } else {
                res.json({ code: 201, msg: "更新失败" })
            }
        })
    }
})

// 根据文章id浏览
router.get('/ScanById', async(req, res, next) => {
    const { id, role } = req.query
    await News(sequelize, DataTypes).findOne({ where: { id: id } }).then(async item => {
        let num = item.clickNum // 更新浏览次数
        num++
        await News(sequelize, DataTypes).update({ clickNum: num }, { where: { id: id } }).then(async result1 => {
            await News(sequelize, DataTypes).findOne({ where: { id: id } }).then(result => {
                if (result) {
                    res.json({ code: 200, msg: '文章获取成功', item: result })
                } else {
                    res.json({ code: 201, msg: '文章获取失败' })
                }
            })
        })
    })
})

// 根据id删除文章
router.delete('/deleteNewsById', async(req, res, next) => {
    const { id } = req.query
    await News(sequelize, DataTypes).destroy({ where: { id: id } }).then(result => {
        if (result) {
            res.json({ code: 200, msg: '删除成功' })
        } else {
            res.json({ code: 201, msg: '删除失败' })
        }
    })
})


// 文章图片上传
const filePath = NEWS_IMAGES_URL_UPLOAD
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, filePath)
    },
    filename: (req, file, cb) => {
        const filename = file.originalname
        cb(null, filename)
    }
})

const uploader = multer({ storage: storage })
router.post('/upload', uploader.array('file'), (req, res, next) => {
    const imgOrigin = NEWS_IMAGES_URL_DOWNLOAD
    const files = req.files
    let temp = files.map(e => {
        const uuid = uuidv4()
        let basename = path.basename(e.path) //源文件名
        let suffix = path.extname(e.path) //文件后缀
        let newname = uuid + suffix //新文件名
        fs.rename(filePath + basename, filePath + newname, err => {
            // console.log(err)
        })
        return { file: imgOrigin + newname }
        // return {file:imgOrigin+e.originalname}
    })
    res.json({ errno: 0, files: temp })
})



/****************处理xls、xlsx、doc、docx和pdf文件的上传************************/
const ExcelfilePath = NEWS_ATTACHMENTFILE_URL_UPLOAD
const Filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, ExcelfilePath)
    },
    filename: (req, file, cb) => {
        const filename = file.originalname
        cb(null, filename)
    }
})
const Fileuploader = multer({ storage: Filestorage })

router.post('/uploadFile', Fileuploader.array('file'), async(req, res, next) => {
    // 访问文件的URL
    const fileUrl = NEWS_ATTACHMENTFILE_URL_DOWNLOAD
    const files = req.files
    const FileArr = files.map(e => {
        const uuid = uuidv4()
        let basename = path.basename(e.path)
        let suffix = path.extname(e.path)
        let newname = uuid + suffix
        fs.rename(ExcelfilePath + basename, ExcelfilePath + newname, err => {
            // console.log(err)
        })
        return { file: fileUrl + newname }
    })
    res.json({ code: 200, files: FileArr, msg: '文件上传成功' })
        // res.json({code: 200,msg:'success'})
})

// 上传官网菜单
router.post('/submitMenu', async(req, res, next) => {
    const { parent, children } = req.body
    const parent_menu = { name: parent, level: 1, parent: '无' }
    let menus = []
    let insert = []
        // 1个以上，拆分成数组
    if (children.search('#') !== -1) {
        menus = children.trim().split('#').map(e => {
            return { name: e, level: 2, parent: parent }
        })
        insert = [parent_menu, ...menus]
    } else {
        insert = [parent_menu, { name: children, level: 2, parent: parent }]
    }
    await Menu(sequelize, DataTypes).bulkCreate(insert).then(result => {
        if (result) {
            res.json({ code: 200, msg: 'success' })
        } else {
            res.json({ code: 201, msg: '添加失败' })
        }
    })
})

module.exports = router