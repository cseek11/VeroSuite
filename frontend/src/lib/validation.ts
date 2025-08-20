import { z } from 'zod';

// Login form validation
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  tenantId: z
    .string()
    .min(1, 'Tenant ID is required')
    .uuid('Invalid tenant ID format'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// User form validation
export const userSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s\-\(\)]{10,}$/.test(val), {
      message: 'Invalid phone number format',
    }),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
  status: z.enum(['active', 'inactive']),
});

export type UserFormData = z.infer<typeof userSchema>;

// Job form validation
export const jobSchema = z.object({
  title: z
    .string()
    .min(1, 'Job title is required')
    .min(3, 'Job title must be at least 3 characters')
    .max(200, 'Job title must be less than 200 characters'),
  description: z.string().optional(),
  scheduled_date: z
    .string()
    .min(1, 'Scheduled date is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  scheduled_start_time: z.string().optional(),
  scheduled_end_time: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  technician_id: z.string().uuid().optional(),
  location_id: z.string().uuid().min(1, 'Location is required'),
  account_id: z.string().uuid().min(1, 'Account is required'),
});

export type JobFormData = z.infer<typeof jobSchema>;

// Account form validation
export const accountSchema = z.object({
  name: z
    .string()
    .min(1, 'Account name is required')
    .min(2, 'Account name must be at least 2 characters')
    .max(255, 'Account name must be less than 255 characters'),
  account_type: z.enum(['residential', 'commercial', 'industrial']),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s\-\(\)]{10,}$/.test(val), {
      message: 'Invalid phone number format',
    }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Invalid email format',
    }),
  billing_address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postal_code: z.string().min(1, 'Postal code is required'),
    country: z.string().default('US'),
  }).optional(),
});

export type AccountFormData = z.infer<typeof accountSchema>;

// Location form validation
export const locationSchema = z.object({
  name: z
    .string()
    .min(1, 'Location name is required')
    .min(2, 'Location name must be at least 2 characters')
    .max(255, 'Location name must be less than 255 characters'),
  address_line1: z
    .string()
    .min(1, 'Address is required')
    .min(5, 'Address must be at least 5 characters'),
  address_line2: z.string().optional(),
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters'),
  state: z
    .string()
    .min(1, 'State is required')
    .min(2, 'State must be at least 2 characters'),
  postal_code: z
    .string()
    .min(1, 'Postal code is required')
    .min(5, 'Postal code must be at least 5 characters'),
  country: z.string().default('US'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export type LocationFormData = z.infer<typeof locationSchema>;

// Search validation
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  filters: z.object({
    status: z.enum(['all', 'active', 'inactive', 'completed']).optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
    technician_id: z.string().uuid().optional(),
  }).optional(),
});

export type SearchFormData = z.infer<typeof searchSchema>;

// File upload validation
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size must be less than 5MB',
    })
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type),
      {
        message: 'File type must be JPEG, PNG, GIF, or PDF',
      }
    ),
  description: z.string().optional(),
});

export type FileUploadData = z.infer<typeof fileUploadSchema>;

// Utility function to get validation error message
export const getValidationErrorMessage = (error: z.ZodError): string => {
  return error.errors.map((err) => err.message).join(', ');
};

// Utility function to validate UUID
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Utility function to validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility function to validate phone number
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};
