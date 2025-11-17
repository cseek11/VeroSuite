---
title: Component Library Strategy
category: Architecture
status: accepted
date: 2025-11-11
owner: frontend_team
related:
  - docs/guides/development/best-practices.md
  - docs/reference/component-catalog.md
---

# Decision: Component Library Strategy

## Status
**Accepted** - 2025-11-11

## Context

EnhancedUI.tsx was still being used in critical files (including VeroCards.tsx) despite best practices recommending standard `ui/` components. This created confusion about which components to use.

## Decision

**Immediate deprecation of EnhancedUI**

- Migrate all EnhancedUI usage to standard `ui/` components
- Remove EnhancedUI.tsx after migration
- Extract any unique functionality into standard `ui/` components if needed
- Aligns with DEVELOPMENT_BEST_PRACTICES.md

## Consequences

### Positive
- Single source of truth for components
- Eliminates developer confusion
- Supports component standardization goals
- Aligns with best practices

### Negative
- Requires migration of 4+ files including VeroCards.tsx
- May require extracting unique functionality

## Implementation

1. Identify all EnhancedUI usage
2. Map EnhancedUI components to standard `ui/` equivalents
3. Extract unique functionality if needed
4. Migrate all usage
5. Remove EnhancedUI.tsx
6. Update documentation

## References

- [Development Best Practices](../guides/development/best-practices.md)
- [Component Catalog](../reference/component-catalog.md)
- [Documentation Conflicts Analysis](../archive/inconsistency-reports/DOCUMENTATION_CONFLICTS_ANALYSIS.md)

---

**Last Updated:** 2025-11-11






