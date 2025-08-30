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
import { crmApi } from '@/lib/api';
import type { Customer, ServiceHistory } from '@/types/customer';

// Mock service history data for demonstration
// This will be replaced with real API data in Phase 2
const mockServiceHistory: Record<string, ServiceHistory[]> = {
  // Generate service history for any customer ID
  'default': [
    { id: '1', date: '2025-01-15', service: 'Monthly Pest Control', technician: 'John Smith', status: 'completed', notes: 'Routine monthly service completed. No issues found.' },
    { id: '2', date: '2025-02-15', service: 'Emergency Service', technician: 'Mike Johnson', status: 'completed', notes: 'Responded to ant infestation in break room. Applied treatment.' },
    { id: '3', date: '2025-03-15', service: 'Quarterly Inspection', technician: 'Sarah Wilson', status: 'scheduled', notes: 'Upcoming quarterly inspection scheduled.' }
  ]
};



export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'commercial' | 'residential'>('all');
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());

  const queryClient = useQueryClient();

  // Fetch customers from API
  const { data: customers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: () => crmApi.accounts(),
  });

  const handleViewHistory = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowHistory(true);
  };

  const filteredCustomers = customers.filter((customer: Customer) => {
    const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || customer.account_type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">


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
      />

      {/* Service History Modal */}
      {showHistory && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Service History - {selectedCustomer.name}
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-3">
              {mockServiceHistory.default?.map((service) => (
                <div key={service.id} className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{service.service}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {service.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><strong>Date:</strong> {service.date}</p>
                    <p><strong>Technician:</strong> {service.technician}</p>
                    <p><strong>Notes:</strong> {service.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
