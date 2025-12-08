"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Textarea Component Tests
 *
 * Tests for the Textarea component including:
 * - Text input
 * - Character count
 * - Validation
 * - Error handling
 * - Helper text
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var Textarea_1 = __importDefault(require("../Textarea"));
(0, vitest_1.describe)('Textarea', function () {
    var mockOnChange = vitest_1.vi.fn();
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Rendering', function () {
        (0, vitest_1.it)('should render textarea', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Textarea_1.default, { onChange: mockOnChange }));
            var textarea = react_1.screen.getByRole('textbox');
            (0, vitest_1.expect)(textarea).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render label when provided', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Textarea_1.default, { label: "Description", onChange: mockOnChange }));
            (0, vitest_1.expect)(react_1.screen.getByText('Description')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render error message when error prop is provided', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Textarea_1.default, { onChange: mockOnChange, error: "This field is required" }));
            (0, vitest_1.expect)(react_1.screen.getByText('This field is required')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render helper text when helperText prop is provided', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Textarea_1.default, { onChange: mockOnChange, helperText: "Enter a description" }));
            (0, vitest_1.expect)(react_1.screen.getByText('Enter a description')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Text Input', function () {
        (0, vitest_1.it)('should update value when text is entered', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Textarea_1.default, { onChange: mockOnChange }));
            var textarea = react_1.screen.getByRole('textbox');
            react_1.fireEvent.change(textarea, { target: { value: 'Test text' } });
            (0, vitest_1.expect)(textarea).toHaveValue('Test text');
        });
        (0, vitest_1.it)('should call onChange when text is entered', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Textarea_1.default, { onChange: mockOnChange }));
            var textarea = react_1.screen.getByRole('textbox');
            react_1.fireEvent.change(textarea, { target: { value: 'Test text' } });
            (0, vitest_1.expect)(mockOnChange).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should respect rows prop', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Textarea_1.default, { rows: 5, onChange: mockOnChange }));
            var textarea = react_1.screen.getByRole('textbox');
            (0, vitest_1.expect)(textarea).toHaveAttribute('rows', '5');
        });
        (0, vitest_1.it)('should use default rows when not provided', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Textarea_1.default, { onChange: mockOnChange }));
            var textarea = react_1.screen.getByRole('textbox');
            (0, vitest_1.expect)(textarea).toHaveAttribute('rows', '3');
        });
    });
    (0, vitest_1.describe)('Disabled State', function () {
        (0, vitest_1.it)('should disable textarea when disabled prop is true', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Textarea_1.default, { disabled: true, onChange: mockOnChange }));
            var textarea = react_1.screen.getByRole('textbox');
            (0, vitest_1.expect)(textarea).toBeDisabled();
        });
    });
    (0, vitest_1.describe)('Accessibility', function () {
        (0, vitest_1.it)('should have aria-invalid when error is present', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Textarea_1.default, { onChange: mockOnChange, error: "Error message" }));
            var textarea = react_1.screen.getByRole('textbox');
            (0, vitest_1.expect)(textarea).toHaveAttribute('aria-invalid', 'true');
        });
        (0, vitest_1.it)('should have aria-describedby when error or helperText is present', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Textarea_1.default, { onChange: mockOnChange, error: "Error message" }));
            var textarea = react_1.screen.getByRole('textbox');
            (0, vitest_1.expect)(textarea).toHaveAttribute('aria-describedby');
        });
    });
});
