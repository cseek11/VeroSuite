/**
 * Sessions Page - Auto-PR Session Management Dashboard
 * 
 * This page provides access to the Auto-PR Session Management dashboard.
 * 
 * Usage:
 * Add to your router:
 * <Route path="/sessions" element={<SessionsPage />} />
 */

import React from 'react';
import AutoPRSessionManager from '@/components/dashboard/AutoPRSessionManager';

const SessionsPage: React.FC = () => {
  return <AutoPRSessionManager />;
};

export default SessionsPage;

