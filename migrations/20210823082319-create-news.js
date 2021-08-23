'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('News', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.TEXT
      },
      content: {
        type: Sequelize.TEXT
      },
      userName: {
        type: Sequelize.STRING
      },
      deptName: {
        type: Sequelize.STRING
      },
      createTime: {
        type: Sequelize.DATE
      },
      category: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      newsStatus: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.INTEGER
      },
      clickNum: {
        type: Sequelize.INTEGER
      },
      plateform: {
        type: Sequelize.INTEGER
      },
      loginuserCode: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('News');
  }
};