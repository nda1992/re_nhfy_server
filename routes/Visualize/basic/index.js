const express = require('express')
const router = express.Router()
const { Oracleconnection } = require('../../../utils/oracleConnection')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Shanghai')
// 全院汇总主题的所有路由

router.get('/test', async (req, res, next) => {
    const today = moment()
    const temp = today.subtract(1, 'days').format('YYYY-MM-DD')
    res.json({yesterday:temp})
})

module.exports = router