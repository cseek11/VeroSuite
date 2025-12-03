# R15: TODO/FIXME Handling — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R15 - TODO/FIXME Handling  
**Priority:** MEDIUM (Tier 3 - WARNING)  
**MAD Tier:** 3 (WARNING - Logged but doesn't block)

---

## Purpose

R15 ensures that TODO/FIXME comments are properly handled:

- **Detection:** All TODO/FIXME comments in touched areas are identified
- **Resolution:** Resolved TODOs are removed from code
- **Logging:** Meaningful TODOs are logged in `docs/tech-debt.md`
- **Distinction:** Meaningful TODOs (log as debt) vs trivial TODOs (complete in PR)

**Key Requirements:**
- AI must search for TODO/FIXME in touched areas
- If TODO/FIXME is resolved: remove comment, update tech-debt.md entry
- Meaningful TODOs must be logged as debt (requires >2 hours OR creates risk)
- Trivial TODOs must be completed in same PR (not logged as debt)

---

## Step 5: Post-Implementation Audit for TODO/FIXME Handling

### R15: TODO/FIXME Handling — Audit Procedures

**For code changes that introduce, modify, or resolve TODO/FIXME comments:**

#### TODO/FIXME Detection

- [ ] **MANDATORY:** Verify all TODO comments in touched areas are identified
- [ ] **MANDATORY:** Verify all FIXME comments in touched areas are identified
- [ ] **MANDATORY:** Verify comment context is analyzed (code vs documentation)
- [ ] **MANDATORY:** Verify comment location is recorded (file path, line number)
- [ ] **RECOMMENDED:** Verify comment content is analyzed for meaningful vs trivial distinction

#### Meaningful vs Trivial TODO Distinction

- [ ] **MANDATORY:** Verify meaningful TODOs are identified (requires >2 hours OR creates risk)
- [ ] **MANDATORY:** Verify meaningful TODOs include: workarounds, deferred work, technical shortcuts, multi-file issues
- [ ] **MANDATORY:** Verify trivial TODOs are identified (current PR work, ideas for future, minor cleanup)
- [ ] **MANDATORY:** Verify trivial TODOs are NOT logged as debt
- [ ] **RECOMMENDED:** Verify heuristic analysis is applied (keyword detection, effort estimation)

#### Meaningful TODO Logging

- [ ] **MANDATORY:** Verify meaningful TODOs are logged in `docs/tech-debt.md`
- [ ] **MANDATORY:** Verify meaningful TODOs include reference to tech-debt.md entry in comment
- [ ] **MANDATORY:** Verify meaningful TODOs follow R14 debt logging requirements (category, priority, location, impact, remediation plan, effort estimate)
- [ ] **MANDATORY:** Verify meaningful TODOs are cross-referenced (comment links to tech-debt.md entry)
- [ ] **RECOMMENDED:** Verify meaningful TODOs include context (why deferred, what risk)

#### Trivial TODO Resolution

- [ ] **MANDATORY:** Verify trivial TODOs for current PR work are completed in same PR
- [ ] **MANDATORY:** Verify trivial TODOs are removed from code when resolved
- [ ] **MANDATORY:** Verify ideas for future features are NOT logged (use backlog instead)
- [ ] **MANDATORY:** Verify minor cleanup TODOs are completed when touched
- [ ] **RECOMMENDED:** Verify refactoring notes are removed after refactoring

#### TODO Resolution Verification

- [ ] **MANDATORY:** Verify resolved TODOs are removed from code
- [ ] **MANDATORY:** Verify tech-debt.md entry is updated when TODO resolved (status: "Resolved")
- [ ] **MANDATORY:** Verify resolution notes are added to tech-debt.md (if non-obvious solution)
- [ ] **MANDATORY:** Verify no orphaned TODOs are left in code (TODOs without corresponding debt entries)
- [ ] **RECOMMENDED:** Verify resolved TODOs include brief comment explaining solution (if non-obvious)

#### Comment Context Analysis

- [ ] **MANDATORY:** Verify TODO/FIXME in code (implementation) vs documentation is distinguished
- [ ] **MANDATORY:** Verify code TODOs are prioritized (affect functionality)
- [ ] **MANDATORY:** Verify documentation TODOs are handled appropriately (update docs or log as debt)
- [ ] **RECOMMENDED:** Verify comment context is analyzed (function, class, module level)

#### Cross-Referencing

- [ ] **MANDATORY:** Verify meaningful TODOs reference tech-debt.md entry (e.g., `// TODO: Fix N+1 query (see docs/tech-debt.md#DEBT-001)`)
- [ ] **MANDATORY:** Verify tech-debt.md entries reference TODO location (file path, line number)
- [ ] **MANDATORY:** Verify cross-references are accurate (TODO exists, debt entry exists)
- [ ] **RECOMMENDED:** Verify cross-references use anchors (e.g., `#DEBT-001`)

#### Automated Checks

```bash
# Run TODO/FIXME checker
python .cursor/scripts/check-todo-fixme.py --file <file_path>

# Check all changed files
python .cursor/scripts/check-todo-fixme.py --pr <PR_NUMBER>

# Check for orphaned TODOs
python .cursor/scripts/check-todo-fixme.py --check-orphaned

# Expected: Warnings for unresolved meaningful TODOs (does not block)
```

#### OPA Policy

- **Policy:** `services/opa/policies/tech-debt.rego` (R15 section)
- **Enforcement:** WARNING (Tier 3 MAD) - Logged but doesn't block
- **Tests:** `services/opa/tests/tech_debt_r15_test.rego`

#### Manual Verification (When Needed)

1. **Review TODO/FIXME Comments** - Identify all TODO/FIXME comments in changed code
2. **Distinguish Meaningful vs Trivial** - Apply criteria (requires >2 hours OR creates risk)
3. **Verify Meaningful TODOs Logged** - Check that meaningful TODOs are logged in `docs/tech-debt.md`
4. **Verify Trivial TODOs Resolved** - Check that trivial TODOs are completed in same PR
5. **Verify Resolved TODOs Removed** - Check that resolved TODOs are removed from code

**Example Meaningful TODO Logged (✅):**

```typescript
// ✅ CORRECT: Meaningful TODO logged as debt
async getWorkOrders() {
  // TODO: Fix N+1 query issue (see docs/tech-debt.md#DEBT-001)
  // This is meaningful debt: requires >2 hours to fix, creates performance risk
  const workOrders = await this.prisma.workOrder.findMany();
  for (const order of workOrders) {
    order.customer = await this.prisma.customer.findUnique({
      where: { id: order.customerId }
    });
  }
  return workOrders;
}
```

**Example Trivial TODO Completed (✅):**

```typescript
// ✅ CORRECT: Trivial TODO completed in same PR
async getWorkOrders(page: number = 1, limit: number = 10) {
  // TODO was: "Add pagination" - completed in this PR
  return this.prisma.workOrder.findMany({
    skip: (page - 1) * limit,
    take: limit
  });
}
```

**Example TODO Left After Resolving (❌):**

```typescript
// ❌ VIOLATION: TODO left after completing work
async getWorkOrders(page: number = 1, limit: number = 10) {
  // TODO: Add pagination  // VIOLATION: Should be removed, pagination is implemented
  return this.prisma.workOrder.findMany({
    skip: (page - 1) * limit,
    take: limit
  });
}
```

**Example Meaningful TODO Not Logged (❌):**

```typescript
// ❌ VIOLATION: Meaningful TODO not logged as debt
async getWorkOrders() {
  // TODO: Fix N+1 query issue (deferred due to time constraints)
  // VIOLATION: Should be logged in docs/tech-debt.md
  const workOrders = await this.prisma.workOrder.findMany();
  for (const order of workOrders) {
    order.customer = await this.prisma.customer.findUnique({
      where: { id: order.customerId }
    });
  }
  return workOrders;
}
```

**Example Trivial TODO Logged as Debt (❌):**

```typescript
// ❌ VIOLATION: Trivial TODO logged as debt (should complete in PR)
async getWorkOrders() {
  // TODO: Add pagination
  // VIOLATION: This is trivial (can be done in same PR), should NOT be logged as debt
  return this.prisma.workOrder.findMany();
}
```

**Example Orphaned TODO (❌):**

```typescript
// ❌ VIOLATION: Orphaned TODO (no corresponding debt entry)
async getWorkOrders() {
  // TODO: Fix N+1 query issue (see docs/tech-debt.md#DEBT-001)
  // VIOLATION: DEBT-001 does not exist in tech-debt.md
  const workOrders = await this.prisma.workOrder.findMany();
  // ...
}
```

**Example Proper Resolution (✅):**

```typescript
// ✅ CORRECT: TODO resolved and removed
async getWorkOrders(page: number = 1, limit: number = 10) {
  // TODO was resolved: Added pagination
  // tech-debt.md entry updated: Status changed to "Resolved"
  return this.prisma.workOrder.findMany({
    skip: (page - 1) * limit,
    take: limit
  });
}
```

---

**Last Updated:** 2025-11-23  
**Maintained By:** Platform Core Team  
**Review Frequency:** Quarterly or when TODO/FIXME requirements change





