import React, { useState } from 'react';

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

  // ...UI for each setting (inputs, toggles, dropdowns, etc.)...
  // For brevity, only a few examples are shown below

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <form className="space-y-6">
        {/* Branding & Appearance */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Branding & Appearance</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Primary Color</label>
              <input type="color" value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} />
            </div>
            <div>
              <label className="block mb-1">Secondary Color</label>
              <input type="color" value={settings.secondaryColor} onChange={e => setSettings({ ...settings, secondaryColor: e.target.value })} />
            </div>
            <div>
              <label className="block mb-1">Accent Color</label>
              <input type="color" value={settings.accentColor} onChange={e => setSettings({ ...settings, accentColor: e.target.value })} />
            </div>
            <div>
              <label className="block mb-1">Logo</label>
              <input type="text" value={settings.logo} onChange={e => setSettings({ ...settings, logo: e.target.value })} placeholder="Emoji or image URL" />
            </div>
            <div>
              <label className="block mb-1">Brand Name</label>
              <input type="text" value={settings.brandName} onChange={e => setSettings({ ...settings, brandName: e.target.value })} />
            </div>
            <div>
              <label className="block mb-1">Font Family</label>
              <select value={settings.fontFamily} onChange={e => setSettings({ ...settings, fontFamily: e.target.value })}>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Arial">Arial</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Font Size</label>
              <select value={settings.fontSize} onChange={e => setSettings({ ...settings, fontSize: e.target.value })}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Border Radius</label>
              <select value={settings.borderRadius} onChange={e => setSettings({ ...settings, borderRadius: e.target.value })}>
                <option value="none">None</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Shadow Intensity</label>
              <select value={settings.shadowIntensity} onChange={e => setSettings({ ...settings, shadowIntensity: e.target.value })}>
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Background Pattern</label>
              <select value={settings.backgroundPattern} onChange={e => setSettings({ ...settings, backgroundPattern: e.target.value })}>
                <option value="none">None</option>
                <option value="stripes">Stripes</option>
                <option value="dots">Dots</option>
                <option value="custom">Custom Upload</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Glass Effect</label>
              <input type="checkbox" checked={settings.glassEffect} onChange={e => setSettings({ ...settings, glassEffect: e.target.checked })} />
            </div>
            <div>
              <label className="block mb-1">Dark Mode</label>
              <input type="checkbox" checked={settings.darkMode} onChange={e => setSettings({ ...settings, darkMode: e.target.checked })} />
            </div>
            <div>
              <label className="block mb-1">Sidebar Width</label>
              <select value={settings.sidebarWidth} onChange={e => setSettings({ ...settings, sidebarWidth: e.target.value })}>
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="wide">Wide</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Header Height</label>
              <select value={settings.headerHeight} onChange={e => setSettings({ ...settings, headerHeight: e.target.value })}>
                <option value="short">Short</option>
                <option value="normal">Normal</option>
                <option value="tall">Tall</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Custom CSS</label>
              <textarea value={settings.customCSS} onChange={e => setSettings({ ...settings, customCSS: e.target.value })} className="w-full h-20" />
            </div>
          </div>
        </section>
        {/* Layout & Navigation */}
        <section>
          <h2 className="text-lg font-semibold mb-2 mt-6">Layout & Navigation</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Show Navigation Bar</label>
              <input type="checkbox" checked={settings.showNavBar} onChange={e => setSettings({ ...settings, showNavBar: e.target.checked })} />
            </div>
            <div>
              <label className="block mb-1">Show Sidebar</label>
              <input type="checkbox" checked={settings.showSidebar} onChange={e => setSettings({ ...settings, showSidebar: e.target.checked })} />
            </div>
            <div>
              <label className="block mb-1">Sidebar Position</label>
              <select value={settings.sidebarPosition} onChange={e => setSettings({ ...settings, sidebarPosition: e.target.value })}>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Default Landing Page</label>
              <select value={settings.defaultLandingPage} onChange={e => setSettings({ ...settings, defaultLandingPage: e.target.value })}>
                <option value="dashboard">Dashboard</option>
                <option value="jobs">Jobs</option>
                <option value="customers">Customers</option>
                <option value="routing">Routing</option>
                <option value="uploads">Uploads</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Page Transitions/Animations</label>
              <input type="checkbox" checked={settings.pageTransitions} onChange={e => setSettings({ ...settings, pageTransitions: e.target.checked })} />
            </div>
          </div>
        </section>
        {/* Calendar & Jobs */}
        <section>
          <h2 className="text-lg font-semibold mb-2 mt-6">Calendar & Jobs</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Default Calendar View</label>
              <select value={settings.defaultCalendarView} onChange={e => setSettings({ ...settings, defaultCalendarView: e.target.value })}>
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
                <option value="list">List</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Business Hours Start</label>
              <input type="time" value={settings.businessHours.start} onChange={e => setSettings({ ...settings, businessHours: { ...settings.businessHours, start: e.target.value } })} />
            </div>
            <div>
              <label className="block mb-1">Business Hours End</label>
              <input type="time" value={settings.businessHours.end} onChange={e => setSettings({ ...settings, businessHours: { ...settings.businessHours, end: e.target.value } })} />
            </div>
            <div>
              <label className="block mb-1">Business Days</label>
              <input type="text" value={settings.businessHours.daysOfWeek.join(',')} onChange={e => setSettings({ ...settings, businessHours: { ...settings.businessHours, daysOfWeek: e.target.value.split(',').map(Number) } })} placeholder="e.g. 1,2,3,4,5" />
            </div>
            <div>
              <label className="block mb-1">Event Color Mapping</label>
              <select value={settings.eventColorMapping} onChange={e => setSettings({ ...settings, eventColorMapping: e.target.value })}>
                <option value="status">Status</option>
                <option value="technician">Technician</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Enable Event Drag & Drop</label>
              <input type="checkbox" checked={settings.eventDragDrop} onChange={e => setSettings({ ...settings, eventDragDrop: e.target.checked })} />
            </div>
            <div>
              <label className="block mb-1">Enable Event Resizing</label>
              <input type="checkbox" checked={settings.eventResizing} onChange={e => setSettings({ ...settings, eventResizing: e.target.checked })} />
            </div>
            <div>
              <label className="block mb-1">Notification Settings</label>
              <div>
                <label><input type="checkbox" checked={settings.notificationSettings.email} onChange={e => setSettings({ ...settings, notificationSettings: { ...settings.notificationSettings, email: e.target.checked } })} /> Email</label>
                <label className="ml-4"><input type="checkbox" checked={settings.notificationSettings.sms} onChange={e => setSettings({ ...settings, notificationSettings: { ...settings.notificationSettings, sms: e.target.checked } })} /> SMS</label>
                <label className="ml-4"><input type="checkbox" checked={settings.notificationSettings.inApp} onChange={e => setSettings({ ...settings, notificationSettings: { ...settings.notificationSettings, inApp: e.target.checked } })} /> In-App</label>
              </div>
            </div>
          </div>
        </section>
        {/* User & Security */}
        <section>
          <h2 className="text-lg font-semibold mb-2 mt-6">User & Security</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Require Login</label>
              <input type="checkbox" checked={settings.requireLogin} onChange={e => setSettings({ ...settings, requireLogin: e.target.checked })} />
            </div>
            <div>
              <label className="block mb-1">Password Min Length</label>
              <input type="number" min={4} max={32} value={settings.passwordPolicy.minLength} onChange={e => setSettings({ ...settings, passwordPolicy: { ...settings.passwordPolicy, minLength: Number(e.target.value) } })} />
            </div>
            <div>
              <label className="block mb-1">Password Complexity</label>
              <select value={settings.passwordPolicy.complexity} onChange={e => setSettings({ ...settings, passwordPolicy: { ...settings.passwordPolicy, complexity: e.target.value } })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Session Timeout (minutes)</label>
              <input type="number" min={5} max={120} value={settings.sessionTimeout} onChange={e => setSettings({ ...settings, sessionTimeout: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block mb-1">Two-Factor Authentication</label>
              <input type="checkbox" checked={settings.twoFactorAuth} onChange={e => setSettings({ ...settings, twoFactorAuth: e.target.checked })} />
            </div>
            <div>
              <label className="block mb-1">Allowed Roles</label>
              <input type="text" value={settings.allowedRoles.join(',')} onChange={e => setSettings({ ...settings, allowedRoles: e.target.value.split(',') })} placeholder="e.g. admin,dispatcher,technician" />
            </div>
          </div>
        </section>
        {/* Integrations */}
        <section>
          <h2 className="text-lg font-semibold mb-2 mt-6">Integrations</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Supabase API Key</label>
              <input type="text" value={settings.apiKeys.supabase} onChange={e => setSettings({ ...settings, apiKeys: { ...settings.apiKeys, supabase: e.target.value } })} />
            </div>
            <div>
              <label className="block mb-1">FullCalendar API Key</label>
              <input type="text" value={settings.apiKeys.fullcalendar} onChange={e => setSettings({ ...settings, apiKeys: { ...settings.apiKeys, fullcalendar: e.target.value } })} />
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Webhook URLs</label>
              <textarea value={settings.webhookURLs.join('\n')} onChange={e => setSettings({ ...settings, webhookURLs: e.target.value.split('\n') })} className="w-full h-20" placeholder="One URL per line" />
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Third-Party Integrations</label>
              <label><input type="checkbox" checked={settings.thirdPartyIntegrations.google} onChange={e => setSettings({ ...settings, thirdPartyIntegrations: { ...settings.thirdPartyIntegrations, google: e.target.checked } })} /> Google</label>
              <label className="ml-4"><input type="checkbox" checked={settings.thirdPartyIntegrations.slack} onChange={e => setSettings({ ...settings, thirdPartyIntegrations: { ...settings.thirdPartyIntegrations, slack: e.target.checked } })} /> Slack</label>
            </div>
          </div>
        </section>
        <div className="mt-8">
          <button type="button" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">Save Settings</button>
        </div>
      </form>
    </div>
  );
}
