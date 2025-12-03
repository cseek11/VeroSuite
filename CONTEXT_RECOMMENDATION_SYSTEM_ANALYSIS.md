# Context Recommendation System - Detailed Analysis

**Date:** 2025-12-03  
**Purpose:** Detailed explanation of how the enforcer recommends context to the agent brain (Brain B), including logic, reasoning, and code examples with potential concerns.

---

## Overview

The Two-Brain Model uses a **Unified Context Manager** inside the enforcer (Brain A) that computes optimal context bundles for the LLM (Brain B). The LLM receives curated context hints in `ENFORCER_REPORT.json` without needing to load heavy rule files.

**Key Principle:** Brain A (enforcer) makes all context decisions. Brain B (LLM) receives minimal, focused guidance.

---

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  Enforcer Detects Violations                                    │
│  (VeroFieldEnforcer.run_all_checks())                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Generate Two-Brain Report                                      │
│  (generate_two_brain_report())                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Add Context Hints to Report                                    │
│  (_add_context_hints_to_report(report))                         │
│  • Delegates to _compute_unified_context_bundle()               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Compute Unified Context Bundle                                 │
│  (_compute_unified_context_bundle())                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 1: Detect Task Type                                 │  │
│  │ (_detect_task_type_unified())                            │  │
│  │   ├─ Try: _detect_task_type_from_violations()            │  │
│  │   │   └─ Keyword matching on rule_ref/message            │  │
│  │   └─ Fallback: Analyze changed files (first 20 only)     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                       │                                          │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 2: Load Internal Recommendations                    │  │
│  │ (_load_internal_recommendations())                        │  │
│  │   └─ Load .cursor/enforcement/internal/                  │  │
│  │      context_recommendations.json (if exists)             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                       │                                          │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 3: Extract Context Hints                            │  │
│  │ (_extract_context_hints_unified())                        │  │
│  │   ├─ Get base hints from task type                       │  │
│  │   │   (_extract_context_hints())                          │  │
│  │   │   └─ Hardcoded hints_map library                     │  │
│  │   └─ Enhance with recommendations (currently no-op)      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                       │                                          │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 4: Find Relevant Example Files                      │  │
│  │ (_find_relevant_example_files())                          │  │
│  │   ├─ Get base examples from task type                    │  │
│  │   │   (_get_relevant_example_files())                     │  │
│  │   │   └─ Use git grep to search codebase                 │  │
│  │   └─ Enhance with recommendations (filter code files)   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                       │                                          │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 5: Get Patterns to Follow                           │  │
│  │ (_get_patterns_to_follow_unified())                       │  │
│  │   ├─ Get base patterns from task type                    │  │
│  │   │   (_get_patterns_to_follow())                         │  │
│  │   │   └─ Hardcoded patterns_map library                  │  │
│  │   └─ Enhance with recommendations (currently no-op)     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                       │                                          │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Return Context Bundle                                     │  │
│  │ {                                                         │  │
│  │   "task_type": str,                                      │  │
│  │   "hints": List[str],                                     │  │
│  │   "relevant_files": List[str],                           │  │
│  │   "patterns_to_follow": List[str]                        │  │
│  │ }                                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Set Context Bundle in Report                                   │
│  (report.set_context_bundle(...))                               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Save ENFORCER_REPORT.json                                      │
│  (.cursor/enforcement/ENFORCER_REPORT.json)                     │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  LLM (Brain B) Receives Report                                 │
│  • Reads ENFORCER_REPORT.json                                   │
│  • Uses context_bundle for guidance                             │
│  • Does NOT need to load heavy rule files                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## System Flow

```
1. Enforcer detects violations
   ↓
2. Enforcer generates ENFORCER_REPORT.json
   ↓
3. _add_context_hints_to_report() called
   ↓
4. _compute_unified_context_bundle() computes context
   ↓
5. Context bundle added to report
   ↓
6. LLM receives report with context_bundle field
```

---

## Step-by-Step Logic Breakdown

### Step 1: Entry Point - `_add_context_hints_to_report()`

**Location:** `.cursor/scripts/auto-enforcer.py:4984-5003`

```python
def _add_context_hints_to_report(self, report):
    """
    Add context hints to ENFORCER_REPORT based on violations and task type.
    
    Two-Brain Model: Provides minimal guidance to LLM without loading heavy rules.
    Uses unified context manager to compute optimal context bundle.
    """
    # Use unified context manager to compute context bundle
    context_bundle = self._compute_unified_context_bundle()
    
    # Set context bundle in report
    report.set_context_bundle(
        task_type=context_bundle.get('task_type'),
        hints=context_bundle.get('hints', []),
        relevant_files=context_bundle.get('relevant_files', []),
        patterns_to_follow=context_bundle.get('patterns_to_follow', [])
    )
```

**Logic:**
- Called during `generate_two_brain_report()` (line 4987)
- Delegates to `_compute_unified_context_bundle()` for all computation
- Uses `.get()` with defaults to handle missing keys gracefully

**Potential Concerns:**
- ✅ **Safe:** Uses `.get()` with defaults, so missing keys won't crash
- ⚠️ **Silent Failures:** If `_compute_unified_context_bundle()` returns `None` or empty dict, no error is raised
- ⚠️ **No Validation:** Doesn't verify that context_bundle contains expected keys

---

### Step 2: Unified Context Computation - `_compute_unified_context_bundle()`

**Location:** `.cursor/scripts/auto-enforcer.py:5005-5042`

```python
def _compute_unified_context_bundle(self) -> Dict[str, Any]:
    """
    Unified Context Manager: Compute optimal context bundle for LLM.
    
    Two-Brain Model: Brain A (enforcer) computes all context decisions.
    Brain B (LLM) receives curated context bundle in ENFORCER_REPORT.
    
    This method:
    1. Detects task type from violations and file changes
    2. Computes optimal context (using internal recommendations)
    3. Extracts minimal hints (not full rule files)
    4. Finds relevant example files
    5. Identifies patterns to follow
    
    Returns:
        Dict with task_type, hints, relevant_files, patterns_to_follow
    """
    # Step 1: Detect task type
    task_type = self._detect_task_type_unified()
    
    # Step 2: Load internal recommendations (if available)
    internal_recommendations = self._load_internal_recommendations()
    
    # Step 3: Extract hints based on task type and recommendations
    hints = self._extract_context_hints_unified(task_type, internal_recommendations)
    
    # Step 4: Find relevant example files
    relevant_files = self._find_relevant_example_files(task_type, internal_recommendations)
    
    # Step 5: Get patterns to follow
    patterns = self._get_patterns_to_follow_unified(task_type, internal_recommendations)
    
    return {
        "task_type": task_type,
        "hints": hints,
        "relevant_files": relevant_files,
        "patterns_to_follow": patterns
    }
```

**Logic:**
- **5-step pipeline** that builds context bundle incrementally
- Each step can return `None` or empty lists, which is handled gracefully
- Always returns a dict with all 4 keys (even if values are `None`/empty)

**Potential Concerns:**
- ✅ **Well-structured:** Clear separation of concerns
- ⚠️ **No Error Handling:** If any step throws exception, entire bundle fails
- ⚠️ **No Logging:** Silent failures if steps return empty results
- ⚠️ **Order Dependency:** Steps 3-5 depend on step 1 (task_type), but no validation

---

### Step 3: Task Type Detection - `_detect_task_type_unified()`

**Location:** `.cursor/scripts/auto-enforcer.py:5044-5081`

```python
def _detect_task_type_unified(self) -> Optional[str]:
    """
    Unified task type detection from violations and file changes.
    
    Returns:
        Task type string or None
    """
    # First, try to detect from violations
    task_type_from_violations = self._detect_task_type_from_violations()
    if task_type_from_violations:
        return task_type_from_violations
    
    # Fallback: Detect from file changes
    changed_files = self.get_changed_files(include_untracked=False)
    if not changed_files:
        return None
    
    # Infer task type from file patterns
    file_types = set()
    for file_path in changed_files[:20]:  # Sample first 20
        if file_path.endswith('.ts') or file_path.endswith('.tsx'):
            file_types.add('typescript')
        elif file_path.endswith('.py'):
            file_types.add('python')
        elif 'schema.prisma' in file_path:
            return "database_change"
        elif 'auth' in file_path.lower():
            return "auth_change"
        elif 'test' in file_path.lower():
            return "test_change"
    
    # Default based on file types
    if 'typescript' in file_types:
        return "edit_code"
    elif 'python' in file_types:
        return "edit_code"
    
    return "edit_code"
```

**Logic:**
- **Priority 1:** Detect from violations (most accurate)
- **Priority 2:** Detect from file changes (fallback)
- **Priority 3:** Default to "edit_code" (safe fallback)

**Potential Concerns:**
- ⚠️ **Sampling Bias:** Only checks first 20 files (`changed_files[:20]`). If task type is in file 21+, it's missed
- ⚠️ **String Matching:** Uses `'auth' in file_path.lower()` - could match false positives (e.g., `authorization.ts` vs `auth.ts`)
- ⚠️ **Case Sensitivity:** Uses `.lower()` for some checks but not others (e.g., `'schema.prisma'` is case-sensitive)
- ⚠️ **Default Fallback:** Always returns "edit_code" if no match - might mask actual task type
- ⚠️ **No Validation:** Doesn't verify that `self.violations` exists before calling `_detect_task_type_from_violations()`

**Example Problem Scenario:**
```python
# If changed_files = ['apps/api/src/authorization/authorization.service.ts', ...]
# This would incorrectly return "auth_change" even though it's not an auth task
```

---

### Step 3a: Violation-Based Detection - `_detect_task_type_from_violations()`

**Location:** `.cursor/scripts/auto-enforcer.py:5196-5220`

```python
def _detect_task_type_from_violations(self) -> Optional[str]:
    """
    Detect task type from violations.
    
    Returns:
        Task type string (e.g., "add_rls", "add_logging", "fix_date") or None
    """
    if not self.violations:
        return None
    
    # Analyze violations to determine task type
    for v in self.violations:
        rule_ref = getattr(v, 'rule_ref', '') or getattr(v, 'message', '')
        rule_ref_lower = rule_ref.lower()
        
        if 'rls' in rule_ref_lower or 'tenant' in rule_ref_lower or 'security' in rule_ref_lower:
            return "add_rls"
        elif 'date' in rule_ref_lower or '02-core' in rule_ref:
            return "fix_date"
        elif 'logging' in rule_ref_lower or 'observability' in rule_ref_lower:
            return "add_logging"
        elif 'error' in rule_ref_lower or 'resilience' in rule_ref_lower:
            return "add_error_handling"
    
    return "fix_violations"
```

**Logic:**
- Iterates through violations
- Uses keyword matching on `rule_ref` or `message`
- Returns first match (early exit)
- Defaults to "fix_violations" if no match

**Potential Concerns:**
- ⚠️ **First Match Wins:** Returns on first match, ignoring other violations. If multiple task types exist, only first is detected
- ⚠️ **Keyword Collision:** `'error'` could match "error handling" or "error logging" - ambiguous
- ⚠️ **Attribute Access:** Uses `getattr()` with fallback, but if violation object structure changes, could fail silently
- ⚠️ **Case Sensitivity:** Uses `.lower()` for some checks but `'02-core'` is case-sensitive
- ⚠️ **No Priority:** All keywords have equal weight - "rls" and "tenant" both trigger "add_rls"

**Example Problem Scenario:**
```python
# If violations = [
#   Violation(rule_ref="03-security.mdc#R02", ...),  # RLS violation
#   Violation(rule_ref="07-observability.mdc#R08", ...)  # Logging violation
# ]
# This would return "add_rls" and ignore the logging violation
```

---

### Step 4: Load Internal Recommendations - `_load_internal_recommendations()`

**Location:** `.cursor/scripts/auto-enforcer.py:5083-5105`

```python
def _load_internal_recommendations(self) -> Optional[Dict]:
    """
    Load internal recommendations from enforcer-only location.
    
    Returns:
        Recommendations dict or None
    """
    recommendations_file = self.project_root / ".cursor" / "enforcement" / "internal" / "context_recommendations.json"
    
    if not recommendations_file.exists():
        return None
    
    try:
        with open(recommendations_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.debug(
            f"Could not load internal recommendations: {e}",
            operation="_load_internal_recommendations",
            error_code="LOAD_RECOMMENDATIONS_FAILED",
            root_cause=str(e)
        )
        return None
```

**Logic:**
- Checks if recommendations file exists
- Loads JSON if available
- Returns `None` if file doesn't exist or load fails
- Logs errors at debug level (silent in production)

**Potential Concerns:**
- ✅ **Safe:** Returns `None` on failure, doesn't crash
- ⚠️ **Silent Failure:** Errors logged at debug level - might not be visible
- ⚠️ **No Schema Validation:** Doesn't verify JSON structure matches expected format
- ⚠️ **File Path:** Hardcoded path - if structure changes, breaks silently
- ⚠️ **No Caching:** Loads file every time - could be slow if called frequently

**Example Problem Scenario:**
```python
# If context_recommendations.json exists but has invalid JSON:
# {
#   "task": { "type": "add_rls"  # Missing closing brace
# }
# This would return None silently, and no error would be visible
```

---

### Step 5: Extract Context Hints - `_extract_context_hints_unified()`

**Location:** `.cursor/scripts/auto-enforcer.py:5107-5132`

```python
def _extract_context_hints_unified(self, task_type: Optional[str], 
                                 recommendations: Optional[Dict]) -> List[str]:
    """
    Extract context hints using unified approach.
    
    Args:
        task_type: Detected task type
        recommendations: Internal recommendations (if available)
        
    Returns:
        List of guidance hints
    """
    # Start with base hints from task type
    hints = self._extract_context_hints(task_type)
    
    # Enhance with recommendations if available
    if recommendations and task_type:
        task_info = recommendations.get('task', {})
        context_info = recommendations.get('context', {})
        
        # Add task-specific hints from recommendations
        if task_info.get('type') == task_type:
            # Use recommendations context if it matches
            pass  # Base hints are already good
    
    return hints
```

**Logic:**
- Gets base hints from task type
- Optionally enhances with recommendations
- **Current implementation:** Enhancement is a no-op (`pass`)

**Potential Concerns:**
- ⚠️ **No Enhancement:** The enhancement logic is empty (`pass`) - recommendations are loaded but not used
- ⚠️ **Dead Code:** Checks `task_info.get('type') == task_type` but then does nothing
- ⚠️ **No Fallback:** If `task_type` is `None`, returns empty list from `_extract_context_hints(None)`

**Example Problem Scenario:**
```python
# If recommendations = {
#   "task": { "type": "add_rls" },
#   "context": { "hints": ["Custom hint 1", "Custom hint 2"] }
# }
# These custom hints are never used - only base hints are returned
```

---

### Step 5a: Base Hints Extraction - `_extract_context_hints()`

**Location:** `.cursor/scripts/auto-enforcer.py:5222-5300`

```python
def _extract_context_hints(self, task_type: Optional[str]) -> List[str]:
    """
    Extract minimal context hints for task type.
    
    Uses comprehensive context hints library.
    
    Args:
        task_type: Type of task detected
        
    Returns:
        List of guidance hints
    """
    if not task_type:
        return []
    
    # Comprehensive Context Hints Library
    hints_map = {
        "add_rls": [
            "RLS pattern: Filter all queries by tenant_id",
            "Use TenantGuard decorator on controller methods",
            "Example: where: { tenant_id: ctx.user.tenant_id, ... }",
            "Verify tenant_id from authenticated JWT (never from request body)",
            "Test: Add multi-tenant test coverage with different tenant_ids"
        ],
        "add_logging": [
            "Use structured logging: this.logger.warn({ event, user_id, tenant_id, ip, timestamp, ... })",
            "Log security events: AUTH_FAILED, ACCESS_DENIED, RLS_VIOLATION, etc.",
            "Include context: user_id, tenant_id, ip, timestamp, traceId",
            "Never use console.log in production code"
        ],
        # ... more task types ...
    }
    
    return hints_map.get(task_type, [
        "Review violation descriptions and fix_hints",
        "Follow existing patterns in the codebase",
        "Ensure security and error handling compliance"
    ])
```

**Logic:**
- Uses hardcoded hints library
- Returns task-specific hints if available
- Falls back to generic hints if task type not found

**Potential Concerns:**
- ✅ **Comprehensive:** Covers all major task types
- ⚠️ **Static:** Hints are hardcoded - can't be updated without code changes
- ⚠️ **No Customization:** Can't override hints per-project or per-violation
- ⚠️ **Generic Fallback:** Default hints are very generic - might not be helpful

**Example Problem Scenario:**
```python
# If task_type = "custom_task_type" (not in hints_map)
# Returns generic hints that might not be relevant:
# ["Review violation descriptions and fix_hints", ...]
# These hints might not help with the actual task
```

---

### Step 6: Find Relevant Example Files - `_find_relevant_example_files()`

**Location:** `.cursor/scripts/auto-enforcer.py:5134-5172`

```python
def _find_relevant_example_files(self, task_type: Optional[str], 
                                recommendations: Optional[Dict]) -> List[str]:
    """
    Find relevant example files using unified approach.
    
    Args:
        task_type: Detected task type
        recommendations: Internal recommendations (if available)
        
    Returns:
        List of example file paths
    """
    # Start with base example files
    example_files = self._get_relevant_example_files(task_type)
    
    # Enhance with recommendations if available
    if recommendations:
        context_info = recommendations.get('context', {})
        active_files = context_info.get('active', [])
        
        # Filter to actual code files (not rule files)
        code_examples = [
            f for f in active_files 
            if not f.startswith('.cursor/') and 
               (f.endswith('.ts') or f.endswith('.tsx') or f.endswith('.py'))
        ]
        
        # Add top examples from recommendations
        example_files.extend(code_examples[:3])
    
    # Remove duplicates and limit
    seen = set()
    unique_files = []
    for f in example_files:
        if f and f not in seen:
            seen.add(f)
            unique_files.append(f)
    
    return unique_files[:5]  # Limit to 5 examples
```

**Logic:**
- Gets base examples from task type
- Enhances with files from recommendations (if available)
- Filters to code files only (excludes rule files)
- Removes duplicates and limits to 5 files

**Potential Concerns:**
- ✅ **Good Filtering:** Excludes `.cursor/` files and non-code files
- ⚠️ **File Extension Only:** Only checks `.ts`, `.tsx`, `.py` - misses other code files (`.js`, `.jsx`, `.java`, etc.)
- ⚠️ **No Validation:** Doesn't verify files actually exist before returning
- ⚠️ **Arbitrary Limit:** Hardcoded limit of 5 files - might exclude important examples
- ⚠️ **No Priority:** All files treated equally - no ranking by relevance

**Example Problem Scenario:**
```python
# If recommendations = {
#   "context": {
#     "active": [
#       "apps/api/src/customers/customers.service.ts",  # Good example
#       "apps/api/src/orders/orders.service.js",  # Missed (not .ts/.tsx/.py)
#       "apps/api/src/auth/auth.service.tsx"  # Good example
#     ]
#   }
# }
# The .js file is excluded even though it might be relevant
```

---

### Step 6a: Base Example Files - `_get_relevant_example_files()`

**Location:** `.cursor/scripts/auto-enforcer.py:5302-5384`

```python
def _get_relevant_example_files(self, task_type: Optional[str]) -> List[str]:
    """
    Get relevant example files for task type.
    
    Searches codebase for example implementations.
    
    Args:
        task_type: Type of task detected
        
    Returns:
        List of example file paths
    """
    if not task_type:
        return []
    
    example_files = []
    
    try:
        import subprocess
        
        # Search patterns based on task type
        search_patterns = {
            "add_rls": [
                ('tenant_id.*where', '*.ts'),
                ('TenantGuard', '*.ts'),
                ('@UseGuards.*Tenant', '*.ts')
            ],
            "add_logging": [
                ('logger\\.(warn|error|info)', '*.ts'),
                ('structured.*log', '*.ts')
            ],
            # ... more patterns ...
        }
        
        patterns = search_patterns.get(task_type, [])
        
        for pattern, file_glob in patterns[:2]:  # Limit to 2 patterns per task type
            try:
                result = subprocess.run(
                    ['git', 'grep', '-l', pattern, '--', file_glob],
                    capture_output=True,
                    text=True,
                    timeout=5,
                    cwd=str(self.project_root)
                )
                if result.returncode == 0:
                    files = result.stdout.strip().split('\n')
                    # Filter to actual source files (not test files for examples)
                    source_files = [f for f in files if f and 'test' not in f.lower()][:2]
                    example_files.extend(source_files)
            except Exception:
                pass
    
    except Exception:
        pass
    
    # Remove duplicates and limit
    seen = set()
    unique_files = []
    for f in example_files:
        if f and f not in seen:
            seen.add(f)
            unique_files.append(f)
    
    return unique_files[:5]  # Limit to 5 examples
```

**Logic:**
- Uses `git grep` to search codebase for patterns
- Filters out test files
- Limits to 2 patterns per task type, 2 files per pattern
- Removes duplicates and limits to 5 total files

**Potential Concerns:**
- ⚠️ **Git Dependency:** Requires `git` to be installed and repo to be a git repo
- ⚠️ **Regex Patterns:** Uses regex patterns that might match false positives
- ⚠️ **Silent Failures:** All exceptions are caught and ignored (`except Exception: pass`)
- ⚠️ **Timeout:** 5-second timeout might be too short for large repos
- ⚠️ **Test File Exclusion:** Excludes all files with "test" in path - might exclude good examples in test directories
- ⚠️ **No Validation:** Doesn't verify files exist or are readable

**Example Problem Scenario:**
```python
# If git is not installed or repo is not a git repo:
# subprocess.run() will fail, but exception is caught silently
# Returns empty list with no indication of failure
```

---

### Step 7: Get Patterns to Follow - `_get_patterns_to_follow_unified()`

**Location:** `.cursor/scripts/auto-enforcer.py:5174-5194`

```python
def _get_patterns_to_follow_unified(self, task_type: Optional[str],
                                   recommendations: Optional[Dict]) -> List[str]:
    """
    Get patterns to follow using unified approach.
    
    Args:
        task_type: Detected task type
        recommendations: Internal recommendations (if available)
        
    Returns:
        List of pattern descriptions
    """
    # Start with base patterns
    patterns = self._get_patterns_to_follow(task_type)
    
    # Enhance with recommendations if available
    if recommendations:
        # Could extract patterns from recommendations context
        pass  # Base patterns are already good
    
    return patterns
```

**Logic:**
- Gets base patterns from task type
- Enhancement is a no-op (same as hints)

**Potential Concerns:**
- ⚠️ **No Enhancement:** Recommendations are not used (same issue as hints)
- ⚠️ **Dead Code:** Checks recommendations but does nothing

---

### Step 7a: Base Patterns - `_get_patterns_to_follow()`

**Location:** `.cursor/scripts/auto-enforcer.py:5386-5456`

```python
def _get_patterns_to_follow(self, task_type: Optional[str]) -> List[str]:
    """
    Get patterns to follow for task type.
    
    Comprehensive patterns library.
    
    Args:
        task_type: Type of task detected
        
    Returns:
        List of pattern descriptions
    """
    if not task_type:
        return []
    
    patterns_map = {
        "add_rls": [
            "Use TenantGuard decorator on controller methods",
            "Inject tenant_id from authenticated context (JWT)",
            "Filter all queries by tenant_id: where: { tenant_id: ctx.user.tenant_id, ... }",
            "Use Prisma RLS middleware or manual guards",
            "Never trust client-provided tenant_id"
        ],
        # ... more task types ...
    }
    
    return patterns_map.get(task_type, [
        "Follow existing patterns in the codebase",
        "Ensure security and error handling compliance"
    ])
```

**Logic:**
- Uses hardcoded patterns library (similar to hints)
- Returns task-specific patterns or generic fallback

**Potential Concerns:**
- ✅ **Comprehensive:** Covers all major task types
- ⚠️ **Static:** Patterns are hardcoded - same limitations as hints
- ⚠️ **Generic Fallback:** Default patterns are very generic

---

## Summary of Logic Concerns

### Critical Issues

1. **Silent Failures:** Many methods catch exceptions and return `None`/empty lists without logging
2. **No Validation:** Doesn't verify file existence, JSON schema, or data structure
3. **Dead Code:** Enhancement logic for recommendations is empty (`pass`)
4. **Sampling Bias:** Only checks first 20 files for task type detection
5. **Git Dependency:** Example file search requires git, fails silently if unavailable

### Moderate Issues

6. **String Matching:** Uses simple substring matching that can produce false positives
7. **Case Sensitivity:** Inconsistent use of `.lower()` for case-insensitive matching
8. **Arbitrary Limits:** Hardcoded limits (5 files, 2 patterns, 20 files) without justification
9. **First Match Wins:** Task type detection returns on first match, ignoring other violations
10. **No Priority/Ranking:** All files/patterns treated equally, no relevance scoring

### Minor Issues

11. **Static Libraries:** Hints and patterns are hardcoded, can't be customized
12. **Generic Fallbacks:** Default values are very generic and might not be helpful
13. **No Caching:** Recommendations file loaded every time (performance concern)

---

## Recommendations for Improvement

### High Priority

1. **Add Error Logging:** Log failures at appropriate levels (not just debug)
2. **Validate Data:** Verify file existence, JSON schema, and data structure
3. **Implement Enhancement:** Actually use recommendations data in enhancement methods
4. **Fix Sampling:** Check all files or use smarter sampling strategy

### Medium Priority

5. **Improve Matching:** Use more sophisticated pattern matching (regex, fuzzy matching)
6. **Add Priority/Ranking:** Score files/patterns by relevance
7. **Remove Git Dependency:** Add fallback search method (e.g., using `grep` or file system)

### Low Priority

8. **Add Caching:** Cache recommendations file to avoid repeated loads
9. **Make Limits Configurable:** Allow limits to be configured per-project
10. **Add Metrics:** Track which hints/patterns are most useful

---

## Code References for Review

### Main Entry Point
```4984:5003:.cursor/scripts/auto-enforcer.py
def _add_context_hints_to_report(self, report):
    """
    Add context hints to ENFORCER_REPORT based on violations and task type.
    
    Two-Brain Model: Provides minimal guidance to LLM without loading heavy rules.
    Uses unified context manager to compute optimal context bundle.
    
    Args:
        report: EnforcerReport instance to update
    """
    # Use unified context manager to compute context bundle
    context_bundle = self._compute_unified_context_bundle()
    
    # Set context bundle in report
    report.set_context_bundle(
        task_type=context_bundle.get('task_type'),
        hints=context_bundle.get('hints', []),
        relevant_files=context_bundle.get('relevant_files', []),
        patterns_to_follow=context_bundle.get('patterns_to_follow', [])
    )
```

### Unified Context Computation
```5005:5042:.cursor/scripts/auto-enforcer.py
def _compute_unified_context_bundle(self) -> Dict[str, Any]:
    """
    Unified Context Manager: Compute optimal context bundle for LLM.
    
    Two-Brain Model: Brain A (enforcer) computes all context decisions.
    Brain B (LLM) receives curated context bundle in ENFORCER_REPORT.
    
    This method:
    1. Detects task type from violations and file changes
    2. Computes optimal context (using internal recommendations)
    3. Extracts minimal hints (not full rule files)
    4. Finds relevant example files
    5. Identifies patterns to follow
    
    Returns:
        Dict with task_type, hints, relevant_files, patterns_to_follow
    """
    # Step 1: Detect task type
    task_type = self._detect_task_type_unified()
    
    # Step 2: Load internal recommendations (if available)
    internal_recommendations = self._load_internal_recommendations()
    
    # Step 3: Extract hints based on task type and recommendations
    hints = self._extract_context_hints_unified(task_type, internal_recommendations)
    
    # Step 4: Find relevant example files
    relevant_files = self._find_relevant_example_files(task_type, internal_recommendations)
    
    # Step 5: Get patterns to follow
    patterns = self._get_patterns_to_follow_unified(task_type, internal_recommendations)
    
    return {
        "task_type": task_type,
        "hints": hints,
        "relevant_files": relevant_files,
        "patterns_to_follow": patterns
    }
```

### Task Type Detection (Unified)
```5044:5081:.cursor/scripts/auto-enforcer.py
def _detect_task_type_unified(self) -> Optional[str]:
    """
    Unified task type detection from violations and file changes.
    
    Returns:
        Task type string or None
    """
    # First, try to detect from violations
    task_type_from_violations = self._detect_task_type_from_violations()
    if task_type_from_violations:
        return task_type_from_violations
    
    # Fallback: Detect from file changes
    changed_files = self.get_changed_files(include_untracked=False)
    if not changed_files:
        return None
    
    # Infer task type from file patterns
    file_types = set()
    for file_path in changed_files[:20]:  # Sample first 20
        if file_path.endswith('.ts') or file_path.endswith('.tsx'):
            file_types.add('typescript')
        elif file_path.endswith('.py'):
            file_types.add('python')
        elif 'schema.prisma' in file_path:
            return "database_change"
        elif 'auth' in file_path.lower():
            return "auth_change"
        elif 'test' in file_path.lower():
            return "test_change"
    
    # Default based on file types
    if 'typescript' in file_types:
        return "edit_code"
    elif 'python' in file_types:
        return "edit_code"
    
    return "edit_code"
```

### Task Type Detection (From Violations)
```5196:5220:.cursor/scripts/auto-enforcer.py
def _detect_task_type_from_violations(self) -> Optional[str]:
    """
    Detect task type from violations.
    
    Returns:
        Task type string (e.g., "add_rls", "add_logging", "fix_date") or None
    """
    if not self.violations:
        return None
    
    # Analyze violations to determine task type
    for v in self.violations:
        rule_ref = getattr(v, 'rule_ref', '') or getattr(v, 'message', '')
        rule_ref_lower = rule_ref.lower()
        
        if 'rls' in rule_ref_lower or 'tenant' in rule_ref_lower or 'security' in rule_ref_lower:
            return "add_rls"
        elif 'date' in rule_ref_lower or '02-core' in rule_ref:
            return "fix_date"
        elif 'logging' in rule_ref_lower or 'observability' in rule_ref_lower:
            return "add_logging"
        elif 'error' in rule_ref_lower or 'resilience' in rule_ref_lower:
            return "add_error_handling"
    
    return "fix_violations"
```

### Load Internal Recommendations
```5083:5105:.cursor/scripts/auto-enforcer.py
def _load_internal_recommendations(self) -> Optional[Dict]:
    """
    Load internal recommendations from enforcer-only location.
    
    Returns:
        Recommendations dict or None
    """
    recommendations_file = self.project_root / ".cursor" / "enforcement" / "internal" / "context_recommendations.json"
    
    if not recommendations_file.exists():
        return None
    
    try:
        with open(recommendations_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.debug(
            f"Could not load internal recommendations: {e}",
            operation="_load_internal_recommendations",
            error_code="LOAD_RECOMMENDATIONS_FAILED",
            root_cause=str(e)
        )
        return None
```

### Extract Context Hints (Unified) - Shows Dead Code
```5107:5132:.cursor/scripts/auto-enforcer.py
def _extract_context_hints_unified(self, task_type: Optional[str], 
                                 recommendations: Optional[Dict]) -> List[str]:
    """
    Extract context hints using unified approach.
    
    Args:
        task_type: Detected task type
        recommendations: Internal recommendations (if available)
        
    Returns:
        List of guidance hints
    """
    # Start with base hints from task type
    hints = self._extract_context_hints(task_type)
    
    # Enhance with recommendations if available
    if recommendations and task_type:
        task_info = recommendations.get('task', {})
        context_info = recommendations.get('context', {})
        
        # Add task-specific hints from recommendations
        if task_info.get('type') == task_type:
            # Use recommendations context if it matches
            pass  # Base hints are already good
    
    return hints
```

### Find Relevant Example Files (Unified)
```5134:5172:.cursor/scripts/auto-enforcer.py
def _find_relevant_example_files(self, task_type: Optional[str], 
                                recommendations: Optional[Dict]) -> List[str]:
    """
    Find relevant example files using unified approach.
    
    Args:
        task_type: Detected task type
        recommendations: Internal recommendations (if available)
        
    Returns:
        List of example file paths
    """
    # Start with base example files
    example_files = self._get_relevant_example_files(task_type)
    
    # Enhance with recommendations if available
    if recommendations:
        context_info = recommendations.get('context', {})
        active_files = context_info.get('active', [])
        
        # Filter to actual code files (not rule files)
        code_examples = [
            f for f in active_files 
            if not f.startswith('.cursor/') and 
               (f.endswith('.ts') or f.endswith('.tsx') or f.endswith('.py'))
        ]
        
        # Add top examples from recommendations
        example_files.extend(code_examples[:3])
    
    # Remove duplicates and limit
    seen = set()
    unique_files = []
    for f in example_files:
        if f and f not in seen:
            seen.add(f)
            unique_files.append(f)
    
    return unique_files[:5]  # Limit to 5 examples
```

### Get Relevant Example Files (Base) - Shows Git Dependency
```5302:5384:.cursor/scripts/auto-enforcer.py
def _get_relevant_example_files(self, task_type: Optional[str]) -> List[str]:
    """
    Get relevant example files for task type.
    
    Searches codebase for example implementations.
    
    Args:
        task_type: Type of task detected
        
    Returns:
        List of example file paths
    """
    if not task_type:
        return []
    
    example_files = []
    
    try:
        import subprocess
        
        # Search patterns based on task type
        search_patterns = {
            "add_rls": [
                ('tenant_id.*where', '*.ts'),
                ('TenantGuard', '*.ts'),
                ('@UseGuards.*Tenant', '*.ts')
            ],
            "add_logging": [
                ('logger\\.(warn|error|info)', '*.ts'),
                ('structured.*log', '*.ts')
            ],
            "fix_date": [
                ('SYSTEM_DATE', '*.ts'),
                ('systemDate', '*.ts'),
                ('inject.*DATE', '*.ts')
            ],
            "add_error_handling": [
                ('try.*catch', '*.ts'),
                ('AppError', '*.ts'),
                ('HttpException', '*.ts')
            ],
            "database_change": [
                ('schema\\.prisma', '*.prisma'),
                ('migration', '*.ts')
            ],
            "auth_change": [
                ('JwtAuthGuard', '*.ts'),
                ('@UseGuards.*Jwt', '*.ts'),
                ('validate.*token', '*.ts')
            ]
        }
        
        patterns = search_patterns.get(task_type, [])
        
        for pattern, file_glob in patterns[:2]:  # Limit to 2 patterns per task type
            try:
                result = subprocess.run(
                    ['git', 'grep', '-l', pattern, '--', file_glob],
                    capture_output=True,
                    text=True,
                    timeout=5,
                    cwd=str(self.project_root)
                )
                if result.returncode == 0:
                    files = result.stdout.strip().split('\n')
                    # Filter to actual source files (not test files for examples)
                    source_files = [f for f in files if f and 'test' not in f.lower()][:2]
                    example_files.extend(source_files)
            except Exception:
                pass
    
    except Exception:
        pass
    
    # Remove duplicates and limit
    seen = set()
    unique_files = []
    for f in example_files:
        if f and f not in seen:
            seen.add(f)
            unique_files.append(f)
    
    return unique_files[:5]  # Limit to 5 examples
```

### Report Generator - Context Bundle Structure
```84:125:.cursor/enforcement/report_generator.py
        # Two-Brain Model: Context bundle for LLM guidance
        self.context_bundle: Dict[str, Any] = {
            "task_type": None,
            "hints": [],
            "relevant_files": [],
            "patterns_to_follow": []
        }
    
    def add_violation(self, violation: Violation):
        """Add a violation to the report."""
        self.violations.append(violation)
    
    def add_auto_fix(self, auto_fix: AutoFix):
        """Add an auto-fix to the report."""
        self.auto_fixes.append(auto_fix)
    
    def add_next_action(self, action: str):
        """Add a next action for the LLM."""
        self.next_actions.append(action)
    
    def set_context_bundle(self, task_type: str = None, hints: List[str] = None, 
                          relevant_files: List[str] = None, patterns_to_follow: List[str] = None):
        """
        Set context bundle for LLM guidance.
        
        Two-Brain Model: This provides minimal context hints to the LLM
        without requiring it to load heavy rule files.
        
        Args:
            task_type: Type of task (e.g., "add_rls", "add_logging", "fix_date")
            hints: List of guidance hints for the task
            relevant_files: List of example files to reference
            patterns_to_follow: List of patterns to follow
        """
        if task_type:
            self.context_bundle["task_type"] = task_type
        if hints:
            self.context_bundle["hints"] = hints
        if relevant_files:
            self.context_bundle["relevant_files"] = relevant_files
        if patterns_to_follow:
            self.context_bundle["patterns_to_follow"] = patterns_to_follow
```

---

## Code Example: Potential Bug Scenario

```python
# Scenario: Multiple task types in violations, git not available

# 1. Violations detected:
violations = [
    Violation(rule_ref="03-security.mdc#R02", ...),  # RLS
    Violation(rule_ref="07-observability.mdc#R08", ...)  # Logging
]

# 2. Task type detection:
# Returns "add_rls" (first match) - logging violation ignored

# 3. Example file search:
# Tries git grep, but git not available
# Exception caught silently, returns empty list

# 4. Final context bundle:
{
    "task_type": "add_rls",  # Only RLS, logging ignored
    "hints": [...],  # Only RLS hints
    "relevant_files": [],  # Empty (git failed silently)
    "patterns_to_follow": [...]  # Only RLS patterns
}

# Result: LLM receives incomplete context, missing logging guidance
```

---

## Conclusion

The context recommendation system is **well-structured** but has several **logic concerns** that could lead to:

1. **Incomplete context** (silent failures, sampling bias)
2. **Incorrect context** (false positives, first match wins)
3. **Missing enhancements** (dead code, unused recommendations)

**Recommendation:** Address critical issues (error logging, validation, enhancement implementation) before relying on this system for production use.

