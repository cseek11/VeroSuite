import React from 'react';
import { Account } from '@/types/enhanced-types';
import { Phone, Mail, Calendar, DollarSign } from 'lucide-react';

interface CustomerListItemProps {
  customer: Account;
  onClick: () => void;
  isSelected: boolean;
}

export const CustomerListItem: React.FC<CustomerListItemProps> = ({
  customer,
  onClick,
  isSelected
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
      case 'suspended': return 'bg-orange-100 text-orange-800';
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
      className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
        isSelected ? 'bg-purple-50 border-l-4 border-purple-500' : ''
      }`}
    >
      {/* Name and Contact */}
      <div className="col-span-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-base">
              {customer.name}
            </h3>
            <div className="text-sm text-gray-600 truncate">
              {(customer.address || customer.city || customer.state) && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">
                    {[customer.address, customer.city, customer.state].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{formatPhone(customer.phone)}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="col-span-2 flex items-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
          {customer.status}
        </span>
      </div>

      {/* Balance */}
      <div className="col-span-2 flex items-center">
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className={`font-medium ${getBalanceColor(customer.ar_balance || 0)}`}>
            ${(customer.ar_balance || 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Created Date */}
      <div className="col-span-2 flex items-center">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {formatDate(customer.created_at || '')}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="col-span-2 flex items-center justify-end">
        <div className="text-sm text-gray-500 capitalize">
          {customer.account_type}
        </div>
      </div>
    </div>
  );
};
