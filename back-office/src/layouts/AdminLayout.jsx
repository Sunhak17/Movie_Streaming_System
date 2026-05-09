import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import './AdminLayout.css';

const AdminLayout = ({ children, breadcrumbs = [] }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="layout-main">
        <Header breadcrumbs={breadcrumbs} />
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
