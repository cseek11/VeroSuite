import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Layout, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';
import { RegionType } from '@/routes/dashboard/types/region.types';

interface EmptyDashboardProps {
  onAddRegion?: (type: RegionType) => Promise<void>;
  onSelectTemplate?: (templateId: string) => void;
  onStartOnboarding?: () => void;
}

/**
 * Empty state component with quick actions and templates
 */
export const EmptyDashboard: React.FC<EmptyDashboardProps> = ({
  onAddRegion,
  onSelectTemplate,
  onStartOnboarding
}) => {
  const quickRegionTypes: { type: RegionType; label: string; icon: React.ReactNode }[] = [
    { type: RegionType.SCHEDULING, label: 'Scheduling', icon: <Layout className="w-5 h-5" /> },
    { type: RegionType.ANALYTICS, label: 'Analytics', icon: <Sparkles className="w-5 h-5" /> },
    { type: RegionType.REPORTS, label: 'Reports', icon: <Layout className="w-5 h-5" /> },
    { type: RegionType.QUICK_ACTIONS, label: 'Quick Actions', icon: <Plus className="w-5 h-5" /> }
  ];

  const templates = [
    { id: 'manager', name: 'Manager Dashboard', description: 'Analytics, team overview, and reports' },
    { id: 'technician', name: 'Technician Dashboard', description: 'Schedule, quick actions, and customer search' },
    { id: 'executive', name: 'Executive Dashboard', description: 'KPIs, financial summary, and analytics' }
  ];

  return (
    <div className="empty-dashboard flex items-center justify-center min-h-[60vh] p-8">
      <motion.div
        className="text-center max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Icon */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Layout className="w-12 h-12 text-blue-500" />
          </div>
        </motion.div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Create Your Dashboard
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Start by adding regions or choose a template to get started quickly
        </p>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Add Regions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickRegionTypes.map(({ type, label, icon }) => (
              <button
                key={type}
                onClick={() => onAddRegion?.(type)}
                className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="text-blue-500 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates */}
        {onSelectTemplate && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Or Start with a Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template.id)}
                  className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <ArrowRight className="w-4 h-4 text-blue-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Onboarding */}
        {onStartOnboarding && (
          <button
            onClick={onStartOnboarding}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mx-auto"
          >
            <HelpCircle className="w-4 h-4" />
            Take a quick tour
          </button>
        )}
      </motion.div>
    </div>
  );
};



