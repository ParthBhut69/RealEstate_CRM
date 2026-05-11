import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, X, Upload, MapPin, Building2, Ruler, DollarSign, Calendar, Info, Check, Globe } from 'lucide-react';
import api from '../../api/axios';

const AMENITIES_OPTIONS = [
  'Swimming Pool', 'Gymnasium', 'Club House', 'Park', 'Children Play Area', 
  '24x7 Security', 'Power Backup', 'Lift', 'Parking', 'Jogging Track'
];

const PROPERTY_TYPES = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa', 'Commercial', 'Plot'];

export default function ProjectForm({ isEdit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    defaultValues: {
      status: 'Under Construction',
      amenities: []
    }
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchProject();
    }
  }, [isEdit, id]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      // Parse amenities if they come as a comma-separated string
      const amenities = data.amenities ? data.amenities.split(',').map(a => a.trim()) : [];
      
      reset({
        ...data,
        amenities: amenities
      });
      
      if (data.images) {
        const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
        setPreviews(data.images.map(img => `${API_BASE_URL}${img}`));
      }
    } catch (err) {
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...files]);
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'amenities') {
          formData.append(key, Array.isArray(data[key]) ? data[key].join(', ') : data[key]);
        } else {
          formData.append(key, data[key]);
        }
      });

      images.forEach(image => {
        formData.append('images', image);
      });

      if (isEdit) {
        await api.put(`/projects/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/projects', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="bg-blue-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            {isEdit ? 'Update Project' : 'Add New Project'}
          </h1>
          <p className="text-blue-100 text-sm mt-1">Fill in the details to list your property project on BrokerFlow.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Basic Details */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name *</label>
                <input
                  {...register('name', { required: 'Project name is required' })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g. Skyline Residency"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    {...register('location', { required: 'Location is required' })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g. Downtown, New York"
                  />
                </div>
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                {...register('description')}
                rows="4"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Describe the project features, USPs..."
              ></textarea>
            </div>
          </section>

          {/* Property Specifics */}
          <section className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
                <select
                  {...register('property_type')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Size (Acres/Units)</label>
                <input
                  {...register('total_size')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g. 10 Acres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sq Ft Area</label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    {...register('sqft_area')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="1200"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES_OPTIONS.map(amenity => (
                    <label key={amenity} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600">
                      <input
                        type="checkbox"
                        value={amenity}
                        {...register('amenities')}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="Under Construction">Under Construction</option>
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Possession Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      {...register('possession_date')}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing & Builder */}
          <section className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-500" />
              Pricing & Builder Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price Per Sq Ft</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-medium">₹</span>
                  <input
                    type="number"
                    {...register('price_per_sqft')}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="5000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-medium">₹</span>
                  <input
                    type="number"
                    {...register('total_price')}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="60,000,000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Builder Name</label>
                <input
                  {...register('builder_name')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g. Prestige Group"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Builder Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    {...register('builder_website')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="https://www.builder.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">RERA Number</label>
                <input
                  {...register('rera_number')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="RERA/PR/12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Google Maps Location Link</label>
                <input
                  {...register('map_location')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="https://goo.gl/maps/..."
                />
              </div>
            </div>
          </section>

          {/* Image Upload */}
          <section className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-500" />
              Project Images
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-300 transition-all text-slate-400">
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-xs font-medium">Add Photo</span>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </section>

          <div className="pt-8 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-200 font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  {isEdit ? 'Update Project' : 'Create Project'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
