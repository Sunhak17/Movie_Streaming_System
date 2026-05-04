import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import apiService from '../../components/apiService';
import '../../styles/subscription/Subscription.css';
import logo from '../../assets/Logo.png';

const Subscription = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // ADDED: Local subscription state to track changes
  const [subscriptionData, setSubscriptionData] = useState({
    plan: null,
    expiry: 'N/A',
    price: 0,
    hasSubscription: false
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      const refreshUserData = async () => {
        console.log('Subscription page mounted - refreshing user data...');
        if (typeof refreshUser === 'function') {
          await refreshUser();
        }
        await fetchWalletBalance();
        await fetchSubscriptionData();
      };
      
      refreshUserData();
      setWalletBalance(user?.wallet || 0);
      updateSubscriptionFromUser(user);
    }
  }, [user, navigate, refreshUser]);

  // ADDED: Update subscription data from user object
  const updateSubscriptionFromUser = (userData) => {
    if (userData) {
      const hasSubscription = !!userData.subscription_plan;
      const newSubscriptionData = {
        plan: userData.subscription_plan || null,
        expiry: userData.subscription_expiry ? 
          new Date(userData.subscription_expiry).toLocaleDateString() : 'N/A',
        price: hasSubscription ? getSubscriptionPrice(userData.subscription_plan) : 0,
        hasSubscription: hasSubscription
      };
      
      console.log('Updating subscription data from user:', newSubscriptionData);
      setSubscriptionData(newSubscriptionData);
    }
  };

  // ADDED: Fetch fresh subscription data from API
  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/user/subscription`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('Fresh subscription data:', data);
      
      if (data.success) {
        if (data.subscription) {
          // User has subscription
          const newSubscriptionData = {
            plan: data.subscription.plan,
            expiry: data.subscription.expiry ? 
              new Date(data.subscription.expiry).toLocaleDateString() : 'N/A',
            price: getSubscriptionPrice(data.subscription.plan),
            hasSubscription: true
          };
          setSubscriptionData(newSubscriptionData);
        } else {
          // User has no subscription
          const newSubscriptionData = {
            plan: null,
            expiry: 'N/A',
            price: 0,
            hasSubscription: false
          };
          setSubscriptionData(newSubscriptionData);
        }
        console.log('Updated subscription data:', subscriptionData);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/user/wallet`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('Fresh wallet data in Subscription:', data);
      
      if (data.success && data.wallet) {
        setWalletBalance(data.wallet.balance);
        console.log('Updated subscription wallet balance to:', data.wallet.balance);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  // Update local data when user changes
  useEffect(() => {
    if (user?.wallet !== undefined) {
      setWalletBalance(user.wallet);
      console.log('Wallet balance updated from user context:', user.wallet);
    }
    
    // Update subscription when user changes
    updateSubscriptionFromUser(user);
  }, [user?.wallet, user?.subscription_plan, user?.subscription_expiry]);

  // Auto-refresh when page gains focus
  useEffect(() => {
    const handleFocus = async () => {
      console.log('Page gained focus - refreshing data...');
      if (typeof refreshUser === 'function') {
        await refreshUser();
      }
      await fetchWalletBalance();
      await fetchSubscriptionData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshUser]);

  function getSubscriptionPrice(plan) {
    const prices = { Basic: 9.99, Standard: 14.99, Premium: 19.99 };
    return prices[plan] || 9.99;
  }

  // Helper function to get plan duration
  function getPlanDuration(plan) {
    const durations = { Basic: 30, Standard: 30, Premium: 365 };
    return durations[plan] || 30;
  }

  // Helper function to get plan tier for upgrade/downgrade logic
  function getPlanTier(plan) {
    const tiers = { Basic: 1, Standard: 2, Premium: 3 };
    return tiers[plan] || 1;
  }

  // Helper function to check if subscription is expired
  function isSubscriptionExpired(expiryDateString) {
    if (!expiryDateString || expiryDateString === 'N/A') return false;
    const currentDate = new Date();
    const expiryDate = new Date(expiryDateString);
    return currentDate > expiryDate;
  }

  const plans = [
    {
      name: 'Basic',
      price: 9.99,
      duration: 30, // days
      features: ['HD Quality', 'Limited Content', '1 Device'],
      color: '#007bff'
    },
    {
      name: 'Standard',
      price: 14.99,
      duration: 30, // days
      features: ['Full HD Quality', 'Standard Content', '2 Devices'],
      color: '#28a745'
    },
    {
      name: 'Premium',
      price: 19.99,
      duration: 365, // days (1 year)
      features: ['4K Quality', 'All Content', 'Unlimited Devices'],
      color: '#ffc107'
    }
  ];

  const handleRenew = async () => {
    if (walletBalance < subscriptionData.price) {
      setMessage('Insufficient wallet balance. Please top up your wallet first.');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      console.log('Extending current plan:', subscriptionData.plan, 'price:', subscriptionData.price);
      
      const result = await apiService.renewPlan({
        plan: subscriptionData.plan,
        price: subscriptionData.price
      });
      
      console.log('Plan extension result:', result);
      
      if (result.success) {
        setMessage(`${subscriptionData.plan} plan extended successfully! Your subscription has been renewed.`);
        
        // Update local wallet balance
        if (result.wallet !== undefined) {
          setWalletBalance(result.wallet);
        } else if (result.user?.wallet !== undefined) {
          setWalletBalance(result.user.wallet);
        }
        
        // Update subscription data if returned
        if (result.user) {
          updateSubscriptionFromUser(result.user);
        }
        
        // Fetch fresh data after successful operation
        setTimeout(async () => {
          await fetchSubscriptionData();
          await fetchWalletBalance();
          if (typeof refreshUser === 'function') {
            await refreshUser();
          }
        }, 500);
        
        setRefreshKey(prev => prev + 1);
      } else {
        setMessage(result.message || 'Failed to renew plan.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
      console.error('Renew error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (plan) => {
    // For users without subscription, allow any plan purchase
    if (!subscriptionData.hasSubscription) {
      if (walletBalance < plan.price) {
        setMessage('Insufficient wallet balance. Please top up your wallet first.');
        return;
      }
    } else {
      // Check if subscription is expired
      const expired = isSubscriptionExpired(subscriptionData.expiry);
      
      if (expired) {
        // Expired subscription - allow any plan change
        console.log('Subscription expired - allowing plan change to:', plan.name);
        if (walletBalance < plan.price) {
          setMessage('Insufficient wallet balance. Please top up your wallet first.');
          return;
        }
      } else {
        // Active subscription - apply upgrade-only logic
        // Check if trying to select current plan
        if (plan.name === subscriptionData.plan) {
          setMessage('You are already on this plan.');
          return;
        }

        // Check if trying to downgrade (prevent downgrade for active subscriptions)
        const currentPlanTier = getPlanTier(subscriptionData.plan);
        const newPlanTier = getPlanTier(plan.name);
        
        if (newPlanTier < currentPlanTier) {
          setMessage(`Cannot downgrade from ${subscriptionData.plan} to ${plan.name} while your subscription is active. You can only upgrade to higher plans or wait until your subscription expires.`);
          return;
        }

        if (walletBalance < plan.price) {
          setMessage('Insufficient wallet balance. Please top up your wallet first.');
          return;
        }
      }
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      console.log('Upgrading to plan:', plan.name, 'price:', plan.price);
      
      const result = await apiService.renewPlan({
        plan: plan.name,
        price: plan.price
      });
      
      console.log('Upgrade result:', result);
      
      if (result.success) {
        setMessage(`Successfully upgraded to ${plan.name}!`);
        
        // Update local wallet balance immediately
        if (result.wallet !== undefined) {
          setWalletBalance(result.wallet);
        } else if (result.user?.wallet !== undefined) {
          setWalletBalance(result.user.wallet);
        }
        
        // Update subscription data immediately
        const newSubscriptionData = {
          plan: plan.name,
          expiry: result.user?.subscription_expiry ? 
            new Date(result.user.subscription_expiry).toLocaleDateString() : 
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          price: plan.price
        };
        
        console.log('Setting new subscription data:', newSubscriptionData);
        setSubscriptionData(newSubscriptionData);
        
        // Update user context if returned
        if (result.user) {
          updateSubscriptionFromUser(result.user);
        }
        
        // Fetch fresh data to ensure everything is in sync
        setTimeout(async () => {
          await fetchSubscriptionData();
          await fetchWalletBalance();
          if (typeof refreshUser === 'function') {
            await refreshUser();
          }
        }, 500);
        
        setRefreshKey(prev => prev + 1);
      } else {
        setMessage(result.message || 'Failed to upgrade plan.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
      console.error('Upgrade error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopUp = () => {
    navigate('/profile');
  };

  const handleBackToHome = () => {
    console.log('Navigating back to home...');
    // Navigate to a specific home route instead of root
    navigate('/home', { replace: true });
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="subscription-container" key={refreshKey}>
      <header className="subscription-header">
        <img 
          src={logo} 
          alt="Watch2Day Logo" 
          className="logo" 
          onClick={handleBackToHome}
          style={{ cursor: 'pointer' }}
        />
        <div className="header-actions">
          <span className="user-greeting">Hello, {user.user_name}!</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="subscription-content">
        <div className="subscription-info">
          <h2>Current Subscription</h2>
          <div className="current-plan">
            <h3>{subscriptionData.plan} Plan</h3>
            <p>Expires: {subscriptionData.expiry}</p>
            <p>Duration: {getPlanDuration(subscriptionData.plan) === 365 ? '1 Year (365 days)' : '1 Month (30 days)'}</p>
            <p>Renewal Price: ${subscriptionData.price}</p>
            <div className="wallet-info">
              <p>Current Balance: <strong>${walletBalance.toFixed(2)}</strong></p>
              <button onClick={handleTopUp} className="top-up-btn">
                Top Up Wallet
              </button>
            </div>
          </div>
          
          <div className="renewal-section">
            <button 
              onClick={handleRenew} 
              className="renew-btn"
              disabled={isLoading || walletBalance < subscriptionData.price}
            >
              {isLoading ? 'Processing...' : `Extend ${subscriptionData.plan} Plan ($${subscriptionData.price})`}
            </button>
            
            {/* Show upgrade option during renewal if not on Premium */}
            {subscriptionData.plan !== 'Premium' && (
              <div className="renewal-upgrade-hint">
                <p>💡 Want more features? Consider upgrading while renewing!</p>
                <p>Check the plans below for upgrade options.</p>
              </div>
            )}
          </div>
        </div>

        <div className="plans-section">
          <h2>{!subscriptionData.hasSubscription ? 'Choose Your Plan' : 
               isSubscriptionExpired(subscriptionData.expiry) ? 'Renew or Switch Plans' : 
               'Upgrade Options'}</h2>
          <p className="upgrade-description">
            {!subscriptionData.hasSubscription 
              ? 'Select a subscription plan to start watching premium content.'
              : isSubscriptionExpired(subscriptionData.expiry)
                ? 'Your subscription has expired. You can now choose any plan or renew your current one.'
              : subscriptionData.plan === 'Premium' 
                ? 'You are already on our highest tier plan! Enjoy all premium features.'
                : 'Upgrade to unlock more features and better streaming quality.'
            }
          </p>
          <div className="plans-grid">
            {plans.map((plan) => {
              const currentPlanTier = subscriptionData.hasSubscription ? getPlanTier(subscriptionData.plan) : 0;
              const planTier = getPlanTier(plan.name);
              const expired = subscriptionData.hasSubscription ? isSubscriptionExpired(subscriptionData.expiry) : false;
              
              // If subscription is expired, treat as if no subscription for upgrade/downgrade logic
              const isCurrentPlan = subscriptionData.hasSubscription && !expired && plan.name === subscriptionData.plan;
              const isDowngrade = subscriptionData.hasSubscription && !expired && planTier < currentPlanTier;
              const canAfford = walletBalance >= plan.price;
              
              return (
                <div key={plan.name} className={`plan-card ${isCurrentPlan ? 'current' : ''} ${isDowngrade ? 'downgrade-restricted' : ''}`}>
                  <div className="plan-header" style={{ backgroundColor: plan.color }}>
                    <h3>{plan.name}</h3>
                    <div className="plan-price">
                      ${plan.price}/{plan.duration === 365 ? 'year' : 'month'}
                    </div>
                    <div className="plan-duration">
                      {plan.duration === 365 ? '365 days' : '30 days'}
                    </div>
                    {isCurrentPlan && (
                      <div className="current-badge">CURRENT PLAN</div>
                    )}
                    {isDowngrade && !isCurrentPlan && (
                      <div className="restricted-badge">DOWNGRADE NOT ALLOWED (WHILE ACTIVE)</div>
                    )}
                  </div>
                  <div className="plan-features">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="feature">✓ {feature}</div>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleUpgrade(plan)}
                    className={`plan-btn ${isCurrentPlan ? 'current-plan' : ''} ${isDowngrade ? 'restricted' : ''}`}
                    disabled={isLoading || isCurrentPlan || isDowngrade || !canAfford}
                  >
                    {isLoading ? 'Processing...' : 
                     isCurrentPlan ? 'Current Plan' : 
                     isDowngrade ? 'Cannot Downgrade (while active)' :
                     !canAfford ? 'Insufficient Balance' : 
                     !subscriptionData.hasSubscription ? `Purchase ${plan.name}` :
                     expired ? `Switch to ${plan.name}` :
                     `Upgrade to ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {message && (
          <div className={`message ${
            message.includes('success') || 
            message.includes('Successfully') || 
            message.includes('renewed') ||
            message.includes('upgraded') ? 'success' : 'error'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;