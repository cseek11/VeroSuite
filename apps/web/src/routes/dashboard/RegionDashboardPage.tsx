import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { enhancedApi } from '@/lib/enhanced-api';
import { RegionDashboard } from './RegionDashboard';

export const RegionDashboardPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [layoutId, setLayoutId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDefaultLayout = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get or create default layout
        const layout = await enhancedApi.dashboardLayouts.getOrCreateDefault();
        if (layout?.id) {
          setLayoutId(layout.id);
        } else {
          throw new Error('Failed to get or create default layout');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
        console.error('Failed to load default layout:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadDefaultLayout();
    }
  }, [user?.id]);

  if (!user?.id) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Please log in to view the dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!layoutId) {
    return (
      <div className="p-6">
        <p className="text-gray-600">No dashboard layout found.</p>
      </div>
    );
  }

  return <RegionDashboard layoutId={layoutId} userId={user.id} />;
};

