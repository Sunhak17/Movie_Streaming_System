import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { HiOutlineArrowPath, HiOutlineBell, HiOutlineMagnifyingGlass, HiOutlineMoon } from 'react-icons/hi2';

const Header = ({ breadcrumbs = [] }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex w-full flex-wrap items-center justify-between gap-4 border-b border-white/5 bg-slate-950/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-400 sm:text-sm">
          {breadcrumbs.length > 0 ? (
            <>
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span>{crumb}</span>
                  {idx < breadcrumbs.length - 1 && <span className="text-slate-600">/</span>}
                </div>
              ))}
            </>
          ) : (
            <span>Dashboards</span>
          )}
        </div>
        <h1 className="truncate text-2xl font-bold text-slate-50">{breadcrumbs[breadcrumbs.length - 1] || 'Overview'}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button className="relative rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-emerald-300" title="Notifications">
          <span className="absolute right-1 top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">3</span>
          <HiOutlineBell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-l border-white/10 pl-3 sm:pl-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-slate-950">
            {user?.user_name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="hidden flex-col sm:flex">
            <p className="m-0 text-sm font-semibold text-slate-50">{user?.user_name || 'Admin'}</p>
            <p className="m-0 text-xs text-slate-500">{user?.role || 'Administrator'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
