const express = require('express')
const router = express.Router()
const sequelize = require('../../database/connection')
const News = require('../../models/news')
const { DataTypes } = require('sequelize')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Shanghai')
// 获取新闻列表
router.get('/getnewsList', async(req, res, next) => {
    const { role, limit, page } = req.query
    if (role !== 'wechat') {
      res.json({ code: 201, msg: "您没有权限访问该页面" })
    } else {
      sql = `SELECT id, title,deptName,createTime,category,clickNum,url FROM news WHERE status='published' and newsStatus=1 ORDER BY clickNum DESC`
      const result = await sequelize.query(sql)
      if(result) {
        const newsList = result[0].map(e => {
            let send_dateTemp = moment(e.send_date).format('YYYY-MM-DD')
            return Object.assign({}, e, { createTime: send_dateTemp })
        })
        const pageList = newsList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
        res.json({code:200, items: pageList, total: newsList.length})
      } else {
        res.json({code: 201,msg:'数据查询失败'})
      }
  }
})

module.exports = router