import React, { useState } from 'react';
import { useStore } from '@/lib/store';

import { Search, Filter, Plus, Battery, Zap, Signal } from 'lucide-react';
import { format } from 'date-fns';

const Sites: React.FC = () => {
    const { sites } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredSites = sites.filter(site => {
        const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            site.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            site.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Site Registry</h1>
                    <p className="text-slate-400">Manage telecom infrastructure assets</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add New Site
                </button>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search sites by name, ID, or address..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <select
                        className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="online">Online</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="offline">Offline</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Site ID & Name</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Tenant</th>
                                <th className="px-6 py-4 font-medium">Power</th>
                                <th className="px-6 py-4 font-medium">Battery</th>
                                <th className="px-6 py-4 font-medium">Lease Expires</th>
                                <th className="px-6 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredSites.map((site) => (
                                <tr key={site.id} className="hover:bg-slate-800/50 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                                                <Signal className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{site.name}</p>
                                                <p className="text-xs text-slate-500">{site.id} • {site.address}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${site.status === 'online' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                            site.status === 'maintenance' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${site.status === 'online' ? 'bg-emerald-500' :
                                                site.status === 'maintenance' ? 'bg-amber-500' :
                                                    'bg-rose-500'
                                                }`} />
                                            {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{site.tenant}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Zap className="w-4 h-4 text-yellow-500" />
                                            {site.powerType}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Battery className={`w-4 h-4 ${site.batteryLevel > 50 ? 'text-emerald-500' :
                                                site.batteryLevel > 20 ? 'text-amber-500' : 'text-rose-500'
                                                }`} />
                                            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${site.batteryLevel > 50 ? 'bg-emerald-500' :
                                                        site.batteryLevel > 20 ? 'bg-amber-500' : 'bg-rose-500'
                                                        }`}
                                                    style={{ width: `${site.batteryLevel}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-400">{site.batteryLevel}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">
                                        {format(new Date(site.leaseExpires), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 text-xs text-slate-500 flex justify-between items-center">
                    <span>Showing {filteredSites.length} sites</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sites;
