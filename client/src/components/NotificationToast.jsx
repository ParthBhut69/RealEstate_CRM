import { useNotifications } from '../context/NotificationContext';
import { X, Bell, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const PRIORITY_STYLES = {
  high:   { bar: '#ef4444', badge: 'bg-red-100 text-red-700',    icon: 'text-red-500'    },
  medium: { bar: '#f97316', badge: 'bg-orange-100 text-orange-700', icon: 'text-orange-500' },
  low:    { bar: '#3b82f6', badge: 'bg-blue-100 text-blue-700',   icon: 'text-blue-500'   },
};

const TYPE_ICONS = {
  'task':      AlertCircle,
  'follow-up': Clock,
  'inquiry':   Bell,
  'reminder':  Bell,
};

function Toast({ toast, onDismiss, onResolve }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const style = PRIORITY_STYLES[toast.priority] || PRIORITY_STYLES.medium;
  const Icon = TYPE_ICONS[toast.type] || Bell;

  useEffect(() => {
    // Slide in
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Progress bar countdown — 5000ms total
    const start = Date.now();
    const duration = 5000;
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) clearInterval(tick);
    }, 50);
    return () => clearInterval(tick);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(toast.toastId), 300);
  };

  const handleResolve = () => {
    setVisible(false);
    setTimeout(() => {
      onResolve(toast.id);
      onDismiss(toast.toastId);
    }, 300);
  };

  return (
    <div
      style={{
        transform: visible ? 'translateX(0)' : 'translateX(110%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        willChange: 'transform',
      }}
      className="relative w-80 bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden"
    >
      {/* Priority side stripe */}
      <div
        style={{ backgroundColor: style.bar, width: 4 }}
        className="absolute left-0 inset-y-0"
      />

      <div className="pl-4 pr-3 pt-3 pb-2">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`mt-0.5 shrink-0 ${style.icon}`}>
            <Icon className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{toast.title}</p>
              <button
                onClick={handleDismiss}
                className="shrink-0 p-0.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{toast.message}</p>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${style.badge}`}>
                {toast.priority}
              </span>
              <button
                onClick={handleResolve}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <CheckCircle className="w-3 h-3" />
                Resolve
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-slate-100">
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: style.bar,
            transition: 'width 50ms linear',
          }}
          className="h-full"
        />
      </div>
    </div>
  );
}

export default function NotificationToast() {
  const { toasts, dismissToast, resolveAlert } = useNotifications();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-4 z-[9999] flex flex-col gap-3 items-end pointer-events-none"
      style={{ maxHeight: '100vh' }}
    >
      {toasts.map(toast => (
        <div key={toast.toastId} className="pointer-events-auto">
          <Toast
            toast={toast}
            onDismiss={dismissToast}
            onResolve={resolveAlert}
          />
        </div>
      ))}
    </div>
  );
}
