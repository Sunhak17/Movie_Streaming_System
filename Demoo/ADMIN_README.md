# Watch2Day Admin Dashboard

## Overview
The Watch2Day Admin Dashboard is a comprehensive administrative interface that allows admin users to manage movies, users, and view system statistics.

## Admin Credentials
- **Email**: admin@gmail.com
- **Password**: admin123

## Features

### 1. User Authentication
- **Role-based access**: Regular users see the normal interface, admin users are redirected to the admin dashboard
- **Secure authentication**: JWT tokens with role verification
- **Admin-only routes**: Protected routes that only admin users can access

### 2. Admin Dashboard Features

#### Overview Tab
- Total users count
- Active/Inactive users
- Admin users count
- New users in the last 30 days
- Subscription plan breakdown (Basic/Standard/Premium)

#### User Management
- View all users with search functionality
- User details: ID, Name, Email, Role, Status, Subscription, Wallet, Created date
- **User Actions**:
  - Activate/Deactivate users (except admin users)
  - Delete users (except admin users)
  - Search users by name or email
- **Admin Protection**: Admin users cannot be deleted or deactivated

#### Movie Management
- View all movies with search functionality
- Movie details: ID, Title, Description, Genre ID, Release Year, Rating, Created date
- **Movie Actions**:
  - Add new movies
  - Edit existing movies
  - Delete movies
  - Search movies by title

### 3. Security Features
- **Admin Route Protection**: `/admin` route is protected and only accessible to admin users
- **Middleware Protection**: All admin API endpoints require both authentication and admin role verification
- **Separation of Concerns**: Regular users cannot access admin functionality

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create admin user (if not already created):
   ```bash
   node create_admin.js
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   Server will run on http://localhost:3000

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd movie-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## Usage

### For Regular Users
1. Go to http://localhost:5173
2. Login with regular user credentials
3. Access normal movie browsing interface

### For Admin Users
1. Go to http://localhost:5173
2. Login with admin credentials (admin@gmail.com / admin123)
3. You'll be automatically redirected to the admin dashboard at `/admin`
4. Alternatively, click the "Admin Panel" button in the header (only visible to admin users)

## API Endpoints

### Admin Routes (Protected)
All admin routes require authentication token and admin role:

#### User Management
- `GET /api/admin/users` - Get all users (with search)
- `GET /api/admin/users/stats` - Get user statistics
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/toggle-status` - Toggle user status

#### Movie Management
- `GET /api/admin/movies` - Get all movies (with search)
- `POST /api/admin/movies` - Add new movie
- `PUT /api/admin/movies/:id` - Update movie
- `DELETE /api/admin/movies/:id` - Delete movie

## Database Models

### User Model
- `user_id` (Primary Key)
- `user_name`
- `user_email`
- `password_hash`
- `role` (enum: 'user', 'admin')
- `is_active` (boolean)
- `wallet` (float)
- `subscription_plan` (enum: 'Basic', 'Standard', 'Premium')
- `subscription_expiry` (date)
- `created_at` / `updated_at`

### Movie Model
- `movie_id` (Primary Key)
- `title`
- `description`
- `genre_id`
- `release_year`
- `rating`
- `created_at` / `updated_at`

## Technologies Used

### Backend
- Node.js with Express
- Sequelize ORM
- PostgreSQL/MySQL database
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React with Vite
- React Router for routing
- CSS3 for styling
- Context API for state management

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── admin.controller.js     # Admin business logic
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT authentication
│   │   └── authorizeAdmin.js       # Admin role verification
│   ├── routes/
│   │   └── admin.route.js          # Admin API routes
│   └── models/
│       ├── User.js                 # User database model
│       └── Movie.js                # Movie database model
└── create_admin.js                 # Admin user creation script

movie-website/
├── src/
│   ├── pages/
│   │   └── AdminDashboard.jsx      # Main admin interface
│   ├── components/
│   │   ├── AdminRoute.jsx          # Admin route protection
│   │   ├── AuthContext.jsx         # Authentication context
│   │   └── Header.jsx              # Navigation with admin link
│   └── styles/
│       └── AdminDashboard.css      # Admin dashboard styling
```

## Additional Notes

- The admin dashboard is fully responsive and works on desktop and mobile devices
- All admin actions include confirmation dialogs for destructive operations
- The interface uses a dark theme with green accents to match the main website
- Real-time updates when performing CRUD operations
- Error handling with user-friendly messages
- Loading states for better user experience

## Troubleshooting

### Common Issues
1. **Admin user not created**: Run `node create_admin.js` in the backend directory
2. **Authorization errors**: Ensure the JWT token is valid and the user has admin role
3. **Database connection**: Check database configuration in the backend
4. **CORS issues**: Verify frontend and backend URLs match the CORS configuration

### Development Tips
- Use browser dev tools to inspect API calls
- Check backend console for detailed error logs
- Admin actions are logged for debugging purposes
