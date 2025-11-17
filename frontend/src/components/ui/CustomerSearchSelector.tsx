import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  X,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { secureApiClient } from '@/lib/secure-api-client';
import { Account } from '@/types/enhanced-types';
import { logger } from '@/utils/logger';

interface CustomerSearchSelectorProps {
  value?: string;
  onChange: (customerId: string, customer: Account | null) => void;
  placeholder?: string;
  error?: string | undefined;
  required?: boolean;
  className?: string;
  label?: string;
  showSelectedBox?: boolean; // Show blue box with selected customer info
  apiSource?: 'secure' | 'direct'; // 'secure' uses secureApiClient, 'direct' uses direct fetch
}

export default function CustomerSearchSelector({
  value,
  onChange,
  placeholder = "Search customers by name, email, phone, or address...",
  error,
  required = false,
  className = '',
  label = 'Customer',
  showSelectedBox = false,
  apiSource = 'secure'
}: CustomerSearchSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use simple local search to avoid Supabase authentication issues
  const [localSearchResults, setLocalSearchResults] = useState<Account[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch all customers for local filtering
  const { data: allCustomers = [], isLoading: customersLoading } = useQuery({
    queryKey: apiSource === 'secure' ? ['secure-customers'] : ['direct-customers'],
    queryFn: async () => {
      if (apiSource === 'secure') {
        return secureApiClient.getAllAccounts();
      } else {
        // Direct API fetch (matching WorkOrderForm pattern)
        const getAuthToken = (): string | null => {
          try {
            const authData = localStorage.getItem('verofield_auth');
            if (authData) {
              const parsed = JSON.parse(authData);
              if (typeof parsed?.token === 'string') return parsed.token;
              if (typeof parsed?.accessToken === 'string') return parsed.accessToken;
              if (typeof parsed?.state?.token === 'string') return parsed.state.token;
              if (typeof parsed?.state?.accessToken === 'string') return parsed.state.accessToken;
            }
          } catch (e) {
            logger.error('Error parsing verofield_auth', e, 'CustomerSearchSelector');
          }
          return localStorage.getItem('jwt') || null;
        };

        const token = getAuthToken();
        const response = await fetch('http://localhost:3001/api/v1/crm/accounts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28',
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          return data || [];
        } else {
          logger.error('Failed to load customers', new Error(`HTTP ${response.status}`), 'CustomerSearchSelector');
          return [];
        }
      }
    },
  });

  // Enhanced local search with multiple field matching
  const performLocalSearch = (term: string): Account[] => {
    if (!term.trim()) return allCustomers.slice(0, 10); // Show first 10 when no search
    
    const searchTerm = term.toLowerCase();
    return allCustomers.filter(customer => {
      return (
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm) ||
        customer.phone?.includes(term) ||
        customer.address?.toLowerCase().includes(searchTerm) ||
        customer.city?.toLowerCase().includes(searchTerm) ||
        customer.state?.toLowerCase().includes(searchTerm) ||
        customer.zip_code?.includes(term) ||
        customer.account_type.toLowerCase().includes(searchTerm)
      );
    }).slice(0, 20); // Limit to 20 results for performance
  };

  const displayCustomers = localSearchResults;

  // Find selected customer when value changes
  useEffect(() => {
    if (value && allCustomers.length > 0) {
      const customer = allCustomers.find(c => c.id === value);
      setSelectedCustomer(customer || null);
      if (customer) {
        setSearchTerm(customer.name);
      }
    } else {
      setSelectedCustomer(null);
      setSearchTerm('');
    }
  }, [value, allCustomers]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);
    
    // Clear selection if user is typing
    if (selectedCustomer && term !== selectedCustomer.name) {
      setSelectedCustomer(null);
      onChange('', null);
    }

    // Perform local search
    setSearchLoading(true);
    const results = performLocalSearch(term);
    setLocalSearchResults(results);
    setSearchLoading(false);
  };

  const handleCustomerSelect = (customer: Account) => {
    setSelectedCustomer(customer);
    setSearchTerm(customer.name);
    setIsOpen(false);
    onChange(customer.id, customer);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedCustomer(null);
    setIsOpen(false);
    onChange('', null);
    setLocalSearchResults([]);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    // Initialize with current search results
    const results = performLocalSearch(searchTerm);
    setLocalSearchResults(results);
  };

  const getCustomerTypeIcon = (accountType: string) => {
    return accountType === 'commercial' ? <Building className="w-4 h-4" /> : <User className="w-4 h-4" />;
  };

  const getCustomerTypeColor = (accountType: string) => {
    return accountType === 'commercial' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  };

  const formatAddress = (customer: Account) => {
    const parts = [
      customer.address,
      customer.city,
      customer.state,
      customer.zip_code
    ].filter(Boolean);
    return parts.join(', ') || 'No address on file';
  };

  const isLoading = searchLoading || customersLoading;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="crm-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`crm-input pl-10 pr-10 ${error ? 'border-red-500' : ''}`}
        />
        
        {searchTerm && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-y-0 right-8 pr-3 flex items-center">
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
          </div>
        )}
      </div>

      {error && (
        <p className="crm-error flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}

      {/* Selected Customer Box (when showSelectedBox is true) */}
      {showSelectedBox && value && selectedCustomer && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-blue-900">
                {selectedCustomer.name || 'Selected Customer'}
              </div>
              <div className="text-sm text-blue-700">
                {selectedCustomer.account_type}
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* Search Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-[9999] w-full mt-1 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20"
        >
          {isLoading ? (
            <div className="px-4 py-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-500" />
              <p className="mt-2 text-sm text-gray-500">Searching customers...</p>
            </div>
          ) : displayCustomers.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <User className="w-8 h-8 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm ? 'No customers found' : 'Start typing to search customers'}
              </p>
              {searchTerm && (
                <p className="text-xs text-gray-400 mt-1">
                  Try searching by name, email, phone, or address
                </p>
              )}
            </div>
          ) : (
            <div className="py-2">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-medium text-gray-500">
                  {displayCustomers.length} customer{displayCustomers.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              {displayCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => handleCustomerSelect(customer)}
                  className="px-4 py-4 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    {getCustomerTypeIcon(customer.account_type)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {customer.name}
                      </div>
                      
                      {/* Always show address prominently */}
                      <div className="text-sm text-gray-700 mt-1 flex items-start">
                        <MapPin className="w-3 h-3 mr-1 mt-0.5 text-gray-500 flex-shrink-0" />
                        <span className="break-words">{formatAddress(customer)}</span>
                      </div>
                      
                      <div className="text-sm text-gray-600 flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCustomerTypeColor(customer.account_type)}`}>
                          {customer.account_type}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.status}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-2 flex items-center space-x-4">
                        {customer.email && (
                          <span className="flex items-center truncate">
                            <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{customer.email}</span>
                          </span>
                        )}
                        {customer.phone && (
                          <span className="flex items-center">
                            <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                            {customer.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {customer.ar_balance > 0 && (
                      <div className="text-right ml-3 flex-shrink-0">
                        <div className="text-xs text-gray-500">Balance</div>
                        <div className="text-sm font-medium text-orange-600">
                          ${customer.ar_balance.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {allCustomers.length > displayCustomers.length && searchTerm.length < 2 && (
                <div className="px-4 py-3 bg-gray-50 text-center border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Type at least 2 characters to search {allCustomers.length} customers
                  </p>
                  <p className="text-xs text-gray-400">
                    Search by name, email, phone, or address
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}