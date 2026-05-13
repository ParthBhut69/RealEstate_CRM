<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { MessageSquare, Plus, X, Pencil, Trash2, FileText, Send, Search, Phone, MessageCircle, ChevronLeft, ChevronRight, Filter, RotateCcw } from 'lucide-react';
import FilterDrawer from '../components/common/FilterDrawer';
import SearchableSelect from '../components/common/SearchableSelect';
import Modal from '../components/common/Modal';

const STATUS_COLORS = {
  'New': 'bg-blue-100 text-blue-700',
  'Interested': 'bg-emerald-100 text-emerald-700',
  'Site Visit Planned': 'bg-purple-100 text-purple-700',
  'Negotiation': 'bg-orange-100 text-orange-700',
  'Closed': 'bg-green-100 text-green-700',
  'Not Interested': 'bg-red-100 text-red-700'
};

const LOCATION_OPTIONS = [
  { value: '', label: 'All Locations' },
  { value: 'BVI West', label: 'BVI West' },
  { value: 'BVI East', label: 'BVI East' },
  { value: 'KVI West', label: 'KVI West' },
  { value: 'KVI East', label: 'KVI East' },
  { value: 'Others', label: 'Others' }
];

const CONFIG_OPTIONS = [
  { value: '', label: 'All BHK' },
  { value: '1 BHK', label: '1 BHK' },
  { value: '2 BHK', label: '2 BHK' },
  { value: '3 BHK', label: '3 BHK' },
  { value: '4 BHK', label: '4 BHK' },
  { value: 'Studio', label: 'Studio' },
  { value: 'Penthouse', label: 'Penthouse' },
  { value: 'Duplex', label: 'Duplex' }
];

const SOURCE_OPTIONS = [
  { value: '', label: 'All Sources' },
  { value: 'YouTube', label: 'YouTube' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Magic Bricks', label: 'Magic Bricks' },
  { value: 'Others', label: 'Others' }
];

export default function Inquiries() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Follow-up Notes State
=======
import { useState, useEffect } from 'react';
import api from '../api/axios';
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

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
>>>>>>> dbb33eb4a79c8ab4bc7e02b76e1c4bdd46ff9726
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
<<<<<<< HEAD
  
  // Filters
  const [search, setSearch] = useState('');
  const [buildingSearch, setBuildingSearch] = useState('');
  const [filters, setFilters] = useState({
    inquiry_type: '',
    preferred_location: '',
    inquiry_source: '',
    followup_status: '',
    followup_date_filter: '',
    property_size: '',
    min_budget: '',
    max_budget: ''
  });

  const activeFiltersCount = Object.entries(filters).filter(([_, v]) => v !== '').length + (search ? 1 : 0) + (buildingSearch ? 1 : 0);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search,
        building_name: buildingSearch,
        ...filters
      };
      
      // Clean up empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const { data } = await api.get('/inquiries', { params });
      setInquiries(data.data || []);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, buildingSearch, filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInquiries();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchInquiries]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setSearch('');
    setBuildingSearch('');
    setFilters({
      inquiry_type: '',
      preferred_location: '',
      inquiry_source: '',
      followup_status: '',
      followup_date_filter: '',
      property_size: '',
      min_budget: '',
      max_budget: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const removeFilter = (key) => {
    if (key === 'search') setSearch('');
    else if (key === 'building_name') setBuildingSearch('');
    else setFilters(prev => ({ ...prev, [key]: '' }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getActiveFilterLabel = (key, value) => {
    if (key === 'inquiry_type') return `Type: ${value}`;
    if (key === 'preferred_location') return `Location: ${value}`;
    if (key === 'inquiry_source') return `Source: ${value}`;
    if (key === 'followup_status') return `Status: ${value}`;
    if (key === 'followup_date_filter') return `Date: ${value}`;
    if (key === 'property_size') return `BHK: ${value}`;
    if (key === 'min_budget') return `Min: ${value} Cr`;
    if (key === 'max_budget') return `Max: ${value} Cr`;
    return `${key}: ${value}`;
  };

  const getRowClass = (inq) => {
    if (inq.followup_status === 'Closed') return 'opacity-60 bg-slate-50';
    const today = new Date().toISOString().split('T')[0];
    if (inq.next_followup_date && inq.next_followup_date < today && inq.followup_status !== 'Not Interested') {
      return 'bg-red-50/50';
    }
    return 'hover:bg-slate-50';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await api.delete(`/inquiries/${id}`);
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete inquiry');
    }
  };

  const openNotes = async (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowNotesModal(true);
    setLoadingNotes(true);
    try {
      const { data } = await api.get(`/inquiries/${inquiry.id}/notes`);
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNotes(false);
=======

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    try {
      const { data } = await api.get('/inquiries');
      setInquiries(data);
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
>>>>>>> dbb33eb4a79c8ab4bc7e02b76e1c4bdd46ff9726
    }
  };

  const closeNotes = () => {
    setShowNotesModal(false);
    setSelectedInquiry(null);
<<<<<<< HEAD
    setNotes([]);
=======
>>>>>>> dbb33eb4a79c8ab4bc7e02b76e1c4bdd46ff9726
    setNewNote('');
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSavingNote(true);
    try {
      const { data } = await api.post(`/inquiries/${selectedInquiry.id}/notes`, { note: newNote });
<<<<<<< HEAD
      setNotes(prev => [data, ...prev]);
      setNewNote('');
      // Refresh inquiries to update last_followup_date
      fetchInquiries();
    } catch (err) {
      console.error(err);
=======
      setNotes(prev => [...prev, data]);
      setNewNote('');
    } catch (err) {
      alert('Failed to add note');
>>>>>>> dbb33eb4a79c8ab4bc7e02b76e1c4bdd46ff9726
    } finally {
      setSavingNote(false);
    }
  };

<<<<<<< HEAD
  const [loadingNotes, setLoadingNotes] = useState(false);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">Inquiries</h1>
          <p className="text-sm text-slate-500 font-medium">Manage client requirements and follow-ups</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold active:scale-95 transition-all shadow-sm"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => navigate('/add-inquiry')} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-100"
          >
            <Plus className="w-5 h-5" /> Add Inquiry
          </button>
        </div>
      </div>

      {/* Desktop Filter Bar */}
      <div className="hidden md:block bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Filter className="w-4 h-4 text-emerald-600" />
            Advanced Filters
          </div>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="text-sm text-red-500 font-bold hover:text-red-600 flex items-center gap-1 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Client Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Name/Contact..." 
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all font-medium"
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Building Name</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search project..." 
                value={buildingSearch}
                onChange={(e) => { setBuildingSearch(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all font-medium"
              />
            </div>
          </div>

          <SearchableSelect 
            label="Location"
            options={LOCATION_OPTIONS}
            value={filters.preferred_location}
            onChange={(val) => handleFilterChange('preferred_location', val)}
            placeholder="All Locations"
            accentColor="emerald"
          />

          <SearchableSelect 
            label="Status"
            options={[{ value: '', label: 'All Statuses' }, ...Object.keys(STATUS_COLORS).map(s => ({ value: s, label: s }))]}
            value={filters.followup_status}
            onChange={(val) => handleFilterChange('followup_status', val)}
            placeholder="Any Status"
            accentColor="emerald"
          />

          <SearchableSelect 
            label="BHK"
            options={CONFIG_OPTIONS}
            value={filters.property_size}
            onChange={(val) => handleFilterChange('property_size', val)}
            placeholder="Any BHK"
            accentColor="emerald"
          />

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Min Cr</label>
              <input 
                type="number" 
                step="0.1"
                placeholder="0.0" 
                value={filters.min_budget}
                onChange={(e) => handleFilterChange('min_budget', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all font-medium"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Max Cr</label>
              <input 
                type="number" 
                step="0.1"
                placeholder="50+" 
                value={filters.max_budget}
                onChange={(e) => handleFilterChange('max_budget', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
              Search: {search}
              <X className="w-3 h-3 cursor-pointer hover:text-emerald-900" onClick={() => removeFilter('search')} />
            </span>
          )}
          {buildingSearch && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
              Building: {buildingSearch}
              <X className="w-3 h-3 cursor-pointer hover:text-emerald-900" onClick={() => removeFilter('building_name')} />
            </span>
          )}
          {Object.entries(filters).filter(([_, v]) => v !== '').map(([key, value]) => (
            <span key={key} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
              {getActiveFilterLabel(key, value)}
              <X className="w-3 h-3 cursor-pointer hover:text-slate-900" onClick={() => removeFilter(key)} />
            </span>
          ))}
        </div>
      )}

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        onClear={clearFilters}
        activeCount={activeFiltersCount}
        accentColor="emerald"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Client Search</label>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Name/Contact..." 
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Building Name</label>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search project..." 
                value={buildingSearch}
                onChange={(e) => { setBuildingSearch(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all" 
              />
            </div>
          </div>

          <SearchableSelect 
            label="Location"
            options={LOCATION_OPTIONS}
            value={filters.preferred_location}
            onChange={(val) => handleFilterChange('preferred_location', val)}
            placeholder="All Locations"
            accentColor="emerald"
          />

          <SearchableSelect 
            label="Status"
            options={[{ value: '', label: 'All Statuses' }, ...Object.keys(STATUS_COLORS).map(s => ({ value: s, label: s }))]}
            value={filters.followup_status}
            onChange={(val) => handleFilterChange('followup_status', val)}
            placeholder="Any Status"
            accentColor="emerald"
          />

          <SearchableSelect 
            label="BHK"
            options={CONFIG_OPTIONS}
            value={filters.property_size}
            onChange={(val) => handleFilterChange('property_size', val)}
            placeholder="Any BHK"
            accentColor="emerald"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Min Cr</label>
              <input 
                type="number" 
                step="0.1"
                placeholder="0.0" 
                value={filters.min_budget}
                onChange={(e) => handleFilterChange('min_budget', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Max Cr</label>
              <input 
                type="number" 
                step="0.1"
                placeholder="50+" 
                value={filters.max_budget}
                onChange={(e) => handleFilterChange('max_budget', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all font-medium"
              />
            </div>
          </div>

          <SearchableSelect 
            label="Source"
            options={SOURCE_OPTIONS}
            value={filters.inquiry_source}
            onChange={(val) => handleFilterChange('inquiry_source', val)}
            placeholder="All Sources"
            accentColor="emerald"
          />

          <SearchableSelect 
            label="Follow-up Filter"
            options={[
              { value: '', label: 'All Follow-ups' },
              { value: 'today', label: "Today's Follow-ups" },
              { value: 'overdue', label: 'Overdue Follow-ups' }
            ]}
            value={filters.followup_date_filter}
            onChange={(val) => handleFilterChange('followup_date_filter', val)}
            placeholder="Select..."
            accentColor="emerald"
          />
        </div>
      </FilterDrawer>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Client</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact Info</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Requirement</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Budget (Cr)</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Follow-up Date</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && inquiries.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-500">Loading inquiries...</td></tr>
              ) : inquiries.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-500">No inquiries found. <button onClick={() => navigate('/add-inquiry')} className="text-emerald-600 font-medium hover:underline">Add one →</button></td></tr>
              ) : (
                inquiries.map(inq => (
                  <tr key={inq.id} className={`transition-colors ${getRowClass(inq)}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{inq.client_name}</p>
                          <p className="text-xs text-slate-500">{inq.inquiry_source || 'Unknown source'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-700">{inq.contact_number}</p>
                      {inq.email_id && <p className="text-xs text-slate-500">{inq.email_id}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-700">{inq.inquiry_type} - {inq.property_size}</p>
                      <p className="text-xs text-slate-500">{inq.preferred_location}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 font-medium">
                      {inq.budget ? `₹${inq.budget}` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-700">
                        {inq.next_followup_date ? new Date(inq.next_followup_date).toLocaleDateString() : '-'}
                      </p>
                      {inq.last_followup_date && (
                        <p className="text-xs text-slate-500">Last: {new Date(inq.last_followup_date).toLocaleDateString()}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[inq.followup_status] || 'bg-slate-100 text-slate-700'}`}>
                        {inq.followup_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a href={`tel:${inq.contact_number}`} title="Call" className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Phone className="w-4 h-4" /></a>
                        <a href={`https://wa.me/${inq.contact_number.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" title="WhatsApp" className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors"><MessageCircle className="w-4 h-4" /></a>
                        <button onClick={() => openNotes(inq)} title="Follow-ups" className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"><FileText className="w-4 h-4" /></button>
                        <button onClick={() => navigate(`/inquiries/${inq.id}/edit`)} title="Edit" className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(inq.id)} title="Delete" className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
=======
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Inquiries</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Inquiry
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
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Actions</th>
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
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(inq.status)}`}>{inq.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(inq.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openNotes(inq)} title="Follow-ups" className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"><FileText className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(inq)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(inq.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No inquiries found. <button onClick={openAdd} className="text-emerald-600 font-medium hover:underline">Add one →</button></td></tr>
>>>>>>> dbb33eb4a79c8ab4bc7e02b76e1c4bdd46ff9726
              )}
            </tbody>
          </table>
        </div>
<<<<<<< HEAD
        
        {/* Pagination */}
        {!loading && inquiries.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
            <span className="text-sm text-slate-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-emerald-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-slate-700 px-2">{pagination.page} / {pagination.totalPages || 1}</span>
              <button 
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-emerald-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showNotesModal && selectedInquiry && (
        <Modal title={`Follow-ups: ${selectedInquiry.client_name}`} onClose={closeNotes}>
          <div className="flex flex-col h-[500px]">
            {/* Notes List */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              {loadingNotes ? (
                <div className="h-full flex items-center justify-center text-slate-400">Loading notes...</div>
              ) : notes.length === 0 ? (
=======
      </div>

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
>>>>>>> dbb33eb4a79c8ab4bc7e02b76e1c4bdd46ff9726
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
