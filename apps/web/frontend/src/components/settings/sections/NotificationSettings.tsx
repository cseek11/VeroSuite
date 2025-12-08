import React from 'react';
import { Bell, Mail, Smartphone } from 'lucide-react';
import { SettingsCard } from '../shared/SettingsCard';

export const NotificationSettings: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Email Notifications */}
      <SettingsCard title="Email Notifications" icon={Mail}>
        <div className="space-y-3">
          {[
            { label: 'New job assignments', checked: true },
            { label: 'Schedule updates', checked: true },
            { label: 'Customer messages', checked: false },
            { label: 'Payment notifications', checked: true },
            { label: 'System updates', checked: false }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-100">
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={item.checked}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Push Notifications */}
      <SettingsCard title="Push Notifications" icon={Smartphone}>
        <div className="space-y-3">
          {[
            { label: 'Job reminders', checked: true },
            { label: 'Customer updates', checked: true },
            { label: 'Emergency alerts', checked: true },
            { label: 'Marketing updates', checked: false }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-100">
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={item.checked}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Notification Schedule */}
      <SettingsCard title="Notification Schedule" icon={Bell}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quiet Hours Start
            </label>
            <input
              type="time"
              defaultValue="22:00"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quiet Hours End
            </label>
            <input
              type="time"
              defaultValue="08:00"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
