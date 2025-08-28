import React from 'react';
import { Plus, Users, Calendar, BarChart3 } from 'lucide-react';

export default function V4Test() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              V4 Test Page
            </h1>
            <p className="text-slate-600 text-sm">
              Testing the new V4 Bitrix24-style layout
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Test Button
            </button>
          </div>
        </div>
      </div>

      {/* Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Customers</h3>
              <p className="text-xs text-slate-600">2.1k total customers</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">This card tests the V4 card styling with hover effects.</p>
        </div>

        <div className="p-4 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Jobs</h3>
              <p className="text-xs text-slate-600">47 jobs today</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">Testing the collapsible sidebar and activity panel.</p>
        </div>

        <div className="p-4 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Reports</h3>
              <p className="text-xs text-slate-600">Analytics & insights</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">Bitrix24-style design with purple gradient top bar.</p>
        </div>
      </div>

      {/* Test Instructions */}
      <div className="p-4 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">V4 Layout Test Instructions</h3>
        <div className="max-h-48 overflow-y-auto space-y-2 text-xs text-slate-600 pr-2">
          <p>✅ <strong>Left Sidebar:</strong> Click the chevron button to collapse/expand (64px ↔ 240px)</p>
          <p>✅ <strong>Right Activity Panel:</strong> Click the chevron button to collapse/expand (64px ↔ 320px)</p>
          <p>✅ <strong>Mobile Menu:</strong> Resize browser to mobile width to test hamburger menu</p>
          <p>✅ <strong>Navigation:</strong> Click sidebar icons to test navigation (currently mock routes)</p>
          <p>✅ <strong>User Menu:</strong> Click the chevron in top-right to test user dropdown</p>
          <p>✅ <strong>Search Bar:</strong> Test the semi-transparent search input</p>
          <p>✅ <strong>Hover Effects:</strong> Hover over cards to see smooth animations</p>
          <p>✅ <strong>Gradient:</strong> Top bar now has purple-to-green gradient (flipped)</p>
          <p>✅ <strong>Spacing:</strong> Increased left padding for better separation from sidebar</p>
          <p>✅ <strong>Scrollbar:</strong> This instructions section now has embedded scrolling</p>
          <p>✅ <strong>Responsive:</strong> Layout adapts to different screen sizes</p>
          <p>✅ <strong>Animations:</strong> Smooth transitions for all interactive elements</p>
          <p>✅ <strong>Accessibility:</strong> Proper focus states and keyboard navigation</p>
          <p>✅ <strong>Performance:</strong> Optimized rendering with React best practices</p>
          <p>✅ <strong>Styling:</strong> Consistent with Bitrix24 design language</p>
        </div>
      </div>
    </div>
  );
}
