"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var test_utils_1 = require("../../test/setup/test-utils");
var vitest_1 = require("vitest");
var Button_1 = __importDefault(require("../ui/Button"));
var lucide_react_1 = require("lucide-react");
(0, vitest_1.describe)('Button', function () {
    (0, vitest_1.it)('renders with default props', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Button_1.default, { children: "Click me" }));
        var button = test_utils_1.screen.getByRole('button', { name: /click me/i });
        (0, vitest_1.expect)(button).toBeInTheDocument();
        // Default variant uses gradient classes
        (0, vitest_1.expect)(button).toHaveClass('bg-gradient-to-r');
        (0, vitest_1.expect)(button).toHaveClass('from-indigo-600');
    });
    (0, vitest_1.it)('renders with primary variant', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", children: "Primary Button" }));
        var button = test_utils_1.screen.getByRole('button', { name: /primary button/i });
        // Primary variant uses gradient classes
        (0, vitest_1.expect)(button).toHaveClass('bg-gradient-to-r');
        (0, vitest_1.expect)(button).toHaveClass('from-indigo-600');
        (0, vitest_1.expect)(button).toHaveClass('to-purple-600');
    });
    (0, vitest_1.it)('renders with icon', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Button_1.default, { icon: lucide_react_1.Users, children: "With Icon" }));
        var button = test_utils_1.screen.getByRole('button', { name: /with icon/i });
        (0, vitest_1.expect)(button).toBeInTheDocument();
        // Icon is rendered as SVG component
        (0, vitest_1.expect)(test_utils_1.screen.getByTestId('users-icon')).toBeInTheDocument();
    });
    (0, vitest_1.it)('shows loading state', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Button_1.default, { loading: true, children: "Loading" }));
        var button = test_utils_1.screen.getByRole('button', { name: /loading/i });
        (0, vitest_1.expect)(button).toBeDisabled();
        // Loading spinner is rendered as SVG component
        (0, vitest_1.expect)(test_utils_1.screen.getByTestId('loader2-icon')).toBeInTheDocument();
        (0, vitest_1.expect)(test_utils_1.screen.getByTestId('loader2-icon')).toHaveClass('animate-spin');
    });
    (0, vitest_1.it)('calls onClick when clicked', function () {
        var handleClick = vitest_1.vi.fn();
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handleClick, children: "Click me" }));
        var button = test_utils_1.screen.getByRole('button', { name: /click me/i });
        test_utils_1.fireEvent.click(button);
        (0, vitest_1.expect)(handleClick).toHaveBeenCalledTimes(1);
    });
    (0, vitest_1.it)('is disabled when disabled prop is true', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Button_1.default, { disabled: true, children: "Disabled" }));
        var button = test_utils_1.screen.getByRole('button', { name: /disabled/i });
        (0, vitest_1.expect)(button).toBeDisabled();
    });
    (0, vitest_1.it)('applies custom className', function () {
        (0, test_utils_1.render)((0, jsx_runtime_1.jsx)(Button_1.default, { className: "custom-class", children: "Custom" }));
        var button = test_utils_1.screen.getByRole('button', { name: /custom/i });
        (0, vitest_1.expect)(button).toHaveClass('custom-class');
    });
});
