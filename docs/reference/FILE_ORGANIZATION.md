# File Organization Guide

**Date:** 2025-11-16  
**Status:** Active  
**Reference:** `.cursor/rules/file-organization.md`

## Overview

This guide provides comprehensive instructions for organizing all files in the VeroField project. It ensures consistent organization, prevents scattered files, and maintains a clean, maintainable project structure.

## Quick Reference

### Root Directory
- **Allowed:** `README.md`, `package.json`, config files only
- **Prohibited:** All documentation, assets, source code, test outputs

### Documentation
- **Location:** `docs/` subdirectories
- **Organization:** See `.cursor/rules/docs.md`

### Assets
- **Images:** `branding/assets/images/` or `docs/assets/images/`
- **Videos:** `branding/assets/videos/` or `docs/assets/videos/`

### Test Outputs
- **Location:** `docs/archive/test-results/` (if keeping) or gitignored
- **Rule:** Should not be committed to repository

## Directory Structure

```
VeroField/
├── README.md                    # Only markdown file allowed in root
├── package.json                 # Package configuration
├── package-lock.json           # Dependency lock
├── .gitignore                  # Git ignore rules
├── tsconfig.json               # TypeScript config (if at root)
├── nest-cli.json               # NestJS config (if at root)
│
├── docs/                       # ALL documentation
│   ├── reference/              # Essential reference docs
│   ├── guides/                 # How-to guides
│   ├── architecture/           # Design documents
│   ├── planning/               # Development plans
│   ├── archive/                # Historical documentation
│   │   ├── progress/           # Progress tracking
│   │   ├── tickets/            # Developer tickets
│   │   ├── reports/            # Reports and analyses
│   │   ├── test-results/       # Test outputs (if keeping)
│   │   └── migrations/        # SQL migration scripts
│   ├── developer/               # Developer tools
│   ├── examples/               # Code examples
│   └── assets/                 # Documentation assets
│
├── branding/                   # Branding assets
│   ├── logos/                  # Logo files
│   ├── assets/                 # Other assets
│   │   ├── images/             # Images
│   │   ├── videos/             # Videos
│   │   └── screenshots/        # Screenshots
│   └── fonts/                  # Font files (if applicable)
│
├── scripts/                    # Automation scripts
│   ├── docs/                   # Documentation scripts
│   ├── deployment/             # Deployment scripts
│   ├── testing/                # Test scripts
│   └── database/               # Database scripts
│
├── deploy/                     # Deployment configs
│   ├── dev/                    # Development environment
│   ├── staging/                # Staging environment
│   ├── prod/                   # Production environment
│   └── shared/                  # Common configs
│
├── apps/                       # Microservices (monorepo)
├── libs/                       # Shared libraries (monorepo)
├── frontend/                   # React frontend
├── backend/                    # Backend (legacy, migrating to apps/)
└── supabase/                   # Supabase configs
```

## File Type → Directory Mapping

### Documentation Files

| File Type | Target Directory | Notes |
|-----------|----------------|-------|
| `.md` (except README.md) | `docs/` subdirectories | See `.cursor/rules/docs.md` for categorization |
| `.txt` (documentation) | `docs/archive/misc/` | Temporary or historical text files |
| `.docx`, `.doc`, `.pdf` | `docs/archive/misc/` | Should be converted to markdown when possible |

### Code Files

| File Type | Target Directory | Notes |
|-----------|----------------|-------|
| `.sql` (migrations) | `supabase/migrations/` or `docs/archive/migrations/` | Database migration scripts |
| `.sql` (setup) | `scripts/database/` | Database setup scripts |
| Source code | Per monorepo structure | See `.cursor/rules/monorepo.md` |

### Asset Files

| File Type | Target Directory | Notes |
|-----------|----------------|-------|
| `.png`, `.jpg`, `.svg` (branding) | `branding/assets/images/` | Branding images |
| `.png`, `.jpg`, `.svg` (docs) | `docs/assets/images/` | Documentation images |
| Screenshots | `branding/assets/screenshots/` | Screenshot images |
| `.mp4`, `.mov` (branding) | `branding/assets/videos/` | Branding videos |
| `.mp4`, `.mov` (docs) | `docs/assets/videos/` | Documentation videos |
| Fonts | `branding/fonts/` | Font files |

### Configuration Files

| File Type | Target Directory | Notes |
|-----------|----------------|-------|
| `.env.example` | Root or service directories | Template only, never commit `.env` |
| `.json`, `.yml` (root configs) | Root | Essential project configs only |
| `.json`, `.yml` (service configs) | Service directories | Service-specific configs |
| Deployment configs | `deploy/` subdirectories | Organized by environment |

### Test Output Files

| File Type | Target Directory | Notes |
|-----------|----------------|-------|
| Test results | `docs/archive/test-results/` (if keeping) | Should be gitignored |
| Coverage reports | `coverage/` | Auto-generated, gitignored |
| Test logs | Clean up or archive | Should not be committed |

## Organization Scripts

### Available Scripts

1. **`scripts/organize-documentation.ps1`**
   - Organizes markdown documentation files
   - Categorizes into `docs/` subdirectories
   - Usage: `.\scripts\organize-documentation.ps1 -DryRun -Verbose`

2. **`scripts/organize-all-files.ps1`**
   - Comprehensive file organization (all types)
   - Handles documentation, assets, configs, test outputs
   - Usage: `.\scripts\organize-all-files.ps1 -DryRun -Verbose`

3. **`scripts/cleanup-temporary-files.ps1`**
   - Removes or archives temporary files
   - Cleans test outputs
   - Usage: `.\scripts\cleanup-temporary-files.ps1 -DryRun -Verbose`

4. **`scripts/validate-file-organization.ps1`**
   - Validates file organization compliance
   - Can be run in CI/CD
   - Usage: `.\scripts\validate-file-organization.ps1 -Verbose`

### Script Workflow

```powershell
# 1. Preview what will be organized
.\scripts\organize-all-files.ps1 -DryRun -Verbose

# 2. Organize all files
.\scripts\organize-all-files.ps1 -Verbose

# 3. Clean up temporary files
.\scripts\cleanup-temporary-files.ps1 -Verbose

# 4. Validate organization
.\scripts\validate-file-organization.ps1 -Verbose
```

## Directory-Specific Rules

### Root Directory

**Allowed Files:**
- `README.md` (required)
- `package.json`, `package-lock.json`
- `.gitignore`, `.gitattributes`
- Essential config files: `tsconfig.json`, `nest-cli.json` (if at root)
- `.cursorrules`, `.cursor/` directory

**Prohibited:**
- Any `.md` files except `README.md`
- Any `.txt`, `.docx`, `.doc`, `.pdf` files
- Any SQL scripts
- Any images/videos
- Any test outputs
- Any temporary files

### CurrentProgress/

**Status:** Temporary directory  
**Action:** Archive contents to `docs/archive/progress/`

**File Organization:**
- SQL scripts → `docs/archive/migrations/` or `supabase/migrations/`
- Markdown reports → `docs/archive/reports/`
- Other files → `docs/archive/progress/`

### DEVELOPER_TICKETS/

**Status:** Temporary directory  
**Action:** Archive contents to `docs/archive/tickets/` or `docs/developer/tickets/`

**File Organization:**
- Phase progress reports → `docs/archive/progress/`
- Status updates → `docs/archive/reports/`
- Ticket files → `docs/archive/tickets/` or `docs/developer/tickets/`

### Context/

**Status:** Asset directory (should be reorganized)  
**Action:** Move to `branding/assets/context/` or organize by type

**File Organization:**
- Images → `branding/assets/images/` or `branding/assets/context/images/`
- Videos → `branding/assets/videos/` or `branding/assets/context/videos/`
- Screenshots → `branding/assets/screenshots/`

### Test_Results/

**Status:** Test output directory  
**Action:** Auto-cleanup or archive to `docs/archive/test-results/`

**Rules:**
- Should be gitignored
- Archive only if needed for historical reference
- Auto-generated files should be cleaned up regularly

### coverage/

**Status:** Test coverage reports  
**Rules:**
- Must be gitignored (auto-generated only)
- No manual files should be placed here
- Generated by test runners automatically

## Best Practices

### Before Adding Files

1. **Check file organization rules** - Verify where the file should go
2. **Use appropriate directory** - Don't create new directories without checking rules
3. **Follow naming conventions** - See `.cursor/rules/naming-consistency.md`
4. **Verify not duplicate** - Check if similar file already exists

### When Moving Files

1. **Update references** - Update all code/documentation references
2. **Run validation** - Use `scripts/validate-file-organization.ps1`
3. **Check imports** - Verify imports still work after move
4. **Update documentation** - Update any documentation referencing the file

### Maintaining Organization

1. **Regular cleanup** - Run cleanup scripts regularly
2. **Validate before commit** - Run validation script before committing
3. **Review root directory** - Keep root clean
4. **Archive old files** - Move outdated files to archive

## Common Scenarios

### Adding New Documentation

1. Create file in appropriate `docs/` subdirectory
2. Follow documentation standards (see `.cursor/rules/docs.md`)
3. Update "Last Updated" date
4. Add to documentation index if needed

### Adding New Assets

1. Determine if branding or documentation asset
2. Place in `branding/assets/` or `docs/assets/` accordingly
3. Organize by type (images/, videos/, etc.)
4. Use descriptive filenames

### Adding Test Outputs

1. Ensure test output directory is gitignored
2. Archive if needed for historical reference
3. Clean up regularly
4. Don't commit test outputs to repository

### Organizing Existing Files

1. Run `scripts/organize-all-files.ps1 -DryRun` to preview
2. Review proposed moves
3. Run script to execute organization
4. Update any broken references
5. Validate with `scripts/validate-file-organization.ps1`

## Validation

### Pre-Commit Checklist

- [ ] No prohibited files in root
- [ ] All documentation in `docs/` subdirectories
- [ ] All assets in `branding/assets/` or `docs/assets/`
- [ ] Test outputs gitignored
- [ ] Temporary files cleaned up
- [ ] Validation script passes

### CI/CD Integration

Add to CI/CD pipeline:

```yaml
- name: Validate File Organization
  run: |
    pwsh -File scripts/validate-file-organization.ps1 -ExitOnError
```

## Troubleshooting

### File in Wrong Location

1. Identify correct location per rules
2. Move file to correct location
3. Update all references
4. Run validation script

### Duplicate Files

1. Identify which is the canonical version
2. Remove duplicates
3. Update references to point to canonical version
4. Archive removed files if needed

### Broken References After Move

1. Search for references to old path
2. Update all references to new path
3. Verify imports/builds still work
4. Test functionality

## Related Documentation

- `.cursor/rules/file-organization.md` - Complete file organization rules
- `.cursor/rules/docs.md` - Documentation organization (subset)
- `.cursor/rules/monorepo.md` - Monorepo structure and code organization
- `.cursor/rules/naming-consistency.md` - File and directory naming standards

## Support

For questions or issues with file organization:
1. Review `.cursor/rules/file-organization.md`
2. Run validation script to identify issues
3. Check this guide for common scenarios
4. Review related rule files

---

**Last Updated:** 2025-11-16







