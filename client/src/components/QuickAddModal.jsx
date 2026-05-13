import { useState, useEffect } from 'react';
import { X, Home, MessageSquare, Briefcase, CheckSquare, Users, DollarSign, CreditCard, PlusCircle } from 'lucide-react';
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
      window.location.reload();
    } catch (err) {
      console.error('Error saving:', err);
      alert('Failed to save data. Please check required fields.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={() => {
          if (activeForm) {
            setActiveForm(null);
            setFormData({});
          } else onClose();
        }}
      />
      
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-none">
              {activeForm ? currentOption?.label : 'Quick Access'}
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              {activeForm ? `Create a new ${activeForm.slice(0, -1)} entry.` : 'What would you like to add today?'}
            </p>
          </div>
          <button 
            onClick={() => {
              if (activeForm) {
                setActiveForm(null);
                setFormData({});
              } else onClose();
            }}
            className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {!activeForm ? (
            <div className="grid grid-cols-2 gap-4">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setActiveForm(opt.id)}
                  className="flex flex-col items-start p-6 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group text-left relative overflow-hidden"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${opt.bg} ${opt.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <opt.icon className="w-6 h-6" />
                  </div>
                  <span className="text-base font-bold text-slate-800">{opt.label}</span>
                  <span className="text-xs text-slate-400 font-medium mt-1">Add to database</span>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlusCircle className={`w-5 h-5 ${opt.color}`} />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentOption?.fields.map(field => (
                <div key={field.name}>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      required
                      name={field.name}
                      onChange={handleInputChange}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      className="w-full rounded-2xl border-slate-200 bg-slate-50/50 px-5 py-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900 placeholder:text-slate-300 font-medium"
                      rows={4}
                    />
                  ) : (
                    <input 
                      required
                      type={field.type || 'text'}
                      name={field.name}
                      onChange={handleInputChange}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      className="w-full rounded-2xl border-slate-200 bg-slate-50/50 px-5 py-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900 placeholder:text-slate-300 font-medium"
                    />
                  )}
                </div>
              ))}
              
              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setActiveForm(null);
                    setFormData({});
                  }} 
                  className="flex-1 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-4 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all shadow-xl shadow-blue-200 disabled:opacity-50 active:scale-95"
                >
                  {loading ? 'Processing...' : 'Complete Action'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
