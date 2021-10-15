const express = require('express')
const app = express()
const summaryRouter = require('./summary/index')
const deptRankRouter = require('./deptRank/index')
const componentPartRouter = require('./componentPart/index')
const basicRouter = require('./basic/index')
// 用于可视化的二级路由
app.use('/summary', summaryRouter)
app.use('/deptRank', deptRankRouter)
app.use('/componentPart', componentPartRouter)
app.use('/basic', basicRouter)
module.exports = app