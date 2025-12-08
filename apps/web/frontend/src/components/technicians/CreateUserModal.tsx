import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { userApi, CreateUserDto } from '../../lib/user-api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useDialog } from '../../hooks/useDialog';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: any) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onUserCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert, DialogComponents } = useDialog();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserDto>();

  const onSubmit = async (data: CreateUserDto) => {
    setIsLoading(true);
    setError(null);

    try {
      // Remove password field if it's empty to avoid validation issues
      const userData: CreateUserDto = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        ...(data.phone ? { phone: data.phone } : {}),
        ...(data.password && data.password.trim() !== '' ? { password: data.password } : {}),
      };
      
      const result = await userApi.createUser(userData);
      
      // Display success message with employee ID if generated
      if (result.user.employee_id) {
        // Show success message with employee ID
        await showAlert({
          title: 'User Created Successfully',
          message: `User created successfully!\nEmployee ID: ${result.user.employee_id}`,
          type: 'success',
        });
      }
      
      onUserCreated(result.user);
      reset();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <DialogComponents />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <Input
              type="text"
              {...register('first_name', { required: 'First name is required' })}
              className="crm-input"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <Input
              type="text"
              {...register('last_name', { required: 'Last name is required' })}
              className="crm-input"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="crm-input"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              type="tel"
              {...register('phone')}
              className="crm-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temporary Password
            </label>
            <Input
              type="password"
              {...register('password')}
              placeholder="Leave blank for auto-generated"
              className="crm-input"
            />
            <p className="text-sm text-gray-500 mt-1">
              A temporary password will be generated if left blank
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default CreateUserModal;

