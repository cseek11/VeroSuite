---
title: Frontend Architecture
category: Architecture
status: active
last_reviewed: 2025-11-11
owner: frontend_team
related:
  - docs/architecture/system-overview.md
  - docs/guides/development/best-practices.md
---

# Frontend Architecture

## Overview

The VeroField frontend is built with React 18+ and TypeScript, using a component-based architecture with a focus on reusability, consistency, and maintainability.

## Directory Structure

```
frontend/src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   ├── crm/             # CRM-specific components
│   ├── customer/        # Customer management components
│   ├── scheduling/      # Scheduling components
│   └── ...
├── routes/              # Route components
├── lib/                 # API clients and utilities
├── hooks/               # Custom React hooks
├── stores/              # Zustand stores
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Component Architecture

### UI Components (`components/ui/`)
Reusable components following design system:
- Form components (Input, Select, Textarea, etc.)
- Layout components (Card, Button, Dialog)
- Feedback components (Tooltip, ConfirmationDialog)
- Status components (Status, Badge)

### Feature Components (`components/[feature]/`)
Feature-specific components:
- Customer management components
- Scheduling components
- Dashboard components
- Billing components

## State Management

### React Query
- Server state management
- Data fetching and caching
- Automatic refetching and synchronization

### Zustand
- Client-side state management
- Global application state
- Dashboard state

### React Hook Form
- Form state management
- Validation with zod
- Form submission handling

## Data Fetching

### API Clients
- `enhancedApi` - Primary frontend API client
- `secureApiClient` - Authenticated backend operations
- Service-specific clients as needed

### Patterns
```typescript
// Query pattern
const { data, isLoading } = useQuery({
  queryKey: ['customers'],
  queryFn: () => enhancedApi.customers.getAll(),
});

// Mutation pattern
const mutation = useMutation({
  mutationFn: (data) => enhancedApi.customers.create(data),
  onSuccess: () => queryClient.invalidateQueries(['customers']),
});
```

## Routing

- React Router for navigation
- Protected routes with authentication
- Lazy loading for code splitting

## Styling

- Tailwind CSS for utility-first styling
- Design system components from `ui/`
- Consistent spacing and color system
- Responsive design patterns

## Form Patterns

All forms follow standard pattern:
- react-hook-form for form state
- zod for validation
- Standard UI components
- Consistent error handling

See [Form Patterns Guide](../guides/development/form-patterns.md) for details.

## Component Patterns

### Standard Component Structure
```typescript
import { useQuery } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export function MyComponent() {
  const { data } = useQuery({
    queryKey: ['data'],
    queryFn: () => enhancedApi.getData(),
  });

  return (
    <div className="space-y-4">
      {/* Component content */}
    </div>
  );
}
```

## Performance Optimizations

- Code splitting with lazy loading
- React.memo for expensive components
- useMemo and useCallback for optimization
- Virtual scrolling for large lists
- Image optimization

## Related Documentation

- [Development Best Practices](../guides/development/best-practices.md)
- [Component Library Guide](../guides/development/component-library.md)
- [Styling Guide](../guides/development/styling-guide.md)
- [System Architecture Overview](system-overview.md)

---

**Last Updated:** 2025-11-11  
**Maintained By:** Frontend Team  
**Review Frequency:** Quarterly






