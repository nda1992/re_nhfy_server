const jwt = require('jsonwebtoken')
const secret="nhfy@123"

//生成token
let createToken = function (data,exp) {
    let obj={}
    obj.data=data?data:null
    obj.type='jsonwebtoken'
    obj.ctime=new Date().getTime()
    exp=exp?exp:60*24*24
    let token=jwt.sign(obj,secret,{expiresIn:exp})
    return token
};

//验证token
let varifyToken=(token)=>{
    let info = jwt.verify(token,secret,(err,res)=>{
        let data={}
        if(err){
            data.code='606'
            data.msg='token验证失败'
            // data.obj=""
        }else {
            data.code='608'
            data.msg='token验证成功'
            data.obj=res
        }
        return data
    });
    return info
}

module.exports={createToken,varifyToken}