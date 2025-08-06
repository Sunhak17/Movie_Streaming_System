import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Env-dependent config
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
if (!JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. JWT functionality will be degraded.');
}

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

// Register User
export const register = async (req, res) => {
  try {
    const { user_name, user_email, password } = req.body;

    // Validate required fields
    if (!user_name || !user_email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: user_name, user_email, password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { user_email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await User.create({
      user_name,
      user_email,
      password_hash
    });

    // Generate token
    const token = generateToken(newUser.user_id, newUser.role);

    // Build response user object
    const userResponse = {
      user_id: newUser.user_id,
      user_name: newUser.user_name,
      user_email: newUser.user_email,
      role: newUser.role,
      is_active: newUser.is_active,
      created_at: newUser.created_at
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { user_email, password } = req.body;

    // Validate required fields
    if (!user_email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { user_email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user.user_id, user.role);

    // Return user data without password
    const userResponse = {
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

// Get Current User (Protected Route)
export const getCurrentUser = async (req, res) => {
  try {
    console.log('🔍 getCurrentUser called');
    console.log('🔍 req.user:', req.user);
    const userId = req.user?.user_id || req.user?.userId; // Support both field names
    console.log('🔍 userId:', userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const user = await User.findByPk(userId);
    console.log('🔍 User from database:', user?.user_name, 'wallet:', user?.wallet);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user data without password
    const userResponse = {
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      role: user.role,
      is_active: user.is_active,
      wallet: user.wallet,
      subscription_plan: user.subscription_plan,
      subscription_expiry: user.subscription_expiry,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    res.status(200).json({
      success: true,
      data: {
        user: userResponse
      }
    });
    console.log('🔍 getCurrentUser response sent:', userResponse.user_name, 'wallet:', userResponse.wallet);

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Logout User (Optional - token blacklist can be implemented here)
export const logout = async (req, res) => {
  try {
    // If maintaining a token blacklist or refresh token store, revoke here.
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout'
    });
  }
};
