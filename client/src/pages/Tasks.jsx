import { useState, useEffect } from 'react';
import api from '../api/axios';
import { CheckSquare } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
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
        <h1 className="text-2xl font-bold text-slate-800">Tasks</h1>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
          Add Task
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-4 rounded-xl">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${task.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
              <CheckSquare className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">{task.title}</h3>
              <p className="text-sm text-slate-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
              {task.status}
            </span>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No tasks found. Add one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
