package compliance.observability_test

import rego.v1
import data.compliance.observability

# ============================================================================
# R09: TRACE PROPAGATION TESTS
# ============================================================================

# TEST 1: Happy Path - Proper HTTP Header Propagation
test_http_header_propagation_pass if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "+ const traceContext = this.requestContext.getTraceContext();\n+ const response = await fetch('https://api.example.com/data', {\n+   headers: {\n+     'x-trace-id': traceContext.traceId,\n+     'x-span-id': traceContext.spanId,\n+     'x-request-id': traceContext.requestId\n+   }\n+ });"
        }],
        "pr_body": ""
    }
    
    count(observability.missing_http_trace_violations) == 0 with input as test_input
}

# TEST 2: Happy Path - Using Trace Utility
test_trace_utility_pass if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "+ const traceContext = this.requestContext.getTraceContext();\n+ const headers = addTraceContextToHeaders({}, traceContext);\n+ const response = await fetch('https://api.example.com/data', { headers });"
        }],
        "pr_body": ""
    }
    
    count(observability.missing_http_trace_violations) == 0 with input as test_input
}

# TEST 3: Happy Path - Service-to-Service Propagation
test_service_propagation_pass if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "+ const traceId = this.requestContext.getTraceId();\n+ await this.downstreamService.process(traceId, data);"
        }],
        "pr_body": ""
    }
    
    count(observability.missing_service_trace_violations) == 0 with input as test_input
}

# TEST 4: Happy Path - Database Propagation
test_database_propagation_pass if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "+ const traceId = this.requestContext.getTraceId();\n+ await this.prisma.$executeRaw`\n+   SET LOCAL app.trace_id = ${traceId};\n+   SELECT * FROM users WHERE tenant_id = ${tenantId};\n+ `;"
        }],
        "pr_body": ""
    }
    
    count(observability.missing_db_trace_violations) == 0 with input as test_input
}

# TEST 5: Violation - Missing TraceId in HTTP Headers
test_missing_http_trace_violation if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "+ const response = await fetch('https://api.example.com/data', {\n+   headers: {\n+     'Content-Type': 'application/json'\n+   }\n+ });"
        }],
        "pr_body": ""
    }
    
    count(observability.missing_http_trace_violations) > 0 with input as test_input
}

# TEST 6: Violation - Missing TraceId in Service Call
test_missing_service_trace_violation if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "+ await this.downstreamService.process(data);"
        }],
        "pr_body": ""
    }
    
    count(observability.missing_service_trace_violations) > 0 with input as test_input
}

# TEST 7: Violation - Missing TraceId in Database Query
test_missing_db_trace_violation if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "+ await this.prisma.user.findMany({\n+   where: { tenantId }\n+ });"
        }],
        "pr_body": ""
    }
    
    count(observability.missing_db_trace_violations) > 0 with input as test_input
}

# TEST 8: Violation - Missing TraceId in External API Call
test_missing_external_trace_violation if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/integrations/external.service.ts",
            "diff": "+ const response = await axios.get('https://external-api.com/data', {\n+   headers: {\n+     'Authorization': `Bearer ${apiKey}`\n+   }\n+ });"
        }],
        "pr_body": ""
    }
    
    count(observability.missing_external_trace_violations) > 0 with input as test_input
}

# TEST 9: Violation - Missing TraceId in Message Queue
test_missing_mq_trace_violation if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/events/event-publisher.service.ts",
            "diff": "+ channel.publish('exchange', 'routingKey', buffer, {\n+   headers: {\n+     'content-type': 'application/json'\n+   }\n+ });"
        }],
        "pr_body": ""
    }
    
    count(observability.missing_mq_trace_violations) > 0 with input as test_input
}

# TEST 10: Warning - Incomplete Trace Propagation
test_incomplete_trace_warning if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "+ const response = await fetch('https://api.example.com/data', {\n+   headers: {\n+     'x-trace-id': traceId\n+   }\n+ });"
        }],
        "pr_body": ""
    }
    
    count(observability.incomplete_trace_propagation_warnings) > 0 with input as test_input
}

# TEST 11: Override - With Marker
test_override_with_marker if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "+ const response = await fetch('https://api.example.com/data', {\n+   headers: {\n+     'Content-Type': 'application/json'\n+   }\n+ });"
        }],
        "pr_body": "@override:trace-propagation\nReason: Legacy API doesn't support trace headers"
    }
    
    # Should not deny when override present
    count(observability.deny) == 0 with input as test_input
}

# TEST 12: Edge Case - Multiple Service Calls
test_multiple_service_calls if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "+ const traceId = this.requestContext.getTraceId();\n+ await this.serviceA.process(traceId, data);\n+ await this.serviceB.process(traceId, data);\n+ await this.serviceC.process(traceId, data);"
        }],
        "pr_body": ""
    }
    
    # Should pass - all service calls have traceId
    count(observability.missing_service_trace_violations) == 0 with input as test_input
}

# TEST 13: Edge Case - Nested HTTP Calls
test_nested_http_calls if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "+ const traceContext = this.requestContext.getTraceContext();\n+ const headers = addTraceContextToHeaders({}, traceContext);\n+ const response1 = await fetch('https://api1.com/data', { headers });\n+ const response2 = await fetch('https://api2.com/data', { headers });"
        }],
        "pr_body": ""
    }
    
    # Should pass - both HTTP calls use trace utility
    count(observability.missing_http_trace_violations) == 0 with input as test_input
}

# TEST 14: Edge Case - Database Wrapper Function
test_database_wrapper_function if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "+ await withTraceContext(traceId, async () => {\n+   return this.prisma.user.findMany({ where: { tenantId } });\n+ });"
        }],
        "pr_body": ""
    }
    
    # Should pass - using trace context wrapper
    count(observability.missing_db_trace_violations) == 0 with input as test_input
}

# TEST 15: Edge Case - Message Queue with Metadata
test_message_queue_metadata if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/events/event-publisher.service.ts",
            "diff": "+ producer.send({\n+   topic: 'events',\n+   messages: [{\n+     value: JSON.stringify(data),\n+     headers: {\n+       'trace-id': traceId,\n+       'span-id': spanId\n+     }\n+   }]\n+ });"
        }],
        "pr_body": ""
    }
    
    # Should pass - message includes trace headers
    count(observability.missing_mq_trace_violations) == 0 with input as test_input
}




