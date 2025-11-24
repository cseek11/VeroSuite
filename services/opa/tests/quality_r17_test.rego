package quality_test

import future.keywords.in
import data.verofield.quality

# ============================================================================
# R17: Coverage Requirements Tests
# ============================================================================

# Test 1: No violations (happy path)
test_r17_no_violations if {
    result := quality.warn with input as {
        "files": [
            {"path": "src/user.service.ts", "status": "modified"}
        ],
        "coverage_baseline": {
            "src/user.service.ts": 85
        },
        "coverage_current": {
            "src/user.service.ts": 87
        },
        "coverage_targets": {
            "src/user.service.ts": 80
        },
        "coverage_exemptions": [],
        "coverage_gaps": [],
        "coverage_history": {
            "src/user.service.ts": [
                {"date": "2025-11-01", "coverage": {"statements": 85}},
                {"date": "2025-11-23", "coverage": {"statements": 87}}
            ]
        },
        "coverage_report_generated": true
    }
    
    count([msg | msg := result[_]; contains(msg, "R17")]) == 0
}

# Test 2: R17-W01 - Coverage degradation detected
test_r17_w01_coverage_degradation if {
    result := quality.warn with input as {
        "files": [
            {"path": "src/payment.service.ts", "status": "modified"}
        ],
        "coverage_baseline": {
            "src/payment.service.ts": 90
        },
        "coverage_current": {
            "src/payment.service.ts": 80
        },
        "coverage_targets": {},
        "coverage_exemptions": [],
        "coverage_gaps": [],
        "coverage_history": {},
        "coverage_report_generated": true
    }
    
    some msg in result
    contains(msg, "R17")
    contains(msg, "Coverage degraded")
    contains(msg, "payment.service.ts")
    contains(msg, "Baseline: 90%")
    contains(msg, "Current: 80%")
}

# Test 3: R17-W02 - Coverage exemption expired
test_r17_w02_exemption_expired if {
    result := quality.warn with input as {
        "files": [],
        "coverage_baseline": {},
        "coverage_current": {},
        "coverage_targets": {},
        "coverage_exemptions": [
            {
                "file": "src/legacy.service.ts",
                "coverage": "45%",
                "justification": "Legacy code",
                "expiration": "2025-01-01T00:00:00Z",
                "remediation": "Refactor in Q2",
                "status": "Active"
            }
        ],
        "coverage_gaps": [],
        "coverage_history": {},
        "coverage_report_generated": true
    }
    
    some msg in result
    contains(msg, "R17")
    contains(msg, "Coverage exemption expired")
    contains(msg, "legacy.service.ts")
}

# Test 4: R17-W03 - Coverage exemption missing justification
test_r17_w03_missing_justification if {
    result := quality.warn with input as {
        "files": [],
        "coverage_baseline": {},
        "coverage_current": {},
        "coverage_targets": {},
        "coverage_exemptions": [
            {
                "file": "src/test.service.ts",
                "coverage": "50%",
                "expiration": "2025-12-31T00:00:00Z",
                "remediation": "Improve tests",
                "status": "Active"
            }
        ],
        "coverage_gaps": [],
        "coverage_history": {},
        "coverage_report_generated": true
    }
    
    some msg in result
    contains(msg, "R17")
    contains(msg, "missing justification")
    contains(msg, "test.service.ts")
}

# Test 5: R17-W04 - Coverage exemption missing remediation plan
test_r17_w04_missing_remediation if {
    result := quality.warn with input as {
        "files": [],
        "coverage_baseline": {},
        "coverage_current": {},
        "coverage_targets": {},
        "coverage_exemptions": [
            {
                "file": "src/old.service.ts",
                "coverage": "40%",
                "justification": "Old code",
                "expiration": "2025-12-31T00:00:00Z",
                "status": "Active"
            }
        ],
        "coverage_gaps": [],
        "coverage_history": {},
        "coverage_report_generated": true
    }
    
    some msg in result
    contains(msg, "R17")
    contains(msg, "missing remediation plan")
    contains(msg, "old.service.ts")
}

# Test 6: R17-W05 - Coverage below target without exemption
test_r17_w05_below_target_no_exemption if {
    result := quality.warn with input as {
        "files": [
            {"path": "src/auth.service.ts", "status": "modified"}
        ],
        "coverage_baseline": {},
        "coverage_current": {
            "src/auth.service.ts": 75
        },
        "coverage_targets": {
            "src/auth.service.ts": 90
        },
        "coverage_exemptions": [],
        "coverage_gaps": [],
        "coverage_history": {},
        "coverage_report_generated": true
    }
    
    some msg in result
    contains(msg, "R17")
    contains(msg, "Coverage below target")
    contains(msg, "auth.service.ts")
    contains(msg, "Current: 75%")
    contains(msg, "Target: 90%")
}

# Test 7: R17-W06 - Coverage gap identified (critical code)
test_r17_w06_critical_gap if {
    result := quality.warn with input as {
        "files": [],
        "coverage_baseline": {},
        "coverage_current": {},
        "coverage_targets": {},
        "coverage_exemptions": [],
        "coverage_gaps": [
            {
                "file": "src/payment.service.ts",
                "coverage": 70,
                "target": 90,
                "gap": 20,
                "code_type": "critical",
                "impact": "high",
                "priority": "high",
                "estimated_effort": "4 hours"
            }
        ],
        "coverage_history": {},
        "coverage_report_generated": true
    }
    
    some msg in result
    contains(msg, "R17")
    contains(msg, "High-priority coverage gap")
    contains(msg, "critical code")
    contains(msg, "payment.service.ts")
}

# Test 8: R17-W07 - Coverage trend not tracked
test_r17_w07_trend_not_tracked if {
    result := quality.warn with input as {
        "files": [
            {"path": "src/new.service.ts", "status": "modified"}
        ],
        "coverage_baseline": {},
        "coverage_current": {},
        "coverage_targets": {},
        "coverage_exemptions": [],
        "coverage_gaps": [],
        "coverage_history": {},
        "coverage_report_generated": true
    }
    
    some msg in result
    contains(msg, "R17")
    contains(msg, "Coverage trend not tracked")
    contains(msg, "new.service.ts")
}

# Test 9: R17-W08 - Coverage report not generated
test_r17_w08_report_not_generated if {
    result := quality.warn with input as {
        "files": [],
        "coverage_baseline": {},
        "coverage_current": {},
        "coverage_targets": {},
        "coverage_exemptions": [],
        "coverage_gaps": [],
        "coverage_history": {},
        "coverage_report_generated": false
    }
    
    some msg in result
    contains(msg, "R17")
    contains(msg, "Enhanced coverage report not generated")
}

# Test 10: Coverage below target WITH exemption (no warning)
test_r17_exemption_suppresses_warning if {
    result := quality.warn with input as {
        "files": [
            {"path": "src/legacy.service.ts", "status": "modified"}
        ],
        "coverage_baseline": {},
        "coverage_current": {
            "src/legacy.service.ts": 50
        },
        "coverage_targets": {
            "src/legacy.service.ts": 80
        },
        "coverage_exemptions": [
            {
                "file": "src/legacy.service.ts",
                "coverage": "50%",
                "justification": "Legacy code",
                "expiration": "2025-12-31T00:00:00Z",
                "remediation": "Refactor in Q2",
                "status": "Active"
            }
        ],
        "coverage_gaps": [],
        "coverage_history": {},
        "coverage_report_generated": true
    }
    
    # Should not warn about coverage below target (exemption exists)
    count([msg | msg := result[_]; contains(msg, "R17"); contains(msg, "Coverage below target")]) == 0
}

# Test 11: Multiple violations
test_r17_multiple_violations if {
    result := quality.warn with input as {
        "files": [
            {"path": "src/user.service.ts", "status": "modified"}
        ],
        "coverage_baseline": {
            "src/user.service.ts": 90
        },
        "coverage_current": {
            "src/user.service.ts": 80
        },
        "coverage_targets": {
            "src/user.service.ts": 85
        },
        "coverage_exemptions": [
            {
                "file": "src/legacy.service.ts",
                "coverage": "40%",
                "expiration": "2025-01-01T00:00:00Z",
                "status": "Active"
            }
        ],
        "coverage_gaps": [
            {
                "file": "src/payment.service.ts",
                "coverage": 70,
                "target": 90,
                "gap": 20,
                "code_type": "critical",
                "impact": "high",
                "priority": "high",
                "estimated_effort": "4 hours"
            }
        ],
        "coverage_history": {},
        "coverage_report_generated": false
    }
    
    r17_warnings := [msg | msg := result[_]; contains(msg, "R17")]
    count(r17_warnings) >= 4  # Should have multiple R17 warnings
}

# Test 12: Edge case - Empty input
test_r17_empty_input if {
    result := quality.warn with input as {
        "files": [],
        "coverage_baseline": {},
        "coverage_current": {},
        "coverage_targets": {},
        "coverage_exemptions": [],
        "coverage_gaps": [],
        "coverage_history": {},
        "coverage_report_generated": true
    }
    
    # Should not crash, may have some warnings
    is_set(result)
}

# Test 13: Coverage improvement (no degradation warning)
test_r17_coverage_improvement if {
    result := quality.warn with input as {
        "files": [
            {"path": "src/improved.service.ts", "status": "modified"}
        ],
        "coverage_baseline": {
            "src/improved.service.ts": 75
        },
        "coverage_current": {
            "src/improved.service.ts": 85
        },
        "coverage_targets": {},
        "coverage_exemptions": [],
        "coverage_gaps": [],
        "coverage_history": {},
        "coverage_report_generated": true
    }
    
    # Should not warn about degradation (coverage improved)
    count([msg | msg := result[_]; contains(msg, "R17"); contains(msg, "degraded")]) == 0
}

# Test 14: Minor degradation (below threshold)
test_r17_minor_degradation_ok if {
    result := quality.warn with input as {
        "files": [
            {"path": "src/minor.service.ts", "status": "modified"}
        ],
        "coverage_baseline": {
            "src/minor.service.ts": 85
        },
        "coverage_current": {
            "src/minor.service.ts": 83
        },
        "coverage_targets": {},
        "coverage_exemptions": [],
        "coverage_gaps": [],
        "coverage_history": {},
        "coverage_report_generated": true
    }
    
    # Should not warn (degradation < 5%)
    count([msg | msg := result[_]; contains(msg, "R17"); contains(msg, "degraded")]) == 0
}

# Test 15: Non-critical gap (lower priority)
test_r17_non_critical_gap if {
    result := quality.warn with input as {
        "files": [],
        "coverage_baseline": {},
        "coverage_current": {},
        "coverage_targets": {},
        "coverage_exemptions": [],
        "coverage_gaps": [
            {
                "file": "src/util.service.ts",
                "coverage": 70,
                "target": 80,
                "gap": 10,
                "code_type": "non-critical",
                "impact": "low",
                "priority": "low",
                "estimated_effort": "2 hours"
            }
        ],
        "coverage_history": {},
        "coverage_report_generated": true
    }
    
    # Should not warn about non-critical gaps (only high-priority critical gaps trigger R17-W06)
    count([msg | msg := result[_]; contains(msg, "R17"); contains(msg, "High-priority coverage gap")]) == 0
}

