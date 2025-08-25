# CRM Styling System Guide

## Overview

The CRM Styling System provides a comprehensive, professional, and compact design system for the VeroPest Suite CRM. It standardizes form fields, reduces spacing, and creates a more efficient user experience.

## Key Principles

- **Compact & Professional**: Reduced padding, smaller text sizes, optimized spacing
- **Consistent**: Unified styling across all components
- **Accessible**: Maintains accessibility standards while being compact
- **Responsive**: Optimized for desktop, tablet, and mobile use

## Base Typography

### Headings
```css
h1 { @apply text-2xl font-bold text-gray-900 mb-4; }
h2 { @apply text-xl font-semibold text-gray-900 mb-3; }
h3 { @apply text-lg font-semibold text-gray-900 mb-2; }
h4 { @apply text-base font-medium text-gray-900 mb-2; }
h5 { @apply text-sm font-medium text-gray-900 mb-1; }
h6 { @apply text-xs font-medium text-gray-900 mb-1; }
```

### Body Text
```css
p { @apply text-sm text-gray-700 leading-relaxed; }
.text-xs { @apply text-xs leading-tight; }
.text-sm { @apply text-sm leading-relaxed; }
.text-base { @apply text-sm leading-relaxed; }
.text-lg { @apply text-base leading-relaxed; }
```

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
<select className="crm-select">
  <option value="">Select an option</option>
  <option value="commercial">Commercial</option>
  <option value="residential">Residential</option>
</select>
```

### Checkboxes
```jsx
<Checkbox
  checked={isActive}
  onChange={setIsActive}
  label="Active Customer"
/>
```

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

### Button Sizes
- `xs`: 24px height, extra small
- `sm`: 32px height, small
- `md`: 36px height, medium (default)
- `lg`: 40px height, large

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

### Compact Cards
```jsx
<div className="crm-card-compact">
  <div className="crm-card-header">
    <h3>Quick Actions</h3>
  </div>
  <div className="crm-card-body">
    <div className="flex gap-2">
      <Button variant="primary" size="sm">Schedule Service</Button>
      <Button variant="outline" size="sm">Send Message</Button>
    </div>
  </div>
</div>
```

## Table System

### Standard Tables
```jsx
<table className="crm-table">
  <thead>
    <tr>
      <th>Customer Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>john@example.com</td>
      <td>(555) 123-4567</td>
      <td>
        <Button variant="outline" size="sm">Edit</Button>
      </td>
    </tr>
  </tbody>
</table>
```

### Compact Tables
```jsx
<table className="crm-table-compact">
  {/* Same structure as standard table but with reduced padding */}
</table>
```

## Layout System

### Spacing Utilities
```css
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

## Navigation System

### Navigation Items
```jsx
<nav className="crm-nav-compact">
  <a className="crm-nav-item crm-nav-item-active">
    <Home className="w-4 h-4 mr-2" />
    Dashboard
  </a>
  <a className="crm-nav-item crm-nav-item-inactive">
    <Users className="w-4 h-4 mr-2" />
    Customers
  </a>
</nav>
```

## Modal System

### Standard Modal
```jsx
<div className="crm-modal-overlay">
  <div className="crm-modal">
    <div className="crm-modal-header">
      <h3>Edit Customer</h3>
      <button onClick={onClose}>
        <X className="w-5 h-5" />
      </button>
    </div>
    <div className="crm-modal-body">
      <div className="crm-space-md">
        <Input label="Name" value={name} onChange={setName} />
        <Input label="Email" value={email} onChange={setEmail} />
      </div>
    </div>
    <div className="crm-modal-footer">
      <Button variant="outline" onClick={onClose}>Cancel</Button>
      <Button variant="primary" onClick={onSave}>Save</Button>
    </div>
  </div>
</div>
```

## Responsive Design

### Mobile Optimizations
- Form fields: 44px minimum height for touch targets
- Buttons: 44px minimum height
- Text: Slightly larger for readability
- Spacing: Reduced padding on mobile

### Tablet Optimizations
- Reduced card padding
- Optimized table layouts
- Maintained touch targets

## Accessibility Features

### Focus Management
```css
.crm-focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2;
}
```

### High Contrast Support
- Enhanced borders in high contrast mode
- Maintained color contrast ratios
- Clear focus indicators

### Reduced Motion Support
- Disabled transitions for users who prefer reduced motion
- Maintained functionality without animations

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

### Table Design
1. Use compact tables for data-heavy views
2. Include hover states for better UX
3. Maintain consistent column alignment
4. Use appropriate text sizes for readability

## Migration Guide

### From Old Styling to CRM Styling

#### Before (Old Styling)
```jsx
<div className="p-6 bg-white rounded-xl shadow-lg">
  <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
      <input className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
    </div>
    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg">
      Save
    </button>
  </div>
</div>
```

#### After (CRM Styling)
```jsx
<Card title="Customer Information">
  <div className="crm-space-md">
    <Input label="Name" value={name} onChange={setName} />
    <Button variant="primary">Save</Button>
  </div>
</Card>
```

### Key Changes
1. **Reduced Padding**: From `p-6` to `p-4` (cards) or `p-3` (compact)
2. **Smaller Text**: From `text-2xl` to `text-xl` for headings
3. **Compact Spacing**: From `space-y-4` to `crm-space-md`
4. **Unified Components**: Use `Input`, `Button`, `Card` components
5. **Consistent Styling**: All form fields use `crm-input` classes

## Performance Benefits

### Reduced CSS Bundle Size
- Consolidated styling system
- Eliminated duplicate styles
- Optimized class names

### Improved Rendering Performance
- Reduced DOM complexity
- Optimized spacing calculations
- Consistent layout patterns

### Better User Experience
- Faster data entry with compact forms
- Reduced scrolling with optimized layouts
- Consistent visual hierarchy
- Professional appearance

## Future Enhancements

### Planned Features
1. **Theme System**: Support for multiple color themes
2. **Dark Mode**: Complete dark mode support
3. **Custom Components**: Additional specialized components
4. **Animation System**: Subtle animations for better UX
5. **Icon System**: Unified icon usage patterns

### Extension Points
1. **Custom Variants**: Easy addition of new button/form variants
2. **Component Composition**: Flexible component combinations
3. **Style Overrides**: Controlled customization options
4. **Plugin System**: Third-party component integration
