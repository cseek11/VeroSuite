# Migration Guides

**Last Updated:** 2025-11-23  
**Purpose:** Index of all migration guides for breaking changes

---

## Overview

This directory contains migration guides for all breaking changes in VeroField. Each guide provides step-by-step instructions for migrating code, data, and configurations when breaking changes are introduced.

---

## When to Create a Migration Guide

**MANDATORY:** Create a migration guide when introducing a breaking change:

### Breaking Changes Include:
- **API Changes:** Removing endpoints, changing schemas, changing auth requirements
- **Database Changes:** Removing columns, changing types, removing tables
- **Configuration Changes:** Removing env vars, changing required config
- **Behavioral Changes:** Changing business logic outcomes, validation rules

### NOT Breaking Changes:
- Adding new endpoints
- Adding optional fields
- Adding new fields to responses
- Adding new nullable columns
- Deprecating (but not removing) features
- Performance improvements
- Bug fixes (unless consumers rely on buggy behavior)

---

## Migration Guide Template

Copy this template to create a new migration guide:

**File:** `docs/migrations/[YYYY-MM-DD]-[feature]-migration.md`

```markdown
# Migration Guide: [Feature Name]

**Date:** YYYY-MM-DD  
**Version:** X.0.0 → X+1.0.0  
**Author:** @username  
**Breaking Changes:** [Brief summary]

---

## What Changed

[Detailed description of what changed]

- Removed: [List removed features]
- Changed: [List changed features]
- Added: [List new features that replace old ones]

## Why It Changed

[Rationale for the breaking change]

- [Reason 1]
- [Reason 2]
- [Reason 3]

## Who Is Affected

- [ ] External API consumers
- [ ] Internal services: [list]
- [ ] Frontend applications
- [ ] Mobile applications
- [ ] Third-party integrations

## Migration Steps

### Step 1: [Action]

**Before:**
```typescript
// Old code
```

**After:**
```typescript
// New code
```

### Step 2: [Action]

**Before:**
```typescript
// Old code
```

**After:**
```typescript
// New code
```

### Step 3: [Action]

[Continue for all steps...]

## Rollback Instructions

If you need to rollback:

1. [Rollback step 1]
2. [Rollback step 2]
3. [Rollback step 3]

**Feature Flag:** If applicable, describe feature flag for gradual rollout

**Rollback Deadline:** [Date after which rollback is no longer supported]

## Testing Checklist

- [ ] [Test 1]
- [ ] [Test 2]
- [ ] [Test 3]
- [ ] Verified rollback procedure works

## Support

- **Migration Guide:** `docs/migrations/[YYYY-MM-DD]-[feature]-migration.md`
- **Support Channel:** #api-support
- **Deadline:** [Date by which consumers must migrate]
- **Contact:** @username or team@company.com
```

---

## Migration Guides Index

### 2025

| Date | Version | Feature | Status | Guide |
|------|---------|---------|--------|-------|
| 2025-11-23 | 2.0.0 | Example Migration | Example | [Link](./2025-11-23-example-migration.md) |

---

## Creating a Migration Guide

### Step 1: Identify Breaking Change

Determine if your change is breaking:
- Does it remove existing functionality?
- Does it change existing behavior that consumers rely on?
- Will consumers need to update their code?

If yes to any, it's a breaking change.

### Step 2: Create Migration Guide

1. Copy the template above
2. Name file: `docs/migrations/[YYYY-MM-DD]-[feature]-migration.md`
3. Fill in all sections
4. Include code examples (before/after)
5. Provide rollback instructions
6. Add testing checklist

### Step 3: Update This Index

Add entry to the table above with:
- Date
- Version (MAJOR increment)
- Feature name
- Status (Draft/Active/Archived)
- Link to guide

### Step 4: Link from PR

In your PR description, link to the migration guide:

```markdown
## [BREAKING] Your PR Title

**Breaking Changes:**
- What changed
- Why it changed
- Who is affected

**Migration Guide:** `docs/migrations/[YYYY-MM-DD]-[feature]-migration.md`

**Version Bump:** X.Y.Z → X+1.0.0

**Rollback Plan:** [Brief description]
```

### Step 5: Update CHANGELOG

Add breaking changes section to CHANGELOG.md:

```markdown
## [X+1.0.0] - YYYY-MM-DD

### Breaking Changes

- [Breaking change 1]
- [Breaking change 2]
- **Migration Guide:** `docs/migrations/[YYYY-MM-DD]-[feature]-migration.md`

### Added
- [New features]

### Changed
- [Non-breaking changes]
```

---

## Migration Guide Best Practices

### Do's ✅
- ✅ Provide clear before/after code examples
- ✅ Include rollback instructions
- ✅ Specify who is affected
- ✅ Provide testing checklist
- ✅ Include support contact information
- ✅ Update this index
- ✅ Link from PR and CHANGELOG

### Don'ts ❌
- ❌ Skip migration guide for breaking changes
- ❌ Assume consumers know how to migrate
- ❌ Forget rollback instructions
- ❌ Leave migration guide as draft forever
- ❌ Use vague descriptions ("update your code")

---

## Example Migration Guides

### Good Example: Comprehensive Migration Guide

**File:** `docs/migrations/2025-11-23-auth-v2-migration.md`

```markdown
# Migration Guide: Authentication v2.0

**Date:** 2025-11-23  
**Version:** 1.5.3 → 2.0.0  
**Author:** @security-team  
**Breaking Changes:** Removed legacy authentication endpoints

---

## What Changed

- **Removed:** `/api/v1/auth/login` endpoint
- **Removed:** `/api/v1/auth/token` endpoint
- **Removed:** `legacy_token` field from User model
- **Added:** OAuth2 authentication flow

## Why It Changed

- Legacy auth has known security vulnerabilities (CVE-2024-XXXX)
- OAuth2 provides better security and scalability
- Reduces maintenance burden (legacy code was 3+ years old)

## Who Is Affected

- [x] External API consumers: Mobile app (v1.x)
- [x] Internal services: Legacy web app
- [ ] Third-party integrations: None active (verified)

## Migration Steps

### Step 1: Update Authentication Endpoints

**Before:**
```typescript
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  body: JSON.stringify({ username, password })
});
const { token } = await response.json();
```

**After:**
```typescript
import { oauth2Client } from '@/lib/oauth2';

const token = await oauth2Client.getToken({
  grant_type: 'authorization_code',
  code: authorizationCode,
  redirect_uri: redirectUri
});
```

### Step 2: Update User Model References

**Before:**
```typescript
const user = await getUser(userId);
const legacyToken = user.legacy_token;
```

**After:**
```typescript
const user = await getUser(userId);
// Use OAuth2 tokens instead
const token = await oauth2Client.getTokenForUser(userId);
```

## Rollback Instructions

If you need to rollback:

1. Enable feature flag: `USE_LEGACY_AUTH=true`
2. Legacy endpoints will be available for 30 days
3. Contact #api-support for extended support

**Rollback Deadline:** 2025-12-23 (30 days from deployment)

## Testing Checklist

- [ ] Updated authentication endpoints
- [ ] Removed legacy_token references
- [ ] Updated tests
- [ ] Verified OAuth2 flow works
- [ ] Tested rollback procedure

## Support

- **Migration Guide:** `docs/migrations/2025-11-23-auth-v2-migration.md`
- **Support Channel:** #api-support
- **Deadline:** 2025-12-23 (30 days)
- **Contact:** @security-team or security@company.com
```

---

## Related Documentation

- **Breaking Change Rules:** `.cursor/rules/05-data.mdc` (R06)
- **Semantic Versioning:** https://semver.org/
- **Keep a Changelog:** https://keepachangelog.com/
- **API Documentation:** `docs/api/`

---

**Last Updated:** 2025-11-23  
**Maintained By:** Data Team  
**Review Frequency:** Updated with each breaking change



