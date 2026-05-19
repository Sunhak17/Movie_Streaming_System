import React from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import ProfileLayout from '../../components/layout/ProfileLayout';
import '../../styles/movies/myList.css';

const myList = () => {
  const { user } = useAuth();

  // Sample watchlist data (replace with actual data from useAuth or API)
  const myListData = user?.myList || [
    { title: 'Supermen', status: 'To Watch' },
    { title: 'Oppenheimer', status: 'In Progress' },
    { title: 'The Zone of Interest', status: 'Completed' },
  ];

  return (
    <ProfileLayout>
      <div className="my-list-content">
        <h1 className="my-list-title">My List</h1>

        <div className="my-list-section">
          <div className="my-list-card">
            {myListData.length > 0 ? (
              myListData.map((item, index) => (
                <div className="my-list-item" key={index}>
                  <h3>{item.title}</h3>
                  <p>Status: <span className="status">{item.status}</span></p>
                  <button className="remove-btn">Remove</button>
                </div>
              ))
            ) : (
              <p className="my-list-empty">No items in your list.</p>
            )}
          </div>
        </div>

        <div className="my-list-footer">
          <div>
            <p>About WATCH2DAY</p>
            <p>About us</p>
            <p>Product and services</p>
            <p>Copyright ©2025 WATCH2DAY ALL Rights Reserved</p>
          </div>
          <div>
            <p>Advertisement</p>
            <p>Corporate relations</p>
          </div>
          <div>
            <p>Help and support</p>
            <p>Feedback</p>
            <p>Security Response Center</p>
          </div>
          <div>
            <p>Terms of service</p>
            <p>Privacy Policy</p>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default myList;