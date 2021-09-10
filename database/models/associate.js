const sequelize = require('../connection')
const { DataTypes,Sequelize } = require('sequelize')
const Position = require('../../models/position')
const jobSeeker = require('../../models/jobSeeker')

// jobSeeker实例对象
const jobSeekerInstance = jobSeeker(sequelize, DataTypes)

// Position实例对象
const positionInstance = Position(sequelize, DataTypes)

// post2position实例对象
const post2positionInstance = sequelize.define('post2position',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
        },
    status: {type: Sequelize.INTEGER},
    isPosted: {type: Sequelize.INTEGER},
    // 确认参加笔试和面试：1=参加，0=不参加
    confirm: {type: Sequelize.INTEGER},
    // 审核通过时间
    approveDate: {type: Sequelize.DATE}
    },{tableName:'post2positions'}
)

// get2Collect实例对象
const get2CollectInstance = sequelize.define('get2collect',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
        },
    status: {type: Sequelize.INTEGER}
    },{tableName:'get2collects'}
)

// 求职者和投递岗位的多对多关联
jobSeekerInstance.belongsToMany(positionInstance,{through:post2positionInstance})
positionInstance.belongsToMany(jobSeekerInstance,{through:post2positionInstance})


// 求职者和投递岗位的多对多关联
jobSeekerInstance.belongsToMany(positionInstance,{through:get2CollectInstance})
positionInstance.belongsToMany(jobSeekerInstance,{through:get2CollectInstance})


module.exports = { jobSeekerInstance, positionInstance, post2positionInstance, get2CollectInstance }