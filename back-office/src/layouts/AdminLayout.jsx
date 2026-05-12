import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = ({ children, breadcrumbs = [] }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 lg:flex">
      <Sidebar />
      <div className="flex min-h-screen w-full flex-col lg:pl-[260px]">
        <Header breadcrumbs={breadcrumbs} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
