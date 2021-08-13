const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const {connection} = require('../utils/mysqlConnection');

router.get('/basic',(req,res,next)=>{
    sql="SELECT * FROM ?? WHERE ??=?"
    const inserts=['basic','统计时间','2021-05-20']
    sql=mysql.format(sql,inserts)
    connection.query(sql,(err,result)=>{
        res.json({code:200,msg:result})
    })
})

module.exports = router;
