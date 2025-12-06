# R20: UX Consistency — Draft Summary

**Date:** 2025-12-05  
**Rule:** R20 - UX Consistency  
**Tier:** 3 (WARNING-level enforcement)  
**Status:** DRAFT - Awaiting Review  
**Estimated Time:** 2.5 hours

---

## Overview

R20 ensures that UI components follow consistent UX patterns across the entire application, enforcing design system compliance including spacing, typography, component usage, component variants, error/loading patterns, and interaction patterns.

**Key Focus Areas:**
- Spacing consistency (standard padding, vertical rhythm, section spacing)
- Typography consistency (design system scale, no custom font sizes)
- Component usage (design system components, no duplicates, CustomerSearchSelector for customers)
- Component variants (standard variants, no custom colors)
- Error/loading patterns (standard patterns, not custom implementations)
- Design system compliance (component library catalog, design system, CRM styling guide)

---

## Relationship to R19

**R19 Covers:**
- Accessibility-specific requirements (WCAG AA, keyboard navigation, screen reader, color contrast)
- Accessibility testing (automated + manual testing)
- Accessibility exemptions (documentation, justification, remediation)
- Accessibility reporting (WCAG compliance score, issue prioritization)

**R20 Covers:**
- General UX consistency (spacing, typography, component usage)
- Design system usage (component variants, standard patterns)
- Component patterns (error/loading patterns, interaction patterns)
- Consistency comparison (matching comparable pages)

**Rationale:** R19 ensures accessibility compliance. R20 ensures visual and interaction consistency across the application, enforcing design system patterns and preventing style drift. Both rules work together to ensure high-quality, accessible, and consistent user experiences.

---

## Draft Structure

### Audit Checklist Categories (9 categories, 50+ items)

1. **Spacing Consistency** (7 items: 5 MANDATORY, 2 RECOMMENDED)
   - Page wrappers, vertical rhythm, card padding, section spacing
   - Tailwind utilities, 4px/8px grid system

2. **Typography Consistency** (8 items: 6 MANDATORY, 2 RECOMMENDED)
   - Design system scale (text-2xl, text-lg, text-sm, text-xs)
   - Page titles, section headers, body text, labels
   - No custom font sizes, font weights

3. **Component Usage** (7 items: 5 MANDATORY, 2 RECOMMENDED)
   - Design system components, CustomerSearchSelector, standard form components
   - No duplicate components, component library catalog compliance

4. **Component Variants** (6 items: 4 MANDATORY, 2 RECOMMENDED)
   - Standard button variants (primary, secondary, danger, outline, ghost)
   - No custom color variants, form input variants

5. **Error/Loading Patterns** (6 items: 4 MANDATORY, 2 RECOMMENDED)
   - Standard error block pattern, standard skeleton/loading UX
   - Consistency with comparable pages, reusability

6. **Design System Compliance** (7 items: 5 MANDATORY, 2 RECOMMENDED)
   - Component library catalog, design system, CRM styling guide
   - No ad-hoc visual patterns, design system pattern usage

7. **Interaction Patterns** (5 items: 3 MANDATORY, 2 RECOMMENDED)
   - Hover, focus, active states, button interactions, form interactions
   - Consistency across similar components

8. **Consistency Comparison** (6 items: 4 MANDATORY, 2 RECOMMENDED)
   - Matching comparable pages, spacing/typography/component consistency
   - Application-wide consistency validation

**Total:** 50+ checklist items (mix of MANDATORY, RECOMMENDED)

---

## Key Decisions Required

### Q1: How should we detect spacing inconsistencies?

**Option A:** Pattern matching only (detect non-standard spacing classes)
- **Pros:** Simple, fast, catches obvious violations
- **Cons:** May miss subtle inconsistencies, doesn't compare against similar pages

**Option B:** Pattern matching + comparison against similar pages
- **Pros:** Catches subtle inconsistencies, validates against real usage
- **Cons:** Requires identifying comparable pages, more complex

**Option C:** Pattern matching + comparison + design system validation
- **Pros:** Comprehensive, validates against design system and real usage
- **Cons:** Most complex, requires design system parsing

**Recommendation:** Option C (Pattern matching + comparison + design system validation)
- Use pattern matching to detect non-standard spacing classes (`p-[custom]`, `mb-[custom]`)
- Compare against similar pages (same component type, same page type)
- Validate against design system documentation (`docs/DESIGN_SYSTEM.md`, `docs/CRM_STYLING_GUIDE.md`)
- Benefits: Comprehensive detection, catches both obvious and subtle inconsistencies, validates against design system

---

### Q2: How should we detect typography inconsistencies?

**Option A:** Pattern matching only (detect custom font sizes like `text-[14px]`)
- **Pros:** Simple, fast, catches obvious violations
- **Cons:** May miss subtle inconsistencies, doesn't validate against design system scale

**Option B:** Pattern matching + design system validation
- **Pros:** Validates against design system scale, catches custom font sizes
- **Cons:** Requires design system parsing

**Option C:** Pattern matching + design system validation + comparison against similar pages
- **Pros:** Comprehensive, validates against design system and real usage
- **Cons:** Most complex, requires identifying comparable pages

**Recommendation:** Option C (Pattern matching + design system validation + comparison)
- Use pattern matching to detect custom font sizes (`text-[14px]`, `text-[16px]`, etc.)
- Validate against design system typography scale (text-2xl, text-xl, text-lg, text-base, text-sm, text-xs)
- Compare against similar pages (same component type, same page type)
- Benefits: Comprehensive detection, validates against design system scale, catches both obvious and subtle inconsistencies

---

### Q3: How should we detect component usage violations?

**Option A:** Check imports only (verify components from `@/components/ui/`)
- **Pros:** Simple, fast, catches obvious violations
- **Cons:** May miss custom components, doesn't validate against component library catalog

**Option B:** Check imports + component library catalog validation
- **Pros:** Validates against component library catalog, catches custom components
- **Cons:** Requires component library catalog parsing

**Option C:** Check imports + component library catalog validation + duplicate detection
- **Pros:** Comprehensive, validates against catalog, catches duplicates
- **Cons:** Most complex, requires AST parsing for duplicate detection

**Recommendation:** Option C (Check imports + component library catalog validation + duplicate detection)
- Check imports to verify components from `@/components/ui/`
- Validate against component library catalog (`docs/COMPONENT_LIBRARY_CATALOG.md`)
- Detect duplicate components (check if component already exists before creating new one)
- Special case: CustomerSearchSelector for customer fields (not basic Select)
- Benefits: Comprehensive detection, validates against component library catalog, prevents duplicates

---

### Q4: How should we detect component variant violations?

**Option A:** Pattern matching only (detect custom colors like `bg-[#custom-color]`)
- **Pros:** Simple, fast, catches obvious violations
- **Cons:** May miss subtle violations, doesn't validate against standard variants

**Option B:** Pattern matching + variant validation
- **Pros:** Validates against standard variants, catches custom colors
- **Cons:** Requires variant definition parsing

**Option C:** Pattern matching + variant validation + design system validation
- **Pros:** Comprehensive, validates against standard variants and design system
- **Cons:** Most complex, requires design system parsing

**Recommendation:** Option C (Pattern matching + variant validation + design system validation)
- Use pattern matching to detect custom colors (`bg-[#custom-color]`, `text-[#custom-color]`)
- Validate against standard variants (primary, secondary, danger, outline, ghost)
- Validate against design system documentation (button styles, form input variants)
- Benefits: Comprehensive detection, validates against standard variants and design system, catches both obvious and subtle violations

---

### Q5: How should we compare consistency against similar pages?

**Option A:** Manual comparison (developer checks similar pages)
- **Pros:** Simple, no automation needed
- **Cons:** Time-consuming, inconsistent, may miss subtle differences

**Option B:** Automated comparison (script identifies similar pages and compares)
- **Pros:** Fast, consistent, catches subtle differences
- **Cons:** Requires identifying comparable pages (same component type, same page type)

**Option C:** Hybrid approach (automated comparison + manual review for edge cases)
- **Pros:** Automated catches most issues, manual review for complex cases
- **Cons:** Requires both approaches

**Recommendation:** Option B (Automated comparison)
- Identify comparable pages by:
  - Same component type (form page, list page, detail page)
  - Same page type (settings, customer, work order, etc.)
  - Similar functionality (create, edit, view)
- Compare spacing, typography, component usage, component variants
- Generate consistency report with differences highlighted
- Benefits: Fast, consistent, catches subtle differences, scalable

---

## Implementation Approach

### Detection Strategy
1. **Spacing Detection:** Pattern matching (non-standard classes) + comparison against similar pages + design system validation
2. **Typography Detection:** Pattern matching (custom font sizes) + design system validation + comparison against similar pages
3. **Component Usage Detection:** Import checking + component library catalog validation + duplicate detection
4. **Component Variant Detection:** Pattern matching (custom colors) + variant validation + design system validation
5. **Error/Loading Pattern Detection:** Pattern matching (standard vs custom patterns) + comparison against similar pages
6. **Consistency Comparison:** Automated comparison against similar pages (spacing, typography, components, variants)

### Validation Strategy
1. **Design System Validation:** Parse design system documentation (`docs/DESIGN_SYSTEM.md`, `docs/CRM_STYLING_GUIDE.md`)
2. **Component Library Validation:** Parse component library catalog (`docs/COMPONENT_LIBRARY_CATALOG.md`)
3. **Pattern Matching:** Detect non-standard patterns (custom spacing, custom typography, custom colors)
4. **Comparison:** Compare against similar pages (same component type, same page type)

### Enforcement Strategy
1. **WARNING-level:** Log violations but don't block PRs
2. **Context-aware:** Only warn for applicable requirements (UI components, frontend pages)
3. **Clear messages:** Provide specific guidance on UX consistency issues
4. **Comparable pages:** Suggest similar pages for reference

---

## Examples Provided

### ✅ Correct Patterns
- Standard spacing utilities (`p-3`, `p-4`, `mb-4`, `space-y-4`)
- Design system typography scale (`text-2xl`, `text-lg`, `text-sm`, `text-xs`)
- Design system components (`CustomerSearchSelector`, `Button`, `Input`)
- Standard component variants (`variant="primary"`, `variant="secondary"`)
- Standard error/loading patterns (error block, skeleton loading)

### ❌ Violation Patterns
- Custom spacing values (`p-5`, `mb-5`, `space-y-6`)
- Custom font sizes (`text-[14px]`, `text-[16px]`)
- Custom components instead of design system
- Custom color variants (`bg-[#custom-color]`)
- Custom error/loading patterns (custom styling, custom spinners)

---

## Review Questions

1. **Q1: Spacing Detection** - ✅ **APPROVED** - Option C (Pattern matching + comparison + design system validation)
   - **Enhancement:** Add spacing confidence score and visual side-by-side comparison report

2. **Q2: Typography Detection** - ✅ **APPROVED** - Option C (Pattern matching + design system validation + comparison)
   - **Enhancement:** Add typography hierarchy validation and living style guide generator

3. **Q3: Component Usage Detection** - ✅ **APPROVED** - Option C (Check imports + component library catalog validation + duplicate detection)
   - **Enhancement:** Add component suggestion engine and component usage report

4. **Q4: Component Variant Detection** - ✅ **APPROVED** - Option C (Pattern matching + variant validation + design system validation)
   - **Enhancement:** Add color migration suggestions and variant usage visualization

5. **Q5: Consistency Comparison** - ✅ **APPROVED** - Option B (Automated comparison against similar pages)
   - **Enhancement:** Add intelligent page classification and consistency dashboard

**Status:** ✅ **APPROVED WITH ENHANCEMENTS** - Ready for Implementation

---

## Approved Enhancements

### Phase 1 (MVP - 1.5 hours):
- Pattern matching (spacing, typography, custom colors)
- Design system parsing and validation
- Import checking and component validation

### Phase 2 (Core Features - 0.75 hours):
- Page classification and comparison logic
- Basic consistency report generator

### Phase 3 (Polish - 0.25 hours):
- Enhanced error messages with examples

### Phase 4 (Future):
- Living style guide generator
- Consistency dashboard
- Visual comparison reports

---

## Estimated Time

**Implementation:** 2.5 hours
- OPA policy: 0.5 hours (8-10 warnings)
- Automated script: 1-1.5 hours (pattern matching, design system validation, comparison logic)
- Test suite: 0.5 hours (10-12 test cases)
- Rule file update: 0.5 hours (add audit procedures)
- Documentation: 0.25 hours (completion report)

**Complexity:** MEDIUM
- Similar to R19 (accessibility requirements)
- Design system validation adds complexity (parsing documentation)
- Consistency comparison adds complexity (identifying comparable pages)
- Pattern matching is straightforward

---

## Next Steps

1. **Review Draft:** Read `.cursor/rules/13-ux-consistency-R20-DRAFT.md`
2. **Answer Questions:** Provide feedback on 5 review questions
3. **Approve or Request Changes:** Approve draft or request modifications
4. **Implementation:** AI will implement after approval

---

**Status:** AWAITING YOUR REVIEW  
**Prepared By:** AI Assistant  
**Draft Location:** `.cursor/rules/13-ux-consistency-R20-DRAFT.md`

