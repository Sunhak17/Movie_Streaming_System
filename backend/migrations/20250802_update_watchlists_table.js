export const up = async (queryInterface, Sequelize) => {
  try {
    // Check if watchlists table exists
    const tableExists = await queryInterface.showAllTables().then(tables => 
      tables.includes('watchlists')
    );

    if (tableExists) {
      // Drop and recreate table with new structure
      await queryInterface.dropTable('watchlists');
    }

    // Create watchlists table with new structure
    await queryInterface.createTable('watchlists', {
      watchlist_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      movie_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Allow null for local movies
        references: {
          model: 'movies',
          key: 'movie_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      local_movie_data: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      date_added: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    console.log('✅ Watchlists table created/updated successfully');
  } catch (error) {
    console.error('❌ Error creating watchlists table:', error);
    throw error;
  }
};

export const down = async (queryInterface, Sequelize) => {
  try {
    await queryInterface.dropTable('watchlists');
    console.log('✅ Watchlists table dropped successfully');
  } catch (error) {
    console.error('❌ Error dropping watchlists table:', error);
    throw error;
  }
};
