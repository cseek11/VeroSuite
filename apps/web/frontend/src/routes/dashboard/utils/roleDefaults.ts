import { DashboardRegion, RegionType } from '../types/region.types';

export const technicianDefaults: Partial<DashboardRegion>[] = [
  {
    region_type: RegionType.SCHEDULING,
    grid_row: 0,
    grid_col: 0,
    row_span: 2,
    col_span: 1,
    min_width: 300,
    min_height: 400
  },
  {
    region_type: RegionType.CUSTOMER_SEARCH,
    grid_row: 0,
    grid_col: 1,
    row_span: 1,
    col_span: 1,
    min_width: 300,
    min_height: 200
  },
  {
    region_type: RegionType.QUICK_ACTIONS,
    grid_row: 1,
    grid_col: 1,
    row_span: 1,
    col_span: 1,
    min_width: 300,
    min_height: 200
  },
  {
    region_type: RegionType.REPORTS,
    grid_row: 2,
    grid_col: 0,
    row_span: 1,
    col_span: 2,
    min_width: 600,
    min_height: 200
  }
];

export const managerDefaults: Partial<DashboardRegion>[] = [
  {
    region_type: RegionType.REPORTS,
    grid_row: 0,
    grid_col: 0,
    row_span: 1,
    col_span: 1,
    min_width: 300,
    min_height: 300
  },
  {
    region_type: RegionType.TEAM_OVERVIEW,
    grid_row: 0,
    grid_col: 1,
    row_span: 1,
    col_span: 1,
    min_width: 300,
    min_height: 300
  },
  {
    region_type: RegionType.SCHEDULING,
    grid_row: 1,
    grid_col: 0,
    row_span: 1,
    col_span: 1,
    min_width: 300,
    min_height: 300
  },
  {
    region_type: RegionType.ANALYTICS,
    grid_row: 1,
    grid_col: 1,
    row_span: 1,
    col_span: 1,
    min_width: 300,
    min_height: 300
  }
];

export const adminDefaults: Partial<DashboardRegion>[] = [
  {
    region_type: RegionType.SETTINGS,
    grid_row: 0,
    grid_col: 0,
    row_span: 1,
    col_span: 1,
    min_width: 300,
    min_height: 300
  },
  {
    region_type: RegionType.REPORTS,
    grid_row: 0,
    grid_col: 1,
    row_span: 1,
    col_span: 1,
    min_width: 300,
    min_height: 300
  },
  {
    region_type: RegionType.ANALYTICS,
    grid_row: 1,
    grid_col: 0,
    row_span: 1,
    col_span: 2,
    min_width: 600,
    min_height: 300
  }
];

export const roleDefaultsMap: Record<string, Partial<DashboardRegion>[]> = {
  technician: technicianDefaults,
  manager: managerDefaults,
  admin: adminDefaults
};

export function getRoleDefaults(role: string): Partial<DashboardRegion>[] {
  return roleDefaultsMap[role] || [];
}





