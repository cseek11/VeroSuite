import React from 'react';
import { Database, Download, Upload, Trash2 } from 'lucide-react';
import { SettingsCard } from '../shared/SettingsCard';

export const DataSettings: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Data Export */}
      <SettingsCard title="Data Export" icon={Download}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Export your data for backup or migration purposes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Customer Data', description: 'All customer information and profiles' },
              { name: 'Job History', description: 'Complete work order and job records' },
              { name: 'Financial Records', description: 'Invoices, payments, and billing data' },
              { name: 'Communication Logs', description: 'All customer communications' }
            ].map((dataType, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-1">{dataType.name}</h3>
                <p className="text-xs text-slate-600 mb-3">{dataType.description}</p>
                <button className="w-full px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Export CSV
                </button>
              </div>
            ))}
          </div>
        </div>
      </SettingsCard>

      {/* Data Import */}
      <SettingsCard title="Data Import" icon={Upload}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Import data from other systems or restore from backups.
          </p>
          
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-sm text-slate-600 mb-2">
              Drag and drop CSV files here, or click to select
            </p>
            <input
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              id="data-import"
            />
            <label
              htmlFor="data-import"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Select Files
            </label>
          </div>
        </div>
      </SettingsCard>

      {/* Data Management */}
      <SettingsCard title="Data Management" icon={Database}>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-800">Storage Usage</h3>
                <p className="text-sm text-yellow-600">2.4 GB of 10 GB used</p>
              </div>
              <div className="w-32 bg-yellow-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-800">Danger Zone</h3>
                <p className="text-sm text-red-600">Permanently delete all account data</p>
              </div>
              <button className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
