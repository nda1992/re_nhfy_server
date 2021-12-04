'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  News.init({
    title: DataTypes.TEXT,
    content: DataTypes.TEXT,
    userName: DataTypes.STRING,
    deptName: DataTypes.STRING,
    createTime: DataTypes.DATE,
    category: DataTypes.STRING,
    status: DataTypes.STRING,
    newsStatus: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    clickNum: DataTypes.INTEGER,
    plateform: DataTypes.INTEGER,
    loginuserCode: DataTypes.STRING,
    url: DataTypes.STRING // 保存文章封面图片的URL地址，上传的第一张图片为新闻封面
  }, {
    sequelize,
    modelName: 'News',
    tableName: 'news'
  });
  return News;
};