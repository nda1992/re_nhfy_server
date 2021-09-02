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
    isPosted: {type: Sequelize.INTEGER}
    },{tableName:'post2positions'}
)
// 求职者和投递岗位的多对多关联
jobSeekerInstance.belongsToMany(positionInstance,{through:post2positionInstance})
positionInstance.belongsToMany(jobSeekerInstance,{through:post2positionInstance})

module.exports = {jobSeekerInstance,positionInstance,post2positionInstance}