import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  CreditCard, 
  FileText,
  Clock,
  Shield,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Badge, Text, Heading } from '@/components/ui';
import { Account } from '@/types/enhanced-types';

interface CustomerInfoPanelProps {
  customer: Account;
  className?: string;
}

const CustomerInfoPanel: React.FC<CustomerInfoPanelProps> = ({ customer, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [serviceAddress, setServiceAddress] = useState({
    street: customer.address || '',
    city: customer.city || '',
    state: customer.state || '',
    zip: customer.zip_code || '',
  });
  const [billingAddress, setBillingAddress] = useState({
    street: customer.billing_address?.street || '',
    city: customer.billing_address?.city || '',
    state: customer.billing_address?.state || '',
    zip: customer.billing_address?.zip || '',
  });

  const copyServiceToBilling = () => {
    setBillingAddress({ ...serviceAddress });
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <Heading level={3} className="text-slate-900">
            Customer Details
          </Heading>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="default">{customer.status.toUpperCase()}</Badge>
            <Badge variant="outline" className="text-slate-700 border-slate-200">
              {customer.account_type.toUpperCase()}
                  </Badge>
                </div>
                  </div>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <div className="flex items-center gap-1">
              <ChevronUp className="h-4 w-4" />
              Collapse
                </div>
          ) : (
            <div className="flex items-center gap-1">
              <ChevronDown className="h-4 w-4" />
              Expand
                  </div>
                )}
        </Button>
              </div>

      {isExpanded && (
        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Heading level={4} className="text-slate-800">
                Contact
              </Heading>
              <div className="flex items-center gap-2 text-slate-800">
                <User className="h-4 w-4 text-slate-500" />
                <span>{customer.name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <Phone className="h-4 w-4 text-slate-500" />
                <span>{customer.phone || 'Not provided'}</span>
            </div>
              <div className="flex items-center gap-2 text-slate-800">
                <Mail className="h-4 w-4 text-slate-500" />
                <span>{customer.email || 'Not provided'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Heading level={4} className="text-slate-800">
                Billing
              </Heading>
              <div className="flex items-center gap-2 text-slate-800">
                <CreditCard className="h-4 w-4 text-slate-500" />
                <span>{customer.payment_method || 'Not set'}</span>
                      </div>
              <div className="flex items-center gap-2 text-slate-800">
                <FileText className="h-4 w-4 text-slate-500" />
                <span>Billing Cycle: {customer.billing_cycle || 'N/A'}</span>
                      </div>
              <div className="flex items-center gap-2 text-slate-800">
                <Shield className="h-4 w-4 text-slate-500" />
                <span>Status: {customer.status}</span>
                        </div>
                      </div>
                    </div>
                    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Heading level={4} className="text-slate-800">
                Service Address
              </Heading>
              <Input
                value={serviceAddress.street}
                onChange={(e) => setServiceAddress({ ...serviceAddress, street: e.target.value })}
                placeholder="Street"
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  value={serviceAddress.city}
                  onChange={(e) => setServiceAddress({ ...serviceAddress, city: e.target.value })}
                          placeholder="City"
                />
                <Input
                  value={serviceAddress.state}
                  onChange={(e) => setServiceAddress({ ...serviceAddress, state: e.target.value })}
                          placeholder="State"
                />
                <Input
                  value={serviceAddress.zip}
                  onChange={(e) => setServiceAddress({ ...serviceAddress, zip: e.target.value })}
                          placeholder="ZIP"
                        />
                      </div>
                    </div>
                    
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Heading level={4} className="text-slate-800">
                  Billing Address
                </Heading>
                <Button variant="outline" size="sm" onClick={copyServiceToBilling}>
                  Copy Service Address
                </Button>
              </div>
              <Input
                value={billingAddress.street}
                onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                          placeholder="Street"
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                          placeholder="City"
                />
                <Input
                  value={billingAddress.state}
                  onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                          placeholder="State"
                />
                <Input
                  value={billingAddress.zip}
                  onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })}
                          placeholder="ZIP"
                />
                    </div>
                  </div>
                </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-slate-700 mb-1">
                <Calendar className="h-4 w-4" />
                <span>Next Service</span>
                       </div>
              <Text variant="body">Not scheduled</Text>
                     </div>
            <div className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-slate-700 mb-1">
                <Clock className="h-4 w-4" />
                <span>Last Service</span>
                       </div>
              <Text variant="body">N/A</Text>
                         </div>
            <div className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-slate-700 mb-1">
                <User className="h-4 w-4" />
                <span>Technician</span>
                       </div>
              <Text variant="body">Unassigned</Text>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CustomerInfoPanel;

