import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Home } from 'lucide-react';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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
    </div>
  );
}
