// ============================================================================
// CORE SYSTEM TYPES
// ============================================================================

export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  status: 'active' | 'inactive' | 'suspended';
  subscription_tier: 'basic' | 'premium' | 'enterprise';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  roles: string[];
  status: 'active' | 'inactive' | 'suspended';
  manager_id?: string;
  avatar_url?: string;
  tags?: string[];
  department?: string;
  position?: string;
  employee_id?: string;
  technician_number?: string;
  pesticide_license_number?: string;
  license_expiration_date?: string;
  hire_date?: string;
  employment_type?: 'full_time' | 'part_time' | 'contractor' | 'temporary';
  custom_permissions?: string[];
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
  social_security_number?: string; // Encrypted at rest
  driver_license_number?: string; // Encrypted at rest
  driver_license_state?: string;
  driver_license_expiry?: string;
  qualifications?: string[];
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CUSTOMER SEGMENTATION & SERVICE TYPES
// ============================================================================

export interface CustomerSegment {
  id: string;
  tenant_id: string;
  segment_name: string;
  segment_code: string;
  description?: string;
  default_service_types?: string[];
  pricing_tier: 'standard' | 'premium' | 'enterprise';
  compliance_requirements?: any;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  tenant_id: string;
  category_name: string;
  category_code: string;
  description?: string;
  applicable_segments?: string[];
  estimated_duration: number;
  base_price?: number;
  created_at: string;
}

export interface ServiceType {
  id: string;
  tenant_id: string;
  category_id?: string;
  service_name: string;
  service_code: string;
  description?: string;
  required_equipment?: string[];
  required_chemicals?: string[];
  safety_requirements?: any;
  compliance_requirements?: any;
  estimated_duration: number;
  base_price?: number;
  is_active: boolean;
  created_at: string;
  category?: ServiceCategory;
}

// ============================================================================
// ENHANCED CUSTOMER MANAGEMENT TYPES
// ============================================================================

export interface Account {
  id: string;
  tenant_id: string;
  name: string;
  account_type: 'residential' | 'commercial' | 'industrial' | 'healthcare' | 'property_management';
  status: 'active' | 'inactive' | 'suspended';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  billing_address?: any;
  payment_method?: string;
  billing_cycle?: string;
  property_type?: string;
  property_size?: string;
  access_instructions?: string;
  emergency_contact?: string;
  preferred_contact_method?: string;
  ar_balance: number;
  created_at: string;
  updated_at: string;
  
  // Enhanced relationships
  customer_profile?: CustomerProfile;
  customer_contacts?: CustomerContact[];
  locations?: Location[];
  payment_methods?: PaymentMethod[];
}

export interface CustomerProfile {
  id: string;
  tenant_id: string;
  account_id: string;
  segment_id?: string;
  
  // Business Information
  business_name?: string;
  business_type?: string;
  tax_id?: string;
  credit_limit?: number;
  credit_score?: number;
  credit_check_date?: string;
  
  // Property Information
  property_type?: string;
  property_size?: string;
  year_built?: number;
  square_footage?: number;
  
  // Access Information
  access_codes?: string;
  gate_codes?: string;
  key_locations?: string;
  special_instructions?: string;
  
  // Communication Preferences
  preferred_language: string;
  timezone: string;
  communication_methods?: any;
  
  // Contract Information
  contract_start_date?: string;
  contract_end_date?: string;
  contract_type?: string;
  contract_value?: number;
  auto_renew: boolean;
  cancellation_policy?: string;
  
  // Status Information
  account_status: 'active' | 'inactive' | 'suspended';
  payment_status: 'current' | 'past_due' | 'overdue' | 'collections';
  service_status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  
  created_at: string;
  updated_at: string;
  
  // Relationships
  segment?: CustomerSegment;
}

export interface CustomerContact {
  id: string;
  tenant_id: string;
  account_id: string;
  contact_type: 'primary' | 'secondary' | 'emergency' | 'billing';
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  position?: string;
  is_primary: boolean;
  is_emergency_contact: boolean;
  preferred_contact_method?: string;
  notes?: string;
  created_at: string;
}

export interface Location {
  id: string;
  tenant_id: string;
  account_id: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  service_area_id?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// SERVICE MANAGEMENT & SCHEDULING TYPES
// ============================================================================

export interface WorkOrder {
  id: string;
  tenant_id: string;
  customer_id: string;
  assigned_to?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled_date?: string;
  completion_date?: string;
  description: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Legacy fields
  account_id?: string;
  location_id?: string;
  service_type?: string;
  recurrence_rule?: string;
  estimated_duration?: number;
  service_price?: number;
  special_instructions?: string;
}

export interface Job {
  id: string;
  tenant_id: string;
  work_order_id: string;
  account_id: string;
  location_id: string;
  technician_id?: string;
  status: 'unassigned' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled_date: string;
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  completion_notes?: string;
  customer_signature?: string;
  photos: string[];
  chemicals_used: any[];
  created_at: string;
  updated_at: string;
}

export interface ServiceArea {
  id: string;
  tenant_id: string;
  area_name: string;
  area_code: string;
  description?: string;
  boundaries?: string;
  center_lat?: number;
  center_lng?: number;
  estimated_travel_time?: number;
  is_active: boolean;
  created_at: string;
}

export interface TechnicianSkill {
  id: string;
  tenant_id: string;
  technician_id: string;
  service_type_id: string;
  skill_level: 'basic' | 'intermediate' | 'expert';
  certification_required: boolean;
  certification_expiry?: string;
  training_completed_date?: string;
  is_active: boolean;
  created_at: string;
  
  // Relationships
  service_type?: ServiceType;
}

// ============================================================================
// FINANCIAL MANAGEMENT TYPES
// ============================================================================

export interface PricingTier {
  id: string;
  tenant_id: string;
  tier_name: string;
  tier_code: string;
  description?: string;
  base_multiplier: number;
  minimum_contract_value?: number;
  payment_terms: number;
  late_fee_percentage: number;
  created_at: string;
}

export interface ServicePricing {
  id: string;
  tenant_id: string;
  service_type_id: string;
  pricing_tier_id: string;
  base_price: number;
  hourly_rate?: number;
  minimum_charge?: number;
  travel_fee?: number;
  emergency_fee?: number;
  effective_date: string;
  expiry_date?: string;
  created_at: string;
  
  // Relationships
  service_type?: ServiceType;
  pricing_tier?: PricingTier;
}

export interface PaymentMethod {
  id: string;
  tenant_id: string;
  account_id: string;
  payment_type: 'credit_card' | 'debit_card' | 'ach' | 'check' | 'cash' | 'cod';
  payment_name?: string;
  account_number?: string;
  routing_number?: string;
  card_type?: string;
  card_last4?: string;
  card_expiry?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

// ============================================================================
// ANALYTICS & REPORTING TYPES
// ============================================================================

export interface CustomerAnalytics {
  id: string;
  tenant_id: string;
  account_id: string;
  metric_date: string;
  metric_type: 'lifetime_value' | 'service_frequency' | 'payment_history' | 'satisfaction_score';
  metric_value: number;
  metric_metadata?: any;
  calculated_at: string;
}

export interface ServiceAnalytics {
  id: string;
  tenant_id: string;
  service_type_id?: string;
  service_area_id?: string;
  technician_id?: string;
  metric_date: string;
  metric_type: 'completion_time' | 'customer_satisfaction' | 'efficiency' | 'revenue';
  metric_value: number;
  metric_metadata?: any;
  calculated_at: string;
  
  // Relationships
  service_type?: ServiceType;
  service_area?: ServiceArea;
  technician?: User;
}

// ============================================================================
// COMMUNICATION & MARKETING TYPES
// ============================================================================

export interface CommunicationTemplate {
  id: string;
  tenant_id: string;
  template_name: string;
  template_type: 'email' | 'sms' | 'letter' | 'notification';
  subject?: string;
  content: string;
  variables?: string[];
  applicable_segments?: string[];
  is_active: boolean;
  created_at: string;
}

export interface AutomatedCommunication {
  id: string;
  tenant_id: string;
  account_id: string;
  template_id?: string;
  trigger_type: 'service_reminder' | 'payment_reminder' | 'follow_up' | 'anniversary';
  trigger_conditions?: any;
  scheduled_date?: string;
  sent_date?: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  recipient_contact_id?: string;
  created_at: string;
  
  // Relationships
  template?: CommunicationTemplate;
  recipient_contact?: CustomerContact;
}

// ============================================================================
// COMPLIANCE & DOCUMENTATION TYPES
// ============================================================================

export interface ComplianceRequirement {
  id: string;
  tenant_id: string;
  requirement_name: string;
  requirement_type: 'epa' | 'fda' | 'usda' | 'state' | 'local';
  applicable_segments?: string[];
  applicable_service_types?: string[];
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  documentation_required: boolean;
  auto_reminder: boolean;
  reminder_days: number;
  is_active: boolean;
  created_at: string;
}

export interface ComplianceRecord {
  id: string;
  tenant_id: string;
  account_id: string;
  requirement_id: string;
  service_id?: string;
  status: 'pending' | 'completed' | 'overdue' | 'waived';
  due_date: string;
  completion_date?: string;
  completed_by?: string;
  documentation_url?: string;
  notes?: string;
  created_at: string;
  
  // Relationships
  requirement?: ComplianceRequirement;
  completed_by_user?: User;
}

// ============================================================================
// LEGACY TYPES (for backward compatibility)
// ============================================================================

export interface ServiceHistory {
  id: string;
  tenant_id: string;
  customer_id: string;
  service_date: string;
  service_type: string;
  treatments_applied?: string;
  technician_id?: string;
  technician_notes?: string;
  before_photos?: any;
  after_photos?: any;
  cost: number;
  status: 'completed' | 'cancelled' | 'rescheduled';
  created_at: string;
}

export interface ContractsSubscription {
  id: string;
  tenant_id: string;
  customer_id: string;
  contract_type: string;
  service_frequency: string;
  start_date: string;
  end_date?: string;
  auto_renewal: boolean;
  contract_value: number;
  payment_schedule?: string;
  terms_conditions?: string;
  signed_date?: string;
  status: 'active' | 'expired' | 'cancelled';
  created_at: string;
}

export interface CommunicationLog {
  id: string;
  tenant_id: string;
  customer_id: string;
  communication_type: string;
  direction: 'inbound' | 'outbound';
  subject?: string;
  message_content?: string;
  staff_member?: string;
  timestamp: string;
  follow_up_required: boolean;
  follow_up_date?: string;
}

export interface CustomerNote {
  id: string;
  tenant_id: string;
  customer_id: string;
  note_type: string;
  note_source: string;
  note_content: string;
  created_by: string;
  created_at: string;
  priority: 'low' | 'medium' | 'high';
  is_alert: boolean;
  is_internal: boolean;
  technician_id?: string;
  work_order_id?: string;
  location_coords?: string;
}

export interface PestActivityTracking {
  id: string;
  tenant_id: string;
  customer_id: string;
  pest_type: string;
  severity_level: number;
  location_on_property?: string;
  weather_conditions?: string;
  temperature?: number;
  humidity?: number;
  season?: string;
  treatment_applied?: string;
  effectiveness_score?: number;
  recorded_by?: string;
  recorded_at: string;
  gps_coordinates?: string;
  photo_evidence_ids?: any;
}

export interface ComplianceTracking {
  id: string;
  tenant_id: string;
  customer_id: string;
  compliance_type: string;
  requirement: string;
  due_date: string;
  completion_date?: string;
  status: 'pending' | 'completed' | 'overdue';
  assigned_to?: string;
  notes?: string;
  documentation_url?: string;
}

export interface TechnicianCertification {
  id: string;
  tenant_id: string;
  technician_id: string;
  certification_type: string;
  issuing_authority: string;
  issue_date: string;
  expiration_date: string;
  status: 'active' | 'expired' | 'suspended';
  renewal_reminder_sent: boolean;
  created_at: string;
}

export interface ChemicalUsageLog {
  id: string;
  tenant_id: string;
  customer_id: string;
  service_id?: string;
  chemical_name: string;
  epa_number?: string;
  application_rate?: number;
  total_amount_used?: number;
  application_method?: string;
  target_pest?: string;
  technician_id?: string;
  application_date: string;
  weather_conditions?: string;
  safety_precautions?: string;
}

export interface CustomerPhoto {
  id: string;
  tenant_id: string;
  customer_id: string;
  photo_type: string;
  photo_category: string;
  file_url: string;
  thumbnail_url?: string;
  file_size?: number;
  taken_by?: string;
  taken_at: string;
  work_order_id?: string;
  location_coords?: string;
  description?: string;
  is_before_photo: boolean;
  is_customer_facing: boolean;
  pest_type?: string;
  treatment_area?: string;
}

export interface BusinessAnalytics {
  id: string;
  tenant_id: string;
  customer_id: string;
  metric_type: string;
  metric_value: number;
  calculated_date: string;
  factors?: any;
  prediction_confidence?: number;
  next_review_date?: string;
}

export interface CustomerDocument {
  id: string;
  tenant_id: string;
  customer_id: string;
  document_type: string;
  document_name: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  uploaded_by?: string;
  uploaded_at: string;
  document_date?: string;
}

// ============================================================================
// SYSTEM CONFIGURATION TYPES
// ============================================================================

export interface TenantBranding {
  id: string;
  tenant_id: string;
  theme_json: any;
  logo_url?: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  tenant_id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  before_state?: any;
  after_state?: any;
  request_id: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchFilters {
  search?: string;
  segmentId?: string;
  status?: string;
  date?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface CustomerFormData {
  // Account fields
  name: string;
  account_type: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  
  // Profile fields
  business_name?: string;
  business_type?: string;
  property_type?: string;
  property_size?: string;
  segment_id?: string;
  
  // Contact fields
  contacts?: CustomerContactFormData[];
}

export interface CustomerContactFormData {
  contact_type: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  position?: string;
  is_primary: boolean;
  is_emergency_contact: boolean;
  preferred_contact_method?: string;
  notes?: string;
}

export interface ServiceTypeFormData {
  category_id?: string;
  service_name: string;
  service_code: string;
  description?: string;
  estimated_duration: number;
  base_price?: number;
  required_equipment?: string[];
  required_chemicals?: string[];
  safety_requirements?: any;
  compliance_requirements?: any;
}

export interface PricingFormData {
  service_type_id: string;
  pricing_tier_id: string;
  base_price: number;
  hourly_rate?: number;
  minimum_charge?: number;
  travel_fee?: number;
  emergency_fee?: number;
  effective_date: string;
  expiry_date?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type CustomerSegmentType = 'residential' | 'commercial' | 'industrial' | 'property_management' | 'healthcare';
export type ServiceCategoryType = 'general_pest' | 'termite' | 'bed_bugs' | 'rodent' | 'compliance';
export type AccountStatusType = 'active' | 'inactive' | 'suspended';
export type PaymentStatusType = 'current' | 'past_due' | 'overdue' | 'collections';
export type ServiceStatusType = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type PriorityType = 'low' | 'medium' | 'high' | 'urgent';
export type ContactType = 'primary' | 'secondary' | 'emergency' | 'billing';
export type PaymentMethodType = 'credit_card' | 'ach' | 'check' | 'cash' | 'cod';
export type CommunicationType = 'email' | 'sms' | 'letter' | 'notification';
export type ComplianceType = 'epa' | 'fda' | 'usda' | 'state' | 'local';
export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
export type SkillLevelType = 'basic' | 'intermediate' | 'expert';

// ============================================================================
// BILLING & PAYMENT TYPES
// ============================================================================

export interface Invoice {
  id: string;
  tenant_id: string;
  account_id: string;
  service_agreement_id?: string;
  work_order_id?: string;
  job_id?: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  InvoiceItem: InvoiceItem[];
  accounts?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  Payment?: Payment[];
}

export interface InvoiceItem {
  id: string;
  service_type_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Payment {
  id: string;
  tenant_id: string;
  invoice_id: string;
  payment_method_id: string;
  amount: number;
  payment_date: string;
  reference_number?: string;
  notes?: string;
  created_at: string;
  created_by: string;
  payment_methods: PaymentMethod;
  Invoice: {
    id: string;
    invoice_number: string;
    total_amount: number;
    status: string;
  };
}

// Duplicate PaymentMethod interface removed - already defined earlier with all properties

// Billing DTOs for API requests
export interface CreateInvoiceDto {
  account_id: string;
  service_agreement_id?: string;
  work_order_id?: string;
  job_id?: string;
  invoice_number?: string;
  issue_date: string;
  due_date: string;
  notes?: string;
  items: CreateInvoiceItemDto[];
}

export interface CreateInvoiceItemDto {
  service_type_id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export interface UpdateInvoiceDto {
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date?: string;
  due_date?: string;
  notes?: string;
}

export interface CreatePaymentDto {
  invoice_id: string;
  payment_method_id: string;
  amount: number;
  payment_date: string;
  reference_number?: string;
  notes?: string;
}

export interface CreatePaymentMethodDto {
  account_id: string;
  payment_type: 'credit_card' | 'debit_card' | 'ach' | 'check' | 'cash' | 'cod';
  payment_name?: string;
  account_number?: string;
  routing_number?: string;
  card_type?: string;
  card_last4?: string;
  card_expiry?: string;
  is_default?: boolean;
  is_active?: boolean;
}

// Billing Analytics Types
export interface BillingAnalytics {
  totalRevenue: number;
  outstandingAmount: number;
  paidAmount: number;
  totalInvoices: number;
  overdueInvoices: number;
  averagePaymentTime: number;
}

export interface RevenueAnalytics {
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
  totalRevenue: number;
  growthRate: number;
}

export interface ARInvoice {
  id: string;
  invoice_number: string;
  daysPastDue: number;
  total_amount: number;
  status: string;
  due_date: string;
}

export interface CustomerAR {
  customerId: string;
  customerName: string;
  totalAR: number;
  invoices: ARInvoice[];
}

export interface AgingBucket {
  bucket: string;
  amount: number;
  invoiceCount: number;
}

export interface ARSummary {
  totalAR: number;
  agingBuckets: AgingBucket[];
  customerAR: CustomerAR[];
  totalCustomers: number;
  totalInvoices: number;
}

// ============================================================================ 
// KPI TEMPLATES TYPES (Re-exported from kpi-templates.ts)
// ============================================================================

export * from '@/types/kpi-templates';


