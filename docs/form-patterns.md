---
title: Form Implementation Patterns
category: Development
status: active
last_reviewed: 2025-12-05
owner: frontend_team
related:
  - docs/guides/development/best-practices.md
  - docs/guides/development/component-library.md
  - docs/guides/development/styling-guide.md
---

# Form Implementation Patterns

## Overview

This guide documents the standard patterns for implementing forms in VeroField. All forms should follow these patterns for consistency and maintainability.

---

## Standard Form Pattern

### Complete Form Example

```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/CRMComponents';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

// 1. Define validation schema
const formSchema = z.object({
  customer_id: z.string().uuid('Please select a valid customer'),
  service_type: z.string().min(1, 'Service type is required'),
  notes: z.string().optional(),
  // ... other fields
});

type FormData = z.infer<typeof formSchema>;

// 2. Use react-hook-form with Controller
function MyForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { /* ... */ }
  });

  const onSubmit = async (data: FormData) => {
    // Handle form submission
  };

  // 3. Render form with standard components
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Controller
          name="customer_id"
          control={control}
          render={({ field }) => (
            <CustomerSearchSelector
              value={field.value}
              onChange={(id, customer) => field.onChange(id)}
              label="Customer"
              required
              showSelectedBox={true}
              apiSource="direct"
              error={errors.customer_id?.message}
            />
          )}
        />
        
        <Controller
          name="service_type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="type1">Type 1</SelectItem>
                {/* ... */}
              </SelectContent>
            </Select>
          )}
        />
        
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}
```

---

## Dialog/Modal Form Pattern

### Standard Modal Form

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

function ModalForm() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Form Title</DialogTitle>
        </DialogHeader>
        
        {/* Form content using standard form pattern */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form fields */}
        </form>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Customer Selection Pattern

### Always Use CustomerSearchSelector

```typescript
// ✅ ALWAYS use CustomerSearchSelector
<Controller
  name="customer_id"
  control={control}
  render={({ field }) => (
    <CustomerSearchSelector
      value={field.value}
      onChange={(id, customer) => {
        field.onChange(id);
        setSelectedCustomer(customer);
      }}
      label="Customer"
      required
      showSelectedBox={true}  // Show blue box when selected
      apiSource="direct"      // or "secure" depending on context
      error={errors.customer_id?.message}
    />
  )}
/>

// ❌ NEVER create custom customer search
// ❌ NEVER use basic Select for customers
```

---

## Service Type Selection Pattern

### Fetch from API

```typescript
// ✅ Use Select with service types from API
const { data: serviceTypes } = useQuery({
  queryKey: ['service-types'],
  queryFn: () => enhancedApi.serviceTypes.getAll(),
});

<Controller
  name="service_type"
  control={control}
  render={({ field }) => (
    <Select value={field.value} onValueChange={field.onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select service type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Select service type</SelectItem>
        {serviceTypes?.map(st => (
          <SelectItem key={st.id} value={st.service_name}>
            {st.service_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
/>
```

---

## Form Validation

### Zod Schema Pattern

```typescript
const formSchema = z.object({
  // Required string
  name: z.string().min(1, 'Name is required'),
  
  // Email validation
  email: z.string().email('Invalid email address'),
  
  // UUID validation
  customer_id: z.string().uuid('Please select a valid customer'),
  
  // Optional field
  notes: z.string().optional(),
  
  // Number validation
  amount: z.number().min(0, 'Amount must be positive'),
  
  // Date validation
  date: z.date(),
  
  // Enum validation
  status: z.enum(['active', 'inactive', 'pending']),
});
```

---

## Error Handling

### Display Errors

```typescript
// Errors are automatically passed to components via error prop
<Input
  label="Name"
  value={field.value}
  onChange={field.onChange}
  error={errors.name?.message}
/>

// For custom error display
{errors.root && (
  <div className="text-red-600 text-sm">{errors.root.message}</div>
)}
```

---

## Form Checklist

When creating a new form, ensure:

- [ ] Uses `react-hook-form` with `zod` validation
- [ ] Uses `CustomerSearchSelector` for customer fields
- [ ] Uses `Input`, `Select`, `Textarea` from `ui/`
- [ ] Uses `Button` component with proper variants
- [ ] Uses `Dialog` component for modal forms
- [ ] Follows spacing patterns (`space-y-4`, `gap-4`)
- [ ] Uses `Label` component for field labels
- [ ] Implements proper error display
- [ ] Matches existing form layouts
- [ ] Uses consistent button placement (Cancel left, Submit right)

---

## Related Documentation

- [Development Best Practices](best-practices.md) - Complete best practices guide
- [Component Library Guide](component-library.md) - Component usage
- [Styling Guide](styling-guide.md) - Form styling

---

**Last Updated:** 2025-12-05  
**Maintained By:** Frontend Team  
**Review Frequency:** On form pattern changes

