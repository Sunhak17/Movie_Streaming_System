import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, change, changeType = 'positive', icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <h3 className="stat-title">{title}</h3>
        <span className="stat-icon">{icon}</span>
      </div>

      <div className="stat-value">{value}</div>

      <div className={`stat-change ${changeType}`}>
        {changeType === 'positive' ? '📈' : '📉'} {change}
      </div>
    </div>
  );
};

export default StatCard;
