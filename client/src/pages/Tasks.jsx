import { useState, useEffect } from 'react';
import api from '../api/axios';
<<<<<<< HEAD
import { CheckSquare, Plus, X, Pencil, Trash2, Check } from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];
const EMPTY_FORM = { title: '', due_date: '', status: 'Pending' };

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
=======
import { CheckSquare } from 'lucide-react';
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchTasks(); }, []);
=======

  useEffect(() => {
    fetchTasks();
  }, []);
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
<<<<<<< HEAD
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setShowModal(true); };
  const openEdit = (task) => { setEditing(task); setForm({ title: task.title, due_date: task.due_date?.split('T')[0] || '', status: task.status }); setError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setError(''); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.due_date) { setError('Title and due date are required.'); return; }
    setSaving(true); setError('');
    try {
      if (editing) {
        await api.put(`/tasks/${editing.id}`, form);
      } else {
        await api.post('/tasks', form);
      }
      await fetchTasks();
      closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try { await api.delete(`/tasks/${id}`); setTasks(prev => prev.filter(t => t.id !== id)); }
    catch (err) { alert('Failed to delete.'); }
  };

  const toggleComplete = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await api.put(`/tasks/${task.id}`, { ...task, status: newStatus });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    } catch (err) { alert('Failed to update status.'); }
  };

  if (loading) return <div className="text-center p-8 text-slate-500">Loading...</div>;
=======
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Tasks</h1>
<<<<<<< HEAD
        <button onClick={openAdd} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Task
=======
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
          Add Task
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        {tasks.map(task => (
<<<<<<< HEAD
          <div key={task.id} className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-4 rounded-xl group">
            <button onClick={() => toggleComplete(task)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${task.status === 'Completed' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-orange-400'}`}>
              {task.status === 'Completed' && <Check className="w-3.5 h-3.5" />}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-slate-800 ${task.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>{task.title}</h3>
              <p className="text-sm text-slate-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}`}>
              {task.status}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(task)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(task.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
=======
          <div key={task.id} className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-4 rounded-xl">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${task.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
              <CheckSquare className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">{task.title}</h3>
              <p className="text-sm text-slate-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
              {task.status}
            </span>
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12">
<<<<<<< HEAD
            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No tasks found.</p>
            <button onClick={openAdd} className="mt-3 text-orange-600 text-sm font-medium hover:underline">Add your first task →</button>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Task' : 'Add Task'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Task Title *</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Follow up with client" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date *</label>
                <input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Add Task'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

=======
            <p className="text-slate-500">No tasks found. Add one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
