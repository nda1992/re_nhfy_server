'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('jobSeekers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      openid: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      faceimgUrl: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      sex: {
        type: Sequelize.INTEGER
      },
      birthday: {
        type: Sequelize.DATE
      },
      nation: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      degree: {
        type: Sequelize.STRING
      },
      school: {
        type: Sequelize.STRING
      },
      professional: {
        type: Sequelize.STRING
      },
      undergraduateTime: {
        type: Sequelize.DATE
      },
      attachmentUrl: {
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
    await queryInterface.dropTable('jobSeekers');
  }
};