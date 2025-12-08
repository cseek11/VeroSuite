"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("@testing-library/react");
var vitest_1 = require("vitest");
var Card_1 = __importDefault(require("../ui/Card"));
(0, vitest_1.describe)('Card', function () {
    (0, vitest_1.it)('renders children content', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { children: "Test content" }));
        (0, vitest_1.expect)(react_1.screen.getByText('Test content')).toBeInTheDocument();
    });
    (0, vitest_1.it)('renders with title', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { title: "Test Title", children: "Content" }));
        (0, vitest_1.expect)(react_1.screen.getByText('Test Title')).toBeInTheDocument();
    });
    (0, vitest_1.it)('renders with actions', function () {
        var actions = [
            (0, jsx_runtime_1.jsx)("button", { children: "Action 1" }, "1"),
            (0, jsx_runtime_1.jsx)("button", { children: "Action 2" }, "2")
        ];
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { title: "Test Title", actions: actions, children: "Content" }));
        (0, vitest_1.expect)(react_1.screen.getByText('Action 1')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('Action 2')).toBeInTheDocument();
    });
    (0, vitest_1.it)('renders without header when no title or actions', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { children: "Content" }));
        var card = react_1.screen.getByText('Content').closest('div');
        (0, vitest_1.expect)(card === null || card === void 0 ? void 0 : card.querySelector('.px-6.py-4')).not.toBeInTheDocument();
    });
    (0, vitest_1.it)('applies custom className', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { className: "custom-class", children: "Content" }));
        var card = react_1.screen.getByText('Content').closest('.bg-white');
        (0, vitest_1.expect)(card).toHaveClass('custom-class');
    });
    (0, vitest_1.it)('has proper structure with title and actions', function () {
        var actions = [(0, jsx_runtime_1.jsx)("button", { children: "Action" }, "1")];
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { title: "Test Title", actions: actions, children: "Content" }));
        var card = react_1.screen.getByText('Content').closest('.bg-white');
        (0, vitest_1.expect)(card).toHaveClass('bg-white', 'rounded-xl', 'shadow-sm');
    });
});
