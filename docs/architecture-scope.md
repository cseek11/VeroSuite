---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - all
priority: critical
last_updated: 2025-12-05
always_apply: true
---

# PRIORITY: CRITICAL - Architectural Decision Autonomy Limits

## Overview

This rule file prevents the AI agent from making unintended architectural changes, preserving existing system architecture, layering, and structure unless explicitly granted permission.

**⚠️ MANDATORY:** The AI MUST NOT change architecture (microservices, folder structure, infrastructure) unless the request explicitly grants permission.

---

## I. Architectural Change Restrictions

### Rule 1: Prohibited Architectural Changes

**MANDATORY:** The AI MUST NOT change the following without explicit permission:

1. **Microservices Structure**
   - Creating new microservices
   - Merging microservices
   - Changing service boundaries
   - Moving services between `apps/` directories

2. **Folder Structure**
   - Changing directory organization
   - Moving files between major directories
   - Restructuring `apps/`, `libs/`, `services/` directories
   - Changing monorepo structure

3. **Infrastructure**
   - Changing deployment architecture
   - Modifying Docker/Kubernetes configurations
   - Changing database architecture
   - Modifying service communication patterns

4. **Layering**
   - Breaking domain → application → infrastructure layering
   - Mixing layers inappropriately
   - Creating circular dependencies between layers

**MANDATORY:** If architectural change is needed, STOP and ask for explicit permission.

### Rule 2: Explicit Permission Required

**MANDATORY:** Before making architectural changes, you MUST:

1. **Identify the Change** - Clearly describe what architectural change is proposed
2. **Justify the Change** - Explain why the change is necessary
3. **Assess Impact** - Describe impact on existing code
4. **Request Permission** - Ask user for explicit permission
5. **Wait for Approval** - Do not proceed until permission is granted

**Example:**
```
⚠️ ARCHITECTURAL CHANGE DETECTED

Proposed Change: Moving WorkOrderService from apps/api/src/work-orders/ 
                 to apps/crm-ai/src/work-orders/

Justification: WorkOrderService needs AI capabilities that are only 
                available in crm-ai service.

Impact: 
- Will break imports in apps/api/
- Will require updating all WorkOrderService consumers
- May affect API endpoints

⚠️ REQUIRES EXPLICIT PERMISSION

Please confirm: "Yes, proceed with architectural change" or 
                "No, find alternative solution"
```

---

## II. Layering Preservation

### Rule 3: Domain → Application → Infrastructure Layering

**MANDATORY:** Preserve existing layering structure:

**Layer Hierarchy:**
```
Domain Layer (Business Logic)
    ↓
Application Layer (Use Cases, Services)
    ↓
Infrastructure Layer (Database, APIs, External Services)
```

**MANDATORY:** Do NOT:
- Put infrastructure code in domain layer
- Put domain logic in infrastructure layer
- Create circular dependencies between layers
- Mix concerns across layers

**Example:**
```typescript
// ✅ CORRECT: Proper layering
// Domain Layer (apps/api/src/work-orders/domain/)
export class WorkOrder {
  // Business logic only
  calculateTotal(): number { ... }
}

// Application Layer (apps/api/src/work-orders/services/)
export class WorkOrderService {
  constructor(private repository: WorkOrderRepository) {}
  // Use cases, orchestration
}

// Infrastructure Layer (apps/api/src/work-orders/infrastructure/)
export class WorkOrderRepository {
  constructor(private prisma: PrismaClient) {}
  // Database access
}

// ❌ WRONG: Mixed layers
export class WorkOrderService {
  // Business logic (domain)
  calculateTotal(): number { ... }
  
  // Database access (infrastructure) - WRONG!
  async save() {
    await prisma.workOrder.create(...);
  }
}
```

### Rule 4: Dependency Direction

**MANDATORY:** Maintain correct dependency direction:

- **Domain** → No dependencies on other layers
- **Application** → Depends on Domain only
- **Infrastructure** → Depends on Domain and Application

**MANDATORY:** Do NOT create:
- Domain depending on Application
- Domain depending on Infrastructure
- Application depending on Infrastructure (use interfaces/abstractions)

---

## III. Monorepo Structure Preservation

### Rule 5: Directory Structure Rules

**MANDATORY:** Preserve monorepo directory structure:

**Do NOT change:**
- `apps/` - Microservices location
- `libs/common/` - Shared libraries location
- `services/` - External services location
- `frontend/` - Frontend application location
- `VeroFieldMobile/` (may still be `VeroSuiteMobile/` until renamed) - Mobile application location

**MANDATORY:** When adding new code:
- **Microservices** → `apps/[service-name]/src/`
- **Shared Libraries** → `libs/common/src/`
- **Frontend Components** → `frontend/src/components/`
- **Backend Modules** → `apps/api/src/[module]/`

**Reference:** See `.cursor/rules/monorepo.md` for complete structure.

### Rule 6: Service Boundaries

**MANDATORY:** Respect service boundaries:

- **Do NOT** move code between services without permission
- **Do NOT** create direct imports between services (use HTTP/gRPC)
- **Do NOT** duplicate code that should be in `libs/common/`
- **Do NOT** break service independence

**Example:**
```typescript
// ❌ WRONG: Direct import between services
// apps/api/src/work-orders/work-orders.service.ts
import { CodeGenService } from '../../crm-ai/src/services/codegen.service';

// ✅ CORRECT: HTTP/gRPC communication
// apps/api/src/work-orders/work-orders.service.ts
const response = await axios.post('http://crm-ai:3001/generate', data);
```

---

## IV. Justification Requirements

### Rule 7: Architectural Modification Justification

**MANDATORY:** When architectural modification is necessary, provide:

1. **Problem Statement** - What problem does the change solve?
2. **Current Architecture** - How does current architecture handle it?
3. **Proposed Change** - What architectural change is proposed?
4. **Alternatives Considered** - What other options were considered?
5. **Impact Analysis** - What code/files will be affected?
6. **Migration Path** - How will existing code be migrated?
7. **Risk Assessment** - What are the risks of this change?

**MANDATORY:** Document justification in `docs/engineering-decisions.md`.

**Reference:** See `.cursor/rules/pattern-learning.md` for decision documentation.

---

## V. Permission Request Format

### Rule 8: Explicit Permission Request

**MANDATORY:** When architectural change is needed, use this format:

```
⚠️ ARCHITECTURAL CHANGE REQUEST

Change Type: [Microservices/Folder Structure/Infrastructure/Layering]

Description:
[Clear description of proposed change]

Justification:
[Why this change is necessary]

Impact:
- Files affected: [list]
- Services affected: [list]
- Breaking changes: [list]

Alternatives Considered:
1. [Alternative 1] - Why rejected
2. [Alternative 2] - Why rejected

Migration Path:
[How existing code will be migrated]

Risk Assessment:
[High/Medium/Low] - [Risks]

⚠️ REQUIRES EXPLICIT PERMISSION

Please respond with:
- "Yes, proceed with architectural change" - To approve
- "No, find alternative solution" - To reject
- "Modify: [changes]" - To request modifications
```

**MANDATORY:** Do NOT proceed until explicit permission is granted.

---

## VI. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, identify:

- Current architecture patterns
- Existing layering structure
- Service boundaries
- Directory organization

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Proposed changes don't break architecture
- Layering is preserved
- Service boundaries are respected
- Directory structure is maintained

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- No architectural changes without permission
- Layering is preserved
- Service boundaries respected
- Directory structure maintained

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- No unintended architectural changes
- Layering preserved
- Service boundaries maintained
- Directory structure unchanged (unless permitted)

---

## Violations

**HARD STOP violations:**
- Changing architecture without explicit permission
- Breaking layering structure
- Moving code between services without permission
- Changing directory structure without permission
- Creating circular dependencies

**Must fix before proceeding:**
- Unintended architectural changes
- Broken layering
- Violated service boundaries
- Incorrect directory structure

---

**Last Updated:** 2025-12-05  
**Status:** Active Enforcement  
**Priority:** CRITICAL - Must be followed for every implementation

