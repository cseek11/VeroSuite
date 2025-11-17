---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - frontend
  - mobile
priority: normal-high
last_updated: 2025-11-16
always_apply: true
---

# PRIORITY: NORMAL-HIGH - UI/UX Coherence & Interaction Rules

## Overview

This rule file enforces UI pattern consistency, design system usage, and style coherence across all UI components. Ensures consistent spacing, typography, component usage, error messages, and loading states.

**⚠️ MANDATORY:** All UI interactions must follow documented patterns, use design system components, and maintain consistent styling.

---

## I. UI Pattern Enforcement

### Rule 1: Follow Documented UI Patterns

**MANDATORY:** All UI interactions MUST follow documented patterns:

**Pattern Sources:**
- `docs/reference/COMPONENT_LIBRARY_CATALOG.md` - Component patterns
- `CRM_STYLING_GUIDE.md` - Styling patterns
- `DESIGN_SYSTEM.md` - Design system patterns
- Existing component implementations

**MANDATORY:** Search for existing patterns before creating new UI:

```typescript
// Search for existing patterns
codebase_search("How are forms implemented?")
codebase_search("How are modals implemented?")
read_file("docs/reference/COMPONENT_LIBRARY_CATALOG.md")
read_file("CRM_STYLING_GUIDE.md")
```

### Rule 2: Design System Usage

**MANDATORY:** Use design system components for all elements:

```typescript
// ✅ CORRECT: Use design system components
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Dialog from '@/components/ui/Dialog';

function WorkOrderForm() {
  return (
    <Dialog>
      <Input label="Customer" />
      <Button variant="primary">Submit</Button>
    </Dialog>
  );
}

// ❌ WRONG: Custom components not in design system
function WorkOrderForm() {
  return (
    <div className="custom-dialog">
      <input className="custom-input" />
      <button className="custom-button">Submit</button>
    </div>
  );
}
```

**Reference:** See `.cursor/rules/frontend.md` for component usage rules.

---

## II. Consistency Enforcement

### Rule 3: Consistent Spacing

**MANDATORY:** Enforce consistent spacing using design system tokens:

```typescript
// ✅ CORRECT: Consistent spacing
<div className="p-6"> {/* Page padding: 24px */}
  <div className="space-y-4"> {/* Consistent vertical spacing */}
    <Input />
    <Input />
  </div>
</div>

// ❌ WRONG: Inconsistent spacing
<div className="p-3"> {/* Too small: 12px */}
  <div className="space-y-2"> {/* Inconsistent */}
    <Input />
    <Input />
  </div>
</div>
```

**Reference:** See `.cursor/rules/styling.md` for spacing guidelines.

### Rule 4: Consistent Typography

**MANDATORY:** Enforce consistent typography:

```typescript
// ✅ CORRECT: Consistent typography
<h1 className="text-xl">Page Title</h1> {/* 20px */}
<h2 className="text-base">Section Header</h2> {/* 16px */}
<p className="text-sm">Body text</p> {/* 14px */}

// ❌ WRONG: Inconsistent typography
<h1 className="text-2xl">Page Title</h1> {/* Too large: 24px */}
<h2 className="text-lg">Section Header</h2> {/* Too large: 18px */}
```

**Reference:** See `.cursor/rules/styling.md` for typography guidelines.

### Rule 5: Consistent Component Usage

**MANDATORY:** Use components consistently:

```typescript
// ✅ CORRECT: Consistent component usage
<Button variant="primary">Submit</Button>
<Button variant="outline">Cancel</Button>
<Button variant="danger">Delete</Button>

// ❌ WRONG: Inconsistent component usage
<Button variant="primary">Submit</Button>
<button className="btn-cancel">Cancel</button> {/* Not using Button component */}
```

### Rule 6: Consistent Error Message Patterns

**MANDATORY:** Use standard error message patterns:

```typescript
// ✅ CORRECT: Standard error pattern
{error && (
  <div className="text-red-600 text-sm mt-1" role="alert">
    {error.message}
  </div>
)}

// ❌ WRONG: Inconsistent error pattern
{error && (
  <span className="error-text">{error}</span> {/* Inconsistent styling */}
)}
```

### Rule 7: Consistent Loading States

**MANDATORY:** Use loading skeletons/spinners consistently:

```typescript
// ✅ CORRECT: Standard loading pattern
{isLoading ? (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
) : (
  <WorkOrderList workOrders={workOrders} />
)}

// ❌ WRONG: Inconsistent loading pattern
{isLoading ? (
  <div>Loading...</div> {/* Not using skeleton */}
) : (
  <WorkOrderList workOrders={workOrders} />
)}
```

---

## III. Style Inconsistency Detection

### Rule 8: Detect Inconsistent Styles

**MANDATORY:** Detect if new UI introduces inconsistent styles:

**Check for:**
- Inconsistent spacing values
- Inconsistent typography sizes
- Inconsistent color usage
- Inconsistent component variants
- Inconsistent border radius
- Inconsistent shadows

**Example:**
```typescript
// ❌ INCONSISTENCY DETECTED:
// Existing: p-6 (24px padding)
// New: p-3 (12px padding)
// Issue: Inconsistent page padding

// ✅ FIXED: Use consistent spacing
// Both use: p-6 (24px padding)
```

---

## IV. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- Existing UI patterns
- Design system components
- Styling guidelines
- Component library catalog

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- UI patterns match existing code
- Design system components used
- Styling guidelines followed
- Consistency maintained

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- Design system components used
- Consistent spacing/typography
- Standard error/loading patterns
- No style inconsistencies

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- UI patterns followed
- Design system used
- Consistency maintained
- No style inconsistencies
- Error/loading patterns consistent

---

## Violations

**HARD STOP violations:**
- Not using design system components
- Inconsistent spacing/typography
- Missing error/loading patterns
- Breaking UI consistency

**Must fix before proceeding:**
- Style inconsistencies
- Missing design system usage
- Incomplete pattern implementation
- Missing consistency checks

---

**Last Updated:** 2025-11-16  
**Status:** Active Enforcement  
**Priority:** NORMAL-HIGH - Must be followed for every UI component

