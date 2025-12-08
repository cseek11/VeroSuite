"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Select Component Tests
 *
 * Tests for the Select component including:
 * - Option selection
 * - Search functionality
 * - Disabled states
 * - Error handling
 * - Helper text
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var Select_1 = __importDefault(require("../Select"));
(0, vitest_1.describe)('Select', function () {
    var mockOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3', disabled: true },
    ];
    var mockOnChange = vitest_1.vi.fn();
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Rendering', function () {
        (0, vitest_1.it)('should render select with options', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { options: mockOptions, onChange: mockOnChange }));
            (0, vitest_1.expect)(react_1.screen.getByText('Option 1')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Option 2')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Option 3')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render label when provided', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { label: "Select Option", options: mockOptions, onChange: mockOnChange }));
            (0, vitest_1.expect)(react_1.screen.getByText('Select Option')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render placeholder when provided', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { placeholder: "Choose an option", options: mockOptions, onChange: mockOnChange }));
            (0, vitest_1.expect)(react_1.screen.getByText('Choose an option')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render error message when error prop is provided', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { options: mockOptions, onChange: mockOnChange, error: "This field is required" }));
            (0, vitest_1.expect)(react_1.screen.getByText('This field is required')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render helper text when helperText prop is provided', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { options: mockOptions, onChange: mockOnChange, helperText: "Please select an option" }));
            (0, vitest_1.expect)(react_1.screen.getByText('Please select an option')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Option Selection', function () {
        (0, vitest_1.it)('should call onChange when option is selected', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { options: mockOptions, onChange: mockOnChange }));
            var select = react_1.screen.getByRole('combobox');
            react_1.fireEvent.change(select, { target: { value: 'option1' } });
            (0, vitest_1.expect)(mockOnChange).toHaveBeenCalledWith('option1');
        });
        (0, vitest_1.it)('should update value when option is selected', function () {
            var rerender = (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { options: mockOptions, onChange: mockOnChange, value: "option1" })).rerender;
            var select = react_1.screen.getByRole('combobox');
            (0, vitest_1.expect)(select.value).toBe('option1');
            rerender((0, jsx_runtime_1.jsx)(Select_1.default, { options: mockOptions, onChange: mockOnChange, value: "option2" }));
            (0, vitest_1.expect)(select.value).toBe('option2');
        });
        (0, vitest_1.it)('should disable options marked as disabled', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { options: mockOptions, onChange: mockOnChange }));
            react_1.screen.getByRole('combobox');
            var option3 = react_1.screen.getByText('Option 3').closest('option');
            (0, vitest_1.expect)(option3).toBeDisabled();
        });
    });
    (0, vitest_1.describe)('Disabled State', function () {
        (0, vitest_1.it)('should disable select when disabled prop is true', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { options: mockOptions, onChange: mockOnChange, disabled: true }));
            var select = react_1.screen.getByRole('combobox');
            (0, vitest_1.expect)(select).toBeDisabled();
        });
    });
    (0, vitest_1.describe)('Accessibility', function () {
        (0, vitest_1.it)('should have aria-invalid when error is present', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { options: mockOptions, onChange: mockOnChange, error: "Error message" }));
            var select = react_1.screen.getByRole('combobox');
            (0, vitest_1.expect)(select).toHaveAttribute('aria-invalid', 'true');
        });
        (0, vitest_1.it)('should have aria-describedby when error or helperText is present', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { options: mockOptions, onChange: mockOnChange, error: "Error message" }));
            var select = react_1.screen.getByRole('combobox');
            (0, vitest_1.expect)(select).toHaveAttribute('aria-describedby');
        });
    });
    (0, vitest_1.describe)('Regression Prevention: SELECT_UNDEFINED_OPTIONS - 2025-11-16', function () {
        // Pattern: SELECT_UNDEFINED_OPTIONS (see docs/error-patterns.md)
        // Test ensures the pattern doesn't regress - component should handle undefined/null options gracefully
        (0, vitest_1.it)('should not crash when options prop is undefined', function () {
            // This test prevents regression of the bug where Select crashed with
            // "Cannot read properties of undefined (reading 'map')"
            var container = (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { options: undefined, onChange: mockOnChange })).container;
            // Component should render error state instead of crashing
            (0, vitest_1.expect)(container.querySelector('select')).toBeDisabled();
            (0, vitest_1.expect)(react_1.screen.getByText(/invalid options provided/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not crash when options prop is null', function () {
            // Regression test: Component should handle null options
            var container = (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { options: null, onChange: mockOnChange })).container;
            // Component should render error state instead of crashing
            (0, vitest_1.expect)(container.querySelector('select')).toBeDisabled();
            (0, vitest_1.expect)(react_1.screen.getByText(/invalid options provided/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not crash when options prop is not an array', function () {
            // Regression test: Component should handle non-array values
            var container = (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { options: 'not an array', onChange: mockOnChange })).container;
            // Component should render error state instead of crashing
            (0, vitest_1.expect)(container.querySelector('select')).toBeDisabled();
            (0, vitest_1.expect)(react_1.screen.getByText(/invalid options provided/i)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render normally when options is an empty array', function () {
            // Edge case: Empty array should be valid
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { options: [], onChange: mockOnChange }));
            var select = react_1.screen.getByRole('combobox');
            (0, vitest_1.expect)(select).toBeInTheDocument();
            (0, vitest_1.expect)(select).not.toBeDisabled();
        });
        (0, vitest_1.it)('should handle async data loading scenario', function () {
            // Regression test: Component should handle options loaded asynchronously
            var rerender = (0, react_1.render)((0, jsx_runtime_1.jsx)(Select_1.default, { options: undefined, onChange: mockOnChange })).rerender;
            // Initially shows error state
            (0, vitest_1.expect)(react_1.screen.getByText(/invalid options provided/i)).toBeInTheDocument();
            // After data loads, should render normally
            rerender((0, jsx_runtime_1.jsx)(Select_1.default, { options: mockOptions, onChange: mockOnChange }));
            (0, vitest_1.expect)(react_1.screen.getByText('Option 1')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByText(/invalid options provided/i)).not.toBeInTheDocument();
        });
    });
});
