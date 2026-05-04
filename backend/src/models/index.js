import Movie from './Movie.js';
import Genre from './Genre.js';
import User from './User.js';
import Watchlist from './Watchlist.js';
import Profile from './Profile.js';
import Video from './Video.js';

// Define all associations here to avoid circular imports
// Genre-Movie associations
Movie.belongsTo(Genre, { foreignKey: 'genre_id' });
Genre.hasMany(Movie, { foreignKey: 'genre_id' });

// Genre-Video associations
Video.belongsTo(Genre, { foreignKey: 'genre_id' });
Genre.hasMany(Video, { foreignKey: 'genre_id' });

// User-Profile associations
User.hasMany(Profile, { foreignKey: 'user_id' });
Profile.belongsTo(User, { foreignKey: 'user_id' });

// Profile-Watchlist associations
Profile.hasMany(Watchlist, { foreignKey: 'profile_id' });
Watchlist.belongsTo(Profile, { foreignKey: 'profile_id' });

// Video-Watchlist associations
Video.hasMany(Watchlist, { foreignKey: 'video_id' });
Watchlist.belongsTo(Video, { foreignKey: 'video_id' });

export { Movie, Genre, User, Watchlist, Profile, Video };
