import React, { useState } from 'react';
import { Bell, Shield, User, Mail, Save } from 'lucide-react';
import { Button, Typography, Switch } from '@/components/ui';

interface CustomerSettingsProps {
  customerId: string;
}

const CustomerSettings: React.FC<CustomerSettingsProps> = ({ customerId: _customerId }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    serviceReminders: true,
    paymentReminders: true,
    marketingEmails: false,
    emergencyAlerts: true,
    autoScheduling: false,
    paperlessBilling: true
  });

  const preferences = {
    preferredContact: 'email',
    preferredTime: '9:00 AM - 5:00 PM',
    doNotDisturb: 'No restrictions',
    language: 'English',
    timezone: 'Eastern Time'
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h3" className="text-lg font-semibold text-gray-900">
          Customer Settings
        </Typography>
        <Button size="sm" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg p-4 border border-gray-200/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Notification Preferences</h4>
            <p className="text-sm text-gray-600">Manage how you receive notifications</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-600">Receive updates via text message</p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Service Reminders</p>
              <p className="text-sm text-gray-600">Get reminded about upcoming services</p>
            </div>
            <Switch
              checked={settings.serviceReminders}
              onCheckedChange={(checked) => handleSettingChange('serviceReminders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Payment Reminders</p>
              <p className="text-sm text-gray-600">Receive payment due notifications</p>
            </div>
            <Switch
              checked={settings.paymentReminders}
              onCheckedChange={(checked) => handleSettingChange('paymentReminders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Emergency Alerts</p>
              <p className="text-sm text-gray-600">Get notified about urgent issues</p>
            </div>
            <Switch
              checked={settings.emergencyAlerts}
              onCheckedChange={(checked) => handleSettingChange('emergencyAlerts', checked)}
            />
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg p-4 border border-gray-200/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Account Preferences</h4>
            <p className="text-sm text-gray-600">Manage your account settings</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Auto Scheduling</p>
              <p className="text-sm text-gray-600">Allow automatic service scheduling</p>
            </div>
            <Switch
              checked={settings.autoScheduling}
              onCheckedChange={(checked) => handleSettingChange('autoScheduling', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Paperless Billing</p>
              <p className="text-sm text-gray-600">Receive invoices electronically</p>
            </div>
            <Switch
              checked={settings.paperlessBilling}
              onCheckedChange={(checked) => handleSettingChange('paperlessBilling', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Marketing Communications</p>
              <p className="text-sm text-gray-600">Receive promotional emails</p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
            />
          </div>
        </div>
      </div>

      {/* Contact Preferences */}
      <div className="bg-white rounded-lg p-4 border border-gray-200/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Contact Preferences</h4>
            <p className="text-sm text-gray-600">How and when to contact you</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
            <p className="text-sm text-gray-900">{preferences.preferredContact}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Time</label>
            <p className="text-sm text-gray-900">{preferences.preferredTime}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Do Not Disturb</label>
            <p className="text-sm text-gray-900">{preferences.doNotDisturb}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <p className="text-sm text-gray-900">{preferences.language}</p>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm">
            Update Preferences
          </Button>
          <Button variant="outline" size="sm">
            View Full Profile
          </Button>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white rounded-lg p-4 border border-gray-200/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Privacy & Security</h4>
            <p className="text-sm text-gray-600">Manage your data and privacy</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Data Sharing</p>
              <p className="text-sm text-gray-600">Allow data sharing for service improvement</p>
            </div>
            <Switch checked={false} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Location Services</p>
              <p className="text-sm text-gray-600">Allow location access for service scheduling</p>
            </div>
            <Switch checked={true} />
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm">
            Download Data
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;
