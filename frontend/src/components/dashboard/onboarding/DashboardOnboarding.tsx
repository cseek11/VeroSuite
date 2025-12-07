import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { RegionType } from '@/routes/dashboard/types/region.types';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image?: string;
  component?: React.ReactNode;
}

interface DashboardOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
  onSelectTemplate?: (templateId: string) => void;
}

/**
 * Multi-step onboarding flow for dashboard regions
 */
export const DashboardOnboarding: React.FC<DashboardOnboardingProps> = ({
  onComplete,
  onSkip,
  onSelectTemplate
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [_completedSteps, setCompletedSteps] = useState<Set<number>>(new Set<number>());

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Dashboard Regions',
      description: 'Create custom dashboards by arranging regions. Each region can display different types of content and be positioned anywhere on the grid.',
      component: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Key Features</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Drag and drop regions to customize your layout
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Resize regions to fit your needs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Collaborate with your team in real-time
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'regions',
      title: 'Understanding Regions',
      description: 'Regions are the building blocks of your dashboard. Each region can be a different type: scheduling, reports, analytics, and more.',
      component: (
        <div className="grid grid-cols-2 gap-4">
          {Object.values(RegionType).slice(0, 6).map(type => (
            <div key={type} className="border rounded-lg p-3 text-center">
              <div className="text-sm font-medium">{type.replace(/-/g, ' ')}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'templates',
      title: 'Choose a Template',
      description: 'Start with a pre-configured template or build from scratch. You can always customize later.',
      component: <TemplateSelector {...(onSelectTemplate !== undefined ? { onSelect: onSelectTemplate } : {})} />
    },
    {
      id: 'interactions',
      title: 'Interacting with Regions',
      description: 'Learn how to move, resize, and configure regions to build your perfect dashboard.',
      component: (
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Drag & Drop</h4>
            <p className="text-sm text-gray-600">
              Click and hold the drag handle (top-left) to move regions around the grid.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Resize</h4>
            <p className="text-sm text-gray-600">
              Hover over a region and use the resize handles on the edges to change its size.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Settings</h4>
            <p className="text-sm text-gray-600">
              Click the settings icon to customize colors, titles, and other region properties.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: "You're All Set!",
      description: 'Start building your dashboard. You can always access help and templates from the menu.',
      component: (
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <p className="text-gray-600">
            Ready to create your first dashboard? Click "Get Started" to begin!
          </p>
        </div>
      )
    }
  ];

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  }, [currentStep, steps.length, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    onSkip();
  }, [onSkip]);

  const currentStepData = steps[currentStep];
  const _progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      index <= currentStep
                        ? 'bg-blue-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            <button
              onClick={handleSkip}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Skip onboarding"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStepData?.title ?? ''}
              </h2>
              <p className="text-gray-600 mb-6">
                {currentStepData?.description ?? ''}
              </p>
              {currentStepData?.component}
            </motion.div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface TemplateSelectorProps {
  onSelect?: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  const templates = [
    { id: 'blank', name: 'Blank Dashboard', description: 'Start from scratch' },
    { id: 'manager', name: 'Manager View', description: 'Analytics, team overview, reports' },
    { id: 'technician', name: 'Technician View', description: 'Schedule, quick actions, customer search' },
    { id: 'executive', name: 'Executive Dashboard', description: 'KPIs, financial summary, analytics' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {templates.map(template => (
        <button
          key={template.id}
          onClick={() => onSelect?.(template.id)}
          className="border-2 border-gray-200 rounded-lg p-4 text-left hover:border-blue-500 hover:bg-blue-50 transition-all"
        >
          <h4 className="font-semibold mb-1">{template.name}</h4>
          <p className="text-sm text-gray-600">{template.description}</p>
        </button>
      ))}
    </div>
  );
};




