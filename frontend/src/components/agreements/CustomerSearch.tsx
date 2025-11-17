import React, { useState, useRef, useEffect } from 'react';
import { Search, User } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
}

interface CustomerSearchProps {
  customers: Customer[];
  selectedCustomerId?: string;
  onCustomerSelect: (customerId: string) => void;
  error?: string;
  placeholder?: string;
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({
  customers,
  selectedCustomerId,
  onCustomerSelect,
  error,
  placeholder = "Search customers..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);



  // Get selected customer for display
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Filter customers based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer => {
        const searchLower = searchTerm.toLowerCase();
        return (
          customer.name?.toLowerCase().includes(searchLower) ||
          customer.email?.toLowerCase().includes(searchLower) ||
          customer.phone?.includes(searchTerm) ||
          customer.address?.toLowerCase().includes(searchLower) ||
          customer.city?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCustomerSelect = (customer: Customer) => {
    onCustomerSelect(customer.id);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const getDisplayName = (customer: Customer) => {
    if (customer.name && customer.name.trim()) {
      return customer.name;
    }
    return customer.email || customer.phone || 'Unnamed Customer';
  };

  const getSubtitle = (customer: Customer) => {
    const parts = [];
    if (customer.email) parts.push(customer.email);
    if (customer.phone) parts.push(customer.phone);
    if (customer.city && customer.state) parts.push(`${customer.city}, ${customer.state}`);
    return parts.join(' • ');
  };

  return (
    <div className="crm-field">
      <label className="crm-label">Customer</label>
      <div ref={dropdownRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchTerm : (selectedCustomer ? getDisplayName(selectedCustomer) : '')}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className={`crm-input pl-10 ${error ? 'crm-input-error' : ''}`}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'rgb(30, 41, 59)',
              backdropFilter: 'blur(4px)'
            }}
          />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
            {filteredCustomers.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-sm">
                {searchTerm ? 'No customers found' : `No customers available (${customers?.length || 0} total)`}
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => handleCustomerSelect(customer)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {getDisplayName(customer)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getSubtitle(customer)}
                      </div>
                      {customer.address && (
                        <div className="text-xs text-gray-400 mt-1">
                          {customer.address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {error && <p className="crm-error">{error}</p>}
    </div>
  );
};
