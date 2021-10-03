'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Redio extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Redio.init({
        title: DataTypes.TEXT,
        url: DataTypes.STRING,
        deptName: DataTypes.STRING,
        userCode: DataTypes.STRING,
        category: DataTypes.STRING,
        status: DataTypes.INTEGER,
        clickNum: DataTypes.INTEGER,
        cover: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Video',
        tableName: 'videos'
    });
    return Redio;
};