# Frontend Policy - Cross-Platform Compatibility
# 
# This policy enforces cross-platform compatibility for VeroField:
# - R24: Cross-Platform Compatibility (Tier 3 - WARNING)
#
# Created: 2025-11-23
# Version: 1.0.0

package compliance.frontend

import future.keywords.contains
import future.keywords.if
import future.keywords.in

# Policy metadata
metadata := {
    "name": "Cross-Platform Compatibility",
    "domain": "frontend",
    "tier": "3",  # WARNING - Cross-platform compatibility is best practice
    "version": "1.0.0",
    "created": "2025-11-23",
    "description": "Enforces cross-platform compatibility: platform-specific API detection, shared library usage, file system operations"
}

# =============================================================================
# R24: CROSS-PLATFORM COMPATIBILITY (TIER 3 - WARNING)
# =============================================================================
# Enforce cross-platform compatibility: platform checks, shared libraries, path handling

# Helper: Check if file is in cross-platform context (libs/common/ or imported by multiple platforms)
is_cross_platform_context(file) if {
    startswith(file.path, "libs/common/")
}

is_cross_platform_context(file) if {
    # Check if file is in shared location (apps/shared/, etc.)
    contains(file.path, "/shared/")
}

# Helper: Check if file is platform-specific (frontend/ or VeroFieldMobile/ unless shared)
is_platform_specific(file) if {
    startswith(file.path, "frontend/")
    not contains(file.path, "/shared/")
    not startswith(file.path, "frontend/src/lib/")  # Shared libs in frontend
}

is_platform_specific(file) if {
    startswith(file.path, "VeroFieldMobile/")
    not contains(file.path, "/shared/")
}

# Helper: Check if platform check exists before API usage
has_platform_check(diff, api_pattern) if {
    # Check for typeof window, typeof process, Platform.OS, etc.
    regex.match(`typeof\s+(window|process)\s*!==\s*['"]undefined['"]`, diff)
}

has_platform_check(diff, api_pattern) if {
    regex.match(`Platform\.OS\s*===`, diff)
}

has_platform_check(diff, api_pattern) if {
    regex.match(`typeof\s+AsyncStorage\s*!==\s*['"]undefined['"]`, diff)
}

# =============================================================================
# R24-W01: Platform-specific API used without platform check
# =============================================================================

# Browser-only APIs (window, document, localStorage, sessionStorage)
warn contains msg if {
    some file in input.changed_files
    is_cross_platform_context(file)
    
    # Detect browser-only APIs
    regex.match(`\b(localStorage|sessionStorage|window\.|document\.)`, file.diff)
    
    # Check if platform check exists
    not has_platform_check(file.diff, "browser")
    
    msg := sprintf(
        "WARNING [Frontend/R24-W01]: Platform-specific API used without platform check in %s. Browser-only APIs (localStorage, window, document) require platform checks in cross-platform code. Add: if (typeof window !== 'undefined' && window.localStorage) { ... }",
        [file.path]
    )
}

# Node.js-only APIs (fs, process, __dirname, __filename)
warn contains msg if {
    some file in input.changed_files
    startswith(file.path, "frontend/")
    
    # Detect Node.js-only APIs
    regex.match(`\b(fs\.|process\.|__dirname|__filename|require\(['"]fs['"]|require\(['"]path['"])`, file.diff)
    
    msg := sprintf(
        "WARNING [Frontend/R24-W02]: Node.js-only API used in frontend/mobile code in %s. Node.js APIs (fs, process, __dirname, __filename) cannot be used in frontend/mobile code. Use platform-abstracted utilities from libs/common/ instead.",
        [file.path]
    )
}

warn contains msg if {
    some file in input.changed_files
    startswith(file.path, "VeroFieldMobile/")
    
    # Detect Node.js-only APIs
    regex.match(`\b(fs\.|process\.|__dirname|__filename|require\(['"]fs['"]|require\(['"]path['"])`, file.diff)
    
    msg := sprintf(
        "WARNING [Frontend/R24-W02]: Node.js-only API used in frontend/mobile code in %s. Node.js APIs (fs, process, __dirname, __filename) cannot be used in frontend/mobile code. Use platform-abstracted utilities from libs/common/ instead.",
        [file.path]
    )
}

# React Native-only APIs (AsyncStorage, Platform, Linking)
warn contains msg if {
    some file in input.changed_files
    startswith(file.path, "frontend/")
    not contains(file.path, "/shared/")
    
    # Detect React Native-only APIs
    regex.match(`\b(AsyncStorage|Platform\.|Linking\.)`, file.diff)
    
    # Check if platform check exists
    not has_platform_check(file.diff, "react-native")
    
    msg := sprintf(
        "WARNING [Frontend/R24-W03]: React Native-only API used in web code without platform check in %s. React Native APIs (AsyncStorage, Platform, Linking) require platform checks in web code. Add: if (typeof AsyncStorage !== 'undefined') { ... }",
        [file.path]
    )
}

# =============================================================================
# R24-W04: Shared library violation (heuristic-based detection)
# =============================================================================

# Helper: Extract function name from export statement
extract_function_name(diff) := name if {
    matches := regex.find_all_string_submatch_n(`export\s+(?:async\s+)?function\s+(\w+)`, diff, -1)
    count(matches) > 0
    name := matches[0][1]
}

extract_function_name(diff) := name if {
    matches := regex.find_all_string_submatch_n(`export\s+const\s+(\w+)\s*=`, diff, -1)
    count(matches) > 0
    name := matches[0][1]
}

# Helper: Check if shared library exists for function
shared_library_exists(function_name, file_path) if {
    # Check if libs/common/src/utils/ has matching file
    # This is a heuristic - check by name/path matching
    # Example: formatDate in frontend/src/utils/dateUtils.ts
    #          should check libs/common/src/utils/dateUtils.ts
    
    # Extract utility name from path
    path_matches := regex.find_all_string_submatch_n(`/(\w+Utils?)\.ts$`, file_path, -1)
    count(path_matches) > 0
    utility_name := path_matches[0][1]
    
    # Check if libs/common/src/utils/{utility_name}.ts exists
    # This would be checked by the script, not OPA
    # OPA just flags potential violations
}

# Warning: Function exists in shared library but not imported (cross-platform context)
warn contains msg if {
    some file in input.changed_files
    is_cross_platform_context(file)
    
    # Check if file exports a function
    function_name := extract_function_name(file.diff)
    function_name != ""
    
    # Check if import from libs/common/ is missing
    not regex.match(`from\s+['"]@verofield/common`, file.diff)
    
    # Extract utility name from path for suggestion
    path_matches := regex.find_all_string_submatch_n(`/(\w+Utils?)\.ts$`, file.path, -1)
    count(path_matches) > 0
    utility_name := path_matches[0][1]
    
    msg := sprintf(
        "WARNING [Frontend/R24-W04]: Function '%s' in %s may duplicate existing shared library. Check if @verofield/common/utils/%s exists and use it instead of duplicating code.",
        [function_name, file.path, utility_name]
    )
}

# Warning: Function exists in shared library but not imported (frontend utils)
warn contains msg if {
    some file in input.changed_files
    startswith(file.path, "frontend/")
    contains(file.path, "/utils/")
    
    # Check if file exports a function
    function_name := extract_function_name(file.diff)
    function_name != ""
    
    # Check if import from libs/common/ is missing
    not regex.match(`from\s+['"]@verofield/common`, file.diff)
    
    # Extract utility name from path for suggestion
    path_matches := regex.find_all_string_submatch_n(`/(\w+Utils?)\.ts$`, file.path, -1)
    count(path_matches) > 0
    utility_name := path_matches[0][1]
    
    msg := sprintf(
        "WARNING [Frontend/R24-W04]: Function '%s' in %s may duplicate existing shared library. Check if @verofield/common/utils/%s exists and use it instead of duplicating code.",
        [function_name, file.path, utility_name]
    )
}

# Warning: Function exists in shared library but not imported (mobile utils)
warn contains msg if {
    some file in input.changed_files
    startswith(file.path, "VeroFieldMobile/")
    contains(file.path, "/utils/")
    
    # Check if file exports a function
    function_name := extract_function_name(file.diff)
    function_name != ""
    
    # Check if import from libs/common/ is missing
    not regex.match(`from\s+['"]@verofield/common`, file.diff)
    
    # Extract utility name from path for suggestion
    path_matches := regex.find_all_string_submatch_n(`/(\w+Utils?)\.ts$`, file.path, -1)
    count(path_matches) > 0
    utility_name := path_matches[0][1]
    
    msg := sprintf(
        "WARNING [Frontend/R24-W04]: Function '%s' in %s may duplicate existing shared library. Check if @verofield/common/utils/%s exists and use it instead of duplicating code.",
        [function_name, file.path, utility_name]
    )
}

# =============================================================================
# R24-W05: File system operation without cross-platform path handling
# =============================================================================

# Hardcoded path separators (backslashes - Windows-specific) in cross-platform context
warn contains msg if {
    some file in input.changed_files
    is_cross_platform_context(file)
    
    # Detect hardcoded backslashes (match backslash in string)
    regex.match(`['"][^'"]*[\\][^'"]*['"]`, file.diff)
    
    msg := sprintf(
        "WARNING [Frontend/R24-W05]: Hardcoded backslashes (Windows-specific) in %s. Use path.join() or platform-agnostic utilities for cross-platform compatibility. Example: import { join } from 'path'; const filePath = join('path', 'to', 'file');",
        [file.path]
    )
}

# Hardcoded path separators (backslashes - Windows-specific) in apps/
warn contains msg if {
    some file in input.changed_files
    startswith(file.path, "apps/")
    
    # Detect hardcoded backslashes (match backslash in string)
    regex.match(`['"][^'"]*[\\][^'"]*['"]`, file.diff)
    
    msg := sprintf(
        "WARNING [Frontend/R24-W05]: Hardcoded backslashes (Windows-specific) in %s. Use path.join() or platform-agnostic utilities for cross-platform compatibility. Example: import { join } from 'path'; const filePath = join('path', 'to', 'file');",
        [file.path]
    )
}

# Hardcoded forward slashes in Node.js (should use path.join)
warn contains msg if {
    some file in input.changed_files
    startswith(file.path, "apps/")
    not startswith(file.path, "apps/api/src/frontend/")  # Frontend code in apps/api
    
    # Detect hardcoded forward slashes in path strings
    regex.match(`['"][^'"]*/[^'"]*['"]`, file.diff)
    # But exclude URLs, imports, and already using path.join
    not regex.match(`https?://`, file.diff)
    not regex.match(`from\s+['"]`, file.diff)
    not regex.match(`import\s+`, file.diff)
    not regex.match(`path\.join`, file.diff)
    not regex.match(`normalizePath`, file.diff)
    
    msg := sprintf(
        "WARNING [Frontend/R24-W06]: Hardcoded forward slashes in path in %s. Use path.join() for cross-platform path handling. Example: import { join } from 'path'; const filePath = join('src', 'components', 'Button');",
        [file.path]
    )
}

# Case-sensitive path references
warn contains msg if {
    some file in input.changed_files
    is_cross_platform_context(file)
    
    # Detect import with case mismatch (heuristic - import Button from './button')
    regex.match(`from\s+['"]\./[A-Z][^'"]*['"]`, file.diff)
    
    msg := sprintf(
        "WARNING [Frontend/R24-W07]: Potential case-sensitive path reference in %s. File systems differ in case sensitivity (Windows vs Linux/Mac). Ensure import paths match actual file names exactly.",
        [file.path]
    )
}

