import React from 'react';
import { Account } from '@/types/enhanced-types';
import { CustomerStatusBar } from './CustomerStatusBar';
import { Phone, Mail, MapPin, Calendar, DollarSign } from 'lucide-react';
import type { DensityMode } from '@/stores/userPreferences';

interface CustomerCardProps {
  customer: Account;
  onClick: () => void;
  isSelected: boolean;
  densityMode: DensityMode;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onClick,
  isSelected,
  densityMode
}) => {
  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBalanceColor = (balance: number) => {
    if (balance === 0) return 'text-green-600';
    if (balance > 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'border-purple-500 shadow-lg' 
          : 'border-gray-200 hover:border-purple-300'
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b border-gray-100 ${
        densityMode === 'dense' ? 'pb-2' : 'pb-4'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold text-gray-900 truncate ${
            densityMode === 'dense' ? 'text-sm' : 'text-base'
          }`}>
            {customer.name}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
            {customer.status}
          </span>
        </div>
        
        <div className={`text-sm text-gray-600 capitalize ${
          densityMode === 'dense' ? 'text-xs' : 'text-sm'
        }`}>
          {customer.account_type}
        </div>
      </div>

      {/* Content */}
      <div className={`p-4 space-y-3 ${
        densityMode === 'dense' ? 'py-2 space-y-2' : 'py-4 space-y-3'
      }`}>
        {/* Contact Info */}
        <div className="space-y-2">
          {customer.address && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="truncate">
                {customer.address}
                {customer.city && `, ${customer.city}`}
                {customer.state && `, ${customer.state}`}
              </span>
            </div>
          )}
          
          {customer.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="truncate">{formatPhone(customer.phone)}</span>
            </div>
          )}
          
          {customer.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <div>
              <div className={`font-medium ${getBalanceColor(customer.ar_balance || 0)}`}>
                ${(customer.ar_balance || 0).toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                {customer.ar_balance === 0 ? 'Current' : 'Balance'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <div className="font-medium text-gray-900">
                {formatDate((customer as Account & { next_service_date?: string }).next_service_date || '')}
              </div>
              <div className="text-xs text-gray-500">Next Service</div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        {densityMode === 'standard' && (
          <div className="pt-2 border-t border-gray-100">
            <CustomerStatusBar customer={customer} variant="compact" />
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-purple-500 opacity-0 hover:opacity-5 transition-opacity duration-200 rounded-lg pointer-events-none" />
    </div>
  );
};

