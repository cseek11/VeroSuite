import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserPreferences } from '@/stores/userPreferences';
import { useDensityMode } from '@/hooks/useDensityMode';
import { useSearchLogging } from '@/hooks/useSearchLogging';
import { AdvancedSearchBar } from '@/components/search/AdvancedSearchBar';
import { CustomerStatusBar } from './CustomerStatusBar';
import { CustomerCard } from './CustomerCard';
import { CustomerListItem } from './CustomerListItem';
import { 
  List, 
  Grid3X3, 
  Rows, 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { Account } from '@/types/enhanced-types';
import { logger } from '@/utils/logger';

interface CustomerListProps {
  onCustomerClick: (customer: Account) => void;
  selectedCustomerId?: string;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  onCustomerClick,
  selectedCustomerId
}) => {
  const { preferences, setViewMode } = useUserPreferences();
  const { densityMode, toggleDensity, canUseDense } = useDensityMode();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'balance' | 'created_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [useAdvancedSearch, setUseAdvancedSearch] = useState<boolean>(false);

  // Search logging hook
  const {
    startSearchLog,
    completeSearchLog,
    logSearchClick,
    getSearchSuggestions: _getSearchSuggestions,
    getSuggestedCorrection: _getSuggestedCorrection,
    recentSearches: _recentSearches,
    popularSearches: _popularSearches
  } = useSearchLogging({
    enableLogging: true,
    enableAnalytics: true,
    enableSuggestions: true
  });

  // Fetch customers with search logging
  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['customers', searchTerm, statusFilter, typeFilter],
    queryFn: async () => {
      // Start logging the search
      if (searchTerm.trim()) {
        startSearchLog(searchTerm, {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          type: typeFilter !== 'all' ? typeFilter : undefined
        });
      }

      const results = await secureApiClient.accounts.getAll();

      // Complete logging the search
      if (searchTerm.trim()) {
        await completeSearchLog(searchTerm, results.length, {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          type: typeFilter !== 'all' ? typeFilter : undefined
        });
      }

      return results;
    },
  });



  // Debug logging (development only)
  if (process.env.NODE_ENV === 'development') {
    logger.debug('CustomerList Debug', {
      isLoading,
      error: error?.message,
      customersCount: customers?.length,
      searchTerm,
      statusFilter,
      typeFilter
    }, 'CustomerList');
  }

  // Sort customers (API handles filtering)
  const sortedCustomers = useMemo(() => {
    const filtered = [...customers];

    // Sort
    filtered.sort((a: Account, b: Account) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'balance':
          aValue = a.ar_balance || 0;
          bValue = b.ar_balance || 0;
          break;
        case 'created_at':
          aValue = new Date(a.created_at || '').getTime();
          bValue = new Date(b.created_at || '').getTime();
          break;
        default:
          aValue = a.name || '';
          bValue = b.name || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [customers, sortBy, sortOrder]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Enhanced customer click handler with logging
  const handleCustomerClick = async (customer: Account) => {
    // Log the click for search analytics
    if (searchTerm) {
      await enhancedSearch.logResultClick(customer.id, searchTerm);
    }
    
    // Log the click using the new search logging service
    logSearchClick(customer.id);
    
    // Call the original click handler
    onCustomerClick(customer);
  };

  const getSortIcon = (field: typeof sortBy) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">Failed to load customers</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-900">Customers</h2>
          <span className="text-sm text-gray-500">({sortedCustomers.length})</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View mode toggles */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${preferences.viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded ${preferences.viewMode === 'cards' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="Card view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('dense')}
              className={`p-2 rounded ${preferences.viewMode === 'dense' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="Dense view"
            >
              <Rows className="w-4 h-4" />
            </button>
          </div>

          

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="space-y-4">
        <div className="space-y-2">
          {/* Search Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setUseAdvancedSearch(!useAdvancedSearch)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  useAdvancedSearch
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {useAdvancedSearch ? '🔍 Advanced Search' : '🔍 Standard Search'}
              </button>
              {useAdvancedSearch && (
                <span className="text-xs text-gray-500">
                  Fuzzy matching, typo tolerance, and suggestions enabled
                </span>
              )}
            </div>
          </div>

          {/* Search Input */}
          {useAdvancedSearch ? (
            <AdvancedSearchBar
              onResultsChange={(results) => {
                // Handle advanced search results
                logger.debug('Advanced search results', { resultsCount: results.length }, 'CustomerList');
              }}
              placeholder="Search with fuzzy matching and suggestions..."
              showModeSelector={true}
              showSuggestions={true}
              enableAutoCorrection={true}
            />
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="customer-search"
                name="customer-search"
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 transition-colors"
              />
            </div>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 transition-colors"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 transition-colors"
              >
                <option value="all">All Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="healthcare">Healthcare</option>
                <option value="property_management">Property Management</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setTypeFilter('all');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Customer list */}
      {!isLoading && (
        <div className={`${
          preferences.viewMode === 'cards' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'space-y-2'
        }`}>
          {preferences.viewMode === 'list' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* List header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
                <div className="col-span-4 flex items-center gap-2">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-purple-600">
                    Name {getSortIcon('name')}
                  </button>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <button onClick={() => toggleSort('status')} className="flex items-center gap-1 hover:text-purple-600">
                    Status {getSortIcon('status')}
                  </button>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <button onClick={() => toggleSort('balance')} className="flex items-center gap-1 hover:text-purple-600">
                    Balance {getSortIcon('balance')}
                  </button>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1 hover:text-purple-600">
                    Created {getSortIcon('created_at')}
                  </button>
                </div>
                <div className="col-span-2">Actions</div>
              </div>

              {/* List items */}
              <div className="divide-y divide-gray-200">
                {sortedCustomers.map((customer: Account) => (
                  <CustomerListItem
                    key={customer.id}
                    customer={customer}
                    onClick={() => handleCustomerClick(customer)}
                    isSelected={selectedCustomerId === customer.id}
                  />
                ))}
              </div>
            </div>
          )}

          {preferences.viewMode === 'cards' && (
            sortedCustomers.map((customer: Account) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onClick={() => handleCustomerClick(customer)}
                isSelected={selectedCustomerId === customer.id}
              />
            ))
          )}

          {preferences.viewMode === 'dense' && (
                         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
               <div className="divide-y divide-gray-200">
                {sortedCustomers.map((customer: Account) => (
                  <div
                    key={customer.id}
                    onClick={() => handleCustomerClick(customer)}
                    className={`p-2 hover:bg-gray-50 cursor-pointer ${
                      selectedCustomerId === customer.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                    }`}
                  >
                    <CustomerStatusBar customer={customer} variant="compact" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && sortedCustomers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No customers found</div>
          {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Clear filters
            </button>
          ) : (
            <div className="text-sm text-gray-400">Try adding some customers to get started</div>
          )}
        </div>
      )}
    </div>
  );
};

