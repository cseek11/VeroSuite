import { lazy } from 'react';

// Lazy load route components
// LegacyDashboard removed as part of V4 migration
export const Jobs = lazy(() => import('./Jobs'));
// Customers route removed - use CustomerPage component directly
export const Settings = lazy(() => import('./Settings'));
export const Uploads = lazy(() => import('./Uploads'));
export const Routing = lazy(() => import('./Routing'));

// Lazy load complex components
