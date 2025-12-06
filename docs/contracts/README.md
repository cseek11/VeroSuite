# Contract Registry

**Last Updated:** 2025-12-05  
**Purpose:** Central registry for all API contracts, event schemas, and data transfer objects

---

## Overview

This directory contains documentation for all contracts in the VeroSuite system. Contracts define the shape of data exchanged between frontend, backend, mobile, and microservices.

---

## Contract Documentation Template

When documenting a new contract, use this template:

```markdown
# [Entity Name] Contract

**Entity:** [Entity name]
**Version:** [Version number]
**Last Updated:** [Current date - use system date]
**Status:** [Active/Deprecated]

## Contract Definition

### Database Schema
```prisma
model [Entity] {
  id          String   @id @default(uuid())
  // ... fields
}
```

### Backend DTO
```typescript
export class [Entity]Dto {
  id!: string;
  // ... fields
}
```

### Frontend Type
```typescript
interface [Entity] {
  id: string;
  // ... fields
}
```

### Validation Schema
```typescript
// Zod schema (frontend)
const [entity]Schema = z.object({
  id: z.string().uuid(),
  // ... fields
});

// class-validator (backend)
export class Create[Entity]Dto {
  @IsUUID()
  id!: string;
  // ... fields
}
```

## Contract Versions

### Version 1.0 (Current)
- Initial contract definition
- Fields: [list]

### Version 2.0 (Planned)
- Breaking changes: [list]
- Migration path: [path]

## Contract Consumers

- **Frontend:** `frontend/src/types/[entity].ts`
- **Backend:** `apps/api/src/[module]/dto/[entity].dto.ts`
- **Mobile:** `VeroSuiteMobile/src/types/[entity].ts`
- **Events:** `libs/common/src/types/events.ts` (if applicable)

## Breaking Changes

- [List of breaking changes and versions]

## Migration Guide

- [Migration steps for breaking changes]
```

---

## Contract Categories

### API Contracts
- Work Orders
- Customers
- Jobs
- Accounts
- [Add more as needed]

### Event Contracts
- Work Order Created
- Customer Updated
- Job Completed
- [Add more as needed]

---

## Adding New Contracts

1. Create documentation file: `docs/contracts/[entity-name].md`
2. Use the template above
3. Update this README with reference to new contract
4. Ensure all layers (DB, DTOs, types, validation) are documented

---

## Contract Versioning

**Version Format:** `MAJOR.MINOR.PATCH`

- **MAJOR:** Breaking changes
- **MINOR:** Non-breaking additions
- **PATCH:** Bug fixes

**Breaking Changes:**
- Removing required fields
- Changing field types
- Removing enum values
- Changing field names

**Non-Breaking Changes:**
- Adding optional fields
- Adding new enum values
- Adding new endpoints

---

**Reference:** See `.cursor/rules/contracts.md` for contract consistency requirements.

