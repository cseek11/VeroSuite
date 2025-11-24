# R07: Error Handling Policy Tests
# Tests for error handling violations and warnings

package verofield.error_handling

import future.keywords.if

# ============================================================================
# TEST 1: Happy Path - Proper Error Handling with Logging
# ============================================================================

test_proper_error_handling_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ try {",
                "+   await riskyOperation();",
                "+ } catch (error) {",
                "+   logger.error('Operation failed', {",
                "+     context: 'ServiceName',",
                "+     operation: 'riskyOperation',",
                "+     errorCode: 'OP_FAILED',",
                "+     rootCause: error.message,",
                "+     traceId: this.requestContext.getTraceId()",
                "+   });",
                "+   throw error;",
                "+ }"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) == 0
}

# ============================================================================
# TEST 2: Happy Path - Error Categorization
# ============================================================================

test_error_categorization_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ try {",
                "+   await validateInput(input);",
                "+ } catch (error) {",
                "+   if (error instanceof ValidationError) {",
                "+     throw new BadRequestException(error.message);",
                "+   } else if (error instanceof BusinessRuleError) {",
                "+     throw new UnprocessableEntityException(error.message);",
                "+   } else {",
                "+     throw new InternalServerErrorException('System error');",
                "+   }",
                "+ }"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) == 0
}

# ============================================================================
# TEST 3: Happy Path - User-Friendly Error Messages
# ============================================================================

test_user_friendly_messages_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ throw new BadRequestException(",
                "+   'Unable to save work order. Please check required fields and try again.'",
                "+ );"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) == 0
}

# ============================================================================
# TEST 4: Violation - Empty Catch Block
# ============================================================================

test_empty_catch_block_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ try {",
                "+   await riskyOperation();",
                "+ } catch (error) { }"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) > 0
    count(deny) > 0
}

# ============================================================================
# TEST 5: Violation - Swallowed Promise
# ============================================================================

test_swallowed_promise_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ riskyOperation().catch(() => {});"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) > 0
    count(deny) > 0
}

# ============================================================================
# TEST 6: Violation - Missing Await
# ============================================================================

test_missing_await_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ async function process() {",
                "+   prisma.user.findMany();",
                "+ }"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) > 0
    count(deny) > 0
}

# ============================================================================
# TEST 7: Violation - Console.log Instead of Structured Logging
# ============================================================================

test_console_log_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ try {",
                "+   await riskyOperation();",
                "+ } catch (error) {",
                "+   console.error('Error:', error);",
                "+ }"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) > 0
    count(deny) > 0
}

# ============================================================================
# TEST 8: Violation - Unlogged Error
# ============================================================================

test_unlogged_error_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ if (!user) {",
                "+   throw new Error('User not found');",
                "+ }"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) > 0
    count(deny) > 0
}

# ============================================================================
# TEST 9: Warning - Incomplete Error Handling
# ============================================================================

test_incomplete_error_handling_warns if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ try {",
                "+   await riskyOperation();",
                "+ } catch (error) {",
                "+   logger.error('Error', { error });",
                "+   throw new InternalServerErrorException('Error');",
                "+ }"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(warnings) > 0
    count(warn) > 0
}

# ============================================================================
# TEST 10: Override - With Marker
# ============================================================================

test_override_allows_violation if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ try {",
                "+   await riskyOperation();",
                "+ } catch (error) { }"
            ]
        }],
        "pr_body_lines": [
            "@override:error-handling",
            "Reason: Legacy code, will fix in follow-up PR #123"
        ]
    }
    
    count(violations) > 0
    count(deny) == 0  # Override prevents deny
}

# ============================================================================
# TEST 11: Edge Case - Multiple Error-Prone Operations
# ============================================================================

test_multiple_operations_checked if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ async function process() {",
                "+   try {",
                "+     await fetch('https://api.example.com');",
                "+     await prisma.user.findMany();",
                "+     await axios.get('https://api.example.com');",
                "+   } catch (error) {",
                "+     logger.error('Error', { error });",
                "+     throw error;",
                "+   }",
                "+ }"
            ]
        }],
        "pr_body_lines": []
    }
    
    # Should pass - all operations wrapped in try/catch with logging
    count(violations) == 0
}

# ============================================================================
# TEST 12: Edge Case - Nested Try/Catch
# ============================================================================

test_nested_try_catch_checked if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ try {",
                "+   try {",
                "+     await riskyOperation();",
                "+   } catch (innerError) {",
                "+     logger.error('Inner error', { error: innerError });",
                "+     throw innerError;",
                "+   }",
                "+ } catch (outerError) {",
                "+   logger.error('Outer error', { error: outerError });",
                "+   throw outerError;",
                "+ }"
            ]
        }],
        "pr_body_lines": []
    }
    
    # Should pass - both levels have logging
    count(violations) == 0
}

# ============================================================================
# TEST 13: Edge Case - Intentional Fire-and-Forget
# ============================================================================

test_intentional_fire_and_forget_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ // @fire-and-forget - Background cleanup, not critical",
                "+ void cleanupTempFiles().catch((err) => ",
                "+   logger.warn('Cleanup failed but not critical', { error: err })",
                "+ );"
            ]
        }],
        "pr_body_lines": []
    }
    
    # Should pass - intentionally fire-and-forget with error handler
    count(violations) == 0
}

# ============================================================================
# TEST 14: Edge Case - Empty Catch with Comment Only
# ============================================================================

test_empty_catch_with_comment_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ try {",
                "+   await riskyOperation();",
                "+ } catch (error) { // TODO: Add error handling }"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) > 0
    count(deny) > 0
}

# ============================================================================
# TEST 15: Edge Case - Console.log in Non-Catch Context
# ============================================================================

test_console_log_non_catch_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ // Debug logging (not in catch block)",
                "+ console.log('Debug info:', data);"
            ]
        }],
        "pr_body_lines": []
    }
    
    # Should still flag - console.log should be replaced with structured logging
    # But not as critical as console.log in catch blocks
    count(violations) > 0
}



