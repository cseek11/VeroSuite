---
# Cursor Rule Metadata
version: 2.1
project: VeroField
scope:
  - frontend
  - backend
  - mobile
  - microservices
  - ai
priority: critical
last_updated: 2025-11-16
always_apply: true
---

# PRIORITY: CRITICAL - Core Philosophy & Standards

## Core Philosophy

**"Work WITH the existing project structure, not against it. Always search, analyze, and understand before implementing. Maximize efficiency through parallel operations and maintain the highest standards of code quality and security."**

**⚠️ CRITICAL: Before ANY implementation, you MUST:**
1. Read `.cursor/rules/enforcement.md` for mandatory checklist
2. Complete all mandatory searches (parallel execution)
3. Verify rule compliance before coding
4. Stop if any rule violation detected

**⚠️ CRITICAL: After ANY file modification, you MUST:**
1. Audit the file for code compliance
2. Verify file paths, imports, security, dates, patterns
3. Fix any violations found
4. Re-audit after fixes
5. Verify compliance before proceeding

**⚠️ CRITICAL: File Organization Checklist (MANDATORY):**
1. Verify file is in correct directory per `.cursor/rules/file-organization.md`
2. Verify no prohibited files in root directory
3. Verify documentation files are in `docs/` subdirectories
4. Verify assets are in `branding/assets/` or `docs/assets/`
5. Verify test outputs are gitignored or archived
6. Verify temporary files are cleaned up
7. Run `scripts/validate-file-organization.ps1` if available

**Reference:** See `.cursor/rules/file-organization.md` for complete file organization rules.

---

## PRIORITY: CRITICAL - Date & Time Handling

**⚠️ CRITICAL VIOLATION:** Hardcoding dates is a **HARD STOP** violation.

**MANDATORY PROCEDURE:**
1. **BEFORE writing ANY date:** Check current system/device date
2. **USE that exact date** - Never hardcode or assume
3. **FORMAT:** ISO 8601: `YYYY-MM-DD` (e.g., `2025-11-15`)
4. **VERIFY:** Date must match current system date exactly

**Rules:**
- ❌ **NEVER** hardcode dates like `2025-01-27` or `2025-11-11`
- ✅ **ALWAYS** check device/system date first
- ✅ **ALWAYS** use current date for "Last Updated" fields
- ✅ **ALWAYS** update "Last Updated" when modifying documentation
- ✅ Format dates as ISO 8601: `YYYY-MM-DD` or full datetime: `YYYY-MM-DD HH:MM:SS`
- ✅ For timestamps in code, use proper date/time libraries (Date, dayjs, etc.)

**Verification:**
- Before committing: Verify date matches current system date
- If date is wrong: STOP and fix before proceeding
- This is a **HARD STOP** violation - cannot proceed with wrong date

---

## PRIORITY: HIGH - Project Context & Architecture

### Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS (purple theme preferences)
- **Backend**: NestJS + Prisma + Supabase with comprehensive RLS
- **Database**: PostgreSQL with strict tenant isolation via Row Level Security (RLS)
- **Authentication**: JWT with multi-tenant security
- **State Management**: Zustand + React Query for efficient data fetching
- **Mobile**: React Native with offline-first architecture

### Project Structure (Post-Restructuring)
- **Components**: `/frontend/src/components/` - Follow established patterns
- **APIs**: `/frontend/src/lib/` and `/apps/api/src/` - Maintain consistency ⭐ **UPDATED**
- **Microservices**: `/apps/[service]/src/` - Independent services ⭐ **NEW**
- **Shared Libraries**: `/libs/common/src/` - Shared code ⭐ **NEW**
- **Database**: `libs/common/prisma/schema.prisma` - Preserve relationships and RLS ⭐ **UPDATED**
- **External Services**: `/services/` - Flink, Feast, OPA ⭐ **NEW**
- **Documentation**: All `.md` files - Keep current and accurate
- **Mobile App**: `VeroFieldMobile/` (may still be named `VeroSuiteMobile/` until renamed) - Production-ready React Native

---

## PRIORITY: HIGH - Code Organization

### File Structure Rules (Post-Restructuring)
- **Reusable components** → `frontend/src/components/ui/`
- **Feature components** → `frontend/src/components/[feature]/`
- **Main API modules** → `apps/api/src/[module]/` ⭐ **UPDATED**
- **AI services** → `apps/crm-ai/src/`, `apps/ai-soc/src/` ⭐ **NEW**
- **Shared libraries** → `libs/common/src/` ⭐ **NEW**
- **Database schema** → `libs/common/prisma/schema.prisma` ⭐ **UPDATED**
- **Forms** → Use standard form pattern
- **Dialogs** → Use Dialog component from ui/

### Naming Conventions
- Components: PascalCase (e.g., `CustomerSearchSelector.tsx`)
- Files: Match component name
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase

---

## PRIORITY: HIGH - Prohibited Actions

### ❌ DO NOT (HARD STOPS - VIOLATION = STOP):
1. ❌ **Create duplicate components** - MUST search first
2. ❌ **Implement custom customer search** - MUST use CustomerSearchSelector
3. ❌ **Create inline components (>50 lines)** - MUST extract to separate file
4. ❌ **Mix styling approaches** - MUST follow established patterns
5. ❌ **Skip component discovery** - MUST complete mandatory searches
6. ❌ **Ignore existing patterns** - MUST follow established conventions
7. ❌ **Create new form patterns** - MUST use standard form pattern
8. ❌ **Use basic Select for customers** - MUST use CustomerSearchSelector
9. ❌ **Assume field names** - MUST read existing schema first
10. ❌ **Make changes without explanation** - MUST explain decisions
11. ❌ **Commit `.env` files or secrets** - NEVER commit secrets
12. ❌ **Break tenant isolation** - MUST include tenantId in all queries
13. ❌ **Use old file paths** - MUST use monorepo structure (apps/, libs/)
14. ❌ **Skip rule compliance check** - MUST verify before coding

### ✅ DO:
1. Search before implementing
2. Reuse existing components
3. Follow established patterns
4. Match existing styling
5. Document deviations
6. Extract reusable code
7. Use standard imports
8. Follow naming conventions
9. Use parallel tool calls
10. Update documentation with current date/time
11. Maintain TypeScript type safety
12. Preserve tenant isolation

---

## PRIORITY: HIGH - Code Quality Standards

### TypeScript Requirements
- **100% TypeScript coverage** with proper interfaces
- Use proper type definitions for all props and functions
- Avoid `any` type - use proper types or `unknown`
- Use TypeScript interfaces for component props
- Follow ESLint rules from `frontend/.eslintrc.json` and `backend/.eslintrc.cjs`

### Error Handling
- Implement comprehensive error management following existing patterns
- Provide user-friendly error messages
- Log errors appropriately
- Handle edge cases

### Validation
- Add proper input validation and sanitization
- Use zod schemas for form validation
- Validate API responses
- Check for required fields

### Testing
- Include unit tests for new functionality when possible
- Test integration with existing systems
- Verify error handling
- Test tenant isolation
- **End-to-End Workflows:** For critical user workflows (e.g., invoice generation, payment processing, customer onboarding), consider adding E2E tests using Playwright
  - E2E tests should cover complete user journeys across multiple components
  - Focus on high-value workflows that span frontend → backend → database
  - E2E tests are recommended (not mandatory) for new features that represent core business functionality
  - See `.cursor/rules/verification.md` for detailed testing requirements

### Documentation
- Update relevant `.md` files for new features
- Include "Last Updated" timestamp with current date/time
- Document architectural decisions
- Explain complex logic

---

## PRIORITY: HIGH - Code Review Checklist

**Every implementation must verify:**
- [ ] Uses existing components from `ui/` directory
- [ ] Follows established form patterns
- [ ] Matches styling from style guides
- [ ] No duplicate functionality
- [ ] Proper TypeScript interfaces
- [ ] Error handling consistent with patterns
- [ ] Tenant isolation maintained
- [ ] Documentation updated with current date/time
- [ ] Security boundaries preserved
- [ ] ESLint rules followed

---

## PRIORITY: NORMAL - Quick Decision Tree

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

## PRIORITY: NORMAL - Key Reminders

1. **Reuse > Reinvent** - Always search first!
2. **Parallel > Sequential** - Use multiple tools simultaneously
3. **Pattern > Custom** - Follow established conventions
4. **Security > Speed** - Maintain tenant isolation
5. **Documentation > Code** - Keep docs current with date/time
6. **Type Safety > Convenience** - Use proper TypeScript types
7. **Component Library > Custom Code** - Use existing UI components

---

**Remember:** The goal is to work WITH the existing project structure, not against it. Always search, analyze, and understand before implementing. Maximize efficiency through parallel operations while maintaining the highest standards of quality and security.





