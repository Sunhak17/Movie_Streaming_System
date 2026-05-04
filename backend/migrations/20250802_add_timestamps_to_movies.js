import { DataTypes } from 'sequelize';

const migration = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add created_at and updated_at columns to movies table
      await queryInterface.addColumn('movies', 'created_at', {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
      
      await queryInterface.addColumn('movies', 'updated_at', {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      });
      
      console.log('✅ Added timestamp columns to movies table');
    } catch (error) {
      console.log('Note: Timestamp columns may already exist:', error.message);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('movies', 'created_at');
    await queryInterface.removeColumn('movies', 'updated_at');
  }
};

export default migration;
