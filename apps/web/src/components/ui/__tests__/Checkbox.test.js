"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Checkbox Component Tests
 *
 * Tests for the Checkbox component including:
 * - Check/uncheck functionality
 * - Indeterminate state
 * - Disabled state
 * - Error handling
 * - Helper text
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var Checkbox_1 = __importDefault(require("../Checkbox"));
(0, vitest_1.describe)('Checkbox', function () {
    var mockOnChange = vitest_1.vi.fn();
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Rendering', function () {
        (0, vitest_1.it)('should render checkbox', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Checkbox_1.default, { onChange: mockOnChange }));
            var checkbox = react_1.screen.getByRole('checkbox');
            (0, vitest_1.expect)(checkbox).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render label when provided', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Checkbox_1.default, { label: "Checkbox Label", onChange: mockOnChange }));
            (0, vitest_1.expect)(react_1.screen.getByText('Checkbox Label')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render error message when error prop is provided', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Checkbox_1.default, { onChange: mockOnChange, error: "This field is required" }));
            (0, vitest_1.expect)(react_1.screen.getByText('This field is required')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render helper text when helperText prop is provided', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Checkbox_1.default, { onChange: mockOnChange, helperText: "Please check this box" }));
            (0, vitest_1.expect)(react_1.screen.getByText('Please check this box')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Check/Uncheck Functionality', function () {
        (0, vitest_1.it)('should call onChange with true when checked', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Checkbox_1.default, { onChange: mockOnChange }));
            var checkbox = react_1.screen.getByRole('checkbox');
            react_1.fireEvent.click(checkbox);
            (0, vitest_1.expect)(mockOnChange).toHaveBeenCalledWith(true);
        });
        (0, vitest_1.it)('should call onChange with false when unchecked', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Checkbox_1.default, { checked: true, onChange: mockOnChange }));
            var checkbox = react_1.screen.getByRole('checkbox');
            react_1.fireEvent.click(checkbox);
            (0, vitest_1.expect)(mockOnChange).toHaveBeenCalledWith(false);
        });
        (0, vitest_1.it)('should update checked state', function () {
            var rerender = (0, react_1.render)((0, jsx_runtime_1.jsx)(Checkbox_1.default, { checked: false, onChange: mockOnChange })).rerender;
            var checkbox = react_1.screen.getByRole('checkbox');
            (0, vitest_1.expect)(checkbox.checked).toBe(false);
            rerender((0, jsx_runtime_1.jsx)(Checkbox_1.default, { checked: true, onChange: mockOnChange }));
            checkbox = react_1.screen.getByRole('checkbox');
            (0, vitest_1.expect)(checkbox.checked).toBe(true);
        });
    });
    (0, vitest_1.describe)('Indeterminate State', function () {
        (0, vitest_1.it)('should support indeterminate state', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Checkbox_1.default, { indeterminate: true, onChange: mockOnChange }));
            var checkbox = react_1.screen.getByRole('checkbox');
            (0, vitest_1.expect)(checkbox.indeterminate).toBe(true);
        });
    });
    (0, vitest_1.describe)('Disabled State', function () {
        (0, vitest_1.it)('should disable checkbox when disabled prop is true', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Checkbox_1.default, { disabled: true, onChange: mockOnChange }));
            var checkbox = react_1.screen.getByRole('checkbox');
            (0, vitest_1.expect)(checkbox).toBeDisabled();
        });
        (0, vitest_1.it)('should not call onChange when disabled', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Checkbox_1.default, { disabled: true, onChange: mockOnChange }));
            var checkbox = react_1.screen.getByRole('checkbox');
            react_1.fireEvent.click(checkbox);
            (0, vitest_1.expect)(mockOnChange).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)('Accessibility', function () {
        (0, vitest_1.it)('should have aria-invalid when error is present', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Checkbox_1.default, { onChange: mockOnChange, error: "Error message" }));
            var checkbox = react_1.screen.getByRole('checkbox');
            (0, vitest_1.expect)(checkbox).toHaveAttribute('aria-invalid', 'true');
        });
        (0, vitest_1.it)('should have aria-describedby when error or helperText is present', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Checkbox_1.default, { onChange: mockOnChange, error: "Error message" }));
            var checkbox = react_1.screen.getByRole('checkbox');
            (0, vitest_1.expect)(checkbox).toHaveAttribute('aria-describedby');
        });
    });
});
