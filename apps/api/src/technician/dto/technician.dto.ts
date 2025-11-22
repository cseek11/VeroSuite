export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACTOR = 'contractor',
  TEMPORARY = 'temporary'
}

export enum PayrollEmploymentType {
  HOURLY = 'hourly',
  SALARY = 'salary',
  COMMISSION = 'commission',
  CONTRACT = 'contract'
}

export enum TechnicianStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TERMINATED = 'terminated',
  ON_LEAVE = 'on_leave'
}

export enum DocumentType {
  LICENSE = 'license',
  CERTIFICATION = 'certification',
  INSURANCE = 'insurance',
  TRAINING = 'training',
  BACKGROUND_CHECK = 'background_check',
  DRUG_TEST = 'drug_test',
  SAFETY_TRAINING = 'safety_training',
  OTHER = 'other'
}

// ===== TECHNICIAN PROFILE DTOs =====

export interface CreateTechnicianProfileDto {
  user_id: string;
  employee_id?: string;
  hire_date: string;
  position?: string;
  department?: string;
  employment_type?: EmploymentType;
  status?: TechnicianStatus;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  date_of_birth?: string;
  social_security_number?: string;
  driver_license_number?: string;
  driver_license_state?: string;
  driver_license_expiry?: string;
}

export interface UpdateTechnicianProfileDto {
  employee_id?: string;
  hire_date?: string;
  position?: string;
  department?: string;
  employment_type?: EmploymentType;
  status?: TechnicianStatus;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  date_of_birth?: string;
  social_security_number?: string;
  driver_license_number?: string;
  driver_license_state?: string;
  driver_license_expiry?: string;
}

// ===== QUERY DTOs =====

export interface TechnicianQueryDto {
  search?: string;
  status?: TechnicianStatus;
  department?: string;
  position?: string;
  employment_type?: EmploymentType;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// ===== RESPONSE DTOs =====

export interface TechnicianProfileResponseDto {
  id: string;
  user_id: string;
  employee_id?: string;
  hire_date: string;
  position?: string;
  department?: string;
  employment_type: EmploymentType;
  status: TechnicianStatus;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
  date_of_birth?: string;
  social_security_number?: string;
  driver_license_number?: string;
  driver_license_state?: string;
  driver_license_expiry?: string;
  created_at: string;
  updated_at: string;
  
  // User information
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    technician_number?: string;
    pesticide_license_number?: string;
    license_expiration_date?: string;
  };
}

export interface TechnicianListResponseDto {
  technicians: TechnicianProfileResponseDto[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}