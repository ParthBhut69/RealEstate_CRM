import { Outlet, NavLink } from 'react-router-dom';
import { Home, Bell, User, PlusCircle, Briefcase, Shield } from 'lucide-react';
import { useState } from 'react';
import AddActionMenu from './AddActionMenu';
import NotificationToast from './NotificationToast';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-x-hidden">
      {/* Desktop Top Navigation */}
      <nav className="hidden md:flex w-full bg-white shadow-sm h-16 items-center px-8 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="text-xl font-bold text-blue-600">BrokerFlow</span>
        </div>
        
        <div className="flex items-center gap-6 flex-1 justify-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </NavLink>

          <AddActionMenu />

          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `relative flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`
            }
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse shadow-sm"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <span className="font-medium">Alerts</span>
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`
              }
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Admin</span>
            </NavLink>
          )}
        </div>

        <div>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`
            }
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </NavLink>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around items-center h-16 px-2 z-50 shadow-[0_-4_6px_-1px_rgba(0,0,0,0.05)]">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </NavLink>
        
        <NavLink to="/projects" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
          <Briefcase className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Projects</span>
        </NavLink>

        <div className="relative -top-5">
          <AddActionMenu 
            direction="up"
            customTrigger={(isLoading) => (
              <button 
                disabled={isLoading}
                className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-200 border-4 border-slate-50 active:scale-90 transition-transform disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <PlusCircle className="w-8 h-8" />
                )}
              </button>
            )}
          />
        </div>

        <NavLink to="/alerts" className={({ isActive }) => `relative flex flex-col items-center justify-center w-16 h-full ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
          <div className="relative">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">Alerts</span>
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
            <Shield className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">Admin</span>
          </NavLink>
        )}

        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Profile</span>
        </NavLink>
      </nav>

      <NotificationToast />
    </div>
  );
}
