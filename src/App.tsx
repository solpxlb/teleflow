import React from 'react';
import { useStore } from '@/lib/store';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Sites from '@/pages/Sites';
import Projects from '@/pages/Projects';
import Stories from '@/pages/Stories';
import Workflow from '@/pages/Workflow';
import Analytics from '@/pages/Analytics';
import TeamManagement from '@/pages/TeamManagement';
import DocumentCenter from '@/pages/DocumentCenter';
import Settings from '@/pages/Settings';
import UserManagement from '@/pages/UserManagement';
import AuthDebug from '@/pages/AuthDebug';

const App: React.FC = () => {
  const { fetchInitialData, checkAuth, isLoading, currentUser } = useStore();
  const [authChecked, setAuthChecked] = React.useState(false);

  React.useEffect(() => {
    const initAuth = async () => {
      try {
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000));
        const authPromise = checkAuth();
        
        await Promise.race([authPromise, timeoutPromise]);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        // Always mark auth as checked after 3 seconds max
        setAuthChecked(true);
      }
    };
    initAuth();
  }, [checkAuth]);

  React.useEffect(() => {
    if (currentUser && authChecked) {
      fetchInitialData();
    }
  }, [currentUser, authChecked, fetchInitialData]);

  // Show loader only for 3 seconds max during initial auth check
  if (!authChecked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-slate-400 text-sm">Checking authentication...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/debug" element={<AuthDebug />} />
        <Route path="/" element={currentUser ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sites" element={<Sites />} />
          <Route path="projects" element={<Projects />} />
          <Route path="stories" element={<Stories />} />
          <Route path="workflow" element={<Workflow />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="team" element={<TeamManagement />} />
          <Route path="documents" element={<DocumentCenter />} />
          <Route path="settings" element={<Settings />} />
          {/* Admin Routes */}
          <Route path="admin/users" element={<UserManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
