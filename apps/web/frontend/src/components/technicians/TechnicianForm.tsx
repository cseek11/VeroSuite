import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTechnician, useUpdateTechnician, useTechnician } from '../../hooks/useTechnicians';
import { CreateTechnicianProfileDto, UpdateTechnicianProfileDto, EmploymentType, TechnicianStatus } from '../../types/technician';
import { User } from '../../types/user';
import { userApi } from '../../lib/user-api';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import CreateUserModal from './CreateUserModal';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

interface TechnicianFormProps {
  technicianId?: string;
  isEdit?: boolean;
}

// Form validation schema
const technicianFormSchema = z.object({
  user_id: z.string().uuid('User is required').optional(),
  employee_id: z.string().min(1, 'Employee ID is required'),
  hire_date: z.string().min(1, 'Hire date is required'),
  position: z.string().min(1, 'Position is required'),
  department: z.string().min(1, 'Department is required'),
  employment_type: z.nativeEnum(EmploymentType, { required_error: 'Employment type is required' }),
  status: z.nativeEnum(TechnicianStatus, { required_error: 'Status is required' }),
  emergency_contact_name: z.string().min(1, 'Emergency contact name is required'),
  emergency_contact_phone: z.string().min(1, 'Emergency contact phone is required'),
  emergency_contact_relationship: z.string().min(1, 'Emergency contact relationship is required'),
  address_line1: z.string().min(1, 'Address line 1 is required'),
  address_line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required').length(2, 'State must be 2 characters'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  social_security_number: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format XXX-XX-XXXX'),
  driver_license_number: z.string().optional(),
  driver_license_state: z.string().optional(),
  driver_license_expiry: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
});

type TechnicianFormData = z.infer<typeof technicianFormSchema>;

const TechnicianForm: React.FC<TechnicianFormProps> = ({ technicianId, isEdit = false }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [newQualification, setNewQualification] = useState('');

  const { data: technician, isLoading: loadingTechnician } = useTechnician(technicianId || '');
  const createMutation = useCreateTechnician();
  const updateMutation = useUpdateTechnician();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TechnicianFormData>({
    resolver: zodResolver(technicianFormSchema),
    defaultValues: {
      employee_id: '',
      hire_date: '',
      position: '',
      department: '',
      employment_type: EmploymentType.FULL_TIME,
      status: TechnicianStatus.ACTIVE,
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
      date_of_birth: '',
      social_security_number: '',
      driver_license_number: '',
      driver_license_state: '',
      driver_license_expiry: '',
      qualifications: [],
    },
  });

  // Load users for the dropdown
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const data = await userApi.getUsers();
        const usersList = data.users || [];
        
        // If no users found, try to sync from authentication system
        if (usersList.length === 0) {
          logger.debug('No users found, attempting to sync from authentication system', {}, 'TechnicianForm');
          try {
            const syncResult = await userApi.syncUsers();
            logger.debug('User sync completed', { usersCount: syncResult.users?.length || 0 }, 'TechnicianForm');
            setUsers(syncResult.users || []);
          } catch (syncError) {
            logger.error('Error syncing users', syncError, 'TechnicianForm');
            setUsers(usersList);
          }
        } else {
          setUsers(usersList);
        }
      } catch (error) {
        logger.error('Error loading users', error, 'TechnicianForm');
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
      setValue('hire_date', technician.hire_date?.split('T')[0] ?? '');
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
      setValue('date_of_birth', technician.date_of_birth?.split('T')[0] ?? '');
      setValue('social_security_number', technician.social_security_number || '');
      setValue('driver_license_number', technician.driver_license_number || '');
      setValue('driver_license_state', technician.driver_license_state || '');
      setValue('driver_license_expiry', technician.driver_license_expiry ? technician.driver_license_expiry.split('T')[0] : '');
    }
  }, [isEdit, technician, setValue]);

  const onSubmit = async (data: TechnicianFormData) => {
    try {
      if (isEdit && technicianId) {
        await updateMutation.mutateAsync({ id: technicianId, data: data as UpdateTechnicianProfileDto });
      } else {
        await createMutation.mutateAsync(data as CreateTechnicianProfileDto);
      }
      navigate('/technicians');
    } catch (error) {
      logger.error('Failed to save technician', error, 'TechnicianForm');
      toast.error('Failed to save technician. Please try again.');
    }
  };

  const handleUserCreated = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    setValue('user_id', newUser.id);
    // Auto-populate employee_id if user has one
    if (newUser.employee_id) {
      setValue('employee_id', newUser.employee_id);
    }
    setShowCreateUserModal(false);
  };

  // Auto-populate employee_id when user is selected
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'user_id' && value.user_id && !isEdit) {
        const selectedUser = users.find(u => u.id === value.user_id);
        if (selectedUser?.employee_id) {
          setValue('employee_id', selectedUser.employee_id);
        } else if (selectedUser && !selectedUser.employee_id) {
          // User doesn't have employee_id, try to generate one
          // This is optional - user can still manually enter one
          userApi.getNextEmployeeId('technician').then((employeeId) => {
            setValue('employee_id', employeeId);
          }).catch((error) => {
            logger.error('Failed to generate employee ID', error, 'TechnicianForm');
            // Continue without auto-populating - user can enter manually
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, users, isEdit]);

  // SSN formatting handler
  const formatSSN = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 9 digits
    const limited = digits.slice(0, 9);
    // Format as XXX-XX-XXXX
    if (limited.length <= 3) return limited;
    if (limited.length <= 5) return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    return `${limited.slice(0, 3)}-${limited.slice(3, 5)}-${limited.slice(5)}`;
  };

  const handleSSNChange = (value: string, onChange: (value: string) => void) => {
    const formatted = formatSSN(value);
    onChange(formatted);
  };

  // Qualifications handlers
  const addQualification = () => {
    if (newQualification.trim() && !qualifications.includes(newQualification.trim())) {
      const updated = [...qualifications, newQualification.trim()];
      setQualifications(updated);
      setValue('qualifications', updated);
      setNewQualification('');
    }
  };

  const removeQualification = (qual: string) => {
    const updated = qualifications.filter(q => q !== qual);
    setQualifications(updated);
    setValue('qualifications', updated);
  };

  const handleQualificationKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addQualification();
    }
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Controller
                    name="user_id"
                    control={control}
                    rules={{ required: 'User is required' }}
                    render={({ field }) => (
                      <Select
                        value={field.value || ''}
                        onChange={field.onChange}
                        disabled={loadingUsers}
                        placeholder="Select a user..."
                        options={users.map((user) => ({
                          value: user.id,
                          label: `${user.first_name} ${user.last_name} (${user.email})`,
                        }))}
                        className="flex-1"
                        error={errors.user_id?.message}
                      />
                    )}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCreateUserModal(true)}
                    className="px-4 py-2 whitespace-nowrap flex-shrink-0"
                  >
                    + New User
                  </Button>
                </div>
                {errors.user_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.user_id.message}</p>
                )}
              </div>
            )}

            <Controller
              name="employee_id"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  label="Employee ID *"
                  placeholder="Enter employee ID"
                  error={errors.employee_id?.message}
                />
              )}
            />

            <Controller
              name="hire_date"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  {...field}
                  label="Hire Date *"
                  error={errors.hire_date?.message}
                />
              )}
            />

            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  label="Position *"
                  placeholder="Enter position"
                  error={errors.position?.message}
                />
              )}
            />

            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  label="Department *"
                  placeholder="Enter department"
                  error={errors.department?.message}
                />
              )}
            />

            <Controller
              name="employment_type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || EmploymentType.FULL_TIME}
                  onChange={field.onChange}
                  label="Employment Type *"
                  options={[
                    { value: EmploymentType.FULL_TIME, label: 'Full Time' },
                    { value: EmploymentType.PART_TIME, label: 'Part Time' },
                    { value: EmploymentType.CONTRACTOR, label: 'Contractor' },
                    { value: EmploymentType.TEMPORARY, label: 'Temporary' },
                  ]}
                  error={errors.employment_type?.message}
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || TechnicianStatus.ACTIVE}
                  onChange={field.onChange}
                  label="Status *"
                  options={[
                    { value: TechnicianStatus.ACTIVE, label: 'Active' },
                    { value: TechnicianStatus.INACTIVE, label: 'Inactive' },
                    { value: TechnicianStatus.TERMINATED, label: 'Terminated' },
                    { value: TechnicianStatus.ON_LEAVE, label: 'On Leave' },
                  ]}
                  error={errors.status?.message}
                />
              )}
            />
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name="emergency_contact_name"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  label="Contact Name *"
                  placeholder="Enter contact name"
                  error={errors.emergency_contact_name?.message}
                />
              )}
            />

            <Controller
              name="emergency_contact_phone"
              control={control}
              render={({ field }) => (
                <Input
                  type="tel"
                  {...field}
                  label="Contact Phone *"
                  placeholder="Enter phone number"
                  error={errors.emergency_contact_phone?.message}
                />
              )}
            />

            <Controller
              name="emergency_contact_relationship"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  label="Relationship *"
                  placeholder="e.g., Spouse, Parent"
                  error={errors.emergency_contact_relationship?.message}
                />
              )}
            />
          </div>
        </Card>

        {/* Address Information */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="address_line1"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  label="Address Line 1 *"
                  placeholder="Enter address"
                  error={errors.address_line1?.message}
                  className="md:col-span-2"
                />
              )}
            />

            <Controller
              name="address_line2"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  label="Address Line 2"
                  placeholder="Enter apartment, suite, etc."
                  error={errors.address_line2?.message}
                  className="md:col-span-2"
                />
              )}
            />

            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  label="City *"
                  placeholder="Enter city"
                  error={errors.city?.message}
                />
              )}
            />

            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  label="State *"
                  placeholder="Enter state (e.g., PA)"
                  maxLength={2}
                  error={errors.state?.message}
                />
              )}
            />

            <Controller
              name="postal_code"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  label="Postal Code *"
                  placeholder="Enter postal code"
                  error={errors.postal_code?.message}
                />
              )}
            />

            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  label="Country *"
                  placeholder="Enter country"
                  error={errors.country?.message}
                />
              )}
            />
          </div>
        </Card>

        {/* Personal Information */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="date_of_birth"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  {...field}
                  label="Date of Birth *"
                  error={errors.date_of_birth?.message}
                />
              )}
            />

            <Controller
              name="social_security_number"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => handleSSNChange(e.target.value, field.onChange)}
                  label="Social Security Number *"
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  error={errors.social_security_number?.message}
                />
              )}
            />

            <Controller
              name="driver_license_number"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  label="Driver License Number"
                  placeholder="Enter license number"
                  error={errors.driver_license_number?.message}
                />
              )}
            />

            <Controller
              name="driver_license_state"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  label="Driver License State"
                  placeholder="Enter state"
                  error={errors.driver_license_state?.message}
                />
              )}
            />

            <Controller
              name="driver_license_expiry"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  {...field}
                  label="Driver License Expiry"
                  error={errors.driver_license_expiry?.message}
                />
              )}
            />
          </div>
        </Card>

        {/* Qualifications & Certifications */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Qualifications & Certifications</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                onKeyPress={handleQualificationKeyPress}
                placeholder="Enter qualification or certification"
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={addQualification}
                disabled={!newQualification.trim()}
              >
                Add
              </Button>
            </div>
            {qualifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {qualifications.map((qual) => (
                  <span
                    key={qual}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {qual}
                    <button
                      type="button"
                      onClick={() => removeQualification(qual)}
                      className="text-purple-600 hover:text-purple-800"
                      aria-label={`Remove ${qual}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-500">
              Add qualifications, certifications, or specializations that can be used for filtering technicians.
            </p>
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
