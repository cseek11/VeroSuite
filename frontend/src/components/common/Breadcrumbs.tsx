import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { logger } from '@/utils/logger';
import { getOrCreateTraceContext } from '@/lib/trace-propagation';

interface BreadcrumbItem {
  label: string;
  path: string;
}

/**
 * Breadcrumbs Component
 * 
 * Displays navigation breadcrumbs based on current route.
 * Automatically generates breadcrumb trail from URL path.
 * 
 * Features:
 * - Automatic route parsing
 * - Customizable route labels
 * - Accessible navigation
 * - Responsive design
 * 
 * @example
 * <Breadcrumbs />
 */
export default function Breadcrumbs() {
  const location = useLocation();

  // Route label mapping - maps URL paths to readable labels
  const routeLabels: Record<string, string> = useMemo(() => ({
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/customers': 'Customers',
    '/work-orders': 'Work Orders',
    '/work-orders/create': 'Create Work Order',
    '/work-orders/:id': 'Work Order Details',
    '/work-orders/:id/edit': 'Edit Work Order',
    '/technicians': 'Technicians',
    '/technicians/create': 'Create Technician',
    '/technicians/:id': 'Technician Details',
    '/technicians/:id/edit': 'Edit Technician',
    '/scheduler': 'Scheduler',
    '/billing': 'Billing',
    '/billing/invoices': 'Invoices',
    '/billing/payments': 'Payments',
    '/billing/reports': 'Reports',
    '/finance': 'Finance',
    '/routing': 'Routing',
    '/reports': 'Reports',
    '/settings': 'Settings',
    '/communications': 'Communications',
    '/knowledge': 'Knowledge',
    '/uploads': 'Uploads',
    '/charts': 'Charts',
    '/agreements': 'Agreements',
    '/agreements/create': 'Create Agreement',
    '/agreements/:id': 'Agreement Details',
    '/users': 'User Management',
  }), []);

  // Generate breadcrumb items from current path
  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    try {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const items: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

      let currentPath = '';
      for (let i = 0; i < pathSegments.length; i++) {
        currentPath += `/${pathSegments[i]}`;
        
        // Check for exact match first
        let label = routeLabels[currentPath];
        
        // If no exact match, try pattern matching for dynamic routes
        if (!label) {
          // Check for UUID pattern (8-4-4-4-12 hex characters)
          const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (uuidPattern.test(pathSegments[i])) {
            // Try to infer label from previous segment
            const previousPath = i > 0 ? `/${pathSegments[i - 1]}` : '/';
            const previousLabel = routeLabels[previousPath] || pathSegments[i - 1] || 'Item';
            label = `${previousLabel} Details`;
          } else {
            // Use capitalized segment name as fallback
            label = pathSegments[i]
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          }
        }

        items.push({ label, path: currentPath });
      }

      return items;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const traceContext = getOrCreateTraceContext();
      logger.error(
        `Failed to generate breadcrumbs for path ${location.pathname}. ${errorMessage}.`,
        'Breadcrumbs',
        error as Error,
        undefined,
        undefined,
        undefined,
        traceContext.traceId,
        traceContext.spanId,
        traceContext.requestId
      );
      // Return minimal breadcrumb on error
      return [{ label: 'Home', path: '/' }];
    }
  }, [location.pathname, routeLabels]);

  // Don't render breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="flex items-center space-x-2 text-sm text-gray-600 mb-4"
    >
      <ol className="flex items-center space-x-2" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li
              key={item.path}
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {isLast ? (
                <span
                  className="font-medium text-gray-900"
                  itemProp="name"
                  aria-current="page"
                >
                  {index === 0 && <Home className="inline-block w-4 h-4 mr-1" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-gray-900 transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">
                    {index === 0 && <Home className="inline-block w-4 h-4 mr-1" />}
                    {item.label}
                  </span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 1)} />
              {!isLast && (
                <ChevronRight
                  className="w-4 h-4 mx-2 text-gray-400"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
