import { Outlet, NavLink } from 'react-router-dom';
import { Home, Bell, User, PlusCircle, Briefcase } from 'lucide-react';
import { useState } from 'react';
import QuickAddModal from './QuickAddModal';

export default function Layout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Desktop Top Navigation */}
      <nav className="hidden md:flex w-full bg-white shadow-sm h-16 items-center px-8 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="text-xl font-bold text-slate-800">CRM</span>
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

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add New</span>
          </button>

          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`
            }
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium">Alerts</span>
          </NavLink>
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
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around items-center h-16 px-2 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </NavLink>
        
        <NavLink to="/projects" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
          <Briefcase className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Projects</span>
        </NavLink>

        <div className="relative -top-5">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 border-4 border-slate-50 active:scale-95 transition-transform"
          >
            <PlusCircle className="w-8 h-8" />
          </button>
        </div>

        <NavLink to="/alerts" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
          <Bell className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Alerts</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Profile</span>
        </NavLink>
      </nav>

      <QuickAddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
