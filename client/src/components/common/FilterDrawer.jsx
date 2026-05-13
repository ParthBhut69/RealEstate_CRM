import { X, Filter, RotateCcw } from 'lucide-react';

export default function FilterDrawer({ isOpen, onClose, onClear, activeCount, children, accentColor = 'blue' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 text-${accentColor}-600`} />
            <h2 className="text-lg font-bold text-slate-800">Filters</h2>
            {activeCount > 0 && (
              <span className={`bg-${accentColor}-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold`}>
                {activeCount}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button
            onClick={() => {
              onClear();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Clear All
          </button>
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-3 bg-${accentColor}-600 text-white rounded-xl font-bold hover:bg-${accentColor}-700 shadow-lg shadow-${accentColor}-200 transition-colors`}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
