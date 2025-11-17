---
title: Contributing to Documentation
category: Development
status: active
last_reviewed: 2025-11-11
owner: documentation_admin
related:
  - docs/README.md
  - docs/OWNERS.md
---

# Contributing to Documentation

This guide explains how to contribute to VeroField documentation.

## Documentation Standards

### File Naming
- **Guides**: kebab-case, descriptive (`getting-started.md`, `form-patterns.md`)
- **References**: kebab-case, noun (`component-catalog.md`, `design-system.md`)
- **Decisions**: kebab-case, decision-focused (`design-system-colors.md`)
- **Archive**: Preserve original names in subdirectories

### Frontmatter Metadata

Every documentation file MUST include frontmatter:

```yaml
---
title: Component Library Guide
category: Development
status: active
last_reviewed: 2025-11-11
owner: frontend_team
related:
  - docs/reference/design-system.md
  - docs/guides/development/styling-guide.md
---
```

**Required Fields:**
- `title`: Human-readable title
- `category`: One of: Development, Reference, Architecture, Deployment, API
- `status`: `active`, `deprecated`, `archived`
- `last_reviewed`: ISO date (YYYY-MM-DD)
- `owner`: Team or individual responsible
- `related`: Array of related doc paths (optional but recommended)

### Structure Template

```markdown
---
title: [Title]
category: [Category]
status: active
last_reviewed: [Date]
owner: [Owner]
---

# Title

Brief description (1-2 sentences)

## Overview
[Context and purpose]

## [Main Content Sections]

## Examples
[Code examples if applicable]

## Related Documentation
- Link to related guides
- Link to reference docs

## Last Updated
[Date]
```

## Documentation Categories

### Guides (`docs/guides/`)
Active development guides:
- `getting-started/` - Onboarding and setup
- `development/` - Development best practices and patterns
- `deployment/` - Deployment and operations
- `api/` - API documentation

### Reference (`docs/reference/`)
Reference documentation:
- Design system
- Component catalog
- Database schema
- Keyboard shortcuts
- Context map

### Architecture (`docs/architecture/`)
Architecture documentation:
- System overview
- Frontend/backend architecture
- Database architecture
- Security architecture

### Decisions (`docs/decisions/`)
Architectural decision records:
- Decision log
- Individual decision records

### Archive (`docs/archive/`)
Historical documentation:
- Inconsistency reports
- Implementation summaries
- Migration notes
- Completed developer tickets

## Adding New Documentation

### 1. Choose the Right Location

- **Development guides** → `docs/guides/development/`
- **API docs** → `docs/guides/api/`
- **Reference** → `docs/reference/`
- **Architecture** → `docs/architecture/`
- **Decisions** → `docs/decisions/`

### 2. Add Frontmatter

Include all required frontmatter fields.

### 3. Follow Structure Template

Use the structure template above.

### 4. Link from Index

Add links to:
- `docs/README.md` (if appropriate)
- Related documentation files
- Context map if applicable

### 5. Update Ownership

If creating a new area, update `docs/OWNERS.md`.

## Updating Existing Documentation

### When to Update

- **Active guides**: Update when patterns change
- **Reference docs**: Update when APIs/components change
- **Decisions**: Add new decision records, don't modify old ones
- **Archive**: Move completed work monthly

### Update Process

1. Update content
2. Update `last_reviewed` date in frontmatter
3. Update "Last Updated" at bottom if present
4. Update `docs/CHANGELOG.md` for significant changes

## Archiving Documentation

### When to Archive

- Documentation not updated in 60+ days
- Feature/implementation completed
- Superseded by newer documentation

### Archive Process

1. Move file to appropriate `docs/archive/` subdirectory
2. Update frontmatter `status: archived`
3. Update `last_reviewed` date
4. Add entry to `docs/archive/README.md` if significant

## Review Process

### Reviewers

See `docs/OWNERS.md` for documentation owners and reviewers.

### Review Checklist

- [ ] Frontmatter complete and correct
- [ ] Follows structure template
- [ ] Links are valid
- [ ] Code examples are accurate
- [ ] Related documentation linked
- [ ] Ownership assigned

## Maintenance

### Review Schedule

- **Monthly**: Development guides
- **On Change**: API docs, component catalog
- **Quarterly**: Architecture docs
- **As Needed**: Other documentation

### Stale Documentation

Documentation not updated within 90 days will be flagged as stale. Owners should:
1. Review stale documentation
2. Update if still accurate
3. Archive if no longer relevant
4. Transfer ownership if needed

## Code ↔ Documentation Linking

### JSDoc/TSDoc Integration

Use `@see` tags to link code to documentation:

```typescript
/**
 * Handles CRM job scheduling.
 * @see docs/guides/development/component-library.md
 * @see docs/architecture/frontend-architecture.md
 */
```

### CI Validation

CI validates that referenced docs exist and reports broken links.

## Questions?

- Check [Documentation Hub](README.md)
- Review [Ownership Map](OWNERS.md)
- Contact documentation owner from `docs/OWNERS.md`

---

**Last Updated:** 2025-11-11  
**Maintained By:** Documentation Admin






