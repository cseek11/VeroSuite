# R20: UX Consistency — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R20 - UX Consistency  
**Priority:** MEDIUM (Tier 3 - WARNING)

---

## R20: UX Consistency — Audit Procedures

### Rule-Specific Audit Checklist

For code changes affecting **UI components, frontend pages, or user-facing features**:

#### Spacing Consistency

- [ ] **MANDATORY:** Verify page wrappers use standard padding (e.g., `p-3`, `p-6` as per design system)
- [ ] **MANDATORY:** Verify vertical rhythm uses standard spacing utilities (`space-y-*`, `mb-*`, `mt-*`)
- [ ] **MANDATORY:** Verify spacing matches comparable pages (check similar screens for consistency)
- [ ] **MANDATORY:** Verify card padding follows design system (`p-4` for cards, `p-3` for page containers)
- [ ] **MANDATORY:** Verify section spacing is consistent (`mb-4` for sections, `mb-3` for elements)
- [ ] **RECOMMENDED:** Verify spacing uses Tailwind utilities (not custom CSS values)
- [ ] **RECOMMENDED:** Verify spacing follows 4px/8px grid system (multiples of 4)

#### Typography Consistency

- [ ] **MANDATORY:** Verify typography uses design system scale (text-2xl, text-xl, text-lg, text-base, text-sm, text-xs)
- [ ] **MANDATORY:** Verify page titles use `text-2xl font-bold` (24px, bold)
- [ ] **MANDATORY:** Verify section headers use `text-lg font-bold` or `text-xl font-semibold` (18px/20px)
- [ ] **MANDATORY:** Verify body text uses `text-sm` (14px) or `text-base` (16px)
- [ ] **MANDATORY:** Verify labels use `text-xs font-semibold` (12px, semibold)
- [ ] **MANDATORY:** Verify no custom font sizes are introduced (check for `text-[14px]`, `text-[16px]`, etc.)
- [ ] **RECOMMENDED:** Verify typography matches comparable pages (check similar screens)
- [ ] **RECOMMENDED:** Verify font weights follow design system (bold, semibold, medium, normal)

#### Component Usage

- [ ] **MANDATORY:** Verify components are from design system (`frontend/src/components/ui/`)
- [ ] **MANDATORY:** Verify `CustomerSearchSelector` is used for customer fields (not basic Select)
- [ ] **MANDATORY:** Verify standard form components are used (Input, Textarea, Select, Checkbox, Switch)
- [ ] **MANDATORY:** Verify standard button components are used (Button with variants, not custom buttons)
- [ ] **MANDATORY:** Verify no duplicate components created (check if component already exists)
- [ ] **RECOMMENDED:** Verify components match component library catalog (`docs/COMPONENT_LIBRARY_CATALOG.md`)
- [ ] **RECOMMENDED:** Verify components follow established patterns (check similar implementations)

#### Component Variants

- [ ] **MANDATORY:** Verify buttons use standard variants (primary, secondary, danger, outline, ghost)
- [ ] **MANDATORY:** Verify no custom color variants created (check for `bg-[#custom-color]`, `text-[#custom-color]`)
- [ ] **MANDATORY:** Verify button styles match design system (gradient primary, outlined secondary)
- [ ] **MANDATORY:** Verify form inputs use standard variants (default, error, disabled)
- [ ] **RECOMMENDED:** Verify component variants match design system documentation
- [ ] **RECOMMENDED:** Verify component variants are consistent across similar components

#### Error/Loading Patterns

- [ ] **MANDATORY:** Verify error messages use standard error block pattern (not custom error styling)
- [ ] **MANDATORY:** Verify loading states use standard skeleton/loading UX (not custom spinners)
- [ ] **MANDATORY:** Verify error messages follow established error display patterns
- [ ] **MANDATORY:** Verify loading states match comparable pages (check similar screens)
- [ ] **RECOMMENDED:** Verify error/loading patterns are reusable (not page-specific)
- [ ] **RECOMMENDED:** Verify error/loading patterns match design system documentation

#### Design System Compliance

- [ ] **MANDATORY:** Verify component usage matches component library catalog (`docs/COMPONENT_LIBRARY_CATALOG.md`)
- [ ] **MANDATORY:** Verify styling matches design system (`docs/DESIGN_SYSTEM.md`)
- [ ] **MANDATORY:** Verify CRM styling matches CRM styling guide (`docs/CRM_STYLING_GUIDE.md`)
- [ ] **MANDATORY:** Verify no ad-hoc visual patterns introduced (check for custom CSS, inline styles)
- [ ] **MANDATORY:** Verify design system patterns are followed when match exists (don't reinvent)
- [ ] **RECOMMENDED:** Verify design system documentation is consulted before implementation
- [ ] **RECOMMENDED:** Verify design system patterns are documented if new patterns are needed

#### Interaction Patterns

- [ ] **MANDATORY:** Verify interaction patterns match established patterns (hover, focus, active states)
- [ ] **MANDATORY:** Verify button interactions follow design system (hover effects, transitions)
- [ ] **MANDATORY:** Verify form interactions follow design system (focus states, validation states)
- [ ] **RECOMMENDED:** Verify interaction patterns are consistent across similar components
- [ ] **RECOMMENDED:** Verify interaction patterns match design system documentation

#### Consistency Comparison

- [ ] **MANDATORY:** Verify new components/screens match comparable existing pages
- [ ] **MANDATORY:** Verify spacing matches similar pages (check 2-3 comparable pages)
- [ ] **MANDATORY:** Verify typography matches similar pages (check 2-3 comparable pages)
- [ ] **MANDATORY:** Verify component usage matches similar pages (check 2-3 comparable pages)
- [ ] **RECOMMENDED:** Verify consistency across entire application (not just similar pages)
- [ ] **RECOMMENDED:** Verify consistency is validated against design system documentation

#### Automated Checks

```bash
# Check UX consistency for all components
python .cursor/scripts/check-ux-consistency.py --all

# Check spacing consistency
python .cursor/scripts/check-ux-consistency.py --spacing

# Check typography consistency
python .cursor/scripts/check-ux-consistency.py --typography

# Check component usage
python .cursor/scripts/check-ux-consistency.py --components

# Check design system compliance
python .cursor/scripts/check-ux-consistency.py --design-system

# Generate UX consistency report
python .cursor/scripts/check-ux-consistency.py --generate-report

# Check consistency against comparable pages
python .cursor/scripts/check-ux-consistency.py --compare-pages
```

#### OPA Policy

- **Policy:** `services/opa/policies/ux-consistency.rego` (R20 section)
- **Enforcement:** WARNING (Tier 3 MAD) - Logged but doesn't block PRs
- **Tests:** `services/opa/tests/ux_r20_test.rego`

#### Manual Verification (When Needed)

1. **Review Design System Documentation** - Verify component usage matches component library catalog
2. **Compare Similar Pages** - Check 2-3 comparable pages for spacing, typography, component usage consistency
3. **Validate Component Variants** - Verify buttons, inputs use standard variants (not custom colors)
4. **Check Error/Loading Patterns** - Verify error/loading states match established patterns

**Example Spacing Consistency (✅):**

```tsx
// ✅ CORRECT: Standard spacing utilities
<div className="p-3"> {/* Page padding */}
  <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4"> {/* Card padding */}
    <h1 className="text-2xl font-bold mb-3">Title</h1> {/* Section spacing */}
    <div className="space-y-4"> {/* Vertical rhythm */}
      <Input label="Name" />
      <Input label="Email" />
    </div>
  </div>
</div>
```

**Example Spacing Violation (❌):**

```tsx
// ❌ VIOLATION: Custom padding values, inconsistent spacing
<div className="p-5"> {/* Should be p-3 or p-6 */}
  <div className="bg-white p-6 mb-5"> {/* Should be p-4 mb-4 */}
    <h1 className="text-2xl font-bold mb-4">Title</h1> {/* Should be mb-3 */}
    <div className="space-y-6"> {/* Should be space-y-4 */}
      <Input label="Name" />
      <Input label="Email" />
    </div>
  </div>
</div>
```

**Example Typography Consistency (✅):**

```tsx
// ✅ CORRECT: Design system typography scale
<h1 className="text-2xl font-bold">Page Title</h1> {/* Page title */}
<h2 className="text-lg font-bold">Section Header</h2> {/* Section header */}
<p className="text-sm">Body text</p> {/* Body text */}
<label className="text-xs font-semibold">Label</label> {/* Label */}
```

**Example Typography Violation (❌):**

```tsx
// ❌ VIOLATION: Custom font sizes, not using design system scale
<h1 className="text-[24px] font-bold">Page Title</h1> {/* Should be text-2xl */}
<h2 className="text-[18px] font-semibold">Section Header</h2> {/* Should be text-lg */}
<p className="text-[14px]">Body text</p> {/* Should be text-sm */}
<label className="text-[12px] font-medium">Label</label> {/* Should be text-xs font-semibold */}
```

**Example Component Usage (✅):**

```tsx
// ✅ CORRECT: Using design system components
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';

<CustomerSearchSelector
  value={customerId}
  onChange={setCustomerId}
  label="Customer"
  required
/>

<Button variant="primary">Save</Button>
<Input label="Name" value={name} onChange={setName} />
```

**Example Component Usage Violation (❌):**

```tsx
// ❌ VIOLATION: Custom component instead of design system, basic Select instead of CustomerSearchSelector
import { Select } from '@/components/ui/CRMComponents'; // Should use CustomerSearchSelector

<Select value={customerId} onValueChange={setCustomerId}>
  {/* Should use CustomerSearchSelector for customer fields */}
</Select>

<button className="bg-blue-500 text-white px-4 py-2">Save</button> {/* Should use Button component */}
<input type="text" value={name} onChange={setName} /> {/* Should use Input component */}
```

**Example Component Variants (✅):**

```tsx
// ✅ CORRECT: Standard button variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="danger">Delete</Button>
<Button variant="outline">Cancel</Button>
```

**Example Component Variants Violation (❌):**

```tsx
// ❌ VIOLATION: Custom color variants, not using standard variants
<Button className="bg-[#FF6B6B] text-white">Custom Red</Button> {/* Should use variant="danger" */}
<Button className="bg-[#4ECDC4] text-white">Custom Teal</Button> {/* Should use variant="primary" or "secondary" */}
```

**Example Error/Loading Patterns (✅):**

```tsx
// ✅ CORRECT: Standard error block pattern
{error && (
  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
    {error}
  </div>
)}

// ✅ CORRECT: Standard loading skeleton pattern
{loading ? (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
) : (
  <Content />
)}
```

**Example Error/Loading Patterns Violation (❌):**

```tsx
// ❌ VIOLATION: Custom error styling, custom spinner
{error && (
  <div className="text-red-500 italic">Error: {error}</div> {/* Should use standard error block */}
)}

{loading && (
  <div className="spinner">Loading...</div> {/* Should use skeleton pattern */}
)}
```

---

**Last Updated:** 2025-11-23  
**Maintained By:** Design Team  
**Review Frequency:** Quarterly or when UX consistency requirements change



