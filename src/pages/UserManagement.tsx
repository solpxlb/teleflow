import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { isSuperAdmin } from '@/lib/auth';
import { User } from '@/lib/mockData';
import { Plus, Edit2, Trash2, Shield, UserPlus, X, Mail, Key, UserCircle } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { currentUser, users, signup } = useStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'member' as User['role'],
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Check if current user is super admin
  if (!isSuperAdmin(currentUser)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">Only super admins can access user management.</p>
        </div>
      </div>
    );
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      await signup(newUser.email, newUser.password, newUser.name, newUser.role);
      setShowCreateModal(false);
      setNewUser({ email: '', password: '', name: '', role: 'member' });
      // Refresh users list
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const roleColors: Record<User['role'], string> = {
    super_admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    admin: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    pm: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    team_lead: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    member: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    tech: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };

  const roleLabels: Record<User['role'], string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    pm: 'Project Manager',
    team_lead: 'Team Lead',
    member: 'Member',
    tech: 'Technician',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400">Create and manage user accounts</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="text-2xl font-bold text-white mb-1">{users.length}</div>
          <div className="text-sm text-slate-400">Total Users</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="text-2xl font-bold text-purple-500 mb-1">
            {users.filter(u => u.role === 'super_admin').length}
          </div>
          <div className="text-sm text-slate-400">Super Admins</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="text-2xl font-bold text-blue-500 mb-1">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div className="text-sm text-slate-400">Admins</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="text-2xl font-bold text-emerald-500 mb-1">
            {users.filter(u => ['pm', 'team_lead', 'member', 'tech'].includes(u.role)).length}
          </div>
          <div className="text-sm text-slate-400">Team Members</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Role</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Created</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border-2 border-slate-600"
                      />
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-xs text-slate-400">ID: {user.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full border ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {user.role !== 'super_admin' && (
                        <button
                          className="p-2 hover:bg-rose-500/10 rounded-lg transition-colors text-slate-400 hover:text-rose-500"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Create New User</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-sm text-rose-500">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <UserCircle className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                  minLength={8}
                />
                <p className="text-xs text-slate-500 mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="member">Member</option>
                  <option value="tech">Technician</option>
                  <option value="team_lead">Team Lead</option>
                  <option value="pm">Project Manager</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
