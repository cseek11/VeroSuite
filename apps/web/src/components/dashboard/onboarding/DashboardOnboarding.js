"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardOnboarding = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var region_types_1 = require("@/routes/dashboard/types/region.types");
/**
 * Multi-step onboarding flow for dashboard regions
 */
var DashboardOnboarding = function (_a) {
    var _b, _c;
    var onComplete = _a.onComplete, onSkip = _a.onSkip, onSelectTemplate = _a.onSelectTemplate;
    var _d = (0, react_1.useState)(0), currentStep = _d[0], setCurrentStep = _d[1];
    var _e = (0, react_1.useState)(new Set()), _completedSteps = _e[0], setCompletedSteps = _e[1];
    var steps = [
        {
            id: 'welcome',
            title: 'Welcome to Dashboard Regions',
            description: 'Create custom dashboards by arranging regions. Each region can display different types of content and be positioned anywhere on the grid.',
            component: ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-blue-900 mb-2", children: "Key Features" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-2 text-sm text-blue-800", children: [(0, jsx_runtime_1.jsxs)("li", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4" }), "Drag and drop regions to customize your layout"] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4" }), "Resize regions to fit your needs"] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4" }), "Collaborate with your team in real-time"] })] })] }) }))
        },
        {
            id: 'regions',
            title: 'Understanding Regions',
            description: 'Regions are the building blocks of your dashboard. Each region can be a different type: scheduling, reports, analytics, and more.',
            component: ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-4", children: Object.values(region_types_1.RegionType).slice(0, 6).map(function (type) { return ((0, jsx_runtime_1.jsx)("div", { className: "border rounded-lg p-3 text-center", children: (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium", children: type.replace(/-/g, ' ') }) }, type)); }) }))
        },
        {
            id: 'templates',
            title: 'Choose a Template',
            description: 'Start with a pre-configured template or build from scratch. You can always customize later.',
            component: (0, jsx_runtime_1.jsx)(TemplateSelector, __assign({}, (onSelectTemplate !== undefined ? { onSelect: onSelectTemplate } : {})))
        },
        {
            id: 'interactions',
            title: 'Interacting with Regions',
            description: 'Learn how to move, resize, and configure regions to build your perfect dashboard.',
            component: ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold mb-2", children: "Drag & Drop" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Click and hold the drag handle (top-left) to move regions around the grid." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold mb-2", children: "Resize" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Hover over a region and use the resize handles on the edges to change its size." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold mb-2", children: "Settings" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Click the settings icon to customize colors, titles, and other region properties." })] })] }))
        },
        {
            id: 'complete',
            title: "You're All Set!",
            description: 'Start building your dashboard. You can always access help and templates from the menu.',
            component: ((0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-16 h-16 text-green-500 mx-auto" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Ready to create your first dashboard? Click \"Get Started\" to begin!" })] }))
        }
    ];
    var handleNext = (0, react_1.useCallback)(function () {
        if (currentStep < steps.length - 1) {
            setCompletedSteps(function (prev) { return new Set(__spreadArray(__spreadArray([], prev, true), [currentStep], false)); });
            setCurrentStep(function (prev) { return prev + 1; });
        }
        else {
            onComplete();
        }
    }, [currentStep, steps.length, onComplete]);
    var handlePrevious = (0, react_1.useCallback)(function () {
        if (currentStep > 0) {
            setCurrentStep(function (prev) { return prev - 1; });
        }
    }, [currentStep]);
    var handleSkip = (0, react_1.useCallback)(function () {
        onSkip();
    }, [onSkip]);
    var currentStepData = steps[currentStep];
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2 mb-2", children: steps.map(function (_, index) { return ((0, jsx_runtime_1.jsx)("div", { className: "h-2 flex-1 rounded-full transition-colors ".concat(index <= currentStep
                                                ? 'bg-blue-500'
                                                : 'bg-gray-200') }, index)); }) }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500", children: ["Step ", currentStep + 1, " of ", steps.length] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSkip, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", "aria-label": "Skip onboarding", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5 text-gray-500" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.3 }, children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: (_b = currentStepData === null || currentStepData === void 0 ? void 0 : currentStepData.title) !== null && _b !== void 0 ? _b : '' }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-6", children: (_c = currentStepData === null || currentStepData === void 0 ? void 0 : currentStepData.description) !== null && _c !== void 0 ? _c : '' }), currentStepData === null || currentStepData === void 0 ? void 0 : currentStepData.component] }, currentStep) }), (0, jsx_runtime_1.jsxs)("div", { className: "sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: handlePrevious, disabled: currentStep === 0, className: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "w-4 h-4" }), "Previous"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleNext, className: "px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2", children: [currentStep === steps.length - 1 ? 'Get Started' : 'Next', currentStep < steps.length - 1 && (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "w-4 h-4" })] })] })] }) }) }));
};
exports.DashboardOnboarding = DashboardOnboarding;
var TemplateSelector = function (_a) {
    var onSelect = _a.onSelect;
    var templates = [
        { id: 'blank', name: 'Blank Dashboard', description: 'Start from scratch' },
        { id: 'manager', name: 'Manager View', description: 'Analytics, team overview, reports' },
        { id: 'technician', name: 'Technician View', description: 'Schedule, quick actions, customer search' },
        { id: 'executive', name: 'Executive Dashboard', description: 'KPIs, financial summary, analytics' }
    ];
    return ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-4", children: templates.map(function (template) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return onSelect === null || onSelect === void 0 ? void 0 : onSelect(template.id); }, className: "border-2 border-gray-200 rounded-lg p-4 text-left hover:border-blue-500 hover:bg-blue-50 transition-all", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold mb-1", children: template.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: template.description })] }, template.id)); }) }));
};
