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
  Settings as SettingsIcon 
} from 'lucide-react';

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
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
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'data', label: 'Data & Privacy', icon: Database },
  ];

  return (
    <div className="crm-fade-in-up">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="w-8 h-8 text-purple-600" />
            <Heading level={1}>Settings</Heading>
          </div>
          <Text variant="secondary">
            Manage your account settings, preferences, and system configurations.
          </Text>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <div className="relative space-y-1">
                {/* Sliding indicator */}
                <div 
                  className="absolute right-0 w-1 h-12 bg-purple-600 rounded-l-full transition-all duration-300 ease-out"
                  style={{
                    top: `${tabs.findIndex(tab => tab.id === activeTab) * 48 + 8}px`,
                    transform: 'translateY(0)'
                  }}
                />
                
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-all duration-300 ease-out ${
                        activeTab === tab.id
                          ? 'bg-purple-50 text-purple-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card
                  header={
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-purple-600" />
                      <Heading level={3}>Profile Information</Heading>
                    </div>
                  }
                >
                  <Grid cols={2}>
                    <Input
                      label="First Name"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(value) => setFormData(prev => ({ ...prev, firstName: value }))}
                    />
                    <Input
                      label="Last Name"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(value) => setFormData(prev => ({ ...prev, lastName: value }))}
                    />
                  </Grid>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                  />
                  <Textarea
                    label="Bio"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(value) => setFormData(prev => ({ ...prev, bio: value }))}
                  />
                </Card>

                <Card
                  header={
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <Heading level={3}>Account Status</Heading>
                    </div>
                  }
                >
                  <div className="flex items-center gap-4">
                    <Status variant="success">Active</Status>
                    <Text variant="secondary">Your account is active and in good standing</Text>
                  </div>
                  <Divider />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Text variant="small" className="text-slate-500">Member Since</Text>
                      <Text variant="body">January 2024</Text>
                    </div>
                    <div>
                      <Text variant="small" className="text-slate-500">Last Login</Text>
                      <Text variant="body">2 hours ago</Text>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'notifications' && (
              <Card
                header={
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-purple-600" />
                    <Heading level={3}>Notification Preferences</Heading>
                  </div>
                }
              >
                <div className="space-y-6">
                  <div>
                    <Text variant="body" className="font-medium mb-3">Email Notifications</Text>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Text variant="secondary">New job assignments</Text>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Text variant="secondary">Schedule updates</Text>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Text variant="secondary">Customer messages</Text>
                        <Checkbox />
                      </div>
                    </div>
                  </div>
                  <Divider />
                  <div>
                    <Text variant="body" className="font-medium mb-3">Push Notifications</Text>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Text variant="secondary">Urgent alerts</Text>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Text variant="secondary">Daily summaries</Text>
                        <Checkbox />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card
                  header={
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <Heading level={3}>Security Settings</Heading>
                    </div>
                  }
                >
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={(value) => setFormData(prev => ({ ...prev, currentPassword: value }))}
                  />
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(value) => setFormData(prev => ({ ...prev, newPassword: value }))}
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
                  />
                </Card>

                <Card
                  header={
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <Heading level={3}>Two-Factor Authentication</Heading>
                    </div>
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Text variant="body" className="font-medium">SMS Authentication</Text>
                      <Text variant="secondary">Receive codes via text message</Text>
                    </div>
                    <Status variant="success">Enabled</Status>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'appearance' && (
              <Card
                header={
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <Heading level={3}>Appearance Settings</Heading>
                  </div>
                }
              >
                <Select
                  label="Theme"
                  value={formData.theme}
                  onChange={(value) => setFormData(prev => ({ ...prev, theme: value }))}
                  options={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'auto', label: 'Auto' },
                  ]}
                />
                <Select
                  label="Color Scheme"
                  value={formData.colorScheme}
                  onChange={(value) => setFormData(prev => ({ ...prev, colorScheme: value }))}
                  options={[
                    { value: 'purple', label: 'Purple (Default)' },
                    { value: 'blue', label: 'Blue' },
                    { value: 'green', label: 'Green' },
                  ]}
                />
              </Card>
            )}

            {activeTab === 'integrations' && (
              <Card
                header={
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-purple-600" />
                    <Heading level={3}>Third-Party Integrations</Heading>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">G</span>
                      </div>
                      <div>
                        <Text variant="body" className="font-medium">Google Calendar</Text>
                        <Text variant="secondary">Sync your schedule</Text>
                      </div>
                    </div>
                    <Status variant="success">Connected</Status>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold">S</span>
                      </div>
                      <div>
                        <Text variant="body" className="font-medium">Slack</Text>
                        <Text variant="secondary">Team notifications</Text>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">Connect</Button>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'data' && (
              <Card
                header={
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-purple-600" />
                    <Heading level={3}>Data & Privacy</Heading>
                  </div>
                }
              >
                <div className="space-y-6">
                  <div>
                    <Text variant="body" className="font-medium mb-3">Data Export</Text>
                    <Text variant="secondary" className="mb-4">
                      Download a copy of your data including jobs, customers, and settings.
                    </Text>
                    <Button variant="secondary">Export Data</Button>
                  </div>
                  <Divider />
                  <div>
                    <Text variant="body" className="font-medium mb-3">Account Deletion</Text>
                    <Text variant="secondary" className="mb-4">
                      Permanently delete your account and all associated data.
                    </Text>
                    <Button variant="danger">Delete Account</Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
}
