import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import TaskFormModal from '../tasks/TaskFormModal';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Trigger a state change to notify active child pages (Dashboard, Tasks) to refresh
  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleTaskCreated = () => {
    setCreateModalOpen(false);
    triggerRefresh();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar Panel */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Viewport Shell */}
      <div className="flex flex-col min-h-screen lg:pl-64">
        {/* Top Header Navbar */}
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenCreateModal={() => setCreateModalOpen(true)}
        />

        {/* Page Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet context={{ refreshTrigger, triggerRefresh }} />
        </main>
      </div>

      {/* Global Task Creation Modal */}
      {createModalOpen && (
        <TaskFormModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default AppLayout;
