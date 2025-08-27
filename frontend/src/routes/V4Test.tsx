import React from 'react';
import V4Layout from '@/components/layout/V4Layout';
import { Plus, Users, Calendar, BarChart3 } from 'lucide-react';

export default function V4Test() {
     return (
     <V4Layout>
       <div className="space-y-6 v4-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">V4 Test Page</h1>
            <p className="text-gray-100">Testing the new V4 Bitrix24-style layout</p>
          </div>
          <div className="flex gap-3">
                         <button className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center gap-2">
               <Plus className="w-4 h-4" />
               Test Button
             </button>
          </div>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="v4-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Customers</h3>
                <p className="text-sm text-gray-600">2.1k total customers</p>
              </div>
            </div>
            <p className="text-gray-600">This card tests the V4 card styling with hover effects.</p>
          </div>

          <div className="v4-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Jobs</h3>
                <p className="text-sm text-gray-600">47 jobs today</p>
              </div>
            </div>
            <p className="text-gray-600">Testing the collapsible sidebar and activity panel.</p>
          </div>

          <div className="v4-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Reports</h3>
                <p className="text-sm text-gray-600">Analytics & insights</p>
              </div>
            </div>
            <p className="text-gray-600">Bitrix24-style design with purple gradient top bar.</p>
          </div>
        </div>

        {/* Test Instructions */}
        <div className="v4-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">V4 Layout Test Instructions</h3>
          <div className="max-h-48 overflow-y-auto space-y-2 text-sm text-gray-600 pr-2">
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
    </V4Layout>
  );
}
