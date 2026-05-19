import React from 'react';
import ProfileLayout from '../../components/layout/ProfileLayout';
import '../../styles/user/History.css';

const History = () => {
  return (
    <ProfileLayout>
      <div className="history-page">
        <div className="history-header">
          <h1>Watch History</h1>
        </div>

        <div className="history-card">
          <p className="history-empty">No watch history yet.</p>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default History;
