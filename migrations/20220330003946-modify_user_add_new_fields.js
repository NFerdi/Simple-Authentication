'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Users',
      'isActive',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: "https://res.cloudinary.com/dqpaj8ioy/image/upload/v1649040378/User%20Avatar/fittuagisosfrr_a6v4vc.png"
      }
    )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'isActive')
  }
};
