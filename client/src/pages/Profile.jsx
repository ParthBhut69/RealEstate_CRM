import { User, Mail, Phone, Lock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // TODO: clear token
      navigate('/login');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-4 border-white shadow-lg">
            <User className="w-10 h-10" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-slate-800">Alex Carter</h2>
            <p className="text-slate-500 font-medium">Senior Estate Agent</p>
          </div>
          <div className="md:ml-auto">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Email Address</p>
                <p className="text-slate-800 font-medium">alex.carter@crm.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Phone Number</p>
                <p className="text-slate-800 font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 space-y-3">
          <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors group">
            <div className="flex items-center gap-3 text-slate-700 group-hover:text-blue-700 font-medium">
              <Lock className="w-5 h-5" />
              Change Password
            </div>
            <span className="text-slate-400 group-hover:text-blue-400">→</span>
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-colors group"
          >
            <div className="flex items-center gap-3 text-red-600 font-medium">
              <LogOut className="w-5 h-5" />
              Logout
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
