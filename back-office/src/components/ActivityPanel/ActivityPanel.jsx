import React from 'react';
import { HiOutlineArchiveBox, HiOutlineCube, HiOutlinePencilSquare, HiOutlineUser } from 'react-icons/hi2';

const ActivityPanel = () => {
  const activities = [
    {
      id: 1,
      title: 'Changed the style.',
      time: 'Just now',
      avatar: <HiOutlineUser className="h-5 w-5" />,
      name: 'Admin'
    },
    {
      id: 2,
      title: '177 New products added.',
      time: '2 hours ago',
      avatar: <HiOutlineCube className="h-5 w-5" />,
      name: 'System'
    },
    {
      id: 3,
      title: '11 Products has been archived',
      time: '3 hours ago',
      avatar: <HiOutlineArchiveBox className="h-5 w-5" />,
      name: 'System'
    },
    {
      id: 4,
      title: 'Peter "Doc" has been renamed.',
      time: '5 hours ago',
      avatar: <HiOutlinePencilSquare className="h-5 w-5" />,
      name: 'User Update'
    }
  ];

  return (
    <div className="flex max-h-[400px] flex-col overflow-hidden rounded-2xl border border-white/8 bg-slate-900/80">
      <div className="border-b border-white/8 bg-gradient-to-r from-emerald-500/10 to-transparent p-4">
        <h3 className="text-base font-bold text-slate-50">Activities</h3>
      </div>

      <div className="flex-1 overflow-y-auto [scrollbar-color:#334155_#0f172a] [scrollbar-width:thin]">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start gap-4 border-b border-white/8 px-4 py-4 transition hover:bg-white/5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-slate-200">{activity.avatar}</div>
            <div className="flex-1">
              <p className="m-0 text-sm font-semibold text-slate-50">{activity.title}</p>
              <p className="m-0 mt-1 text-xs text-slate-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPanel;
