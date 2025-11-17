import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/user-api';
import { User } from '@/types/enhanced-types';
import { PREDEFINED_ROLES } from '@/types/role-actions';
import { useAuthStore } from '@/stores/auth';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { ArrowLeft, ChevronDown, ChevronUp, User as UserIcon, Phone, MapPin, Calendar, Shield, Key, X } from 'lucide-react';
import { logger } from '@/utils/logger';

// Expanded form schema with all employee fields
const userFormSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  employee_id: z.string().optional(),
  hire_date: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  employment_type: z.enum(['full_time', 'part_time', 'contractor', 'temporary']).optional(),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
  custom_permissions: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional().refine((val) => !val || val.length === 2, 'State must be 2 characters'),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  date_of_birth: z.string().optional(),
  social_security_number: z.string().optional().refine(
    (val) => !val || /^\d{3}-\d{2}-\d{4}$/.test(val),
    'SSN must be in format XXX-XX-XXXX'
  ),
  driver_license_number: z.string().optional(),
  driver_license_state: z.string().optional().refine((val) => !val || val.length === 2, 'State must be 2 characters'),
  driver_license_expiry: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  technician_number: z.string().optional(),
  pesticide_license_number: z.string().optional(),
  license_expiration_date: z.string().optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserManagementFormProps {
  user?: User;
  onSave: () => void;
  onCancel: () => void;
}

// Resources and actions for permission matrix
const RESOURCES = ['jobs', 'work_orders', 'customers', 'technicians', 'invoices', 'reports', 'settings', 'users', 'inventory', 'financial'];
const ACTIONS = ['view', 'create', 'update', 'delete', 'assign', 'approve', 'export', 'import', 'manage'];

export function UserManagementForm({ user, onSave, onCancel }: UserManagementFormProps) {
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));
  const [newQualification, setNewQualification] = useState('');
  const [customPermissions, setCustomPermissions] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();
  const isEditMode = !!user;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
      employee_id: user?.employee_id || '',
      hire_date: user?.hire_date ? user.hire_date.split('T')[0] : '',
      position: user?.position || '',
      department: user?.department || '',
      employment_type: (user?.employment_type as any) || 'full_time',
      roles: user?.roles || ['technician'],
      custom_permissions: user?.custom_permissions || [],
      status: (user?.status as 'active' | 'inactive' | 'suspended') || 'active',
      emergency_contact_name: user?.emergency_contact_name || '',
      emergency_contact_phone: user?.emergency_contact_phone || '',
      emergency_contact_relationship: user?.emergency_contact_relationship || '',
      address_line1: user?.address_line1 || '',
      address_line2: user?.address_line2 || '',
      city: user?.city || '',
      state: user?.state || '',
      postal_code: user?.postal_code || '',
      country: user?.country || 'US',
      date_of_birth: user?.date_of_birth ? user.date_of_birth.split('T')[0] : '',
      social_security_number: '', // Never pre-fill SSN for security
      driver_license_number: '', // Never pre-fill for security
      driver_license_state: user?.driver_license_state || '',
      driver_license_expiry: user?.driver_license_expiry ? user.driver_license_expiry.split('T')[0] : '',
      qualifications: user?.qualifications || [],
      technician_number: user?.technician_number || '',
      pesticide_license_number: user?.pesticide_license_number || '',
      license_expiration_date: user?.license_expiration_date ? user.license_expiration_date.split('T')[0] : '',
    },
  });

  // Initialize custom permissions from user
  useEffect(() => {
    if (user?.custom_permissions) {
      setCustomPermissions(new Set(user.custom_permissions));
    }
  }, [user]);

  // Update form when user prop changes
  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || '',
        employee_id: user.employee_id || '',
        hire_date: user.hire_date ? user.hire_date.split('T')[0] : '',
        position: user.position || '',
        department: user.department || '',
        employment_type: (user.employment_type as any) || 'full_time',
        roles: user.roles || ['technician'],
        custom_permissions: user.custom_permissions || [],
        status: (user.status as 'active' | 'inactive' | 'suspended') || 'active',
        emergency_contact_name: user.emergency_contact_name || '',
        emergency_contact_phone: user.emergency_contact_phone || '',
        emergency_contact_relationship: user.emergency_contact_relationship || '',
        address_line1: user.address_line1 || '',
        address_line2: user.address_line2 || '',
        city: user.city || '',
        state: user.state || '',
        postal_code: user.postal_code || '',
        country: user.country || 'US',
        date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
        social_security_number: '',
        driver_license_number: '',
        driver_license_state: user.driver_license_state || '',
        driver_license_expiry: user.driver_license_expiry ? user.driver_license_expiry.split('T')[0] : '',
        qualifications: user.qualifications || [],
        technician_number: user.technician_number || '',
        pesticide_license_number: user.pesticide_license_number || '',
        license_expiration_date: user.license_expiration_date ? user.license_expiration_date.split('T')[0] : '',
      });
    }
  }, [user, reset]);

  const selectedRoles = watch('roles') || [];
  const qualifications = watch('qualifications') || [];

  // Get permissions from selected roles
  const getRolePermissions = () => {
    const permissions = new Set<string>();
    selectedRoles.forEach(roleId => {
      const role = PREDEFINED_ROLES.find(r => r.id === roleId);
      if (role) {
        role.permissions.forEach(perm => {
          if (perm.resource === '*' && perm.action === '*') {
            // Admin has all permissions
            RESOURCES.forEach(resource => {
              ACTIONS.forEach(action => {
                permissions.add(`${resource}:${action}`);
              });
            });
          } else {
            permissions.add(`${perm.resource}:${perm.action}`);
          }
        });
      }
    });
    return permissions;
  };

  const rolePermissions = getRolePermissions();
  const allPermissions = new Set([...rolePermissions, ...customPermissions]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const addQualification = () => {
    if (newQualification.trim()) {
      const current = qualifications || [];
      setValue('qualifications', [...current, newQualification.trim()]);
      setNewQualification('');
    }
  };

  const removeQualification = (qual: string) => {
    const current = qualifications || [];
    setValue('qualifications', current.filter(q => q !== qual));
  };

  const togglePermission = (resource: string, action: string) => {
    const perm = `${resource}:${action}`;
    const next = new Set(customPermissions);
    if (next.has(perm)) {
      next.delete(perm);
    } else {
      next.add(perm);
    }
    setCustomPermissions(next);
    setValue('custom_permissions', Array.from(next));
  };

  const hasPermission = (resource: string, action: string) => {
    const perm = `${resource}:${action}`;
    return allPermissions.has(perm);
  };

  const isRolePermission = (resource: string, action: string) => {
    const perm = `${resource}:${action}`;
    return rolePermissions.has(perm);
  };

  const createUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      return await userApi.createUser(data as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setStatus({ type: 'success', message: 'User created successfully!' });
      setTimeout(() => {
        onSave();
      }, 1000);
    },
    onError: (error: Error) => {
      logger.error('Error creating user', error, 'UserManagementForm');
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to create user' 
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      if (!user?.id) throw new Error('User ID is required');
      
      // Remove email from update data (email should not be changed)
      // Also remove empty strings and convert them to undefined for optional fields
      const updateData: any = { ...data };
      delete updateData.email;
      
      // Convert empty strings to undefined for optional fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '' || updateData[key] === null) {
          updateData[key] = undefined;
        }
      });
      
      return await userApi.updateUser(user.id, updateData);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
      
      // If the updated user is the currently logged-in user, refresh their auth data and token
      const currentUser = useAuthStore.getState().user;
      if (currentUser && currentUser.id === user.id) {
        try {
          await useAuthStore.getState().refreshUser();
          // Get the updated user data after refresh
          const refreshedUser = useAuthStore.getState().user;
          logger.debug('Refreshed current user data and token after update', { 
            userId: user.id,
            roles: refreshedUser?.roles,
            permissionsCount: refreshedUser?.permissions?.length || 0,
            permissions: refreshedUser?.permissions 
          }, 'UserManagementForm');
        } catch (error) {
          logger.error('Error refreshing user after update', error, 'UserManagementForm');
        }
      }
      
      setStatus({ type: 'success', message: 'User updated successfully!' });
      setTimeout(() => {
        onSave();
      }, 1000);
    },
    onError: (error: Error) => {
      logger.error('Error updating user', error, 'UserManagementForm');
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to update user' 
      });
    },
  });

  const handleFormSubmit = async (data: UserFormData) => {
    setStatus(null);
    
    try {
      if (isEditMode) {
        await updateUserMutation.mutateAsync(data);
      } else {
        await createUserMutation.mutateAsync(data);
      }
    } catch (error) {
      // Error handling is done in mutation callbacks
    }
  };

  const SectionHeader = ({ id, title, icon: Icon }: { id: string; title: string; icon: any }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      {expandedSections.has(id) ? (
        <ChevronUp className="h-5 w-5 text-gray-500" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-500" />
      )}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditMode ? 'Edit User' : 'Create New User'}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-6 space-y-6">
          {/* Basic Information */}
          <div>
            <SectionHeader id="basic" title="Basic Information" icon={UserIcon} />
            {expandedSections.has('basic') && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="First Name *"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="John"
                      required
                      {...(errors.first_name?.message ? { error: errors.first_name.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Last Name *"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Doe"
                      required
                      {...(errors.last_name?.message ? { error: errors.last_name.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Email *"
                      type="email"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="user@example.com"
                      required
                      disabled={isEditMode}
                      {...(errors.email?.message ? { error: errors.email.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Phone"
                      type="tel"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="(555) 123-4567"
                      {...(errors.phone?.message ? { error: errors.phone.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="employee_id"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Employee ID"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="EMP001"
                      {...(errors.employee_id?.message ? { error: errors.employee_id.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="hire_date"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Hire Date"
                      type="date"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      {...(errors.hire_date?.message ? { error: errors.hire_date.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Position"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Senior Technician"
                      {...(errors.position?.message ? { error: errors.position.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Department"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Field Operations"
                      {...(errors.department?.message ? { error: errors.department.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="employment_type"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                      <Select
                        value={field.value || 'full_time'}
                        onChange={(value) => field.onChange(value)}
                        options={[
                          { value: 'full_time', label: 'Full Time' },
                          { value: 'part_time', label: 'Part Time' },
                          { value: 'contractor', label: 'Contractor' },
                          { value: 'temporary', label: 'Temporary' },
                        ]}
                        {...(errors.employment_type?.message ? { error: errors.employment_type.message } : {})}
                      />
                    </div>
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value as 'active' | 'inactive' | 'suspended')}
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'inactive', label: 'Inactive' },
                          { value: 'suspended', label: 'Suspended' },
                        ]}
                        {...(errors.status?.message ? { error: errors.status.message } : {})}
                      />
                    </div>
                  )}
                />
              </div>
            )}
          </div>

          {/* Emergency Contact */}
          <div>
            <SectionHeader id="emergency" title="Emergency Contact" icon={Phone} />
            {expandedSections.has('emergency') && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Controller
                  name="emergency_contact_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Contact Name"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Jane Doe"
                      {...(errors.emergency_contact_name?.message ? { error: errors.emergency_contact_name.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="emergency_contact_phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Contact Phone"
                      type="tel"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="(555) 123-4567"
                      {...(errors.emergency_contact_phone?.message ? { error: errors.emergency_contact_phone.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="emergency_contact_relationship"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Relationship"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Spouse, Parent, etc."
                      {...(errors.emergency_contact_relationship?.message ? { error: errors.emergency_contact_relationship.message } : {})}
                    />
                  )}
                />
              </div>
            )}
          </div>

          {/* Address Information */}
          <div>
            <SectionHeader id="address" title="Address Information" icon={MapPin} />
            {expandedSections.has('address') && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="address_line1"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Address Line 1"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="123 Main St"
                      className="md:col-span-2"
                      {...(errors.address_line1?.message ? { error: errors.address_line1.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="address_line2"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Address Line 2"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Apt 4B"
                      className="md:col-span-2"
                      {...(errors.address_line2?.message ? { error: errors.address_line2.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="City"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Pittsburgh"
                      {...(errors.city?.message ? { error: errors.city.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="State"
                      value={field.value?.toUpperCase()}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase().slice(0, 2))}
                      placeholder="PA"
                      maxLength={2}
                      {...(errors.state?.message ? { error: errors.state.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="postal_code"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Postal Code"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="15213"
                      {...(errors.postal_code?.message ? { error: errors.postal_code.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Country"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="US"
                      {...(errors.country?.message ? { error: errors.country.message } : {})}
                    />
                  )}
                />
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div>
            <SectionHeader id="personal" title="Personal Information" icon={Calendar} />
            {expandedSections.has('personal') && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="date_of_birth"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      {...(errors.date_of_birth?.message ? { error: errors.date_of_birth.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="social_security_number"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Social Security Number"
                      type="text"
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        let formatted = value;
                        if (value.length > 3) formatted = value.slice(0, 3) + '-' + value.slice(3);
                        if (value.length > 5) formatted = formatted.slice(0, 6) + '-' + value.slice(5, 9);
                        field.onChange(formatted);
                      }}
                      placeholder="XXX-XX-XXXX"
                      maxLength={11}
                      {...(errors.social_security_number?.message ? { error: errors.social_security_number.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="driver_license_number"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Driver License Number"
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="D1234567"
                      {...(errors.driver_license_number?.message ? { error: errors.driver_license_number.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="driver_license_state"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Driver License State"
                      value={field.value?.toUpperCase()}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase().slice(0, 2))}
                      placeholder="PA"
                      maxLength={2}
                      {...(errors.driver_license_state?.message ? { error: errors.driver_license_state.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="driver_license_expiry"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Driver License Expiry"
                      type="date"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      {...(errors.driver_license_expiry?.message ? { error: errors.driver_license_expiry.message } : {})}
                    />
                  )}
                />
              </div>
            )}
          </div>

          {/* Qualifications */}
          <div>
            <SectionHeader id="qualifications" title="Qualifications & Certifications" icon={Key} />
            {expandedSections.has('qualifications') && (
              <div className="mt-4 space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newQualification}
                    onChange={(e) => setNewQualification(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addQualification();
                      }
                    }}
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
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <Controller
                  name="technician_number"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Technician Number"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="TECH001"
                      {...(errors.technician_number?.message ? { error: errors.technician_number.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="pesticide_license_number"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Pesticide License Number"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="LIC123456"
                      {...(errors.pesticide_license_number?.message ? { error: errors.pesticide_license_number.message } : {})}
                    />
                  )}
                />
                <Controller
                  name="license_expiration_date"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="License Expiration Date"
                      type="date"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      {...(errors.license_expiration_date?.message ? { error: errors.license_expiration_date.message } : {})}
                    />
                  )}
                />
              </div>
            )}
          </div>

          {/* Roles & Permissions */}
          <div>
            <SectionHeader id="roles" title="Roles & Permissions" icon={Shield} />
            {expandedSections.has('roles') && (
              <div className="mt-4 space-y-6">
                {/* Multi-Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Roles <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PREDEFINED_ROLES.map((role) => (
                      <label
                        key={role.id}
                        className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(role.id)}
                          onChange={(e) => {
                            const current = selectedRoles || [];
                            if (e.target.checked) {
                              setValue('roles', [...current, role.id]);
                            } else {
                              setValue('roles', current.filter(r => r !== role.id));
                            }
                          }}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{role.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.roles && (
                    <p className="mt-1 text-sm text-red-600">{errors.roles.message}</p>
                  )}
                </div>

                {/* Permission Matrix */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Custom Permissions
                    <span className="text-xs text-gray-500 ml-2">
                      (Grayed out permissions are inherited from roles)
                    </span>
                  </label>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left py-2 px-3 font-medium text-gray-700 sticky left-0 bg-gray-50 z-10">
                            Resource
                          </th>
                          {ACTIONS.map(action => (
                            <th key={action} className="text-center py-2 px-2 font-medium text-gray-700 capitalize">
                              {action}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {RESOURCES.map(resource => (
                          <tr key={resource} className="border-t border-gray-200">
                            <td className="py-2 px-3 font-medium text-gray-900 capitalize sticky left-0 bg-white z-10">
                              {resource.replace('_', ' ')}
                            </td>
                            {ACTIONS.map(action => {
                              const hasPerm = hasPermission(resource, action);
                              const isRolePerm = isRolePermission(resource, action);
                              return (
                                <td key={action} className="py-2 px-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => togglePermission(resource, action)}
                                    disabled={isRolePerm}
                                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                                      hasPerm
                                        ? isRolePerm
                                          ? 'bg-gray-200 border-gray-400 text-gray-600 cursor-not-allowed'
                                          : 'bg-green-100 border-green-500 text-green-700 hover:bg-green-200'
                                        : 'bg-gray-100 border-gray-300 text-gray-400 hover:border-gray-400'
                                    }`}
                                    title={isRolePerm ? 'Inherited from role' : hasPerm ? 'Custom permission' : 'No permission'}
                                  >
                                    {hasPerm && <span className="text-xs">✓</span>}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {status && (
            <div className={`p-3 rounded-lg text-sm ${
              status.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {status.message}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
              loading={createUserMutation.isPending || updateUserMutation.isPending}
            >
              {isEditMode 
                ? (updateUserMutation.isPending ? 'Updating...' : 'Update User')
                : (createUserMutation.isPending ? 'Creating...' : 'Create User')
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
