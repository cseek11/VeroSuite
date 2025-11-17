import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTechnicians, useDeleteTechnician } from '../../hooks/useTechnicians';
import { TechnicianStatus, EmploymentType } from '../../types/technician';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

const TechnicianList: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    department: '',
    position: '',
    employment_type: '',
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error, refetch } = useTechnicians(filters);
  const deleteTechnicianMutation = useDeleteTechnician();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
    refetch();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteTechnicianMutation.mutateAsync(id);
      } catch (error) {
        logger.error('Failed to delete technician', error, 'TechnicianList');
        toast.error('Failed to delete technician. Please try again.');
      }
    }
  };

  const getStatusBadge = (status: TechnicianStatus) => {
    const statusColors = {
      [TechnicianStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [TechnicianStatus.INACTIVE]: 'bg-gray-100 text-gray-800',
      [TechnicianStatus.TERMINATED]: 'bg-red-100 text-red-800',
      [TechnicianStatus.ON_LEAVE]: 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type]}`}>
        {type.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading technicians...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error loading technicians</div>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Technicians</h1>
          <p className="text-gray-600">Manage your technician team</p>
        </div>
        <Button 
          onClick={() => navigate('/technicians/new')}
          variant="primary"
        >
          Add Technician
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              type="text"
              placeholder="Search technicians..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="crm-input"
            />
            
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="crm-input"
            >
              <option value="">All Statuses</option>
              <option value={TechnicianStatus.ACTIVE}>Active</option>
              <option value={TechnicianStatus.INACTIVE}>Inactive</option>
              <option value={TechnicianStatus.TERMINATED}>Terminated</option>
              <option value={TechnicianStatus.ON_LEAVE}>On Leave</option>
            </select>

            <Input
              type="text"
              placeholder="Department"
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="crm-input"
            />

            <Input
              type="text"
              placeholder="Position"
              value={filters.position}
              onChange={(e) => handleFilterChange('position', e.target.value)}
              className="crm-input"
            />

            <select
              value={filters.employment_type}
              onChange={(e) => handleFilterChange('employment_type', e.target.value)}
              className="crm-input"
            >
              <option value="">All Types</option>
              <option value={EmploymentType.FULL_TIME}>Full Time</option>
              <option value={EmploymentType.PART_TIME}>Part Time</option>
              <option value={EmploymentType.CONTRACTOR}>Contractor</option>
              <option value={EmploymentType.TEMPORARY}>Temporary</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              Search
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setFilters({
                search: '',
                status: '',
                department: '',
                position: '',
                employment_type: '',
                page: 1,
                limit: 20,
              })}
            >
              Clear
            </Button>
          </div>
        </form>
      </Card>

      {/* Results */}
      <Card>
        {!data?.technicians || data.technicians.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">No technicians found</div>
            <Button 
              onClick={() => navigate('/technicians/new')}
              variant="primary"
            >
              Add First Technician
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technician
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(data?.technicians || []).map((technician) => (
                  <tr key={technician.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">
                              {technician.user?.first_name?.[0]}{technician.user?.last_name?.[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {technician.user?.first_name} {technician.user?.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {technician.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {technician.employee_id || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {technician.position || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {technician.department || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(technician.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEmploymentTypeBadge(technician.employment_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        onClick={() => navigate(`/technicians/${technician.id}`)}
                        variant="outline"
                        size="sm"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => navigate(`/technicians/${technician.id}/edit`)}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(technician.id, `${technician.user?.first_name} ${technician.user?.last_name}`)}
                        variant="danger"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {((filters.page - 1) * filters.limit) + 1} to {Math.min(filters.page * filters.limit, data.total)} of {data.total} results
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={filters.page === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={filters.page >= data.total_pages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TechnicianList;

