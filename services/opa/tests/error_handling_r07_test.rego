# R07: Error Handling Policy Tests
# Tests for error handling violations and warnings

package compliance.error_handling_test

import rego.v1
import data.compliance.error_handling

# ============================================================================
# TEST 1: Happy Path - Proper Error Handling with Logging
# ============================================================================

test_proper_error_handling_passes if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ try {\n+   await riskyOperation();\n+ } catch (error) {\n+   logger.error('Operation failed', {\n+     context: 'ServiceName',\n+     operation: 'riskyOperation',\n+     errorCode: 'OP_FAILED',\n+     rootCause: error.message,\n+     traceId: this.requestContext.getTraceId()\n+   });\n+   throw error;\n+ }"
        }],
        "pr_body": ""
    }
    
    count(error_handling.violations) == 0 with input as test_input
}

# ============================================================================
# TEST 2: Happy Path - Error Categorization
# ============================================================================

test_error_categorization_passes if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ try {\n+   await validateInput(input);\n+ } catch (error) {\n+   if (error instanceof ValidationError) {\n+     throw new BadRequestException(error.message);\n+   } else if (error instanceof BusinessRuleError) {\n+     throw new UnprocessableEntityException(error.message);\n+   } else {\n+     throw new InternalServerErrorException('System error');\n+   }\n+ }"
        }],
        "pr_body": ""
    }
    
    count(error_handling.violations) == 0 with input as test_input
}

# ============================================================================
# TEST 3: Happy Path - User-Friendly Error Messages
# ============================================================================

test_user_friendly_messages_passes if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ throw new BadRequestException(\n+   'Unable to save work order. Please check required fields and try again.'\n+ );"
        }],
        "pr_body": ""
    }
    
    count(error_handling.violations) == 0 with input as test_input
}

# ============================================================================
# TEST 4: Violation - Empty Catch Block
# ============================================================================

test_empty_catch_block_fails if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ try {\n+   await riskyOperation();\n+ } catch (error) { }"
        }],
        "pr_body": ""
    }
    
    count(error_handling.violations) > 0 with input as test_input
    count(error_handling.deny) > 0 with input as test_input
}

# ============================================================================
# TEST 5: Violation - Swallowed Promise
# ============================================================================

test_swallowed_promise_fails if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ riskyOperation().catch(() => {});"
        }],
        "pr_body": ""
    }
    
    count(error_handling.violations) > 0 with input as test_input
    count(error_handling.deny) > 0 with input as test_input
}

# ============================================================================
# TEST 6: Violation - Missing Await
# ============================================================================

test_missing_await_fails if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ async function process() {\n+   prisma.user.findMany();\n+ }"
        }],
        "pr_body": ""
    }
    
    count(error_handling.violations) > 0 with input as test_input
    count(error_handling.deny) > 0 with input as test_input
}

# ============================================================================
# TEST 7: Violation - Console.log Instead of Structured Logging
# ============================================================================

test_console_log_fails if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ try {\n+   await riskyOperation();\n+ } catch (error) {\n+   console.error('Error:', error);\n+ }"
        }],
        "pr_body": ""
    }
    
    count(error_handling.violations) > 0 with input as test_input
    count(error_handling.deny) > 0 with input as test_input
}

# ============================================================================
# TEST 8: Violation - Unlogged Error
# ============================================================================

test_unlogged_error_fails if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ if (!user) {\n+   throw new Error('User not found');\n+ }"
        }],
        "pr_body": ""
    }
    
    count(error_handling.violations) > 0 with input as test_input
    count(error_handling.deny) > 0 with input as test_input
}

# ============================================================================
# TEST 9: Warning - Incomplete Error Handling
# ============================================================================

test_incomplete_error_handling_warns if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ try {\n+   await riskyOperation();\n+ } catch (error) {\n+   logger.error('Error', { error });\n+   throw new InternalServerErrorException('Error');\n+ }"
        }],
        "pr_body": ""
    }
    
    count(error_handling.warnings) > 0 with input as test_input
    count(error_handling.warn) > 0 with input as test_input
}

# ============================================================================
# TEST 10: Override - With Marker
# ============================================================================

test_override_allows_violation if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ try {\n+   await riskyOperation();\n+ } catch (error) { }"
        }],
        "pr_body": "@override:error-handling\nReason: Legacy code, will fix in follow-up PR #123"
    }
    
    count(error_handling.violations) > 0 with input as test_input
    count(error_handling.deny) == 0 with input as test_input  # Override prevents deny
}

# ============================================================================
# TEST 11: Edge Case - Multiple Error-Prone Operations
# ============================================================================

test_multiple_operations_checked if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ async function process() {\n+   try {\n+     await fetch('https://api.example.com');\n+     await prisma.user.findMany();\n+     await axios.get('https://api.example.com');\n+   } catch (error) {\n+     logger.error('Error', { error });\n+     throw error;\n+   }\n+ }"
        }],
        "pr_body": ""
    }
    
    # Should pass - all operations wrapped in try/catch with logging
    count(error_handling.violations) == 0 with input as test_input
}

# ============================================================================
# TEST 12: Edge Case - Nested Try/Catch
# ============================================================================

test_nested_try_catch_checked if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ try {\n+   try {\n+     await riskyOperation();\n+   } catch (innerError) {\n+     logger.error('Inner error', { error: innerError });\n+     throw innerError;\n+   }\n+ } catch (outerError) {\n+   logger.error('Outer error', { error: outerError });\n+   throw outerError;\n+ }"
        }],
        "pr_body": ""
    }
    
    # Should pass - both levels have logging
    count(error_handling.violations) == 0 with input as test_input
}

# ============================================================================
# TEST 13: Edge Case - Intentional Fire-and-Forget
# ============================================================================

test_intentional_fire_and_forget_passes if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ // @fire-and-forget - Background cleanup, not critical\n+ void cleanupTempFiles().catch((err) =>\n+   logger.warn('Cleanup failed but not critical', { error: err })\n+ );"
        }],
        "pr_body": ""
    }
    
    # Should pass - intentionally fire-and-forget with error handler
    count(error_handling.violations) == 0 with input as test_input
}

# ============================================================================
# TEST 14: Edge Case - Empty Catch with Comment Only
# ============================================================================

test_empty_catch_with_comment_fails if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ try {\n+   await riskyOperation();\n+ } catch (error) { // TODO: Add error handling }"
        }],
        "pr_body": ""
    }
    
    count(error_handling.violations) > 0 with input as test_input
    count(error_handling.deny) > 0 with input as test_input
}

# ============================================================================
# TEST 15: Edge Case - Console.log in Non-Catch Context
# ============================================================================

test_console_log_non_catch_passes if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ // Debug logging (not in catch block)\n+ console.log('Debug info:', data);"
        }],
        "pr_body": ""
    }
    
    # Should still flag - console.log should be replaced with structured logging
    # But not as critical as console.log in catch blocks
    count(error_handling.violations) > 0 with input as test_input
}




