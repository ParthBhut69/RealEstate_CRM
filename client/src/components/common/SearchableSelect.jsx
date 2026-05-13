import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

export default function SearchableSelect({ options, value, onChange, placeholder, label, icon: Icon, accentColor = 'blue' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="space-y-1" ref={wrapperRef}>
      {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white border ${isOpen ? `border-${accentColor}-500 ring-4 ring-${accentColor}-50` : 'border-slate-200'} rounded-xl transition-all text-left shadow-sm group`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {Icon && <Icon className={`w-4 h-4 text-slate-400 group-hover:text-${accentColor}-500 transition-colors shrink-0`} />}
            <span className={`truncate text-sm ${selectedOption ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
              {selectedOption ? selectedOption.label : placeholder || 'Select...'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {value && (
              <X 
                className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" 
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
              />
            )}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-[70] w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top">
            <div className="p-3 border-b border-slate-50">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 transition-all`}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      value === opt.value 
                        ? `bg-${accentColor}-50 text-${accentColor}-600 font-bold` 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${value === opt.value ? `bg-${accentColor}-600` : 'bg-transparent'}`} />
                    {opt.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-slate-400 text-sm">
                  No results found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
