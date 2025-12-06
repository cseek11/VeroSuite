---
title: Design System Color Standards
category: Architecture
status: accepted
date: 2025-12-05
owner: design_lead
related:
  - docs/reference/design-system.md
  - docs/guides/development/styling-guide.md
---

# Decision: Design System Color Standards

## Status
**Accepted** - 2025-12-05

## Context

There was a conflict between documentation specifying:
- `slate-*` colors for neutrals (DESIGN_SYSTEM.md)
- `gray-*` colors for neutrals (CRM_STYLING_GUIDE.md)

Additionally, there was confusion about primary brand colors (Indigo vs Purple vs Both).

## Decision

### Color System Standard
**Use `slate-*` only for neutral colors**

- Migrate all `gray-*` usage to `slate-*`
- Update CRM_STYLING_GUIDE.md to use `slate-*`
- Aligns with DESIGN_SYSTEM.md which is more comprehensive
- Supports indigo-purple theme

### Primary Brand Colors
**Use both Indigo (primary) and Purple (secondary)**

- **Indigo**: `#6366F1` - Primary brand color
- **Purple**: `#8B5CF6` - Secondary brand color
- Supports gradient patterns: `from-indigo-600 to-purple-600`
- Aligns with existing crm-styles.css which has both

## Consequences

### Positive
- Clear, consistent color system across codebase
- Supports modern gradient patterns
- Aligns with comprehensive design system
- Eliminates developer confusion

### Negative
- Requires migration of existing `gray-*` usage to `slate-*`
- Requires updating CRM_STYLING_GUIDE.md

## Implementation

1. Update all `gray-*` classes to `slate-*` in codebase
2. Update CRM_STYLING_GUIDE.md to reflect `slate-*` usage
3. Document color usage in design system reference
4. Update component examples to use `slate-*`

## References

- [Design System Reference](../reference/design-system.md)
- [Styling Guide](../guides/development/styling-guide.md)
- [Documentation Conflicts Analysis](../archive/inconsistency-reports/DOCUMENTATION_CONFLICTS_ANALYSIS.md)

---

**Last Updated:** 2025-12-05






