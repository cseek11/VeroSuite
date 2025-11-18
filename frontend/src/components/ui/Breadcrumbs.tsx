/**
 * Breadcrumbs Component
 * 
 * Provides navigation breadcrumbs for deep page hierarchies.
 * Automatically generates breadcrumbs from React Router location.
 * 
 * Features:
 * - Auto-generates breadcrumbs from route path
 * - Supports custom breadcrumb items
 * - Clickable navigation
 * - Home icon support
 * - Responsive design with mobile-friendly truncation
 * - ARIA labels for accessibility
 * 
 * @example
 * ```tsx
 * <Breadcrumbs />
 * ```
 * 
 * @example
 * ```tsx
 * <Breadcrumbs 
 *   items={[
 *     { label: 'Home', path: '/' },
 *     { label: 'Customers', path: '/customers' },
 *     { label: 'John Doe', path: '/customers/123' }
 *   ]}
 *   maxItems={3}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <Breadcrumbs 
 *   showHome={false}
 *   separator={<span>/</span>}
 * />
 * ```
 */

import React, { memo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { logger } from '@/utils/logger';

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbsProps {
  /**
   * Custom breadcrumb items. If not provided, breadcrumbs are auto-generated from route.
   */
  items?: BreadcrumbItem[];
  /**
   * Custom separator between breadcrumb items
   */
  separator?: React.ReactNode;
  /**
   * Maximum number of breadcrumb items to display
   */
  maxItems?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Show home icon for first breadcrumb
   */
  showHome?: boolean;
}

/**
 * Route name mapping for auto-generated breadcrumbs
 */
const routeNameMap: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/customers': 'Customers',
  '/customers/new': 'New Customer',
  '/work-orders': 'Work Orders',
  '/work-orders/new': 'New Work Order',
  '/technicians': 'Technicians',
  '/technicians/new': 'New Technician',
  '/scheduler': 'Scheduler',
  '/billing': 'Billing',
  '/finance': 'Finance',
  '/reports': 'Reports',
  '/routing': 'Routing',
  '/uploads': 'Uploads',
  '/settings': 'Settings',
  '/settings/users': 'User Management',
  '/communications': 'Communications',
  '/knowledge': 'Knowledge Base',
  '/charts': 'Charts',
  '/agreements': 'Agreements',
  '/agreements/create': 'Create Agreement',
  '/customer-management': 'Customer Management',
  '/service-management': 'Service Management',
  '/search-analytics': 'Search Analytics',
};

/**
 * Generate breadcrumb items from current route
 */
function generateBreadcrumbsFromRoute(
  pathname: string,
  params: Record<string, string>,
  showHome: boolean
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];
  
  // Add home if enabled
  if (showHome) {
    items.push({ label: 'Home', path: '/', icon: Home });
  }
  
  // Split pathname into segments
  const segments = pathname.split('/').filter(Boolean);
  
  // Build breadcrumbs from segments
  let currentPath = '';
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    
    // Check if this is a dynamic parameter (UUID-like)
    const isParam = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
    
    if (isParam) {
      // Try to get label from params (e.g., customerId -> Customer Name)
      const paramKey = Object.keys(params).find(key => params[key] === segment);
      const label = paramKey 
        ? `${paramKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Details`
        : 'Details';
      items.push({ label, path: currentPath });
    } else {
      // Get label from route name map or format segment
      const label = routeNameMap[currentPath] || segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      items.push({ label, path: currentPath });
    }
  }
  
  return items;
}

/**
 * Breadcrumbs Component
 * 
 * Displays navigation breadcrumbs for the current page.
 * Supports both auto-generated and custom breadcrumb items.
 */
function Breadcrumbs({
  items,
  separator = <ChevronRight className="w-4 h-4 text-gray-400" />,
  maxItems,
  className = '',
  showHome = true,
}: BreadcrumbsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<Record<string, string>>();
  
  // Generate breadcrumbs from route if not provided
  const breadcrumbItems = items || generateBreadcrumbsFromRoute(
    location.pathname,
    params,
    showHome
  );
  
  // Limit items if maxItems is specified
  const displayItems = maxItems && breadcrumbItems.length > maxItems
    ? [
        breadcrumbItems[0], // Always show first
        { label: '...', path: '', icon: undefined },
        ...breadcrumbItems.slice(-(maxItems - 2)), // Show last N-2 items
      ]
    : breadcrumbItems;
  
  const handleClick = (path: string, index: number) => {
    // Don't navigate if clicking current page or placeholder
    if (path === location.pathname || path === '' || index === displayItems.length - 1) {
      return;
    }
    
    try {
      navigate(path);
    } catch (error) {
      logger.error('Breadcrumb navigation failed', error, 'Breadcrumbs', 'handleClick');
    }
  };
  
  if (breadcrumbItems.length <= 1) {
    // Don't show breadcrumbs if only one item (home)
    return null;
  }
  
  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={`flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${className}`}
    >
      <ol className="flex items-center space-x-1 sm:space-x-2 flex-wrap" role="list">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isClickable = item.path && item.path !== location.pathname && !isLast;
          
          return (
            <li key={`${item.path}-${index}`} className="flex items-center">
              {index > 0 && (
                <span className="mx-2" aria-hidden="true">
                  {separator}
                </span>
              )}
              
              {isClickable ? (
                <button
                  type="button"
                  onClick={() => handleClick(item.path, index)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded px-1 sm:px-2 py-1 truncate max-w-[120px] sm:max-w-none"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.icon && <item.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />}
                  <span className="truncate">{item.label}</span>
                </button>
              ) : (
                <span
                  className={`flex items-center space-x-1 truncate max-w-[120px] sm:max-w-none ${
                    isLast
                      ? 'text-gray-900 font-medium'
                      : item.path === ''
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && <item.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />}
                  <span className="truncate">{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

