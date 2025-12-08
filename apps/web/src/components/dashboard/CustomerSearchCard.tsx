/**
 * Customer Search Card Component
 * 
 * Dashboard card for searching and displaying customers.
 * Supports drag-and-drop interactions with other cards.
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, User, MapPin, Phone, Mail } from 'lucide-react';
import { secureApiClient } from '@/lib/secure-api-client';
import { Account } from '@/types/enhanced-types';
import { DraggableContent } from '@/routes/dashboard/components';
import { getCardInteractionRegistry } from '@/routes/dashboard/utils/CardInteractionRegistry';
import { CardConfig } from '@/routes/dashboard/types/cardInteractions.types';
import { useAuthStore } from '@/stores/auth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Input from '@/components/ui/Input';
import { logger } from '@/utils/logger';

interface CustomerSearchCardProps {
  cardId?: string;
  className?: string;
}

export default function CustomerSearchCard({ 
  cardId = 'customer-search',
  className = '' 
}: CustomerSearchCardProps) {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);

  // Fetch customers
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', 'search', searchTerm],
    queryFn: async () => {
      const allCustomers = await secureApiClient.getAllAccounts();
      
      if (!searchTerm.trim()) {
        return allCustomers.slice(0, 10); // Show first 10 when no search
      }
      
      const searchLower = searchTerm.toLowerCase();
      return allCustomers.filter((customer: Account) =>
        customer.name?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.phone?.includes(searchTerm) ||
        customer.address?.toLowerCase().includes(searchLower)
      );
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Register card for interactions
  useEffect(() => {
    const registry = getCardInteractionRegistry();
    
    const config: CardConfig = {
      id: cardId,
      type: 'customer-search',
      canDrag: true,
      dragConfig: {
        dataType: 'customer',
        supportsMultiSelect: false,
        getDragPayload: (customer: Account) => ({
          sourceCardId: cardId,
          sourceCardType: 'customer-search',
          sourceDataType: 'customer',
          data: {
            id: customer.id,
            type: 'customer',
            entity: customer
          },
          dragPreview: {
            title: customer.name || 'Customer',
            icon: '👤',
            color: '#3b82f6'
          },
          timestamp: Date.now(),
          userId: user?.id || 'anonymous'
        }),
        getDragPreview: (customer: Account) => ({
          title: customer.name || 'Customer',
          icon: '👤',
          color: '#3b82f6'
        })
      }
    };

    registry.registerCard(config);
    logger.debug('Registered Customer Search Card for interactions', { cardId });

    return () => {
      registry.unregisterCard(cardId);
    };
  }, [cardId, user]);

  const handleCustomerClick = (customer: Account) => {
    setSelectedCustomer(customer);
  };

  return (
    <div className={`customer-search-card ${className}`} data-card-id={cardId}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Customer Search</h3>
          <span className="text-sm text-gray-500">{customers.length} found</span>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="p-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No customers found' : 'Start typing to search customers'}
          </div>
        ) : (
          <div className="space-y-2">
            {customers.map((customer: Account) => (
              <DraggableContent
                key={customer.id}
                cardId={cardId}
                dataType="customer"
                data={customer as unknown as Record<string, unknown> & { id?: string; _id?: string; name?: string; title?: string }}
                className="cursor-grab active:cursor-grabbing"
                getDragPreview={(data: Record<string, unknown>) => {
                  const customer = data as unknown as Account;
                  return {
                    title: customer?.name || 'Customer',
                    icon: '👤',
                    color: '#3b82f6'
                  };
                }}
              >
                <div
                  onClick={(e) => {
                    // Only handle click if not dragging
                    if (!e.defaultPrevented) {
                      handleCustomerClick(customer);
                    }
                  }}
                  onMouseDown={(e) => {
                    // Allow drag to start without triggering click
                    if (e.button === 0) {
                      // Left click - allow drag
                    }
                  }}
                  className={`
                    p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 
                    transition-all duration-200
                    ${selectedCustomer?.id === customer.id ? 'border-blue-500 bg-blue-50' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {customer.name || 'Unnamed Customer'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1 space-y-1">
                        {customer.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{customer.email}</span>
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                        {customer.address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{customer.address}</span>
                          </div>
                        )}
                      </div>
                      {customer.account_type && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {customer.account_type}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400 italic">
                    Drag to schedule, create invoice, or generate report
                  </div>
                </div>
              </DraggableContent>
            ))}
          </div>
        )}
      </div>

      {/* Selected Customer Details */}
      {selectedCustomer && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm">
            <div className="font-medium text-gray-900 mb-1">Selected Customer</div>
            <div className="text-gray-600">{selectedCustomer.name}</div>
          </div>
        </div>
      )}
    </div>
  );
}

