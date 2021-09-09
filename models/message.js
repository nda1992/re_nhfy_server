'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Message.init({
    send_id: DataTypes.INTEGER,
    receive_id: DataTypes.INTEGER,
    send_date: DataTypes.DATE,
    read_date: DataTypes.DATE,
    is_read: DataTypes.INTEGER,
    remove_receive_id: DataTypes.INTEGER,
    remove_send_id: DataTypes.INTEGER,
    replycontent: DataTypes.TEXT,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};