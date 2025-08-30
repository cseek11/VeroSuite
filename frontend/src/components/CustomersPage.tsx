import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './CompactLayout.css';
import CustomerListView from './CustomerListView';
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
  X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';
import { Account, CustomerProfile } from '@/types/enhanced-types';

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'commercial' | 'residential'>('all');
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());

  const queryClient = useQueryClient();

  // Fetch customers from enhanced API
  const { data: customers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['enhanced-customers'],
    queryFn: () => enhancedApi.customers.getAll(),
  });

  // Debug logging
  console.log('CustomersPage - Customers data:', customers);
  console.log('CustomersPage - Loading:', isLoading);
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

  const filteredCustomers = customers.filter((customer: Account) => {
    const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || customer.account_type === filterType;
    return matchesSearch && matchesFilter;
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>
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
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-sm flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

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
