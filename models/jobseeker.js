'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jobSeeker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  jobSeeker.init({
    openid: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    faceimgUrl: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    sex: DataTypes.INTEGER,
    age:DataTypes.INTEGER,
    birthday: DataTypes.DATE,
    nation: DataTypes.STRING,
    address: DataTypes.TEXT,
    degree: DataTypes.STRING,
    school: DataTypes.STRING,
    professional: DataTypes.STRING,
    role: DataTypes.STRING,
    loginNum: DataTypes.INTEGER,
    undergraduateTime: DataTypes.DATE,
    attachmentUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'jobSeeker',
    tableName: 'jobseekers'
  });
  return jobSeeker;
};