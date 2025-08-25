import React, { useState } from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
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
  RotateCcw
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
  const [settings, setSettings] = useState(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save settings logic here
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(false);
  };

  return (
    <LayoutWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h1" className="text-gray-900">
            Settings
          </Typography>
          <Typography variant="body1" className="text-gray-600 mt-2">
            Configure your VeroPest Suite preferences and system settings.
          </Typography>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Branding & Appearance */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-purple-500" />
              <Typography variant="h6" className="text-gray-900">
                Branding & Appearance
              </Typography>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Color
                  </label>
                  <input 
                    type="color" 
                    value={settings.primaryColor} 
                    onChange={e => handleSettingChange('primaryColor', e.target.value)}
                    className="w-full h-10 rounded border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Color
                  </label>
                  <input 
                    type="color" 
                    value={settings.secondaryColor} 
                    onChange={e => handleSettingChange('secondaryColor', e.target.value)}
                    className="w-full h-10 rounded border"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Family
                </label>
                <select 
                  value={settings.fontFamily} 
                  onChange={e => handleSettingChange('fontFamily', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Arial">Arial</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
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

          {/* Layout & Navigation */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="h-5 w-5 text-blue-500" />
              <Typography variant="h6" className="text-gray-900">
                Layout & Navigation
              </Typography>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={settings.showNavBar}
                  onChange={(checked) => handleSettingChange('showNavBar', checked)}
                />
                <label className="text-sm font-medium text-gray-700">
                  Show Navigation Bar
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={settings.showSidebar}
                  onChange={(checked) => handleSettingChange('showSidebar', checked)}
                />
                <label className="text-sm font-medium text-gray-700">
                  Show Sidebar
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Landing Page
                </label>
                <select 
                  value={settings.defaultLandingPage} 
                  onChange={e => handleSettingChange('defaultLandingPage', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="jobs">Jobs</option>
                  <option value="customers">Customers</option>
                  <option value="reports">Reports</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-yellow-500" />
              <Typography variant="h6" className="text-gray-900">
                Notifications
              </Typography>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={settings.notificationSettings.email}
                  onChange={(checked) => handleSettingChange('notificationSettings', { ...settings.notificationSettings, email: checked })}
                />
                <label className="text-sm font-medium text-gray-700">
                  Email Notifications
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={settings.notificationSettings.sms}
                  onChange={(checked) => handleSettingChange('notificationSettings', { ...settings.notificationSettings, sms: checked })}
                />
                <label className="text-sm font-medium text-gray-700">
                  SMS Notifications
                </label>
              </div>
              
              <div className="flex items-center gap-2">
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
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-red-500" />
              <Typography variant="h6" className="text-gray-900">
                Security
              </Typography>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={settings.requireLogin}
                  onChange={(checked) => handleSettingChange('requireLogin', checked)}
                />
                <label className="text-sm font-medium text-gray-700">
                  Require Login
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={settings.twoFactorAuth}
                  onChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
                <label className="text-sm font-medium text-gray-700">
                  Two-Factor Authentication
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (minutes)
                </label>
                <input 
                  type="number" 
                  value={settings.sessionTimeout} 
                  onChange={e => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="5"
                  max="480"
                />
              </div>
            </div>
          </Card>

          {/* Integrations */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-green-500" />
              <Typography variant="h6" className="text-gray-900">
                Integrations
              </Typography>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={settings.thirdPartyIntegrations.google}
                  onChange={(checked) => handleSettingChange('thirdPartyIntegrations', { ...settings.thirdPartyIntegrations, google: checked })}
                />
                <label className="text-sm font-medium text-gray-700">
                  Google Calendar Integration
                </label>
              </div>
              
              <div className="flex items-center gap-2">
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
    </LayoutWrapper>
  );
}
