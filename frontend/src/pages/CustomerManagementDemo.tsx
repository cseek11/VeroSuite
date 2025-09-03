import React from 'react';
import { Link } from 'react-router-dom';
import { UserGroupIcon, PlusIcon, MagnifyingGlassIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function CustomerManagementDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Customer Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive customer management solution for pest control businesses. 
            Manage customers, segments, and business relationships with ease.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Management</h3>
            <p className="text-gray-600 mb-4">
              Create, view, edit, and manage customer accounts with comprehensive profiles.
            </p>
            <Link
              to="/customer-management"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Manage Customers
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <MagnifyingGlassIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Search</h3>
            <p className="text-gray-600 mb-4">
              Powerful search and filtering capabilities across all customer data.
            </p>
            <Link
              to="/advanced-search"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Try Search
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 mb-4">
              Track customer behavior, search patterns, and business insights.
            </p>
            <Link
              to="/search-analytics"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              View Analytics
            </Link>
          </div>
        </div>

        {/* Demo Data Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Demo Data Available
            </h2>
            <p className="text-gray-600 mb-6">
              The system is pre-loaded with 50 diverse customer accounts including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">20</div>
                <div className="text-sm text-gray-600">Residential Customers</div>
                <div className="text-xs text-gray-500">Single family, townhouses, condos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">20</div>
                <div className="text-sm text-gray-600">Commercial Customers</div>
                <div className="text-xs text-gray-500">Offices, retail, restaurants</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">10</div>
                <div className="text-sm text-gray-600">Industrial Customers</div>
                <div className="text-xs text-gray-500">Manufacturing, chemical, food processing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/customer-management"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <UserGroupIcon className="h-4 w-4 mr-2" />
              View All Customers
            </Link>
            <Link
              to="/customer-management"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New Customer
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* System Features */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></div>
                <span>Multi-tenant architecture with data isolation</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></div>
                <span>Customer segmentation and tier management</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></div>
                <span>Comprehensive contact and address management</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></div>
                <span>Contract and billing information tracking</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></div>
                <span>Advanced search and filtering capabilities</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Highlights</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                <span>React with TypeScript for type safety</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                <span>React Query for efficient data fetching</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                <span>Supabase for real-time database operations</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                <span>Tailwind CSS for modern, responsive design</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                <span>Heroicons for consistent iconography</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
