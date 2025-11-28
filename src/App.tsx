import React from 'react';
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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
