import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTechnician } from '../../hooks/useTechnicians';
import { TechnicianStatus, EmploymentType } from '../../types/technician';
import Button from '../ui/Button';
import Card from '../ui/Card';

const TechnicianDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: technician, isLoading, error } = useTechnician(id || '');

  const getStatusBadge = (status: TechnicianStatus) => {
    const statusColors = {
      [TechnicianStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [TechnicianStatus.INACTIVE]: 'bg-gray-100 text-gray-800',
      [TechnicianStatus.TERMINATED]: 'bg-red-100 text-red-800',
      [TechnicianStatus.ON_LEAVE]: 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getEmploymentTypeBadge = (type: EmploymentType) => {
    const typeColors = {
      [EmploymentType.FULL_TIME]: 'bg-blue-100 text-blue-800',
      [EmploymentType.PART_TIME]: 'bg-purple-100 text-purple-800',
      [EmploymentType.CONTRACTOR]: 'bg-orange-100 text-orange-800',
      [EmploymentType.TEMPORARY]: 'bg-pink-100 text-pink-800',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[type]}`}>
        {type.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading technician details...</div>
      </div>
    );
  }

  if (error || !technician) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error loading technician details</div>
        <Button onClick={() => navigate('/technicians')} variant="outline">
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {technician.user?.first_name} {technician.user?.last_name}
          </h1>
          <p className="text-gray-600">{technician.user?.email}</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => navigate(`/technicians/${technician.id}/edit`)}
            variant="outline"
          >
            Edit
          </Button>
          <Button
            onClick={() => navigate('/technicians')}
            variant="outline"
          >
            Back to List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Employee ID</label>
                <p className="text-sm text-gray-900">{technician.employee_id || 'Not assigned'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Hire Date</label>
                <p className="text-sm text-gray-900">{formatDate(technician.hire_date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Position</label>
                <p className="text-sm text-gray-900">{technician.position || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Department</label>
                <p className="text-sm text-gray-900">{technician.department || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">{getStatusBadge(technician.status)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Employment Type</label>
                <div className="mt-1">{getEmploymentTypeBadge(technician.employment_type)}</div>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{technician.user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm text-gray-900">{technician.user?.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Technician Number</label>
                <p className="text-sm text-gray-900">{technician.user?.technician_number || 'Not assigned'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Pesticide License</label>
                <p className="text-sm text-gray-900">{technician.user?.pesticide_license_number || 'Not provided'}</p>
              </div>
            </div>
          </Card>

          {/* Address Information */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Address Information</h2>
            <div className="space-y-2">
              {technician.address_line1 && (
                <p className="text-sm text-gray-900">{technician.address_line1}</p>
              )}
              {technician.address_line2 && (
                <p className="text-sm text-gray-900">{technician.address_line2}</p>
              )}
              {(technician.city || technician.state || technician.postal_code) && (
                <p className="text-sm text-gray-900">
                  {[technician.city, technician.state, technician.postal_code].filter(Boolean).join(', ')}
                </p>
              )}
              {technician.country && (
                <p className="text-sm text-gray-900">{technician.country}</p>
              )}
              {!technician.address_line1 && !technician.city && (
                <p className="text-sm text-gray-500 italic">No address information provided</p>
              )}
            </div>
          </Card>

          {/* Personal Information */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-sm text-gray-900">
                  {technician.date_of_birth ? formatDate(technician.date_of_birth) : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Social Security Number</label>
                <p className="text-sm text-gray-900">
                  {technician.social_security_number ? '***-**-' + technician.social_security_number.slice(-4) : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Driver License Number</label>
                <p className="text-sm text-gray-900">{technician.driver_license_number || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Driver License State</label>
                <p className="text-sm text-gray-900">{technician.driver_license_state || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">License Expiry</label>
                <p className="text-sm text-gray-900">
                  {technician.driver_license_expiry ? formatDate(technician.driver_license_expiry) : 'Not provided'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Emergency Contact */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="text-sm text-gray-900">
                  {technician.emergency_contact_name || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm text-gray-900">
                  {technician.emergency_contact_phone || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Relationship</label>
                <p className="text-sm text-gray-900">
                  {technician.emergency_contact_relationship || 'Not provided'}
                </p>
              </div>
            </div>
          </Card>

          {/* System Information */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">System Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Created</label>
                <p className="text-sm text-gray-900">{formatDate(technician.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-sm text-gray-900">{formatDate(technician.updated_at)}</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button
                onClick={() => navigate(`/technicians/${technician.id}/edit`)}
                variant="primary"
                className="w-full"
              >
                Edit Technician
              </Button>
              <Button
                onClick={() => navigate('/work-orders')}
                variant="outline"
                className="w-full"
              >
                View Work Orders
              </Button>
              <Button
                onClick={() => navigate('/technicians')}
                variant="outline"
                className="w-full"
              >
                Back to List
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDetail;

