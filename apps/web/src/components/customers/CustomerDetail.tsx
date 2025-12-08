// React import removed (not needed with new JSX transform)
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { Customer } from '@/types/customer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ArrowLeft, Pencil, Phone, Mail, MapPin, Calendar, Tag as TagIcon } from 'lucide-react';

interface CustomerDetailProps {
  customerId: string;
  onBack: () => void;
  onEdit: (customer: Customer) => void;
}

export default function CustomerDetail({ customerId, onBack, onEdit }: CustomerDetailProps) {
  const { data: customer, isLoading, error } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select(`
          *,
          customer_profiles (
            *,
            customer_segments (*)
          ),
          customer_contacts (*)
        `)
        .eq('id', customerId)
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading customer..." />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">
          Error loading customer: {error?.message || 'Customer not found'}
        </div>
      </div>
    );
  }

  const profile = customer.customer_profiles?.[0];
  const segment = profile?.customer_segments;
  const contacts = customer.customer_contacts || [];

  const getSegmentColor = (segmentCode: string) => {
    const colors: Record<string, string> = {
      'RES_BASIC': 'bg-blue-100 text-blue-800',
      'RES_STD': 'bg-green-100 text-green-800',
      'RES_PREM': 'bg-purple-100 text-purple-800',
      'COM_BASIC': 'bg-yellow-100 text-yellow-800',
      'COM_STD': 'bg-orange-100 text-orange-800',
      'COM_PREM': 'bg-red-100 text-red-800',
      'IND': 'bg-gray-100 text-gray-800',
    };
    return colors[segmentCode] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'residential': 'bg-blue-100 text-blue-800',
      'commercial': 'bg-green-100 text-green-800',
      'industrial': 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                <p className="text-sm text-gray-600">
                  Customer ID: {customer.id}
                </p>
              </div>
            </div>
            <button
              onClick={() => onEdit(customer)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Customer
            </button>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <TagIcon className="h-4 w-4 text-gray-400" />
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(customer.account_type)}`}>
                {customer.account_type}
              </span>
            </div>
            {segment && (
              <div className="flex items-center space-x-2">
                <TagIcon className="h-4 w-4 text-gray-400" />
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(segment.segment_code)}`}>
                  {segment.segment_name}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <TagIcon className="h-4 w-4 text-gray-400" />
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                {customer.status}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Since {new Date(customer.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile?.business_name || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Business Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile?.business_type || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Property Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customer.property_type || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Property Size</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customer.property_size || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Access Instructions</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customer.access_instructions || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customer.emergency_contact || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{customer.email}</dd>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900">{customer.phone}</dd>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="text-sm text-gray-900">
                      {customer.address}<br />
                      {customer.city}, {customer.state} {customer.zip_code}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Preferred Contact Method</dt>
                    <dd className="text-sm text-gray-900 capitalize">{customer.preferred_contact_method}</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Information */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Contract Information</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contract Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile?.contract_type || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contract Value</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile?.contract_value ? `$${profile.contract_value.toFixed(2)}` : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contract Start Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile?.contract_start_date ? new Date(profile.contract_start_date).toLocaleDateString() : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Auto Renew</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile?.auto_renew ? 'Yes' : 'No'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{customer.payment_method}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Billing Cycle</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{customer.billing_cycle}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Special Instructions */}
          {profile?.special_instructions && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Special Instructions</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-900">{profile.special_instructions}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Profile Summary */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Profile Summary</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(profile?.account_status || 'inactive')}`}>
                      {profile?.account_status || 'N/A'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      profile?.payment_status === 'current' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {profile?.payment_status || 'N/A'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Service Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      profile?.service_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {profile?.service_status || 'N/A'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">AR Balance</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    ${customer.ar_balance?.toFixed(2) || '0.00'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Preferred Language</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile?.preferred_language || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Timezone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile?.timezone || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Customer Contacts */}
          {contacts.length > 0 && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Contacts</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-3">
                  {contacts.map((contact: {
                    id: string;
                    first_name: string;
                    last_name: string;
                    contact_type: string;
                    is_primary?: boolean;
                  }) => (
                    <div key={contact.id} className="border-l-4 border-purple-400 pl-3">
                      <div className="text-sm font-medium text-gray-900">
                        {contact.first_name} {contact.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{contact.contact_type}</div>
                      {contact.is_primary && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 mt-1">
                          Primary Contact
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Segment Information */}
          {segment && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Segment Details</h3>
              </div>
              <div className="px-6 py-4">
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Segment Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{segment.segment_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">{segment.description}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Pricing Tier</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{segment.pricing_tier}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Default Services</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {segment.default_service_types ? JSON.parse(segment.default_service_types).join(', ') : 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
