'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Redios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.TEXT
      },
      url: {
        type: Sequelize.STRING
      },
      deptName: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      clickNum: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Redios');
  }
};