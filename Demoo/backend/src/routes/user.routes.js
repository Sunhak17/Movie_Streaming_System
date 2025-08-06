import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { updatePlan, topUpWallet, topUpBalance, getPlans, getSubscription } from '../controllers/subscription.controller.js';

const router = express.Router();

// Profile management routes
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const user = await User.findByPk(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        role: user.role,
        wallet: user.wallet,
        subscription_plan: user.subscription_plan,
        subscription_expiry: user.subscription_expiry,
        is_active: user.is_active,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const User = (await import('../models/User.js')).default;
    
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.user_email) {
      const existingUser = await User.findOne({ where: { user_email: email } });
      if (existingUser && existingUser.user_id !== user.user_id) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }

    const updatedUser = await user.update({
      user_name: name || user.user_name,
      user_email: email || user.user_email
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        user_id: updatedUser.user_id,
        user_name: updatedUser.user_name,
        user_email: updatedUser.user_email,
        role: updatedUser.role,
        wallet: updatedUser.wallet,
        subscription_plan: updatedUser.subscription_plan,
        subscription_expiry: updatedUser.subscription_expiry
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Password management route
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const bcrypt = (await import('bcryptjs')).default;
    const User = (await import('../models/User.js')).default;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password and new password are required' 
      });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await user.update({ password_hash: hashedNewPassword });

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// WALLET & SUBSCRIPTION ROUTES

// Top-up wallet routes (both names for compatibility)
router.post('/top-up', authenticateToken, topUpBalance);
router.post('/top-up-wallet', authenticateToken, topUpWallet);

// Subscription management route
router.put('/update-plan', authenticateToken, updatePlan);

// Get all available plans with upgrade status
router.get('/plans', authenticateToken, getPlans);

// Get subscription details (use the new controller function)
router.get('/subscription', authenticateToken, getSubscription);

// Get wallet balance
router.get('/wallet', authenticateToken, async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const user = await User.findByPk(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      wallet: {
        balance: user.wallet,
        currency: 'USD'
      }
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;