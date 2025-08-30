// ============================================================================
// LEGACY API FUNCTIONS (DEPRECATED - Use enhanced-api.ts instead)
// ============================================================================
// This file is deprecated. All functionality has been moved to enhanced-api.ts
// to prevent multiple Supabase client instances.

/*
export const jobsApi = {
  complete: async (id: string, payload: any) => {
    const { data, error } = await supabase
      .from('jobs')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  today: async (technicianId?: string) => {
    const today = new Date().toISOString().split('T')[0];
    let query = supabase
      .from('jobs')
      .select(`
        *,
        accounts (
          name,
          address,
          phone,
          email
        ),
        work_orders (
          service_type,
          description,
          service_price
        ),
        technicians (
          first_name,
          last_name,
          email
        )
      `)
      .eq('scheduled_date', today)
      .order('scheduled_time', { ascending: true });

    if (technicianId) {
      query = query.eq('technician_id', technicianId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  assign: async (jobId: string, technicianId: string) => {
    const { data, error } = await supabase
      .from('jobs')
      .update({ technician_id: technicianId })
      .eq('id', jobId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  start: async (jobId: string, gps: { lat: number; lng: number }) => {
    const { data, error } = await supabase
      .from('jobs')
      .update({ 
        status: 'in_progress',
        start_time: new Date().toISOString(),
        start_location: `${gps.lat},${gps.lng}`
      })
      .eq('id', jobId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const presignUpload = async (fileName: string, fileType: string) => {
  // Mock presigned upload URL
  // TODO: Implement actual presigned upload with Supabase Storage
  return {
    uploadUrl: `https://mock-upload-url.com/upload/${fileName}`,
    fileUrl: `https://mock-file-url.com/files/${fileName}`,
    method: 'PUT',
    headers: {
      'Content-Type': fileType,
      'x-amz-acl': 'public-read'
    }
  };
};

export const routingApi = {
  optimize: async (date: string) => {
    // Mock routing optimization data
    // TODO: Implement actual routing optimization API
    return [
      {
        id: 'route-1',
        name: 'Morning Route',
        stops: [
          { id: 'stop-1', customer: 'ABC Company', address: '123 Main St', time: '09:00 AM' },
          { id: 'stop-2', customer: 'XYZ Corp', address: '456 Oak Ave', time: '10:30 AM' },
          { id: 'stop-3', customer: 'DEF Industries', address: '789 Pine Rd', time: '12:00 PM' }
        ],
        totalDistance: '45.2 miles',
        estimatedTime: '3 hours 15 minutes'
      },
      {
        id: 'route-2',
        name: 'Afternoon Route',
        stops: [
          { id: 'stop-4', customer: 'GHI Services', address: '321 Elm St', time: '02:00 PM' },
          { id: 'stop-5', customer: 'JKL Enterprises', address: '654 Maple Dr', time: '03:30 PM' }
        ],
        totalDistance: '28.7 miles',
        estimatedTime: '2 hours 45 minutes'
      }
    ];
  }
};

export const crmApi = {
  // Get all accounts (customers)
  accounts: async () => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  // Get customer by ID
  getCustomer: async (customerId: string) => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', customerId)
      .single();
    if (error) throw error;
    return data;
  },

  // Get service history for a customer
  getServiceHistory: async (customerId: string) => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        work_orders (
          service_type,
          description,
          service_price
        )
      `)
      .eq('account_id', customerId)
      .order('scheduled_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Get contracts for a customer
  getContracts: async (customerId: string) => {
    const { data, error } = await supabase
      .from('agreements')
      .select('*')
      .eq('account_id', customerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Get customer notes
  getCustomerNotes: async (customerId: string) => {
    try {
      // Get current user session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Extract tenant_id from JWT token
      const tenantId = user.user_metadata?.tenant_id;
      if (!tenantId) throw new Error('Tenant ID not found in user metadata');

      console.log('Fetching notes for customer:', customerId, 'tenant:', tenantId);

      const { data, error } = await supabase
        .from('customer_notes')
        .select('*')
        .eq('customer_id', customerId)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching customer notes:', error);
      return [];
    }
  },

  // Get customer photos
  getCustomerPhotos: async (customerId: string) => {
    const { data, error } = await supabase
      .from('customer_photos')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Update customer
  updateCustomer: async (customerId: string, updates: any) => {
    const { data, error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', customerId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Upload customer photo
  uploadCustomerPhoto: async (customerId: string, file: File) => {
    // This would typically upload to Supabase Storage
    // For now, return a mock response
    console.log('Uploading photo for customer:', customerId, file);
    return { success: true, url: 'mock-photo-url' };
  }
};
*/
