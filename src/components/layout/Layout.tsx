import React from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import {
  LayoutDashboard,
  Map,
  KanbanSquare,
  GitBranch,
  LogOut,
  Menu,
  Bell,
  BarChart3,
  Users,
  FileText,
  Settings as SettingsIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Copilot from '@/components/copilot/Copilot';

const Layout: React.FC = () => {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Command Center', roles: ['super_admin', 'admin', 'pm', 'team_lead', 'member', 'tech'] },
    { to: '/sites', icon: Map, label: 'Site Registry', roles: ['super_admin', 'admin', 'pm', 'team_lead'] },
    { to: '/projects', icon: KanbanSquare, label: 'Tasks', roles: ['super_admin', 'admin', 'pm', 'team_lead', 'member'] },
    { to: '/stories', icon: GitBranch, label: 'Stories & Epics', roles: ['super_admin', 'admin', 'pm'] },
    { to: '/workflow', icon: GitBranch, label: 'Workflow Builder', roles: ['super_admin', 'admin'] },
    { to: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['super_admin', 'admin', 'pm'] },
    { to: '/team', icon: Users, label: 'Team', roles: ['super_admin', 'admin', 'pm', 'team_lead'] },
    { to: '/documents', icon: FileText, label: 'Documents', roles: ['super_admin', 'admin', 'pm', 'team_lead', 'member'] },
    { to: '/settings', icon: SettingsIcon, label: 'Settings', roles: ['super_admin', 'admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="font-bold text-white">TF</span>
            </div>
            {sidebarOpen && <span className="font-bold text-lg tracking-tight">TeleFlow</span>}
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full border border-slate-600"
            />
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">{currentUser.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={cn(
              "mt-4 flex items-center gap-3 text-slate-500 hover:text-rose-400 transition-colors w-full",
              !sidebarOpen && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 bg-slate-950 relative">
          <Outlet />
          <Copilot />
        </div>
      </main>
    </div>
  );
};

export default Layout;
