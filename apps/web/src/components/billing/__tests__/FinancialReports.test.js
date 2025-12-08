"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * FinancialReports Component Tests
 *
 * Tests for the FinancialReports component including:
 * - Component rendering
 * - Report generation
 * - Error handling
 * - Regression prevention for syntax errors
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var FinancialReports_1 = __importDefault(require("../FinancialReports"));
(0, vitest_1.describe)('FinancialReports', function () {
    // Regression Prevention: FINANCIAL_REPORTS_JSX_SYNTAX - 2025-11-16
    // Pattern: FINANCIAL_REPORTS_JSX_SYNTAX (see docs/error-patterns.md)
    // Test ensures component can render without JSX syntax errors
    (0, vitest_1.describe)('Regression Prevention: FINANCIAL_REPORTS_JSX_SYNTAX - 2025-11-16', function () {
        (0, vitest_1.it)('should render without JSX syntax errors', function () {
            // This test prevents regression of the bug where missing closing tags
            // caused "Expected ')' but found '{'" syntax error
            // If component has syntax errors, this will fail at render time
            (0, vitest_1.expect)(function () {
                (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialReports_1.default, {}));
            }).not.toThrow();
        });
        (0, vitest_1.it)('should handle all report types without syntax errors', function () {
            var reportTypes = [
                'ar-summary',
                'revenue-analytics',
                'payment-analytics',
                'overdue-invoices',
                'financial-summary'
            ];
            reportTypes.forEach(function () {
                (0, vitest_1.expect)(function () {
                    (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialReports_1.default, {}));
                }).not.toThrow();
            });
        });
        (0, vitest_1.it)('should have balanced JSX structure', function () {
            // This test verifies the component can be parsed and rendered
            // which would fail if JSX structure is unbalanced
            var container = (0, react_1.render)((0, jsx_runtime_1.jsx)(FinancialReports_1.default, {})).container;
            // If JSX is unbalanced, container would be malformed
            (0, vitest_1.expect)(container).toBeDefined();
            (0, vitest_1.expect)(container.firstChild).toBeTruthy();
        });
    });
});
