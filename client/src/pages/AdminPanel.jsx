import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Trash2, Shield, Mail, Phone, Calendar, Loader2, Search, UserCheck } from 'lucide-react';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      setActionLoading(userId);
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update role: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      setActionLoading(userId);
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert('Failed to delete user: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium font-sans">Loading user directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            User Management
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Manage agent access, roles, and security permissions.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm font-medium"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Agent / User</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Joined On</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg border border-blue-100 group-hover:scale-110 transition-transform">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter">ID: #{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <Phone className="w-4 h-4 text-slate-400" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                          user.role.toLowerCase() === 'admin' 
                            ? 'bg-blue-50 text-blue-600 border-blue-100' 
                            : 'bg-slate-50 text-slate-600 border-slate-100'
                        }`}>
                          {user.role}
                        </span>
                        <select
                          className="text-xs font-bold border-none bg-transparent text-slate-400 hover:text-blue-600 outline-none cursor-pointer"
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          disabled={actionLoading === user.id}
                        >
                          <option value="Agent">Agent</option>
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(user.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionLoading === user.id}
                        >
                          {actionLoading === user.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-slate-500 font-medium">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Tip */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400 border border-white/10">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Admin Security Protocol</h3>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed max-w-xl">
              As an administrator, you can manage user access and roles. For security reasons, passwords are encrypted and never displayed. Use the email system to trigger password resets for agents.
            </p>
          </div>
        </div>
        <button className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/40 flex items-center gap-3">
          <UserCheck className="w-5 h-5" />
          Review Logs
        </button>
      </div>
    </div>
  );
}
