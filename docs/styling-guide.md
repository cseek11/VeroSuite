---
title: Styling Guide
category: Development
status: active
last_reviewed: 2025-11-11
owner: frontend_team
related:
  - docs/reference/design-system.md
  - docs/guides/development/best-practices.md
  - docs/guides/development/component-library.md
---

# CRM Styling System Guide

## Overview

The CRM Styling System provides a comprehensive, professional, and compact design system for the VeroField CRM. It standardizes form fields, reduces spacing, and creates a more efficient user experience.

## Key Principles (Enterprise CRM Standards)

- **Information Density**: Maximize data per viewport without clutter (target: 14-16 visible rows per 1080p screen)
- **Compact & Professional**: Reduced padding, smaller text sizes, optimized spacing
- **Hierarchical Clarity**: Visual rhythm and clear grouping with consistent spacing
- **Minimal Cognitive Friction**: Uniform alignment, consistent spacing (8px base grid)
- **Reduced Visual Fatigue**: Neutral colors, restrained elevation (subtle shadows)
- **Consistent**: Unified styling across all components
- **Accessible**: Maintains WCAG AA+ contrast ratios while being compact
- **Responsive**: Optimized for desktop, tablet, and mobile use

---

## Base Typography (Enterprise CRM Standards)

### Headings
```css
/* Enterprise Standard - Page Title */
h1 { @apply text-xl font-bold text-slate-900 mb-4 leading-tight; } /* 20px, line-height 1.3 */

/* Enterprise Standard - Section Header */
h2 { @apply text-base font-semibold text-slate-900 mb-3 leading-normal; } /* 16px, line-height 1.4 */

/* Enterprise Standard - Subsection Header */
h3 { @apply text-sm font-semibold text-slate-900 mb-2 leading-normal; } /* 14px, line-height 1.4 */

h4 { @apply text-sm font-medium text-slate-900 mb-2 leading-normal; }
h5 { @apply text-xs font-medium text-slate-900 mb-1 leading-normal; }
h6 { @apply text-xs font-medium text-slate-900 mb-1 leading-normal; }
```

### Body Text
```css
p { @apply text-sm text-slate-700 leading-relaxed; } /* 14px, line-height 1.5 */
.text-xs { @apply text-xs leading-normal; } /* 12px, line-height 1.4 */
.text-sm { @apply text-sm leading-relaxed; } /* 14px, line-height 1.5 */
.text-base { @apply text-sm leading-relaxed; } /* 14px, line-height 1.5 */
.text-lg { @apply text-base leading-normal; } /* 16px, line-height 1.4 */
```

### Enterprise Typography Tokens
- `text-enterprise-xl` (20px) - Page titles
- `text-enterprise-md` (16px) - Section headers
- `text-enterprise-base` (14px) - Body text
- `text-enterprise-xs` (12px) - Secondary/metadata
- `leading-enterprise-tight` (1.3) - Headings
- `leading-enterprise-normal` (1.4) - Subheads
- `leading-enterprise-relaxed` (1.5) - Body text

**Note**: We use `slate-*` colors instead of `gray-*` per design system standards.

---

## Form System

### Input Fields
```jsx
// Standard input
<Input
  label="Customer Name"
  value={name}
  onChange={setName}
  placeholder="Enter customer name"
  className="w-full"
/>

// With icon
<Input
  label="Email"
  value={email}
  onChange={setEmail}
  icon={Mail}
  placeholder="customer@example.com"
  className="w-full"
/>

// With error
<Input
  label="Phone"
  value={phone}
  onChange={setPhone}
  error="Please enter a valid phone number"
  className="w-full"
/>
```

### Textarea
```jsx
<Textarea
  label="Notes"
  value={notes}
  onChange={setNotes}
  placeholder="Enter customer notes..."
  rows={3}
  className="w-full"
/>
```

### Select Dropdowns
```jsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/CRMComponents';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="commercial">Commercial</SelectItem>
    <SelectItem value="residential">Residential</SelectItem>
  </SelectContent>
</Select>
```

### Checkboxes
```jsx
<Checkbox
  checked={isActive}
  onChange={setIsActive}
  label="Active Customer"
/>
```

---

## Button System

### Button Variants
```jsx
// Primary button
<Button variant="primary" size="md">
  Save Customer
</Button>

// Secondary button
<Button variant="secondary" size="sm">
  Cancel
</Button>

// Success button
<Button variant="success" size="md">
  <Check className="w-4 h-4 mr-2" />
  Complete
</Button>

// Danger button
<Button variant="danger" size="sm">
  <Trash2 className="w-4 h-4 mr-2" />
  Delete
</Button>

// Outline button
<Button variant="outline" size="md">
  Edit
</Button>
```

### Button Sizes (Enterprise Standard)
- `xs`: 24px height, extra small (sparingly used)
- `sm`: 32px height, small (recommended for compact interfaces)
- `md`: 36px height, medium (default, recommended)
- `lg`: 40px height, large (avoid for enterprise - too large)

---

## Card System

### Standard Cards
```jsx
<Card title="Customer Information">
  <div className="space-y-3">
    <Input label="Name" value={name} onChange={setName} />
    <Input label="Email" value={email} onChange={setEmail} />
  </div>
</Card>
```

### Card Styling (Enterprise Standard)
```css
/* Dashboard Card - Standard Padding */
bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-4

/* Data-heavy Card - Compact Padding (Tables, Lists) */
bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-3

/* Compact Card - Minimal Padding */
crm-card-compact
```

---

## Layout System

### Page Container (Enterprise Standard)
```css
/* Enterprise Standard - Increased Padding */
min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6
/* or p-8 for maximum breathing room (24-32px) */
```

### Spacing Utilities (Enterprise - 8px Base Grid)
```css
/* Enterprise Spacing Tokens */
.enterprise-space-1 { @apply space-y-1; }    /* 4px - Tight spacing */
.enterprise-space-2 { @apply space-y-2; }    /* 8px - Base unit */
.enterprise-space-3 { @apply space-y-3; }    /* 12px - Field groups */
.enterprise-space-4 { @apply space-y-4; }    /* 16px - Section blocks */

.enterprise-gap-1 { @apply gap-1; }          /* 4px */
.enterprise-gap-2 { @apply gap-2; }          /* 8px - Base unit */
.enterprise-gap-3 { @apply gap-3; }          /* 12px */
.enterprise-gap-4 { @apply gap-4; }          /* 16px */

/* Legacy CRM Spacing (still supported) */
.crm-space-xs { @apply space-y-1; }    /* 4px */
.crm-space-sm { @apply space-y-2; }    /* 8px */
.crm-space-md { @apply space-y-3; }    /* 12px */
.crm-space-lg { @apply space-y-4; }    /* 16px */

.crm-gap-xs { @apply gap-1; }          /* 4px */
.crm-gap-sm { @apply gap-2; }          /* 8px */
.crm-gap-md { @apply gap-3; }          /* 12px */
.crm-gap-lg { @apply gap-4; }          /* 16px */
```

### Form Layout
```jsx
// Single field
<div className="crm-field">
  <Input label="Name" value={name} onChange={setName} />
</div>

// Row of fields
<div className="crm-field-row">
  <div className="crm-field-col">
    <Input label="First Name" value={firstName} onChange={setFirstName} />
  </div>
  <div className="crm-field-col">
    <Input label="Last Name" value={lastName} onChange={setLastName} />
  </div>
</div>

// Form sections
<div className="crm-form-section">
  <div className="crm-form-section-title">Contact Information</div>
  <div className="crm-space-sm">
    <Input label="Email" value={email} onChange={setEmail} />
    <Input label="Phone" value={phone} onChange={setPhone} />
  </div>
</div>
```

---

## Color Palette

### Primary Colors
- **Indigo**: `#6366F1` (Primary brand color)
- **Purple**: `#8B5CF6` (Secondary brand color)
- **Emerald**: `#10B981` (Success/positive)
- **Amber**: `#F59E0B` (Warning/attention)
- **Rose**: `#EF4444` (Error/danger)

### Background Colors
- **Page Background**: `from-slate-50 via-blue-50 to-indigo-50`
- **Card Background**: `bg-white/80 backdrop-blur-xl`
- **Gradient Backgrounds**: Various color combinations with opacity

### Neutral Colors
- **Use `slate-*` instead of `gray-*`** per design system standards
- `text-slate-600` for descriptions
- `border-slate-200` for borders
- `bg-slate-50` for backgrounds

---

## Status Indicators

### Status Badges
```jsx
<span className="crm-status crm-status-success">Active</span>
<span className="crm-status crm-status-warning">Pending</span>
<span className="crm-status crm-status-danger">Overdue</span>
<span className="crm-status crm-status-info">New</span>
<span className="crm-status crm-status-neutral">Inactive</span>
```

### Badges
```jsx
<span className="crm-badge crm-badge-primary">VIP</span>
<span className="crm-badge crm-badge-success">Paid</span>
<span className="crm-badge crm-badge-warning">Pending</span>
<span className="crm-badge crm-badge-danger">Overdue</span>
```

---

## Focus States

### Focus Rings
```css
/* Standard focus ring - INDIGO (not green) */
focus:ring-2 focus:ring-indigo-500 focus:border-transparent

/* Focus ring for form elements */
.crm-focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
}
```

**Important**: Always use `indigo-500` for focus rings, not green.

---

## Responsive Design

### Breakpoints
- **Mobile**: Default (single column)
- **Tablet**: `md:` prefix (768px+)
- **Desktop**: `lg:` prefix (1024px+)

### Responsive Patterns
- **Grid Columns**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Flex Direction**: `flex-col lg:flex-row`
- **Text Sizing**: Responsive text classes as needed

### Mobile Optimizations
- Form fields: 44px minimum height for touch targets
- Buttons: 44px minimum height
- Text: Slightly larger for readability
- Spacing: Reduced padding on mobile

---

## Accessibility Features

### Focus Management
```css
.crm-focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
}
```

### High Contrast Support
- Enhanced borders in high contrast mode
- Maintained color contrast ratios
- Clear focus indicators

### Reduced Motion Support
- Disabled transitions for users who prefer reduced motion
- Maintained functionality without animations

---

## Best Practices

### Form Design
1. Use consistent field spacing (`crm-field`)
2. Group related fields in rows (`crm-field-row`)
3. Use appropriate labels (`crm-label`)
4. Provide clear error messages (`crm-error`)

### Layout Design
1. Use compact spacing utilities (`crm-space-*`, `crm-gap-*`)
2. Group related content in sections (`crm-section`)
3. Use cards for content organization (`crm-card`)
4. Maintain consistent margins and padding

### Button Design
1. Use appropriate button variants for actions
2. Choose correct button sizes for context
3. Include icons for better visual hierarchy
4. Maintain consistent spacing between buttons

### Color Usage
1. **Always use `slate-*` for neutrals**, not `gray-*`
2. Use indigo for primary actions and focus states
3. Use purple for secondary accents
4. Follow semantic colors for status indicators

---

## Migration Guide

### From Old Styling to Enterprise CRM Styling

#### Before (Old/Marketing Styling)
```jsx
<div className="p-3 bg-white rounded-xl shadow-xl">
  <h1 className="text-2xl font-bold mb-4">Customer Information</h1>
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
      <input className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
    </div>
    <button className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow-xl">
      Save
    </button>
  </div>
</div>
```

#### After (Enterprise CRM Styling)
```jsx
<div className="p-6 bg-white rounded-md shadow-sm">
  <h1 className="text-xl font-bold mb-4">Customer Information</h1>
  <div className="space-y-3">
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
      <input className="w-full px-2 py-1.5 border border-slate-200 rounded-md h-8" />
    </div>
    <button className="px-3 py-1.5 bg-purple-600 text-white rounded-md shadow-sm h-8">
      Save
    </button>
  </div>
</div>
```

### Key Changes (Enterprise Migration)
1. **Page Padding**: From `p-3` (12px) to `p-6` or `p-8` (24-32px)
2. **Page Titles**: From `text-2xl` (24px) to `text-xl` (20px)
3. **Section Headers**: From `text-lg` (18px) to `text-base` (16px)
4. **Border Radius**: From `rounded-xl` (12px) to `rounded-md` (4px)
5. **Shadows**: From `shadow-xl` to `shadow-sm` (subtle, professional)
6. **Card Padding**: From `p-4` (16px) to `p-3` (12px) for data-heavy areas
7. **Button Height**: Ensure 32-36px height (`h-8` or `h-9`)
8. **Input Height**: Ensure 32-36px height (`h-8` or `h-9`)
9. **Table Rows**: Ensure 44-48px height (`h-11` or `h-12`)
10. **Spacing**: Use 8px base grid (`gap-2`, `gap-3`, `gap-4`)
11. **Color Migration**: `gray-*` → `slate-*`

### Enterprise-Specific Patterns

#### Data-Heavy Pages (Tables, Lists, Scheduler)
```jsx
// Use compact padding for data-heavy cards
<div className="bg-white rounded-md shadow-sm border border-slate-200 p-3">
  <table className="min-w-full">
    <thead>
      <tr className="h-11"> {/* 44px row height */}
        <th className="px-3 py-2 text-sm font-medium">Header</th>
      </tr>
    </thead>
    <tbody>
      <tr className="h-11 hover:bg-slate-50"> {/* 44px row height */}
        <td className="px-3 py-2 text-sm">Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

#### Dashboard Cards
```jsx
// Use standard padding for dashboard cards
<div className="bg-white rounded-md shadow-sm border border-slate-200 p-4">
  <h2 className="text-base font-semibold mb-3">Dashboard Section</h2>
  {/* Content */}
</div>
```

---

## Display Density Modes

VeroField supports three density modes (Compact, Standard, Comfortable) that adjust spacing, font sizes, and component heights. Density mode is managed via React context and persists to localStorage.

### Using Density Modes in Components

Components automatically scale using CSS variables:

```tsx
// Table rows automatically use density-aware height
<tr style={{ height: 'var(--row-height, 44px)' }}>
  <td>Content</td>
</tr>

// Form inputs scale with density
<input className="crm-input" /> // Uses --density-scale automatically

// Buttons scale with density
<button className="crm-button">Click</button> // Uses --density-scale automatically
```

### Density Mode Context

```tsx
import { useDensityMode } from '@/context/DensityModeContext';

function MyComponent() {
  const { densityMode, setDensityMode } = useDensityMode();
  
  // Access current density mode
  console.log('Current density:', densityMode); // 'compact' | 'standard' | 'comfortable'
  
  // Change density mode (persists to localStorage)
  setDensityMode('compact');
}
```

### CSS Variables

- `--density-scale`: Multiplier for font sizes and spacing (0.9/1.0/1.1)
- `--row-height`: Table row height (40px/44px/48px)

See [Enterprise Styling Guide v2](../reference/enterprise-styling-guide.md) for complete density mode documentation.

## Related Documentation

- [Design System Reference](../reference/design-system.md) - Complete design system
- [Enterprise Styling Guide v2](../reference/enterprise-styling-guide.md) - Enterprise CRM standards and density modes
- [Component Library Guide](component-library.md) - Component usage
- [Development Best Practices](best-practices.md) - Coding standards

---

## Enterprise CRM Standards Summary

### Benchmark Targets
- **Visual Density**: ~14-16 visible rows per standard 1080p screen
- **Readability**: WCAG AA+ contrast ratios maintained
- **Click Efficiency**: 3-4 actions reachable within visible viewport
- **Scan Speed**: 1.2-1.5 seconds average to identify key information

### Anti-Patterns to Avoid
- ❌ Page titles larger than 20px (`text-2xl` = 24px is too large)
- ❌ Border radius larger than 8px (`rounded-xl` = 12px is too playful)
- ❌ Shadows larger than `shadow-md` (`shadow-xl` is too prominent)
- ❌ Page padding less than 24px (`p-3` = 12px is too tight)
- ❌ Card padding of 16px in data-heavy areas (use 12px instead)
- ❌ Table rows smaller than 44px or larger than 48px
- ❌ Button heights larger than 36px (avoid 40px+)

**Last Updated:** 2025-01-27  
**Maintained By:** Frontend Team  
**Review Frequency:** On styling changes  
**Enterprise Standards Applied:** Yes

