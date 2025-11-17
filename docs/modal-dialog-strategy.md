---
title: Modal vs Dialog Strategy
category: Architecture
status: accepted
date: 2025-11-11
owner: frontend_team
related:
  - docs/guides/development/best-practices.md
  - docs/reference/component-catalog.md
---

# Decision: Modal vs Dialog Strategy

## Status
**Accepted** - 2025-11-11

## Context

Modal.tsx was still being used in card system files despite best practices recommending Dialog.tsx. Modal.tsx also contained specialized modals (AlertModal, ConfirmModal, PromptModal) with no Dialog-based alternatives.

## Decision

**Create Dialog-based replacements for specialized modals**

1. Check if ConfirmationDialog exists in `ui/` directory
2. If exists, use it; if not, create Dialog-based replacements
3. Build AlertDialog, ConfirmDialog, PromptDialog using Dialog.tsx
4. Migrate all Modal.tsx usage to Dialog-based components
5. Deprecate Modal.tsx

## Consequences

### Positive
- Consistent modal/dialog system across codebase
- Aligns with best practices
- Ensures component standardization
- Better maintainability

### Negative
- Requires building new Dialog-based components
- Requires migration of existing Modal usage

## Implementation

1. Check for existing ConfirmationDialog in `ui/`
2. Create Dialog-based replacements for specialized modals
3. Migrate all Modal.tsx usage
4. Update documentation
5. Deprecate Modal.tsx

## References

- [Development Best Practices](../guides/development/best-practices.md)
- [Component Catalog](../reference/component-catalog.md)
- [Documentation Conflicts Analysis](../archive/inconsistency-reports/DOCUMENTATION_CONFLICTS_ANALYSIS.md)

---

**Last Updated:** 2025-11-11






