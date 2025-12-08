"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var test_utils_1 = require("../../test/setup/test-utils");
var vitest_1 = require("vitest");
var Input_1 = __importDefault(require("../ui/Input"));
var lucide_react_1 = require("lucide-react");
(0, vitest_1.describe)('Input', function () {
    (0, vitest_1.it)('renders with label', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Input_1.default, { label: "Email" }));
        (0, vitest_1.expect)(test_utils_1.screen.getByLabelText('Email')).toBeInTheDocument();
    });
    (0, vitest_1.it)('renders with icon', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Input_1.default, { icon: lucide_react_1.Mail }));
        (0, vitest_1.expect)(test_utils_1.screen.getByRole('textbox')).toHaveClass('pl-10');
    });
    (0, vitest_1.it)('shows error state', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Input_1.default, { error: "Invalid email" }));
        var input = test_utils_1.screen.getByRole('textbox');
        (0, vitest_1.expect)(input).toHaveClass('border-red-500');
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Invalid email')).toBeInTheDocument();
    });
    (0, vitest_1.it)('shows helper text', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Input_1.default, { helperText: "Enter your email address" }));
        (0, vitest_1.expect)(test_utils_1.screen.getByText('Enter your email address')).toBeInTheDocument();
    });
    (0, vitest_1.it)('handles value changes', function () {
        var handleChange = vitest_1.vi.fn();
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Input_1.default, { onChange: handleChange }));
        var input = test_utils_1.screen.getByRole('textbox');
        test_utils_1.fireEvent.change(input, { target: { value: 'test@example.com' } });
        (0, vitest_1.expect)(handleChange).toHaveBeenCalled();
    });
    (0, vitest_1.it)('applies custom className', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Input_1.default, { className: "custom-class" }));
        var input = test_utils_1.screen.getByRole('textbox');
        (0, vitest_1.expect)(input.closest('.custom-class')).toBeInTheDocument();
    });
    (0, vitest_1.it)('has proper accessibility attributes', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Input_1.default, { label: "Email", error: "Invalid email", helperText: "Helper text" }));
        var input = test_utils_1.screen.getByRole('textbox');
        (0, vitest_1.expect)(input).toHaveAttribute('aria-invalid', 'true');
        (0, vitest_1.expect)(input).toHaveAttribute('aria-describedby');
    });
    (0, vitest_1.it)('generates unique id when not provided', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Input_1.default, { label: "Email" }));
        var input = test_utils_1.screen.getByRole('textbox');
        (0, vitest_1.expect)(input).toHaveAttribute('id');
    });
    (0, vitest_1.it)('uses provided id', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Input_1.default, { id: "custom-id", label: "Email" }));
        var input = test_utils_1.screen.getByRole('textbox');
        (0, vitest_1.expect)(input).toHaveAttribute('id', 'custom-id');
    });
});
