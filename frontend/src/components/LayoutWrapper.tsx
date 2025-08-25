import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface LayoutWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  compactMode?: boolean;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ 
  children, 
  title = "VeroPest Suite",
  description,
  compactMode = false
}) => {
  const navigate = useNavigate();
  const { user, clear: clearAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!user) {
    return <LoadingSpinner text="Loading..." />;
  }

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Apply compact mode adjustments
  const sidebarWidth = compactMode ? (sidebarCollapsed ? 'w-14' : 'w-56') : (sidebarCollapsed ? 'w-16' : 'w-64');
  const mainMargin = compactMode ? (sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-56') : (sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
          compactMode={compactMode}
        />

        {/* Main content area */}
        <div className={`transition-all duration-300 ${mainMargin}`}>
          {/* Header */}
          <DashboardHeader
            user={user}
            sidebarOpen={sidebarOpen}
            sidebarCollapsed={sidebarCollapsed}
            onSidebarToggle={handleSidebarToggle}
            onLogout={handleLogout}
            compactMode={compactMode}
          />

          {/* Page content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LayoutWrapper;



