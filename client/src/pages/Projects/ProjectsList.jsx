import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, MapPin, Building2, Tag, ArrowRight, Loader2, X, Pencil } from 'lucide-react';
import api from '../../api/axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function ProjectsList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const { data } = await api.get(`/projects?${params.toString()}`);
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ search: '', location: '', type: '', status: '' });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">BrokerFlow Projects</h1>
          <p className="text-slate-500 mt-1 font-medium">Discover and manage premium real estate projects.</p>
        </div>
        <button
          onClick={() => navigate('/projects/new')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by project name or description..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${showFilters ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            <Filter className="w-5 h-5" />
            Filters
            {Object.values(filters).filter(v => v !== '').length > 0 && (
              <span className="bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {Object.values(filters).filter(v => v !== '').length}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="e.g. Downtown"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="Ready to Move">Ready to Move</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Sold Out">Sold Out</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2.5 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Fetching the best projects for you...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div key={project.id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                {project.thumbnail ? (
                  <img src={`${API_BASE}${project.thumbnail}`} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Building2 className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    project.status === 'Ready to Move' ? 'text-green-600' : 
                    project.status === 'Sold Out' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-4 py-1.5 rounded-full shadow-lg font-bold text-sm">
                  ₹{Number(project.total_price).toLocaleString()}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-slate-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">{project.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                    {project.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-100">
                      {project.property_type}
                    </span>
                    <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-100">
                      {project.total_size}
                    </span>
                  </div>
                </div>

                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/projects/${project.id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all group/btn"
                    >
                      View
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to={`/projects/${project.id}/edit`}
                      className="px-4 flex items-center justify-center bg-slate-50 text-slate-600 rounded-2xl hover:bg-blue-50 hover:text-blue-600 border border-slate-100 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Pencil className="w-5 h-5" />
                    </Link>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-[2rem] border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
            <Building2 className="w-10 h-10" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800">No Projects Found</h3>
            <p className="text-slate-500 mt-1 max-w-xs">We couldn't find any projects matching your current filters.</p>
            <button onClick={clearFilters} className="mt-4 text-blue-600 font-bold hover:underline">Clear all filters</button>
          </div>
        </div>
      )}
    </div>
  );
}
