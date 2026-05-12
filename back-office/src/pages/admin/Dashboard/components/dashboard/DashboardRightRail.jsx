import React from 'react';
import NotificationPanel from '../../../../../components/NotificationPanel/NotificationPanel';
import ActivityPanel from '../../../../../components/ActivityPanel/ActivityPanel';
import { FaStar } from 'react-icons/fa6';

const DashboardRightRail = () => {
  return (
    <div className="flex flex-col gap-6">
      <NotificationPanel />
      <ActivityPanel />
    </div>
  );
};

export default DashboardRightRail;