# EXECUTION_CONTRACT: Agent B (UI Components, Pages, Routes, Hooks, Stores)

## Objective
Fix all TypeScript errors in UI components, pages, routes, hooks, and stores. Target: ~572 errors.

## Current Error Count
- Total TS errors: 576
- Agent B scope: ~572 errors (components: 482, hooks: 83, routes: 4, stores: 2, pages: 1)

## Files to Fix

### Priority 1: Compliance Components (Critical UI)
1. `src/routes/compliance/components/ComplianceOverview.tsx`
   - Fix missing `options` prop (TS2741) — 2 Select components

2. `src/routes/compliance/components/ViolationList.tsx`
   - Fix missing `options` prop (TS2741) — 3 Select components

### Priority 2: Billing/Payment Components (High Volume)
3. `src/components/billing/PaymentForm.tsx`
   - Fix exactOptionalPropertyTypes for Elements options (TS2375)

4. `src/components/billing/PLReport.tsx`
   - Fix undefined argument guards (TS2345) — lines 22, 25

5. `src/components/billing/ReconciliationTools.tsx`
   - Fix undefined argument guards (TS2345) — lines 54, 57
   - Fix undefined `trackingData` (TS2304)

6. `src/components/billing/SavedPaymentMethods.tsx`
   - Fix exactOptionalPropertyTypes for CreatePaymentMethodDto (TS2379)

7. `src/components/billing/InvoiceReminders.tsx`
   - Fix overload mismatches (TS2769) — 2 instances

8. `src/components/billing/InvoiceScheduler.tsx`
   - Fix overload mismatch (TS2769)

9. `src/components/billing/InvoiceTemplates.tsx`
   - Fix overload mismatch (TS2769)

10. `src/components/billing/InvoiceView.tsx`
    - Fix overload mismatch (TS2769)

11. `src/components/billing/PaymentAnalytics.tsx`
    - Fix overload mismatches (TS2769) — 2 instances

12. `src/components/billing/PaymentDashboard.tsx`
    - Fix overload mismatches (TS2769) — 4 instances
    - Fix missing `dailyTrends` property (TS2339) — 3 instances
    - Fix missing `paymentMethodBreakdown` property (TS2339) — 2 instances

### Priority 3: Dashboard Components (High Volume)
13. `src/components/dashboard/AutoLayoutManager.tsx`
    - Fix type mismatches (TS2322) — Type '6' not assignable to '1 | 2 | 3 | 4' — 9 instances

14. `src/components/dashboard/AutoPRSessionManager.tsx`
    - Fix undefined object guards (TS2532) — lines 512, 513, 514

15. `src/components/dashboard/AvailabilityManagerCard.tsx`
    - Fix argument count mismatch (TS2554) — line 43

16. `src/components/dashboard/CardContainer.tsx`
    - Fix duplicate property names (TS1117) — 3 instances

17. `src/components/dashboard/CardContent.tsx`
    - Fix exactOptionalPropertyTypes (TS2375) — 3 instances

18. `src/components/dashboard/RegionDashboard.tsx` (if errors remain)
    - Fix any remaining type mismatches

19. `src/components/dashboard/CardTemplateManager.tsx`
    - Fix exactOptionalPropertyTypes (TS2379) — line 56
    - Fix Lucide icon props (TS2322) — line 325

20. `src/components/dashboard/CustomerExperiencePanel.tsx`
    - Fix missing API methods (TS2339) — lines 23, 29
    - Fix implicit any param (TS7006) — line 158

21. `src/components/dashboard/CustomerSearchCard.tsx`
    - Fix type mismatches (TS2322) — lines 142, 144

22. `src/components/dashboard/CustomersPageCard.tsx`
    - Fix exactOptionalPropertyTypes (TS2375) — line 18

23. `src/components/dashboard/CustomersPageWrapper.tsx`
    - Fix missing property (TS2339) — line 16

24. `src/components/dashboard/EnhancedDrillDownModal.tsx`
    - Fix exactOptionalPropertyTypes (TS2379) — line 90
    - Fix unused variable (TS6133) — line 118
    - Fix undefined guards (TS18048, TS18047) — lines 300, 302

25. `src/components/dashboard/InventoryCompliancePanel.tsx`
    - Fix useQuery overload mismatches (TS2769) — lines 60, 65, 70
    - Fix type mismatches with query data (TS2339, TS7006) — lines 164, 222, 253

26. `src/components/dashboard/InvoiceCard.tsx`
    - Fix type mismatches (TS2322) — lines 52, 53, 54, 56, 79
    - Fix exactOptionalPropertyTypes (TS2375) — line 179

27. `src/components/dashboard/JobsCalendarCard.tsx`
    - Fix type mismatches (TS2322) — lines 459, 460, 481

28. `src/components/dashboard/layered-ui/CommandPalette.tsx`
    - Fix exactOptionalPropertyTypes (TS2379) — line 20

29. `src/components/dashboard/layered-ui/FloatingNavBar.tsx`
    - Fix exactOptionalPropertyTypes (TS2375) — line 84

30. `src/components/dashboard/LayoutManager.tsx`
    - Fix exactOptionalPropertyTypes (TS2379) — line 259
    - Fix Lucide icon props (TS2322) — lines 481, 483

31. `src/components/dashboard/MobileDashboard.tsx`
    - Fix unused vars (TS6133) — lines 53, 65
    - Fix TouchEvent type mismatches (TS2322) — lines 216, 217, 218, 219

32. `src/components/dashboard/MobileNavigation.tsx`
    - Fix unused var (TS6133) — line 58

33. `src/components/dashboard/onboarding/ContextualHelp.tsx`
    - Fix exactOptionalPropertyTypes (TS2375) — line 149

34. `src/components/dashboard/onboarding/DashboardOnboarding.tsx`
    - Fix multiple type errors — lines 29, 76, 140, 194, 197, 199

35. `src/components/dashboard/PageCardManager.simple.tsx`
    - Fix type errors — lines 17, 18, 21

36. `src/components/dashboard/PageCardManager.tsx`
    - Fix type errors — lines 17, 18, 21

37. `src/components/dashboard/PageCardTemplate.tsx`
    - Fix type error — line 53

38. `src/components/dashboard/PageCardWrapper.tsx`
    - Fix type errors — lines 17, 92

39. `src/components/dashboard/QuickActions.tsx`
    - Fix type error — line 43

40. `src/components/dashboard/QuickActionsCard.tsx`
    - Fix type errors — lines 17, 18, 29

41. `src/components/dashboard/regions/AdaptiveGrid.tsx`
    - Fix multiple type errors — lines 110, 118, 169, 244

42. `src/components/dashboard/regions/DragOverlay.tsx`
    - Fix type error — line 26

43. `src/components/dashboard/regions/LazyRegion.tsx`
    - Fix type error — line 71

44. `src/components/crm/CustomerDashboard.tsx`
    - Fix prop type mismatch (TS2322) — line 102

### Priority 4: Customer Components
45. `src/components/crm/ContractManager.tsx`
    - Fix unused imports/vars (TS6133) — useMutation, customerId, queryClient

46. `src/components/customer/CustomerCard.tsx`
    - Fix missing `next_service_date` property (TS2339)

47. `src/components/customer/CustomerInfoPanel.tsx`
    - Fix type mismatch (TS2322) — '"xs"' not assignable to '"sm" | "md" | "lg"'

48. `src/components/customer/CustomerList.tsx`
    - Fix unused vars (TS6133) — toggleDensity, canUseDense

49. `src/components/customer/CustomerNotesHistory.tsx`
    - Fix missing `customerNotes` property (TS2551) — lines 55, 61
    - Fix implicit any param (TS7006) — line 213

50. `src/components/customer/CustomerOverview.tsx`
    - Fix type comparison (TS2367) — line 276

51. `src/components/customers/CustomerDetail.tsx`
    - Fix undefined `LoadingSpinner` (TS2304)
    - Fix implicit any param (TS7006) — line 345

52. `src/components/customers/CustomerForm.tsx`
    - Fix exactOptionalPropertyTypes for CheckboxProps (TS2375) — line 817

53. `src/components/customers/SecureCustomerForm.tsx`
    - Fix missing `notes` property (TS2339) — 2 instances

54. `src/components/customers/SecureCustomerList.tsx`
    - Fix type mismatches (TS2740, TS2322, TS2367) — lines 26, 85, 86, 87, 178, 278, 280, 284

55. `src/components/CustomersPage.tsx`
    - Fix missing `data` property (TS2339) — line 191

### Priority 5: Technician Components
56. `src/components/technicians/*` (all files with errors)
    - Fix type mismatches, undefined guards, exactOptionalPropertyTypes

### Priority 6: Testing Components
57. `src/components/testing/*` (all files with errors)
    - Fix type mismatches, undefined guards, exactOptionalPropertyTypes

### Priority 7: UI Components
58. `src/components/ui/*` (all files with errors)
    - Fix type mismatches, undefined guards, exactOptionalPropertyTypes

### Priority 8: Pages (Unused Imports & Type Fixes)
59. `src/pages/AgreementsPage.tsx`
    - Fix unused React import (TS6133)
    - Fix type mismatch (TS2322) — 5 not assignable to 1|2|3|4

60. `src/pages/CreateAgreementPage.tsx`
    - Fix unused React import (TS6133)

61. `src/pages/CreateWorkOrderPage.tsx`
    - Fix unused React import (TS6133)

62. `src/pages/CustomerManagement.tsx`
    - Fix unused React import (TS6133)

63. `src/pages/CustomerManagementDemo.tsx`
    - Fix unused React import (TS6133)

64. `src/pages/EditTechnicianPage.tsx`
    - Fix exactOptionalPropertyTypes for technicianId (TS2375)

65. `src/pages/EditWorkOrderPage.tsx`
    - Fix unused React import (TS6133)
    - Fix exactOptionalPropertyTypes (TS2375)

66. `src/pages/ServiceManagement.tsx`
    - Fix unused React import (TS6133)

67. `src/pages/UserManagement.tsx`
    - Fix unused React import (TS6133)

68. `src/pages/WorkOrderDetailPage.tsx`
    - Fix unused React import (TS6133)
    - Fix unused workOrder (TS6133)

69. `src/pages/WorkOrdersPage.tsx`
    - Fix unused React import (TS6133)
    - Fix unused selectedWorkOrder/setSelectedWorkOrder (TS6133)

### Priority 9: Routes (Unused Vars & Guards)
70. `src/routes/Charts.tsx`
    - Fix unused vars (TS6133)
    - Fix undefined object guards (TS2532)

71. `src/routes/Communications.tsx`
    - Fix unused showTemplateModal (TS6133)

72. `src/routes/Knowledge.tsx`
    - Fix unused vars (TS6133)

73. `src/routes/Reports.tsx`
    - Fix unused _handleExportReport (TS6133)

74. `src/routes/admin/components/DashboardAdminControlCenter.tsx`
    - Fix unused templates/setTemplates (TS6133)

75. `src/routes/admin/dashboard-analytics.tsx`
    - Fix unused trackEvent (TS6133)

### Priority 10: Hooks (Type Safety & Guards)
76. `src/hooks/useSmartKPIs.ts`
    - Fix unused mockKPIData (TS6133)
    - Fix exactOptionalPropertyTypes for change (TS2375)
    - Fix implicit any params (TS7006)

77. `src/hooks/useSmartKPIsSimple.ts`
    - Fix exactOptionalPropertyTypes for change (TS2375)

78. `src/hooks/useTouchGestures.ts`
    - ✅ Syntax error fixed (missing closing brace)
    - Fix undefined TouchPoint guards (TS2532, TS2345) — if any remain

79. `src/hooks/useUploads.ts`
    - Fix unused queryClient (TS6133) — 2 instances

80. `src/hooks/useVirtualScrolling.ts`
    - Fix missing return value (TS7030)
    - Fix containerRef property (TS2353)

81. `src/hooks/useWebSocket.ts`
    - Fix socket.io-client import (TS2305)
    - Fix unused Socket import (TS6133)
    - Fix Socket type usage (TS2749)
    - Fix implicit any params (TS7006)

82. `src/hooks/useWebVitals.ts`
    - Fix missing return value (TS7030)

### Priority 11: Stores & Test Utils
83. `src/stores/auth.ts`
    - Fix unused _resolveTenantId (TS6133)

84. `src/test-utils/observability-helpers.tsx`
    - Fix unused error vars (TS6133) — 3 instances

## Fix Patterns

### Unused React imports
Remove `import React from 'react'` if not using JSX or React directly (React 17+).

### Missing options prop
Add `options` prop to Select components with array of option objects.

### exactOptionalPropertyTypes
When passing `string | undefined` to optional `string?` prop:
- Guard: `if (value !== undefined) { prop={value} }`
- Use conditional: `prop={value ?? undefined}`
- Update prop type to allow undefined explicitly

### Undefined guards
Add null/undefined checks before accessing object properties:
```typescript
if (obj?.property) { /* use obj.property */ }
```

### Missing return values
Ensure all code paths return a value in functions that should return.

### Implicit any
Add explicit type annotations to function parameters.

### Socket.io-client import
Use correct import: `import { io } from 'socket.io-client'` or check package version.

### Duplicate properties
Remove duplicate property names in object literals.

### Type mismatches
Fix type assignments to match expected types (e.g., '6' → '1 | 2 | 3 | 4').

## Tests

After fixes:
1. Run `cd frontend && npm run typecheck`
2. Verify errors in Agent B files are resolved
3. Verify no new errors introduced in Agent A files
4. Check that UI components render correctly
5. Verify hooks work without runtime errors

## Success Criteria

- All TypeScript errors in Agent B files resolved
- No new errors introduced
- Type safety maintained (no `any` escapes)
- exactOptionalPropertyTypes compliance
- UI components remain functional
