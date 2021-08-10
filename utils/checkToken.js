const {varifyToken} = require('./token')
module.exports=(req,res,next)=>{
    let url = req.url
    let whileUrl=['/users/login','/users/register']
    if(whileUrl.indexOf(url)>=0){
    return next()
    }
    let token = req.headers.authorization
    let result = varifyToken(token)
    if(result===606){
        res.json(result)
    }else{
        req.resToken=result
        return next()
    }
}
