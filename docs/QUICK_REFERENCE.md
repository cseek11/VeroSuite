# Cursor Rules Quick Reference

**Last Updated:** 2025-12-05  
**Purpose:** Quick lookup for most common rules

---

## 🚨 BEFORE YOU START - MANDATORY CHECKLIST

1. ✅ Read `.cursor/rules/enforcement.md` - **MANDATORY**
2. ✅ Complete mandatory searches (parallel)
3. ✅ Verify rule compliance
4. ✅ Check file paths match monorepo structure

---

## 📁 File Paths (CRITICAL)

### ✅ CORRECT Paths (Post-Restructuring)
- Main API: `apps/api/src/[module]/`
- Database: `libs/common/prisma/schema.prisma`
- AI Services: `apps/crm-ai/src/`, `apps/ai-soc/src/`
- Shared Code: `libs/common/src/`
- Components: `frontend/src/components/ui/`

### ❌ WRONG Paths (DO NOT USE)
- ❌ `backend/src/` → Use `apps/api/src/`
- ❌ `backend/prisma/` → Use `libs/common/prisma/`
- ❌ Relative imports across services → Use `@verofield/common/*`

---

## 🔍 Mandatory Searches (Before ANY Code)

```typescript
// Execute these in parallel:
1. codebase_search("How does [FEATURE] work?")
2. glob_file_search("**/*[pattern]*.tsx")
3. grep -r "[pattern]" frontend/src/components/
4. read_file("docs/reference/COMPONENT_LIBRARY_CATALOG.md")
5. read_file("docs/reference/DEVELOPMENT_BEST_PRACTICES.md")
```

**DO NOT skip these searches.**

---

## 🛑 HARD STOPS

**STOP if:**
- ❌ File path is wrong (check `.cursor/rules/monorepo.md`)
- ❌ Component already exists (check `ui/` directory)
- ❌ Database query missing `tenantId` (check `.cursor/rules/security.md`)
- ❌ Using old import paths (check `.cursor/rules/monorepo.md`)
- ❌ Not following form pattern (check `.cursor/rules/forms.md`)
- ❌ Modifying state logic without state machine documentation (check `.cursor/rules/state-integrity.md`)
- ❌ Schema change without updating all contract layers (check `.cursor/rules/contracts.md`)
- ❌ Installing dependency without checking for existing library (check `.cursor/rules/dependencies.md`)
- ❌ Multi-step DB operation without transaction (check `.cursor/rules/database-integrity.md`)
- ❌ Architecture change without explicit permission (check `.cursor/rules/architecture-scope.md`)
- ❌ N+1 queries detected (check `.cursor/rules/performance.md`)
- ❌ Event without schema validation (check `.cursor/rules/eventing.md`)
- ❌ Platform-specific API without checks (check `.cursor/rules/cross-platform.md`)
- ❌ Missing aria labels on interactive elements (check `.cursor/rules/accessibility.md`)
- ❌ Modifying lockfiles without permission (check `.cursor/rules/tooling.md`)
- ❌ Refactoring without behavior-diff tests (check `.cursor/rules/refactoring.md`)

---

## ✅ Most Common Rules

### Rule 1: Search First
**MUST** search before creating anything  
**Check:** `.cursor/rules/enforcement.md`

### Rule 2: Use Existing Components
**MUST** check `frontend/src/components/ui/` first  
**Check:** `.cursor/rules/frontend.md`

### Rule 3: Tenant Isolation
**MUST** include `tenantId` in all database queries  
**Check:** `.cursor/rules/security.md`

### Rule 4: Correct File Paths
**MUST** use monorepo structure paths  
**Check:** `.cursor/rules/monorepo.md`

### Rule 5: Standard Forms
**MUST** use react-hook-form + zod + standard components  
**Check:** `.cursor/rules/forms.md`

### Rule 6: Date Compliance ⭐ **CRITICAL**
**MUST** check device/system date before writing ANY date  
**NEVER** hardcode dates - always use current date  
**Check:** `.cursor/rules/core.md` - Date & Time Handling  
**Format:** ISO 8601: `YYYY-MM-DD` (e.g., `2025-12-05`)

### Rule 7: File Audit Compliance ⭐ **MANDATORY**
**MUST** audit ALL files touched for code compliance  
**MUST** verify: paths, imports, security, dates, patterns, TypeScript  
**MUST** fix violations before proceeding  
**Check:** `.cursor/rules/enforcement.md` - Post-Implementation Audit

### Rule 8: State Machine Integrity ⭐ **CRITICAL**
**MUST** search for state machine documentation before modifying state logic  
**MUST** document valid states, transitions, illegal transitions, recovery paths  
**MUST** log all state transitions with traceId  
**MUST** test illegal transition scenarios  
**Check:** `.cursor/rules/state-integrity.md`

### Rule 9: Contract Consistency ⭐ **CRITICAL**
**MUST** search for all contract definitions before schema changes  
**MUST** verify frontend types match backend DTOs  
**MUST** update all affected validators (Zod, class-validator)  
**MUST** version breaking changes  
**Check:** `.cursor/rules/contracts.md`

### Rule 10: Dependency Governance ⭐ **CRITICAL**
**MUST** search codebase for existing library before installing  
**MUST** check all package.json files in monorepo  
**MUST** run `npm audit` before adding dependencies  
**MUST** consolidate duplicates (e.g., dayjs vs date-fns)  
**Check:** `.cursor/rules/dependencies.md`

### Rule 11: Database Transaction Safety ⭐ **CRITICAL**
**MUST** wrap multi-step operations in transactions  
**MUST** verify foreign key constraints exist  
**MUST** check ON DELETE/ON UPDATE rules  
**MUST** create migration scripts for schema changes  
**Check:** `.cursor/rules/database-integrity.md`

### Rule 12: Layer Synchronization ⭐ **CRITICAL**
**MUST** update all layers when touching any layer (DB → DTOs → types → tests)  
**MUST** verify OpenAPI spec matches implementation  
**MUST** update frontend types when backend DTOs change  
**Check:** `.cursor/rules/layer-sync.md`

### Rule 13: Architecture Scope ⭐ **CRITICAL**
**MUST NOT** change architecture without explicit permission  
**MUST** preserve existing layering  
**MUST** justify any architectural modifications  
**Check:** `.cursor/rules/architecture-scope.md`

### Rule 14: Performance Budgets ⭐ **HIGH**
**MUST** analyze performance characteristics before implementation  
**MUST** detect N+1 queries, redundant calls, missing indexes  
**MUST** reference PERFORMANCE_BUDGETS.md for thresholds  
**Check:** `.cursor/rules/performance.md`

### Rule 15: Event Consistency ⭐ **HIGH**
**MUST** validate event schemas before producing  
**MUST** use idempotency keys for critical events  
**MUST** log all event operations  
**Check:** `.cursor/rules/eventing.md`

### Rule 16: Cross-Platform Compatibility ⭐ **HIGH**
**MUST** detect platform-specific code (browser-only, Node-only, React Native)  
**MUST** use shared libraries from `libs/common/`  
**MUST** test compatibility across platforms  
**Check:** `.cursor/rules/cross-platform.md`

### Rule 17: Accessibility ⭐ **HIGH**
**MUST** enforce WCAG AA compliance  
**MUST** add aria labels to interactive elements  
**MUST** ensure keyboard navigation works  
**MUST** run accessibility checks (axe-core, Lighthouse)  
**Check:** `.cursor/rules/accessibility.md`

### Rule 18: Tooling Consistency ⭐ **HIGH**
**MUST NOT** modify lockfiles without explicit permission  
**MUST** respect package.json versions  
**MUST** run TypeScript compiler checks  
**MUST** fix lint/format violations  
**Check:** `.cursor/rules/tooling.md`

### Rule 19: Refactor Integrity ⭐ **HIGH**
**MUST** create behavior-diff tests before refactoring  
**MUST** add regression tests matching old behavior  
**MUST** explain refactor risk surface  
**Check:** `.cursor/rules/refactoring.md`

### Rule 20: UX Consistency ⭐ **NORMAL-HIGH**
**MUST** follow documented UI patterns  
**MUST** use design system components  
**MUST** enforce consistent spacing/typography  
**Check:** `.cursor/rules/ux-consistency.md`

### Rule 21: File Ownership ⭐ **HIGH**
**MUST** respect domain file ownership  
**MUST NOT** modify out-of-scope modules without permission  
**MUST** add ownership tags to files  
**Check:** `.cursor/rules/ownership.md`

### Rule 22: Tech Debt Logging ⭐ **NORMAL-HIGH**
**MUST** log technical debt in docs/tech-debt.md  
**MUST** identify unfinished work (TODOs, FIXMEs)  
**MUST** clean up TODOs/FIXMEs when completing work  
**Check:** `.cursor/rules/tech-debt.md`

---

## 📋 Quick Compliance Check

Before submitting code:
- [ ] Searched for existing component?
- [ ] File in correct directory?
- [ ] Imports use correct paths?
- [ ] Database query includes tenantId?
- [ ] Following established pattern?
- [ ] **Checked device date before writing?** ⭐ **CRITICAL**
- [ ] Documentation updated with current date (not hardcoded)?
- [ ] **Audited ALL files touched for compliance?** ⭐ **MANDATORY**
- [ ] State machine documented (if stateful component)?
- [ ] All contract layers updated (if schema change)?
- [ ] Dependency checked for existing usage?
- [ ] Multi-step DB operations in transactions?
- [ ] All layers synchronized (DB → DTOs → types → tests)?
- [ ] Performance characteristics analyzed?
- [ ] Event schemas validated?
- [ ] Accessibility checks passed?
- [ ] Lint/format violations fixed?
- [ ] Behavior-diff tests created (if refactoring)?

---

**See full rules in `.cursor/rules/` directory**

