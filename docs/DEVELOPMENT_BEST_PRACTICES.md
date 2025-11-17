# Development Best Practices & Consistency Guide

## 🎯 Core Principle
**"Reuse, Don't Reinvent"** - Always check for existing components, patterns, and solutions before creating new ones.

---

## 📚 Component Library Catalog

### Available Reusable Components
**Location:** `frontend/src/components/ui/`

#### Form Components
| Component | File | Usage | When to Use |
|-----------|------|-------|-------------|
| `Input` | `Input.tsx` | Text inputs, email, password, etc. | Standard text input fields |
| `Textarea` | `Textarea.tsx` | Multi-line text input | Notes, descriptions, comments |
| `Select` | `CRMComponents.tsx` | Dropdown selections | Predefined options |
| `Checkbox` | `Checkbox.tsx` | Boolean selections | Toggles, agreements |
| `Switch` | `Switch.tsx` | Toggle switches | Settings, feature flags |
| `Label` | `Label.tsx` | Form field labels | All form fields |
| `CustomerSearchSelector` | `CustomerSearchSelector.tsx` | Customer search/select | **ALWAYS** for customer selection |
| `MaskedInput` | `MaskedInput.tsx` | Formatted inputs | Phone, SSN, dates |

#### Layout Components
| Component | File | Usage | When to Use |
|-----------|------|-------|-------------|
| `Card` | `Card.tsx` | Content containers | Sections, panels, containers |
| `Button` | `Button.tsx` | Action buttons | All buttons (primary, secondary, etc.) |
| `Dialog` | `Dialog.tsx` | Modal dialogs | Forms, confirmations, details |
| `Modal` | `Modal.tsx` | Modal overlays | Alternative to Dialog |
| `Form` | `Form.tsx` | Form wrapper | Form containers with validation |

#### Feedback Components
| Component | File | Usage | When to Use |
|-----------|------|-------|-------------|
| `Tooltip` | `Tooltip.tsx` | Hover information | Help text, descriptions |
| `ConfirmationDialog` | `ConfirmationDialog.tsx` | Confirm actions | Delete, destructive actions |
| `ReusablePopup` | `ReusablePopup.tsx` | Popup messages | Notifications, alerts |

#### Status Components
| Component | File | Usage | When to Use |
|-----------|------|-------|-------------|
| `Status` | `CRMComponents.tsx` | Status indicators | Active, pending, completed |
| `Badge` | `CRMComponents.tsx` | Badges/tags | Categories, labels |

---

## 🔄 Standard Patterns

### Form Pattern (Standard)
```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/CRMComponents';

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
  
  <Button type="submit" variant="primary">Submit</Button>
</form>
```

### Dialog/Modal Pattern
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

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

### Customer Selection Pattern
```typescript
// ✅ ALWAYS use CustomerSearchSelector
<CustomerSearchSelector
  value={formData.customer_id}
  onChange={(customerId, customer) => {
    setFormData(prev => ({ ...prev, customer_id: customerId }));
    setSelectedCustomer(customer);
  }}
  label="Customer"
  required
  showSelectedBox={true}  // Show blue box when selected
  apiSource="direct"      // or "secure" depending on context
  error={errors.customer_id?.message}
/>

// ❌ NEVER create custom customer search
// ❌ NEVER use basic Select for customers
```

### Service Type Selection Pattern
```typescript
// ✅ Use Select with service types from API
const { data: serviceTypes } = useQuery({
  queryKey: ['service-types'],
  queryFn: () => enhancedApi.serviceTypes.getAll(),
});

<Select value={formData.service_type} onValueChange={setServiceType}>
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
```

---

## 🤖 AI Assistant Guidelines

### Pre-Implementation Checklist
**Before implementing ANY feature, AI must:**

1. **Search for Existing Components**
   ```
   "Search for existing [component type] in frontend/src/components/ui/"
   "Check if [feature] already exists in the codebase"
   "Find similar implementations of [pattern]"
   ```

2. **Review Component Library**
   ```
   "Review frontend/src/components/ui/index.ts for available components"
   "Check component documentation in frontend/src/components/ui/*.md"
   "Review CRM_STYLING_GUIDE.md and DESIGN_SYSTEM.md"
   ```

3. **Identify Patterns**
   ```
   "Find how [similar feature] is implemented in other forms"
   "Check existing form patterns in WorkOrderForm, InvoiceForm, etc."
   "Review standard validation patterns"
   ```

4. **Check Documentation**
   ```
   "Review all .md files for existing patterns"
   "Check for style guides and best practices"
   "Look for component usage examples"
   ```

### Implementation Rules

#### Rule 1: Component Reuse
```
BEFORE creating a new component:
1. Search frontend/src/components/ui/ for similar components
2. Check if existing component can be extended
3. Review component props and capabilities
4. Only create new component if no suitable option exists
```

#### Rule 2: Form Consistency
```
ALL forms MUST:
1. Use react-hook-form with zod validation
2. Use CustomerSearchSelector for customer fields
3. Use standard Input, Select, Textarea components
4. Follow Dialog pattern for modal forms
5. Use consistent error handling
6. Match spacing and layout patterns
```

#### Rule 3: Pattern Matching
```
BEFORE implementing:
1. Find 2-3 similar implementations
2. Identify common patterns
3. Reuse established patterns
4. Only deviate if specific requirement exists
```

#### Rule 4: Code Location
```
Components MUST be placed in:
- Reusable UI: frontend/src/components/ui/
- Feature-specific: frontend/src/components/[feature]/
- Forms: Use standard form pattern
- Dialogs: Use Dialog component from ui/
```

---

## 🚫 Anti-Patterns (What NOT to Do)

### ❌ Don't Create Duplicate Components
```typescript
// ❌ BAD: Creating custom customer search
const [customers, setCustomers] = useState([]);
const [search, setSearch] = useState('');
// ... custom implementation

// ✅ GOOD: Use CustomerSearchSelector
<CustomerSearchSelector value={id} onChange={handleChange} />
```

### ❌ Don't Reinvent Form Patterns
```typescript
// ❌ BAD: Custom form handling
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});
// ... manual validation

// ✅ GOOD: Use react-hook-form + zod
const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema)
});
```

### ❌ Don't Create Inline Components
```typescript
// ❌ BAD: Component defined in same file
function MyForm() {
  const CustomInput = ({ ... }) => { /* ... */ };
  return <CustomInput />;
}

// ✅ GOOD: Extract to separate file
// frontend/src/components/ui/CustomInput.tsx
export default function CustomInput({ ... }) { /* ... */ }
```

### ❌ Don't Mix Styling Approaches
```typescript
// ❌ BAD: Inconsistent styling
<div className="p-6 bg-white rounded-xl">
  <input className="w-full px-4 py-3 border" />
</div>

// ✅ GOOD: Use standard components
<Card>
  <Input label="Name" value={name} onChange={setName} />
</Card>
```

---

## ✅ Prevention Strategy

### 1. Component Discovery Protocol
**Before writing code:**
```bash
# Search for existing components
grep -r "customer.*search" frontend/src/components/
grep -r "form.*validation" frontend/src/components/
codebase_search "How is customer selection implemented?"
```

### 2. Pattern Documentation
- **Component Catalog**: Maintained in this document
- **Usage Examples**: In component files and guides
- **Migration Guides**: For updating old code

### 3. Code Review Checklist
**Every PR must verify:**
- [ ] Uses existing components from `ui/` directory
- [ ] Follows established form patterns
- [ ] Matches styling from CRM_STYLING_GUIDE.md
- [ ] No duplicate functionality
- [ ] Proper TypeScript interfaces
- [ ] Error handling consistent with patterns

### 4. Automated Checks (Future)
```typescript
// ESLint rules to enforce:
// - Import from ui/ directory
// - Use CustomerSearchSelector for customer fields
// - Use standard form components
// - Follow naming conventions
```

### 5. Developer Onboarding
**New developers must:**
1. Read this document
2. Review component library (`frontend/src/components/ui/`)
3. Study 2-3 existing form implementations
4. Review style guides
5. Understand validation patterns

---

## 📋 Standard Form Checklist

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

## 🔍 Component Discovery Commands

### For AI Assistants
```typescript
// 1. Find existing components
codebase_search("How is [feature] implemented?")
glob_file_search("**/[component-name]*.tsx")
list_dir("frontend/src/components/ui")

// 2. Find similar patterns
grep -r "pattern-name" frontend/src/components/
codebase_search("Where is [pattern] used?")

// 3. Review documentation
glob_file_search("**/*GUIDE*.md")
glob_file_search("**/*PATTERN*.md")
read_file("frontend/src/CRM_STYLING_GUIDE.md")
```

---

## 📖 Reference Documents

1. **CRM_STYLING_GUIDE.md** - Styling system and CSS classes
2. **DESIGN_SYSTEM.md** - Layout patterns and design standards
3. **AI_ASSISTANT_BEST_PRACTICES.md** - AI development guidelines
4. **CUSTOMER_SEARCH_SELECTOR_GUIDE.md** - Customer search usage
5. **This Document** - Component library and patterns

---

## 🎯 Quick Reference

### Most Common Components
```typescript
// Forms
import Input from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/CRMComponents';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';
import Button from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

// Layout
import Card from '@/components/ui/Card';

// Validation
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
```

### Standard Imports Pattern
```typescript
// 1. React & Hooks
import React, { useState, useEffect } from 'react';

// 2. Form Libraries
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 3. UI Components (from ui/)
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';

// 4. Icons
import { Search, User, Plus } from 'lucide-react';

// 5. API/Data
import { enhancedApi } from '@/lib/enhanced-api';
import { useQuery, useMutation } from '@tanstack/react-query';
```

---

## 🚀 Future Enhancements

### Planned Improvements
1. **Component Storybook**: Visual component library
2. **ESLint Rules**: Enforce component usage
3. **TypeScript Types**: Shared form types
4. **Form Builder**: Visual form creation tool
5. **Component Tests**: Automated component testing

---

## 📝 Notes for AI Assistants

**When implementing features:**
1. **ALWAYS** search for existing components first
2. **ALWAYS** check component library (`frontend/src/components/ui/`)
3. **ALWAYS** review similar implementations
4. **ALWAYS** follow established patterns
5. **NEVER** create duplicate functionality
6. **NEVER** skip the discovery phase

**When in doubt:**
- Review 2-3 similar implementations
- Check component documentation
- Follow the most common pattern
- Ask for clarification if needed

---

**Last Updated:** 2025-01-10
**Maintained By:** Development Team
**Review Frequency:** Monthly






