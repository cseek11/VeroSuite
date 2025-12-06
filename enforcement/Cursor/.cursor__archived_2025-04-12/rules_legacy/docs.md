---
# Cursor Rule Metadata
version: 1.5
project: VeroField
scope:
  - documentation
priority: high
last_updated: 2025-12-04
always_apply: true
---

# PRIORITY: HIGH - Documentation Standards

## PRIORITY: CRITICAL - Relationship to File Organization

**MANDATORY:** Documentation organization is a subset of comprehensive file organization rules.

**Reference:** See `.cursor/rules/file-organization.md` for complete file organization standards covering ALL directories and file types in the project.

**Key Points:**
- Documentation files (`.md`) are one category of files that must be organized
- All file organization rules apply to documentation files
- Root directory rules prohibit documentation files (except `README.md`)
- Documentation organization works in conjunction with overall file organization

**MANDATORY:** When organizing documentation, also verify compliance with `.cursor/rules/file-organization.md`.

---

## PRIORITY: HIGH - Documentation Organization & Location

**MANDATORY:** All documentation must be organized in the `docs/` directory structure.

### Files Allowed in Root Directory

**ONLY** the following files may remain in the project root:
- `README.md` - Project overview and setup (required by GitHub/GitLab)

**All other `.md` files MUST be organized in `docs/` subdirectories.**

### Documentation Directory Structure

```
docs/
├── reference/          # Essential reference documentation
│   ├── API.md
│   ├── DATABASE.md
│   ├── COMPONENT_LIBRARY_CATALOG.md
│   ├── DEVELOPMENT_BEST_PRACTICES.md
│   ├── AI_CONSISTENCY_PROTOCOL.md
│   ├── AI_ASSISTANT_BEST_PRACTICES.md
│   ├── SECURITY_SETUP_GUIDE.md
│   └── ...
├── guides/             # How-to guides and tutorials
│   ├── development/
│   ├── deployment/
│   ├── getting-started/
│   └── ...
├── architecture/       # System design and architecture docs
├── planning/           # Development plans and roadmaps
├── examples/           # Code examples and samples
├── developer/          # Developer tools, checklists, handoffs
├── archive/            # Historical documentation
│   ├── implementation-summaries/
│   ├── reports/
│   ├── testing/
│   ├── migrations/
│   └── deployment/
├── contracts/          # Data contract documentation
├── state-machines/     # State machine documentation
├── decisions/          # Engineering decisions (engineering-decisions.md)
├── error-patterns.md   # Error pattern documentation
└── tech-debt.md        # Technical debt log
```

### File Categorization Rules

**Reference Documentation** → `docs/reference/`
- API documentation
- Database schemas
- Component catalogs
- Best practices guides
- Security guides

**Implementation Summaries** → `docs/archive/implementation-summaries/`
- Implementation completion reports
- Feature completion summaries
- Integration summaries

**Reports & Analysis** → `docs/archive/reports/`
- Audit reports
- Analysis documents
- Evaluation reports
- Test summaries

**Planning Documents** → `docs/planning/`
- Development plans
- Roadmaps
- Requirements documents

**Design Documents** → `docs/architecture/`
- System design documents
- Architecture decisions
- Solution documents

**Guides** → `docs/guides/`
- Setup guides
- Deployment guides
- Troubleshooting guides
- Development guides

**Checklists & Handoffs** → `docs/developer/`
- Developer checklists
- Handoff documents
- Prompt templates

### Organization Script

Use `scripts/organize-documentation.ps1` to automatically categorize and move documentation files:

```powershell
# Dry run to see what would be moved
.\scripts\organize-documentation.ps1 -DryRun -Verbose

# Execute the organization
.\scripts\organize-documentation.ps1 -Verbose
```

**MANDATORY:** After moving files, update all references in:
- `.cursor/rules/*.md` files
- Code comments
- Other documentation files
- Build configurations

**Related Scripts:**
- `scripts/organize-documentation.ps1` - Documentation-specific organization
- `scripts/organize-all-files.ps1` - Comprehensive file organization (includes documentation)
- See `.cursor/rules/file-organization.md` for complete file organization rules

---

## PRIORITY: CRITICAL - Date & Time Handling

**⚠️ CRITICAL VIOLATION:** Hardcoding dates is a **HARD STOP** violation.

**MANDATORY PROCEDURE:**
1. **BEFORE writing ANY date:** Check current system/device date
2. **USE that exact date** - Never hardcode or assume
3. **FORMAT:** ISO 8601: `YYYY-MM-DD` (e.g., `2025-12-04`)
4. **VERIFY:** Date must match current system date exactly

**Rules:**
- ❌ **NEVER** hardcode dates like `2025-12-04` or `2025-12-04`
- ✅ **ALWAYS** check device/system date first
- ✅ **ALWAYS** use current date for "Last Updated" fields
- ✅ **ALWAYS** update "Last Updated" when modifying documentation
- ✅ Format dates as ISO 8601: `YYYY-MM-DD` or full datetime: `YYYY-MM-DD HH:MM:SS`

**Verification:**
- Before committing: Verify date matches current system date
- If date is wrong: STOP and fix before proceeding
- This is a **HARD STOP** violation - cannot proceed with wrong date

---

## PRIORITY: HIGH - Update Propagation Rules

### Document Interdependencies

When any of the following files are modified:
- `docs/reference/COMPONENT_LIBRARY_CATALOG.md`
- `docs/reference/DEVELOPMENT_BEST_PRACTICES.md`
- `docs/reference/AI_CONSISTENCY_PROTOCOL.md`
- `docs/reference/AI_ASSISTANT_BEST_PRACTICES.md`

**Automatically:**
- Update "Last Updated" timestamp in dependent docs
- Update `docs/CHANGELOG.md` with change summary
- Verify all cross-references are still valid

### Documentation Update Checklist

When updating documentation:
- [ ] Update "Last Updated" timestamp with current system date/time
- [ ] Check for broken cross-references
- [ ] Update CHANGELOG.md if significant changes
- [ ] Verify all code examples are still valid
- [ ] Check for outdated information

---

## PRIORITY: HIGH - Documentation References

**Always refer to these key documentation files:**

- `docs/reference/AI_CONSISTENCY_PROTOCOL.md` - Component reuse and pattern matching
- `docs/reference/DEVELOPMENT_BEST_PRACTICES.md` - Complete best practices guide
- `docs/reference/COMPONENT_LIBRARY_CATALOG.md` - Available reusable components
- `docs/reference/AI_ASSISTANT_BEST_PRACTICES.md` - AI development guidelines
- `docs/reference/DATABASE.md` - Database schema and RLS policies
- `docs/reference/API.md` - API endpoints and patterns
- `docs/reference/SECURITY_SETUP_GUIDE.md` - Security best practices
- `README.md` - Project overview and setup (root directory)
- `docs/README.md` - Documentation hub and index
- `docs/error-patterns.md` - Error pattern documentation
- `docs/engineering-decisions.md` - Engineering decisions log
- `docs/tech-debt.md` - Technical debt log

---

## PRIORITY: HIGH - Documentation Standards

### Required Elements
- **Last Updated** timestamp (always use system date/time)
- Clear section headers
- Code examples where applicable
- Cross-references to related documentation
- Examples and use cases

### Documentation Quality Checklist
- [ ] Contains "Last Updated" timestamp
- [ ] Code examples are current and valid
- [ ] Cross-references are correct
- [ ] Information is accurate and up-to-date
- [ ] Formatting is consistent

---

## PRIORITY: NORMAL - Documentation Best Practices

### Writing Documentation
- Use clear, concise language
- Include practical examples
- Link to related documentation
- Keep examples up-to-date with codebase
- Use consistent formatting

### Maintaining Documentation
- Review documentation regularly
- Update when code changes
- Remove outdated information
- Keep cross-references current
- Update timestamps when modifying





