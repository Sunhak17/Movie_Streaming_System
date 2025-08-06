import React, { useState, useEffect } from 'react';
import apiService from '../components/apiService';
import '../styles/Account.css';

const plans = [
  { name: 'Basic', price: 9.99 },
  { name: 'Premium', price: 19.99 },
  { name: 'Premier', price: 29.99 },
];

const PlanDetails = ({ user }) => {
  const [currentPlan, setCurrentPlan] = useState(user?.plan || 'Basic');
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setCurrentPlan(user?.plan || 'Basic');
    setSelectedPlan(user?.plan || 'Basic');
  }, [user]);

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await apiService.renewPlan({ plan: selectedPlan });
      if (res.success) {
        setSuccess('Plan updated and payment successful!');
        setCurrentPlan(selectedPlan);
      } else {
        setError(res.message || 'Payment failed');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <div className="plan-details-container">
      <h2>Plan Details</h2>
      <div className="plan-card">
        <strong>Current Plan:</strong> {currentPlan}
      </div>
      <div className="plan-card">
        <label htmlFor="plan-select">Upgrade to:</label>
        <select
          id="plan-select"
          value={selectedPlan}
          onChange={e => setSelectedPlan(e.target.value)}
        >
          {plans.map(plan => (
            <option key={plan.name} value={plan.name}>
              {plan.name} (${plan.price})
            </option>
          ))}
        </select>
        <button className="upgrade-btn" onClick={handleUpgrade} disabled={loading || selectedPlan === currentPlan}>
          {selectedPlan === currentPlan ? 'Current Plan' : 'Upgrade & Pay'}
        </button>
        {error && <div className="payment-error">{error}</div>}
        {success && <div style={{ color: '#6fcf97', marginTop: '0.5rem' }}>{success}</div>}
      </div>
    </div>
  );
};

export default PlanDetails;
