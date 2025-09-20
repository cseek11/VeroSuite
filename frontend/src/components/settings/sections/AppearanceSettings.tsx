import React from 'react';
import { Palette, Eye, Globe } from 'lucide-react';
import { SettingsCard } from '../shared/SettingsCard';

interface AppearanceSettingsProps {
  formData: {
    theme: string;
    colorScheme: string;
  };
  updateFormData: (updates: any) => void;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  formData,
  updateFormData
}) => {
  const colorSchemes = [
    { id: 'purple', name: 'Purple', colors: ['bg-purple-500', 'bg-purple-600', 'bg-purple-700'] },
    { id: 'blue', name: 'Blue', colors: ['bg-blue-500', 'bg-blue-600', 'bg-blue-700'] },
    { id: 'emerald', name: 'Emerald', colors: ['bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700'] },
    { id: 'rose', name: 'Rose', colors: ['bg-rose-500', 'bg-rose-600', 'bg-rose-700'] }
  ];

  return (
    <div className="space-y-4">
      {/* Theme Selection */}
      <SettingsCard title="Theme" icon={Eye}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Theme Mode
            </label>
            <div className="space-y-2">
              {[
                { value: 'light', label: 'Light Mode', description: 'Clean and bright interface' },
                { value: 'dark', label: 'Dark Mode', description: 'Easy on the eyes' },
                { value: 'auto', label: 'Auto', description: 'Follow system preference' }
              ].map((theme) => (
                <label key={theme.value} className="flex items-center p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="theme"
                    value={theme.value}
                    checked={formData.theme === theme.value}
                    onChange={(e) => updateFormData({ theme: e.target.value })}
                    className="w-4 h-4 text-purple-600 border-slate-300 focus:ring-purple-500"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-slate-900">{theme.label}</div>
                    <div className="text-xs text-slate-500">{theme.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Color Scheme */}
      <SettingsCard title="Color Scheme" icon={Palette}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Choose your preferred color scheme for the application</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colorSchemes.map((scheme) => (
              <label key={scheme.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="colorScheme"
                  value={scheme.id}
                  checked={formData.colorScheme === scheme.id}
                  onChange={(e) => updateFormData({ colorScheme: e.target.value })}
                  className="sr-only peer"
                />
                <div className="p-3 bg-white rounded-lg border-2 border-slate-200 peer-checked:border-purple-500 peer-checked:bg-purple-50 hover:border-slate-300 transition-all">
                  <div className="flex items-center space-x-1 mb-2">
                    {scheme.colors.map((color, index) => (
                      <div key={index} className={`w-4 h-4 rounded-full ${color}`}></div>
                    ))}
                  </div>
                  <div className="text-sm font-medium text-slate-700">{scheme.name}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </SettingsCard>

      {/* Display Settings */}
      <SettingsCard title="Display Settings" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Language
            </label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Timezone
            </label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="EST">Eastern Time</option>
              <option value="CST">Central Time</option>
              <option value="MST">Mountain Time</option>
              <option value="PST">Pacific Time</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date Format
            </label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Time Format
            </label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="12">12 Hour</option>
              <option value="24">24 Hour</option>
            </select>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
