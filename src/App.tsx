import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TopicMasterProvider } from './context/TopicMasterContext';
import { ToastProvider } from './context/ToastContext';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { MySubjectsPage } from './pages/MySubjectsPage';
import { AddTopicsPage } from './pages/AddTopicsPage';
import { SchedulerPage } from './pages/SchedulerPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <TopicMasterProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Primary Main Application Layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/subjects" replace />} />
              <Route path="/subjects" element={<MySubjectsPage />} />
              <Route path="/topics" element={<AddTopicsPage />} />
              <Route path="/scheduler" element={<SchedulerPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Isolated Admin Workspace Layout (Hides Main Navbar) */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminPanelPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </TopicMasterProvider>
  );
};

export default App;
