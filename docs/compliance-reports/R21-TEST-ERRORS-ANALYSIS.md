# R21 Test Errors - Detailed Analysis

**Date:** 2025-11-23  
**Rule:** R21 - File Organization  
**Test Suite:** `services/opa/tests/architecture_r21_test.rego`  
**Policy:** `services/opa/policies/architecture.rego`

---

## Test Results Summary

- **Total Tests:** 19
- **Passing:** 5 (26%)
- **Failing:** 14 (74%)

### Passing Tests ✅
1. `test_correct_path_passes` - File in correct path
2. `test_shared_code_passes` - Shared code in libs/common
3. `test_approved_top_level_directory_passes` - Approved directory
4. `test_component_in_ui_passes` - Component in ui/ folder
5. `test_correct_import_path_passes` - Correct import path

### Failing Tests ❌
1. `test_deprecated_backend_src_path` - Deprecated backend/src/ path
2. `test_deprecated_backend_prisma_path` - Deprecated backend/prisma/ path
3. `test_root_level_src_path` - Root-level src/ path
4. `test_unauthorized_top_level_directory` - Unauthorized top-level directory
5. `test_deprecated_verosuite_import_ts` - Deprecated @verosuite/ import (.ts)
6. `test_deprecated_verosuite_import_tsx` - Deprecated @verosuite/ import (.tsx)
7. `test_cross_service_import_ts` - Cross-service import (.ts)
8. `test_cross_service_import_tsx` - Cross-service import (.tsx)
9. `test_component_naming_violation` - Component naming (lowercase)
10. `test_utility_naming_violation` - Utility naming (PascalCase)
11. `test_directory_depth_violation` - Directory depth >4 levels
12. `test_component_wrong_location` - Component not in ui/
13. `test_deep_relative_import_ts` - Deep relative import (.ts)
14. `test_deep_relative_import_tsx` - Deep relative import (.tsx)

---

## Error Analysis by Category

### Category 1: Deprecated Path Detection (3 failures)

#### Error 1.1: `test_deprecated_backend_src_path`

**Test Code:**
```rego
test_deprecated_backend_src_path if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "backend/src/auth/auth.service.ts",
            "diff": "export class AuthService {}"
        }],
        "pr_body": "Add auth service"
    }
    some warning in result
    contains(warning, "deprecated path")
    contains(warning, "backend/src/")
}
```

**Policy Rule (Line 159-168):**
```rego
file_organization_warnings[msg] if {
    some file in input.changed_files
    startswith(file.path, "backend/src/")
    
    correct_path := replace(file.path, "backend/src/", "apps/api/src/")
    msg := sprintf(
        "WARNING [Architecture/R21]: File in deprecated path '%s'. Suggested: '%s'. Deprecated paths: backend/src/ → apps/api/src/, backend/prisma/ → libs/common/prisma/, src/ → frontend/src/",
        [file.path, correct_path]
    )
}
```

**Issue:** The rule checks `startswith(file.path, "backend/src/")` but the test path is `"backend/src/auth/auth.service.ts"`. The rule should match, but it's not generating warnings.

**Root Cause:** The `warn` rule collects from `file_organization_warnings`, but the warnings aren't being generated. This suggests the condition `startswith(file.path, "backend/src/")` might not be matching correctly, OR the `warn` rule isn't collecting properly.

**Fix:** Verify the `warn` rule is correctly collecting from `file_organization_warnings`. The rule at line 343 should work, but we need to ensure it's being evaluated.

---

#### Error 1.2: `test_deprecated_backend_prisma_path`

**Test Code:**
```rego
test_deprecated_backend_prisma_path if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "backend/prisma/schema.prisma",
            "diff": "model User { id String }"
        }],
        "pr_body": "Add schema"
    }
    some warning in result
    contains(warning, "deprecated path")
    contains(warning, "backend/prisma/")
}
```

**Policy Rule (Line 170-179):**
```rego
file_organization_warnings[msg] if {
    some file in input.changed_files
    startswith(file.path, "backend/prisma/")
    
    correct_path := replace(file.path, "backend/prisma/", "libs/common/prisma/")
    msg := sprintf(
        "WARNING [Architecture/R21]: File in deprecated path '%s'. Suggested: '%s'. Database schema must be in libs/common/prisma/",
        [file.path, correct_path]
    )
}
```

**Issue:** Same as Error 1.1 - the rule should match but warnings aren't being generated.

---

#### Error 1.3: `test_root_level_src_path`

**Test Code:**
```rego
test_root_level_src_path if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "src/components/Button.tsx",
            "diff": "export const Button = () => {}"
        }],
        "pr_body": "Add button"
    }
    some warning in result
    contains(warning, "root-level src/")
}
```

**Policy Rule (Line 181-193):**
```rego
file_organization_warnings[msg] if {
    some file in input.changed_files
    regex.match(`^src/`, file.path)
    not startswith(file.path, "apps/")
    not startswith(file.path, "libs/")
    not startswith(file.path, "frontend/")
    not startswith(file.path, "VeroFieldMobile/")
    
    msg := sprintf(
        "WARNING [Architecture/R21]: File in root-level src/ '%s'. Suggested: Move to frontend/src/ or appropriate app directory",
        [file.path]
    )
}
```

**Issue:** The regex `^src/` should match `"src/components/Button.tsx"`, but the test output shows the rule is failing at the `regex.match` check.

**Root Cause:** The regex pattern might need escaping or the condition logic needs adjustment. The test shows the rule is being evaluated but failing at the regex match.

---

### Category 2: Top-Level Directory Detection (1 failure)

#### Error 2.1: `test_unauthorized_top_level_directory`

**Test Code:**
```rego
test_unauthorized_top_level_directory if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "new-service/",
            "diff": ""
        }],
        "pr_body": "Add new service"
    }
    some warning in result
    contains(warning, "top-level directory")
    contains(warning, "not in approved list")
}
```

**Policy Rule (Line 196-216):**
```rego
file_organization_warnings[msg] if {
    some file in input.changed_files
    regex.match(`^[^/]+/$`, file.path)
    not startswith(file.path, "apps/")
    not startswith(file.path, "libs/")
    # ... more not startswith checks ...
    
    dir_name := regex.replace(`/$`, file.path, "")
    msg := sprintf(
        "WARNING [Architecture/R21]: New top-level directory '%s' not in approved list...",
        [dir_name]
    )
}
```

**Issue:** The regex `^[^/]+/$` should match `"new-service/"`, but the test output shows the rule is failing at the regex match check.

**Root Cause:** The regex pattern might not be matching correctly. The test output shows the rule is being evaluated but the regex match is failing.

---

### Category 3: Import Path Detection (4 failures)

#### Error 3.1: `test_deprecated_verosuite_import_ts`

**Test Code:**
```rego
test_deprecated_verosuite_import_ts if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "import { validateEmail } from '@verosuite/common/validators';"
        }],
        "pr_body": "Add users service"
    }
    some warning in result
    contains(warning, "@verosuite/")
    contains(warning, "@verofield/common/*")
}
```

**Policy Rule (Line 219-228):**
```rego
file_organization_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".ts")
    contains(file.diff, "@verosuite/")
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Deprecated import path '@verosuite/*' detected in %s...",
        [file.path]
    )
}
```

**Issue:** The rule checks `contains(file.diff, "@verosuite/")` which should match the test diff, but warnings aren't being generated.

**Root Cause:** The `contains` function should work, but the test output shows the rule is failing at the `contains` check. This suggests `file.diff` might not be accessible or the condition isn't matching.

---

#### Error 3.2: `test_deprecated_verosuite_import_tsx`

**Test Code:**
```rego
test_deprecated_verosuite_import_tsx if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "frontend/src/components/Button.tsx",
            "diff": "import { Button } from '@verosuite/common/components';"
        }],
        "pr_body": "Add button"
    }
    some warning in result
    contains(warning, "@verosuite/")
    contains(warning, "@verofield/common/*")
}
```

**Policy Rule (Line 230-239):**
```rego
file_organization_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    contains(file.diff, "@verosuite/")
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Deprecated import path '@verosuite/*' detected in %s...",
        [file.path]
    )
}
```

**Issue:** Same as Error 3.1 - the `contains` check should match but isn't.

---

#### Error 3.3: `test_cross_service_import_ts`

**Test Code:**
```rego
test_cross_service_import_ts if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "import { CrmService } from '../../../crm-ai/src/crm.service';"
        }],
        "pr_body": "Add users service"
    }
    some warning in result
    contains(warning, "Cross-service relative import")
    contains(warning, "libs/common/")
}
```

**Policy Rule (Line 242-251):**
```rego
file_organization_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".ts")
    regex.match(`import.*from\s+['"]\.\./\.\./\.\./[^'"]+/src/`, file.diff)
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Cross-service relative import detected in %s...",
        [file.path]
    )
}
```

**Issue:** The regex pattern `import.*from\s+['"]\.\./\.\./\.\./[^'"]+/src/` should match `"import { CrmService } from '../../../crm-ai/src/crm.service';"`, but the test output shows the regex match is failing.

**Root Cause:** The regex pattern needs to account for:
1. Optional whitespace after `import`
2. The actual import statement structure
3. Escaped quotes in the regex

**Current Pattern:** `import.*from\s+['"]\.\./\.\./\.\./[^'"]+/src/`
**Test String:** `"import { CrmService } from '../../../crm-ai/src/crm.service';"`

**Problem:** The pattern expects `import.*from\s+['"]` but the actual string has `import { CrmService } from '` which should match, but the regex might not be handling the curly braces correctly.

---

#### Error 3.4: `test_cross_service_import_tsx`

**Test Code:**
```rego
test_cross_service_import_tsx if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "frontend/src/components/UserList.tsx",
            "diff": "import { CrmService } from '../../../crm-ai/src/crm.service';"
        }],
        "pr_body": "Add user list"
    }
    some warning in result
    contains(warning, "Cross-service relative import")
    contains(warning, "libs/common/")
}
```

**Issue:** Same as Error 3.3 - regex pattern not matching.

---

### Category 4: File Naming Violations (2 failures)

#### Error 4.1: `test_component_naming_violation`

**Test Code:**
```rego
test_component_naming_violation if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "frontend/src/components/button.tsx",
            "diff": "export const Button = () => {}"
        }],
        "pr_body": "Add button"
    }
    some warning in result
    contains(warning, "PascalCase")
    contains(warning, "button.tsx")
}
```

**Policy Rule (Line 265-275):**
```rego
file_organization_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    regex.match(`/[a-z][^/]*\.tsx$`, file.path)
    contains(file.diff, "export const")
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Component file '%s' should use PascalCase naming...",
        [file.path]
    )
}
```

**Issue:** The regex `/[a-z][^/]*\.tsx$` should match `"frontend/src/components/button.tsx"`, but the test output shows the regex match is failing.

**Root Cause:** The regex pattern `/[a-z][^/]*\.tsx$` expects a forward slash before the lowercase letter, but the path is `"frontend/src/components/button.tsx"`. The pattern should match `components/button.tsx`, but it might not be matching correctly.

**Problem:** The regex needs to match the filename part only, not the full path. The pattern `/[a-z][^/]*\.tsx$` should work, but it might need adjustment.

---

#### Error 4.2: `test_utility_naming_violation`

**Test Code:**
```rego
test_utility_naming_violation if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "libs/common/src/utils/FormatDate.ts",
            "diff": "export function formatDate(date: Date): string { return ''; }"
        }],
        "pr_body": "Add date formatter"
    }
    some warning in result
    contains(warning, "camelCase")
    contains(warning, "FormatDate.ts")
}
```

**Policy Rule (Line 278-290):**
```rego
file_organization_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".ts")
    not endswith(file.path, ".d.ts")
    not endswith(file.path, ".config.ts")
    regex.match(`/[A-Z][^/]*\.ts$`, file.path)
    contains(file.diff, "export function")
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Utility file '%s' should use camelCase naming...",
        [file.path]
    )
}
```

**Issue:** The regex `/[A-Z][^/]*\.ts$` should match `"libs/common/src/utils/FormatDate.ts"`, but the test output shows the regex match is failing.

**Root Cause:** Same as Error 4.1 - the regex pattern needs to match the filename correctly.

---

### Category 5: Directory Structure Violations (2 failures)

#### Error 5.1: `test_directory_depth_violation`

**Test Code:**
```rego
test_directory_depth_violation if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "apps/api/src/deep/nested/structure/file.ts",
            "diff": "export const deep = {};"
        }],
        "pr_body": "Add deep file"
    }
    some warning in result
    contains(warning, "Directory depth")
    contains(warning, "exceeds recommended limit")
}
```

**Policy Rule (Line 293-303):**
```rego
file_organization_warnings[msg] if {
    some file in input.changed_files
    path_parts := split(file.path, "/")
    count(path_parts) > 5
    
    depth := count(path_parts) - 1
    msg := sprintf(
        "WARNING [Architecture/R21]: Directory depth (%d levels) exceeds recommended limit (4 levels)...",
        [depth, file.path]
    )
}
```

**Issue:** The path `"apps/api/src/deep/nested/structure/file.ts"` has 6 parts: `["apps", "api", "src", "deep", "nested", "structure", "file.ts"]`, so `count(path_parts)` should be 7, which is > 5, so the condition should match.

**Root Cause:** The test output shows the rule is failing at `count(path_parts) > 5`. This suggests the `split` function might not be working as expected, OR the count is not being calculated correctly.

**Problem:** The condition `count(path_parts) > 5` should match, but it's not. This might be a logic issue with how the count is being evaluated.

---

#### Error 5.2: `test_component_wrong_location`

**Test Code:**
```rego
test_component_wrong_location if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "frontend/src/components/Button.tsx",
            "diff": "export const Button = () => {}"
        }],
        "pr_body": "Add button"
    }
    some warning in result
    contains(warning, "frontend/src/components/ui/")
    contains(warning, "reusable component")
}
```

**Policy Rule (Line 306-317):**
```rego
file_organization_warnings[msg] if {
    some file in input.changed_files
    startswith(file.path, "frontend/src/components/")
    not contains(file.path, "/ui/")
    endswith(file.path, ".tsx")
    contains(file.diff, "export const")
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Reusable component '%s' should be in frontend/src/components/ui/...",
        [file.path]
    )
}
```

**Issue:** The path `"frontend/src/components/Button.tsx"` should match:
- `startswith(file.path, "frontend/src/components/")` ✅
- `not contains(file.path, "/ui/")` ✅ (path doesn't contain "/ui/")
- `endswith(file.path, ".tsx")` ✅
- `contains(file.diff, "export const")` ✅

**Root Cause:** All conditions should match, but the test output shows the rule is failing. This suggests the `contains(file.diff, "export const")` check might not be working, OR there's an issue with how the conditions are being evaluated together.

---

### Category 6: Deep Relative Import Detection (2 failures)

#### Error 6.1: `test_deep_relative_import_ts`

**Test Code:**
```rego
test_deep_relative_import_ts if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "import { helper } from '../../../../libs/common/src/utils/helper';"
        }],
        "pr_body": "Add users service"
    }
    some warning in result
    contains(warning, "Deep relative import")
    contains(warning, "monorepo import paths")
}
```

**Policy Rule (Line 320-329):**
```rego
file_organization_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".ts")
    regex.match(`import.*from\s+['"]\.\./\.\./\.\./`, file.diff)
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Deep relative import (>3 levels) detected in %s...",
        [file.path]
    )
}
```

**Issue:** The regex `import.*from\s+['"]\.\./\.\./\.\./` should match `"import { helper } from '../../../../libs/common/src/utils/helper';"`, but the test output shows the regex match is failing.

**Root Cause:** The regex pattern expects exactly 3 levels (`\.\./\.\./\.\./`), but the test string has 4 levels (`../../../../`). The pattern needs to match 3+ levels, not exactly 3.

**Problem:** The pattern should be `import.*from\s+['"]\.\./\.\./\.\./` to match 3+ levels, but it's currently matching exactly 3. The test has 4 levels, so it should still match (since 4 > 3), but the regex might need adjustment.

---

#### Error 6.2: `test_deep_relative_import_tsx`

**Test Code:**
```rego
test_deep_relative_import_tsx if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "frontend/src/components/UserList.tsx",
            "diff": "import { Button } from '../../../../components/ui/Button';"
        }],
        "pr_body": "Add user list"
    }
    some warning in result
    contains(warning, "Deep relative import")
    contains(warning, "monorepo import paths")
}
```

**Issue:** Same as Error 6.1 - regex pattern needs to match 3+ levels, not exactly 3.

---

## Summary of Root Causes

1. **Regex Pattern Issues:**
   - Import detection patterns need to handle TypeScript import syntax correctly
   - File naming patterns need to match filenames correctly (not full paths)
   - Deep relative import pattern needs to match 3+ levels, not exactly 3

2. **Condition Logic Issues:**
   - Directory depth calculation might not be working correctly
   - Component location checks might have logic errors
   - File path checks might not be matching correctly

3. **Data Access Issues:**
   - `file.diff` might not be accessible in all cases
   - `contains` function might not be working as expected
   - Path splitting might not be working correctly

4. **Rule Collection Issues:**
   - The `warn` rule might not be collecting warnings correctly
   - Warnings might be generated but not collected into the final `warn` set

---

## Recommended Fixes

### Fix 1: Update Import Detection Regex Patterns

**Current Pattern (Line 245):**
```rego
regex.match(`import.*from\s+['"]\.\./\.\./\.\./[^'"]+/src/`, file.diff)
```

**Fixed Pattern:**
```rego
regex.match(`import\s+.*from\s+['"]\.\./\.\./\.\./[^'"]+/src/`, file.diff)
```

**Reason:** The pattern needs to handle optional whitespace and import statement structure more flexibly.

---

### Fix 2: Update Deep Relative Import Pattern

**Current Pattern (Line 323):**
```rego
regex.match(`import.*from\s+['"]\.\./\.\./\.\./`, file.diff)
```

**Fixed Pattern:**
```rego
regex.match(`import\s+.*from\s+['"]\.\./\.\./\.\./`, file.diff)
```

**Reason:** Same as Fix 1 - needs to handle import statement structure more flexibly.

---

### Fix 3: Fix File Naming Regex Patterns

**Current Pattern (Line 268):**
```rego
regex.match(`/[a-z][^/]*\.tsx$`, file.path)
```

**Fixed Pattern:**
```rego
regex.match(`/[a-z][a-zA-Z0-9_-]*\.tsx$`, file.path)
```

**Reason:** The pattern needs to match the filename part correctly, accounting for the full path structure.

---

### Fix 4: Fix Directory Depth Calculation

**Current Logic (Line 295-296):**
```rego
path_parts := split(file.path, "/")
count(path_parts) > 5
```

**Fixed Logic:**
```rego
path_parts := split(file.path, "/")
count(path_parts) > 5
# Verify: path_parts includes filename, so depth = count - 1
```

**Reason:** The logic should work, but we need to verify the `split` function is working correctly. The condition `count(path_parts) > 5` should match paths with 6+ parts.

---

### Fix 5: Verify `contains` Function Usage

**Current Usage (Line 222, 233, 269, 284, 311):**
```rego
contains(file.diff, "@verosuite/")
contains(file.diff, "export const")
contains(file.diff, "export function")
```

**Verification:** Ensure `file.diff` is accessible and the `contains` function is working correctly. The test output suggests these checks are failing, which might indicate a data access issue.

---

## Next Steps

1. **Fix regex patterns** for import detection and file naming
2. **Verify data access** for `file.diff` and path operations
3. **Test each rule individually** to isolate issues
4. **Update test expectations** if needed based on actual behavior
5. **Re-run tests** after fixes to verify all tests pass

---

**Last Updated:** 2025-11-23  
**Status:** Analysis Complete - Awaiting Fixes





