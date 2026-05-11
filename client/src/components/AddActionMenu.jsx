import { useState, useRef, useEffect } from 'react';
import { PlusCircle, Home, Briefcase, MessageSquare, CheckSquare, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddActionMenu({ onOpenModal }) {
  const [isOpen, setIsOpen] = useState(false);
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
    { label: 'Add Property', icon: Home, action: () => navigate('/add-property') },
    { label: 'Add Project', icon: Briefcase, action: () => navigate('/add-project') },
    { label: 'Add Inquiry', icon: MessageSquare, action: () => navigate('/add-inquiry') },
    { label: 'Add Task', icon: CheckSquare, action: () => navigate('/add-task') },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
      >
        <PlusCircle className="w-5 h-5" />
        <span className="hidden lg:inline">Add New</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
          <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Actions</div>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.action();
                setIsOpen(false);
              }}
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
