import { useState, useRef } from 'react';
import { User, Mail, Phone, Lock, LogOut, Check, X, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    role: user?.role || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    if (!isEditing) setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccessMsg('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('role', formData.role);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    if (avatarFile) {
      data.append('avatar', avatarFile);
    }

    const success = await updateUser(data);
    setSaving(false);

    if (success) {
      setSuccessMsg('Profile updated successfully!');
      setAvatarFile(null);
      setAvatarPreview(null);
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setError('Failed to save. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      role: user?.role || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setAvatarPreview(null);
    setAvatarFile(null);
    setError('');
    setIsEditing(false);
  };

  if (!user) return null;

  const avatarSrc = avatarPreview || (user.avatar_url ? `${API_BASE}${user.avatar_url}` : null);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>

      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
          <Check className="w-4 h-4 shrink-0" /> {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          <X className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">

          {/* Avatar with upload overlay */}
          <div className="relative group shrink-0 cursor-pointer" onClick={handleAvatarClick}>
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow">
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          
          <div className="text-center md:text-left flex-1 w-full">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Job Title / Role</label>
                  <input 
                    type="text" 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                <p className="text-slate-500 font-medium">{user.role}</p>
                <p className="text-xs text-slate-400 mt-1">Click the avatar to change your photo</p>
              </>
            )}
          </div>

          <div className="md:ml-auto flex gap-2 mt-4 md:mt-0 shrink-0">
            {isEditing ? (
              <>
                <button 
                  onClick={handleCancel}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Cancel"
                >
                  <X className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 mt-1">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-medium mb-1">Email Address</p>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-slate-800 font-medium break-all">{user.email}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 mt-1">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-medium mb-1">Phone Number</p>
                {isEditing ? (
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-slate-800 font-medium">{user.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isEditing && (
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
        )}
      </div>
    </div>
  );
}
