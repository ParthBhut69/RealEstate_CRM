<<<<<<< HEAD
import { useState, useEffect } from 'react';
import {
  Bell, Clock, AlertCircle, CheckCircle, Plus, X,
  Filter, Inbox, Loader2, BellOff
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

/* ── Constants ──────────────────────────────────────────────────────────── */
const PRIORITY_STYLES = {
  high:   { badge: 'bg-red-100 text-red-700 border-red-200',    icon: 'bg-red-50 text-red-500',    stripe: 'bg-red-500'    },
  medium: { badge: 'bg-orange-100 text-orange-700 border-orange-200', icon: 'bg-orange-50 text-orange-500', stripe: 'bg-orange-500' },
  low:    { badge: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'bg-blue-50 text-blue-500',   stripe: 'bg-blue-500'   },
};

const TYPE_ICONS = {
  'task':      AlertCircle,
  'follow-up': Clock,
  'inquiry':   Bell,
  'reminder':  Bell,
};

const TYPE_OPTIONS  = ['reminder', 'task', 'follow-up', 'inquiry'];
const PRIORITY_OPTS = ['high', 'medium', 'low'];
const FILTER_TABS   = ['all', 'high', 'medium', 'low'];

const EMPTY_FORM = {
  title: '', message: '', type: 'reminder',
  priority: 'medium', due_date: '',
};

/* ── Add Reminder Modal ─────────────────────────────────────────────────── */
function AddAlertModal({ onClose, onSave }) {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      setError('Title and message are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch {
      setError('Failed to create reminder. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center gap-2 text-white">
            <Bell className="w-5 h-5" />
            <h2 className="text-lg font-bold">New Reminder</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title *</label>
            <input
              id="alert-title"
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Follow up with client"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message *</label>
            <textarea
              id="alert-message"
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              placeholder="Describe the reminder..."
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Type</label>
              <select
                id="alert-type"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                {TYPE_OPTIONS.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority</label>
              <select
                id="alert-priority"
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                {PRIORITY_OPTS.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date (optional)</label>
            <input
              id="alert-due-date"
              type="datetime-local"
              value={form.due_date}
              onChange={e => setForm({ ...form, due_date: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 font-semibold rounded-xl hover:bg-slate-100 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="alert-save-btn"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 text-sm"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
              {saving ? 'Creating…' : 'Create Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Alert Card ─────────────────────────────────────────────────────────── */
function AlertCard({ alert, onResolve, resolving }) {
  const style = PRIORITY_STYLES[alert.priority] || PRIORITY_STYLES.medium;
  const Icon  = TYPE_ICONS[alert.type] || Bell;
  const [leaving, setLeaving] = useState(false);

  const handleResolve = () => {
    setLeaving(true);
    setTimeout(() => onResolve(alert.id), 320);
  };

  const formattedTime = alert.due_date
    ? new Date(alert.due_date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    : new Date(alert.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div
      style={{
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'translateX(40px) scale(0.97)' : 'none',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        borderLeft: `4px solid`,
      }}
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex hover:shadow-md transition-shadow ${
        !alert.is_read ? 'ring-1 ring-blue-100' : ''
      }`}
    >
      {/* Priority stripe */}
      <div className={`w-1.5 shrink-0 ${style.stripe}`} />

      <div className="flex items-start gap-4 p-4 flex-1">
        {/* Icon */}
        <div className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${style.icon}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-slate-800 text-sm leading-snug">{alert.title}</p>
            {!alert.is_read && (
              <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1" title="Unread" />
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{alert.message}</p>
          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${style.badge}`}>
              {alert.priority}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formattedTime}
            </span>
            <span className="text-xs text-slate-400 capitalize">{alert.type}</span>
          </div>
        </div>

        {/* Resolve button */}
        <button
          id={`resolve-alert-${alert.id}`}
          onClick={handleResolve}
          disabled={resolving}
          className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Resolve
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */
export default function Alerts() {
  const { alerts, unreadCount, resolveAlert, markAllRead, addAlert, refresh } = useNotifications();
  const [filter, setFilter]       = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [resolving, setResolving] = useState(false);

  // Mark all as read when page is visited
  useEffect(() => {
    if (unreadCount > 0) {
      markAllRead();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = (alerts || []).filter(a =>
    filter === 'all' ? true : a.priority === filter
  );

  const handleResolve = async (id) => {
    setResolving(true);
    await resolveAlert(id);
    setResolving(false);
  };

  const handleAddAlert = async (formData) => {
    await addAlert(formData);
    refresh();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Alerts &amp; Reminders</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time notifications for your tasks and follow-ups</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-sm font-semibold border border-blue-200">
              {unreadCount} Unread
            </span>
          )}
          <button
            id="add-reminder-btn"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-200"
          >
            <Plus className="w-4 h-4" />
            Add Reminder
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        <Filter className="w-4 h-4 text-slate-400 ml-2" />
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            id={`filter-${tab}`}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${
              filter === tab
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
            {tab !== 'all' && (
              <span className="ml-1.5 text-xs">
                ({(alerts || []).filter(a => a.priority === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alert list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <BellOff className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-700 text-lg">All Clear!</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs">
            {filter === 'all'
              ? 'No active alerts or reminders. Create one to stay on top of your work.'
              : `No ${filter} priority alerts right now.`}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-5 flex items-center gap-2 text-blue-600 font-semibold text-sm hover:underline"
            >
              <Plus className="w-4 h-4" /> Create your first reminder
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onResolve={handleResolve}
              resolving={resolving}
            />
          ))}
        </div>
      )}

      {/* Total count */}
      {filtered.length > 0 && (
        <p className="text-center text-xs text-slate-400 pb-4">
          Showing {filtered.length} alert{filtered.length !== 1 ? 's' : ''}
          {filter !== 'all' ? ` · ${filter} priority` : ''}
        </p>
      )}

      {/* Add Reminder Modal */}
      {showModal && (
        <AddAlertModal
          onClose={() => setShowModal(false)}
          onSave={handleAddAlert}
        />
      )}
=======
import { Bell, Clock, AlertCircle } from 'lucide-react';

const alerts = [
  { id: 1, type: 'follow-up', message: 'Follow up with John Doe regarding Sunset Villa', time: '10:00 AM', priority: 'high' },
  { id: 2, type: 'task', message: 'Prepare contract for Deal #409', time: '2:30 PM', priority: 'medium' },
  { id: 3, type: 'inquiry', message: 'New inquiry received for Ocean View Apartment', time: '4:15 PM', priority: 'low' },
];

const priorityColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-blue-100 text-blue-700',
};

const typeIcons = {
  'follow-up': Clock,
  'task': AlertCircle,
  'inquiry': Bell,
};

export default function Alerts() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Alerts & Reminders</h1>
        <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-sm font-medium">
          {alerts.length} New
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const Icon = typeIcons[alert.type];
          return (
            <div key={alert.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center ${priorityColors[alert.priority].split(' ')[0]} ${priorityColors[alert.priority].split(' ')[1]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium">{alert.message}</p>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[alert.priority]}`}>
                    {alert.priority.toUpperCase()}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.time}
                  </span>
                </div>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Resolve
              </button>
            </div>
          );
        })}
      </div>
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
    </div>
  );
}
