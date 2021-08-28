'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Positions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      positionName: {
        type: Sequelize.STRING
      },
      deptName: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      requireNum: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.INTEGER
      },
      userCode: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.STRING
      },
      degree: {
        type: Sequelize.STRING
      },
      english: {
        type: Sequelize.STRING
      },
      Handlestatus: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      desc: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Positions');
  }
};