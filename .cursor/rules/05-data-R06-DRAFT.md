# R06: Breaking Change Documentation — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R06 - Breaking Change Documentation  
**Priority:** HIGH (Tier 2 - OVERRIDE)  
**MAD Tier:** 2 (OVERRIDE REQUIRED - Needs justification)

---

## Purpose

R06 ensures that breaking changes are properly flagged, documented, and provide migration guidance to prevent production failures and consumer confusion.

**Key Requirements:**
- Breaking changes must be flagged with `[BREAKING]` tag in PR title
- Migration guide must be created in `docs/migrations/`
- Version must be bumped (MAJOR increment)
- CHANGELOG.md must be updated with breaking changes section
- API documentation must be updated (if API changes)
- Consumers must be notified (if external APIs)

---

## Step 5: Post-Implementation Audit for Breaking Change Documentation

### R06: Breaking Change Documentation — Audit Procedures

**For code changes that introduce breaking changes:**

#### Breaking Change Detection

- [ ] **MANDATORY:** Verify breaking change is identified (removes/changes existing behavior)
- [ ] **MANDATORY:** Verify breaking change affects consumers (not just internal refactoring)
- [ ] **MANDATORY:** Verify breaking change type is identified (API, Database, Configuration, Behavioral)

#### PR Flagging

- [ ] **MANDATORY:** Verify PR title includes `[BREAKING]` tag
- [ ] **MANDATORY:** Verify PR description includes breaking changes section with:
  - What changed
  - Why it changed
  - Who is affected
- [ ] **MANDATORY:** Verify PR description links to migration guide

#### Migration Guide

- [ ] **MANDATORY:** Verify migration guide exists in `docs/migrations/[YYYY-MM-DD]-[feature]-migration.md`
- [ ] **MANDATORY:** Verify migration guide includes:
  - What changed (detailed description)
  - Why it changed (rationale)
  - Who is affected (consumers/modules)
  - Step-by-step migration instructions
  - Before/after code examples
  - Rollback instructions
  - Testing checklist
- [ ] **MANDATORY:** Verify migration guide format matches template

#### Version Bump

- [ ] **MANDATORY:** Verify version bumped (MAJOR increment for breaking changes)
- [ ] **MANDATORY:** Verify version bump is in `package.json` (or equivalent)
- [ ] **MANDATORY:** Verify version format follows semantic versioning (MAJOR.MINOR.PATCH)

#### CHANGELOG Update

- [ ] **MANDATORY:** Verify CHANGELOG.md updated with breaking changes section
- [ ] **MANDATORY:** Verify breaking changes section includes:
  - List of breaking changes
  - Migration guide link
  - Version number
  - Date

#### API Documentation

- [ ] **MANDATORY:** Verify API documentation updated (if API changes)
- [ ] **MANDATORY:** Verify OpenAPI/Swagger docs updated (if applicable)
- [ ] **MANDATORY:** Verify deprecated endpoints marked (if gradual migration)

#### Consumer Notification

- [ ] **MANDATORY:** Verify consumers notified (if external APIs)
- [ ] **MANDATORY:** Verify notification includes:
  - What changed
  - When deploying
  - Impact description
  - Action required
  - Migration guide link
  - Deadline (if applicable)
- [ ] **SHOULD:** Verify deprecation timeline communicated (if gradual migration)
- [ ] **SHOULD:** Verify feature flag implemented (if immediate deployment)

#### Automated Checks

```bash
# Run breaking change documentation checker
python .cursor/scripts/check-breaking-changes.py --pr <PR_NUMBER>

# Check specific files for breaking changes
python .cursor/scripts/check-breaking-changes.py --files <file1> <file2>

# Expected: No violations found
```

#### OPA Policy

- **Policy:** `services/opa/policies/data-integrity.rego` (R06 section)
- **Enforcement:** OVERRIDE (Tier 2 MAD) - Requires justification
- **Tests:** `services/opa/tests/data_integrity_r06_test.rego`

#### Manual Verification (When Needed)

1. **Review PR Title** - Verify `[BREAKING]` tag present
2. **Review Migration Guide** - Verify completeness and accuracy
3. **Check Version Bump** - Verify MAJOR increment
4. **Verify CHANGELOG** - Verify breaking changes documented

**Example Breaking Change PR:**

```markdown
## [BREAKING] Remove legacy authentication endpoints (v2.0.0)

**Breaking Changes:**
- Removed `/api/v1/auth/login` endpoint
- Removed `/api/v1/auth/token` endpoint
- Removed `legacy_token` field from User model

**Why:**
- Legacy auth has known security vulnerabilities
- OAuth2 is now standard
- Reduces maintenance burden

**Who Is Affected:**
- Mobile app (v1.x)
- Legacy web app
- 3rd-party integrations (confirmed: none active)

**Migration Guide:** `docs/migrations/2025-11-23-auth-v2-migration.md`

**Version Bump:** 1.5.3 → 2.0.0

**Rollback Plan:** Feature flag `USE_LEGACY_AUTH` allows reverting
```

**Example Migration Guide:**

```markdown
# Migration Guide: Authentication v2.0

**Date:** 2025-11-23  
**Version:** 1.5.3 → 2.0.0  
**Author:** @username  
**Breaking Changes:** Removed legacy authentication endpoints

---

## What Changed

- Removed `/api/v1/auth/login` endpoint
- Removed `/api/v1/auth/token` endpoint
- Removed `legacy_token` field from User model
- OAuth2 is now the only authentication method

## Why It Changed

- Legacy auth has known security vulnerabilities
- OAuth2 provides better security and scalability
- Reduces maintenance burden

## Who Is Affected

- [x] External API consumers
- [x] Internal services: Mobile app (v1.x)
- [x] Frontend applications: Legacy web app
- [ ] Mobile applications: Already using OAuth2
- [ ] Third-party integrations: None active

## Migration Steps

### Step 1: Update Authentication Endpoints

**Before:**
```typescript
// Old code using legacy auth
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  body: JSON.stringify({ username, password })
});
const { token } = await response.json();
```

**After:**
```typescript
// New code using OAuth2
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
// Old code accessing legacy_token
const user = await getUser(userId);
const legacyToken = user.legacy_token;
```

**After:**
```typescript
// New code - legacy_token removed
const user = await getUser(userId);
// Use OAuth2 tokens instead
const token = await oauth2Client.getTokenForUser(userId);
```

### Step 3: Update Tests

**Before:**
```typescript
// Old test using legacy endpoint
it('should authenticate user', async () => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({ username, password });
  expect(response.status).toBe(200);
});
```

**After:**
```typescript
// New test using OAuth2
it('should authenticate user', async () => {
  const token = await oauth2Client.getToken({ /* ... */ });
  expect(token).toBeDefined();
});
```

## Rollback Instructions

If you need to rollback:

1. Enable feature flag: `USE_LEGACY_AUTH=true`
2. Legacy endpoints will be available for 30 days
3. Contact #api-support for extended support

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
```

**Example CHANGELOG Entry:**

```markdown
## [2.0.0] - 2025-11-23

### Breaking Changes

#### Authentication
- **Removed** `/api/v1/auth/login` endpoint
- **Removed** `/api/v1/auth/token` endpoint
- **Removed** `legacy_token` field from User model
- **Migration Guide:** `docs/migrations/2025-11-23-auth-v2-migration.md`

#### API Changes
- **Changed** error response format (now includes `code` field)
- **Migration Guide:** `docs/migrations/2025-11-23-api-error-format-migration.md`

### Added
- OAuth2 authentication support
- New error response format with error codes

### Changed
- Improved authentication security
```

---

**Last Updated:** 2025-11-23  
**Maintained By:** Data Team  
**Review Frequency:** Quarterly or when breaking change requirements change



