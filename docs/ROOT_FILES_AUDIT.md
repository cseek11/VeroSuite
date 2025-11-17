# Root Directory Files Audit

**Date:** 2025-11-16  
**Status:** Review Complete

## Summary

After organizing markdown documentation files, the following non-markdown files remain in the project root directory.

## Files Analysis

### ✅ KEEP (Required)

| File | Reason | Action |
|------|--------|--------|
| `README.md` | Required by GitHub/GitLab for project overview | **Keep in root** |

### ⚠️ ARCHIVE (Outdated/Historical)

| File | Status | Recommendation |
|------|--------|---------------|
| `Database Schema.txt` | Very short snippet (148 bytes), not referenced anywhere | **Archive to `docs/archive/misc/`** or **Delete** |
| `Tenant Middleware.txt` | Very short code snippet (86 bytes), not referenced anywhere | **Archive to `docs/archive/misc/``** or **Delete** |
| `Development Plan VeroField.txt` | Development plan content (16KB), may be historical | **Move to `docs/archive/planning/`** |
| `Development Plan VeroSuite.txt` | Contains old "VeroSuite" naming in filename | **Archive to `docs/archive/misc/`** (violates naming-consistency rules) |
| `Pest Control CRM.docx` | Word document, likely outdated planning doc | **Archive to `docs/archive/misc/`** |
| `VeroSuite_Deployment_Plan.docx` | Contains old "VeroSuite" naming | **Archive to `docs/archive/misc/`** (violates naming-consistency rules) |

## Detailed Analysis

### Database Schema.txt
- **Size:** 148 bytes
- **Content:** Single RLS policy example snippet
- **References:** None found in codebase
- **Status:** Outdated/duplicate (schema info is in `docs/reference/DATABASE.md`)
- **Recommendation:** Delete or archive

### Tenant Middleware.txt
- **Size:** 86 bytes
- **Content:** Code snippet for setting PostgreSQL session variable
- **References:** None found in codebase
- **Status:** Outdated/duplicate (middleware is in `backend/src/common/middleware/tenant.middleware.ts`)
- **Recommendation:** Delete or archive

### Development Plan VeroField.txt
- **Size:** 16,463 bytes
- **Content:** Week 1 development plan for scheduling module
- **Status:** Historical planning document
- **Recommendation:** Move to `docs/archive/planning/` if keeping for historical reference

### Development Plan VeroSuite.txt
- **Size:** 15,933 bytes
- **Content:** Similar to VeroField plan (appears to be duplicate with old naming)
- **Status:** **VIOLATES naming-consistency rules** (contains "VeroSuite" in filename)
- **Recommendation:** Archive to `docs/archive/misc/` or delete (per `.cursor/rules/naming-consistency.md`)

### Pest Control CRM.docx
- **Size:** 25,912 bytes
- **Content:** Word document (likely planning/design doc)
- **Status:** Historical document
- **Recommendation:** Archive to `docs/archive/misc/` if keeping for reference

### VeroSuite_Deployment_Plan.docx
- **Size:** 28,305 bytes
- **Content:** Word document with old naming
- **Status:** **VIOLATES naming-consistency rules** (contains "VeroSuite" in filename)
- **Recommendation:** Archive to `docs/archive/misc/` or delete (per `.cursor/rules/naming-consistency.md`)

## Recommendations

### Option 1: Clean Root (Recommended)
**Move/Archive all non-essential files:**
1. Archive small text snippets to `docs/archive/misc/` (or delete if truly outdated)
2. Archive development plans to `docs/archive/planning/`
3. Archive Word documents to `docs/archive/misc/`
4. **Delete files with "VeroSuite" naming** (per naming-consistency rules)

### Option 2: Keep Historical Reference
**Archive everything but keep for reference:**
1. Move all files to appropriate `docs/archive/` subdirectories
2. Keep for historical reference but remove from root

## Compliance Notes

Per `.cursor/rules/naming-consistency.md`:
- Files containing "VeroSuite" in the name should be renamed or removed
- Only `README.md` should remain in root per `.cursor/rules/docs.md`

## Action Items

- [ ] Decide on archival vs deletion for small snippet files
- [ ] Move development plans to `docs/archive/planning/`
- [ ] Archive or delete files with "VeroSuite" naming
- [ ] Archive Word documents to `docs/archive/misc/`
- [ ] Verify root directory only contains `README.md` after cleanup

---

**Last Updated:** 2025-11-16


