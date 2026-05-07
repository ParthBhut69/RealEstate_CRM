import { useState, useEffect } from 'react';
import api from '../api/axios';
<<<<<<< HEAD
import { Home, Plus, X, Pencil, Trash2, Filter, Image as ImageIcon, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const STATUS_OPTIONS = ['Available', 'Sold', 'Rented', 'Off Market'];
const SIZE_OPTIONS = ['', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK+'];
const TYPE_OPTIONS = ['', 'Rent', 'Buy', 'Commercial'];
const FURNISH_OPTIONS = ['', 'Furnished', 'Semi-Furnished', 'Unfurnished'];

const EMPTY_FORM = { 
  title: '', description: '', price: '', status: 'Available',
  building_name: '', address: '', location: '', area: '', size: '', type: '', 
  amenities: '', furnishing_status: ''
};

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const getImages = (imagesStr) => {
  if (!imagesStr) return [];
  try { return JSON.parse(imagesStr); } catch(e) { return []; }
};
=======
import { Home } from 'lucide-react';
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [showModal, setShowModal] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFiles, setImageFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minArea: '', maxArea: '', size: '', minPrice: '', maxPrice: '', type: '', furnishing_status: '', location: ''
  });

  useEffect(() => { fetchProperties(); }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const { data } = await api.get(`/properties?${params.toString()}`);
      setProperties(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setImageFiles([]); setError(''); setShowModal(true); };
  
  const openEdit = (prop) => { 
    setEditing(prop); 
    setForm({ 
      title: prop.title, description: prop.description || '', price: prop.price, status: prop.status,
      building_name: prop.building_name || '', address: prop.address || '', location: prop.location || '', area: prop.area || '', 
      size: prop.size || '', type: prop.type || '', amenities: prop.amenities || '',
      furnishing_status: prop.furnishing_status || ''
    }); 
    setImageFiles([]);
    setError(''); 
    setShowModal(true); 
  };
  
  const closeModal = () => { setShowModal(false); setEditing(null); setError(''); };
  const closeViewModal = () => setViewing(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) { setError('Title and price are required.'); return; }
    setSaving(true); setError('');
    
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
    }

    try {
      if (editing) {
        await api.put(`/properties/${editing.id}`, formData);
      } else {
        await api.post('/properties', formData);
      }
      await fetchProperties();
      closeModal();
    } catch (err) { setError(err.response?.data?.error || err.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try { await api.delete(`/properties/${id}`); setProperties(prev => prev.filter(p => p.id !== id)); }
    catch (err) { alert('Failed to delete.'); }
  };

  const handleDownloadPDF = async (prop) => {
    const element = document.getElementById(`pdf-${prop.id}`);
    if (!element) return;
    
    try {
      setDownloadingId(prop.id);
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${prop.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('Failed to generate PDF. Make sure images are loaded.');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Properties</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Location</label>
            <input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="e.g. Vasai" className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
            <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {TYPE_OPTIONS.map(o => <option key={o} value={o}>{o || 'All'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Size</label>
            <select name="size" value={filters.size} onChange={handleFilterChange} className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {SIZE_OPTIONS.map(o => <option key={o} value={o}>{o || 'All'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Furnishing</label>
            <select name="furnishing_status" value={filters.furnishing_status} onChange={handleFilterChange} className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {FURNISH_OPTIONS.map(o => <option key={o} value={o}>{o || 'All'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Min Area</label>
            <input type="number" name="minArea" value={filters.minArea} onChange={handleFilterChange} placeholder="sqft" className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Max Area</label>
            <input type="number" name="maxArea" value={filters.maxArea} onChange={handleFilterChange} placeholder="sqft" className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Min Price</label>
            <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="₹" className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Max Price</label>
            <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="₹" className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center p-8 text-slate-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(prop => {
            const imgs = getImages(prop.images);
            const displayImage = prop.image_url || (imgs.length > 0 ? imgs[0] : null);
            
            return (
            <div key={prop.id} onClick={() => setViewing(prop)} className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow group">
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                {displayImage ? (
                  <img src={`http://localhost:5000${displayImage}`} alt={prop.title} crossOrigin="anonymous" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <Home className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-xs font-medium">No Image</span>
                  </div>
                )}
                
                {imgs.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <ImageIcon className="w-3.5 h-3.5" /> {imgs.length} Photos
                  </div>
                )}
                
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${prop.status === 'Available' ? 'bg-green-500 text-white' : prop.status === 'Sold' ? 'bg-red-500 text-white' : 'bg-slate-800 text-white'}`}>
                    {prop.status}
                  </span>
                  {prop.type && <span className="px-2.5 py-1 rounded-full text-xs font-bold shadow-sm bg-blue-600 text-white">{prop.type}</span>}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{prop.title}</h3>
                </div>
                <p className="text-slate-500 text-sm mb-3 line-clamp-1">{prop.building_name} {prop.location && `| ${prop.location}`} {prop.address && `- ${prop.address}`}</p>
                
                <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                  {prop.size && <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">{prop.size}</span>}
                  {prop.area && <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">{prop.area} sq.ft</span>}
                  {prop.furnishing_status && <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">{prop.furnishing_status}</span>}
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xl font-black text-slate-800">{formatRupees(prop.price)}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); handleDownloadPDF(prop); }} disabled={downloadingId === prop.id} title="Export PDF" className="p-2 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50">
                      {downloadingId === prop.id ? <span className="w-4 h-4 block rounded-full border-2 border-slate-300 border-t-green-600 animate-spin"></span> : <Download className="w-4 h-4" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); openEdit(prop); }} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(prop.id); }} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          )})}
          {properties.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-100">
              <Home className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium text-lg">No properties match your criteria.</p>
              <button onClick={() => setFilters({ minArea: '', maxArea: '', size: '', minPrice: '', maxPrice: '', type: '', furnishing_status: '', location: ''})} className="mt-3 text-blue-600 font-medium hover:underline">Clear Filters</button>
            </div>
          )}
        </div>
      )}

      {/* Hidden container for PDF rendering */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        {properties.map(prop => {
          const imgs = getImages(prop.images);
          const displayImage = prop.image_url || (imgs.length > 0 ? imgs[0] : null);
          return (
          <div id={`pdf-${prop.id}`} key={`pdf-${prop.id}`} className="bg-white p-12 w-[800px] font-sans flex flex-col gap-6 text-slate-800 relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden opacity-[0.04] z-0">
              <div className="text-[140px] font-black text-slate-900 -rotate-45 select-none whitespace-nowrap tracking-widest">
                CONFIDENTIAL
              </div>
              <div className="text-[80px] font-black text-slate-900 -rotate-45 select-none whitespace-nowrap tracking-widest mt-12">
                INTERNAL USE ONLY
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 mb-2">{prop.title}</h1>
                  <p className="text-xl text-slate-500">{prop.building_name} {prop.location && `| ${prop.location}`} {prop.address && `- ${prop.address}`}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-blue-600 mb-2">{formatRupees(prop.price)}</div>
                  <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full mt-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">{prop.status}</span>
                  </div>
                </div>
              </div>

              {/* Images Grid */}
              <div className="space-y-4">
                <div className={`grid ${imgs.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                  {displayImage && (
                    <div className="col-span-1">
                      <img src={`http://localhost:5000${displayImage}`} crossOrigin="anonymous" className="w-full h-64 object-cover rounded-xl shadow-sm" />
                    </div>
                  )}
                  {imgs.length > 1 && (
                    <div className="col-span-1">
                      <img src={`http://localhost:5000${imgs[1]}`} crossOrigin="anonymous" className="w-full h-64 object-cover rounded-xl shadow-sm" />
                    </div>
                  )}
                </div>
                {imgs.length > 2 && (
                  <div className="grid grid-cols-4 gap-4">
                    {imgs.slice(2).map((img, idx) => (
                      <img key={idx} src={`http://localhost:5000${img}`} crossOrigin="anonymous" className="w-full h-32 object-cover rounded-xl shadow-sm" />
                    ))}
                  </div>
                )}
              </div>

            {/* Specs */}
            <div className="flex gap-4 border-y border-slate-200 py-6">
              {prop.type && (
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Type</div>
                  <div className="text-lg font-bold">{prop.type}</div>
                </div>
              )}
              {prop.size && (
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Configuration</div>
                  <div className="text-lg font-bold">{prop.size}</div>
                </div>
              )}
              {prop.area && (
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Area</div>
                  <div className="text-lg font-bold">{prop.area} sq.ft</div>
                </div>
              )}
              {prop.furnishing_status && (
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Furnishing</div>
                  <div className="text-lg font-bold">{prop.furnishing_status}</div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-3 gap-8 pt-4">
              <div className="col-span-2 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Description</h3>
                  <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{prop.description || 'No description provided.'}</p>
                </div>
              </div>
              <div className="col-span-1 space-y-4">
                {prop.amenities && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Amenities</h3>
                    <ul className="space-y-2">
                      {prop.amenities.split(',').map((am, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {am.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

              {/* Footer */}
              <div className="mt-auto pt-8 text-center text-slate-400 text-sm font-medium border-t border-slate-100">
                Generated by Real Estate CRM
              </div>
            </div>
          </div>
        )})}
      </div>

      {viewing && (
        <Modal title="Property Details" onClose={closeViewModal}>
          {(() => {
            const prop = viewing;
            const imgs = getImages(prop.images);
            const displayImage = prop.image_url || (imgs.length > 0 ? imgs[0] : null);
            return (
              <div className="font-sans flex flex-col gap-6 text-slate-800">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">{prop.title}</h1>
                    <p className="text-lg text-slate-500">{prop.building_name} {prop.location && `| ${prop.location}`} {prop.address && `- ${prop.address}`}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-blue-600 mb-2">{formatRupees(prop.price)}</div>
                    <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full mt-2">
                      <span className={`w-2 h-2 rounded-full ${prop.status === 'Available' ? 'bg-green-500' : prop.status === 'Sold' ? 'bg-red-500' : 'bg-slate-800'}`}></span>
                      <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">{prop.status}</span>
                    </div>
                  </div>
                </div>

                {/* Images Grid */}
                <div className={`grid ${imgs.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                  {displayImage && (
                    <div className="col-span-1">
                      <img src={`http://localhost:5000${displayImage}`} crossOrigin="anonymous" className="w-full h-64 object-cover rounded-xl shadow-sm" />
                    </div>
                  )}
                  {imgs.length > 1 && (
                    <div className="col-span-1">
                      <img src={`http://localhost:5000${imgs[1]}`} crossOrigin="anonymous" className="w-full h-64 object-cover rounded-xl shadow-sm" />
                    </div>
                  )}
                </div>
                {imgs.length > 2 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {imgs.slice(2).map((img, idx) => (
                      <img key={idx} src={`http://localhost:5000${img}`} crossOrigin="anonymous" className="h-24 w-32 object-cover rounded-lg shadow-sm flex-shrink-0" />
                    ))}
                  </div>
                )}

                {/* Specs */}
                <div className="flex flex-wrap gap-4 border-y border-slate-200 py-6">
                  {prop.type && (
                    <div className="flex-1 min-w-[120px] bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Type</div>
                      <div className="text-lg font-bold">{prop.type}</div>
                    </div>
                  )}
                  {prop.size && (
                    <div className="flex-1 min-w-[120px] bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Configuration</div>
                      <div className="text-lg font-bold">{prop.size}</div>
                    </div>
                  )}
                  {prop.area && (
                    <div className="flex-1 min-w-[120px] bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Area</div>
                      <div className="text-lg font-bold">{prop.area} sq.ft</div>
                    </div>
                  )}
                  {prop.furnishing_status && (
                    <div className="flex-1 min-w-[120px] bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Furnishing</div>
                      <div className="text-lg font-bold">{prop.furnishing_status}</div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Description</h3>
                      <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{prop.description || 'No description provided.'}</p>
                    </div>
                  </div>
                  <div className="md:col-span-1 space-y-4">
                    {prop.amenities && (
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Amenities</h3>
                        <ul className="space-y-2">
                          {prop.amenities.split(',').map((am, i) => (
                            <li key={i} className="flex items-center gap-2 text-slate-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {am.trim()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Property' : 'Add Property'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Luxury Apartment" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Building / Project Name</label>
                <input type="text" value={form.building_name} onChange={e => setForm({...form, building_name: e.target.value})} placeholder="e.g. Sunset Heights" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Vasai, Mumbai" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Address</label>
                <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Full location address" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {TYPE_OPTIONS.map((o,i) => <option key={i} value={o}>{o || 'Select...'}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Size</label>
                <select value={form.size} onChange={e => setForm({...form, size: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {SIZE_OPTIONS.map((o,i) => <option key={i} value={o}>{o || 'Select...'}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Area (sq.ft)</label>
                <input type="number" value={form.area} onChange={e => setForm({...form, area: e.target.value})} placeholder="e.g. 1200" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Furnishing Status</label>
                <select value={form.furnishing_status} onChange={e => setForm({...form, furnishing_status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {FURNISH_OPTIONS.map((o,i) => <option key={i} value={o}>{o || 'Select...'}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹) *</label>
                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Property Images</label>
                <input type="file" multiple accept="image/*" onChange={e => setImageFiles(Array.from(e.target.files))} className="w-full px-3 py-[7px] text-sm border border-slate-200 rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {imageFiles.length > 0 && <p className="text-xs text-slate-500 mt-1">{imageFiles.length} file(s) selected</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Amenities</label>
                <input type="text" value={form.amenities} onChange={e => setForm({...form, amenities: e.target.value})} placeholder="e.g. Pool, Gym, Parking (comma separated)" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Detailed property description..." className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={closeModal} className="px-5 py-2.5 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 shadow-sm">{saving ? 'Saving...' : editing ? 'Update Property' : 'Add Property'}</button>
            </div>
          </form>
        </Modal>
      )}
=======

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data } = await api.get('/properties');
      setProperties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Properties</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(prop => (
          <div key={prop.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${prop.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                {prop.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{prop.title}</h3>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{prop.description}</p>
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="font-bold text-blue-600">${Number(prop.price).toLocaleString()}</span>
              <button className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">View Details</button>
            </div>
          </div>
        ))}
        {properties.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-500">No properties found. Add one to get started.</p>
          </div>
        )}
      </div>
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
    </div>
  );
}
