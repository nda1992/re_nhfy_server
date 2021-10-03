'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class usuallyWebsite extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    usuallyWebsite.init({
        userCode: DataTypes.STRING,
        title: DataTypes.TEXT,
        url: DataTypes.STRING,
        deptName: DataTypes.STRING,
        img: DataTypes.STRING,
        status: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'usuallyWebsite',
        tableName: 'usuallywebsites'
    });
    return usuallyWebsite;
};