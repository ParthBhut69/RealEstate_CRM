import { useState, useEffect } from 'react';
import api from '../api/axios';
<<<<<<< HEAD
import { MessageSquare, Plus, X, Pencil, Trash2, FileText, Send } from 'lucide-react';

const STATUS_OPTIONS = ['New', 'In Progress', 'Resolved', 'Closed'];
const EMPTY_FORM = { customer_name: '', contact_info: '', status: 'New' };

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
import { MessageSquare } from 'lucide-react';
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => { fetchInquiries(); }, []);
=======

  useEffect(() => {
    fetchInquiries();
  }, []);
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a

  const fetchInquiries = async () => {
    try {
      const { data } = await api.get('/inquiries');
      setInquiries(data);
<<<<<<< HEAD
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setShowModal(true); };
  const openEdit = (inq) => { setEditing(inq); setForm({ customer_name: inq.customer_name, contact_info: inq.contact_info, status: inq.status }); setError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setError(''); };

  const openNotes = async (inq) => {
    setSelectedInquiry(inq);
    setShowNotesModal(true);
    setNotes([]);
    try {
      const { data } = await api.get(`/inquiries/${inq.id}/notes`);
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    }
  };

  const closeNotes = () => {
    setShowNotesModal(false);
    setSelectedInquiry(null);
    setNewNote('');
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSavingNote(true);
    try {
      const { data } = await api.post(`/inquiries/${selectedInquiry.id}/notes`, { note: newNote });
      setNotes(prev => [...prev, data]);
      setNewNote('');
    } catch (err) {
      alert('Failed to add note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.contact_info) { setError('Customer name and contact info are required.'); return; }
    setSaving(true); setError('');
    try {
      if (editing) {
        await api.put(`/inquiries/${editing.id}`, form);
      } else {
        await api.post('/inquiries', form);
      }
      await fetchInquiries();
      closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try { await api.delete(`/inquiries/${id}`); setInquiries(prev => prev.filter(i => i.id !== id)); }
    catch (err) { alert('Failed to delete.'); }
  };

  const statusColor = (s) => s === 'New' ? 'bg-blue-100 text-blue-700' : s === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : s === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700';

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
        <h1 className="text-2xl font-bold text-slate-800">Inquiries</h1>
<<<<<<< HEAD
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Inquiry
=======
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
          Add Inquiry
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Customer</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Contact Info</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
<<<<<<< HEAD
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Actions</th>
=======
                <th className="px-6 py-4"></th>
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {inquiries.map(inq => (
                <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-800">{inq.customer_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{inq.contact_info}</td>
                  <td className="px-6 py-4">
<<<<<<< HEAD
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(inq.status)}`}>{inq.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(inq.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openNotes(inq)} title="Follow-ups" className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"><FileText className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(inq)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(inq.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
=======
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      {inq.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View</button>
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
<<<<<<< HEAD
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No inquiries found. <button onClick={openAdd} className="text-emerald-600 font-medium hover:underline">Add one →</button></td></tr>
=======
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No inquiries found.
                  </td>
                </tr>
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
              )}
            </tbody>
          </table>
        </div>
      </div>
<<<<<<< HEAD

      {showModal && (
        <Modal title={editing ? 'Edit Inquiry' : 'Add Inquiry'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name *</label>
              <input type="text" value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} placeholder="e.g. John Smith" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Info *</label>
              <input type="text" value={form.contact_info} onChange={e => setForm({...form, contact_info: e.target.value})} placeholder="Email or phone number" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Add Inquiry'}</button>
            </div>
          </form>
        </Modal>
      )}
      {showNotesModal && selectedInquiry && (
        <Modal title={`Follow-ups: ${selectedInquiry.customer_name}`} onClose={closeNotes}>
          <div className="flex flex-col h-[500px]">
            {/* Notes List */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              {notes.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 opacity-50" />
                  <p className="text-sm">No follow-ups recorded yet.</p>
                </div>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-slate-700 text-sm whitespace-pre-wrap">{note.note}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                      {new Date(note.created_at).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
            
            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-2 shrink-0">
              <input 
                type="text" 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Type follow-up details..." 
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
              />
              <button 
                type="submit" 
                disabled={savingNote || !newNote.trim()}
                className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center shadow-sm"
              >
                {savingNote ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </Modal>
      )}

    </div>
  );
}

=======
    </div>
  );
}
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
