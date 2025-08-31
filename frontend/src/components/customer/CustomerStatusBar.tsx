import React from 'react';
import { Account } from '@/types/enhanced-types';
import { CheckCircle, XCircle, Clock, AlertTriangle, Home, Building, Heart, DollarSign, Calendar } from 'lucide-react';

interface CustomerStatusBarProps {
  customer: Account;
  variant?: 'compact' | 'standard' | 'detailed';
}

export const CustomerStatusBar: React.FC<CustomerStatusBarProps> = ({
  customer,
  variant = 'standard'
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
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPropertyIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'residential': return <Home className="w-4 h-4 text-blue-500" />;
      case 'commercial': return <Building className="w-4 h-4 text-purple-500" />;
      case 'healthcare': return <Heart className="w-4 h-4 text-red-500" />;
      default: return <Home className="w-4 h-4 text-gray-500" />;
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between text-sm">
        <div className="text-xs text-gray-900 truncate max-w-xs font-medium">
          {customer.name} • {customer.phone && formatPhone(customer.phone)} • {[customer.address, customer.city].filter(Boolean).join(', ')}
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(customer.status)}
          <span className={customer.status === 'active' ? 'text-green-600' : 'text-red-600'}>
            {customer.status}
          </span>
          <span className="text-gray-400">|</span>
          <DollarSign className="w-3 h-3" />
          <span className={customer.ar_balance === 0 ? 'text-green-600' : 'text-red-600'}>
            ${(customer.ar_balance || 0).toFixed(2)}
          </span>
          <span className="text-gray-400">|</span>
          {getPropertyIcon(customer.account_type)}
          <span className="text-gray-600 capitalize">{customer.account_type}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          {getStatusIcon(customer.status)}
          <span className={customer.status === 'active' ? 'text-green-600' : 'text-red-600'}>
            {customer.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <span className={customer.ar_balance === 0 ? 'text-green-600' : 'text-red-600'}>
            ${(customer.ar_balance || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getPropertyIcon(customer.account_type)}
          <span className="text-gray-600 capitalize">{customer.account_type}</span>
        </div>
      </div>
    </div>
  );
};
