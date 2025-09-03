import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { Customer, CustomerSegment } from '@/types/customer';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

interface CustomerListProps {
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onCreateCustomer: () => void;
}

export default function CustomerList({ onViewCustomer, onEditCustomer, onCreateCustomer }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;

  // Fetch customers with search analytics
  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['customers', searchTerm, selectedSegment, selectedType, currentPage, sortBy, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from('accounts')
        .select(`
          *,
          customer_profiles (
            *,
            customer_segments (*)
          ),
          customer_contacts (*)
        `)
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28');

      // Apply search filter
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }

      // Apply segment filter
      if (selectedSegment !== 'all') {
        query = query.eq('customer_profiles.customer_segments.segment_code', selectedSegment);
      }

      // Apply type filter
      if (selectedType !== 'all') {
        query = query.eq('account_type', selectedType);
      }

      // Apply sorting
      const sortColumn = sortBy === 'segment' ? 'customer_profiles.customer_segments.segment_name' : sortBy;
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch segments for filter dropdown
  const { data: segments } = useQuery({
    queryKey: ['customer-segments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_segments')
        .select('*')
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28');
      if (error) throw error;
      return data;
    },
  });

  // Fetch total count for pagination
  const { data: totalCount } = useQuery({
    queryKey: ['customers-count', searchTerm, selectedSegment, selectedType],
    queryFn: async () => {
      let query = supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28');

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }
      if (selectedSegment !== 'all') {
        query = query.eq('customer_profiles.customer_segments.segment_code', selectedSegment);
      }
      if (selectedType !== 'all') {
        query = query.eq('account_type', selectedType);
      }

      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
  });

  const totalPages = Math.ceil((totalCount || 0) / itemsPerPage);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSegmentColor = (segmentCode: string) => {
    const colors: Record<string, string> = {
      'RES_BASIC': 'bg-blue-100 text-blue-800',
      'RES_STD': 'bg-green-100 text-green-800',
      'RES_PREM': 'bg-purple-100 text-purple-800',
      'COM_BASIC': 'bg-yellow-100 text-yellow-800',
      'COM_STD': 'bg-orange-100 text-orange-800',
      'COM_PREM': 'bg-red-100 text-red-800',
      'IND': 'bg-gray-100 text-gray-800',
    };
    return colors[segmentCode] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'residential': 'bg-blue-100 text-blue-800',
      'commercial': 'bg-green-100 text-green-800',
      'industrial': 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="text-red-800">
            Error loading customers: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Customers</h2>
            <p className="text-sm text-gray-600">
              {totalCount} total customers
            </p>
          </div>
          <button
            onClick={onCreateCustomer}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Segment Filter */}
          <div className="sm:w-48">
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Segments</option>
              {segments?.map((segment) => (
                <option key={segment.id} value={segment.segment_code}>
                  {segment.segment_name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="sm:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Name
                  {sortBy === 'name' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('account_type')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Type
                  {sortBy === 'account_type' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('segment')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Segment
                  {sortBy === 'segment' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers?.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.customer_profiles?.[0]?.business_name || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(customer.account_type)}`}>
                    {customer.account_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.customer_profiles?.[0]?.customer_segments && (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(customer.customer_profiles[0].customer_segments.segment_code)}`}>
                      {customer.customer_profiles[0].customer_segments.segment_name}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.email}</div>
                  <div className="text-sm text-gray-500">{customer.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.city}, {customer.state}</div>
                  <div className="text-sm text-gray-500">{customer.zip_code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onViewCustomer(customer)}
                      className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                      title="View Customer"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditCustomer(customer)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Edit Customer"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount || 0)} of {totalCount} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'text-white bg-purple-600 border border-purple-600'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
