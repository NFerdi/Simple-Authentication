'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Users',
      'avatar',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'avatar')
  }
};
