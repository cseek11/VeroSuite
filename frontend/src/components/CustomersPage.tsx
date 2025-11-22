import { useState, useMemo, useRef, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import CustomerListView from './CustomerListView';
import SearchBar from './SearchBar';
import CustomerSearchResults from './CustomerSearchResults';
import {
  Users,
  MapPin,
  RefreshCw,
  UserPlus,
  Calendar,
  X,
  Grid3X3,
  List
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { secureApiClient } from '@/lib/secure-api-client';
import { Account } from '@/types/enhanced-types';
import { useSearchIntegration } from '@/lib/search-integration';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'commercial' | 'residential'>('all');
  // const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set()); // Unused - kept for potential future use
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Search integration
  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    search,
    clearAll: clearSearch,
    refreshCurrentSearch
  } = useSearchIntegration({ debounceMs: 300 });

  const queryClient = useQueryClient();

  // Fetch customers from backend API
  const { data: customers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['secure-customers'],
    queryFn: async () => {
      return secureApiClient.getAllAccounts();
    },
  });

  // Listen for real-time customer updates
  useEffect(() => {
    const handleCustomerUpdate = (event: CustomEvent) => {
      const { customerId } = event.detail;
      logger.debug('Real-time customer update received', { customerId }, 'CustomersPage');
      
      // Invalidate and refetch customer data
      queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: ['unified-search'] });
      
      // If we have a current search, refresh it
      if (searchTerm.trim()) {
        refreshCurrentSearch();
      }
    };
    
    const handleCustomerCreate = (_event: CustomEvent) => {
      logger.debug('Real-time customer creation received', {}, 'CustomersPage');
      queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: ['unified-search'] });
    };
    
    const handleCustomerDelete = (_event: CustomEvent) => {
      logger.debug('Real-time customer deletion received', {}, 'CustomersPage');
      queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: ['unified-search'] });
    };

    // Add event listeners
    window.addEventListener('customerUpdated', handleCustomerUpdate as EventListener);
    window.addEventListener('customerCreated', handleCustomerCreate as EventListener);
    window.addEventListener('customerDeleted', handleCustomerDelete as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('customerUpdated', handleCustomerUpdate as EventListener);
      window.removeEventListener('customerCreated', handleCustomerCreate as EventListener);
      window.removeEventListener('customerDeleted', handleCustomerDelete as EventListener);
    };
  }, [queryClient, search, searchTerm]);

  // ============================================================================
  // SEARCH HANDLERS
  // ============================================================================

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      setShowSearchResults(true);
      await search(term);
    } else {
      setShowSearchResults(false);
      clearSearch();
    }
  };

  const handleSearchResultSelect = (account: Account) => {
    setSelectedCustomer(account);
    setShowSearchResults(false);
    setSearchTerm('');
  };

  const handleViewCustomer = (account: Account) => {
    handleSearchResultSelect(account);
  };

  const handleEditCustomer = (account: Account) => {
    handleSearchResultSelect(account);
    // TODO: Open edit modal or navigate to edit page
  };

  const handleDeleteCustomer = async (account: Account) => {
    if (confirm(`Are you sure you want to delete ${account.name}?`)) {
      try {
        await secureApiClient.deleteAccount(account.id);
        queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
        setShowSearchResults(false);
        setSearchTerm('');
        
        // Dispatch custom event for real-time updates
        window.dispatchEvent(new CustomEvent('customerDeleted', {
          detail: { customerId: account.id }
        }));
        
        // Show success message
        logger.debug('Customer deleted successfully', { customerName: account.name }, 'CustomersPage');
      } catch (error) {
        logger.error('Failed to delete customer', error, 'CustomersPage');
        toast.error('Failed to delete customer. Please try again.');
      }
    }
  };

  const handleCallCustomer = (account: Account) => {
    if (account.phone) {
      window.open(`tel:${account.phone}`, '_self');
    }
  };

  const handleEmailCustomer = (account: Account) => {
    if (account.email) {
      window.open(`mailto:${account.email}`, '_self');
    }
  };

  // Fetch service history for selected customer
  const { data: serviceHistory = [] } = useQuery({
    queryKey: ['service-history', selectedCustomer?.id],
    queryFn: async () => {
      if (!selectedCustomer?.id) return [];
      // TODO: Implement enhanced service history API
      return [];
    },
    enabled: !!selectedCustomer?.id,
  });

  const handleViewHistory = (customer: Account) => {
    setSelectedCustomer(customer);
    setShowHistory(true);
  };

  // Extract accounts from SearchResult[] - flatten all result.data arrays
  const searchAccounts = useMemo(() => {
    if (!Array.isArray(searchResults)) {
      return [];
    }
    return searchResults.flatMap(result => result.data || []);
  }, [searchResults]);

  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(customers)) {
      return [];
    }
    return customers.filter((customer: Account) => {
      const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || customer.account_type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [customers, searchTerm, filterType]);

  // Maintain focus on search input if it gets lost due to re-renders
  useEffect(() => {
    if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
      // Check if the search input was previously focused
      const wasSearchFocused = document.activeElement?.hasAttribute('data-search-input');
      if (wasSearchFocused) {
        searchInputRef.current.focus();
      }
    }
  });

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="h-6 w-6 text-indigo-600" />
              Customers
            </h1>
            <p className="text-slate-600 mt-1 text-sm">
              Manage your customer relationships and service history
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors text-sm">
              <UserPlus className="h-4 w-4" />
              Add Customer
            </button>
            <button 
              onClick={() => refetch()}
              className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-1 text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-3 mb-3 flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search customers by name, email, phone, or address..."
              onSearchChange={handleSearch}
              onResultSelect={handleSearchResultSelect}
              showHistory={true}
              showRecentSearches={true}
              maxResults={10}
              debounceMs={300}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'commercial' | 'residential')}
              className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="all">All Types</option>
              <option value="commercial">Commercial</option>
              <option value="residential">Residential</option>
            </select>
            <div className="flex border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 text-sm transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Map View"
              >
                <MapPin className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setShowSearchResults(false);
                clearSearch();
              }}
              className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-sm flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {showSearchResults && (
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4 h-64 overflow-hidden flex flex-col flex-shrink-0">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results
              {searchAccounts.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({searchAccounts.length} found)
                </span>
              )}
            </h3>
            <button
              onClick={() => {
                setShowSearchResults(false);
                setSearchTerm('');
                clearSearch();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto min-h-0">
            <CustomerSearchResults
              results={searchAccounts}
              loading={searchLoading}
              error={searchError}
              onView={handleViewCustomer}
              onEdit={handleEditCustomer}
              onDelete={handleDeleteCustomer}
              onCall={handleCallCustomer}
              onEmail={handleEmailCustomer}
              showActions={true}
              compact={viewMode === 'grid'}
            />
          </div>
        </div>
      )}

      {/* Customer List - Content container */}
      <div className="flex-1 min-h-0">
        <CustomerListView
          customers={filteredCustomers}
          onViewHistory={handleViewHistory}
          onEdit={(customer) => {
            logger.debug('Edit customer requested', { customerId: customer.id }, 'CustomersPage');
            // TODO: Implement edit functionality
          }}
          onViewDetails={(customer) => {
            logger.debug('View customer details requested', { customerId: customer.id }, 'CustomersPage');
            // TODO: Implement view details functionality
          }}
          onSelectionChange={setSelectedCustomers}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Service History Modal */}
      {showHistory && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Service History - {selectedCustomer.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  Complete service and maintenance history
                </p>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {serviceHistory.length > 0 ? (
                <div className="space-y-4">
                  {serviceHistory.map((service: any) => (
                    <div key={service.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{service.service_type || 'Service'}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : service.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {service.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Date:</span> {new Date(service.scheduled_date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Technician:</span> {service.technician || 'Not assigned'}
                        </div>
                      </div>
                      {service.notes && (
                        <p className="text-gray-700 mt-2">{service.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Service History</h3>
                  <p className="text-gray-600">
                    No service history found for this customer.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
