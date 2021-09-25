const express = require('express')
const router = express.Router()
const { DataTypes, Op } = require('sequelize')
const sequelize = require('../../database/connection')
const Menu = require('../../models/menu')
// 获取所有menus
router.get('/getMenusList', async (req,res,next) => {
    let id = 1
    await Menu(sequelize,DataTypes).findAll().then((result) => {
        if (result) {
            // 保存临时的children menus
            let ctemp = []
            const parents = result.filter( c => c.parent === '无')
            const childrens = result.filter( c => c.parent !== '无')
            // 最终要返回的menus数组
            const items = parents.map(e => {
                let item_temp = []
                childrens.forEach( c => {
                    if (c.parent === e.name) {
                        ctemp.push({ name: c.name, index: c.index })
                    }
                })
                item_temp = { id: id, parent: {name: e.name, index: e.index} , children: ctemp }
                ctemp = []
                id++
                return item_temp
            })
            res.json({ code:200, items: items })
        } else {
            res.json({ code:201, msg: '获取数据失败' })
        }
    })
})


module.exports = router