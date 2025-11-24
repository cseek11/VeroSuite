# R08: Structured Logging Policy Tests
# Tests for structured logging violations and warnings

package verofield.observability

import future.keywords.if

# ============================================================================
# TEST 1: Happy Path - Proper Structured Logging with All Required Fields
# ============================================================================

test_proper_structured_logging_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ this.logger.info(",
                "+   'Processing payment',",
                "+   'PaymentService',",
                "+   requestId,",
                "+   'processPayment',",
                "+   { paymentId: payment.id }",
                "+ );"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) == 0
}

# ============================================================================
# TEST 2: Happy Path - TraceId Propagation
# ============================================================================

test_trace_id_propagation_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ const traceId = this.requestContext.getTraceId();",
                "+ this.logger.info(",
                "+   'Processing payment',",
                "+   'PaymentService',",
                "+   this.requestContext.getRequestId(),",
                "+   'processPayment'",
                "+ );"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) == 0
}

# ============================================================================
# TEST 3: Happy Path - Optional Fields Included
# ============================================================================

test_optional_fields_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ this.logger.error(",
                "+   'Payment failed',",
                "+   'PaymentService',",
                "+   requestId,",
                "+   'processPayment',",
                "+   {",
                "+     errorCode: 'PAYMENT_FAILED',",
                "+     rootCause: error.message,",
                "+     tenantId: this.requestContext.getTenantId(),",
                "+     userId: user.id",
                "+   }",
                "+ );"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) == 0
}

# ============================================================================
# TEST 4: Violation - Console.log Instead of Structured Logger
# ============================================================================

test_console_log_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ console.log('Processing payment');"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) > 0
    count(deny) > 0
}

# ============================================================================
# TEST 5: Violation - Unstructured Free-Text Logging
# ============================================================================

test_unstructured_logging_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ logger.log('Processing payment');"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) > 0
    count(deny) > 0
}

# ============================================================================
# TEST 6: Violation - Missing Required Fields
# ============================================================================

test_missing_required_fields_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ this.logger.info('Processing payment', 'PaymentService');"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) > 0
    count(deny) > 0
}

# ============================================================================
# TEST 7: Violation - Missing TraceId
# ============================================================================

test_missing_trace_id_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ this.logger.info(",
                "+   'Processing payment',",
                "+   'PaymentService',",
                "+   undefined,",
                "+   'processPayment'",
                "+ );"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) > 0
    count(deny) > 0
}

# ============================================================================
# TEST 8: Violation - Missing Context or Operation
# ============================================================================

test_missing_context_operation_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ this.logger.info(",
                "+   'Processing payment',",
                "+   null,",
                "+   requestId,",
                "+   'processPayment'",
                "+ );"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(violations) > 0
    count(deny) > 0
}

# ============================================================================
# TEST 9: Warning - Incomplete Logging (Missing Optional Fields)
# ============================================================================

test_incomplete_logging_warns if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ this.logger.error(",
                "+   'Payment failed',",
                "+   'PaymentService',",
                "+   requestId,",
                "+   'processPayment'",
                "+ );"
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
                "+ console.log('Debug output');"
            ]
        }],
        "pr_body_lines": [
            "@override:structured-logging",
            "Reason: Temporary debug logging, will remove before production"
        ]
    }
    
    count(violations) > 0
    count(deny) == 0  # Override prevents deny
}

# ============================================================================
# TEST 11: Edge Case - Console.log in Test File (Allowed)
# ============================================================================

test_console_log_in_test_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.spec.ts",
            "diff_lines": [
                "+ console.log('Test output');"
            ]
        }],
        "pr_body_lines": []
    }
    
    # Should pass - console.log allowed in test files
    count(violations) == 0
}

# ============================================================================
# TEST 12: Edge Case - Console.log in Script (Allowed)
# ============================================================================

test_console_log_in_script_passes if {
    input := {
        "files": [{
            "path": "scripts/migrate-data.ts",
            "diff_lines": [
                "+ console.log('Migration progress: 50%');"
            ]
        }],
        "pr_body_lines": []
    }
    
    # Should pass - console.log allowed in scripts
    count(violations) == 0
}

# ============================================================================
# TEST 13: Edge Case - Multiple Logging Calls
# ============================================================================

test_multiple_logging_calls_checked if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ this.logger.info('Start', 'Service', requestId, 'process', {});",
                "+ this.logger.info('Processing', 'Service', requestId, 'process', {});",
                "+ this.logger.info('Complete', 'Service', requestId, 'process', {});"
            ]
        }],
        "pr_body_lines": []
    }
    
    # Should pass - all calls have required fields
    count(violations) == 0
}

# ============================================================================
# TEST 14: Edge Case - Nested Service Calls with TraceId
# ============================================================================

test_nested_service_calls_checked if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ const traceId = this.requestContext.getTraceId();",
                "+ this.logger.info('Calling downstream', 'Service', requestId, 'call');",
                "+ await this.downstreamService.process(traceId, data);",
                "+ this.logger.info('Downstream complete', 'Service', requestId, 'call');"
            ]
        }],
        "pr_body_lines": []
    }
    
    # Should pass - traceId propagates correctly
    count(violations) == 0
}

# ============================================================================
# TEST 15: Edge Case - Logger Injection
# ============================================================================

test_logger_injection_checked if {
    input := {
        "files": [{
            "path": "apps/api/src/test/service.ts",
            "diff_lines": [
                "+ @Injectable()",
                "+ export class TestService {",
                "+   constructor(",
                "+     private readonly logger: StructuredLoggerService,",
                "+     private readonly requestContext: RequestContextService",
                "+   ) {}",
                "+   ",
                "+   async process() {",
                "+     this.logger.info('Processing', 'TestService', this.requestContext.getRequestId(), 'process');",
                "+   }",
                "+ }"
            ]
        }],
        "pr_body_lines": []
    }
    
    # Should pass - logger properly injected and used
    count(violations) == 0
}



