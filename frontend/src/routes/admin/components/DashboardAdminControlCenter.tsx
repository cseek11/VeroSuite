import React, { useState, useEffect } from 'react';
import { Shield, FileText, Layout, Trash2, Edit2, Eye } from 'lucide-react';
import { enhancedApi } from '@/lib/enhanced-api';
import { WidgetBuilder } from './WidgetBuilder';

interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  role: string;
  isSystem: boolean;
  regionCount: number;
  createdAt: string;
}

interface WidgetRegistryItem {
  id: string;
  widget_id: string;
  name: string;
  version: string;
  is_approved: boolean;
  is_public: boolean;
  created_by: string;
  created_at: string;
}

export const DashboardAdminControlCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'widgets' | 'permissions' | 'audit'>('templates');
  // const [, setTemplates] = useState<LayoutTemplate[]>([]); // Reserved for future template management
  const [widgets, setWidgets] = useState<WidgetRegistryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showWidgetBuilder, setShowWidgetBuilder] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'widgets') {
        const data = await enhancedApi.dashboardLayouts.getApprovedWidgets();
        setWidgets(data || []);
      }
      // Templates and other data would be loaded from API
    } catch (error) {
      // Error handling would be implemented here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Administration</h2>
        <p className="text-gray-600">Manage layout templates, widgets, permissions, and audit logs</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'templates', label: 'Layout Templates', icon: Layout },
            { id: 'widgets', label: 'Widget Registry', icon: FileText },
            { id: 'permissions', label: 'Permission Matrix', icon: Shield },
            { id: 'audit', label: 'Audit Trail', icon: Eye }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'templates' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Layout Templates</h3>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Create Template
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Template cards would go here */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600">No templates yet</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'widgets' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Widget Registry</h3>
              <button 
                onClick={() => setShowWidgetBuilder(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Register Widget
              </button>
            </div>
            {showWidgetBuilder && (
              <div className="mb-6">
                <WidgetBuilder
                  onClose={() => setShowWidgetBuilder(false)}
                  onSave={() => {
                    setShowWidgetBuilder(false);
                    loadData();
                  }}
                />
              </div>
            )}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Widget ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {widgets.map((widget) => (
                      <tr key={widget.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {widget.widget_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{widget.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{widget.version}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            widget.is_approved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {widget.is_approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-4">
                            <Edit2 className="w-4 h-4 inline" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'permissions' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Permission Matrix</h3>
            <p className="text-gray-600">Permission matrix UI would go here</p>
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Audit Trail</h3>
            <p className="text-gray-600">Audit log viewer would go here</p>
          </div>
        )}
      </div>
    </div>
  );
};

