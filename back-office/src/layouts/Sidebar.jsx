import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { HiOutlineArrowRightOnRectangle, HiOutlineFilm, HiOutlineHome, HiOutlineUsers } from 'react-icons/hi2';
import { FaEarthAsia } from 'react-icons/fa6';
import { IoIosStar } from 'react-icons/io';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);
  const itemClass = (active) => [
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
    active
      ? 'inline-flex h-8 w-28 items-center justify-center rounded-full bg-transparent font-bold text-emerald-400 shadow-none ring-0'
      : 'text-slate-300 font-medium hover:-translate-x-1 hover:bg-emerald-500/5 hover:text-emerald-50',
  ].join(' ');

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[260px] overflow-y-auto  bg-slate-950/95 px-3 py-4 backdrop-blur lg:flex lg:flex-col">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-3 rounded-2xl px-2 py-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-600 font-bold text-emerald-50">
            {user?.user_name?.substring(0, 2).toUpperCase() || 'AD'}
        </div>
          <div>
            <div className="font-semibold text-slate-100">{user?.user_name || 'Admin'}</div>
            <div className="text-xs text-slate-400">Watch2Day</div>
          </div>
        </div>

        <nav className="mt-1 flex flex-col gap-1.5">
          <Link to="/admin" className={itemClass(isActive('/admin') && location.pathname === '/admin')}>
            <HiOutlineHome className="h-5 w-5 shrink-0" />
            <span>Dashboard</span>
          </Link>

          <div className="my-3 border-t border-white/8" />

          <div className="px-1 text-sm font-semibold uppercase tracking-[0.08em] text-slate-300">Movies</div>
          <Link to="/admin/movies/cdrama" className={itemClass(isActive('/admin/movies/cdrama'))}>
            <FaEarthAsia className="h-5 w-5 shrink-0" />
            <span>CDrama</span>
          </Link>
          <Link to="/admin/movies/kdrama" className={itemClass(isActive('/admin/movies/kdrama'))}>
            <HiOutlineFilm className="h-5 w-5 shrink-0" />
            <span>KDrama</span>
          </Link>
          <Link to="/admin/movies/hollywood" className={itemClass(isActive('/admin/movies/hollywood'))}>
            <IoIosStar className="h-5 w-5 shrink-0" />
            <span>Hollywood</span>
          </Link>

          <div className="my-3 border-t border-white/8" />

          <Link to="/admin/users" className={itemClass(isActive('/admin/users'))}>
            <HiOutlineUsers className="h-5 w-5 shrink-0" />
            <span>Users</span>
          </Link>

          <div className="my-3 border-t border-white/8" />

          <button 
            onClick={handleLogout}
            className={`${itemClass(false)} w-full border-0 bg-transparent text-left`}
          >
            <HiOutlineArrowRightOnRectangle className="h-5 w-5 shrink-0" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
