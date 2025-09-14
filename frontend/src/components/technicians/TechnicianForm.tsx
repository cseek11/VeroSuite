import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCreateTechnician, useUpdateTechnician, useTechnician } from '../../hooks/useTechnicians';
import { CreateTechnicianProfileDto, UpdateTechnicianProfileDto, EmploymentType, TechnicianStatus } from '../../types/technician';
import { User } from '../../types/user';
import { userApi } from '../../lib/user-api';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import CreateUserModal from './CreateUserModal';

interface TechnicianFormProps {
  technicianId?: string;
  isEdit?: boolean;
}


const TechnicianForm: React.FC<TechnicianFormProps> = ({ technicianId, isEdit = false }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  const { data: technician, isLoading: loadingTechnician } = useTechnician(technicianId || '');
  const createMutation = useCreateTechnician();
  const updateMutation = useUpdateTechnician();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateTechnicianProfileDto | UpdateTechnicianProfileDto>();

  // Load users for the dropdown
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const data = await userApi.getUsers();
        const usersList = data.users || [];
        
        // If no users found, try to sync from authentication system
        if (usersList.length === 0) {
          console.log('No users found, attempting to sync from authentication system...');
          try {
            const syncResult = await userApi.syncUsers();
            console.log('Sync result:', syncResult);
            setUsers(syncResult.users || []);
          } catch (syncError) {
            console.error('Error syncing users:', syncError);
            setUsers(usersList);
          }
        } else {
          setUsers(usersList);
        }
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (!isEdit) {
      loadUsers();
    }
  }, [isEdit]);

  // Populate form when editing
  useEffect(() => {
    if (isEdit && technician) {
      setValue('employee_id', technician.employee_id || '');
      setValue('hire_date', technician.hire_date.split('T')[0]);
      setValue('position', technician.position || '');
      setValue('department', technician.department || '');
      setValue('employment_type', technician.employment_type);
      setValue('status', technician.status);
      setValue('emergency_contact_name', technician.emergency_contact_name || '');
      setValue('emergency_contact_phone', technician.emergency_contact_phone || '');
      setValue('emergency_contact_relationship', technician.emergency_contact_relationship || '');
      setValue('address_line1', technician.address_line1 || '');
      setValue('address_line2', technician.address_line2 || '');
      setValue('city', technician.city || '');
      setValue('state', technician.state || '');
      setValue('postal_code', technician.postal_code || '');
      setValue('country', technician.country);
      setValue('date_of_birth', technician.date_of_birth ? technician.date_of_birth.split('T')[0] : '');
      setValue('social_security_number', technician.social_security_number || '');
      setValue('driver_license_number', technician.driver_license_number || '');
      setValue('driver_license_state', technician.driver_license_state || '');
      setValue('driver_license_expiry', technician.driver_license_expiry ? technician.driver_license_expiry.split('T')[0] : '');
    }
  }, [isEdit, technician, setValue]);

  const onSubmit = async (data: CreateTechnicianProfileDto | UpdateTechnicianProfileDto) => {
    try {
      if (isEdit && technicianId) {
        await updateMutation.mutateAsync({ id: technicianId, data: data as UpdateTechnicianProfileDto });
      } else {
        await createMutation.mutateAsync(data as CreateTechnicianProfileDto);
      }
      navigate('/technicians');
    } catch (error) {
      console.error('Failed to save technician:', error);
      alert('Failed to save technician. Please try again.');
    }
  };

  const handleUserCreated = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    setValue('user_id', newUser.id);
    setShowCreateUserModal(false);
  };

  if (loadingTechnician) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading technician...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Technician' : 'Add New Technician'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Update technician information' : 'Create a new technician profile'}
          </p>
        </div>
        <Button 
          onClick={() => navigate('/technicians')}
          variant="outline"
        >
          Back to List
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User *
                </label>
                <div className="flex gap-2">
                  <select
                    {...register('user_id', { required: 'User is required' })}
                    className="crm-input flex-1"
                    disabled={loadingUsers}
                  >
                    <option value="">Select a user...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} ({user.email})
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCreateUserModal(true)}
                    className="px-4 py-2 whitespace-nowrap"
                  >
                    + New User
                  </Button>
                </div>
                {errors.user_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.user_id.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID
              </label>
              <Input
                type="text"
                {...register('employee_id')}
                className="crm-input"
                placeholder="Enter employee ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hire Date *
              </label>
              <Input
                type="date"
                {...register('hire_date', { required: 'Hire date is required' })}
                className="crm-input"
              />
              {errors.hire_date && (
                <p className="text-red-500 text-sm mt-1">{errors.hire_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <Input
                type="text"
                {...register('position')}
                className="crm-input"
                placeholder="Enter position"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <Input
                type="text"
                {...register('department')}
                className="crm-input"
                placeholder="Enter department"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type
              </label>
              <select {...register('employment_type')} className="crm-input">
                <option value={EmploymentType.FULL_TIME}>Full Time</option>
                <option value={EmploymentType.PART_TIME}>Part Time</option>
                <option value={EmploymentType.CONTRACTOR}>Contractor</option>
                <option value={EmploymentType.TEMPORARY}>Temporary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select {...register('status')} className="crm-input">
                <option value={TechnicianStatus.ACTIVE}>Active</option>
                <option value={TechnicianStatus.INACTIVE}>Inactive</option>
                <option value={TechnicianStatus.TERMINATED}>Terminated</option>
                <option value={TechnicianStatus.ON_LEAVE}>On Leave</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Name
              </label>
              <Input
                type="text"
                {...register('emergency_contact_name')}
                className="crm-input"
                placeholder="Enter contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <Input
                type="tel"
                {...register('emergency_contact_phone')}
                className="crm-input"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship
              </label>
              <Input
                type="text"
                {...register('emergency_contact_relationship')}
                className="crm-input"
                placeholder="e.g., Spouse, Parent"
              />
            </div>
          </div>
        </Card>

        {/* Address Information */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <Input
                type="text"
                {...register('address_line1')}
                className="crm-input"
                placeholder="Enter address"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <Input
                type="text"
                {...register('address_line2')}
                className="crm-input"
                placeholder="Enter apartment, suite, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <Input
                type="text"
                {...register('city')}
                className="crm-input"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <Input
                type="text"
                {...register('state')}
                className="crm-input"
                placeholder="Enter state"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <Input
                type="text"
                {...register('postal_code')}
                className="crm-input"
                placeholder="Enter postal code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <Input
                type="text"
                {...register('country')}
                className="crm-input"
                placeholder="Enter country"
                defaultValue="US"
              />
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <Input
                type="date"
                {...register('date_of_birth')}
                className="crm-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Social Security Number
              </label>
              <Input
                type="text"
                {...register('social_security_number')}
                className="crm-input"
                placeholder="XXX-XX-XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver License Number
              </label>
              <Input
                type="text"
                {...register('driver_license_number')}
                className="crm-input"
                placeholder="Enter license number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver License State
              </label>
              <Input
                type="text"
                {...register('driver_license_state')}
                className="crm-input"
                placeholder="Enter state"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver License Expiry
              </label>
              <Input
                type="date"
                {...register('driver_license_expiry')}
                className="crm-input"
              />
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={() => navigate('/technicians')}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? 'Saving...'
              : isEdit
              ? 'Update Technician'
              : 'Create Technician'
            }
          </Button>
        </div>
      </form>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
};

export default TechnicianForm;
