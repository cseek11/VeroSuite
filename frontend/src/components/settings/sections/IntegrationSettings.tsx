import React from 'react';
import { Globe, Database, Smartphone } from 'lucide-react';
import { SettingsCard } from '../shared/SettingsCard';

export const IntegrationSettings: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* API Integrations */}
      <SettingsCard title="API Integrations" icon={Globe}>
        <div className="space-y-4">
          {[
            { name: 'QuickBooks', status: 'Connected', color: 'green' },
            { name: 'Stripe', status: 'Connected', color: 'green' },
            { name: 'Google Calendar', status: 'Disconnected', color: 'red' },
            { name: 'Mailchimp', status: 'Pending', color: 'yellow' }
          ].map((integration, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
              <div>
                <h3 className="font-semibold text-slate-800">{integration.name}</h3>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  integration.color === 'green' ? 'bg-green-100 text-green-800' :
                  integration.color === 'red' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {integration.status}
                </span>
              </div>
              <button className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                {integration.status === 'Connected' ? 'Manage' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Database Sync */}
      <SettingsCard title="Database Synchronization" icon={Database}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div>
              <h3 className="font-semibold text-green-800">Auto Sync Enabled</h3>
              <p className="text-sm text-green-600">Last sync: 5 minutes ago</p>
            </div>
            <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
              Sync Now
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sync Frequency
              </label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <option value="5">Every 5 minutes</option>
                <option value="15">Every 15 minutes</option>
                <option value="30">Every 30 minutes</option>
                <option value="60">Every hour</option>
              </select>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Mobile App */}
      <SettingsCard title="Mobile App Settings" icon={Smartphone}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <h3 className="font-semibold text-blue-800">VeroSuite Mobile</h3>
              <p className="text-sm text-blue-600">Sync settings with mobile app</p>
            </div>
            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              Configure
            </button>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
