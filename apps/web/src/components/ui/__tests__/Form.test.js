"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Form Component Tests
 *
 * Tests for the Form component including:
 * - Form submission
 * - Form validation
 * - FormRow and FormCol layout
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var Form_1 = require("../Form");
(0, vitest_1.describe)('Form', function () {
    var mockOnSubmit = vitest_1.vi.fn();
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Rendering', function () {
        (0, vitest_1.it)('should render form with children', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Form_1.Form, { onSubmit: mockOnSubmit, children: (0, jsx_runtime_1.jsx)("div", { children: "Form Content" }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Form Content')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply custom className', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Form_1.Form, { onSubmit: mockOnSubmit, className: "custom-form", children: (0, jsx_runtime_1.jsx)("div", { children: "Content" }) }));
            var form = react_1.screen.getByText('Content').closest('form');
            (0, vitest_1.expect)(form).toHaveClass('custom-form');
        });
    });
    (0, vitest_1.describe)('Form Submission', function () {
        (0, vitest_1.it)('should call onSubmit when form is submitted', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Form_1.Form, { onSubmit: mockOnSubmit, children: (0, jsx_runtime_1.jsx)("button", { type: "submit", children: "Submit" }) }));
            var submitButton = react_1.screen.getByRole('button', { name: /submit/i });
            react_1.fireEvent.click(submitButton);
            (0, vitest_1.expect)(mockOnSubmit).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should prevent default form submission', function () {
            var mockEvent = {
                preventDefault: vitest_1.vi.fn(),
                stopPropagation: vitest_1.vi.fn(),
            };
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Form_1.Form, { onSubmit: mockOnSubmit, children: (0, jsx_runtime_1.jsx)("button", { type: "submit", children: "Submit" }) }));
            var form = react_1.screen.getByRole('button').closest('form');
            react_1.fireEvent.submit(form, mockEvent);
            (0, vitest_1.expect)(mockOnSubmit).toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)('FormRow', function () {
        (0, vitest_1.it)('should render FormRow with children', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Form_1.Form, { children: (0, jsx_runtime_1.jsx)(Form_1.FormRow, { children: (0, jsx_runtime_1.jsx)("div", { children: "Row Content" }) }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Row Content')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply custom className', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Form_1.Form, { children: (0, jsx_runtime_1.jsx)(Form_1.FormRow, { className: "custom-row", children: (0, jsx_runtime_1.jsx)("div", { children: "Content" }) }) }));
            var row = react_1.screen.getByText('Content').closest('.crm-field-row');
            (0, vitest_1.expect)(row).toHaveClass('custom-row');
        });
    });
    (0, vitest_1.describe)('FormCol', function () {
        (0, vitest_1.it)('should render FormCol with children', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Form_1.Form, { children: (0, jsx_runtime_1.jsx)(Form_1.FormCol, { children: (0, jsx_runtime_1.jsx)("div", { children: "Col Content" }) }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Col Content')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply custom className', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Form_1.Form, { children: (0, jsx_runtime_1.jsx)(Form_1.FormCol, { className: "custom-col", children: (0, jsx_runtime_1.jsx)("div", { children: "Content" }) }) }));
            var col = react_1.screen.getByText('Content').closest('.crm-field-col');
            (0, vitest_1.expect)(col).toHaveClass('custom-col');
        });
    });
});
