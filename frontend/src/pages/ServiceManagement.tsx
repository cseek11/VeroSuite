import React, { useState } from 'react';
import { Cog6ToothIcon, DocumentTextIcon, ClockIcon, MapIcon } from '@heroicons/react/24/outline';
import ServiceTypeManagement from '@/components/services/ServiceTypeManagement';
import ServiceTemplates from '@/components/services/ServiceTemplates';
import ServiceHistory from '@/components/services/ServiceHistory';
import ServiceScheduling from '@/components/services/ServiceScheduling';
import RouteOptimization from '@/components/services/RouteOptimization';

type ServiceViewMode = 'types' | 'templates' | 'scheduling' | 'history' | 'routing';

export default function ServiceManagement() {
  const [viewMode, setViewMode] = useState<ServiceViewMode>('types');

  const navigation = [
    {
      id: 'types',
      name: 'Service Types',
      description: 'Manage service types and categories',
      icon: Cog6ToothIcon,
      current: viewMode === 'types',
    },
    {
      id: 'templates',
      name: 'Service Templates',
      description: 'Create and manage service templates by customer segment',
      icon: DocumentTextIcon,
      current: viewMode === 'templates',
    },
    {
      id: 'scheduling',
      name: 'Service Scheduling',
      description: 'Schedule and manage service appointments',
      icon: ClockIcon,
      current: viewMode === 'scheduling',
    },
    {
      id: 'history',
      name: 'Service History',
      description: 'Track service execution and customer feedback',
      icon: ClockIcon,
      current: viewMode === 'history',
    },
    {
      id: 'routing',
      name: 'Route Optimization',
      description: 'Optimize technician routes for efficiency',
      icon: MapIcon,
      current: viewMode === 'routing',
    },
  ];

  const renderContent = () => {
    switch (viewMode) {
      case 'types':
        return <ServiceTypeManagement />;
      case 'templates':
        return <ServiceTemplates />;
      case 'scheduling':
        return <ServiceScheduling />;
      case 'history':
        return <ServiceHistory />;
      case 'routing':
        return <RouteOptimization />;
      default:
        return <ServiceTypeManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Comprehensive service management system for pest control operations
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 rounded-full p-3">
                  <Cog6ToothIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setViewMode(item.id as ServiceViewMode)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${item.current
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>

      {/* Quick Stats Overview */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg mx-4 sm:mx-6 lg:mx-8 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">System Overview</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-gray-500">Service Types</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">7</div>
              <div className="text-sm text-gray-500">Customer Segments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-500">Scheduling</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">AI-Powered</div>
              <div className="text-sm text-gray-500">Route Optimization</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg mx-4 sm:mx-6 lg:mx-8 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Key Features</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CogIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Service Type Management</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Define and manage service types, categories, and pricing structures
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TemplateIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Service Templates</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Create standardized service templates by customer segment
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Smart Scheduling</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Intelligent scheduling with conflict detection and optimization
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Service History</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Comprehensive tracking of service execution and customer feedback
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <MapIcon className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Route Optimization</h4>
                <p className="text-sm text-gray-500 mt-1">
                  AI-powered route optimization for maximum efficiency
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <CogIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Multi-tenant</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Secure, isolated data management for multiple business units
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg mx-4 sm:mx-6 lg:mx-8 mb-8">
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Integration & Next Steps</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Current Status:</strong> Service Management Foundation (Week 3) - Complete</p>
            <p><strong>Next Phase:</strong> Work Order Management (Week 4) - Starting next</p>
            <p><strong>Integration Points:</strong> All components integrate with existing customer management system</p>
            <p><strong>Data Flow:</strong> Service types → Templates → Scheduling → History → Analytics</p>
            <p className="text-xs mt-4">
              Note: This foundation provides the core service management capabilities. 
              Future enhancements will include advanced scheduling algorithms, mobile technician apps, 
              and real-time GPS tracking integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
