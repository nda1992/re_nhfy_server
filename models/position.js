'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Position extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Position.init({
    positionName: DataTypes.STRING,
    deptName: DataTypes.STRING,
    address: DataTypes.STRING,
    requireNum: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    userCode: DataTypes.STRING,
    age: DataTypes.STRING,
    degree: DataTypes.STRING,
    english: DataTypes.STRING,
    professional: DataTypes.STRING,
    Handlestatus: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    desc: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Position',
  });
  return Position;
};