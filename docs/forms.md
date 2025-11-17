---
# Cursor Rule Metadata
version: 1.3
project: VeroField
scope:
  - frontend
priority: critical
last_updated: 2025-11-11 20:13:54
always_apply: true
---

# PRIORITY: CRITICAL - Form Patterns

## PRIORITY: CRITICAL - Standard Form Pattern

**ALL forms MUST:**
1. Use react-hook-form with zod validation
2. Use CustomerSearchSelector for customer fields
3. Use standard Input, Select, Textarea components
4. Follow Dialog pattern for modal forms
5. Use consistent error handling
6. Match spacing and layout patterns

---

## PRIORITY: CRITICAL - Form Implementation Template

```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/ui/Input';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/CRMComponents';
import Button from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

// 1. Define validation schema
const formSchema = z.object({
  customer_id: z.string().uuid('Please select a valid customer'),
  service_type: z.string().min(1, 'Service type is required'),
  // ... other fields
});

type FormData = z.infer<typeof formSchema>;

// 2. Use react-hook-form with Controller
const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: { /* ... */ }
});

// 3. Render form with standard components
<form onSubmit={handleSubmit(onSubmit)}>
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
  {/* ... other fields */}
  <Button type="submit" variant="primary">Submit</Button>
</form>
```

---

## PRIORITY: CRITICAL - Dialog/Modal Pattern

```typescript
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Form Title</DialogTitle>
    </DialogHeader>
    
    {/* Form content */}
    
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleSubmit}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## PRIORITY: HIGH - Form Validation Rules

### Required Patterns
- **ALL forms** MUST use `react-hook-form` with `zodResolver`
- **ALL customer fields** MUST use `CustomerSearchSelector`
- **ALL forms** MUST use `Controller` from react-hook-form for form fields
- **ALL forms** MUST have proper error handling and display

### Prohibited Patterns
- ❌ NEVER use basic Select dropdown for customers
- ❌ NEVER create custom form validation logic
- ❌ NEVER skip zod schema validation
- ❌ NEVER use uncontrolled form inputs





