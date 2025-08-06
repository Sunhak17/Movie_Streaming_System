'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'subscription_plan', {
      type: Sequelize.ENUM('Basic', 'Standard', 'Premium'),
      defaultValue: 'Basic',
      allowNull: false
    });

    await queryInterface.addColumn('users', 'subscription_expiry', {
      type: Sequelize.DATE,
      defaultValue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'subscription_plan');
    await queryInterface.removeColumn('users', 'subscription_expiry');
  }
};