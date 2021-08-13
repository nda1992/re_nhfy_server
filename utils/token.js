const jwt = require('jsonwebtoken')
const secret="nhfy@123"

//生成token
let createToken = function () {
    return 'token'
};

//验证token
let varifyToken=(token)=>{
    return token==='token'
}

module.exports={createToken,varifyToken}
