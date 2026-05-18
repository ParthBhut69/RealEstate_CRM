import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Home, Briefcase, MessageSquare, CheckSquare, ArrowLeft, Save, Building2, MapPin, DollarSign, User, Calendar, Type, Video, Link as LinkIcon, Car, Award } from 'lucide-react';
import { FormCard, FormGroup, Input, Select, Textarea, Button, FileInput, CheckboxGroup } from '../components/common/FormComponents';
import api from '../api/axios';

const CONFIG = {
  property: {
    title: 'Add New Property',
    subtitle: 'List a new real estate property in the system.',
    icon: Home,
    endpoint: '/properties',
    fields: [
      { name: 'title', label: 'Property Title', icon: Type, required: true },
      { name: 'building_name', label: 'Building Name', icon: Building2, required: true },
      { name: 'property_for', label: 'Property For', type: 'select', required: true, options: [
        { value: '', label: 'Select...' },
        { value: 'Buy', label: 'Buy' },
        { value: 'Rent', label: 'Rent' }
      ]},
      { name: 'configuration', label: 'Configuration', type: 'select', required: true, options: [
        { value: '', label: 'Select...' },
        { value: '1 BHK', label: '1 BHK' },
        { value: '2 BHK', label: '2 BHK' },
        { value: '3 BHK', label: '3 BHK' },
        { value: '4 BHK', label: '4 BHK' },
        { value: 'Studio', label: 'Studio' },
        { value: 'Penthouse', label: 'Penthouse' },
        { value: 'Duplex', label: 'Duplex' },
        { value: 'Commercial', label: 'Commercial' }
      ]},
      { name: 'location', label: 'Location', type: 'select', required: true, options: [
        { value: '', label: 'Select...' },
        { value: 'BVI West', label: 'BVI West' },
        { value: 'BVI East', label: 'BVI East' },
        { value: 'KVI West', label: 'KVI West' },
        { value: 'KVI East', label: 'KVI East' },
        { value: 'Others', label: 'Others' }
      ]},
      { name: 'address', label: 'Full Address', icon: MapPin },
      { name: 'carpet_area', label: 'Carpet Area (Sq.ft)', icon: Building2, type: 'number', required: true },
      { name: 'price_in_cr', label: 'Price (In Cr)', icon: DollarSign, type: 'number', step: '0.01', required: true },
      { name: 'furnishing_status', label: 'Furnishing', type: 'select', options: [
        { value: '', label: 'Select...' },
        { value: 'Unfurnished', label: 'Unfurnished' },
        { value: 'Semi Furnished', label: 'Semi Furnished' },
        { value: 'Fully Furnished', label: 'Fully Furnished' }
      ]},
      { name: 'parking_type', label: 'Parking Type', type: 'select', options: [
        { value: '', label: 'Select...' },
        { value: 'No Parking', label: 'No Parking' },
        { value: 'Open Parking', label: 'Open Parking' },
        { value: 'Covered Parking', label: 'Covered Parking' },
        { value: 'Stilt Parking', label: 'Stilt Parking' },
        { value: 'Valet Parking', label: 'Valet Parking' }
      ]},
      { name: 'oc_status', label: 'OC Status', type: 'select', options: [
        { value: '', label: 'Select...' },
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' }
      ]},
      { name: 'status', label: 'Listing Status', type: 'select', options: [
        { value: 'Available', label: 'Available' },
        { value: 'Sold', label: 'Sold' },
        { value: 'Rented', label: 'Rented' },
        { value: 'Under Negotiation', label: 'Under Negotiation' }
      ]},
      { name: 'amenities', label: 'Amenities', type: 'checkbox-group', options: [
        { value: 'Lift', label: 'Lift' },
        { value: 'Security', label: 'Security' },
        { value: 'CCTV', label: 'CCTV' },
        { value: 'Power Backup', label: 'Power Backup' },
        { value: 'Gym', label: 'Gym' },
        { value: 'Swimming Pool', label: 'Swimming Pool' },
        { value: 'Garden', label: 'Garden' },
        { value: 'Club House', label: 'Club House' },
        { value: 'Kids Play Area', label: 'Kids Play Area' },
        { value: 'Visitor Parking', label: 'Visitor Parking' },
        { value: 'Intercom', label: 'Intercom' },
        { value: 'Fire Safety', label: 'Fire Safety' },
        { value: 'Jogging Track', label: 'Jogging Track' }
      ]},
      { name: 'youtube_link', label: 'YouTube Video Link', icon: Video, type: 'url' },
      { name: 'instagram_link', label: 'Instagram Link', icon: LinkIcon, type: 'url' },
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
      { name: 'client_name', label: 'Client Name', icon: User, required: true },
      { name: 'contact_number', label: 'Contact Number', icon: MapPin, required: true },
      { name: 'alternate_contact_number', label: 'Alternate Contact Number', icon: MapPin },
      { name: 'email_id', label: 'Email ID', icon: Type, type: 'email' },
      { name: 'inquiry_type', label: 'Inquiry Type', type: 'select', required: true, options: [
        { value: '', label: 'Select...' },
        { value: 'Buy', label: 'Buy' },
        { value: 'Rent', label: 'Rent' }
      ]},
      { name: 'property_size', label: 'Property Size', type: 'select', required: true, options: [
        { value: '', label: 'Select...' },
        { value: '1 BHK', label: '1 BHK' },
        { value: '2 BHK', label: '2 BHK' },
        { value: '3 BHK', label: '3 BHK' },
        { value: '4 BHK', label: '4 BHK' },
        { value: 'Other', label: 'Other' }
      ]},
      { name: 'budget', label: 'Budget (In Cr)', icon: DollarSign, type: 'number', step: '0.01', required: true },
      { name: 'preferred_location', label: 'Preferred Location', type: 'select', required: true, options: [
        { value: '', label: 'Select...' },
        { value: 'BVI West', label: 'BVI West' },
        { value: 'BVI East', label: 'BVI East' },
        { value: 'KVI West', label: 'KVI West' },
        { value: 'KVI East', label: 'KVI East' },
        { value: 'Other', label: 'Other' }
      ]},
      { name: 'area', label: 'Preferred Area/Locality', icon: Building2 },
      { name: 'inquiry_source', label: 'Inquiry From', type: 'select', options: [
        { value: '', label: 'Select...' },
        { value: 'YouTube', label: 'YouTube' },
        { value: 'Instagram', label: 'Instagram' },
        { value: 'Facebook', label: 'Facebook' },
        { value: 'Magic Bricks', label: 'Magic Bricks' },
        { value: 'Others', label: 'Others' }
      ]},
      { name: 'next_followup_date', label: 'Next Follow-up Date', type: 'date', icon: Calendar },
      { name: 'followup_status', label: 'Follow-up Status', type: 'select', options: [
        { value: 'New', label: 'New' },
        { value: 'Interested', label: 'Interested' },
        { value: 'Site Visit Planned', label: 'Site Visit Planned' },
        { value: 'Negotiation', label: 'Negotiation' },
        { value: 'Closed', label: 'Closed' },
        { value: 'Not Interested', label: 'Not Interested' }
      ]},
      { name: 'comments', label: 'Comments / Notes', type: 'textarea' }
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

export default function GenericFormPage({ type, isEdit }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [fileList, setFileList] = useState([]);
  const config = CONFIG[type];

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

  useEffect(() => {
    if (isEdit && id) {
      api.get(`${config.endpoint}/${id}`)
        .then(res => {
          reset(res.data);
          setFetching(false);
        })
        .catch(err => {
          setError('Failed to fetch data.');
          setFetching(false);
        });
    } else {
      setFetching(false);
    }
  }, [isEdit, id, config.endpoint, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      let payload;
      let headers = {};

      if (fileList.length > 0) {
        // Use FormData for file uploads
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'images') {
            // Handle arrays (like amenities) for FormData
            if (Array.isArray(value)) {
              formData.append(key, value.join(','));
            } else {
              formData.append(key, value || '');
            }
          }
        });

        Array.from(fileList).forEach(file => {
          formData.append('images', file);
        });
        payload = formData;
      } else {
        // Use JSON for standard data (more compatible with backend)
        payload = data;
      }

      if (isEdit) {
        await api.put(`${config.endpoint}/${id}`, payload);
      } else {
        await api.post(config.endpoint, payload);
      }
      
      navigate(-1);
    } catch (err) {
      console.error('Submission failed', err);
      // Try to get specific error message from server
      const serverError = err.response?.data?.error || err.response?.data?.message;
      setError(serverError || 'Failed to save data. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  if (!config || fetching) return <div className="p-8 text-center text-slate-500 font-medium">Loading...</div>;

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
        title={isEdit ? `Edit ${config.title.replace('Add New ', '')}` : config.title} 

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
              <div key={field.name} className={field.type === 'textarea' || field.type === 'checkbox-group' ? 'md:col-span-2' : ''}>
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
                  ) : field.type === 'checkbox-group' ? (
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: { onChange, value, ref } }) => (
                        <CheckboxGroup options={field.options} value={value} onChange={onChange} ref={ref} />
                      )}
                    />
                  ) : field.type === 'file' ? (
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: { value } }) => (
                        <FileInput 
                          multiple
                          onChange={(e) => setFileList(e.target.files)}
                          value={fileList.length > 0 ? fileList : null}
                        />
                      )}
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
