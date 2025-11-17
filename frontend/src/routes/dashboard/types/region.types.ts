export enum RegionType {
  SCHEDULING = 'scheduling',
  REPORTS = 'reports',
  CUSTOMER_SEARCH = 'customer-search',
  SETTINGS = 'settings',
  QUICK_ACTIONS = 'quick-actions',
  ANALYTICS = 'analytics',
  TEAM_OVERVIEW = 'team-overview',
  FINANCIAL_SUMMARY = 'financial-summary',
  CUSTOM = 'custom'
}

export interface DashboardRegion {
  id: string;
  layout_id: string;
  tenant_id: string;
  user_id: string;
  region_type: RegionType;
  grid_row: number;
  grid_col: number;
  row_span: number;
  col_span: number;
  min_width: number;
  min_height: number;
  is_collapsed: boolean;
  is_locked: boolean;
  is_hidden_mobile: boolean;
  config: Record<string, any>;
  widget_type?: string;
  widget_config: Record<string, any>;
  display_order: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface RegionLayout {
  rows: number;
  cols: number;
  gap: number;
}

export interface RegionWidget {
  id: string;
  type: string;
  config: Record<string, any>;
}

export interface RoleBasedDefaults {
  technician: Partial<DashboardRegion>[];
  manager: Partial<DashboardRegion>[];
  admin: Partial<DashboardRegion>[];
}





