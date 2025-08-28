import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Status, 
  Container, 
  Grid, 
  Heading, 
  Text, 
  Badge, 
  Divider,
  Spinner 
} from '@/components/ui/CRMComponents';
import { 
  Input,
  Textarea,
  Checkbox
} from '@/components/ui/EnhancedUI';
import Select from '@/components/ui/Select';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database, 
  Save, 
  Settings as SettingsIcon,
  CheckCircle,
  AlertTriangle,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Lock,
  Key,
  Monitor,
  Zap
} from 'lucide-react';

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    bio: 'Experienced pest control professional with 5+ years in the industry.',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    theme: 'light',
    colorScheme: 'purple'
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, color: 'indigo' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'emerald' },
    { id: 'security', label: 'Security', icon: Shield, color: 'amber' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'violet' },
    { id: 'integrations', label: 'Integrations', icon: Globe, color: 'blue' },
    { id: 'data', label: 'Data & Privacy', icon: Database, color: 'rose' },
  ];

  const getTabColor = (color: string) => {
    const colors = {
      indigo: 'from-indigo-500 to-indigo-600',
      emerald: 'from-emerald-500 to-emerald-600',
      amber: 'from-amber-500 to-amber-600',
      violet: 'from-violet-500 to-violet-600',
      blue: 'from-blue-500 to-blue-600',
      rose: 'from-rose-500 to-rose-600'
    };
    return colors[color as keyof typeof colors] || 'from-indigo-500 to-indigo-600';
  };

  const getTabBgColor = (color: string) => {
    const colors = {
      indigo: 'bg-indigo-50',
      emerald: 'bg-emerald-50',
      amber: 'bg-amber-50',
      violet: 'bg-violet-50',
      blue: 'bg-blue-50',
      rose: 'bg-rose-50'
    };
    return colors[color as keyof typeof colors] || 'bg-indigo-50';
  };

  const getTabTextColor = (color: string) => {
    const colors = {
      indigo: 'text-indigo-700',
      emerald: 'text-emerald-700',
      amber: 'text-amber-700',
      violet: 'text-violet-700',
      blue: 'text-blue-700',
      rose: 'text-rose-700'
    };
    return colors[color as keyof typeof colors] || 'text-indigo-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Manage your account settings, preferences, and system configurations.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Sidebar Navigation */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-3">
            <div className="relative space-y-1">
              {/* Sliding indicator */}
              <div 
                className="absolute right-0 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-l-full transition-all duration-500 ease-out shadow-lg"
                style={{
                  top: `${tabs.findIndex(tab => tab.id === activeTab) * 36 + 4}px`,
                  transform: 'translateY(0)'
                }}
              />
              
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-300 ease-out text-sm ${
                      isActive
                        ? `${getTabBgColor(tab.color)} ${getTabTextColor(tab.color)} shadow-lg border border-white/50`
                        : 'text-slate-600 hover:bg-white/50 hover:shadow-md'
                    }`}
                  >
                    <div className={`p-1 rounded-md ${isActive ? 'bg-white/80' : 'bg-slate-100'}`}>
                      <Icon className={`w-3 h-3 ${isActive ? getTabTextColor(tab.color) : 'text-slate-500'}`} />
                    </div>
                    <span className="font-medium text-xs">{tab.label}</span>
                    {isActive && (
                      <div className="absolute right-2">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Profile Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bio</label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={2}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
                  />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Account Status</h2>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-emerald-800 text-xs">Active</span>
                  <span className="text-emerald-700 text-xs">Your account is active and in good standing</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="p-2 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-100">
                    <div className="text-xs font-medium text-slate-500 mb-1">Member Since</div>
                    <div className="text-sm font-semibold text-slate-800">January 2024</div>
                  </div>
                  <div className="p-2 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-100">
                    <div className="text-xs font-medium text-slate-500 mb-1">Last Login</div>
                    <div className="text-sm font-semibold text-slate-800">2 hours ago</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Notification Preferences</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-base font-semibold text-slate-800">Email Notifications</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'New job assignments', checked: true },
                      { label: 'Schedule updates', checked: true },
                      { label: 'Customer messages', checked: false }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-100">
                        <span className="text-slate-700 text-xs">{item.label}</span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          item.checked 
                            ? 'bg-emerald-500 border-emerald-500' 
                            : 'border-slate-300'
                        }`}>
                          {item.checked && <CheckCircle className="w-2 h-2 text-white" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <h3 className="text-base font-semibold text-slate-800">Push Notifications</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Urgent alerts', checked: true },
                      { label: 'Daily summaries', checked: false }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-100">
                        <span className="text-slate-700 text-xs">{item.label}</span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          item.checked 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-slate-300'
                        }`}>
                          {item.checked && <CheckCircle className="w-2 h-2 text-white" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Security Settings</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-2 py-1.5 pr-8 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg">
                    <Key className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Two-Factor Authentication</h2>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-violet-100 rounded-lg border border-violet-200">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-violet-500 rounded-md">
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-violet-800 text-sm">SMS Authentication</div>
                      <div className="text-violet-700 text-xs">Receive codes via text message</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 bg-emerald-100 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs font-semibold text-emerald-800">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Appearance Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Theme</label>
                  <select
                    value={formData.theme}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Color Scheme</label>
                  <select
                    value={formData.colorScheme}
                    onChange={(e) => setFormData(prev => ({ ...prev, colorScheme: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="purple">Purple (Default)</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { name: 'Purple', color: 'from-purple-500 to-purple-600' },
                    { name: 'Blue', color: 'from-blue-500 to-blue-600' },
                    { name: 'Green', color: 'from-emerald-500 to-emerald-600' }
                  ].map((scheme, index) => (
                    <div key={index} className="p-3 border-2 border-slate-200 rounded-lg hover:border-violet-300 transition-all duration-200 cursor-pointer">
                      <div className={`w-full h-6 bg-gradient-to-r ${scheme.color} rounded-md mb-2`}></div>
                      <div className="text-xs font-medium text-slate-700 text-center">{scheme.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Third-Party Integrations</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">G</span>
                    </div>
                    <div>
                      <div className="font-semibold text-blue-800 text-sm">Google Calendar</div>
                      <div className="text-blue-700 text-xs">Sync your schedule</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 bg-emerald-100 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs font-semibold text-emerald-800">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Slack</div>
                      <div className="text-slate-600 text-xs">Team notifications</div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-md hover:from-slate-600 hover:to-slate-700 transition-all duration-200 font-medium text-sm">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Data & Privacy</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="w-4 h-4 text-blue-600" />
                    <h3 className="text-base font-semibold text-blue-800">Data Export</h3>
                  </div>
                  <p className="text-blue-700 text-sm mb-3">
                    Download a copy of your data including jobs, customers, and settings.
                  </p>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-sm flex items-center gap-2">
                    <Download className="w-3 h-3" />
                    Export Data
                  </button>
                </div>
                <div className="p-4 bg-gradient-to-r from-rose-50 to-rose-100 rounded-lg border border-rose-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <h3 className="text-base font-semibold text-rose-800">Account Deletion</h3>
                  </div>
                  <p className="text-rose-700 text-sm mb-3">
                    Permanently delete your account and all associated data.
                  </p>
                  <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 font-medium text-sm flex items-center gap-2">
                    <Trash2 className="w-3 h-3" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
