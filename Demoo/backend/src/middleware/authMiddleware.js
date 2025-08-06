import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Auth header:', authHeader); // Debug log
  console.log('Extracted token:', token); // Debug log

  if (!token) {
    console.log('No token provided'); // Debug log
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token payload:', decoded); // Debug log
    
    // FIXED: Make sure this matches your JWT payload structure and provide both field names
    req.user = { 
      userId: decoded.userId || decoded.user_id,
      user_id: decoded.userId || decoded.user_id,
      role: decoded.role
    }; 
    console.log('req.user set to:', req.user); // Debug log
    
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message); // Debug log
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};