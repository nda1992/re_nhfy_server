'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dept extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Dept.init({
    deptName: DataTypes.STRING,
    deptCode: DataTypes.STRING,
    deptAddr: DataTypes.STRING,
    deleteBit: DataTypes.INTEGER,
    deptLeader: DataTypes.STRING,
    desc: DataTypes.STRING,
    level: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Dept',
    tableName: 'depts'
  });
  return Dept;
};