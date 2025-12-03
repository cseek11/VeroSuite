package compliance.ux_test

import data.compliance.ux
import rego.v1

# ============================================================================
# R19: Accessibility Requirements Tests
# ============================================================================

# Test: R19-W01 - Missing ARIA labels on interactive elements
test_r19_w01_missing_aria_labels if {
	result := ux.warn with input as {
		"ui_components": [{
			"path": "frontend/src/components/Button.tsx",
			"has_interactive_element": true,
			"has_visible_text": false,
			"has_aria_label": false,
			"has_aria_labelledby": false,
		}],
		"accessibility_exemptions": [],
	}

	some warning in result
	contains(warning, "WARNING [UX/R19]: Component frontend/src/components/Button.tsx has interactive element without ARIA label")
	contains(warning, "WCAG AA 4.1.2")
}

# Test: R19-W01 - No warning if ARIA label exists
test_r19_w01_no_warning_if_aria_label_exists if {
	result := ux.warn with input as {
		"ui_components": [{
			"path": "frontend/src/components/Button.tsx",
			"has_interactive_element": true,
			"has_visible_text": false,
			"has_aria_label": true,
			"has_aria_labelledby": false,
		}],
		"accessibility_exemptions": [],
	}

	count([warning | some warning in result; contains(warning, "WARNING [UX/R19]: Component frontend/src/components/Button.tsx has interactive element without ARIA label")]) == 0
}

# Test: R19-W01 - No warning if exemption exists
test_r19_w01_no_warning_if_exemption_exists if {
	result := ux.warn with input as {
		"ui_components": [{
			"path": "frontend/src/components/Button.tsx",
			"has_interactive_element": true,
			"has_visible_text": false,
			"has_aria_label": false,
			"has_aria_labelledby": false,
		}],
		"accessibility_exemptions": [{
			"component": "frontend/src/components/Button.tsx",
			"issue": "Missing ARIA label",
			"expiration": "2026-12-31T00:00:00Z",
			"justification": "Legacy component",
			"remediation": "Add aria-label",
		}],
	}

	count([warning | some warning in result; contains(warning, "WARNING [UX/R19]: Component frontend/src/components/Button.tsx has interactive element without ARIA label")]) == 0
}

# Test: R19-W02 - Color contrast below WCAG AA (normal text)
test_r19_w02_color_contrast_below_wcag_aa_normal_text if {
	result := ux.warn with input as {
		"ui_components": [{
			"path": "frontend/src/components/Text.tsx",
			"contrast_ratio": 3.5,
			"is_large_text": false,
			"foreground_color": "#999999",
			"background_color": "#ffffff",
		}],
		"accessibility_exemptions": [],
	}

	some warning in result
	contains(warning, "WARNING [UX/R19]: Component frontend/src/components/Text.tsx has color contrast")
	contains(warning, "needs 4.5:1 for WCAG AA")
}

# Test: R19-W02 - Color contrast below WCAG AA (large text)
test_r19_w02_color_contrast_below_wcag_aa_large_text if {
	result := ux.warn with input as {
		"ui_components": [{
			"path": "frontend/src/components/Heading.tsx",
			"contrast_ratio": 2.5,
			"is_large_text": true,
			"foreground_color": "#cccccc",
			"background_color": "#ffffff",
		}],
		"accessibility_exemptions": [],
	}

	some warning in result
	contains(warning, "WARNING [UX/R19]: Component frontend/src/components/Heading.tsx has color contrast")
	contains(warning, "needs 3.0:1 for WCAG AA")
}

# Test: R19-W02 - No warning if contrast meets WCAG AA
test_r19_w02_no_warning_if_contrast_meets_wcag_aa if {
	result := ux.warn with input as {
		"ui_components": [{
			"path": "frontend/src/components/Text.tsx",
			"contrast_ratio": 5.0,
			"is_large_text": false,
			"foreground_color": "#333333",
			"background_color": "#ffffff",
		}],
		"accessibility_exemptions": [],
	}

	count([warning | some warning in result; contains(warning, "WARNING [UX/R19]: Component frontend/src/components/Text.tsx has color contrast")]) == 0
}

# Test: R19-W03 - Missing keyboard navigation
test_r19_w03_missing_keyboard_navigation if {
	result := ux.warn with input as {
		"ui_components": [{
			"path": "frontend/src/components/CustomButton.tsx",
			"has_mouse_only_interaction": true,
			"has_keyboard_support": false,
		}],
		"accessibility_exemptions": [],
	}

	some warning in result
	contains(warning, "WARNING [UX/R19]: Component frontend/src/components/CustomButton.tsx has mouse-only interactions without keyboard support")
	contains(warning, "WCAG AA 2.1.1")
}

# Test: R19-W03 - No warning if keyboard support exists
test_r19_w03_no_warning_if_keyboard_support_exists if {
	result := ux.warn with input as {
		"ui_components": [{
			"path": "frontend/src/components/CustomButton.tsx",
			"has_mouse_only_interaction": false,
			"has_keyboard_support": true,
		}],
		"accessibility_exemptions": [],
	}

	count([warning | some warning in result; contains(warning, "WARNING [UX/R19]: Component frontend/src/components/CustomButton.tsx has mouse-only interactions without keyboard support")]) == 0
}

# Test: R19-W04 - Missing focus indicators
test_r19_w04_missing_focus_indicators if {
	result := ux.warn with input as {
		"ui_components": [{
			"path": "frontend/src/components/Button.tsx",
			"has_interactive_element": true,
			"has_focus_indicator": false,
		}],
		"accessibility_exemptions": [],
	}

	some warning in result
	contains(warning, "WARNING [UX/R19]: Component frontend/src/components/Button.tsx has interactive elements without visible focus indicators")
	contains(warning, "WCAG AA 2.4.7")
}

# Test: R19-W04 - No warning if focus indicator exists
test_r19_w04_no_warning_if_focus_indicator_exists if {
	result := ux.warn with input as {
		"ui_components": [{
			"path": "frontend/src/components/Button.tsx",
			"has_interactive_element": true,
			"has_focus_indicator": true,
		}],
		"accessibility_exemptions": [],
	}

	count([warning | some warning in result; contains(warning, "WARNING [UX/R19]: Component frontend/src/components/Button.tsx has interactive elements without visible focus indicators")]) == 0
}

# Test: R19-W05 - Accessibility exemption expired
test_r19_w05_exemption_expired if {
	result := ux.warn with input as {
		"ui_components": [],
		"accessibility_exemptions": [{
			"component": "frontend/src/components/LegacyChart.tsx",
			"issue": "No keyboard nav",
			"expiration": "2024-01-01T00:00:00Z",
			"justification": "Legacy component",
			"remediation": "Migrate to AccessibleChart",
		}],
	}

	some warning in result
	contains(warning, "WARNING [UX/R19]: Accessibility exemption expired for frontend/src/components/LegacyChart.tsx")
	contains(warning, "Expiration: 2024-01-01T00:00:00Z")
}

# Test: R19-W05 - No warning if exemption not expired
test_r19_w05_no_warning_if_exemption_not_expired if {
	result := ux.warn with input as {
		"ui_components": [],
		"accessibility_exemptions": [{
			"component": "frontend/src/components/LegacyChart.tsx",
			"issue": "No keyboard nav",
			"expiration": "2026-12-31T00:00:00Z",
			"justification": "Legacy component",
			"remediation": "Migrate to AccessibleChart",
		}],
	}

	count([warning | some warning in result; contains(warning, "WARNING [UX/R19]: Accessibility exemption expired for frontend/src/components/LegacyChart.tsx")]) == 0
}

# Test: R19-W06 - Accessibility exemption missing justification
test_r19_w06_exemption_missing_justification if {
	result := ux.warn with input as {
		"ui_components": [],
		"accessibility_exemptions": [{
			"component": "frontend/src/components/AdminPanel.tsx",
			"issue": "Low contrast",
			"expiration": "2026-12-31T00:00:00Z",
			"justification": "",
			"remediation": "Update color palette",
		}],
	}

	some warning in result
	contains(warning, "WARNING [UX/R19]: Accessibility exemption for frontend/src/components/AdminPanel.tsx is missing justification")
}

# Test: R19-W07 - Accessibility exemption missing remediation plan
test_r19_w07_exemption_missing_remediation if {
	result := ux.warn with input as {
		"ui_components": [],
		"accessibility_exemptions": [{
			"component": "frontend/src/components/BetaFeature.tsx",
			"issue": "Missing ARIA",
			"expiration": "2026-03-31T00:00:00Z",
			"justification": "Beta, not production",
			"remediation": "",
		}],
	}

	some warning in result
	contains(warning, "WARNING [UX/R19]: Accessibility exemption for frontend/src/components/BetaFeature.tsx is missing remediation plan")
}

# Test: R19-W08 - High-priority accessibility issue identified (critical component)
test_r19_w08_high_priority_issue_critical_component if {
	result := ux.warn with input as {
		"ui_components": [],
		"accessibility_issues": [{
			"component": "frontend/src/components/auth/LoginForm.tsx",
			"description": "Missing form labels",
			"wcag_criteria": "WCAG AA 1.3.1",
			"severity": "high",
			"priority": "high",
			"impact": "Blocks login for screen reader users",
			"effort": "2 hours",
		}],
		"accessibility_exemptions": [],
	}

	some warning in result
	contains(warning, "WARNING [UX/R19]: High-priority accessibility issue: frontend/src/components/auth/LoginForm.tsx")
	contains(warning, "WCAG AA 1.3.1")
}

# Test: R19-W08 - High-priority accessibility issue identified (user-facing component)
test_r19_w08_high_priority_issue_user_facing if {
	result := ux.warn with input as {
		"ui_components": [],
		"accessibility_issues": [{
			"component": "frontend/src/components/dashboard/Dashboard.tsx",
			"description": "Missing focus indicators",
			"wcag_criteria": "WCAG AA 2.4.7",
			"severity": "high",
			"priority": "high",
			"impact": "Keyboard users cannot see focus",
			"effort": "1 hour",
		}],
		"accessibility_exemptions": [],
	}

	some warning in result
	contains(warning, "WARNING [UX/R19]: High-priority accessibility issue: frontend/src/components/dashboard/Dashboard.tsx")
}

# Test: R19-W09 - Accessibility report not generated
test_r19_w09_report_not_generated if {
	result := ux.warn with input as {
		"ui_components": [],
		"accessibility_exemptions": [],
		"accessibility_report_generated": false,
	}

	some warning in result
	contains(warning, "WARNING [UX/R19]: Enhanced accessibility report not generated")
	contains(warning, "check-accessibility.py --generate-report")
}

# Test: R19-W09 - No warning if report generated
test_r19_w09_no_warning_if_report_generated if {
	result := ux.warn with input as {
		"ui_components": [],
		"accessibility_exemptions": [],
		"accessibility_report_generated": true,
	}

	count([warning | some warning in result; contains(warning, "WARNING [UX/R19]: Enhanced accessibility report not generated")]) == 0
}

# Test: R19-W10 - Accessibility trend not tracked
test_r19_w10_trend_not_tracked if {
	result := ux.warn with input as {
		"ui_components": [{"path": "frontend/src/components/Button.tsx"}],
		"accessibility_exemptions": [],
		"accessibility_history": {},
	}

	some warning in result
	contains(warning, "WARNING [UX/R19]: Accessibility trend not tracked for frontend/src/components/Button.tsx")
	contains(warning, ".accessibility/history.json")
}

# Test: R19-W10 - No warning if trend tracked
test_r19_w10_no_warning_if_trend_tracked if {
	result := ux.warn with input as {
		"ui_components": [{"path": "frontend/src/components/Button.tsx"}],
		"accessibility_exemptions": [],
		"accessibility_history": {"frontend/src/components/Button.tsx": [{
			"date": "2025-11-23T00:00:00Z",
			"violations": [],
			"compliance_score": 95.0,
		}]},
	}

	count([warning | some warning in result; contains(warning, "WARNING [UX/R19]: Accessibility trend not tracked for frontend/src/components/Button.tsx")]) == 0
}

# Test: R19-W11 - Missing form labels
test_r19_w11_missing_form_labels if {
	result := ux.warn with input as {
		"ui_components": [{
			"path": "frontend/src/components/ContactForm.tsx",
			"has_form_input": true,
			"has_label": false,
			"has_aria_label": false,
			"has_aria_labelledby": false,
		}],
		"accessibility_exemptions": [],
	}

	some warning in result
	contains(warning, "WARNING [UX/R19]: Component frontend/src/components/ContactForm.tsx has form input without label")
	contains(warning, "WCAG AA 1.3.1, 4.1.2")
}

# Test: R19-W11 - No warning if label exists
test_r19_w11_no_warning_if_label_exists if {
	result := ux.warn with input as {
		"ui_components": [{
			"path": "frontend/src/components/ContactForm.tsx",
			"has_form_input": true,
			"has_label": true,
			"has_aria_label": false,
			"has_aria_labelledby": false,
		}],
		"accessibility_exemptions": [],
	}

	count([warning | some warning in result; contains(warning, "WARNING [UX/R19]: Component frontend/src/components/ContactForm.tsx has form input without label")]) == 0
}

# Test: R19-W12 - Missing focus trap in modal
test_r19_w12_missing_focus_trap if {
	result := ux.warn with input as {
		"ui_components": [{
			"path": "frontend/src/components/ConfirmDialog.tsx",
			"is_modal": true,
			"has_focus_trap": false,
		}],
		"accessibility_exemptions": [],
	}

	some warning in result
	contains(warning, "WARNING [UX/R19]: Component frontend/src/components/ConfirmDialog.tsx is a modal/dialog without focus trap")
	contains(warning, "WCAG AA 2.4.3")
}

# Test: R19-W12 - No warning if focus trap exists
test_r19_w12_no_warning_if_focus_trap_exists if {
	result := ux.warn with input as {
		"ui_components": [{
			"path": "frontend/src/components/ConfirmDialog.tsx",
			"is_modal": true,
			"has_focus_trap": true,
		}],
		"accessibility_exemptions": [],
	}

	count([warning | some warning in result; contains(warning, "WARNING [UX/R19]: Component frontend/src/components/ConfirmDialog.tsx is a modal/dialog without focus trap")]) == 0
}
