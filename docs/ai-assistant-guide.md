---
title: AI Assistant Development Guide
category: Development
status: active
last_reviewed: 2025-11-11
owner: frontend_team
related:
  - docs/guides/development/best-practices.md
  - docs/guides/development/component-library.md
  - docs/guides/development/form-patterns.md
---

# AI Consistency Protocol

## 🎯 Purpose

This protocol ensures AI assistants maintain consistency across the codebase by enforcing component reuse, pattern matching, and preventing duplicate implementations.

---

## 📋 Pre-Implementation Checklist

**Before implementing ANY feature, AI MUST complete:**

### 1. Component Discovery
```
✅ Search for existing components in frontend/src/components/ui/
✅ Check component library catalog (docs/guides/development/component-library.md)
✅ Review similar implementations in the codebase
✅ Check for component documentation (*.md files in ui/)
```

### 2. Pattern Analysis
```
✅ Find 2-3 similar implementations
✅ Identify common patterns and conventions
✅ Review form patterns (WorkOrderForm, InvoiceForm, etc.)
✅ Check validation patterns (react-hook-form + zod)
```

### 3. Documentation Review
```
✅ Read docs/guides/development/best-practices.md
✅ Review docs/guides/development/styling-guide.md
✅ Check docs/reference/design-system.md
✅ Review component-specific guides
```

### 4. Code Location Verification
```
✅ Verify correct file location
✅ Check if component should be in ui/ (reusable) or feature-specific
✅ Ensure proper imports and exports
```

---

## 🔍 Discovery Commands

### For Component Search
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

### For Pattern Discovery
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

### For Documentation
```typescript
// 1. Find guides
glob_file_search("**/*GUIDE*.md")
glob_file_search("**/*PATTERN*.md")
glob_file_search("**/*BEST*.md")

// 2. Read key documents
read_file("docs/guides/development/best-practices.md")
read_file("docs/guides/development/component-library.md")
read_file("docs/guides/development/styling-guide.md")
```

---

## ✅ Implementation Rules

### Rule 1: Always Use Existing Components
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

### Rule 2: Follow Established Patterns
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

### Rule 3: Match Existing Styling
```
→ Use components from ui/ directory
→ Follow docs/guides/development/styling-guide.md
→ Match spacing patterns (space-y-4, gap-4)
→ Use consistent button variants
→ Follow Dialog padding (p-6)
```

### Rule 4: Code Organization
```
Reusable components → frontend/src/components/ui/
Feature components → frontend/src/components/[feature]/
Forms → Use standard form pattern
Dialogs → Use Dialog component
```

---

## 🚫 Prohibited Actions

### ❌ DO NOT:
1. Create duplicate components
2. Implement custom customer search
3. Create inline components (>50 lines)
4. Mix styling approaches
5. Skip component discovery
6. Ignore existing patterns
7. Create new form patterns
8. Use basic Select for customers

### ✅ DO:
1. Search before implementing
2. Reuse existing components
3. Follow established patterns
4. Match existing styling
5. Document deviations
6. Extract reusable code
7. Use standard imports
8. Follow naming conventions

---

## 📝 Implementation Template

### When Creating New Feature
```typescript
// 1. SEARCH PHASE
codebase_search("How is [similar feature] implemented?")
list_dir("frontend/src/components/ui")
glob_file_search("**/*[pattern]*.tsx")

// 2. ANALYSIS PHASE
read_file("docs/guides/development/best-practices.md")
read_file("docs/guides/development/component-library.md")
// Review 2-3 similar implementations

// 3. PLANNING PHASE
todo_write([
  { id: '1', status: 'pending', content: 'Use existing [component]' },
  { id: '2', status: 'pending', content: 'Follow [pattern] pattern' },
  // ...
])

// 4. IMPLEMENTATION PHASE
// Use existing components
// Follow established patterns
// Match styling

// 5. VERIFICATION PHASE
read_lints([...])
// Verify consistency
// Check for duplicates
```

---

## 🔄 Standard Imports

### Always Use These Patterns
```typescript
// Form Components
import Input from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/CRMComponents';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';
import Button from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

// Form Libraries
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Data Fetching
import { useQuery, useMutation } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';
```

---

## 📊 Consistency Metrics

### Code Quality Indicators
- **Component Reuse Rate**: Should be >80%
- **Pattern Consistency**: Should be >90%
- **Duplicate Code**: Should be <5%
- **Documentation Coverage**: Should be >70%

### Review Checklist
- [ ] Uses existing components
- [ ] Follows established patterns
- [ ] Matches styling guide
- [ ] No duplicate functionality
- [ ] Proper TypeScript types
- [ ] Consistent error handling
- [ ] Follows naming conventions

---

## 🎓 Learning Resources

### For AI Assistants
1. **Start Here**: [Development Best Practices](best-practices.md)
2. **Component Reference**: [Component Library Guide](component-library.md)
3. **Styling Guide**: [Styling Guide](styling-guide.md)
4. **Design System**: [Design System Reference](../../reference/design-system.md)

### Study Examples
- **Form Pattern**: `WorkOrderForm.tsx`
- **Dialog Pattern**: `ScheduleCalendar.tsx` (JobCreateDialog)
- **Customer Search**: `CustomerSearchSelector.tsx`
- **Component Structure**: Any file in `frontend/src/components/ui/`

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

