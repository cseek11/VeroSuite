import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CustomerListView from './CustomerListView';
import SearchBar from './SearchBar';
import CustomerSearchResults from './CustomerSearchResults';
import {
  Users,
  Search,
  Plus,
  MapPin,
  Building,
  RefreshCw,
  UserPlus,
  Eye,
  Edit,
  Phone,
  DollarSign,
  Calendar,
  Filter,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Grid3X3,
  List
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { secureApiClient } from '@/lib/secure-api-client';
import { Account, CustomerProfile } from '@/types/enhanced-types';
import { useSearchIntegration } from '@/lib/search-integration';
import type { SearchResult } from '@/lib/unified-search-service';

export default function CustomersPage() {
  console.log('🔄 CustomersPage component rendering');
  
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'commercial' | 'residential'>('all');
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
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
      console.log('🔄 Real-time customer update received in CustomersPage:', customerId);
      
      // Invalidate and refetch customer data
      queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: ['unified-search'] });
      
      // If we have a current search, refresh it
      if (searchTerm.trim()) {
        refreshCurrentSearch();
      }
    };
    
    const handleCustomerCreate = (event: CustomEvent) => {
      console.log('🔄 Real-time customer creation received in CustomersPage');
      queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: ['unified-search'] });
    };
    
    const handleCustomerDelete = (event: CustomEvent) => {
      console.log('🔄 Real-time customer deletion received in CustomersPage');
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

  // Debug logging
  console.log('CustomersPage - Customers data:', customers);
  console.log('CustomersPage - Loading:', isLoading);

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

  const handleSearchResultSelect = (result: SearchResult) => {
    // Convert SearchResult to Account format for compatibility
    const account: Account = {
      id: result.id,
      name: result.name,
      email: result.email || '',
      phone: result.phone || '',
      address: result.address || '',
      city: '',
      state: '',
      zip_code: '',
      country: 'USA',
      status: result.status,
      account_type: result.type,
      tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      updated_by: null
    };
    
    setSelectedCustomer(account);
    setShowSearchResults(false);
    setSearchTerm('');
  };

  const handleViewCustomer = (result: SearchResult) => {
    handleSearchResultSelect(result);
  };

  const handleEditCustomer = (result: SearchResult) => {
    handleSearchResultSelect(result);
    // TODO: Open edit modal or navigate to edit page
  };

  const handleDeleteCustomer = async (result: SearchResult) => {
    if (confirm(`Are you sure you want to delete ${result.name}?`)) {
      try {
        await secureApiClient.deleteAccount(result.id);
        queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
        setShowSearchResults(false);
        setSearchTerm('');
        
        // Dispatch custom event for real-time updates
        window.dispatchEvent(new CustomEvent('customerDeleted', {
          detail: { customerId: result.id }
        }));
        
        // Show success message
        console.log(`✅ Customer "${result.name}" deleted successfully`);
      } catch (error) {
        console.error('Failed to delete customer:', error);
        alert('Failed to delete customer. Please try again.');
      }
    }
  };

  const handleCallCustomer = (result: SearchResult) => {
    if (result.phone) {
      window.open(`tel:${result.phone}`, '_self');
    }
  };

  const handleEmailCustomer = (result: SearchResult) => {
    if (result.email) {
      window.open(`mailto:${result.email}`, '_self');
    }
  };
  console.log('CustomersPage - Error:', error);

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

  const filteredCustomers = useMemo(() => {
    console.log('🔄 Filtering customers - searchTerm:', searchTerm, 'filterType:', filterType);
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
        console.log('🔄 Restoring focus to search input');
        searchInputRef.current.focus();
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Users className="h-8 w-8 text-indigo-600" />
              Customers
            </h1>
            <p className="text-slate-600 mt-2">
              Manage your customer relationships and service history
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <UserPlus className="h-4 w-4" />
              Add Customer
            </button>
            <button 
              onClick={() => refetch()}
              className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
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
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results
              {searchResults.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({searchResults.length} found)
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
          
          <CustomerSearchResults
            results={searchResults}
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
      )}

      {/* Customer List */}
      <CustomerListView
        customers={filteredCustomers}
        onViewHistory={handleViewHistory}
        onEdit={(customer) => console.log('Edit customer:', customer)}
        onViewDetails={(customer) => console.log('View details:', customer)}
        onSelectionChange={setSelectedCustomers}
        isLoading={isLoading}
        error={error}
      />

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
