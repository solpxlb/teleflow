import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Shield, HardHat, Briefcase, Crown, Users, User } from 'lucide-react';
import { Role } from '@/lib/mockData';

const Login: React.FC = () => {
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (role: Role) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">TeleFlow</h1>
          <p className="text-slate-400">Enterprise Telecom Infrastructure Management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleLogin('super_admin')}
            className="bg-slate-700 hover:bg-slate-600 p-4 rounded-lg flex flex-col items-center text-center transition-all group border border-transparent hover:border-purple-500/50"
          >
            <div className="bg-purple-500/10 p-3 rounded-full mb-3 group-hover:bg-purple-500/20">
              <Crown className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-white font-semibold">Super Admin</h3>
            <p className="text-xs text-slate-400 mt-1">Full System Control</p>
          </button>

          <button
            onClick={() => handleLogin('admin')}
            className="bg-slate-700 hover:bg-slate-600 p-4 rounded-lg flex flex-col items-center text-center transition-all group border border-transparent hover:border-emerald-500/50"
          >
            <div className="bg-emerald-500/10 p-3 rounded-full mb-3 group-hover:bg-emerald-500/20">
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-white font-semibold">Admin</h3>
            <p className="text-xs text-slate-400 mt-1">Project & Site Manager</p>
          </button>

          <button
            onClick={() => handleLogin('pm')}
            className="bg-slate-700 hover:bg-slate-600 p-4 rounded-lg flex flex-col items-center text-center transition-all group border border-transparent hover:border-blue-500/50"
          >
            <div className="bg-blue-500/10 p-3 rounded-full mb-3 group-hover:bg-blue-500/20">
              <Briefcase className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-white font-semibold">Project Manager</h3>
            <p className="text-xs text-slate-400 mt-1">Rollout Supervisor</p>
          </button>

          <button
            onClick={() => handleLogin('team_lead')}
            className="bg-slate-700 hover:bg-slate-600 p-4 rounded-lg flex flex-col items-center text-center transition-all group border border-transparent hover:border-cyan-500/50"
          >
            <div className="bg-cyan-500/10 p-3 rounded-full mb-3 group-hover:bg-cyan-500/20">
              <Users className="w-8 h-8 text-cyan-500" />
            </div>
            <h3 className="text-white font-semibold">Team Lead</h3>
            <p className="text-xs text-slate-400 mt-1">Team Coordination</p>
          </button>

          <button
            onClick={() => handleLogin('member')}
            className="bg-slate-700 hover:bg-slate-600 p-4 rounded-lg flex flex-col items-center text-center transition-all group border border-transparent hover:border-indigo-500/50"
          >
            <div className="bg-indigo-500/10 p-3 rounded-full mb-3 group-hover:bg-indigo-500/20">
              <User className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-white font-semibold">Member</h3>
            <p className="text-xs text-slate-400 mt-1">Task Contributor</p>
          </button>

          <button
            onClick={() => handleLogin('tech')}
            className="bg-slate-700 hover:bg-slate-600 p-4 rounded-lg flex flex-col items-center text-center transition-all group border border-transparent hover:border-amber-500/50"
          >
            <div className="bg-amber-500/10 p-3 rounded-full mb-3 group-hover:bg-amber-500/20">
              <HardHat className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-white font-semibold">Technician</h3>
            <p className="text-xs text-slate-400 mt-1">Field Operations</p>
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          v2.0.0-beta | Secure Environment
        </div>
      </div>
    </div>
  );
};

export default Login;
