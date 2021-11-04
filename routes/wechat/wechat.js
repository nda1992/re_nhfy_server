const express = require('express')
const router = express.Router()

router.post('/test', async (req, res, next) => {
    res.json({code:200})
})

module.exports = router