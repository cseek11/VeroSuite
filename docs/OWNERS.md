# Documentation Ownership Map

This document assigns responsibility for maintaining different areas of documentation.

## Ownership Structure

| Area | Owner | Backup | Review Frequency |
|------|--------|--------|------------------|
| Frontend Guides | @frontend-lead | @frontend-dev | Monthly |
| Backend Guides | @backend-lead | @devops | Monthly |
| API Docs | @api-lead | @qa | On API changes |
| Architecture | @tech-architect | @project-manager | Quarterly |
| Design System | @design-lead | @frontend-lead | On design changes |
| Deployment | @devops | @backend-lead | On deployment changes |
| Developer Portal | @documentation_admin | @lead_engineer | As needed |

## Responsibilities

### Primary Owners
- Review and update documentation in their area
- Ensure accuracy and completeness
- Respond to documentation issues/PRs
- Archive outdated content

### Backup Owners
- Step in when primary owner is unavailable
- Review documentation changes
- Maintain continuity

## Review Process

1. **Monthly Reviews**: Frontend/Backend guides reviewed monthly
2. **On Change**: API docs updated when APIs change
3. **Quarterly**: Architecture docs reviewed quarterly
4. **As Needed**: Other docs updated as needed

## Stale Documentation

Documentation not updated within 90 days will be flagged as stale. Owners should:
1. Review stale documentation
2. Update if still accurate
3. Archive if no longer relevant
4. Transfer ownership if needed

## Adding New Documentation

When adding new documentation:
1. Assign an owner from this map
2. Add entry to this file if new area
3. Set frontmatter `owner` field
4. Add to appropriate category






