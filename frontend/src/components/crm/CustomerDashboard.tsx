import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import CustomerProfileCard from './CustomerProfileCard';
import ServiceHistoryTimeline from './ServiceHistoryTimeline';
import SmartScheduler from './SmartScheduler';
import ContractManager from './ContractManager';
import CommunicationHub from './CommunicationHub';
import DualNotesSystem from './DualNotesSystem';
import PhotoGallery from './PhotoGallery';
import BusinessIntelligenceDashboard from './BusinessIntelligenceDashboard';
import ComplianceCenter from './ComplianceCenter';
import {
  Card,
  Tabs,
  Typography,
  Alert,
  Button
} from '@/components/ui/EnhancedUI';
import {
  User,
  Calendar,
  FileText,
  MessageCircle,
  Camera,
  BarChart3,
  Shield,
  Settings
} from 'lucide-react';

interface CustomerDashboardProps {
  customerId: string;
}

export default function CustomerDashboard({ customerId }: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch customer data
  const { data: customer, isLoading: customerLoading, error: customerError } = useQuery({
    queryKey: ['crm', 'customer', customerId],
    queryFn: () => enhancedApi.customers.getById(customerId),
  });

  // Fetch service history using enhanced API
  const { data: serviceHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['service-history', customerId],
    queryFn: () => enhancedApi.serviceHistory.getByCustomer(customerId),
    enabled: !!customerId,
  });

  // Fetch customer notes using enhanced API
  const { data: notes, isLoading: notesLoading } = useQuery({
    queryKey: ['customer-notes', customerId],
    queryFn: () => enhancedApi.customerNotes.getByCustomer(customerId),
    enabled: !!customerId,
  });

  // Fetch customer photos using enhanced API
  const { data: photos, isLoading: photosLoading } = useQuery({
    queryKey: ['customer-photos', customerId],
    queryFn: () => enhancedApi.customerPhotos.getByCustomer(customerId),
    enabled: !!customerId,
  });

  // Fetch contracts using enhanced API
  const { data: contracts, isLoading: contractsLoading } = useQuery({
    queryKey: ['customer-contracts', customerId],
    queryFn: () => enhancedApi.contracts.getByCustomer(customerId),
    enabled: !!customerId,
  });

  if (customerLoading) {
    return <LoadingSpinner text="Loading customer data..." />;
  }

  if (customerError) {
    return (
      <Alert type="error" title="Error Loading Customer">
        Failed to load customer data. Please try again.
      </Alert>
    );
  }

  if (!customer) {
    return (
      <Alert type="warning" title="Customer Not Found">
        The requested customer could not be found.
      </Alert>
    );
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: User,
      component: (
        <div className="space-y-6">
          <CustomerProfileCard customer={customer} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ServiceHistoryTimeline 
              serviceHistory={serviceHistory || []} 
              isLoading={historyLoading}
            />
            <SmartScheduler customerId={customerId} />
          </div>
        </div>
      )
    },
    {
      id: 'contracts',
      label: 'Contracts',
      icon: FileText,
      component: (
        <ContractManager 
          contracts={contracts || []} 
          customerId={customerId}
          isLoading={contractsLoading}
        />
      )
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageCircle,
      component: (
        <CommunicationHub customerId={customerId} />
      )
    },
    {
      id: 'notes',
      label: 'Notes & Photos',
      icon: Camera,
      component: (
        <div className="space-y-6">
          <DualNotesSystem 
            notes={notes || []} 
            customerId={customerId}
            isLoading={notesLoading}
          />
          <PhotoGallery 
            photos={photos || []} 
            customerId={customerId}
            isLoading={photosLoading}
          />
        </div>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: (
        <BusinessIntelligenceDashboard customerId={customerId} />
      )
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: Shield,
      component: (
        <ComplianceCenter customerId={customerId} />
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <Typography variant="h1" className="text-gray-900">
          {customer.name}
        </Typography>
        <Typography variant="body1" className="text-gray-600 mt-2">
          Customer ID: {customer.id} • {customer.account_type} • {customer.status}
        </Typography>
      </div>

      {/* Tabs */}
      <Card className="mb-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "primary" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </Tabs>
      </Card>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
}







