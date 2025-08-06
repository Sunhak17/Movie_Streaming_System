import sequelize from '../config/database.js';

// Create some sample genres
const createSampleGenres = async () => {
  try {
    // Check if genres table exists and has data
    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM genres');
    const genreCount = results[0].count;
    
    if (genreCount === 0) {
      console.log('Creating sample genres...');
      
      await sequelize.query(`
        INSERT INTO genres (genre_name, created_at, updated_at) VALUES 
        ('CDrama', NOW(), NOW()),
        ('KDrama', NOW(), NOW()),
        ('Hollywood', NOW(), NOW())
      `);
      
      console.log('Sample genres created successfully');
    } else {
      console.log(`${genreCount} genres already exist in the database`);
    }
    
    // Show all genres
    const [genres] = await sequelize.query('SELECT * FROM genres');
    console.log('Available genres:', genres);
    
  } catch (error) {
    console.error('Error creating genres:', error);
  }
};

export default createSampleGenres;
