import React from 'react';

const tabLabels = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'movies', label: 'Movies' }
];

const DashboardTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="dashboard-header">
      <div className="dashboard-tabs">
        {tabLabels.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`dashboard-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardTabs;