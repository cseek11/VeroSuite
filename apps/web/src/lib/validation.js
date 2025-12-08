"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPhone = exports.isValidEmail = exports.isValidUUID = exports.getValidationErrorMessage = exports.fileUploadSchema = exports.searchSchema = exports.locationSchema = exports.accountSchema = exports.jobSchema = exports.userSchema = exports.loginSchema = void 0;
var zod_1 = require("zod");
// Login form validation
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    password: zod_1.z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});
// User form validation
exports.userSchema = zod_1.z.object({
    first_name: zod_1.z
        .string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters'),
    last_name: zod_1.z
        .string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters'),
    email: zod_1.z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    phone: zod_1.z
        .string()
        .optional()
        .refine(function (val) { return !val || /^\+?[\d\s\-\(\)]{10,}$/.test(val); }, {
        message: 'Invalid phone number format',
    }),
    roles: zod_1.z.array(zod_1.z.string()).min(1, 'At least one role is required'),
    status: zod_1.z.enum(['active', 'inactive']),
});
// Job form validation
exports.jobSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, 'Job title is required')
        .min(3, 'Job title must be at least 3 characters')
        .max(200, 'Job title must be less than 200 characters'),
    description: zod_1.z.string().optional(),
    scheduled_date: zod_1.z
        .string()
        .min(1, 'Scheduled date is required')
        .refine(function (val) { return !isNaN(Date.parse(val)); }, {
        message: 'Invalid date format',
    }),
    scheduled_start_time: zod_1.z.string().optional(),
    scheduled_end_time: zod_1.z.string().optional(),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']),
    technician_id: zod_1.z.string().uuid().optional(),
    location_id: zod_1.z.string().uuid().min(1, 'Location is required'),
    account_id: zod_1.z.string().uuid().min(1, 'Account is required'),
});
// Account form validation
exports.accountSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, 'Account name is required')
        .min(2, 'Account name must be at least 2 characters')
        .max(255, 'Account name must be less than 255 characters'),
    account_type: zod_1.z.enum(['residential', 'commercial', 'industrial']),
    phone: zod_1.z
        .string()
        .optional()
        .refine(function (val) { return !val || /^\+?[\d\s\-\(\)]{10,}$/.test(val); }, {
        message: 'Invalid phone number format',
    }),
    email: zod_1.z
        .string()
        .optional()
        .refine(function (val) { return !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); }, {
        message: 'Invalid email format',
    }),
    billing_address: zod_1.z.object({
        street: zod_1.z.string().min(1, 'Street address is required'),
        city: zod_1.z.string().min(1, 'City is required'),
        state: zod_1.z.string().min(1, 'State is required'),
        postal_code: zod_1.z.string().min(1, 'Postal code is required'),
        country: zod_1.z.string().default('US'),
    }).optional(),
});
// Location form validation
exports.locationSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, 'Location name is required')
        .min(2, 'Location name must be at least 2 characters')
        .max(255, 'Location name must be less than 255 characters'),
    address_line1: zod_1.z
        .string()
        .min(1, 'Address is required')
        .min(5, 'Address must be at least 5 characters'),
    address_line2: zod_1.z.string().optional(),
    city: zod_1.z
        .string()
        .min(1, 'City is required')
        .min(2, 'City must be at least 2 characters'),
    state: zod_1.z
        .string()
        .min(1, 'State is required')
        .min(2, 'State must be at least 2 characters'),
    postal_code: zod_1.z
        .string()
        .min(1, 'Postal code is required')
        .min(5, 'Postal code must be at least 5 characters'),
    country: zod_1.z.string().default('US'),
    latitude: zod_1.z.number().min(-90).max(90).optional(),
    longitude: zod_1.z.number().min(-180).max(180).optional(),
});
// Search validation
exports.searchSchema = zod_1.z.object({
    query: zod_1.z.string().min(1, 'Search query is required'),
    filters: zod_1.z.object({
        status: zod_1.z.enum(['all', 'active', 'inactive', 'completed']).optional(),
        date_from: zod_1.z.string().optional(),
        date_to: zod_1.z.string().optional(),
        technician_id: zod_1.z.string().uuid().optional(),
    }).optional(),
});
// File upload validation
exports.fileUploadSchema = zod_1.z.object({
    file: zod_1.z
        .instanceof(File)
        .refine(function (file) { return file.size <= 5 * 1024 * 1024; }, {
        message: 'File size must be less than 5MB',
    })
        .refine(function (file) { return ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type); }, {
        message: 'File type must be JPEG, PNG, GIF, or PDF',
    }),
    description: zod_1.z.string().optional(),
});
// Utility function to get validation error message
var getValidationErrorMessage = function (error) {
    return error.errors.map(function (err) { return err.message; }).join(', ');
};
exports.getValidationErrorMessage = getValidationErrorMessage;
// Utility function to validate UUID
var isValidUUID = function (uuid) {
    var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};
exports.isValidUUID = isValidUUID;
// Utility function to validate email
var isValidEmail = function (email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
// Utility function to validate phone number
var isValidPhone = function (phone) {
    var phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
};
exports.isValidPhone = isValidPhone;
