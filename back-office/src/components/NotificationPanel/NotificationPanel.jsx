import React from 'react';
import { HiOutlineChatBubbleLeftRight, HiOutlineCurrencyDollar, HiOutlineShoppingCart, HiOutlineUser } from 'react-icons/hi2';

const NotificationPanel = () => {
  const notifications = [
    {
      id: 1,
      title: '56 New users registered.',
      time: '1 hour ago',
      icon: <HiOutlineUser className="h-5 w-5" />,
      unread: true
    },
    {
      id: 2,
      title: '132 Orders placed.',
      time: '2 hours ago',
      icon: <HiOutlineShoppingCart className="h-5 w-5" />,
      unread: true
    },
    {
      id: 3,
      title: 'Funds has been withdrawn.',
      time: '3 hours ago',
      icon: <HiOutlineCurrencyDollar className="h-5 w-5" />,
      unread: false
    },
    {
      id: 4,
      title: '5 Unread messages.',
      time: '5 hours ago',
      icon: <HiOutlineChatBubbleLeftRight className="h-5 w-5" />,
      unread: false
    }
  ];

  return (
    <div className="flex max-h-[400px] flex-col overflow-hidden rounded-2xl border border-white/8 bg-slate-900/80">
      <div className="border-b border-white/8 bg-gradient-to-r from-emerald-500/10 to-transparent p-4">
        <h3 className="text-base font-bold text-slate-50">Notifications</h3>
      </div>

      <div className="flex-1 overflow-y-auto [scrollbar-color:#334155_#0f172a] [scrollbar-width:thin]">
        {notifications.map(notif => (
          <div key={notif.id} className={`flex items-start gap-4 border-b border-white/8 px-4 py-4 transition hover:bg-white/5 ${notif.unread ? 'bg-emerald-500/5' : ''}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-200">{notif.icon}</div>
            <div className="flex-1">
              <p className="m-0 text-sm font-semibold text-slate-50">{notif.title}</p>
              <p className="m-0 mt-1 text-xs text-slate-500">{notif.time}</p>
            </div>
            {notif.unread && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
