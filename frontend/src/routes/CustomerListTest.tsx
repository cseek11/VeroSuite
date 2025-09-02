import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomerList } from '@/components/customer/CustomerList';
import { CustomerStatusBar } from '@/components/customer/CustomerStatusBar';
import { useUserPreferences } from '@/stores/userPreferences';
import { useDensityMode } from '@/hooks/useDensityMode';
import { Button } from '@/components/ui/EnhancedUI';
import { BarChart3, Search, Sparkles } from 'lucide-react';
import type { Account } from '@/types/enhanced-types';

export const CustomerListTest: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);
  const { preferences } = useUserPreferences();
  const { densityMode } = useDensityMode();

  const handleCustomerClick = (customer: Account) => {
    setSelectedCustomer(customer);
    console.log('Selected customer:', customer);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer List Test</h1>
            <p className="text-gray-600">
              Testing the new customer list components with view modes and density controls
            </p>
          </div>
          
          {/* Navigation Links */}
          <div className="flex space-x-3">
            <Link to="/search-analytics">
              <Button variant="outline" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Search Analytics</span>
              </Button>
            </Link>
            <Link to="/advanced-search-demo">
              <Button variant="outline" className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Advanced Search Demo</span>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Current Settings Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm font-medium text-gray-700">View Mode</div>
            <div className="text-lg font-semibold text-purple-600 capitalize">{preferences.viewMode}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700">Density Mode</div>
            <div className="text-lg font-semibold text-purple-600 capitalize">{densityMode}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700">Selected Customer</div>
            <div className="text-lg font-semibold text-purple-600">
              {selectedCustomer ? selectedCustomer.name : 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* Customer List Component */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <CustomerList
          onCustomerClick={handleCustomerClick}
          selectedCustomerId={selectedCustomer?.id}
        />
      </div>

      {/* Selected Customer Details */}
      {selectedCustomer && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Selected Customer Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-900">{selectedCustomer.name}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{selectedCustomer.email}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Phone:</span>
                  <span className="ml-2 text-gray-900">{selectedCustomer.phone}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Address:</span>
                  <span className="ml-2 text-gray-900">
                    {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Status & Account</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className="ml-2 text-gray-900 capitalize">{selectedCustomer.status}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Account Type:</span>
                  <span className="ml-2 text-gray-900 capitalize">{selectedCustomer.account_type}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Balance:</span>
                  <span className="ml-2 text-gray-900">${(selectedCustomer.ar_balance || 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Created:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(selectedCustomer.created_at || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Bar Component Test */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Status Bar Component</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Compact Variant:</div>
                <CustomerStatusBar customer={selectedCustomer} variant="compact" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Standard Variant:</div>
                <CustomerStatusBar customer={selectedCustomer} variant="standard" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Component Information */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">Component Features & Test Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <h3 className="font-medium mb-2">✅ Implemented Features:</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>View mode toggles (List, Cards, Dense)</li>
              <li>Density controls (Standard/Dense)</li>
              <li>Advanced search and filtering</li>
              <li>Sortable columns</li>
              <li>Persistent user preferences</li>
              <li>Mobile responsive design</li>
              <li>Customer status bar component</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">🧪 Test Pages:</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li><strong>Search Analytics:</strong> View search performance metrics and analytics</li>
              <li><strong>Advanced Search Demo:</strong> Test fuzzy matching and typo tolerance</li>
              <li><strong>Customer List Test:</strong> This page - test all customer list features</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">🔄 Next Steps:</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>Lightweight customer popup</li>
              <li>Full customer page with CRUD</li>
              <li>Integration with existing app</li>
              <li>Real-time data sync</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};




