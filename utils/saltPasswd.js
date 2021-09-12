const bcrypt = require('bcrypt');
const saltRounds = 10;
//密码加密
const saltPasswd = (recvPasswd) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds,(err,salt) => {
            bcrypt.hash(recvPasswd,salt,(err,hash) => {
                if(!err){
                    resolve(hash)
                }else{
                    reject(err)
                }
            })
        })
    })
};

//密码对比
const comparePasswd = (recvPasswd,hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(recvPasswd,hash,(err,result) => {
            if(!err){
                resolve(result)
            }else{
                reject(err)
            }
        })
    })
};
exports.saltPasswd = saltPasswd
exports.comparePasswd = comparePasswd