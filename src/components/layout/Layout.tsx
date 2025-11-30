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
  Shield,
  Radio,
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

  const adminItems = [
    { to: '/admin/users', icon: Shield, label: 'User Management', roles: ['super_admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentUser.role));
  const filteredAdminItems = adminItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-slate-50 border-r border-slate-200 transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
              <Radio className="w-5 h-5 text-slate-900" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight leading-none text-slate-900">GSM TOWERS</span>
                <span className="text-[10px] text-slate-500 tracking-wider uppercase">Management</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive
                  ? "bg-cyan-50 text-cyan-600 border border-cyan-200"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}

          {/* Admin Section */}
          {filteredAdminItems.length > 0 && (
            <>
              {sidebarOpen && (
                <div className="px-3 pt-6 pb-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Admin</p>
                </div>
              )}
              {filteredAdminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-purple-50 text-purple-600 border border-purple-200"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full border border-slate-300"
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
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <button className="relative text-slate-500 hover:text-slate-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-cyan-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 bg-white relative">
          <Outlet />
          <Copilot />
        </div>
      </main>
    </div>
  );
};

export default Layout;
