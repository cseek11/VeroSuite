"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurringSeriesManager = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var Dialog_1 = require("@/components/ui/Dialog");
var sonner_1 = require("sonner");
var RecurringSeriesManager = function (_a) {
    var _b, _c;
    var templateId = _a.templateId, onEdit = _a.onEdit, onClose = _a.onClose;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _d = (0, react_1.useState)(false), deleteDialogOpen = _d[0], setDeleteDialogOpen = _d[1];
    var _e = (0, react_1.useState)(false), generateDialogOpen = _e[0], setGenerateDialogOpen = _e[1];
    var defaultGenerateUntilDate = new Date();
    defaultGenerateUntilDate.setMonth(defaultGenerateUntilDate.getMonth() + 3); // Default to 3 months ahead
    var defaultGenerateUntilParts = defaultGenerateUntilDate.toISOString().split('T');
    var defaultGenerateUntil = (_c = (_b = defaultGenerateUntilParts[0]) !== null && _b !== void 0 ? _b : new Date().toISOString().split('T')[0]) !== null && _c !== void 0 ? _c : '';
    var _f = (0, react_1.useState)(defaultGenerateUntil), generateUntil = _f[0], setGenerateUntil = _f[1];
    // Fetch template
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['recurringTemplate', templateId],
        queryFn: function () { return enhanced_api_1.enhancedApi.jobs.recurring.get(templateId); },
    }), template = _g.data, isLoading = _g.isLoading, error = _g.error;
    // Delete mutation
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: function (deleteAllJobs) {
            return enhanced_api_1.enhancedApi.jobs.recurring.delete(templateId, deleteAllJobs);
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['recurringTemplates'] });
            sonner_1.toast.success('Recurring series deleted successfully');
            onClose === null || onClose === void 0 ? void 0 : onClose();
        },
        onError: function (error) {
            sonner_1.toast.error('Failed to delete series', { description: error.message });
        },
    });
    // Generate jobs mutation
    var generateMutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return enhanced_api_1.enhancedApi.jobs.recurring.generate(templateId, generateUntil); },
        onSuccess: function (result) {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            queryClient.invalidateQueries({ queryKey: ['recurringTemplate', templateId] });
            sonner_1.toast.success("Generated ".concat(result.generated, " jobs").concat(result.skipped > 0 ? ", skipped ".concat(result.skipped, " existing") : ''));
            setGenerateDialogOpen(false);
        },
        onError: function (error) {
            sonner_1.toast.error('Failed to generate jobs', { description: error.message });
        },
    });
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading series details..." });
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-red-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-5 h-5" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Error loading series: ", error instanceof Error ? error.message : 'Unknown error'] })] }) }));
    }
    if (!template) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500", children: "Series not found" }) }));
    }
    var handleDelete = function (deleteAllJobs) {
        deleteMutation.mutate(deleteAllJobs);
        setDeleteDialogOpen(false);
    };
    var handleGenerate = function () {
        generateMutation.mutate();
    };
    return ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-gray-900", children: template.name }), template.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mt-1", children: template.description }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs font-medium ".concat(template.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'), children: template.is_active ? 'Active' : 'Inactive' }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "Pattern Type" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900 capitalize", children: template.recurrence_type })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "Interval" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-medium text-gray-900", children: ["Every ", template.recurrence_interval || 1, ' ', template.recurrence_type === 'daily' && 'day(s)', template.recurrence_type === 'weekly' && 'week(s)', template.recurrence_type === 'monthly' && 'month(s)'] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "Start Date" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900", children: new Date(template.start_date).toLocaleDateString() })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "End Date" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900", children: template.end_date
                                            ? new Date(template.end_date).toLocaleDateString()
                                            : 'No end date' })] }), template.last_generated_date && ((0, jsx_runtime_1.jsxs)("div", { className: "col-span-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "Last Generated" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900", children: new Date(template.last_generated_date).toLocaleDateString() })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-2 pt-4 border-t border-gray-200", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "secondary", size: "sm", onClick: function () { return onEdit === null || onEdit === void 0 ? void 0 : onEdit(templateId); }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "w-4 h-4" }), "Edit Series"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "secondary", size: "sm", onClick: function () { return setGenerateDialogOpen(true); }, className: "flex items-center gap-2", disabled: !template.is_active, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4" }), "Generate Jobs"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "danger", size: "sm", onClick: function () { return setDeleteDialogOpen(true); }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4" }), "Delete Series"] })] })] }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: generateDialogOpen, onOpenChange: setGenerateDialogOpen, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Generate Jobs" }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: "Generate job instances from this recurring template up to the specified date." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 py-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Generate Until" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: generateUntil, onChange: function (e) { return setGenerateUntil(e.target.value); }, min: template.start_date, className: "w-full px-3 py-2 border border-gray-300 rounded-md" })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500", children: ["Jobs will be generated from", ' ', template.last_generated_date
                                            ? new Date(template.last_generated_date).toLocaleDateString()
                                            : new Date(template.start_date).toLocaleDateString(), ' ', "until ", new Date(generateUntil).toLocaleDateString()] })] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", onClick: function () { return setGenerateDialogOpen(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: handleGenerate, disabled: generateMutation.isPending, children: generateMutation.isPending ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), "Generating..."] })) : ('Generate Jobs') })] })] }) }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Delete Recurring Series" }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: "Are you sure you want to delete this recurring series? This action cannot be undone." })] }), (0, jsx_runtime_1.jsx)("div", { className: "py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-5 h-5 text-yellow-600" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-yellow-800", children: "This will delete the template. You can choose to delete all generated jobs or keep them." })] }) }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { className: "flex-col sm:flex-row gap-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", onClick: function () { return setDeleteDialogOpen(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", onClick: function () { return handleDelete(false); }, disabled: deleteMutation.isPending, children: "Delete Template Only" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "danger", onClick: function () { return handleDelete(true); }, disabled: deleteMutation.isPending, children: deleteMutation.isPending ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), "Deleting..."] })) : ('Delete Template & All Jobs') })] })] }) })] }));
};
exports.RecurringSeriesManager = RecurringSeriesManager;
