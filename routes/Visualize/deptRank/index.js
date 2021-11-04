const express = require('express')
const router = express.Router()

// 用于可视化的所有路由

router.get('/new_his', async (req, res, next) => {
    res.json({code:200,msg:'success'})
})


module.exports = router