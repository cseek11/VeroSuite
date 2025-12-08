"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictResolutionDialog = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Dialog_1 = require("@/components/ui/Dialog");
var ConflictResolutionDialog = function (_a) {
    var open = _a.open, conflicts = _a.conflicts, _canProceed = _a.canProceed, onProceed = _a.onProceed, onCancel = _a.onCancel, technicianName = _a.technicianName;
    var getSeverityColor = function (severity) {
        switch (severity) {
            case 'critical': return 'text-red-600 bg-red-50 border-red-200';
            case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };
    var getConflictIcon = function (type) {
        switch (type) {
            case 'time_overlap':
            case 'technician_double_booking':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-5 w-5" });
            case 'location_conflict':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-5 w-5" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5" });
        }
    };
    var criticalConflicts = conflicts.filter(function (c) { return c.severity === 'critical'; });
    var hasCriticalConflicts = criticalConflicts.length > 0;
    return ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: open, onOpenChange: function (isOpen) { return !isOpen && onCancel(); }, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-2xl max-h-[80vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-orange-500" }), "Scheduling Conflict Detected"] }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: hasCriticalConflicts
                                ? "Cannot assign job to ".concat(technicianName || 'this technician', ". Critical conflicts detected.")
                                : "Warning: Conflicts detected when assigning to ".concat(technicianName || 'this technician', ".") })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4 mt-4", children: conflicts.map(function (conflict, index) { return ((0, jsx_runtime_1.jsx)("div", { className: "p-4 rounded-lg border ".concat(getSeverityColor(conflict.severity)), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "mt-0.5", children: getConflictIcon(conflict.type) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-semibold capitalize", children: conflict.type.replace('_', ' ') }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs px-2 py-0.5 rounded capitalize ".concat(getSeverityColor(conflict.severity)), children: conflict.severity })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm mb-3", children: conflict.description }), conflict.conflicting_jobs.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3 space-y-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-medium uppercase tracking-wide opacity-75", children: "Conflicting Jobs:" }), conflict.conflicting_jobs.map(function (job, jobIndex) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/50 p-2 rounded text-xs", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: job.customer_name || 'Unknown Customer' }), (0, jsx_runtime_1.jsxs)("div", { className: "text-gray-600 mt-1", children: [job.scheduled_start_time, " - ", job.scheduled_end_time, job.location_address && " \u2022 ".concat(job.location_address)] })] }, jobIndex)); })] }))] })] }) }, index)); }) }), hasCriticalConflicts && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 p-3 bg-red-50 border border-red-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-red-800", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Cannot proceed:" }), " Critical conflicts prevent this assignment. Please resolve conflicts or choose a different time slot."] }) })), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { className: "mt-6", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", onClick: onCancel, children: "Cancel" }), !hasCriticalConflicts && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: onProceed, children: "Proceed Anyway" }))] })] }) }));
};
exports.ConflictResolutionDialog = ConflictResolutionDialog;
