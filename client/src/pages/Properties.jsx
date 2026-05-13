import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Home, Plus, X, Pencil, Trash2, Filter, Image as ImageIcon, Download, Share2, Copy, ChevronLeft, ChevronRight, Video, Link as LinkIcon, Search, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import FilterDrawer from '../components/common/FilterDrawer';
import SearchableSelect from '../components/common/SearchableSelect';
import Modal from '../components/common/Modal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const formatRupees = (amount) => {
  if (!amount) return '₹0';
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

const getImages = (imagesStr) => {
  try {
    return JSON.parse(imagesStr || '[]');
  } catch (e) {
    return [];
  }
};

const CONFIG_OPTIONS = [
  { value: '', label: 'All Configurations' },
  { value: '1 BHK', label: '1 BHK' },
  { value: '2 BHK', label: '2 BHK' },
  { value: '3 BHK', label: '3 BHK' },
  { value: '4 BHK', label: '4 BHK' },
  { value: 'Studio', label: 'Studio' },
  { value: 'Penthouse', label: 'Penthouse' },
  { value: 'Duplex', label: 'Duplex' },
  { value: 'Commercial', label: 'Commercial' }
];

const FOR_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'Buy', label: 'Buy' },
  { value: 'Rent', label: 'Rent' }
];

const LOCATION_OPTIONS = [
  { value: '', label: 'All Locations' },
  { value: 'BVI West', label: 'BVI West' },
  { value: 'BVI East', label: 'BVI East' },
  { value: 'KVI West', label: 'KVI West' },
  { value: 'KVI East', label: 'KVI East' },
  { value: 'Others', label: 'Others' }
];

const FURNISH_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'Unfurnished', label: 'Unfurnished' },
  { value: 'Semi Furnished', label: 'Semi Furnished' },
  { value: 'Fully Furnished', label: 'Fully Furnished' }
];

export default function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    configuration: '',
    minPrice: '',
    maxPrice: '',
    property_for: '',
    furnishing_status: '',
    location: '',
    building_name: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  const activeFilters = Object.entries(filters).filter(([key, value]) => value !== '');
  const activeFilterCount = activeFilters.length + (searchTerm ? 1 : 0);

  const fetchProperties = useCallback(async (currentFilters, currentSearch) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      if (currentSearch) params.append('building_name', currentSearch);
      
      const { data } = await api.get(`/properties?${params.toString()}`);
      setProperties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProperties(filters, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters, searchTerm, fetchProperties]);

  const clearFilters = () => {
    setFilters({
      configuration: '',
      minPrice: '',
      maxPrice: '',
      property_for: '',
      furnishing_status: '',
      location: '',
      building_name: ''
    });
    setSearchTerm('');
  };

  const removeFilter = (key) => {
    if (key === 'building_name') {
      setSearchTerm('');
    } else {
      setFilters(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const openEdit = (prop) => navigate(`/properties/${prop.id}/edit`);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete property');
    }
  };

  const closeViewModal = () => setViewing(null);

  const handleDownloadPDF = async (prop) => {
    setDownloadingId(prop.id);
    try {
      const element = document.getElementById(`pdf-${prop.id}`);
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${prop.title.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">Properties</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and list real estate inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold active:scale-95 transition-all shadow-sm"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button onClick={() => navigate('/add-property')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100">
            <Plus className="w-5 h-5" /> Add Property
          </button>
        </div>
      </div>

      {/* Desktop Filter Bar */}
      <div className="hidden md:block bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Filter className="w-4 h-4 text-blue-600" />
            Advanced Filters
          </div>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="text-sm text-red-500 font-bold hover:text-red-600 flex items-center gap-1 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Building Name</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search building..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium" 
              />
            </div>
          </div>
          <SearchableSelect 
            label="Location"
            options={LOCATION_OPTIONS}
            value={filters.location}
            onChange={(val) => handleFilterChange('location', val)}
            placeholder="All Locations"
          />
          <SearchableSelect 
            label="Configuration"
            options={CONFIG_OPTIONS}
            value={filters.configuration}
            onChange={(val) => handleFilterChange('configuration', val)}
            placeholder="All BHK"
          />
          <SearchableSelect 
            label="Property For"
            options={FOR_OPTIONS}
            value={filters.property_for}
            onChange={(val) => handleFilterChange('property_for', val)}
            placeholder="Buy/Rent"
          />
          <SearchableSelect 
            label="Furnishing"
            options={FURNISH_OPTIONS}
            value={filters.furnishing_status}
            onChange={(val) => handleFilterChange('furnishing_status', val)}
            placeholder="Any"
          />
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
              Building: {searchTerm}
              <X className="w-3 h-3 cursor-pointer hover:text-blue-900" onClick={() => removeFilter('building_name')} />
            </span>
          )}
          {activeFilters.map(([key, value]) => {
            const label = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            const optionsMap = {
              location: LOCATION_OPTIONS,
              configuration: CONFIG_OPTIONS,
              property_for: FOR_OPTIONS,
              furnishing_status: FURNISH_OPTIONS
            };
            const displayValue = optionsMap[key]?.find(o => o.value === value)?.label || value;
            return (
              <span key={key} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                {label}: {displayValue}
                <X className="w-3 h-3 cursor-pointer hover:text-slate-900" onClick={() => removeFilter(key)} />
              </span>
            );
          })}
        </div>
      )}

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        onClear={clearFilters}
        activeCount={activeFilterCount}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Building Name</label>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search building..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all" 
              />
            </div>
          </div>
          <SearchableSelect 
            label="Location"
            options={LOCATION_OPTIONS}
            value={filters.location}
            onChange={(val) => handleFilterChange('location', val)}
            placeholder="All Locations"
          />
          <SearchableSelect 
            label="Configuration"
            options={CONFIG_OPTIONS}
            value={filters.configuration}
            onChange={(val) => handleFilterChange('configuration', val)}
            placeholder="All BHK"
          />
          <SearchableSelect 
            label="Property For"
            options={FOR_OPTIONS}
            value={filters.property_for}
            onChange={(val) => handleFilterChange('property_for', val)}
            placeholder="Buy/Rent"
          />
          <SearchableSelect 
            label="Furnishing"
            options={FURNISH_OPTIONS}
            value={filters.furnishing_status}
            onChange={(val) => handleFilterChange('furnishing_status', val)}
            placeholder="Any"
          />
        </div>
      </FilterDrawer>

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
                  <img src={`${API_BASE}${displayImage}`} alt={prop.title} crossOrigin="anonymous" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <Home className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-xs font-medium">No Image</span>
                  </div>
                )}
                
                <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-lg shadow-lg font-bold text-sm">
                  {formatRupees(prop.price)}
                </div>
                
                {imgs.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <ImageIcon className="w-3.5 h-3.5" /> {imgs.length} Photos
                  </div>
                )}
                
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${prop.status === 'Available' ? 'bg-green-500' : prop.status === 'Sold' ? 'bg-red-500' : 'bg-slate-800'}`}>
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
              <button onClick={clearFilters} className="mt-3 text-blue-600 font-medium hover:underline">Clear Filters</button>
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
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden opacity-[0.03] z-0">
              <div className="text-[140px] font-black text-slate-900 -rotate-45 select-none whitespace-nowrap tracking-widest">
                BrokerFlow
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
                  <div className="text-4xl font-black text-blue-600 mb-3">₹{Number(prop.price).toLocaleString()}</div>
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
                      <img src={`${API_BASE}${displayImage}`} crossOrigin="anonymous" className="w-full h-64 object-cover rounded-xl shadow-sm" />
                    </div>
                  )}
                  {imgs.length > 1 && (
                    <div className="col-span-1">
                      <img src={`${API_BASE}${imgs[1]}`} crossOrigin="anonymous" className="w-full h-64 object-cover rounded-xl shadow-sm" />
                    </div>
                  )}
                </div>
                {imgs.length > 2 && (
                  <div className="grid grid-cols-4 gap-4">
                    {imgs.slice(2).map((img, idx) => (
                      <img key={idx} src={`${API_BASE}${img}`} crossOrigin="anonymous" className="w-full h-32 object-cover rounded-xl shadow-sm" />
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
                Generated by BrokerFlow
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
                    <div className="text-4xl font-black text-blue-600 mb-3">₹{Number(prop.price).toLocaleString()}</div>
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
                      <img src={`${API_BASE}${displayImage}`} crossOrigin="anonymous" className="w-full h-64 object-cover rounded-xl shadow-sm" />
                    </div>
                  )}
                  {imgs.length > 1 && (
                    <div className="col-span-1">
                      <img src={`${API_BASE}${imgs[1]}`} crossOrigin="anonymous" className="w-full h-64 object-cover rounded-xl shadow-sm" />
                    </div>
                  )}
                </div>
                {imgs.length > 2 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {imgs.slice(2).map((img, idx) => (
                      <img key={idx} src={`${API_BASE}${img}`} crossOrigin="anonymous" className="h-24 w-32 object-cover rounded-lg shadow-sm flex-shrink-0" />
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


    </div>
  );
}
