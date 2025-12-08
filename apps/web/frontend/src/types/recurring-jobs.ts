// Recurring Job Template Types
export interface RecurringJobTemplate {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  recurrence_type: 'daily' | 'weekly' | 'monthly' | 'custom';
  recurrence_interval: number;
  recurrence_days_of_week?: number[];
  recurrence_day_of_month?: number;
  recurrence_weekday_of_month?: string;
  start_time: string;
  end_time?: string;
  estimated_duration?: number;
  start_date: string;
  end_date?: string;
  max_occurrences?: number;
  job_template: Record<string, unknown>;
  is_active: boolean;
  last_generated_date?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface CreateRecurringJobTemplateDto {
  name: string;
  description?: string;
  recurrence_type: 'daily' | 'weekly' | 'monthly' | 'custom';
  recurrence_interval?: number;
  recurrence_days_of_week?: number[];
  recurrence_day_of_month?: number;
  recurrence_weekday_of_month?: string;
  start_time: string;
  end_time?: string;
  estimated_duration?: number;
  start_date: string;
  end_date?: string;
  max_occurrences?: number;
  job_template: Record<string, unknown>;
  is_active?: boolean;
}

export interface UpdateRecurringJobTemplateDto extends Partial<CreateRecurringJobTemplateDto> {}






