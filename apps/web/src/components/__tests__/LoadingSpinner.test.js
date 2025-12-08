"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("@testing-library/react");
var vitest_1 = require("vitest");
var LoadingSpinner_1 = require("../LoadingSpinner");
(0, vitest_1.describe)('LoadingSpinner', function () {
    (0, vitest_1.it)('renders with default props', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, {}));
        var spinner = react_1.screen.getByRole('status', { hidden: true });
        (0, vitest_1.expect)(spinner).toBeInTheDocument();
    });
    (0, vitest_1.it)('renders with custom text', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading data..." }));
        (0, vitest_1.expect)(react_1.screen.getByText('Loading data...')).toBeInTheDocument();
    });
    (0, vitest_1.it)('renders with different sizes', function () {
        var rerender = (0, react_1.render)((0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "sm" })).rerender;
        // Loader2 icon has the size classes
        var loaderIcon = react_1.screen.getByTestId('loader2-icon');
        (0, vitest_1.expect)(loaderIcon).toHaveClass('w-4');
        (0, vitest_1.expect)(loaderIcon).toHaveClass('h-4');
        rerender((0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "lg" }));
        var loaderIconLarge = react_1.screen.getByTestId('loader2-icon');
        (0, vitest_1.expect)(loaderIconLarge).toHaveClass('w-8');
        (0, vitest_1.expect)(loaderIconLarge).toHaveClass('h-8');
    });
    (0, vitest_1.it)('applies custom className', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { className: "custom-class" }));
        var container = react_1.screen.getByRole('status', { hidden: true }).parentElement;
        (0, vitest_1.expect)(container).toHaveClass('custom-class');
    });
    (0, vitest_1.it)('has proper accessibility attributes', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading..." }));
        var spinner = react_1.screen.getByRole('status', { hidden: true });
        (0, vitest_1.expect)(spinner).toHaveAttribute('aria-hidden', 'true');
    });
});
(0, vitest_1.describe)('PageLoader', function () {
    (0, vitest_1.it)('renders with default text', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(LoadingSpinner_1.PageLoader, {}));
        (0, vitest_1.expect)(react_1.screen.getByText('Loading...')).toBeInTheDocument();
    });
    (0, vitest_1.it)('renders with custom text', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(LoadingSpinner_1.PageLoader, { text: "Please wait..." }));
        (0, vitest_1.expect)(react_1.screen.getByText('Please wait...')).toBeInTheDocument();
    });
    (0, vitest_1.it)('has full screen layout', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(LoadingSpinner_1.PageLoader, {}));
        var container = react_1.screen.getByText('Loading...').closest('.min-h-screen');
        (0, vitest_1.expect)(container).toBeInTheDocument();
    });
});
