import React, { useState } from 'react';
import CustomerList from '@/components/customers/CustomerList';
import CustomerDetail from '@/components/customers/CustomerDetail';
import CustomerForm from '@/components/customers/CustomerForm';
import { Customer } from '@/types/customer';

type ViewMode = 'list' | 'detail' | 'create' | 'edit';

export default function CustomerManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewMode('detail');
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewMode('edit');
  };

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setViewMode('create');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCustomer(null);
  };

  const handleSaveCustomer = () => {
    setViewMode('list');
    setSelectedCustomer(null);
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return (
          <CustomerList
            onViewCustomer={handleViewCustomer}
            onEditCustomer={handleEditCustomer}
            onCreateCustomer={handleCreateCustomer}
          />
        );
      case 'detail':
        return selectedCustomer ? (
          <CustomerDetail
            customerId={selectedCustomer.id}
            onBack={handleBackToList}
            onEdit={handleEditCustomer}
          />
        ) : null;
      case 'create':
        return (
          <CustomerForm
            onSave={handleSaveCustomer}
            onCancel={handleBackToList}
          />
        );
      case 'edit':
        return selectedCustomer ? (
          <CustomerForm
            customer={selectedCustomer}
            onSave={handleSaveCustomer}
            onCancel={handleBackToList}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </div>
    </div>
  );
}













