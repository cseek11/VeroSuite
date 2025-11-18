# VeroField Component Library

**Last Updated:** 2025-11-18  
**Version:** 1.0

---

## Overview

This document provides comprehensive documentation for all reusable UI components in the VeroField application. Components are organized by category and include usage examples, props, and best practices.

---

## Table of Contents

1. [Navigation Components](#navigation-components)
2. [Form Components](#form-components)
3. [Display Components](#display-components)
4. [Feedback Components](#feedback-components)
5. [Layout Components](#layout-components)
6. [Loading Components](#loading-components)
7. [Error Components](#error-components)

---

## Navigation Components

### Breadcrumbs

**Location:** `frontend/src/components/ui/Breadcrumbs.tsx`

**Description:** Provides navigation breadcrumbs for deep page hierarchies. Automatically generates breadcrumbs from React Router location.

**Features:**
- Auto-generates breadcrumbs from route path
- Supports custom breadcrumb items
- Clickable navigation
- Home icon support
- Responsive design with mobile-friendly truncation
- ARIA labels for accessibility

**Props:**
```typescript
interface BreadcrumbsProps {
  items?: BreadcrumbItem[];        // Custom breadcrumb items
  separator?: React.ReactNode;      // Custom separator (default: ChevronRight)
  maxItems?: number;                // Maximum items to display
  className?: string;               // Additional CSS classes
  showHome?: boolean;               // Show home icon (default: true)
}
```

**Usage:**
```tsx
import { Breadcrumbs } from '@/components/ui';

// Auto-generated from route
<Breadcrumbs />

// Custom breadcrumbs
<Breadcrumbs 
  items={[
    { label: 'Home', path: '/' },
    { label: 'Customers', path: '/customers' },
    { label: 'John Doe', path: '/customers/123' }
  ]}
  maxItems={3}
/>
```

**Best Practices:**
- Use `maxItems` on mobile to prevent overflow
- Provide custom `items` for complex nested routes
- Ensure breadcrumb paths match actual routes

---

## Form Components

### CustomerSearchSelector

**Location:** `frontend/src/components/ui/CustomerSearchSelector.tsx`

**Description:** Advanced customer search and selection component with local filtering and API integration.

**Features:**
- Real-time search filtering
- Multi-field search (name, email, phone, address)
- Selected customer display box
- Loading states
- Error handling
- Accessible keyboard navigation

**Props:**
```typescript
interface CustomerSearchSelectorProps {
  value?: string;                   // Selected customer ID
  onChange: (customerId: string, customer: Account | null) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
  label?: string;
  showSelectedBox?: boolean;
  apiSource?: 'secure' | 'direct';
}
```

**Usage:**
```tsx
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';

<CustomerSearchSelector
  value={selectedCustomerId}
  onChange={(id, customer) => setSelectedCustomerId(id)}
  label="Select Customer"
  required
  showSelectedBox
/>
```

---

## Display Components

### Card

**Location:** `frontend/src/components/ui/Card.tsx`

**Description:** Flexible card container component for displaying content.

**Usage:**
```tsx
import { Card } from '@/components/ui';

<Card className="p-6">
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

---

## Feedback Components

### EnhancedErrorMessage

**Location:** `frontend/src/components/ui/EnhancedErrorMessage.tsx`

**Description:** User-friendly error message component with retry functionality, context, and actionable suggestions.

**Features:**
- User-friendly error message mapping
- Automatic error suggestions based on error type
- Retry functionality with loading states
- Severity levels (error, warning, info)
- Dismissible errors
- Technical details toggle for debugging
- ARIA labels for accessibility
- Responsive design

**Props:**
```typescript
interface EnhancedErrorMessageProps {
  error: Error | string | unknown;
  onRetry?: () => void | Promise<void>;
  context?: string;
  suggestions?: string[];
  severity?: 'error' | 'warning' | 'info';
  showRetry?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  showDetails?: boolean;
}
```

**Usage:**
```tsx
import { EnhancedErrorMessage } from '@/components/ui';

<EnhancedErrorMessage
  error={error}
  onRetry={() => refetch()}
  context="Failed to load customers"
  severity="error"
  showRetry
/>
```

**Best Practices:**
- Always provide `context` for better user understanding
- Use appropriate `severity` levels
- Enable `showRetry` for recoverable errors
- Use `showDetails` only in development

---

## Loading Components

### Loading States Library

**Location:** `frontend/src/components/ui/LoadingStates.tsx`

**Description:** Comprehensive library of loading state components including skeleton loaders, overlays, and progress indicators.

**Components:**

#### TableSkeleton
Loading skeleton for tables.

```tsx
import { TableSkeleton } from '@/components/ui';

<TableSkeleton rows={5} columns={4} showHeader />
```

#### CardSkeleton
Loading skeleton for card grids.

```tsx
import { CardSkeleton } from '@/components/ui';

<CardSkeleton count={3} showImage showFooter />
```

#### ListSkeleton
Loading skeleton for lists.

```tsx
import { ListSkeleton } from '@/components/ui';

<ListSkeleton items={5} showAvatar showSecondary />
```

#### FormSkeleton
Loading skeleton for forms.

```tsx
import { FormSkeleton } from '@/components/ui';

<FormSkeleton fields={5} showSubmit />
```

#### LoadingOverlay
Full-page loading overlay.

```tsx
import { LoadingOverlay } from '@/components/ui';

<LoadingOverlay isLoading={isLoading} message="Loading data..." />
```

#### ProgressIndicator
Progress bar component.

```tsx
import { ProgressIndicator } from '@/components/ui';

<ProgressIndicator 
  progress={75} 
  label="Uploading..." 
  showPercentage 
  variant="success"
/>
```

#### InlineLoading
Inline loading spinner.

```tsx
import { InlineLoading } from '@/components/ui';

<InlineLoading message="Loading..." size="md" />
```

#### LoadingStateWrapper
Conditional loading wrapper.

```tsx
import { LoadingStateWrapper, CardSkeleton } from '@/components/ui';

<LoadingStateWrapper
  isLoading={isLoading}
  skeleton={<CardSkeleton count={3} />}
  loadingMessage="Loading cards..."
>
  <CardGrid cards={cards} />
</LoadingStateWrapper>
```

**Best Practices:**
- Match skeleton structure to actual content
- Use appropriate skeleton type for content type
- Show loading states immediately on user action
- Use `LoadingStateWrapper` for consistent loading patterns

---

## Layout Components

### V4Layout

**Location:** `frontend/src/components/layout/V4Layout.tsx`

**Description:** Main application layout wrapper with top bar, navigation, breadcrumbs, and content area.

**Features:**
- Responsive design
- Breadcrumb navigation
- Page card support
- Mobile-friendly padding

**Usage:**
```tsx
import V4Layout from '@/components/layout/V4Layout';

<V4Layout>
  <YourPageContent />
</V4Layout>
```

---

## Component Patterns

### Responsive Design

All components follow mobile-first responsive design:
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Responsive padding: `p-3 sm:p-4 md:p-6`
- Responsive text: `text-xs sm:text-sm md:text-base`
- Truncation on mobile: `truncate max-w-[120px] sm:max-w-none`

### Accessibility

All components include:
- ARIA labels where appropriate
- Keyboard navigation support
- Focus indicators
- Screen reader compatibility

### Error Handling

Components handle errors gracefully:
- Show user-friendly messages
- Provide retry mechanisms
- Log errors for debugging
- Degrade gracefully

---

## Performance Best Practices

1. **Lazy Loading**: Heavy components should be lazy-loaded
2. **Memoization**: Use `React.memo` for expensive components
3. **Virtual Scrolling**: Use for long lists
4. **Code Splitting**: Split large components into smaller ones
5. **Skeleton Loaders**: Show immediately on data fetch

---

## Type Safety

All components are fully typed with TypeScript:
- Props interfaces exported
- Type-safe event handlers
- Generic types where appropriate
- No `any` types in component props

---

## Testing

Components should include:
- Unit tests for rendering
- Interaction tests
- Accessibility tests
- Error state tests

---

## Contributing

When adding new components:
1. Follow existing patterns
2. Add JSDoc comments
3. Include TypeScript types
4. Add responsive design
5. Include accessibility features
6. Write tests
7. Update this documentation

---

**Last Updated:** 2025-11-18

