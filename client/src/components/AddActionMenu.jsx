import { useState, useRef, useEffect } from 'react';
import { PlusCircle, Home, Briefcase, MessageSquare, CheckSquare, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddActionMenu({ onOpenModal, direction = 'down', customTrigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actions = [
    { label: 'Add Property', icon: Home, path: '/add-property' },
    { label: 'Add Project', icon: Briefcase, path: '/add-project' },
    { label: 'Add Inquiry', icon: MessageSquare, path: '/add-inquiry' },
    { label: 'Add Task', icon: CheckSquare, path: '/add-task' },
  ];

  const handleAction = async (path) => {
    setLoading(path);
    setIsOpen(false);
    // Add a small delay to show loading state as requested
    await new Promise(r => setTimeout(r, 300));
    navigate(path);
    setLoading(null);
  };

  const menuClasses = `absolute ${direction === 'up' ? 'bottom-full mb-3' : 'top-full mt-3'} ${direction === 'up' ? 'right-1/2 translate-x-1/2' : 'right-0'} w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[100] animate-in fade-in zoom-in duration-200 ${direction === 'up' ? 'origin-bottom' : 'origin-top-right'}`;

  return (
    <div className="relative" ref={menuRef}>
      {customTrigger ? (
        <div onClick={() => setIsOpen(!isOpen)}>
          {customTrigger(loading !== null)}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading !== null}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-70"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          <span className="lg:inline font-bold">Add New</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {isOpen && (
        <div className={menuClasses}>
          <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Actions</div>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action.path)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <action.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </div>
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
