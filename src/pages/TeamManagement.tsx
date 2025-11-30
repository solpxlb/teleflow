import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Search, Plus, Mail, Award, TrendingUp } from 'lucide-react';
const TeamManagement: React.FC = () => {
    const { tasks, users } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const roles = [
        { id: 'all', label: 'All Roles' },
        { id: 'super_admin', label: 'Super Admin' },
        { id: 'admin', label: 'Admin' },
        { id: 'pm', label: 'Project Manager' },
        { id: 'team_lead', label: 'Team Lead' },
        { id: 'member', label: 'Member' },
        { id: 'tech', label: 'Technician' },
    ];

    const roleColors: Record<string, string> = {
        super_admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        admin: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        pm: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        team_lead: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
        member: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
        tech: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    };

    const availabilityColors: Record<string, string> = {
        available: 'bg-emerald-500',
        busy: 'bg-amber-500',
        offline: 'bg-slate-500',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
                    <p className="text-slate-600">Manage team members, skills, and workload</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Team Member
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="text-2xl font-bold text-white mb-1">{users.length}</div>
                    <div className="text-sm text-slate-600">Total Members</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="text-2xl font-bold text-emerald-500 mb-1">
                        {users.filter(u => u.availability === 'available').length}
                    </div>
                    <div className="text-sm text-slate-600">Available</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="text-2xl font-bold text-amber-500 mb-1">
                        {users.filter(u => u.availability === 'busy').length}
                    </div>
                    <div className="text-sm text-slate-600">Busy</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="text-2xl font-bold text-blue-500 mb-1">
                        {Math.round(users.reduce((sum, u) => sum + (u.workload || 0), 0) / (users.length || 1))}%
                    </div>
                    <div className="text-sm text-slate-600">Avg Workload</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search team members..."
                        className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-slate-700 focus:outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:border-blue-500"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.label}</option>
                    ))}
                </select>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map(user => {
                    const userTasks = tasks.filter(t => t.assigneeId === user.id);
                    const completedTasks = userTasks.filter(t => t.status === 'completed').length;
                    const activeTasks = userTasks.filter(t => t.status !== 'completed').length;

                    return (
                        <div
                            key={user.id}
                            className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500/50 transition-all"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="relative">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full border-2 border-slate-600"
                                    />
                                    <div
                                        className={`absolute bottom-0 right-0 w-4 h-4 ${availabilityColors[user.availability || 'offline']} rounded-full border-2 border-slate-200`}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">{user.name}</h3>
                                    <span className={`text-xs px-2 py-1 rounded border ${roleColors[user.role]}`}>
                                        {user.role.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </div>
                                {user.hourlyRate && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <TrendingUp className="w-4 h-4" />
                                        ${user.hourlyRate}/hr
                                    </div>
                                )}
                            </div>

                            {/* Skills */}
                            {user.skills && user.skills.length > 0 && (
                                <div className="mb-4">
                                    <div className="text-xs text-slate-500 mb-2">Skills</div>
                                    <div className="flex flex-wrap gap-1">
                                        {user.skills.slice(0, 3).map(skill => (
                                            <span key={skill} className="text-xs bg-slate-700 text-slate-600 px-2 py-1 rounded">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Certifications */}
                            {user.certifications && user.certifications.length > 0 && (
                                <div className="mb-4">
                                    <div className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                        <Award className="w-3 h-3" />
                                        Certifications
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {user.certifications.map(cert => (
                                            <span key={cert} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">
                                                {cert}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Workload */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-slate-600 mb-2">
                                    <span>Workload</span>
                                    <span>{user.workload}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${(user.workload || 0) > 80 ? 'bg-rose-500' :
                                            (user.workload || 0) > 60 ? 'bg-amber-500' :
                                                'bg-emerald-500'
                                            }`}
                                        style={{ width: `${user.workload}%` }}
                                    />
                                </div>
                            </div>

                            {/* Task Stats */}
                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
                                <div>
                                    <div className="text-xl font-bold text-slate-900">{activeTasks}</div>
                                    <div className="text-xs text-slate-600">Active Tasks</div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-emerald-500">{completedTasks}</div>
                                    <div className="text-xs text-slate-600">Completed</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamManagement;
