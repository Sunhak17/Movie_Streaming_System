import React from 'react';

const tabLabels = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'movies', label: 'Movies' }
];

const DashboardTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-6 border-b border-white/5 pb-4">
      <div className="flex flex-wrap items-center gap-2">
        {tabLabels.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${activeTab === tab.key ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}
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