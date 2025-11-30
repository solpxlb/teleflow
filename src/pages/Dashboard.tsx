import React from 'react';
import { useStore } from '@/lib/store';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Activity, AlertTriangle, CheckCircle, Clock, Server, BarChart3, PieChart as PieIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Dashboard: React.FC = () => {
  const { sites, notifications, tasks, currentUser } = useStore();

  const totalSites = sites.length;
  const activeAlarms = notifications.filter(n => n.type === 'error').length;
  const maintenanceSites = sites.filter(s => s.status === 'maintenance').length;
  const leaseExpirations = sites.filter(s => new Date(s.leaseExpires) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length;

  // Chart Data Preparation
  const statusData = [
    { name: 'Planning', value: tasks.filter(t => t.status === 'planning').length, color: '#6366f1' },
    { name: 'Permitting', value: tasks.filter(t => t.status === 'permitting').length, color: '#8b5cf6' },
    { name: 'Construction', value: tasks.filter(t => t.status === 'construction').length, color: '#ec4899' },
    { name: 'Integration', value: tasks.filter(t => t.status === 'integration').length, color: '#14b8a6' },
    { name: 'Live', value: tasks.filter(t => t.status === 'live').length, color: '#10b981' },
  ];

  const userData = [
    { name: 'Alice', tasks: tasks.filter(t => t.assigneeId === 'u1').length },
    { name: 'Bob', tasks: tasks.filter(t => t.assigneeId === 'u2').length },
    { name: 'Charlie', tasks: tasks.filter(t => t.assigneeId === 'u3').length },
    { name: 'David', tasks: tasks.filter(t => t.assigneeId === 'u4').length },
    { name: 'Eve', tasks: tasks.filter(t => t.assigneeId === 'u5').length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Command Center</h1>
          <p className="text-slate-600">Welcome back, {currentUser?.name}</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-white text-slate-600 px-3 py-1 rounded-full text-sm border border-slate-200">
            System Status: Optimal
          </span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg hover:border-blue-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Server className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{totalSites}</h3>
          <p className="text-sm text-slate-600">Active Sites</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg hover:border-rose-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <span className="text-xs font-medium text-rose-400 bg-rose-900/20 px-2 py-1 rounded">Critical</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{activeAlarms}</h3>
          <p className="text-sm text-slate-600">Active Alarms</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg hover:border-amber-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <Activity className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-xs font-medium text-amber-400 bg-amber-900/20 px-2 py-1 rounded">Ongoing</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{maintenanceSites}</h3>
          <p className="text-sm text-slate-600">In Maintenance</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg hover:border-emerald-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded">30 Days</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{leaseExpirations}</h3>
          <p className="text-sm text-slate-600">Lease Expirations</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-bold text-slate-900">Task Distribution</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ color: '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold text-slate-900">Team Workload</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="name" stroke="#475569" />
                <YAxis stroke="#475569" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }}
                  cursor={{ fill: '#e2e8f0', opacity: 0.3 }}
                />
                <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Map and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-lg relative z-0">
          <MapContainer center={[40.7128, -74.0060]} zoom={10} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {sites.map(site => (
              <Marker key={site.id} position={[site.lat, site.lng]}>
                <Popup className="custom-popup">
                  <div className="p-2">
                    <h3 className="font-bold text-slate-900">{site.name}</h3>
                    <p className="text-sm text-slate-600">Status: {site.status}</p>
                    <p className="text-sm text-slate-600">Tenant: {site.tenant}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-lg flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Activity Feed
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {notifications.map(notification => (
              <div key={notification.id} className="flex gap-3 items-start p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-400 transition-colors">
                <div className={`mt-1 p-1.5 rounded-full flex-shrink-0 ${notification.type === 'error' ? 'bg-rose-500/10 text-rose-500' :
                  notification.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                    notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                      'bg-blue-500/10 text-blue-500'
                  }`}>
                  {notification.type === 'error' ? <AlertTriangle className="w-3 h-3" /> :
                    notification.type === 'warning' ? <Clock className="w-3 h-3" /> :
                      notification.type === 'success' ? <CheckCircle className="w-3 h-3" /> :
                        <Activity className="w-3 h-3" />}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700">{notification.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{notification.message}</p>
                  <span className="text-[10px] text-slate-500 mt-2 block">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
