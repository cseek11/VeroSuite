package verofield.observability_test

import future.keywords.if
import data.verofield.observability

# ============================================================================
# R09: TRACE PROPAGATION TESTS
# ============================================================================

# TEST 1: Happy Path - Proper HTTP Header Propagation
test_http_header_propagation_pass if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff_lines": [
                "+ const traceContext = this.requestContext.getTraceContext();",
                "+ const response = await fetch('https://api.example.com/data', {",
                "+   headers: {",
                "+     'x-trace-id': traceContext.traceId,",
                "+     'x-span-id': traceContext.spanId,",
                "+     'x-request-id': traceContext.requestId",
                "+   }",
                "+ });"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(observability.missing_http_trace_violations) == 0
}

# TEST 2: Happy Path - Using Trace Utility
test_trace_utility_pass if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff_lines": [
                "+ const traceContext = this.requestContext.getTraceContext();",
                "+ const headers = addTraceContextToHeaders({}, traceContext);",
                "+ const response = await fetch('https://api.example.com/data', { headers });"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(observability.missing_http_trace_violations) == 0
}

# TEST 3: Happy Path - Service-to-Service Propagation
test_service_propagation_pass if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff_lines": [
                "+ const traceId = this.requestContext.getTraceId();",
                "+ await this.downstreamService.process(traceId, data);"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(observability.missing_service_trace_violations) == 0
}

# TEST 4: Happy Path - Database Propagation
test_database_propagation_pass if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff_lines": [
                "+ const traceId = this.requestContext.getTraceId();",
                "+ await this.prisma.$executeRaw`",
                "+   SET LOCAL app.trace_id = ${traceId};",
                "+   SELECT * FROM users WHERE tenant_id = ${tenantId};",
                "+ `;"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(observability.missing_db_trace_violations) == 0
}

# TEST 5: Violation - Missing TraceId in HTTP Headers
test_missing_http_trace_violation if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff_lines": [
                "+ const response = await fetch('https://api.example.com/data', {",
                "+   headers: {",
                "+     'Content-Type': 'application/json'",
                "+   }",
                "+ });"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(observability.missing_http_trace_violations) > 0
}

# TEST 6: Violation - Missing TraceId in Service Call
test_missing_service_trace_violation if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff_lines": [
                "+ await this.downstreamService.process(data);"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(observability.missing_service_trace_violations) > 0
}

# TEST 7: Violation - Missing TraceId in Database Query
test_missing_db_trace_violation if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff_lines": [
                "+ await this.prisma.user.findMany({",
                "+   where: { tenantId }",
                "+ });"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(observability.missing_db_trace_violations) > 0
}

# TEST 8: Violation - Missing TraceId in External API Call
test_missing_external_trace_violation if {
    input := {
        "files": [{
            "path": "apps/api/src/integrations/external.service.ts",
            "diff_lines": [
                "+ const response = await axios.get('https://external-api.com/data', {",
                "+   headers: {",
                "+     'Authorization': `Bearer ${apiKey}`",
                "+   }",
                "+ });"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(observability.missing_external_trace_violations) > 0
}

# TEST 9: Violation - Missing TraceId in Message Queue
test_missing_mq_trace_violation if {
    input := {
        "files": [{
            "path": "apps/api/src/events/event-publisher.service.ts",
            "diff_lines": [
                "+ channel.publish('exchange', 'routingKey', buffer, {",
                "+   headers: {",
                "+     'content-type': 'application/json'",
                "+   }",
                "+ });"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(observability.missing_mq_trace_violations) > 0
}

# TEST 10: Warning - Incomplete Trace Propagation
test_incomplete_trace_warning if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff_lines": [
                "+ const response = await fetch('https://api.example.com/data', {",
                "+   headers: {",
                "+     'x-trace-id': traceId",
                "+   }",
                "+ });"
            ]
        }],
        "pr_body_lines": []
    }
    
    count(observability.incomplete_trace_propagation_warnings) > 0
}

# TEST 11: Override - With Marker
test_override_with_marker if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff_lines": [
                "+ const response = await fetch('https://api.example.com/data', {",
                "+   headers: {",
                "+     'Content-Type': 'application/json'",
                "+   }",
                "+ });"
            ]
        }],
        "pr_body_lines": [
            "@override:trace-propagation",
            "Reason: Legacy API doesn't support trace headers"
        ]
    }
    
    # Should not deny when override present
    count(observability.deny) == 0
}

# TEST 12: Edge Case - Multiple Service Calls
test_multiple_service_calls if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff_lines": [
                "+ const traceId = this.requestContext.getTraceId();",
                "+ await this.serviceA.process(traceId, data);",
                "+ await this.serviceB.process(traceId, data);",
                "+ await this.serviceC.process(traceId, data);"
            ]
        }],
        "pr_body_lines": []
    }
    
    # Should pass - all service calls have traceId
    count(observability.missing_service_trace_violations) == 0
}

# TEST 13: Edge Case - Nested HTTP Calls
test_nested_http_calls if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff_lines": [
                "+ const traceContext = this.requestContext.getTraceContext();",
                "+ const headers = addTraceContextToHeaders({}, traceContext);",
                "+ const response1 = await fetch('https://api1.com/data', { headers });",
                "+ const response2 = await fetch('https://api2.com/data', { headers });"
            ]
        }],
        "pr_body_lines": []
    }
    
    # Should pass - both HTTP calls use trace utility
    count(observability.missing_http_trace_violations) == 0
}

# TEST 14: Edge Case - Database Wrapper Function
test_database_wrapper_function if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff_lines": [
                "+ await withTraceContext(traceId, async () => {",
                "+   return this.prisma.user.findMany({ where: { tenantId } });",
                "+ });"
            ]
        }],
        "pr_body_lines": []
    }
    
    # Should pass - using trace context wrapper
    count(observability.missing_db_trace_violations) == 0
}

# TEST 15: Edge Case - Message Queue with Metadata
test_message_queue_metadata if {
    input := {
        "files": [{
            "path": "apps/api/src/events/event-publisher.service.ts",
            "diff_lines": [
                "+ producer.send({",
                "+   topic: 'events',",
                "+   messages: [{",
                "+     value: JSON.stringify(data),",
                "+     headers: {",
                "+       'trace-id': traceId,",
                "+       'span-id': spanId",
                "+     }",
                "+   }]",
                "+ });"
            ]
        }],
        "pr_body_lines": []
    }
    
    # Should pass - message includes trace headers
    count(observability.missing_mq_trace_violations) == 0
}



