# R08: Structured Logging Policy Tests
# Tests for structured logging violations and warnings

package compliance.observability_test

import rego.v1
import data.compliance.observability

# ============================================================================
# TEST 1: Happy Path - Proper Structured Logging with All Required Fields
# ============================================================================

test_proper_structured_logging_passes if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ this.logger.info(\n+   'Processing payment',\n+   'PaymentService',\n+   requestId,\n+   'processPayment',\n+   { paymentId: payment.id }\n+ );"
        }],
        "pr_body": ""
    }
    
    count(observability.violations) == 0 with input as test_input
}

# ============================================================================
# TEST 2: Happy Path - TraceId Propagation
# ============================================================================

test_trace_id_propagation_passes if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ const traceId = this.requestContext.getTraceId();\n+ this.logger.info(\n+   'Processing payment',\n+   'PaymentService',\n+   this.requestContext.getRequestId(),\n+   'processPayment'\n+ );"
        }],
        "pr_body": ""
    }
    
    count(observability.violations) == 0 with input as test_input
}

# ============================================================================
# TEST 3: Happy Path - Optional Fields Included
# ============================================================================

test_optional_fields_passes if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ this.logger.error(\n+   'Payment failed',\n+   'PaymentService',\n+   requestId,\n+   'processPayment',\n+   {\n+     errorCode: 'PAYMENT_FAILED',\n+     rootCause: error.message,\n+     tenantId: this.requestContext.getTenantId(),\n+     userId: user.id\n+   }\n+ );"
        }],
        "pr_body": ""
    }
    
    count(observability.violations) == 0 with input as test_input
}

# ============================================================================
# TEST 4: Violation - Console.log Instead of Structured Logger
# ============================================================================

test_console_log_fails if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ console.log('Processing payment');"
        }],
        "pr_body": ""
    }
    
    count(observability.violations) > 0 with input as test_input
    count(observability.deny) > 0 with input as test_input
}

# ============================================================================
# TEST 5: Violation - Unstructured Free-Text Logging
# ============================================================================

test_unstructured_logging_fails if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ logger.log('Processing payment');"
        }],
        "pr_body": ""
    }
    
    count(observability.violations) > 0 with input as test_input
    count(observability.deny) > 0 with input as test_input
}

# ============================================================================
# TEST 6: Violation - Missing Required Fields
# ============================================================================

test_missing_required_fields_fails if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ this.logger.info('Processing payment', 'PaymentService');"
        }],
        "pr_body": ""
    }
    
    count(observability.violations) > 0 with input as test_input
    count(observability.deny) > 0 with input as test_input
}

# ============================================================================
# TEST 7: Violation - Missing TraceId
# ============================================================================

test_missing_trace_id_fails if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ this.logger.info(\n+   'Processing payment',\n+   'PaymentService',\n+   undefined,\n+   'processPayment'\n+ );"
        }],
        "pr_body": ""
    }
    
    count(observability.violations) > 0 with input as test_input
    count(observability.deny) > 0 with input as test_input
}

# ============================================================================
# TEST 8: Violation - Missing Context or Operation
# ============================================================================

test_missing_context_operation_fails if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ this.logger.info(\n+   'Processing payment',\n+   null,\n+   requestId,\n+   'processPayment'\n+ );"
        }],
        "pr_body": ""
    }
    
    count(observability.violations) > 0 with input as test_input
    count(observability.deny) > 0 with input as test_input
}

# ============================================================================
# TEST 9: Warning - Incomplete Logging (Missing Optional Fields)
# ============================================================================

test_incomplete_logging_warns if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ this.logger.error(\n+   'Payment failed',\n+   'PaymentService',\n+   requestId,\n+   'processPayment'\n+ );"
        }],
        "pr_body": ""
    }
    
    count(observability.warnings) > 0 with input as test_input
    count(observability.warn) > 0 with input as test_input
}

# ============================================================================
# TEST 10: Override - With Marker
# ============================================================================

test_override_allows_violation if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ console.log('Debug output');"
        }],
        "pr_body": "@override:structured-logging\nReason: Temporary debug logging, will remove before production"
    }
    
    count(observability.violations) > 0 with input as test_input
    count(observability.deny) == 0  # Override prevents deny
}

# ============================================================================
# TEST 11: Edge Case - Console.log in Test File (Allowed)
# ============================================================================

test_console_log_in_test_passes if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.spec.ts",
            "diff": "+ console.log('Test output');"
        }],
        "pr_body": ""
    }
    
    # Should pass - console.log allowed in test files
    count(observability.violations) == 0 with input as test_input
}

# ============================================================================
# TEST 12: Edge Case - Console.log in Script (Allowed)
# ============================================================================

test_console_log_in_script_passes if {
    test_input := {
        "changed_files": [{
            "path": "scripts/migrate-data.ts",
            "diff": "+ console.log('Migration progress: 50%');"
        }],
        "pr_body": ""
    }
    
    # Should pass - console.log allowed in scripts
    count(observability.violations) == 0 with input as test_input
}

# ============================================================================
# TEST 13: Edge Case - Multiple Logging Calls
# ============================================================================

test_multiple_logging_calls_checked if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ this.logger.info('Start', 'Service', requestId, 'process', {});\n+ this.logger.info('Processing', 'Service', requestId, 'process', {});\n+ this.logger.info('Complete', 'Service', requestId, 'process', {});"
        }],
        "pr_body": ""
    }
    
    # Should pass - all calls have required fields
    count(observability.violations) == 0 with input as test_input
}

# ============================================================================
# TEST 14: Edge Case - Nested Service Calls with TraceId
# ============================================================================

test_nested_service_calls_checked if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ const traceId = this.requestContext.getTraceId();\n+ this.logger.info('Calling downstream', 'Service', requestId, 'call');\n+ await this.downstreamService.process(traceId, data);\n+ this.logger.info('Downstream complete', 'Service', requestId, 'call');"
        }],
        "pr_body": ""
    }
    
    # Should pass - traceId propagates correctly
    count(observability.violations) == 0 with input as test_input
}

# ============================================================================
# TEST 15: Edge Case - Logger Injection
# ============================================================================

test_logger_injection_checked if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/test/service.ts",
            "diff": "+ @Injectable()\n+ export class TestService {\n+   constructor(\n+     private readonly logger: StructuredLoggerService,\n+     private readonly requestContext: RequestContextService\n+   ) {}\n+   \n+   async process() {\n+     this.logger.info('Processing', 'TestService', this.requestContext.getRequestId(), 'process');\n+   }\n+ }"
        }],
        "pr_body": ""
    }
    
    # Should pass - logger properly injected and used
    count(observability.violations) == 0 with input as test_input
}




