import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper function to get tenant context
async function getTenantContext() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('User not authenticated');
  
  let tenantId = user.user_metadata?.tenant_id;
  console.log('Tenant context - User metadata tenant_id:', tenantId);
  
  if (!tenantId) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', user.id)
      .single();
    
    console.log('Tenant context - Users table lookup:', { userData, userError });
    
    if (userError) {
      // Fallback tenant ID for development
      tenantId = '582db3a5-40bf-4bf4-8257-bee1ef3c3f0d';
      console.log('Tenant context - Using fallback tenant ID:', tenantId);
    } else {
      tenantId = userData.tenant_id;
      console.log('Tenant context - Using users table tenant ID:', tenantId);
    }
  }
  
  console.log('Tenant context - Final tenant ID:', tenantId);
  return { tenantId, user };
}

// ============================================================================
// CUSTOMER SEGMENTATION & SERVICE TYPES API
// ============================================================================

export const customerSegmentsApi = {
  // Get all customer segments for tenant
  getAll: async () => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('customer_segments')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('segment_name');
    
    if (error) throw error;
    return data;
  },

  // Get customer segment by ID
  getById: async (segmentId: string) => {
    const { data, error } = await supabase
      .from('customer_segments')
      .select('*')
      .eq('id', segmentId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new customer segment
  create: async (segmentData: any) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('customer_segments')
      .insert({ ...segmentData, tenant_id: tenantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update customer segment
  update: async (segmentId: string, updates: any) => {
    const { data, error } = await supabase
      .from('customer_segments')
      .update(updates)
      .eq('id', segmentId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete customer segment
  delete: async (segmentId: string) => {
    const { error } = await supabase
      .from('customer_segments')
      .delete()
      .eq('id', segmentId);
    
    if (error) throw error;
    return { success: true };
  }
};

export const serviceCategoriesApi = {
  // Get all service categories for tenant
  getAll: async () => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('category_name');
    
    if (error) throw error;
    return data;
  },

  // Get service category by ID
  getById: async (categoryId: string) => {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('id', categoryId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new service category
  create: async (categoryData: any) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('service_categories')
      .insert({ ...categoryData, tenant_id: tenantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update service category
  update: async (categoryId: string, updates: any) => {
    const { data, error } = await supabase
      .from('service_categories')
      .update(updates)
      .eq('id', categoryId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete service category
  delete: async (categoryId: string) => {
    const { error } = await supabase
      .from('service_categories')
      .delete()
      .eq('id', categoryId);
    
    if (error) throw error;
    return { success: true };
  }
};

export const serviceTypesApi = {
  // Get all service types for tenant
  getAll: async () => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('service_types')
      .select(`
        *,
        category:service_categories(category_name, category_code)
      `)
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('service_name');
    
    if (error) throw error;
    return data;
  },

  // Get service type by ID
  getById: async (serviceTypeId: string) => {
    const { data, error } = await supabase
      .from('service_types')
      .select(`
        *,
        category:service_categories(category_name, category_code)
      `)
      .eq('id', serviceTypeId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new service type
  create: async (serviceTypeData: any) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('service_types')
      .insert({ ...serviceTypeData, tenant_id: tenantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update service type
  update: async (serviceTypeId: string, updates: any) => {
    const { data, error } = await supabase
      .from('service_types')
      .update(updates)
      .eq('id', serviceTypeId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete service type
  delete: async (serviceTypeId: string) => {
    const { error } = await supabase
      .from('service_types')
      .delete()
      .eq('id', serviceTypeId);
    
    if (error) throw error;
    return { success: true };
  }
};

// ============================================================================
// ENHANCED CUSTOMER MANAGEMENT API
// ============================================================================

export const enhancedCustomerApi = {
  // Get all customers for tenant
  getAll: async () => {
    const { tenantId } = await getTenantContext();
    console.log('Customer API - Fetching customers for tenant:', tenantId);
    
    const { data, error } = await supabase
      .from('accounts')
      .select(`
        *,
        customer_profile:customer_profiles(*),
        customer_contacts(*)
      `)
      .eq('tenant_id', tenantId)
      .order('name');
    
    console.log('Customer API - Query result:', { data, error });
    
    if (error) throw error;
    return data;
  },

  // Get customer by ID with profile and contacts
  getById: async (customerId: string) => {
    const { data, error } = await supabase
      .from('accounts')
      .select(`
        *,
        customer_profile:customer_profiles(*),
        customer_contacts(*)
      `)
      .eq('id', customerId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new customer
  create: async (customerData: any, profileData?: any) => {
    const { tenantId } = await getTenantContext();
    
    // Start a transaction
    const { data: customer, error: customerError } = await supabase
      .from('accounts')
      .insert({ ...customerData, tenant_id: tenantId })
      .select()
      .single();
    
    if (customerError) throw customerError;
    
    // Create profile if provided
    if (profileData && customer) {
      const { error: profileError } = await supabase
        .from('customer_profiles')
        .insert({ ...profileData, tenant_id: tenantId, account_id: customer.id });
      
      if (profileError) throw profileError;
    }
    
    return customer;
  },

  // Update customer
  update: async (customerId: string, updates: any, profileUpdates?: any) => {
    const { data: customer, error: customerError } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', customerId)
      .select()
      .single();
    
    if (customerError) throw customerError;
    
    // Update profile if provided
    if (profileUpdates) {
      const { error: profileError } = await supabase
        .from('customer_profiles')
        .update(profileUpdates)
        .eq('account_id', customerId);
      
      if (profileError) throw profileError;
    }
    
    return customer;
  },

  // Delete customer
  delete: async (customerId: string) => {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', customerId);
    
    if (error) throw error;
    return { success: true };
  }
};

export const customerContactsApi = {
  // Get contacts for a customer
  getByCustomer: async (customerId: string) => {
    const { data, error } = await supabase
      .from('customer_contacts')
      .select('*')
      .eq('customer_id', customerId)
      .order('is_primary', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get contact by ID
  getById: async (contactId: string) => {
    const { data, error } = await supabase
      .from('customer_contacts')
      .select('*')
      .eq('id', contactId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new contact
  create: async (contactData: any) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('customer_contacts')
      .insert({ ...contactData, tenant_id: tenantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update contact
  update: async (contactId: string, updates: any) => {
    const { data, error } = await supabase
      .from('customer_contacts')
      .update(updates)
      .eq('id', contactId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete contact
  delete: async (contactId: string) => {
    const { error } = await supabase
      .from('customer_contacts')
      .delete()
      .eq('id', contactId);
    
    if (error) throw error;
    return { success: true };
  }
};

// ============================================================================
// PRICING & PAYMENT API
// ============================================================================

export const pricingApi = {
  // Get pricing tiers
  getTiers: async () => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('tier_name');
    
    if (error) throw error;
    return data;
  },

  // Get service pricing
  getServicePricing: async () => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('service_pricing')
      .select(`
        *,
        service_type:service_types(service_name, service_code),
        pricing_tier:pricing_tiers(tier_name)
      `)
      .eq('tenant_id', tenantId)
      .order('service_type_id');
    
    if (error) throw error;
    return data;
  }
};

export const paymentMethodsApi = {
  // Get payment methods for tenant
  getAll: async () => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('method_name');
    
    if (error) throw error;
    return data;
  },

  // Create payment method
  create: async (methodData: any) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({ ...methodData, tenant_id: tenantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// ============================================================================
// COMMUNICATION & COMPLIANCE API
// ============================================================================

export const communicationApi = {
  // Get communication templates
  getTemplates: async () => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('communication_templates')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('template_name');
    
    if (error) throw error;
    return data;
  },

  // Get communication logs for customer
  getLogsByCustomer: async (customerId: string) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('communication_logs')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('customer_id', customerId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

export const complianceApi = {
  // Get compliance requirements
  getRequirements: async () => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('compliance_requirements')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('requirement_name');
    
    if (error) throw error;
    return data;
  },

  // Get compliance records for customer
  getRecordsByCustomer: async (customerId: string) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('compliance_records')
      .select(`
        *,
        requirement:compliance_requirements(requirement_name, requirement_type)
      `)
      .eq('tenant_id', tenantId)
      .eq('customer_id', customerId)
      .order('due_date');
    
    if (error) throw error;
    return data;
  }
};

// ============================================================================
// ANALYTICS API
// ============================================================================

export const analyticsApi = {
  // Get customer analytics
  getCustomerAnalytics: async (customerId: string) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('customer_analytics')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get service analytics
  getServiceAnalytics: async () => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('service_analytics')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// ============================================================================
// SERVICE AREAS & TECHNICIAN SKILLS API
// ============================================================================

export const serviceAreasApi = {
  // Get service areas
  getAll: async () => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('service_areas')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('area_name');
    
    if (error) throw error;
    return data;
  },

  // Create service area
  create: async (areaData: any) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('service_areas')
      .insert({ ...areaData, tenant_id: tenantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update service area
  update: async (areaId: string, updates: any) => {
    const { data, error } = await supabase
      .from('service_areas')
      .update(updates)
      .eq('id', areaId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const technicianSkillsApi = {
  // Get technician skills
  getByTechnician: async (technicianId: string) => {
    const { data, error } = await supabase
      .from('technician_skills')
      .select(`
        *,
        service_type:service_types(service_name, service_code)
      `)
      .eq('technician_id', technicianId)
      .eq('is_active', true)
      .order('skill_level');
    
    if (error) throw error;
    return data;
  },

  // Create technician skill
  create: async (skillData: any) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('technician_skills')
      .insert({ ...skillData, tenant_id: tenantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update technician skill
  update: async (skillId: string, updates: any) => {
    const { data, error } = await supabase
      .from('technician_skills')
      .update(updates)
      .eq('id', skillId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// ============================================================================
// SERVICE HISTORY API
// ============================================================================

export const serviceHistoryApi = {
  // Get service history for a customer
  getByCustomer: async (customerId: string) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('service_history')
      .select(`
        *,
        technician:users(first_name, last_name),
        service_type:service_types(service_name, service_code)
      `)
      .eq('tenant_id', tenantId)
      .eq('customer_id', customerId)
      .order('service_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get service history by ID
  getById: async (serviceId: string) => {
    const { data, error } = await supabase
      .from('service_history')
      .select(`
        *,
        technician:users(first_name, last_name),
        service_type:service_types(service_name, service_code),
        customer:accounts(name, account_type)
      `)
      .eq('id', serviceId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new service history record
  create: async (serviceData: any) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('service_history')
      .insert({ ...serviceData, tenant_id: tenantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update service history record
  update: async (serviceId: string, updates: any) => {
    const { data, error } = await supabase
      .from('service_history')
      .update(updates)
      .eq('id', serviceId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete service history record
  delete: async (serviceId: string) => {
    const { error } = await supabase
      .from('service_history')
      .delete()
      .eq('id', serviceId);
    
    if (error) throw error;
    return { success: true };
  }
};

// ============================================================================
// CUSTOMER NOTES API
// ============================================================================

export const customerNotesApi = {
  // Get notes for a customer
  getByCustomer: async (customerId: string) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('customer_notes')
      .select(`
        *,
        created_by_user:users(first_name, last_name),
        technician:users(first_name, last_name)
      `)
      .eq('tenant_id', tenantId)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get note by ID
  getById: async (noteId: string) => {
    const { data, error } = await supabase
      .from('customer_notes')
      .select(`
        *,
        created_by_user:users(first_name, last_name),
        technician:users(first_name, last_name),
        customer:accounts(name, account_type)
      `)
      .eq('id', noteId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new note
  create: async (noteData: any) => {
    const { tenantId, user } = await getTenantContext();
    const { data, error } = await supabase
      .from('customer_notes')
      .insert({
        ...noteData,
        tenant_id: tenantId,
        created_by: user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update note
  update: async (noteId: string, updates: any) => {
    const { data, error } = await supabase
      .from('customer_notes')
      .update(updates)
      .eq('id', noteId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete note
  delete: async (noteId: string) => {
    const { error } = await supabase
      .from('customer_notes')
      .delete()
      .eq('id', noteId);
    
    if (error) throw error;
    return { success: true };
  }
};

// ============================================================================
// CUSTOMER PHOTOS API
// ============================================================================

export const customerPhotosApi = {
  // Get photos for a customer
  getByCustomer: async (customerId: string) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('customer_photos')
      .select(`
        *,
        uploaded_by_user:users(first_name, last_name)
      `)
      .eq('tenant_id', tenantId)
      .eq('customer_id', customerId)
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get photo by ID
  getById: async (photoId: string) => {
    const { data, error } = await supabase
      .from('customer_photos')
      .select(`
        *,
        uploaded_by_user:users(first_name, last_name),
        customer:accounts(name, account_type)
      `)
      .eq('id', photoId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Upload photo
  upload: async (customerId: string, file: File, metadata: any = {}) => {
    const { tenantId, user } = await getTenantContext();
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${customerId}/${Date.now()}.${fileExt}`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('customer-photos')
      .upload(fileName, file);
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('customer-photos')
      .getPublicUrl(fileName);
    
    // Create database record
    const { data, error } = await supabase
      .from('customer_photos')
      .insert({
        tenant_id: tenantId,
        customer_id: customerId,
        file_name: fileName,
        file_url: urlData.publicUrl,
        file_size: file.size,
        file_type: file.type,
        photo_type: metadata.photo_type || 'general',
        photo_category: metadata.photo_category || 'property',
        description: metadata.description || '',
        uploaded_by: user.id,
        uploaded_at: new Date().toISOString(),
        is_before_photo: metadata.is_before_photo || false,
        is_customer_facing: metadata.is_customer_facing || true
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update photo metadata
  update: async (photoId: string, updates: any) => {
    const { data, error } = await supabase
      .from('customer_photos')
      .update(updates)
      .eq('id', photoId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete photo
  delete: async (photoId: string) => {
    // Get photo record first
    const { data: photo, error: fetchError } = await supabase
      .from('customer_photos')
      .select('file_name')
      .eq('id', photoId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Delete from storage
    if (photo.file_name) {
      const { error: storageError } = await supabase.storage
        .from('customer-photos')
        .remove([photo.file_name]);
      
      if (storageError) throw storageError;
    }
    
    // Delete database record
    const { error } = await supabase
      .from('customer_photos')
      .delete()
      .eq('id', photoId);
    
    if (error) throw error;
    return { success: true };
  }
};

// ============================================================================
// CONTRACTS & AGREEMENTS API
// ============================================================================

export const contractsApi = {
  // Get contracts for a customer
  getByCustomer: async (customerId: string) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('contracts_subscriptions')
      .select(`
        *,
        customer:accounts(name, account_type)
      `)
      .eq('tenant_id', tenantId)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get contract by ID
  getById: async (contractId: string) => {
    const { data, error } = await supabase
      .from('contracts_subscriptions')
      .select(`
        *,
        customer:accounts(name, account_type)
      `)
      .eq('id', contractId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new contract
  create: async (contractData: any) => {
    const { tenantId } = await getTenantContext();
    const { data, error } = await supabase
      .from('contracts_subscriptions')
      .insert({ ...contractData, tenant_id: tenantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update contract
  update: async (contractId: string, updates: any) => {
    const { data, error } = await supabase
      .from('contracts_subscriptions')
      .update(updates)
      .eq('id', contractId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete contract
  delete: async (contractId: string) => {
    const { error } = await supabase
      .from('contracts_subscriptions')
      .delete()
      .eq('id', contractId);
    
    if (error) throw error;
    return { success: true };
  }
};

// Export all APIs
export const enhancedApi = {
  customerSegments: customerSegmentsApi,
  serviceCategories: serviceCategoriesApi,
  serviceTypes: serviceTypesApi,
  customers: enhancedCustomerApi,
  contacts: customerContactsApi,
  pricing: pricingApi,
  paymentMethods: paymentMethodsApi,
  communication: communicationApi,
  compliance: complianceApi,
  analytics: analyticsApi,
  serviceAreas: serviceAreasApi,
  technicianSkills: technicianSkillsApi,
  serviceHistory: serviceHistoryApi,
  customerNotes: customerNotesApi,
  customerPhotos: customerPhotosApi,
  contracts: contractsApi
};

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export const authApi = {
  // Login with email and password
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // Logout
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Get session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }
};

export default enhancedApi;
