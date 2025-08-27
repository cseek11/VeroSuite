import React, { useState } from 'react';

import {
  Typography,
  Button,
  Card,
  Input,
  Checkbox
} from '@/components/ui/EnhancedUI';
import {
  Settings as SettingsIcon,
  Palette,
  Layout,
  Bell,
  Shield,
  Globe,
  Save,
  RotateCcw,
  ChevronRight
} from 'lucide-react';

const defaultSettings = {
  // Branding & Appearance
  primaryColor: '#cb0c9f',
  secondaryColor: '#8392ab',
  accentColor: '#17c1e8',
  successColor: '#82d616',
  warningColor: '#fb6340',
  dangerColor: '#ea0606',
  logo: '',
  brandName: 'VeroSuite',
  fontFamily: 'Inter',
  fontSize: 'medium',
  borderRadius: 'large',
  shadowIntensity: 'medium',
  backgroundPattern: 'none',
  glassEffect: false,
  darkMode: false,
  sidebarWidth: 'normal',
  headerHeight: 'normal',
  customCSS: '',
  // Layout & Navigation
  showNavBar: true,
  showSidebar: true,
  sidebarPosition: 'left',
  defaultLandingPage: 'dashboard',
  pageTransitions: true,
  preferredLayout: 'v3', // 'v3' or 'v4'
  // Calendar & Jobs
  defaultCalendarView: 'month',
  businessHours: { start: '08:00', end: '18:00', daysOfWeek: [1,2,3,4,5] },
  eventColorMapping: 'status',
  eventDragDrop: true,
  eventResizing: true,
  notificationSettings: { email: true, sms: false, inApp: true },
  // User & Security
  requireLogin: true,
  passwordPolicy: { minLength: 8, complexity: 'medium' },
  sessionTimeout: 30,
  twoFactorAuth: false,
  allowedRoles: ['admin', 'dispatcher', 'technician'],
  // Integrations
  apiKeys: { supabase: '', fullcalendar: '' },
  webhookURLs: [],
  thirdPartyIntegrations: { google: false, slack: false }
};

export default function Settings() {
  const [settings, setSettings] = useState(() => {
    // Load saved layout preference
    const savedLayout = localStorage.getItem('preferred-layout');
    return {
      ...defaultSettings,
      preferredLayout: savedLayout || 'v3'
    };
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save settings logic here
    localStorage.setItem('preferred-layout', settings.preferredLayout);
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <SettingsIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <Typography variant="h1" className="text-gray-900 text-3xl font-bold">
                Settings
              </Typography>
              <Typography variant="body1" className="text-gray-600 mt-1">
                Configure your VeroPest Suite preferences and system settings.
              </Typography>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Layout & Navigation */}
          <Card className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Layout className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <Typography variant="h6" className="text-gray-900 font-semibold">
                  Layout & Navigation
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Customize your interface layout
                </Typography>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Layout
                </label>
                <select 
                  value={settings.preferredLayout} 
                  onChange={e => handleSettingChange('preferredLayout', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                >
                  <option value="v3">Classic Layout (V3)</option>
                  <option value="v4">Modern Layout (V4)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose between the classic layout or the new modern V4 layout with enhanced sidebar and activity panel.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={settings.showNavBar}
                  onChange={(checked) => handleSettingChange('showNavBar', checked)}
                />
                <label className="text-sm font-medium text-gray-700">
                  Show Navigation Bar
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={settings.showSidebar}
                  onChange={(checked) => handleSettingChange('showSidebar', checked)}
                />
                <label className="text-sm font-medium text-gray-700">
                  Show Sidebar
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={settings.pageTransitions}
                  onChange={(checked) => handleSettingChange('pageTransitions', checked)}
                />
                <label className="text-sm font-medium text-gray-700">
                  Enable Page Transitions
                </label>
              </div>
            </div>
          </Card>

          {/* Branding & Appearance */}
          <Card className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Palette className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <Typography variant="h6" className="text-gray-900 font-semibold">
                  Branding & Appearance
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Customize colors and styling
                </Typography>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <input 
                    type="color" 
                    value={settings.primaryColor} 
                    onChange={e => handleSettingChange('primaryColor', e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <input 
                    type="color" 
                    value={settings.secondaryColor} 
                    onChange={e => handleSettingChange('secondaryColor', e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
              
              <div>
                <Input
                  label="Brand Name"
                  value={settings.brandName}
                  onChange={(value) => handleSettingChange('brandName', value)}
                  placeholder="Enter brand name"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select 
                  value={settings.fontFamily} 
                  onChange={e => handleSettingChange('fontFamily', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Arial">Arial</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={settings.darkMode}
                  onChange={(checked) => handleSettingChange('darkMode', checked)}
                />
                <label className="text-sm font-medium text-gray-700">
                  Enable Dark Mode
                </label>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Bell className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <Typography variant="h6" className="text-gray-900 font-semibold">
                  Notifications
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Manage notification preferences
                </Typography>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={settings.notificationSettings.email}
                  onChange={(checked) => handleSettingChange('notificationSettings', { ...settings.notificationSettings, email: checked })}
                />
                <label className="text-sm font-medium text-gray-700">
                  Email Notifications
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={settings.notificationSettings.sms}
                  onChange={(checked) => handleSettingChange('notificationSettings', { ...settings.notificationSettings, sms: checked })}
                />
                <label className="text-sm font-medium text-gray-700">
                  SMS Notifications
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={settings.notificationSettings.inApp}
                  onChange={(checked) => handleSettingChange('notificationSettings', { ...settings.notificationSettings, inApp: checked })}
                />
                <label className="text-sm font-medium text-gray-700">
                  In-App Notifications
                </label>
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <Typography variant="h6" className="text-gray-900 font-semibold">
                  Security
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Security and authentication settings
                </Typography>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={settings.requireLogin}
                  onChange={(checked) => handleSettingChange('requireLogin', checked)}
                />
                <label className="text-sm font-medium text-gray-700">
                  Require Login
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={settings.twoFactorAuth}
                  onChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
                <label className="text-sm font-medium text-gray-700">
                  Two-Factor Authentication
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input 
                  type="number" 
                  value={settings.sessionTimeout} 
                  onChange={e => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                  min="5"
                  max="480"
                />
              </div>
            </div>
          </Card>

          {/* Integrations */}
          <Card className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <Typography variant="h6" className="text-gray-900 font-semibold">
                  Integrations
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Third-party service integrations
                </Typography>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={settings.thirdPartyIntegrations.google}
                  onChange={(checked) => handleSettingChange('thirdPartyIntegrations', { ...settings.thirdPartyIntegrations, google: checked })}
                />
                <label className="text-sm font-medium text-gray-700">
                  Google Calendar Integration
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={settings.thirdPartyIntegrations.slack}
                  onChange={(checked) => handleSettingChange('thirdPartyIntegrations', { ...settings.thirdPartyIntegrations, slack: checked })}
                />
                <label className="text-sm font-medium text-gray-700">
                  Slack Notifications
                </label>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
