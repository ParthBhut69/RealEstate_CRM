import { Bell, Clock, AlertCircle } from 'lucide-react';

const alerts = [
  { id: 1, type: 'follow-up', message: 'Follow up with John Doe regarding Sunset Villa', time: '10:00 AM', priority: 'high' },
  { id: 2, type: 'task', message: 'Prepare contract for Deal #409', time: '2:30 PM', priority: 'medium' },
  { id: 3, type: 'inquiry', message: 'New inquiry received for Ocean View Apartment', time: '4:15 PM', priority: 'low' },
];

const priorityColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-blue-100 text-blue-700',
};

const typeIcons = {
  'follow-up': Clock,
  'task': AlertCircle,
  'inquiry': Bell,
};

export default function Alerts() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Alerts & Reminders</h1>
        <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-sm font-medium">
          {alerts.length} New
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const Icon = typeIcons[alert.type];
          return (
            <div key={alert.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center ${priorityColors[alert.priority].split(' ')[0]} ${priorityColors[alert.priority].split(' ')[1]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium">{alert.message}</p>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[alert.priority]}`}>
                    {alert.priority.toUpperCase()}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.time}
                  </span>
                </div>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Resolve
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
