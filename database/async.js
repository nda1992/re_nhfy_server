const sequelize = require('./connection');
const { Sequelize,DataTypes} = require('sequelize');
require('./models/collectAssociate');

// 测试连接
sequelize.authenticate().then(() => {
    console.log('ok')
}).catch(() => {
    console.log('err')
})


sequelize.sync({
    force:true
}).then(()=>{
    console.log('sync success...');
    process.exit()
});