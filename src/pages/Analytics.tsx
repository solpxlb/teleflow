import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { BarChart3, TrendingUp, Clock, DollarSign, Users, Target, Download } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, subDays } from 'date-fns';

const Analytics: React.FC = () => {
    const { tasks, sites } = useStore();
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

    // Calculate metrics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalEstimatedHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const totalActualHours = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
    const efficiency = totalEstimatedHours > 0
        ? Math.round((totalEstimatedHours / totalActualHours) * 100)
        : 100;

    // Task status distribution
    const statusData = [
        { name: 'Planning', value: tasks.filter(t => t.status === 'planning').length, color: '#6366f1' },
        { name: 'Permitting', value: tasks.filter(t => t.status === 'permitting').length, color: '#8b5cf6' },
        { name: 'Construction', value: tasks.filter(t => t.status === 'construction').length, color: '#ec4899' },
        { name: 'Integration', value: tasks.filter(t => t.status === 'integration').length, color: '#14b8a6' },
        { name: 'Live', value: tasks.filter(t => t.status === 'live').length, color: '#10b981' },
        { name: 'Completed', value: completedTasks, color: '#22c55e' },
    ].filter(d => d.value > 0);

    // Velocity data (tasks completed over time)
    const velocityData = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
            date: format(date, 'MMM dd'),
            completed: Math.floor(Math.random() * 5) + 2,
            created: Math.floor(Math.random() * 6) + 1,
        };
    });

    // Site health data
    const siteHealthData = [
        { name: 'Excellent', value: sites.filter(s => (s.healthScore || 0) >= 90).length, color: '#10b981' },
        { name: 'Good', value: sites.filter(s => (s.healthScore || 0) >= 70 && (s.healthScore || 0) < 90).length, color: '#3b82f6' },
        { name: 'Fair', value: sites.filter(s => (s.healthScore || 0) >= 50 && (s.healthScore || 0) < 70).length, color: '#f59e0b' },
        { name: 'Poor', value: sites.filter(s => (s.healthScore || 0) < 50).length, color: '#ef4444' },
    ].filter(d => d.value > 0);

    // Team workload
    const teamWorkload = [
        { name: 'Alice', tasks: tasks.filter(t => t.assigneeId === 'u1').length, hours: 45 },
        { name: 'Bob', tasks: tasks.filter(t => t.assigneeId === 'u2').length, hours: 38 },
        { name: 'Charlie', tasks: tasks.filter(t => t.assigneeId === 'u3').length, hours: 42 },
        { name: 'David', tasks: tasks.filter(t => t.assigneeId === 'u4').length, hours: 35 },
        { name: 'Eve', tasks: tasks.filter(t => t.assigneeId === 'u5').length, hours: 28 },
    ];

    // Budget tracking (mock data)
    const budgetData = [
        { month: 'Jan', planned: 120000, actual: 115000 },
        { month: 'Feb', planned: 135000, actual: 142000 },
        { month: 'Mar', planned: 150000, actual: 148000 },
        { month: 'Apr', planned: 140000, actual: 138000 },
        { month: 'May', planned: 160000, actual: 155000 },
        { month: 'Jun', planned: 155000, actual: 152000 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Analytics & Insights</h1>
                    <p className="text-slate-400">Comprehensive project and team performance metrics</p>
                </div>
                <div className="flex gap-2">
                    <select
                        className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Target className="w-6 h-6 text-blue-500" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{completionRate}%</div>
                    <div className="text-sm text-slate-400">Completion Rate</div>
                    <div className="text-xs text-emerald-500 mt-2">+5% from last period</div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <Clock className="w-6 h-6 text-purple-500" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{efficiency}%</div>
                    <div className="text-sm text-slate-400">Time Efficiency</div>
                    <div className="text-xs text-emerald-500 mt-2">+3% from last period</div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-lg">
                            <DollarSign className="w-6 h-6 text-emerald-500" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-rose-500 rotate-180" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">$152K</div>
                    <div className="text-sm text-slate-400">Monthly Spend</div>
                    <div className="text-xs text-rose-500 mt-2">-2% under budget</div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-500/10 rounded-lg">
                            <Users className="w-6 h-6 text-amber-500" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">94%</div>
                    <div className="text-sm text-slate-400">Team Utilization</div>
                    <div className="text-xs text-emerald-500 mt-2">+7% from last period</div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Velocity Chart */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-bold text-white">Project Velocity</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={velocityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="completed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Completed" />
                                <Area type="monotone" dataKey="created" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Created" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Task Distribution */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-6">
                        <Target className="w-5 h-5 text-purple-500" />
                        <h3 className="text-lg font-bold text-white">Task Distribution</h3>
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
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Workload */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-bold text-white">Team Workload</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={teamWorkload}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    cursor={{ fill: '#334155', opacity: 0.2 }}
                                />
                                <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Active Tasks" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Budget Tracking */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-6">
                        <DollarSign className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-lg font-bold text-white">Budget Tracking</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={budgetData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={2} name="Planned" />
                                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Site Health Overview */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-cyan-500" />
                    <h3 className="text-lg font-bold text-white">Site Health Overview</h3>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {siteHealthData.map(item => (
                        <div key={item.name} className="text-center">
                            <div className="text-3xl font-bold mb-2" style={{ color: item.color }}>
                                {item.value}
                            </div>
                            <div className="text-sm text-slate-400">{item.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
