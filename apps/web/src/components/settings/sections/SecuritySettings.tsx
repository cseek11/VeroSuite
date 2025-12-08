import React from 'react';
import { Shield, Key, Smartphone, Download } from 'lucide-react';
import { SettingsCard } from '../shared/SettingsCard';

export const SecuritySettings: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Two-Factor Authentication */}
      <SettingsCard title="Two-Factor Authentication" icon={Shield}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div>
              <h3 className="font-semibold text-green-800">2FA Enabled</h3>
              <p className="text-sm text-green-600">Your account is protected with two-factor authentication</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                Manage
              </button>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* API Keys */}
      <SettingsCard title="API Keys" icon={Key}>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-800">Production API Key</h3>
                <p className="text-sm text-yellow-600">Last used: 2 hours ago</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors">
                  Regenerate
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-800">Development API Key</h3>
                <p className="text-sm text-blue-600">Last used: Never</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Session Management */}
      <SettingsCard title="Session Management" icon={Smartphone}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Session Timeout
              </label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="240">4 hours</option>
                <option value="480">8 hours</option>
                <option value="1440">24 hours</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Concurrent Sessions
              </label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <option value="1">1 device</option>
                <option value="3">3 devices</option>
                <option value="5">5 devices</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
            <div>
              <h3 className="font-semibold text-red-800">Terminate All Sessions</h3>
              <p className="text-sm text-red-600">Sign out from all devices</p>
            </div>
            <button className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
              Sign Out All
            </button>
          </div>
        </div>
      </SettingsCard>

      {/* Backup & Recovery */}
      <SettingsCard title="Backup & Recovery" icon={Download}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <h3 className="font-semibold text-blue-800">Download Account Data</h3>
              <p className="text-sm text-blue-600">Export your account information</p>
            </div>
            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              Download
            </button>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
