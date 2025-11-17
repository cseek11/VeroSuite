import { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database, 
  Save, 
  Settings as SettingsIcon,
  Building2,
  CheckCircle
} from 'lucide-react';
import { 
  CompanySettings, 
  ProfileSettings, 
  NotificationSettings, 
  SecuritySettings, 
  AppearanceSettings, 
  IntegrationSettings, 
  DataSettings 
} from '@/components/settings/sections';
import { SuccessMessage } from '@/components/settings/shared/SuccessMessage';
import { logger } from '@/utils/logger';

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
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


  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'company') {
        // Company settings are handled by the CompanySettings component itself
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Company settings are managed by the CompanySettings component', {}, 'Settings');
        }
        return;
      } else {
        // Save other settings (profile, etc.)
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Settings saved successfully', {}, 'Settings');
        }
      }
      
      // Show success message for non-company tabs
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000); // Hide after 3 seconds
    } catch (error: unknown) {
      logger.error('Failed to save settings', error, 'Settings');
    }
    setIsLoading(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, color: 'indigo' },
    { id: 'company', label: 'Company', icon: Building2, color: 'purple' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'emerald' },
    { id: 'security', label: 'Security', icon: Shield, color: 'amber' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'violet' },
    { id: 'integrations', label: 'Integrations', icon: Globe, color: 'blue' },
    { id: 'data', label: 'Data & Privacy', icon: Database, color: 'rose' },
  ];

  const getTabBgColor = (color: string) => {
    const colors = {
      indigo: 'bg-indigo-50',
      purple: 'bg-purple-50',
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
      {/* Success Message */}
      <SuccessMessage show={showSuccessMessage} />
      
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
            <ProfileSettings
              formData={formData}
              updateFormData={updateFormData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          )}

          {activeTab === 'company' && (
            <CompanySettings
              isLoading={isLoading}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings />
          )}

          {activeTab === 'security' && (
            <SecuritySettings />
          )}

          {activeTab === 'appearance' && (
            <AppearanceSettings
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {activeTab === 'integrations' && (
            <IntegrationSettings />
          )}

          {activeTab === 'data' && (
            <DataSettings />
          )}

        </div>

        {/* Save Button - Only show for non-company tabs */}
        {activeTab !== 'company' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
