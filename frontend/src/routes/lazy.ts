import { lazy } from 'react';

// Lazy load route components
export const Dashboard = lazy(() => import('./Dashboard'));
export const Jobs = lazy(() => import('./Jobs'));
export const Customers = lazy(() => import('./Customers'));
export const Settings = lazy(() => import('./Settings'));
export const Uploads = lazy(() => import('./Uploads'));
export const Routing = lazy(() => import('./Routing'));

// Lazy load modal components
export const JobModal = lazy(() => import('../components/modals/JobModal'));
export const CustomerModal = lazy(() => import('../components/modals/CustomerModal'));
export const SettingsModal = lazy(() => import('../components/modals/SettingsModal'));

// Lazy load complex components
export const JobsCalendar = lazy(() => import('../components/JobsCalendar'));
export const JobsScheduler = lazy(() => import('../components/JobsScheduler'));
export const DispatcherDashboard = lazy(() => import('../components/DispatcherDashboard'));
export const TechnicianMobile = lazy(() => import('../components/TechnicianMobile'));
