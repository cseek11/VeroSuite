---
title: Component Catalog
category: Reference
status: active
last_reviewed: 2025-11-11
owner: frontend_team
related:
  - docs/guides/development/component-library.md
  - docs/guides/development/best-practices.md
---

# Component Library Catalog

## Quick Reference Guide

This document provides a quick reference to all available reusable components in the VeroField application.

---

## 📍 Location

All reusable components are located in: `frontend/src/components/ui/`

---

## 📦 Available Components

### Form Input Components

#### `Input`
**File:** `Input.tsx`  
**Usage:** Standard text input fields
```typescript
import Input from '@/components/ui/Input';

<Input
  label="Customer Name"
  value={name}
  onChange={setName}
  placeholder="Enter name"
  error={errors.name}
  required
/>
```

#### `Textarea`
**File:** `Textarea.tsx`  
**Usage:** Multi-line text input
```typescript
import Textarea from '@/components/ui/Textarea';

<Textarea
  label="Description"
  value={description}
  onChange={setDescription}
  rows={4}
  error={errors.description}
/>
```

#### `Select` (Compound Component)
**File:** `CRMComponents.tsx`  
**Usage:** Dropdown selections
```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/CRMComponents';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### `CustomerSearchSelector`
**File:** `CustomerSearchSelector.tsx`  
**Usage:** **ALWAYS use for customer selection**
```typescript
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';

<CustomerSearchSelector
  value={customerId}
  onChange={(id, customer) => {
    setCustomerId(id);
    setCustomer(customer);
  }}
  label="Customer"
  required
  showSelectedBox={true}
  apiSource="direct"  // or "secure"
  error={errors.customer_id}
/>
```

#### `Checkbox`
**File:** `Checkbox.tsx`  
**Usage:** Boolean selections
```typescript
import Checkbox from '@/components/ui/Checkbox';

<Checkbox
  checked={isActive}
  onChange={setIsActive}
  label="Active Status"
/>
```

#### `Switch`
**File:** `Switch.tsx`  
**Usage:** Toggle switches
```typescript
import { Switch } from '@/components/ui/CRMComponents';

<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
  id="feature-toggle"
/>
```

#### `Label`
**File:** `Label.tsx`  
**Usage:** Form field labels
```typescript
import { Label } from '@/components/ui/Label';

<Label htmlFor="field-id">Field Name</Label>
```

#### `MaskedInput`
**File:** `MaskedInput.tsx`  
**Usage:** Formatted inputs (phone, SSN, etc.)
```typescript
import MaskedInput from '@/components/ui/MaskedInput';

<MaskedInput
  mask="(999) 999-9999"
  value={phone}
  onChange={setPhone}
/>
```

---

### Layout Components

#### `Card`
**File:** `Card.tsx`  
**Usage:** Content containers
```typescript
import Card from '@/components/ui/Card';

<Card title="Section Title">
  {/* Content */}
</Card>
```

#### `Button`
**File:** `Button.tsx`  
**Usage:** Action buttons
```typescript
import Button from '@/components/ui/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Save
</Button>

// Variants: primary, secondary, outline, danger, success
// Sizes: sm, md, lg
```

#### `Dialog`
**File:** `Dialog.tsx`  
**Usage:** Modal dialogs
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    
    {/* Content */}
    
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleSubmit}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### `Modal`
**File:** `Modal.tsx`  
**Usage:** Alternative modal component
```typescript
import { Modal } from '@/components/ui/Modal';

<Modal isOpen={isOpen} onClose={handleClose}>
  {/* Content */}
</Modal>
```

---

### Feedback Components

#### `Tooltip`
**File:** `Tooltip.tsx`  
**Usage:** Hover information
```typescript
import { Tooltip } from '@/components/ui/Tooltip';

<Tooltip content="Helpful information">
  <button>Hover me</button>
</Tooltip>
```

#### `ConfirmationDialog`
**File:** `ConfirmationDialog.tsx`  
**Usage:** Confirm destructive actions
```typescript
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';

<ConfirmationDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Item"
  message="Are you sure you want to delete this item?"
/>
```

---

### Status Components

#### `Status`
**File:** `CRMComponents.tsx`  
**Usage:** Status indicators
```typescript
import { Status } from '@/components/ui/CRMComponents';

<Status variant="success">Active</Status>
<Status variant="warning">Pending</Status>
<Status variant="danger">Error</Status>
```

#### `Badge`
**File:** `CRMComponents.tsx`  
**Usage:** Badges/tags
```typescript
import { Badge } from '@/components/ui/CRMComponents';

<Badge variant="primary">VIP</Badge>
<Badge variant="success">Paid</Badge>
```

---

## 🔄 Standard Patterns

### Form Pattern
```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  customer_id: z.string().uuid(),
  service_type: z.string().min(1),
});

const { control, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});

<form onSubmit={handleSubmit(onSubmit)}>
  <Controller
    name="customer_id"
    control={control}
    render={({ field }) => (
      <CustomerSearchSelector
        value={field.value}
        onChange={(id, customer) => field.onChange(id)}
        error={errors.customer_id?.message}
      />
    )}
  />
</form>
```

---

## 📚 Related Documentation

- [Development Best Practices](../../guides/development/best-practices.md) - Complete best practices guide
- [Component Library Guide](../../guides/development/component-library.md) - Component usage guide
- [Styling Guide](../../guides/development/styling-guide.md) - Styling system
- [Design System Reference](design-system.md) - Design patterns

---

**Last Updated:** 2025-11-11  
**Maintained By:** Frontend Team  
**Review Frequency:** On component changes

