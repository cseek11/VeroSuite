import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Save
} from 'lucide-react';

export default function CRMDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    description: ''
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              CRM Component Demo
            </h1>
            <p className="text-slate-600 text-sm">
              Showcasing the new productivity-focused CRM design system
            </p>
          </div>
        </div>
      </div>

      {/* Typography Showcase */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-1 bg-indigo-100 rounded-md">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Typography System</h3>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-slate-900">Heading Level 1</h1>
          <h2 className="text-xl font-bold text-slate-900">Heading Level 2</h2>
          <h3 className="text-lg font-bold text-slate-900">Heading Level 3</h3>
          <h4 className="text-base font-bold text-slate-900">Heading Level 4</h4>
          <p className="text-sm text-slate-700">This is body text with good readability and proper line height.</p>
          <p className="text-sm text-slate-600">This is secondary text for supporting information.</p>
          <p className="text-xs text-slate-500">This is small text for captions and metadata.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Button Showcase */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-1 bg-indigo-100 rounded-md">
              <Settings className="h-4 w-4 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Button System</h3>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm">
                Primary
              </button>
              <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 font-medium text-sm">
                Secondary
              </button>
              <button className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-3 py-1.5 rounded-lg hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm">
                Success
              </button>
              <button className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-3 py-1.5 rounded-lg hover:from-rose-700 hover:to-rose-800 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm">
                Danger
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-xs">
                Small
              </button>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm">
                Medium
              </button>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                Large
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="bg-slate-300 text-slate-500 px-3 py-1.5 rounded-lg font-medium text-sm cursor-not-allowed" disabled>
                Disabled
              </button>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm flex items-center gap-2">
                <Plus className="h-3 w-3" />
                With Icon
              </button>
            </div>
          </div>
        </div>

        {/* Status & Badge Showcase */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-1 bg-emerald-100 rounded-md">
              <Users className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Status & Badges</h3>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">Active</span>
              <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Pending</span>
              <span className="px-2 py-1 text-xs rounded-full bg-rose-100 text-rose-800">Error</span>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Info</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-800">Default</span>
              <span className="px-2 py-1 text-xs rounded-full bg-violet-100 text-violet-800">Custom</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Form Components */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-1 bg-blue-100 rounded-md">
              <Edit className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Form Components</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                rows={3}
                placeholder="Enter description"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Submit Form</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading States */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-1 bg-amber-100 rounded-md">
              <Download className="h-4 w-4 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Loading States</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
              <p className="text-sm text-slate-600">Small spinner</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent"></div>
              <p className="text-sm text-slate-600">Medium spinner</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
              <p className="text-sm text-slate-600">Large spinner</p>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
            </div>
            <button
              disabled
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg shadow-lg transition-all duration-200 font-medium text-sm flex items-center gap-2 opacity-50"
            >
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Loading Button
            </button>
          </div>
        </div>
      </div>

      {/* Data Table Example */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-indigo-100 rounded-md">
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Customer Management</h3>
          </div>
          <div className="flex gap-2">
            <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm">
              <Filter className="h-3 w-3" />
              Filter
            </button>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium text-sm">
              <Plus className="h-3 w-3" />
              Add Customer
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Last Visit</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">John Smith</p>
                    <p className="text-xs text-slate-500">+1 (555) 123-4567</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-slate-900">john.smith@email.com</p>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">Active</span>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-slate-600">2 days ago</p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-white hover:shadow-lg transition-all duration-200">
                      <Eye className="h-3 w-3" />
                    </button>
                    <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-white hover:shadow-lg transition-all duration-200">
                      <Edit className="h-3 w-3" />
                    </button>
                    <button className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-2 py-1 rounded hover:from-rose-700 hover:to-rose-800 shadow-lg hover:shadow-xl transition-all duration-200">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Sarah Johnson</p>
                    <p className="text-xs text-slate-500">+1 (555) 987-6543</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-slate-900">sarah.johnson@email.com</p>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Pending</span>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-slate-600">1 week ago</p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-white hover:shadow-lg transition-all duration-200">
                      <Eye className="h-3 w-3" />
                    </button>
                    <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-white hover:shadow-lg transition-all duration-200">
                      <Edit className="h-3 w-3" />
                    </button>
                    <button className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-2 py-1 rounded hover:from-rose-700 hover:to-rose-800 shadow-lg hover:shadow-xl transition-all duration-200">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid Layout Example */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-1 bg-indigo-100 rounded-md">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Dashboard Grid</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Total Customers</h4>
              <p className="text-xl font-bold text-violet-600 mb-1">1,234</p>
              <p className="text-xs text-emerald-600">+12% from last month</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Active Jobs</h4>
              <p className="text-xl font-bold text-blue-600 mb-1">89</p>
              <p className="text-xs text-emerald-600">+5% from last week</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Revenue</h4>
              <p className="text-xl font-bold text-emerald-600 mb-1">$45,678</p>
              <p className="text-xs text-emerald-600">+8% from last month</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Settings className="h-5 w-5 text-amber-600" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Pending</h4>
              <p className="text-xl font-bold text-amber-600 mb-1">23</p>
              <p className="text-xs text-rose-600">-3% from last week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
