import React from 'react';
import NotificationPanel from '../../../../components/NotificationPanel/NotificationPanel';
import ActivityPanel from '../../../../components/ActivityPanel/ActivityPanel';

const DashboardRightRail = () => {
  return (
    <div className="dashboard-right">
      <NotificationPanel />
      <ActivityPanel />

      <div className="premium-card">
        <span className="premium-icon">⭐</span>
        <p className="premium-label">Premium Plane</p>
        <p className="premium-desc">$30 <span>Per Month</span></p>
        <p className="premium-text">Improve your workplace. View and analyze your profits and losses</p>
        <button className="premium-btn" type="button">Get Started</button>
      </div>
    </div>
  );
};

export default DashboardRightRail;