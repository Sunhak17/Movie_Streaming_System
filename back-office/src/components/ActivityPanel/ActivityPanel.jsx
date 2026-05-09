import React from 'react';
import './ActivityPanel.css';

const ActivityPanel = () => {
  const activities = [
    {
      id: 1,
      title: 'Changed the style.',
      time: 'Just now',
      avatar: '👤',
      name: 'Admin'
    },
    {
      id: 2,
      title: '177 New products added.',
      time: '2 hours ago',
      avatar: '📦',
      name: 'System'
    },
    {
      id: 3,
      title: '11 Products has been archived',
      time: '3 hours ago',
      avatar: '🗂️',
      name: 'System'
    },
    {
      id: 4,
      title: 'Peter "Doc" has been renamed.',
      time: '5 hours ago',
      avatar: '✏️',
      name: 'User Update'
    }
  ];

  return (
    <div className="activity-panel">
      <div className="panel-header">
        <h3 className="panel-title">Activities</h3>
      </div>

      <div className="activity-list">
        {activities.map(activity => (
          <div key={activity.id} className="activity-item">
            <div className="activity-avatar">{activity.avatar}</div>
            <div className="activity-content">
              <p className="activity-title">{activity.title}</p>
              <p className="activity-time">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPanel;
