const express = require('express')
const router = express.Router()
const { DataTypes, Op } = require('sequelize')
const sequelize = require('../../database/connection')
const News = require('../../models/news')
const moment = require('moment-timezone')
    // 设置时区
moment.tz.setDefault('Asia/Shanghai')
    // 根据类别获取所对应的新闻列表
router.get('/getAllNewsByCategory', async(req, res, next) => {
  const { category, limit, page } = req.query
  await News(sequelize, DataTypes).findAll({ where: { category: category, status: 'published' } }).then(result => {
    if (result) {
      const items = result.map(e => {
        const createTime = moment(e.updatedAt).format('YYYY-MM-DD')
        return { id: e.id, title: e.title, createTime: createTime, deptName: e.deptName }
      })
      const pageList = items.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      res.json({ code: 200, items: pageList, total: items.length })
    } else {
      res.json({ code: 201, msg: '查询数据失败' })
    }
  })
})

// 根据文章id浏览
router.get('/getNewsById', async(req, res, next) => {
  const { id } = req.query
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

// 根据新闻类别查询新闻
router.get('/getNewsByCategory', async (req, res, next) => {
  const { category } = req.query
  await News(sequelize, DataTypes).findAll({ where: { category: category } }).then(result => {
    if (result) {
      res.json({ code: 200, items: result})
    } else {
      res.json({code: 201, msg: '获取新闻失败'})
    }
  })
})

module.exports = router