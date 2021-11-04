const express = require('express')
const router = express.Router()
const { BACKGROUND_MUSIC_DOWNLOAD } = require('../../config/network')
// 获取背景音乐
router.get('/getBackgroundMusic', async (req, res, next) => {
  res.json({ code:200, url: BACKGROUND_MUSIC_DOWNLOAD })
})

module.exports = router