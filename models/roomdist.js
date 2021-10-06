'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roomdist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Roomdist.init({
    floor: DataTypes.STRING,
    region: DataTypes.STRING,
    name: DataTypes.STRING,
    userCode: DataTypes.STRING,
    status: DataTypes.INTEGER,
    desc: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Roomdist',
    tableName: 'roomdists'
  });
  return Roomdist;
};