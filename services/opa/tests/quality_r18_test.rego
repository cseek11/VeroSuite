package compliance.quality_test

import data.compliance.quality
import rego.v1

# ============================================================================
# R18: Performance Budgets Tests
# ============================================================================

# Test: R18-W01 - API performance regression detected
test_r18_w01_api_performance_regression_detected if {
	result := quality.warn with input as {
		"api_endpoints": [{
			"path": "/api/users",
			"status": "modified",
		}],
		"performance_baseline": {"/api/users": {"p50": 150, "p95": 250, "p99": 300}},
		"performance_current": {"/api/users": {"p50": 180, "p95": 300, "p99": 400}},
	}

	some warning in result
	contains(warning, "WARNING [Quality/R18]: Performance regression for /api/users")
	contains(warning, "Baseline: 150ms, Current: 180ms (+20")
}

# Test: R18-W01 - No regression if performance improved
test_r18_w01_no_regression_if_improved if {
	result := quality.warn with input as {
		"api_endpoints": [{
			"path": "/api/users",
			"status": "modified",
		}],
		"performance_baseline": {"/api/users": {"p50": 200, "p95": 300, "p99": 400}},
		"performance_current": {"/api/users": {"p50": 180, "p95": 280, "p99": 350}},
	}

	count([warning | some warning in result; contains(warning, "WARNING [Quality/R18]: Performance regression")]) == 0
}

# Test: R18-W01 - No regression if degradation < 10%
test_r18_w01_no_regression_if_minor_degradation if {
	result := quality.warn with input as {
		"api_endpoints": [{
			"path": "/api/users",
			"status": "modified",
		}],
		"performance_baseline": {"/api/users": {"p50": 150, "p95": 250, "p99": 300}},
		"performance_current": {"/api/users": {"p50": 160, "p95": 270, "p99": 320}},
	}

	count([warning | some warning in result; contains(warning, "WARNING [Quality/R18]: Performance regression")]) == 0
}

# Test: R18-W02 - API endpoint exceeds budget without exemption
test_r18_w02_api_exceeds_budget_without_exemption if {
	result := quality.warn with input as {
		"api_endpoints": [{
			"path": "/api/users",
			"type": "simple_get",
		}],
		"performance_current": {"/api/users": {"p50": 250, "p95": 350, "p99": 450}},
		"performance_budgets": {"api": {"simple_get": 200}},
		"performance_exemptions": [],
	}

	some warning in result
	contains(warning, "WARNING [Quality/R18]: API endpoint /api/users exceeds budget")
	contains(warning, "Current: 250ms, Budget: 200ms")
}

# Test: R18-W02 - No warning if exemption exists
test_r18_w02_no_warning_if_exemption_exists if {
	result := quality.warn with input as {
		"api_endpoints": [{
			"path": "/api/reports",
			"type": "heavy_operations",
		}],
		"performance_current": {"/api/reports": {"p50": 600, "p95": 800, "p99": 1000}},
		"performance_budgets": {"api": {"heavy_operations": 500}},
		"performance_exemptions": [{
			"endpoint": "/api/reports",
			"justification": "Complex aggregation",
			"remediation": "Optimize query",
			"expiration": "2026-06-30T00:00:00Z",
		}],
	}

	count([warning | some warning in result; contains(warning, "WARNING [Quality/R18]: API endpoint /api/reports exceeds budget")]) == 0
}

# Test: R18-W03 - Frontend page exceeds FCP budget
test_r18_w03_frontend_exceeds_fcp_budget if {
	result := quality.warn with input as {
		"frontend_pages": [{"path": "/dashboard"}],
		"performance_current": {"/dashboard": {"fcp": 2.1, "lcp": 1.8, "tti": 2.5}},
		"performance_budgets": {"frontend": {
			"fcp": 1.5,
			"lcp": 2.0,
			"tti": 3.0,
		}},
		"performance_exemptions": [],
	}

	some warning in result
	contains(warning, "WARNING [Quality/R18]: Frontend page /dashboard exceeds FCP budget")
	contains(warning, "Current: 2.10s, Budget: 1.50s")
}

# Test: R18-W03 - No warning if within budget
test_r18_w03_no_warning_if_within_budget if {
	result := quality.warn with input as {
		"frontend_pages": [{"path": "/dashboard"}],
		"performance_current": {"/dashboard": {"fcp": 1.2, "lcp": 1.8, "tti": 2.5}},
		"performance_budgets": {"frontend": {
			"fcp": 1.5,
			"lcp": 2.0,
			"tti": 3.0,
		}},
		"performance_exemptions": [],
	}

	count([warning | some warning in result; contains(warning, "WARNING [Quality/R18]: Frontend page /dashboard exceeds FCP budget")]) == 0
}

# Test: R18-W04 - Performance exemption expired
test_r18_w04_exemption_expired if {
	result := quality.warn with input as {"performance_exemptions": [{
		"endpoint": "/api/legacy",
		"expiration": "2024-01-01T00:00:00Z",
		"justification": "Legacy code",
		"remediation": "Migrate to new endpoint",
	}]}

	some warning in result
	contains(warning, "WARNING [Quality/R18]: Performance exemption expired for /api/legacy")
	contains(warning, "Expiration: 2024-01-01T00:00:00Z")
}

# Test: R18-W04 - No warning if exemption not expired
test_r18_w04_no_warning_if_not_expired if {
	result := quality.warn with input as {"performance_exemptions": [{
		"endpoint": "/api/reports",
		"expiration": "2026-06-30T00:00:00Z",
		"justification": "Complex aggregation",
		"remediation": "Optimize query",
	}]}

	count([warning | some warning in result; contains(warning, "WARNING [Quality/R18]: Performance exemption expired")]) == 0
}

# Test: R18-W05 - Performance exemption missing justification
test_r18_w05_exemption_missing_justification if {
	result := quality.warn with input as {"performance_exemptions": [{
		"endpoint": "/api/reports",
		"expiration": "2026-06-30T00:00:00Z",
		"remediation": "Optimize query",
	}]}

	some warning in result
	contains(warning, "WARNING [Quality/R18]: Performance exemption for /api/reports is missing justification")
}

# Test: R18-W06 - Performance exemption missing remediation plan
test_r18_w06_exemption_missing_remediation if {
	result := quality.warn with input as {"performance_exemptions": [{
		"endpoint": "/api/reports",
		"expiration": "2026-06-30T00:00:00Z",
		"justification": "Complex aggregation",
	}]}

	some warning in result
	contains(warning, "WARNING [Quality/R18]: Performance exemption for /api/reports is missing remediation plan")
}

# Test: R18-W07 - High-priority performance issue identified
test_r18_w07_high_priority_issue if {
	result := quality.warn with input as {"performance_issues": [{
		"endpoint": "/api/auth/login",
		"current": 350,
		"budget": 300,
		"priority": "high",
		"criticality": "critical",
		"impact": "high",
		"effort": "2 hours",
	}]}

	some warning in result
	contains(warning, "WARNING [Quality/R18]: High-priority performance issue: /api/auth/login")
	contains(warning, "Current: 350ms, Budget: 300ms")
	contains(warning, "Criticality: critical, Impact: high")
}

# Test: R18-W07 - No warning for low-priority issues
test_r18_w07_no_warning_for_low_priority if {
	result := quality.warn with input as {"performance_issues": [{
		"endpoint": "/api/utils/helper",
		"current": 250,
		"budget": 200,
		"priority": "low",
		"criticality": "non-critical",
		"impact": "low",
		"effort": "1 hour",
	}]}

	count([warning | some warning in result; contains(warning, "WARNING [Quality/R18]: High-priority performance issue")]) == 0
}

# Test: R18-W08 - Performance trend not tracked
test_r18_w08_trend_not_tracked if {
	result := quality.warn with input as {
		"api_endpoints": [{
			"path": "/api/users",
			"status": "modified",
		}],
		"performance_history": {},
	}

	some warning in result
	contains(warning, "WARNING [Quality/R18]: Performance trend not tracked for /api/users")
	contains(warning, "Add performance history to .performance/history.json")
}

# Test: R18-W08 - No warning if trend tracked
test_r18_w08_no_warning_if_tracked if {
	result := quality.warn with input as {
		"api_endpoints": [{
			"path": "/api/users",
			"status": "modified",
		}],
		"performance_history": {"/api/users": [
			{"date": "2025-11-30", "p50": 150},
			{"date": "2025-11-30", "p50": 160},
		]},
	}

	count([warning | some warning in result; contains(warning, "WARNING [Quality/R18]: Performance trend not tracked for /api/users")]) == 0
}

# Test: R18-W09 - Performance report not generated
test_r18_w09_report_not_generated if {
	result := quality.warn with input as {"performance_report_generated": false}

	some warning in result
	contains(warning, "WARNING [Quality/R18]: Enhanced performance report not generated")
	contains(warning, "python .cursor/scripts/check-performance-budgets.py --generate-report")
}

# Test: R18-W09 - No warning if report generated
test_r18_w09_no_warning_if_generated if {
	result := quality.warn with input as {"performance_report_generated": true}

	count([warning | some warning in result; contains(warning, "WARNING [Quality/R18]: Enhanced performance report not generated")]) == 0
}

# Test: R18-W10 - Critical endpoint performance degradation
test_r18_w10_critical_endpoint_degradation if {
	result := quality.warn with input as {
		"api_endpoints": [{
			"path": "/api/auth/login",
			"criticality": "critical",
		}],
		"performance_baseline": {"/api/auth/login": {"p50": 200, "p95": 300, "p99": 400}},
		"performance_current": {"/api/auth/login": {"p50": 250, "p95": 400, "p99": 500}},
	}

	some warning in result
	contains(warning, "WARNING [Quality/R18]: CRITICAL endpoint /api/auth/login performance degraded significantly")
	contains(warning, "Baseline: 200ms, Current: 250ms (+25")
	contains(warning, "Immediate attention required")
}

# Test: R18-W10 - No warning if degradation < 20%
test_r18_w10_no_warning_if_minor_degradation if {
	result := quality.warn with input as {
		"api_endpoints": [{
			"path": "/api/auth/login",
			"criticality": "critical",
		}],
		"performance_baseline": {"/api/auth/login": {"p50": 200, "p95": 300, "p99": 400}},
		"performance_current": {"/api/auth/login": {"p50": 220, "p95": 330, "p99": 440}},
	}

	count([warning | some warning in result; contains(warning, "WARNING [Quality/R18]: CRITICAL endpoint /api/auth/login performance degraded significantly")]) == 0
}

# Test: Edge case - Empty input
test_r18_edge_case_empty_input if {
	result := quality.warn with input as {}

	# Should not crash, may have warnings about missing data
	is_set(result)
}

# Test: Edge case - Missing baseline data
test_r18_edge_case_missing_baseline if {
	result := quality.warn with input as {
		"api_endpoints": [{
			"path": "/api/new-endpoint",
			"status": "added",
		}],
		"performance_current": {"/api/new-endpoint": {"p50": 180, "p95": 280, "p99": 380}},
	}

	# Should not crash when baseline is missing
	is_set(result)
}

# Test: Edge case - Multiple violations
test_r18_edge_case_multiple_violations if {
	result := quality.warn with input as {
		"api_endpoints": [
			{
				"path": "/api/users",
				"type": "simple_get",
			},
			{
				"path": "/api/orders",
				"type": "typical_post_put",
			},
		],
		"performance_current": {
			"/api/users": {"p50": 250, "p95": 350, "p99": 450},
			"/api/orders": {"p50": 400, "p95": 550, "p99": 700},
		},
		"performance_budgets": {"api": {
			"simple_get": 200,
			"typical_post_put": 300,
		}},
		"performance_exemptions": [],
	}

	# Should detect both violations
	violations := [warning |
		some warning in result
		contains(warning, "WARNING [Quality/R18]: API endpoint")
		contains(warning, "exceeds budget")
	]

	count(violations) == 2
}
