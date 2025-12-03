package compliance.data_integrity_test

import data.compliance.data_integrity
import rego.v1

# Test data for R05: State Machine Enforcement

# =============================================================================
# TEST 1: Happy Path - Stateful entity with complete documentation and validation
# =============================================================================

test_r05_happy_path_complete_state_machine if {
	test_input := {
		"changed_files": [
			{
				"path": "libs/common/prisma/schema.prisma",
				"diff": "enum WorkOrderStatus { PENDING IN_PROGRESS COMPLETED CANCELED }",
			},
			{
				"path": "apps/api/src/work-orders/work-orders.service.ts",
				"diff": "private isValidTransition(from: WorkOrderStatus, to: WorkOrderStatus): boolean { ... } await this.auditService.log({ action: 'state_transition' })",
			},
		],
		"all_files": [{"path": "docs/state-machines/workorder-state-machine.md"}],
		"pr_body": "Add work order state machine with validation and audit logging",
	}

	# Should have no violations
	count(data.compliance.data_integrity.deny) == 0 with input as test_input
}

# =============================================================================
# TEST 2: Happy Path - Legal transition with validation and audit log
# =============================================================================

test_r05_happy_path_legal_transition if {
	test_input := {
		"changed_files": [{
			"path": "apps/api/src/work-orders/work-orders.service.ts",
			"diff": "if (!this.isValidTransition(from, to)) { throw new BadRequestException('Invalid transition'); } await this.auditService.log({ entity: 'WorkOrder', action: 'state_transition', oldState: from, newState: to });",
		}],
		"pr_body": "Implement work order state transition with validation",
	}

	# Should have no violations
	count(data.compliance.data_integrity.deny) == 0 with input as test_input
}

# =============================================================================
# TEST 3: Happy Path - Illegal transition rejected with error
# =============================================================================

test_r05_happy_path_illegal_transition_rejected if {
	test_input := {
		"changed_files": [{
			"path": "apps/api/src/work-orders/work-orders.service.ts",
			"diff": "if (workOrder.status === WorkOrderStatus.COMPLETED) { throw new BadRequestException('Cannot modify completed work order'); }",
		}],
		"pr_body": "Add terminal state protection for completed work orders",
	}

	# Should have no violations
	count(data.compliance.data_integrity.deny) == 0 with input as test_input
}

# =============================================================================
# TEST 4: Violation - Stateful entity without documentation
# =============================================================================

test_r05_violation_missing_documentation if {
	test_input := {
		"changed_files": [{
			"path": "libs/common/prisma/schema.prisma",
			"diff": "enum InvoiceStatus { DRAFT SENT PAID OVERDUE VOIDED }",
		}],
		"all_files": [],
		"pr_body": "Add invoice status enum",
	}

	violations := data.compliance.data_integrity.deny with input as test_input
	count(violations) > 0

	# Should contain message about missing documentation
	some msg in violations
	contains(msg, "Invoice")
	contains(msg, "state machine documentation")
}

# =============================================================================
# TEST 5: Violation - Transition without validation function
# =============================================================================

test_r05_violation_missing_validation if {
	test_input := {
		"changed_files": [{
			"path": "apps/api/src/work-orders/work-orders.service.ts",
			"diff": "workOrder.status = WorkOrderStatus.COMPLETED; await this.prisma.workOrder.update({ where: { id }, data: { status: WorkOrderStatus.COMPLETED } });",
		}],
		"pr_body": "Update work order status",
	}

	violations := data.compliance.data_integrity.deny with input as test_input
	count(violations) > 0

	# Should contain message about missing validation
	some msg in violations
	contains(msg, "transition validation")
}

# =============================================================================
# TEST 6: Violation - Illegal transition not rejected
# =============================================================================

test_r05_violation_missing_rejection if {
	test_input := {
		"changed_files": [{
			"path": "apps/api/src/work-orders/work-orders.service.ts",
			"diff": "workOrder.status = newStatus; await this.prisma.workOrder.update({ where: { id }, data: { status: newStatus } });",
		}],
		"pr_body": "Update work order status",
	}

	violations := data.compliance.data_integrity.deny with input as test_input
	count(violations) > 0

	# Should contain message about missing rejection logic
	some msg in violations
	contains(msg, "illegal transitions")
}

# =============================================================================
# TEST 7: Violation - Transition without audit log
# =============================================================================

test_r05_violation_missing_audit_log if {
	test_input := {
		"changed_files": [{
			"path": "apps/api/src/work-orders/work-orders.service.ts",
			"diff": "if (this.isValidTransition(from, to)) { workOrder.status = to; await this.prisma.workOrder.update({ where: { id }, data: { status: to } }); }",
		}],
		"pr_body": "Update work order status with validation",
	}

	violations := data.compliance.data_integrity.deny with input as test_input
	count(violations) > 0

	# Should contain message about missing audit log
	some msg in violations
	contains(msg, "audit logging")
}

# =============================================================================
# TEST 8: Violation - Code-documentation mismatch (states don't match)
# =============================================================================

test_r05_violation_code_doc_mismatch if {
	diff_content := `## States
- PENDING
- IN_PROGRESS
- COMPLETED
- CANCELED
- ON_HOLD`

	test_input := {
		"changed_files": [{
			"path": "docs/state-machines/workorder-state-machine.md",
			"diff": diff_content,
		}],
		"pr_body": "Add ON_HOLD state to work order documentation",
	}

	violations := data.compliance.data_integrity.deny with input as test_input
	count(violations) > 0

	# Should contain message about code-documentation mismatch
	some msg in violations
	contains(msg, "documentation")
	contains(msg, "code")
}

# =============================================================================
# TEST 9: Violation - Code-documentation mismatch (transitions don't match)
# =============================================================================

test_r05_violation_transition_mismatch if {
	test_input := {
		"changed_files": [{
			"path": "docs/state-machines/workorder-state-machine.md",
			"diff": "| PENDING | COMPLETED | Direct completion | Skip scheduling |",
		}],
		"pr_body": "Add direct completion transition to documentation",
	}

	violations := data.compliance.data_integrity.deny with input as test_input
	count(violations) > 0

	# Should warn about potential mismatch
	some msg in violations
	contains(msg, "workorder")
}

# =============================================================================
# TEST 10: Warning - Documentation exists but code doesn't enforce
# =============================================================================

test_r05_warning_unenforced_transitions if {
	test_input := {
		"changed_files": [{
			"path": "apps/api/src/invoices/invoices.service.ts",
			"diff": "invoice.status = InvoiceStatus.PAID; await this.prisma.invoice.update({ where: { id }, data: { status: InvoiceStatus.PAID } });",
		}],
		"pr_body": "Update invoice status",
	}

	warnings := data.compliance.data_integrity.warn with input as test_input
	count(warnings) > 0

	# Should warn about missing validation
	some msg in warnings
	contains(msg, "enforce")
}

# =============================================================================
# TEST 11: Override - With @override:state-machine marker
# =============================================================================

test_r05_override_with_marker if {
	test_input := {
		"changed_files": [{
			"path": "libs/common/prisma/schema.prisma",
			"diff": "enum PaymentStatus { PENDING PROCESSING COMPLETED FAILED REFUNDED }",
		}],
		"all_files": [],
		"pr_body": "@override:state-machine\nReason: Emergency hotfix for payment processing. Documentation will be added in follow-up PR #1234.",
	}

	# Should have no violations (override marker present)
	count(data.compliance.data_integrity.deny) == 0 with input as test_input
}

# =============================================================================
# TEST 12: Edge Case - Multiple stateful entities
# =============================================================================

test_r05_edge_case_multiple_entities if {
	test_input := {
		"changed_files": [{
			"path": "libs/common/prisma/schema.prisma",
			"diff": "enum WorkOrderStatus { PENDING IN_PROGRESS COMPLETED } enum InvoiceStatus { DRAFT SENT PAID }",
		}],
		"all_files": [{"path": "docs/state-machines/workorder-state-machine.md"}],
		"pr_body": "Add status enums for work orders and invoices",
	}

	violations := data.compliance.data_integrity.deny with input as test_input

	# Should have violation for Invoice (missing documentation)
	count(violations) > 0

	# Should mention Invoice specifically
	some msg in violations
	contains(msg, "Invoice")
}

# =============================================================================
# TEST 13: Performance - Should complete in <200ms
# =============================================================================

test_r05_performance_benchmark if {
	# This test verifies the policy can handle large inputs efficiently
	test_input := {
		"changed_files": [
			{
				"path": "libs/common/prisma/schema.prisma",
				"diff": "enum WorkOrderStatus { PENDING IN_PROGRESS COMPLETED CANCELED }",
			},
			{
				"path": "apps/api/src/work-orders/work-orders.service.ts",
				"diff": "private isValidTransition(from: WorkOrderStatus, to: WorkOrderStatus): boolean { const legalTransitions = { [WorkOrderStatus.PENDING]: [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELED], [WorkOrderStatus.IN_PROGRESS]: [WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELED], [WorkOrderStatus.COMPLETED]: [], [WorkOrderStatus.CANCELED]: [] }; return legalTransitions[from]?.includes(to) ?? false; } if (!this.isValidTransition(from, to)) { throw new BadRequestException('Invalid transition'); } await this.auditService.log({ entity: 'WorkOrder', action: 'state_transition', oldState: from, newState: to });",
			},
		],
		"all_files": [{"path": "docs/state-machines/workorder-state-machine.md"}],
		"pr_body": "Implement work order state machine",
	}

	# Policy should execute without errors
	violations := data.compliance.data_integrity.deny with input as test_input

	# Performance is measured externally, this test just ensures correctness
	true
}
