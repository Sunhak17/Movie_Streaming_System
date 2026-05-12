import React from 'react';

const StatCard = ({ title, value, change, changeType = 'positive', icon }) => {
  const toneClasses = {
    positive: 'text-emerald-400',
    negative: 'text-rose-400',
    neutral: 'text-slate-400',
  };

  return (
    <div className="group flex cursor-pointer flex-col gap-4 rounded-2xl border border-white/8 bg-slate-900/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400/30 hover:shadow-glow sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">{title}</h3>
        <span className="text-xl">{icon}</span>
      </div>

      <div className="text-3xl font-bold text-slate-50">{value}</div>

      <div className={`flex items-center gap-2 text-sm font-semibold ${toneClasses[changeType] || toneClasses.neutral}`}>
        <span>{changeType === 'positive' ? '📈' : '📉'}</span>
        <span>{change}</span>
      </div>
    </div>
  );
};

export default StatCard;
