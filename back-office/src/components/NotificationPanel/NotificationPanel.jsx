import React from 'react';
import './NotificationPanel.css';

const NotificationPanel = () => {
  const notifications = [
    {
      id: 1,
      title: '56 New users registered.',
      time: '1 hour ago',
      icon: '👤',
      unread: true
    },
    {
      id: 2,
      title: '132 Orders placed.',
      time: '2 hours ago',
      icon: '🛒',
      unread: true
    },
    {
      id: 3,
      title: 'Funds has been withdrawn.',
      time: '3 hours ago',
      icon: '💰',
      unread: false
    },
    {
      id: 4,
      title: '5 Unread messages.',
      time: '5 hours ago',
      icon: '💬',
      unread: false
    }
  ];

  return (
    <div className="notification-panel">
      <div className="panel-header">
        <h3 className="panel-title">Notifications</h3>
      </div>

      <div className="notification-list">
        {notifications.map(notif => (
          <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
            <div className="notif-icon">{notif.icon}</div>
            <div className="notif-content">
              <p className="notif-title">{notif.title}</p>
              <p className="notif-time">{notif.time}</p>
            </div>
            {notif.unread && <div className="notif-indicator"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
