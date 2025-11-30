import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import {
    BarChart3, TrendingUp, Clock, DollarSign, Users, Target, Download,
    Server, Zap, CheckCircle, AlertTriangle, Activity, FileText
} from 'lucide-react';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, ComposedChart, Line, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { calculateMetrics } from '@/lib/analytics/analyticsEngine';
import { TimeRange } from '@/lib/types/analytics';
import MetricCard from '@/components/analytics/widgets/MetricCard';
import GaugeChart from '@/components/analytics/charts/GaugeChart';
import HeatMap from '@/components/analytics/charts/HeatMap';
import BurndownChart from '@/components/analytics/charts/BurndownChart';
import TeamRadarChart from '@/components/analytics/charts/TeamRadarChart';
import WaterfallChart from '@/components/analytics/charts/WaterfallChart';
import { USERS, RESOURCES } from '@/lib/mockData';
import { groupBy } from '@/lib/analytics/dataTransformers';

const Analytics: React.FC = () => {
    const { tasks, sites, documents } = useStore();
    const [timeRange, setTimeRange] = useState<TimeRange>('30d');
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'project' | 'site' | 'team' | 'financial'>('all');

    // Prepare analytics data
    const analyticsData = useMemo(() => ({
        tasks,
        sites,
        users: USERS,
        resources: RESOURCES,
        documents,
    }), [tasks, sites, documents]);

    // Calculate main KPI metrics using our analytics engine
    const metrics = useMemo(() => {
        const metricIds = [
            'completion_rate', 'on_time_delivery', 'cost_efficiency', 'team_utilization',
            'site_uptime', 'avg_health_score', 'budget_adherence', 'velocity',
            'blocked_tasks', 'low_battery_sites', 'active_team_members', 'resource_utilization',
        ];
        return calculateMetrics(metricIds, analyticsData, undefined, timeRange);
    }, [analyticsData, timeRange]);

    // Task status distribution
    const statusData = useMemo(() => [
        { name: 'Planning', value: tasks.filter(t => t.status === 'planning').length, color: '#6366f1' },
        { name: 'Permitting', value: tasks.filter(t => t.status === 'permitting').length, color: '#8b5cf6' },
        { name: 'Construction', value: tasks.filter(t => t.status === 'construction').length, color: '#ec4899' },
        { name: 'Integration', value: tasks.filter(t => t.status === 'integration').length, color: '#14b8a6' },
        { name: 'Live', value: tasks.filter(t => t.status === 'live').length, color: '#10b981' },
        { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#22c55e' },
    ].filter(d => d.value > 0), [tasks]);

    // Site health distribution
    const siteHealthData = useMemo(() => [
        { name: 'Excellent (90+)', value: sites.filter(s => (s.healthScore || 0) >= 90).length, color: '#10b981' },
        { name: 'Good (70-89)', value: sites.filter(s => (s.healthScore || 0) >= 70 && (s.healthScore || 0) < 90).length, color: '#06b6d4' },
        { name: 'Fair (50-69)', value: sites.filter(s => (s.healthScore || 0) >= 50 && (s.healthScore || 0) < 70).length, color: '#f59e0b' },
        { name: 'Poor (<50)', value: sites.filter(s => (s.healthScore || 0) < 50 && (s.healthScore || 0) > 0).length, color: '#ef4444' },
    ].filter(d => d.value > 0), [sites]);

    // Team workload data
    const teamWorkloadData = useMemo(() => {
        const tasksByUser = groupBy(tasks, 'assigneeId');
        return USERS.map(user => ({
            name: user.name.split(' ')[0],
            tasks: tasksByUser[user.id]?.length || 0,
            workload: user.workload || 0,
        }));
    }, [tasks]);

    // Priority distribution
    const priorityData = useMemo(() => [
        { name: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length, color: '#ef4444' },
        { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#f59e0b' },
        { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#3b82f6' },
        { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#64748b' },
    ].filter(d => d.value > 0), [tasks]);

    // Velocity trend
    const velocityTrendData = useMemo(() =>
        Array.from({ length: 7 }, (_, i) => ({
            date: format(subDays(new Date(), 6 - i), 'MMM dd'),
            completed: Math.floor(Math.random() * 4) + 1,
            created: Math.floor(Math.random() * 5) + 1,
        })), []
    );

    // Resource utilization by type
    const resourceUtilizationData = useMemo(() => {
        const byType = groupBy(RESOURCES, 'type');
        return Object.entries(byType).map(([type, items]) => ({
            name: type.replace('_', ' '),
            total: items.length,
            inUse: items.filter(r => r.availability === 'in_use').length,
            available: items.filter(r => r.availability === 'available').length,
        }));
    }, []);

    // Burndown chart data
    const burndownData = useMemo(() => {
        const days = 14;
        const totalTasks = tasks.length;
        const completedPerDay = totalTasks / days;
        return Array.from({ length: days }, (_, i) => ({
            day: `Day ${i + 1}`,
            ideal: Math.round(totalTasks - (completedPerDay * i)),
            actual: i < 5 ? Math.round(totalTasks - (completedPerDay * i)) : Math.round(totalTasks - (completedPerDay * i) + Math.random() * 3 - 1),
        }));
    }, [tasks.length]);

    // Activity heatmap data
    const activityHeatmapData = useMemo(() => {
        const days = eachDayOfInterval({
            start: subDays(new Date(), 84),
            end: new Date()
        });
        return days.map(day => ({
            date: format(day, 'yyyy-MM-dd'),
            value: Math.floor(Math.random() * 8)
        }));
    }, []);

    // Team skills radar data
    const teamSkillsData = useMemo(() => [
        { skill: '5G Tech', current: 75, required: 85 },
        { skill: 'RF Engineering', current: 88, required: 80 },
        { skill: 'Project Mgmt', current: 92, required: 90 },
        { skill: 'Site Planning', current: 70, required: 85 },
        { skill: 'Compliance', current: 85, required: 95 },
        { skill: 'Documentation', current: 65, required: 75 },
    ], []);

    // Budget waterfall data
    const budgetWaterfallData = useMemo(() => {
        const estimated = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0) * 100;
        const actual = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0) * 100;
        return [
            { name: 'Planned Budget', value: estimated },
            { name: 'Labor Savings', value: Math.round(estimated * 0.08) },
            { name: 'Material Costs', value: -Math.round(estimated * 0.12) },
            { name: 'Overhead', value: -Math.round(estimated * 0.05) },
            { name: 'Contingency', value: Math.round(estimated * 0.03) },
            { name: 'Actual Spend', value: -(estimated - actual), isTotal: true },
        ];
    }, [tasks]);

    // Cost trend data
    const costTrendData = useMemo(() =>
        Array.from({ length: 6 }, (_, i) => ({
            month: format(subDays(new Date(), (5 - i) * 30), 'MMM'),
            budget: 150000 + Math.random() * 20000,
            actual: 145000 + Math.random() * 25000,
            forecast: 152000 + Math.random() * 18000
        })), []
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Analytics & Insights</h1>
                        <p className="text-slate-600">Comprehensive project and team performance metrics</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:border-blue-500"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                        </select>
                        <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <Download className="w-4 h-4" />
                            Export Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 border-b border-slate-300">
                {[
                    { id: 'all', label: 'All Metrics' },
                    { id: 'project', label: 'Project Performance' },
                    { id: 'site', label: 'Site Operations' },
                    { id: 'team', label: 'Team & Resources' },
                    { id: 'financial', label: 'Financial' },
                ].map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id as any)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === cat.id
                            ? 'text-cyan-600 border-b-2 border-cyan-600'
                            : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* KPI Overview with Gauge Charts */}
            <div>
                <h2 className="text-lg font-bold text-white mb-4">Key Performance Indicators</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <GaugeChart
                            value={metrics.completion_rate?.value as number || 0}
                            label="Completion Rate"
                            target={80}
                            size={160}
                        />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <GaugeChart
                            value={metrics.site_uptime?.value as number || 0}
                            label="Site Uptime"
                            target={99.9}
                            size={160}
                        />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <GaugeChart
                            value={metrics.team_utilization?.value as number || 0}
                            label="Team Utilization"
                            target={80}
                            size={160}
                        />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <GaugeChart
                            value={metrics.cost_efficiency?.value as number || 0}
                            label="Cost Efficiency"
                            target={100}
                            size={160}
                        />
                    </div>
                </div>
            </div>

            {/* Detailed Metrics Cards */}
            {(selectedCategory === 'all' || selectedCategory === 'project') && (
                <div>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        Project Performance
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {metrics.completion_rate && <MetricCard title="Completion Rate" value={metrics.completion_rate} icon={Target} iconColor="text-blue-500" format="percentage" target={80} />}
                        {metrics.on_time_delivery && <MetricCard title="On-Time Delivery" value={metrics.on_time_delivery} icon={CheckCircle} iconColor="text-emerald-500" format="percentage" target={90} />}
                        {metrics.velocity && <MetricCard title="Project Velocity" value={metrics.velocity} icon={TrendingUp} iconColor="text-purple-500" format="number" />}
                        {metrics.blocked_tasks && <MetricCard title="Blocked Tasks" value={metrics.blocked_tasks} icon={AlertTriangle} iconColor="text-amber-500" format="number" />}
                    </div>
                </div>
            )}

            {(selectedCategory === 'all' || selectedCategory === 'site') && (
                <div>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Server className="w-5 h-5 text-cyan-600" />
                        Site Operations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {metrics.site_uptime && <MetricCard title="Network Uptime" value={metrics.site_uptime} icon={Activity} iconColor="text-emerald-500" format="percentage" target={99.9} />}
                        {metrics.avg_health_score && <MetricCard title="Avg Health Score" value={metrics.avg_health_score} icon={Server} iconColor="text-blue-500" format="number" target={85} />}
                        {metrics.low_battery_sites && <MetricCard title="Low Battery Sites" value={metrics.low_battery_sites} icon={Zap} iconColor="text-rose-500" format="number" />}
                        <MetricCard title="Total Sites" value={{ value: sites.length, label: `${sites.length} sites monitored`, timestamp: new Date().toISOString() }} icon={Server} iconColor="text-slate-500" format="number" />
                    </div>
                </div>
            )}

            {/* Advanced Charts Section */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6">Advanced Analytics</h2>

                {/* Burndown & Waterfall */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <BurndownChart data={burndownData} title="Sprint Burndown - Current Iteration" />
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <WaterfallChart data={budgetWaterfallData} title="Budget Variance Analysis" />
                    </div>
                </div>

                {/* Cost Trend Multi-Line Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
                    <h4 className="text-sm font-medium text-slate-600 mb-4">Cost Trend Analysis</h4>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={costTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#475569" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#475569" style={{ fontSize: '12px' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px' }} formatter={(value: any) => `$${value.toLocaleString()}`} />
                                <Legend wrapperStyle={{ color: '#0f172a' }} />
                                <Bar dataKey="budget" fill="#3b82f6" name="Planned Budget" radius={[4, 4, 0, 0]} />
                                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual Spend" dot={{ fill: '#10b981', r: 5 }} />
                                <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Forecast" dot={{ fill: '#f59e0b', r: 4 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Radar & Heatmap */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <TeamRadarChart data={teamSkillsData} title="Team Skills Gap Analysis" />
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <HeatMap data={activityHeatmapData} weeks={12} title="Task Activity Heatmap (Last 12 Weeks)" />
                    </div>
                </div>
            </div>

            {/* Standard Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Velocity Trend */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-bold text-slate-900">Project Velocity</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={velocityTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#475569" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#475569" style={{ fontSize: '12px' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                                <Legend wrapperStyle={{ color: '#0f172a' }} />
                                <Area type="monotone" dataKey="completed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Completed" />
                                <Area type="monotone" dataKey="created" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Created" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Task Distribution */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Target className="w-5 h-5 text-purple-500" />
                        <h3 className="text-lg font-bold text-slate-900">Task Distribution</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                                <Legend wrapperStyle={{ color: '#0f172a' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Team Workload */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-bold text-slate-900">Team Workload</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={teamWorkloadData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#475569" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#475569" style={{ fontSize: '12px' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                                <Legend wrapperStyle={{ color: '#0f172a' }} />
                                <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Active Tasks" />
                                <Bar dataKey="workload" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Workload %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Priority Distribution */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-bold text-slate-900">Task Priority</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={priorityData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={(entry) => `${entry.name}: ${entry.value}`}>
                                    {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Site Health & Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Server className="w-5 h-5 text-cyan-600" />
                        <h3 className="text-lg font-bold text-slate-900">Site Health Overview</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {siteHealthData.map(item => (
                            <div key={item.name} className="text-center p-4 bg-slate-100 rounded-lg border border-slate-200">
                                <div className="text-3xl font-bold mb-2" style={{ color: item.color }}>{item.value}</div>
                                <div className="text-sm text-slate-600">{item.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {resourceUtilizationData.length > 0 && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Activity className="w-5 h-5 text-purple-500" />
                            <h3 className="text-lg font-bold text-slate-900">Resource Utilization</h3>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={resourceUtilizationData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="name" stroke="#475569" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#475569" style={{ fontSize: '12px' }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                                    <Legend wrapperStyle={{ color: '#0f172a' }} />
                                    <Bar dataKey="inUse" stackId="a" fill="#10b981" name="In Use" />
                                    <Bar dataKey="available" stackId="a" fill="#06b6d4" name="Available" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
