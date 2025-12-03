# Test Suite for Frontend Policy - R24 (Cross-Platform Compatibility)
#
# Tests all warning patterns and edge cases for R24
# Created: 2025-11-30
# Version: 1.0.0

package compliance.frontend_test

import data.compliance.frontend
import rego.v1

# =============================================================================
# R24: CROSS-PLATFORM COMPATIBILITY TESTS
# =============================================================================

# Test 1: Happy path - Platform check before localStorage
test_platform_check_before_localstorage_passes if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "libs/common/src/utils/storage.ts",
		"diff": "if (typeof window !== 'undefined' && window.localStorage) { return localStorage.getItem('key'); }",
	}]}
	count(result) == 0
}

# Test 2: Happy path - Shared library usage
test_shared_library_usage_passes if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "frontend/src/utils/dateUtils.ts",
		"diff": "export { formatDate } from '@verofield/common/utils/dateUtils';",
	}]}
	count(result) == 0
}

# Test 3: Happy path - Cross-platform path handling
test_cross_platform_path_handling_passes if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "apps/api/src/utils/fileUtils.ts",
		"diff": "import { join } from 'path'; const filePath = join('src', 'components', 'Button');",
	}]}
	count(result) == 0
}

# Test 4: Warning - localStorage without platform check
test_localstorage_without_platform_check_warns if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "libs/common/src/utils/storage.ts",
		"diff": "return localStorage.getItem('key');",
	}]}
	some warning in result
	contains(warning, "R24-W01")
	contains(warning, "localStorage")
	contains(warning, "platform check")
}

# Test 5: Warning - window API in shared code
test_window_api_in_shared_code_warns if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "libs/common/src/utils/helpers.ts",
		"diff": "const url = window.location.href;",
	}]}
	some warning in result
	contains(warning, "R24-W01")
	contains(warning, "window")
}

# Test 6: Warning - fs API in frontend code
test_fs_api_in_frontend_code_warns if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "frontend/src/utils/fileUtils.ts",
		"diff": "const fs = require('fs'); const data = fs.readFileSync('file.txt');",
	}]}
	some warning in result
	contains(warning, "R24-W02")
	contains(warning, "Node.js-only API")
}

# Test 7: Warning - AsyncStorage in web code
test_asyncstorage_in_web_code_warns if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "frontend/src/utils/storage.ts",
		"diff": "return AsyncStorage.getItem('key');",
	}]}
	some warning in result
	contains(warning, "R24-W03")
	contains(warning, "AsyncStorage")
}

# Test 8: Warning - Duplicated business logic (shared library violation)
test_duplicated_business_logic_warns if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "frontend/src/utils/dateUtils.ts",
		"diff": "export function formatDate(date: Date): string { return date.toISOString().split('T')[0]; }",
	}]}
	some warning in result
	contains(warning, "R24-W04")
	contains(warning, "duplicate")
	contains(warning, "shared library")
}

# Test 9: Warning - File system operation without path.join
test_file_system_without_path_join_warns if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "apps/api/src/utils/fileUtils.ts",
		"diff": "const filePath = 'src/components/Button';",
	}]}
	some warning in result
	contains(warning, "R24-W06")
	contains(warning, "path.join")
}

# Test 10: Warning - Hardcoded backslashes
test_hardcoded_backslashes_warns if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "libs/common/src/utils/fileUtils.ts",
		"diff": "const filePath = 'src\\components\\Button';",
	}]}
	some warning in result
	contains(warning, "R24-W05")
	contains(warning, "backslashes")
}

# Test 11: Edge case - Platform check with typeof
test_platform_check_with_typeof_passes if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "libs/common/src/utils/storage.ts",
		"diff": "if (typeof window !== 'undefined') { return window.localStorage.getItem('key'); }",
	}]}
	count(result) == 0
}

# Test 12: Edge case - Shared library import
test_shared_library_import_passes if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "VeroFieldMobile/src/utils/dateUtils.ts",
		"diff": "export { formatDate } from '@verofield/common/utils/dateUtils';",
	}]}
	count(result) == 0
}

# Test 13: Edge case - Platform-specific file isolation (web-only code)
test_platform_specific_file_isolation_passes if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "frontend/src/components/ui/Button.tsx",
		"diff": "localStorage.setItem('key', 'value');",
	}]}

	# Should not warn for platform-specific files
	count(result) == 0
}

# Test 14: Edge case - Case-sensitive path reference
test_case_sensitive_path_reference_warns if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "libs/common/src/utils/helpers.ts",
		"diff": "import { Button } from './Button';",
	}]}
	some warning in result
	contains(warning, "R24-W07")
	contains(warning, "case-sensitive")
}

# Test 15: Edge case - path.join usage (should pass)
test_path_join_usage_passes if {
	result := frontend.warn with input as {"changed_files": [{
		"path": "apps/api/src/utils/fileUtils.ts",
		"diff": "import { join } from 'path'; const filePath = join('src', 'components');",
	}]}
	count(result) == 0
}
