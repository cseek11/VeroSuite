import { DashboardMetric } from '@/types';

export interface VeroCardsV3Props {
  // Currently no props used
}

export interface ModalState<T = void> {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success' | 'danger';
  onConfirm?: T extends void ? () => void : (value: T) => void;
  placeholder?: string;
  defaultValue?: string;
}

export interface GroupDeleteModalState {
  isOpen: boolean;
  groupId: string;
  groupName: string;
}

export interface CardType {
  id: string;
  name: string;
  component: any;
}

export interface CardSize {
  width: number;
  height: number;
}

export interface CardPosition {
  x: number;
  y: number;
}

export interface DashboardCard {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface KpiData {
  id: string;
  name: string;
  description: string;
  category?: string;
  formula_expression?: string;
  formula_fields?: string[];
  threshold_config?: any;
  chart_config?: any;
  data_source_config?: any;
  tags?: string[];
  is_active?: boolean;
  created_at?: string;
  template_id?: string;
  user_id?: string;
  tenant_id?: string;
  enabled: boolean;
  realTime: boolean;
  threshold: {
    green: number;
    yellow: number;
    unit: string;
  };
  chart: {
    type: string;
  };
  config?: any;
  user_kpi_id?: string;
}

export type { DashboardMetric };
