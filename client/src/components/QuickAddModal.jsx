import { useState, useEffect } from 'react';
import { X, Home, MessageSquare, Briefcase, CheckSquare, Users, DollarSign, CreditCard } from 'lucide-react';
import api from '../api/axios';

const options = [
  { id: 'properties', label: 'Add Property', icon: Home, color: 'text-blue-600', bg: 'bg-blue-100', fields: [{name: 'title', label: 'Title'}, {name: 'price', label: 'Price', type: 'number'}, {name: 'description', label: 'Description', type: 'textarea'}] },
  { id: 'inquiries', label: 'Add Inquiry', icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-100', fields: [{name: 'customer_name', label: 'Customer Name'}, {name: 'contact_info', label: 'Contact Info'}, {name: 'property_id', label: 'Property ID', type: 'number'}] },
  { id: 'projects', label: 'Add Project', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100', fields: [{name: 'name', label: 'Project Name'}, {name: 'description', label: 'Description', type: 'textarea'}] },
  { id: 'tasks', label: 'Add Task', icon: CheckSquare, color: 'text-orange-600', bg: 'bg-orange-100', fields: [{name: 'title', label: 'Task Title'}, {name: 'due_date', label: 'Due Date', type: 'datetime-local'}] },
  { id: 'contacts', label: 'Add Contact', icon: Users, color: 'text-pink-600', bg: 'bg-pink-100', fields: [{name: 'name', label: 'Full Name'}, {name: 'email', label: 'Email Address', type: 'email'}, {name: 'phone', label: 'Phone Number'}] },
  { id: 'deals', label: 'Add Deal', icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-100', fields: [{name: 'amount', label: 'Amount ($)', type: 'number'}, {name: 'property_id', label: 'Property ID', type: 'number'}, {name: 'contact_id', label: 'Contact ID', type: 'number'}] },
  { id: 'loanInquiries', label: 'Add Loan', icon: CreditCard, color: 'text-cyan-600', bg: 'bg-cyan-100', fields: [{name: 'amount', label: 'Loan Amount ($)', type: 'number'}, {name: 'contact_id', label: 'Contact ID', type: 'number'}] },
];

export default function QuickAddModal({ isOpen, onClose }) {
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (activeForm) {
          setActiveForm(null);
          setFormData({});
        } else onClose();
      }
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, activeForm, onClose]);

  if (!isOpen) return null;

  const currentOption = options.find(o => o.id === activeForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/${activeForm}`, formData);
      setActiveForm(null);
      setFormData({});
      onClose();
      // Optionally trigger a global refresh or state update
      window.location.reload();
    } catch (err) {
      console.error('Error saving:', err);
      alert('Failed to save data. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (activeForm) {
            setActiveForm(null);
            setFormData({});
          } else onClose();
        }}
      />
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {activeForm ? currentOption?.label : 'Quick Action'}
          </h2>
          <button 
            onClick={() => {
              if (activeForm) {
                setActiveForm(null);
                setFormData({});
              } else onClose();
            }}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {!activeForm ? (
            <div className="grid grid-cols-2 gap-3">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setActiveForm(opt.id)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${opt.bg} ${opt.color} mb-2 group-hover:scale-110 transition-transform`}>
                    <opt.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentOption?.fields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      required
                      name={field.name}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                    />
                  ) : (
                    <input 
                      required
                      type={field.type || 'text'}
                      name={field.name}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
              
              <div className="flex justify-end gap-2 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setActiveForm(null);
                    setFormData({});
                  }} 
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
