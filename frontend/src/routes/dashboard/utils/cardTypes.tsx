// Card types configuration
import { logger } from '@/utils/logger';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import SmartKPITest from '@/components/dashboard/SmartKPITest';
import SmartKPIDebug from '@/components/dashboard/SmartKPIDebug';
import JobsCalendarCard from '@/components/dashboard/JobsCalendarCard';
import {
  KpiBuilderCard,
  KpiTemplateCard,
  PredictiveAnalyticsCard,
  AutoLayoutCard
} from '@/components/cards';
import CustomersPageCard from '@/components/dashboard/CustomersPageCard';
import CustomerSearchCard from '@/components/dashboard/CustomerSearchCard';
import ReportCard from '@/components/dashboard/ReportCard';
import TechnicianDispatchCard from '@/components/dashboard/TechnicianDispatchCard';
import InvoiceCard from '@/components/dashboard/InvoiceCard';
import AvailabilityManagerCard from '@/components/dashboard/AvailabilityManagerCard';
import { mockMetrics } from './constants';
import { CardType } from '../types/dashboard.types';

export const getCardTypes = (onOpenKPIBuilder: () => void): CardType[] => {
  const cardTypes: CardType[] = [
  { 
    id: 'dashboard-metrics', 
    name: 'Dashboard Metrics', 
    component: () => <DashboardMetrics metrics={mockMetrics} />
  },
  { 
    id: 'smart-kpis', 
    name: 'Smart KPIs', 
    component: () => <DashboardMetrics metrics={mockMetrics} enableSmartKPIs={true} />
  },
  { 
    id: 'smart-kpis-test', 
    name: 'Smart KPIs Test', 
    component: () => <SmartKPITest />
  },
  { 
    id: 'smart-kpis-debug', 
    name: 'Smart KPIs Debug', 
    component: () => <SmartKPIDebug />
  },
  { id: 'jobs-calendar', name: 'Jobs Calendar', component: () => <JobsCalendarCard /> },
  { id: 'recent-activity', name: 'Recent Activity', component: () => <div className="p-4 text-gray-600">Recent Activity - Coming Soon</div> },
  { id: 'customer-search', name: 'Customer Search', component: ({ cardId }: { cardId?: string }) => cardId ? <CustomerSearchCard cardId={cardId} /> : <CustomerSearchCard /> },
  { id: 'reports', name: 'Reports', component: ({ cardId }: { cardId?: string }) => cardId ? <ReportCard cardId={cardId} /> : <ReportCard /> },
  { 
    id: 'technician-dispatch', 
    name: 'Technician Dispatch', 
    component: ({ cardId }: { cardId?: string }) => {
      if (cardId) {
        return <TechnicianDispatchCard cardId={cardId} />;
      }
      return <TechnicianDispatchCard />;
    }
  },
  { 
    id: 'invoices', 
    name: 'Invoices', 
    component: ({ cardId }: { cardId?: string }) => {
      if (cardId) {
        return <InvoiceCard cardId={cardId} />;
      }
      return <InvoiceCard />;
    }
  },
  {
    id: 'availability-manager',
    name: 'Availability Manager',
    component: ({ cardId }: { cardId?: string }) => {
      if (cardId) {
        return <AvailabilityManagerCard cardId={cardId} />;
      }
      return <AvailabilityManagerCard />;
    }
  },
  { id: 'quick-actions', name: 'Quick Actions', component: () => <QuickActionsCard /> },
  { id: 'kpi-builder', name: 'KPI Builder', component: () => <KpiBuilderCard onOpenBuilder={onOpenKPIBuilder} /> },
  { id: 'predictive-analytics', name: 'Predictive Analytics', component: () => <PredictiveAnalyticsCard /> },
  { id: 'auto-layout', name: 'Auto-Layout', component: () => <AutoLayoutCard /> },
  { id: 'routing', name: 'Routing', component: () => <div className="p-4 text-gray-600">Routing - Coming Soon</div> },
  { id: 'team-overview', name: 'Team Overview', component: () => <div className="p-4 text-gray-600">Team Overview - Coming Soon</div> },
  { id: 'financial-summary', name: 'Financial Summary', component: () => <div className="p-4 text-gray-600">Financial Summary - Coming Soon</div> },
  { id: 'kpi-display', name: 'KPI Display', component: 'kpi-display' }, // Special marker for KPI display cards
  { id: 'kpi-template', name: 'KPI Template', component: ({ cardId, onOpenTemplateLibrary }: { cardId?: string; onOpenTemplateLibrary: () => void }) => <KpiTemplateCard cardId={cardId as string | undefined} onOpenTemplateLibrary={onOpenTemplateLibrary} /> },
  { id: 'customers-page', name: 'Customers', component: ({ cardId }: { cardId?: string }) => cardId ? <CustomersPageCard cardId={cardId} /> : <CustomersPageCard /> }
  ];
  
  // Debug: Log available card types
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Available card types', { cardTypes: cardTypes.map(c => ({ id: c.id, name: c.name })) }, 'cardTypes');
  }
  
  return cardTypes;
};
