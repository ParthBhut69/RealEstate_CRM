import { useState, useEffect } from 'react';
import { Home as HomeIcon, MessageSquare, Briefcase, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    properties: 0,
    inquiries: 0,
    tasks: 0,
    projects: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  const modules = [
    { id: 'properties', title: 'Properties', count: stats.properties, icon: HomeIcon, color: 'text-blue-600', bg: 'bg-blue-100', link: '/properties' },
    { id: 'inquiries', title: 'Inquiries', count: stats.inquiries, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-100', link: '/inquiries' },
    { id: 'tasks', title: 'Today\'s Tasks', count: stats.tasks, icon: CheckSquare, color: 'text-orange-600', bg: 'bg-orange-100', link: '/tasks' },
    { id: 'projects', title: 'Projects', count: stats.projects, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100', link: '/projects' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, <span className="font-semibold text-slate-700">{user?.name || 'User'}</span>! Here's your overview.</p>
        </div>
      </div>

<<<<<<< HEAD
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
=======
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
>>>>>>> dbb33eb4a79c8ab4bc7e02b76e1c4bdd46ff9726
        {modules.map((mod) => (
          <Link 
            key={mod.id} 
            to={mod.link}
<<<<<<< HEAD
            className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] md:text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">{mod.title}</p>
                <h3 className="text-2xl md:text-3xl font-black text-slate-800">{mod.count}</h3>
              </div>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${mod.bg} ${mod.color} group-hover:scale-110 transition-transform shrink-0`}>
                <mod.icon className="w-5 h-5 md:w-6 h-6" />
=======
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{mod.title}</p>
                <h3 className="text-3xl font-bold text-slate-800">{mod.count}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mod.bg} ${mod.color} group-hover:scale-110 transition-transform`}>
                <mod.icon className="w-6 h-6" />
>>>>>>> dbb33eb4a79c8ab4bc7e02b76e1c4bdd46ff9726
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
              View all →
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">New inquiry for Sunset Villa</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
