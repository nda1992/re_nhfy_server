'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Depts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deptName: {
        type: Sequelize.STRING
      },
      deptCode: {
        type: Sequelize.STRING
      },
      deptAddr: {
        type: Sequelize.STRING
      },
      deleteBit: {
        type: Sequelize.INTEGER
      },
      deptLeader: {
        type: Sequelize.STRING
      },
      desc: {
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
    await queryInterface.dropTable('Depts');
  }
};