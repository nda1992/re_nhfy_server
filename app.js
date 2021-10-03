const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const hospitalRouter = require('./routes/hospital/hospital');
const reportRouter = require('./routes/report/report')
const newsRouter = require('./routes/news/news')
const recruitRouter = require('./routes/recruit/recruit')
const positionRouter = require('./routes/recruit/position')
const websiteRouter = require('./routes/website/website')
const getnewsRouter = require('./routes/website/getnews')
const reportmakeRouter = require('./routes/reportmake/reportmake')
const employeeRouter = require('./routes/hospital/employee')
    // const specialQueryRouter = require('./routes/reportmake/specialQuery')
    // 查询主题的相关路由
    // const revenueRouter = require('./routes/QueryTheam/revenue/revenue')
    // const operationRouter = require('./routes/QueryTheam/operation/operation')
    // const rankRouter = require('./routes/QueryTheam/rank/rank')
    // const othersRouter = require('./routes/QueryTheam/others/others')
    // const basicRouter = require('./routes/QueryTheam/basic/basic')
const app = express();

const { varifyToken } = require('./utils/token')
    // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//配置跨域
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type,token'); //添加uuid,token，设置自定义的请求头
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
//所有进来的请求都需要携带token
app.use((req, res, next) => {
    let url = req.url
        // 求职和官网的所有请求只匹配position/website开头
    const positionArr = ['/recruit/getPositionList', '/position/', '/users/searchDept', '/users/register', '/website']
    let trueUrl = -1
    for (let p of positionArr) {
        if (url.search(p) !== -1) {
            trueUrl = 0
            break
        }
    }
    let whileUrl = ['/users/login', '/position/jobSeekerRegister', '/users/updatePassword']
    if (whileUrl.indexOf(url) >= 0 || trueUrl !== -1) {
        return next()
    }
    let token = req.headers.token
    let result = varifyToken(token)
    if (!result) {
        res.json({ code: 201, msg: 'token验证失败' })
    } else {
        // req.resToken=result
        return next()
    }
})
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/hospital', hospitalRouter)
app.use('/report', reportRouter)
app.use('/news', newsRouter)
app.use('/recruit', recruitRouter)
app.use('/position', positionRouter)
app.use('/website', websiteRouter)
app.use('/website/news', getnewsRouter)
app.use('/reportmake', reportmakeRouter)
app.use('/employee', employeeRouter)
    // 主题查询的路由
    // app.use('/reportmake/specialQuery', specialQueryRouter)
    // app.use('/QueryTheam/operation', operationRouter)
    // app.use('/QueryTheam/revenue', revenueRouter)
    // app.use('/QueryTheam/rank', rankRouter)
    // app.use('/QueryTheam/others', othersRouter)
    // app.use('/QueryTheam/basic', basicRouter)
    // catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;