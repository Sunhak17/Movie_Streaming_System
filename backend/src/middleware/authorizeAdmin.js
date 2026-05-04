import jwt from 'jsonwebtoken';
import { User } from '../models/index.js'; // import your User model

// Verify JWT token and extract user ID
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { 
      userId: decoded.userId || decoded.user_id,
      user_id: decoded.userId || decoded.user_id, // Support both field names
      role: decoded.role 
    };
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

// Middleware to check if logged-in user is admin
export const authorizeAdmin = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.user_id; // Support both field names
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Fetch user from DB
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check role
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    // All good, continue
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
