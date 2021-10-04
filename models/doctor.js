'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Doctor.init({
        userCode: DataTypes.STRING,
        username: DataTypes.STRING,
        age: DataTypes.INTEGER,
        jobTitle: DataTypes.STRING,
        education: DataTypes.STRING,
        school: DataTypes.STRING,
        deptName: DataTypes.STRING,
        topDept: DataTypes.STRING,
        phone: DataTypes.STRING,
        email: DataTypes.STRING,
        avatar: DataTypes.STRING,
        desc: DataTypes.TEXT,
        status: DataTypes.INTEGER,
        grade: DataTypes.INTEGER,
        currentStatus: DataTypes.STRING,
        professional: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Doctor',
        tableName: 'doctors'
    });
    return Doctor;
};