import React, { useState } from 'react';
import { Settings, FileText, Clock, Map } from 'lucide-react';
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
      icon: Settings,
      current: viewMode === 'types',
    },
    {
      id: 'templates',
      name: 'Service Templates',
      description: 'Create and manage service templates by customer segment',
      icon: FileText,
      current: viewMode === 'templates',
    },
    {
      id: 'scheduling',
      name: 'Service Scheduling',
      description: 'Schedule and manage service appointments',
      icon: Clock,
      current: viewMode === 'scheduling',
    },
    {
      id: 'history',
      name: 'Service History',
      description: 'Track service execution and customer feedback',
      icon: Clock,
      current: viewMode === 'history',
    },
    {
      id: 'routing',
      name: 'Route Optimization',
      description: 'Optimize technician routes for efficiency',
      icon: Map,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Service Management
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Comprehensive service management system for pest control operations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <nav className="flex space-x-8" aria-label="Tabs">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setViewMode(item.id as ServiceViewMode)}
                className={`
                  flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200
                  ${item.current
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
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

      {/* Main Content */}
      <div>
        {renderContent()}
      </div>

      {/* Quick Stats Overview */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="mb-4 pb-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">System Overview</h3>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-slate-600">Service Types</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">7</div>
              <div className="text-sm text-slate-600">Customer Segments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-slate-600">Scheduling</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">AI-Powered</div>
              <div className="text-sm text-slate-600">Route Optimization</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="mb-4 pb-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">Key Features</h3>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900">Service Type Management</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Define and manage service types, categories, and pricing structures
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900">Service Templates</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Create standardized service templates by customer segment
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900">Smart Scheduling</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Intelligent scheduling with conflict detection and optimization
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900">Service History</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Comprehensive tracking of service execution and customer feedback
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Map className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900">Route Optimization</h4>
                <p className="text-sm text-slate-600 mt-1">
                  AI-powered route optimization for maximum efficiency
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900">Multi-tenant</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Secure, isolated data management for multiple business units
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Notes */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Integration & Next Steps</h3>
          <div className="text-sm text-slate-700 space-y-2">
            <p><strong>Current Status:</strong> Service Management Foundation (Week 3) - Complete</p>
            <p><strong>Next Phase:</strong> Work Order Management (Week 4) - Starting next</p>
            <p><strong>Integration Points:</strong> All components integrate with existing customer management system</p>
            <p><strong>Data Flow:</strong> Service types → Templates → Scheduling → History → Analytics</p>
            <p className="text-xs mt-4 text-slate-600">
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
