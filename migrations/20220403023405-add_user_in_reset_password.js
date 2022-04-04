'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'ResetPasswordTokens',
      'used',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('ResetPasswordTokens', 'used')
  }
};
