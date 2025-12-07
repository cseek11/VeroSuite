import { DashboardMetric } from '@/types';
import type { ComponentType } from 'react';

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

export interface CardSize {
  width: number;
  height: number;
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

// Dashboard State Interfaces
export interface DashboardState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showCardSelector: boolean;
  setShowCardSelector: (show: boolean) => void;
  showKeyboardHelp: boolean;
  setShowKeyboardHelp: (show: boolean) => void;
  showLayoutManager: boolean;
  setShowLayoutManager: (show: boolean) => void;
  showKPIBuilder: boolean;
  setShowKPIBuilder: (show: boolean) => void;
  virtualScrollingThreshold: number;
  handleDeselectAll: () => void;
  setSelectedCards: (cards: Set<string>) => void;
  isMobileFullscreen: boolean;
  showMobileNavigation: boolean;
}

export interface ErrorHandling {
  errors: Array<{
    id: string;
    message: string;
    timestamp: Date;
    retryable?: boolean;
  }>;
  clearError: (errorId: string) => void;
  retryOperation: (errorId: string) => void;
}

export interface VirtualScrolling {
  isVirtualScrolling: boolean;
}

export interface SmartKPIs {
  isDrillDownOpen: boolean;
  setIsDrillDownOpen: (open: boolean) => void;
  selectedKPI?: KpiData;
  drillDownData?: Record<string, unknown>;
}

export interface TemplateLoading {
  isLoading: boolean;
  progress?: number;
}

export interface Layout {
  cards: Record<string, DashboardCard>;
  currentLayout?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
}

export interface CardType {
  id: string;
  name: string;
  component: ComponentType<any>;
  icon?: ComponentType<any>;
}

export interface Group {
  id: string;
  name: string;
  cardIds: string[];
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Preset {
  id: string;
  name: string;
  layout: Layout;
}

export interface KeyboardShortcuts {
  [key: string]: {
    description: string;
    keys: string[];
  };
}

export type { DashboardMetric };







