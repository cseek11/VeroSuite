import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Calendar, FileText } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface CertificationAlert {
  user_id: string;
  name: string;
  email: string;
  license_number?: string;
  expiration_date?: string;
  days_until_expiration?: number;
}

async function fetchCertificationAlerts(daysAhead: number = 30): Promise<CertificationAlert[]> {
  const token = localStorage.getItem('verofield_auth')
    ? JSON.parse(localStorage.getItem('verofield_auth')!).token
    : localStorage.getItem('jwt');
  const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';

  const response = await fetch(`${API_BASE_URL}/v1/users/certifications/alerts?daysAhead=${daysAhead}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch certification alerts: ${response.statusText}`);
  }

  return response.json();
}

export default function CertificationAlerts() {
  const [daysAhead, setDaysAhead] = useState(30);

  const { data: alerts = [], isLoading, error } = useQuery({
    queryKey: ['certification-alerts', daysAhead],
    queryFn: () => fetchCertificationAlerts(daysAhead),
  });

  const getAlertColor = (daysUntilExpiration?: number) => {
    if (!daysUntilExpiration) return 'bg-gray-100 text-gray-800';
    if (daysUntilExpiration <= 7) return 'bg-red-100 text-red-800 border-red-200';
    if (daysUntilExpiration <= 14) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800 text-sm">
          Error loading alerts: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Certification Alerts</h3>
          <p className="text-sm text-gray-500">
            {alerts.length} certification{alerts.length !== 1 ? 's' : ''} expiring soon
          </p>
        </div>
        <select
          value={daysAhead}
          onChange={(e) => setDaysAhead(parseInt(e.target.value, 10))}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="7">Next 7 Days</option>
          <option value="14">Next 14 Days</option>
          <option value="30">Next 30 Days</option>
          <option value="60">Next 60 Days</option>
          <option value="90">Next 90 Days</option>
        </select>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No certifications expiring in the next {daysAhead} days</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.user_id}
              className={`p-4 rounded-lg border ${getAlertColor(alert.days_until_expiration)}`}
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{alert.name}</p>
                      <p className="text-sm opacity-90">{alert.email}</p>
                    </div>
                    {alert.days_until_expiration !== null && (
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {alert.days_until_expiration} day{alert.days_until_expiration !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs opacity-75">until expiration</p>
                      </div>
                    )}
                  </div>
                  {alert.license_number && (
                    <div className="mt-2 flex items-center text-sm">
                      <FileText className="h-4 w-4 mr-1" />
                      License: {alert.license_number}
                    </div>
                  )}
                  {alert.expiration_date && (
                    <div className="mt-1 flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Expires: {new Date(alert.expiration_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}





