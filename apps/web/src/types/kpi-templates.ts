// KPI Templates Types for Enhanced Dashboard System
export interface KpiTemplateField {
  field_name: string;
  field_type: 'number' | 'text' | 'date' | 'boolean';
  table_name: string;
  column_name: string;
  aggregation_type?: 'sum' | 'count' | 'avg' | 'min' | 'max';
  display_name: string;
  description?: string;
  is_required?: boolean;
  sort_order?: number;
}

export interface KpiTemplate {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  category: 'financial' | 'operational' | 'customer' | 'compliance' | 'user';
  template_type: 'system' | 'user' | 'shared';
  formula_expression: string;
  formula_fields: KpiTemplateField[];
  threshold_config: {
    green: number;
    yellow: number;
    red: number;
    unit?: string;
  };
  chart_config: {
    type: string;
    colorScheme: string[];
  };
  data_source_config: {
    table: string;
    timeRange: string;
  };
  tags: string[];
  is_public: boolean;
  is_featured: boolean;
  usage_count: number;
  version: string;
  status: 'draft' | 'published' | 'archived';
  created_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  creator?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  approver?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  templateFields?: KpiTemplateField[];
}

export interface UserKpi {
  id: string;
  tenant_id: string;
  user_id: string;
  template_id?: string;
  name: string;
  description?: string;
  formula_expression: string;
  formula_fields: KpiTemplateField[];
  threshold_config: {
    green: number;
    yellow: number;
    red: number;
    unit?: string;
  };
  chart_config: {
    type: string;
    colorScheme: string[];
  };
  data_source_config: {
    table: string;
    timeRange: string;
  };
  is_active: boolean;
  last_calculated?: string;
  last_value?: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  template?: KpiTemplate;
}

export interface KpiTemplateUsage {
  id: string;
  template_id: string;
  user_id: string;
  tenant_id: string;
  action: 'viewed' | 'used' | 'favorited' | 'shared';
  created_at: string;
}

// DTOs for API operations
export interface CreateKpiTemplateDto {
  name: string;
  description?: string;
  category?: 'financial' | 'operational' | 'customer' | 'compliance' | 'user';
  template_type?: 'system' | 'user' | 'shared';
  formula_expression: string;
  formula_fields?: KpiTemplateField[];
  threshold_config?: {
    green: number;
    yellow: number;
    red: number;
    unit?: string;
  };
  chart_config?: {
    type: string;
    colorScheme: string[];
  };
  data_source_config?: {
    table: string;
    timeRange: string;
  };
  tags?: string[];
  is_public?: boolean;
  is_featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
}

export interface UpdateKpiTemplateDto extends Partial<CreateKpiTemplateDto> {}

export interface KpiTemplateFilters {
  search?: string;
  category?: 'financial' | 'operational' | 'customer' | 'compliance' | 'user';
  template_type?: 'system' | 'user' | 'shared';
  tags?: string[];
  is_public?: boolean;
  is_featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

export interface UseKpiTemplateDto {
  template_id: string;
  name: string;
  description?: string;
  threshold_config?: {
    green: number;
    yellow: number;
    red: number;
    unit?: string;
  };
  chart_config?: {
    type: string;
    colorScheme: string[];
  };
  data_source_config?: {
    table: string;
    timeRange: string;
  };
}

export interface KpiTemplateUsageDto {
  template_id: string;
  action: 'viewed' | 'used' | 'favorited' | 'shared';
}

// API Response types
export interface KpiTemplateResponse {
  data: KpiTemplate;
  message?: string;
}

export interface KpiTemplateListResponse {
  data: KpiTemplate[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserKpiResponse {
  data: UserKpi;
  message?: string;
}

export interface KpiTemplateUsageResponse {
  data: KpiTemplateUsage;
  message?: string;
}















