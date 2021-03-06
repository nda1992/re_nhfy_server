'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tableTitle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tableTitle.init({
    title: DataTypes.TEXT,
    desc: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'tableTitle',
    tableTitle: 'tabletitles'
  });
  return tableTitle;
};