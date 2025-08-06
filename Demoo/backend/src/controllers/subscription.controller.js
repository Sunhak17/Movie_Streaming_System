import { User } from '../models/index.js';

// Define plan hierarchy with their tier levels and durations
const PLAN_HIERARCHY = {
  'Basic': { tier: 1, price: 9.99, duration: 30 }, // 30 days
  'Standard': { tier: 2, price: 14.99, duration: 30 }, // 30 days  
  'Premium': { tier: 3, price: 19.99, duration: 365 } // 365 days (1 year)
};

export const updatePlan = async (req, res) => {
  try {
    const { plan, price } = req.body;
    const userId = req.user.userId;

    console.log('Backend: Update plan request for user:', userId, 'plan:', plan, 'price:', price); // Debug log

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Validate the new plan exists
    if (!PLAN_HIERARCHY[plan]) {
      return res.status(400).json({ success: false, message: 'Invalid subscription plan' });
    }

    // Get current plan (handle users with no subscription)
    const currentPlan = user.subscription_plan;
    
    // If user has no subscription, allow any plan purchase
    if (!currentPlan) {
      console.log('New user purchasing first subscription plan:', plan);
      // Skip tier validation for first-time purchase
    } else {
      // Check if current subscription is expired
      const currentDate = new Date();
      const expiryDate = new Date(user.subscription_expiry);
      const isExpired = currentDate > expiryDate;

      if (isExpired) {
        console.log('Expired subscription - allowing any plan change from', currentPlan, 'to', plan);
        // Allow any plan change for expired subscriptions
      } else {
        // Active subscription - enforce upgrade-only logic
        const currentTier = PLAN_HIERARCHY[currentPlan].tier;
        const newTier = PLAN_HIERARCHY[plan].tier;

        // Check if user is trying to downgrade
        if (newTier < currentTier) {
          return res.status(400).json({ 
            success: false, 
            message: `Cannot downgrade from ${currentPlan} to ${plan} while your subscription is active. You can only upgrade to higher plans or wait until your subscription expires.`,
            currentPlan: currentPlan,
            requestedPlan: plan,
            expiryDate: user.subscription_expiry
          });
        }

        // If user is trying to select the same plan
        if (newTier === currentTier) {
          return res.status(400).json({ 
            success: false, 
            message: `You are already subscribed to the ${currentPlan} plan.`,
            currentPlan: currentPlan
          });
        }
      }
    }

    // Validate price matches the plan
    if (price !== PLAN_HIERARCHY[plan].price) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid price for ${plan} plan. Expected: $${PLAN_HIERARCHY[plan].price}` 
      });
    }

    // Check wallet balance
    if (user.wallet < price) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    const oldWallet = user.wallet;
    const newWallet = oldWallet - price;

    // Calculate subscription expiry based on plan duration
    const planDuration = PLAN_HIERARCHY[plan].duration; // days
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + planDuration * 24 * 60 * 60 * 1000);

    // Update wallet and subscription
    const updatedUser = await user.update({
      wallet: newWallet,
      subscription_plan: plan,
      subscription_expiry: expiryDate
    });

    console.log('Backend: Plan updated. Old wallet:', oldWallet, 'New wallet:', newWallet); // Debug log

    return res.json({
      success: true,
      message: 'Plan updated successfully',
      wallet: updatedUser.wallet,
      user: {
        user_id: updatedUser.user_id,
        user_name: updatedUser.user_name,
        user_email: updatedUser.user_email,
        wallet: updatedUser.wallet,
        subscription_plan: updatedUser.subscription_plan,
        subscription_expiry: updatedUser.subscription_expiry
      }
    });
  } catch (error) {
    console.error('Backend: Update plan error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update plan' });
  }
};

// Get all subscription plans with upgrade availability
export const getPlans = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentPlan = user.subscription_plan;
    
    // Generate plans list with availability based on subscription status
    const plans = Object.entries(PLAN_HIERARCHY).map(([planName, planData]) => {
      if (!currentPlan) {
        // No subscription - all plans available for purchase
        return {
          name: planName,
          price: planData.price,
          tier: planData.tier,
          duration: planData.duration,
          isCurrentPlan: false,
          canUpgrade: true,
          canDowngrade: false,
          status: 'available'
        };
      } else {
        // Check if current subscription is expired
        const currentDate = new Date();
        const expiryDate = new Date(user.subscription_expiry);
        const isExpired = currentDate > expiryDate;

        if (isExpired) {
          // Expired subscription - all plans available for purchase/change
          return {
            name: planName,
            price: planData.price,
            tier: planData.tier,
            duration: planData.duration,
            isCurrentPlan: false, // Expired plans are not considered current
            canUpgrade: true,
            canDowngrade: true,
            status: 'available'
          };
        } else {
          // Active subscription - apply upgrade-only logic
          const currentTier = PLAN_HIERARCHY[currentPlan].tier;
          return {
            name: planName,
            price: planData.price,
            tier: planData.tier,
            duration: planData.duration,
            isCurrentPlan: planName === currentPlan,
            canUpgrade: planData.tier > currentTier,
            canDowngrade: planData.tier < currentTier,
            status: planData.tier > currentTier ? 'available' : 
                    planData.tier === currentTier ? 'current' : 'restricted'
          };
        }
      }
    });

    return res.json({
      success: true,
      currentPlan: currentPlan || null,
      hasSubscription: !!currentPlan,
      plans,
      message: currentPlan ? 'Plans retrieved successfully' : 'No active subscription - all plans available for purchase'
    });
  } catch (error) {
    console.error('Backend: Get plans error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve plans' });
  }
};

// Get current subscription details
export const getSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentPlan = user.subscription_plan;

    if (!currentPlan) {
      return res.json({
        success: true,
        subscription: null,
        hasSubscription: false,
        message: 'No active subscription. Please purchase a plan.'
      });
    }

    const planData = PLAN_HIERARCHY[currentPlan];

    return res.json({
      success: true,
      subscription: {
        plan: currentPlan,
        tier: planData.tier,
        price: planData.price,
        duration: planData.duration,
        expiry: user.subscription_expiry,
        isActive: user.subscription_expiry ? new Date(user.subscription_expiry) > new Date() : false
      },
      hasSubscription: true
    });
  } catch (error) {
    console.error('Backend: Get subscription error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve subscription' });
  }
};

// FIXED: Both function names for compatibility
export const topUpWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.userId;

    console.log('Backend: Top-up request for user:', userId, 'amount:', amount); // Debug log

    // Validate amount
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      console.log('Backend: Invalid amount:', amount); // Debug log
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      console.log('Backend: User not found:', userId); // Debug log
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const oldWallet = parseFloat(user.wallet) || 0;
    const addAmount = parseFloat(amount);
    const newWallet = oldWallet + addAmount;

    console.log('Backend: Wallet calculation - Old:', oldWallet, 'Add:', addAmount, 'New:', newWallet); // Debug log

    // Update wallet
    const updatedUser = await user.update({
      wallet: newWallet
    });

    console.log('Backend: Wallet updated successfully. Final balance:', updatedUser.wallet); // Debug log

    return res.json({
      success: true,
      message: 'Wallet topped up successfully',
      wallet: updatedUser.wallet,
      oldBalance: oldWallet,
      addedAmount: addAmount,
      user: {
        user_id: updatedUser.user_id,
        user_name: updatedUser.user_name,
        user_email: updatedUser.user_email,
        wallet: updatedUser.wallet,
        subscription_plan: updatedUser.subscription_plan,
        subscription_expiry: updatedUser.subscription_expiry
      }
    });
  } catch (error) {
    console.error('Backend: Top up error:', error);
    return res.status(500).json({ success: false, message: 'Failed to top up wallet' });
  }
};

// ADDED: Alternative export name for compatibility
export const topUpBalance = topUpWallet;