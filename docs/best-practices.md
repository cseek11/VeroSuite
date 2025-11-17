---
title: Development Best Practices
category: Development
status: active
last_reviewed: 2025-11-11
owner: frontend_team
related:
  - docs/guides/development/component-library.md
  - docs/guides/development/styling-guide.md
  - docs/guides/development/form-patterns.md
  - docs/reference/design-system.md
---

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

See [Form Patterns Guide](form-patterns.md) for detailed form implementation patterns.

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

**Before implementing ANY feature, AI MUST complete:**

1. **Component Discovery**
   - Search for existing components in `frontend/src/components/ui/`
   - Check component library catalog (see [Component Library Guide](component-library.md))
   - Review similar implementations in the codebase
   - Check for component documentation (*.md files in ui/)

2. **Pattern Analysis**
   - Find 2-3 similar implementations
   - Identify common patterns and conventions
   - Review form patterns (WorkOrderForm, InvoiceForm, etc.)
   - Check validation patterns (react-hook-form + zod)

3. **Documentation Review**
   - Read this document (Development Best Practices)
   - Review [Styling Guide](styling-guide.md)
   - Check [Design System](../reference/design-system.md)
   - Review component-specific guides

4. **Code Location Verification**
   - Verify correct file location
   - Check if component should be in ui/ (reusable) or feature-specific
   - Ensure proper imports and exports

### Discovery Commands

#### For Component Search
```typescript
// 1. List available components
list_dir("frontend/src/components/ui")

// 2. Search for specific component type
codebase_search("How is customer selection implemented?")
glob_file_search("**/*customer*search*.tsx")
glob_file_search("**/*CustomerSearch*.tsx")

// 3. Find similar patterns
grep -r "CustomerSearchSelector" frontend/src/components/
codebase_search("Where is CustomerSearchSelector used?")
```

#### For Pattern Discovery
```typescript
// 1. Find form implementations
glob_file_search("**/*Form*.tsx")
codebase_search("How are forms structured with react-hook-form?")

// 2. Find validation patterns
grep -r "zodResolver" frontend/src/components/
codebase_search("How is form validation implemented?")

// 3. Find dialog/modal patterns
grep -r "Dialog" frontend/src/components/
codebase_search("How are dialogs implemented?")
```

### Implementation Rules

#### Rule 1: Always Use Existing Components
```
IF component exists in frontend/src/components/ui/:
  → USE IT
  → DO NOT create duplicate
  → Extend if needed, don't replace
ELSE:
  → Check if similar component can be extended
  → Only create new if absolutely necessary
  → Add to ui/ directory if reusable
```

#### Rule 2: Follow Established Patterns
```
FOR forms:
  → Use react-hook-form + zod
  → Use CustomerSearchSelector for customers
  → Use standard Input, Select, Textarea
  → Follow Dialog pattern for modals

FOR customer selection:
  → ALWAYS use CustomerSearchSelector
  → NEVER create custom implementation
  → NEVER use basic Select dropdown

FOR service types:
  → Fetch from enhancedApi.serviceTypes.getAll()
  → Use Select component
  → Provide fallback options
```

#### Rule 3: Match Existing Styling
```
→ Use components from ui/ directory
→ Follow Styling Guide (styling-guide.md)
→ Match spacing patterns (space-y-4, gap-4)
→ Use consistent button variants
→ Follow Dialog padding (p-6)
```

#### Rule 4: Code Organization
```
Reusable components → frontend/src/components/ui/
Feature components → frontend/src/components/[feature]/
Forms → Use standard form pattern
Dialogs → Use Dialog component
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

- **Component Catalog**: See [Component Library Guide](component-library.md)
- **Usage Examples**: In component files and guides
- **Migration Guides**: For updating old code

### 3. Code Review Checklist

**Every PR must verify:**
- [ ] Uses existing components from `ui/` directory
- [ ] Follows established form patterns
- [ ] Matches styling from [Styling Guide](styling-guide.md)
- [ ] No duplicate functionality
- [ ] Proper TypeScript interfaces
- [ ] Error handling consistent with patterns

### 4. Developer Onboarding

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

## 📖 Reference Documents

1. [Component Library Guide](component-library.md) - Complete component reference
2. [Styling Guide](styling-guide.md) - Styling system and CSS classes
3. [Form Patterns](form-patterns.md) - Form implementation patterns
4. [Design System](../reference/design-system.md) - Layout patterns and design standards
5. [AI Assistant Guide](ai-assistant-guide.md) - AI development protocol

---

## 🚀 Quick Decision Tree

```
Need to implement feature?
│
├─ Is there an existing component? → USE IT
│
├─ Is there a similar component? → EXTEND IT
│
├─ Is there a pattern to follow? → FOLLOW IT
│
└─ None of the above? → CREATE NEW (add to ui/ if reusable)
```

---

**Remember:** Reuse > Reinvent. Always search first!

**Last Updated:** 2025-11-11  
**Maintained By:** Frontend Team  
**Review Frequency:** Monthly

