"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyDashboard = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var region_types_1 = require("@/routes/dashboard/types/region.types");
/**
 * Empty state component with quick actions and templates
 */
var EmptyDashboard = function (_a) {
    var onAddRegion = _a.onAddRegion, onSelectTemplate = _a.onSelectTemplate, onStartOnboarding = _a.onStartOnboarding;
    var quickRegionTypes = [
        { type: region_types_1.RegionType.SCHEDULING, label: 'Scheduling', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Layout, { className: "w-5 h-5" }) },
        { type: region_types_1.RegionType.ANALYTICS, label: 'Analytics', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "w-5 h-5" }) },
        { type: region_types_1.RegionType.REPORTS, label: 'Reports', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Layout, { className: "w-5 h-5" }) },
        { type: region_types_1.RegionType.QUICK_ACTIONS, label: 'Quick Actions', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-5 h-5" }) }
    ];
    var templates = [
        { id: 'manager', name: 'Manager Dashboard', description: 'Analytics, team overview, and reports' },
        { id: 'technician', name: 'Technician Dashboard', description: 'Schedule, quick actions, and customer search' },
        { id: 'executive', name: 'Executive Dashboard', description: 'KPIs, financial summary, and analytics' }
    ];
    return ((0, jsx_runtime_1.jsx)("div", { className: "empty-dashboard flex items-center justify-center min-h-[60vh] p-8", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "text-center max-w-2xl", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "mb-6", initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: 0.2, type: 'spring' }, children: (0, jsx_runtime_1.jsx)("div", { className: "w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Layout, { className: "w-12 h-12 text-blue-500" }) }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Create Your Dashboard" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-gray-600 mb-8", children: "Start by adding regions or choose a template to get started quickly" }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-gray-700 mb-4", children: "Quick Add Regions" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: quickRegionTypes.map(function (_a) {
                                var type = _a.type, label = _a.label, icon = _a.icon;
                                return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return onAddRegion === null || onAddRegion === void 0 ? void 0 : onAddRegion(type); }, className: "flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-blue-500 group-hover:scale-110 transition-transform", children: icon }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-gray-700", children: label })] }, type));
                            }) })] }), onSelectTemplate && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-gray-700 mb-4", children: "Or Start with a Template" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: templates.map(function (template) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return onSelectTemplate(template.id); }, className: "text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-gray-900 mb-1 group-hover:text-blue-600", children: template.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: template.description }), (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-4 h-4 text-blue-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" })] }, template.id)); }) })] })), onStartOnboarding && ((0, jsx_runtime_1.jsxs)("button", { onClick: onStartOnboarding, className: "text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mx-auto", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "w-4 h-4" }), "Take a quick tour"] }))] }) }));
};
exports.EmptyDashboard = EmptyDashboard;
