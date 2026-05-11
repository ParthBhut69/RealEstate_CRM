import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Home, Briefcase, MessageSquare, CheckSquare, ArrowLeft, Save, Building2, MapPin, DollarSign, User, Calendar, Type } from 'lucide-react';
import { FormCard, FormGroup, Input, Select, Textarea, Button, FileInput } from '../components/common/FormComponents';
import api from '../api/axios';

const CONFIG = {
  property: {
    title: 'Add New Property',
    subtitle: 'List a new real estate property in the system.',
    icon: Home,
    endpoint: '/properties',
    fields: [
      { name: 'title', label: 'Property Title', icon: Type, required: true },
      { name: 'building_name', label: 'Building/Project Name', icon: Building2 },
      { name: 'price', label: 'Asking Price', icon: DollarSign, type: 'number', required: true },
      { name: 'location', label: 'General Location', icon: MapPin },
      { name: 'address', label: 'Full Address', icon: MapPin },
      { name: 'area', label: 'Area (sq.ft)', icon: Building2, type: 'number' },
      { name: 'size', label: 'Configuration', type: 'select', options: [
        { value: '', label: 'Select BHK...' },
        { value: '1 BHK', label: '1 BHK' },
        { value: '2 BHK', label: '2 BHK' },
        { value: '3 BHK', label: '3 BHK' },
        { value: '4 BHK+', label: '4 BHK+' }
      ]},
      { name: 'status', label: 'Listing Status', type: 'select', options: [
        { value: 'Available', label: 'Available' },
        { value: 'Sold', label: 'Sold' },
        { value: 'Rented', label: 'Rented' }
      ]},
      { name: 'type', label: 'Category', type: 'select', options: [
        { value: 'Buy', label: 'For Sale' },
        { value: 'Rent', label: 'For Rent' }
      ]},
      { name: 'furnishing_status', label: 'Furnishing', type: 'select', options: [
        { value: 'Unfurnished', label: 'Unfurnished' },
        { value: 'Semi-Furnished', label: 'Semi-Furnished' },
        { value: 'Furnished', label: 'Furnished' }
      ]},
      { name: 'amenities', label: 'Amenities (Comma separated)', icon: CheckSquare },
      { name: 'images', label: 'Property Photos', type: 'file' },
      { name: 'description', label: 'Detailed Description', type: 'textarea' }
    ]
  },
  project: {
    title: 'Launch New Project',
    subtitle: 'Create a comprehensive real estate development project.',
    icon: Briefcase,
    endpoint: '/projects',
    fields: [
      { name: 'name', label: 'Project Name', icon: Briefcase, required: true },
      { name: 'location', label: 'Project Location', icon: MapPin, required: true },
      { name: 'property_type', label: 'Project Type', type: 'select', options: [
        { value: 'Apartment', label: 'Apartment' },
        { value: 'Villa', label: 'Villa' },
        { value: 'Plot', label: 'Plot' },
        { value: 'Commercial', label: 'Commercial' }
      ]},
      { name: 'total_size', label: 'Total Size (Acres/Units)', icon: Building2 },
      { name: 'sqft_area', label: 'Total Sq Ft', type: 'number', icon: Building2 },
      { name: 'status', label: 'Development Status', type: 'select', options: [
        { value: 'Under Construction', label: 'Under Construction' },
        { value: 'Ready to Move', label: 'Ready to Move' },
        { value: 'Sold Out', label: 'Sold Out' }
      ]},
      { name: 'possession_date', label: 'Possession Date', type: 'date', icon: Calendar },
      { name: 'total_price', label: 'Total Project Value', icon: DollarSign, type: 'number' },
      { name: 'builder_name', label: 'Builder Name', icon: User },
      { name: 'rera_number', label: 'RERA Number', icon: CheckSquare },
      { name: 'amenities', label: 'Amenities (Comma separated)', icon: CheckSquare },
      { name: 'images', label: 'Project Portfolio Photos', type: 'file' },
      { name: 'description', label: 'About the Project', type: 'textarea' }
    ]
  },
  inquiry: {
    title: 'Register Inquiry',
    subtitle: 'Capture a new customer inquiry for tracking.',
    icon: MessageSquare,
    endpoint: '/inquiries',
    fields: [
      { name: 'customer_name', label: 'Customer Full Name', icon: User, required: true },
      { name: 'contact_info', label: 'Contact Details (Email/Phone)', icon: MapPin, required: true },
      { name: 'property_id', label: 'Property ID (Optional)', type: 'number' },
      { name: 'status', label: 'Lead Status', type: 'select', options: [
        { value: 'New', label: 'New Lead' },
        { value: 'Follow Up', label: 'Follow Up' },
        { value: 'Negotiation', label: 'Negotiation' },
        { value: 'Closed', label: 'Closed' }
      ]}
    ]
  },
  task: {
    title: 'Schedule New Task',
    subtitle: 'Keep track of your appointments and daily duties.',
    icon: CheckSquare,
    endpoint: '/tasks',
    fields: [
      { name: 'title', label: 'Task Title', icon: Type, required: true },
      { name: 'due_date', label: 'Due Date & Time', icon: Calendar, type: 'datetime-local', required: true },
      { name: 'status', label: 'Current Status', type: 'select', options: [
        { value: 'Pending', label: 'Pending' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' }
      ]}
    ]
  }
};

export default function GenericFormPage({ type }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileList, setFileList] = useState([]);
  const config = CONFIG[type];

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'images') formData.append(key, value);
      });

      if (fileList.length > 0) {
        Array.from(fileList).forEach(file => {
          formData.append('images', file);
        });
      }

      await api.post(config.endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate(-1);
    } catch (err) {
      console.error('Submission failed', err);
      setError(err.response?.data?.message || 'Failed to save data. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  if (!config) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-sans">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-blue-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back to Dashboard
      </button>

      <FormCard 
        title={config.title} 
        subtitle={config.subtitle} 
        icon={config.icon}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {error && (
            <div className="bg-red-50 border-2 border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold animate-in shake duration-500">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {config.fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <FormGroup label={field.label} error={errors[field.name]?.message} required={field.required}>
                  {field.type === 'select' ? (
                    <Select 
                      options={field.options} 
                      {...register(field.name, { required: field.required && `${field.label} is required` })} 
                    />
                  ) : field.type === 'textarea' ? (
                    <Textarea 
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      {...register(field.name, { required: field.required && `${field.label} is required` })} 
                    />
                  ) : field.type === 'file' ? (
                    <FileInput 
                      multiple
                      onChange={(e) => setFileList(e.target.files)}
                    />
                  ) : (
                    <Input 
                      type={field.type || 'text'} 
                      icon={field.icon} 
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      {...register(field.name, { required: field.required && `${field.label} is required` })} 
                    />
                  )}
                </FormGroup>
              </div>
            ))}
          </div>

          <div className="pt-8 flex flex-col md:flex-row gap-4 border-t border-slate-100">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={loading} 
              icon={Save}
              className="flex-[2]"
            >
              Save Record
            </Button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
