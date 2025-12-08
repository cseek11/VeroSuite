"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InvoiceTemplates;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * InvoiceTemplates Component
 *
 * Manages invoice templates for quick invoice creation.
 * Allows users to create, edit, delete, and apply invoice templates.
 *
 * Features:
 * - Template CRUD operations
 * - Template preview
 * - Apply template to new invoice
 * - Template categories/tags
 */
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var Dialog_1 = require("@/components/ui/Dialog");
function InvoiceTemplates(_a) {
    var _this = this;
    var onApplyTemplate = _a.onApplyTemplate;
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)(null), selectedTag = _c[0], setSelectedTag = _c[1];
    var _d = (0, react_1.useState)(false), showTemplateForm = _d[0], setShowTemplateForm = _d[1];
    var _e = (0, react_1.useState)(null), editingTemplate = _e[0], setEditingTemplate = _e[1];
    var _f = (0, react_1.useState)(false), showApplyDialog = _f[0], setShowApplyDialog = _f[1];
    var _g = (0, react_1.useState)(null), templateToApply = _g[0], setTemplateToApply = _g[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Mock templates - In production, this would fetch from API
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['invoice-templates'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock data for now
                return [2 /*return*/, [
                        {
                            id: '1',
                            name: 'Standard Monthly Service',
                            description: 'Monthly pest control service invoice template',
                            items: [
                                {
                                    service_type_id: '',
                                    description: 'Monthly Pest Control Service',
                                    quantity: 1,
                                    unit_price: 150.00,
                                },
                            ],
                            tags: ['monthly', 'recurring'],
                            is_default: false,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        },
                        {
                            id: '2',
                            name: 'One-Time Treatment',
                            description: 'Template for one-time treatment services',
                            items: [
                                {
                                    service_type_id: '',
                                    description: 'One-Time Treatment Service',
                                    quantity: 1,
                                    unit_price: 200.00,
                                },
                            ],
                            tags: ['one-time', 'treatment'],
                            is_default: false,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        },
                    ]];
            });
        }); },
    }), templatesData = _h.data, isLoading = _h.isLoading, templatesError = _h.error;
    if (templatesError) {
        logger_1.logger.error('Failed to fetch invoice templates', templatesError, 'InvoiceTemplates');
        toast_1.toast.error('Failed to load templates. Please try again.');
    }
    var templates = Array.isArray(templatesData) ? templatesData : [];
    // Extract unique tags from templates
    var availableTags = (0, react_1.useMemo)(function () {
        var tags = new Set();
        templates.forEach(function (template) {
            var _a;
            (_a = template.tags) === null || _a === void 0 ? void 0 : _a.forEach(function (tag) { return tags.add(tag); });
        });
        return Array.from(tags).sort();
    }, [templates]);
    // Filter templates
    var filteredTemplates = (0, react_1.useMemo)(function () {
        var filtered = templates;
        // Apply search filter
        if (searchTerm) {
            var searchLower_1 = searchTerm.toLowerCase();
            filtered = filtered.filter(function (template) {
                var _a, _b;
                return template.name.toLowerCase().includes(searchLower_1) ||
                    ((_a = template.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower_1)) ||
                    ((_b = template.tags) === null || _b === void 0 ? void 0 : _b.some(function (tag) { return tag.toLowerCase().includes(searchLower_1); }));
            });
        }
        // Apply tag filter
        if (selectedTag) {
            filtered = filtered.filter(function (template) { var _a; return (_a = template.tags) === null || _a === void 0 ? void 0 : _a.includes(selectedTag); });
        }
        return filtered;
    }, [templates, searchTerm, selectedTag]);
    var handleCreateTemplate = function () {
        setEditingTemplate(null);
        setShowTemplateForm(true);
    };
    var handleEditTemplate = function (template) {
        setEditingTemplate(template);
        setShowTemplateForm(true);
    };
    var handleDeleteTemplate = function (templateId) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Are you sure you want to delete this template?')) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    logger_1.logger.debug('Template deleted', { templateId: templateId }, 'InvoiceTemplates');
                    toast_1.toast.success('Template deleted successfully');
                    // Invalidate query to refetch
                    return [4 /*yield*/, queryClient.invalidateQueries({ queryKey: ['invoice-templates'] })];
                case 2:
                    // Invalidate query to refetch
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to delete template', error_1, 'InvoiceTemplates');
                    toast_1.toast.error('Failed to delete template. Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleApplyTemplate = function (template) {
        setTemplateToApply(template);
        setShowApplyDialog(true);
    };
    var handleConfirmApply = function () {
        if (templateToApply && onApplyTemplate) {
            onApplyTemplate(templateToApply);
            setShowApplyDialog(false);
            setTemplateToApply(null);
            toast_1.toast.success("Template \"".concat(templateToApply.name, "\" applied"));
        }
    };
    var calculateTotal = function (items) {
        return items.reduce(function (sum, item) { return sum + (item.quantity * item.unit_price); }, 0);
    };
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "font-semibold flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-6 h-6 mr-2 text-purple-600" }), "Invoice Templates"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mt-2", children: "Create and manage invoice templates for quick invoice generation" })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", icon: lucide_react_1.Plus, onClick: handleCreateTemplate, children: "Create Template" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search templates...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" })] }), availableTags.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: selectedTag === null ? 'primary' : 'outline', size: "sm", onClick: function () { return setSelectedTag(null); }, children: "All" }), availableTags.map(function (tag) { return ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: selectedTag === tag ? 'primary' : 'outline', size: "sm", icon: lucide_react_1.Tag, onClick: function () { return setSelectedTag(selectedTag === tag ? null : tag); }, children: tag }, tag)); })] }))] }), isLoading && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading templates..." })] })), !isLoading && filteredTemplates.length === 0 && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gray-50 border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 font-medium", children: searchTerm || selectedTag ? 'No templates found' : 'No templates yet' }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500 mt-2", children: searchTerm || selectedTag
                                            ? 'Try adjusting your search or filters'
                                            : 'Create your first template to get started' })] }) })), !isLoading && filteredTemplates.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredTemplates.map(function (template) { return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "border-2 border-gray-200 hover:border-purple-300 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-start justify-between mb-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold mb-1", children: template.name }), template.description && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: template.description }))] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-3", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-500 mb-2", children: [template.items.length, " item", template.items.length !== 1 ? 's' : ''] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [template.items.slice(0, 2).map(function (item, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-700", children: [item.description, " - ", formatCurrency(item.unit_price), " \u00D7 ", item.quantity] }, index)); }), template.items.length > 2 && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-500", children: ["+", template.items.length - 2, " more item", template.items.length - 2 !== 1 ? 's' : ''] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2 pt-2 border-t border-gray-200", children: (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-semibold", children: ["Total: ", formatCurrency(calculateTotal(template.items))] }) })] }), template.tags && template.tags.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1 mb-3", children: template.tags.map(function (tag) { return ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full", children: tag }, tag)); }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2 pt-3 border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Copy, onClick: function () { return handleApplyTemplate(template); }, className: "flex-1", children: "Apply" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Edit, onClick: function () { return handleEditTemplate(template); }, children: "Edit" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Trash2, onClick: function () { return handleDeleteTemplate(template.id); }, children: "Delete" })] })] }) }, template.id)); }) }))] }) }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showApplyDialog, onOpenChange: setShowApplyDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Apply Template" }) }), (0, jsx_runtime_1.jsx)("div", { className: "py-4", children: templateToApply && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "mb-4", children: ["Apply template \"", templateToApply.name, "\" to create a new invoice?"] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 p-3 rounded-lg", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium mb-2", children: "Template Preview:" }), (0, jsx_runtime_1.jsx)("ul", { className: "list-disc list-inside space-y-1 text-sm text-gray-700", children: templateToApply.items.map(function (item, index) { return ((0, jsx_runtime_1.jsxs)("li", { children: [item.description, " - ", formatCurrency(item.unit_price), " \u00D7 ", item.quantity] }, index)); }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2 pt-2 border-t border-gray-200", children: (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-semibold", children: ["Total: ", formatCurrency(calculateTotal(templateToApply.items))] }) })] })] })) }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowApplyDialog(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: handleConfirmApply, children: "Apply Template" })] })] }) }), showTemplateForm && ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showTemplateForm, onOpenChange: setShowTemplateForm, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: editingTemplate ? 'Edit Template' : 'Create Template' }) }), (0, jsx_runtime_1.jsx)("div", { className: "py-4", children: (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-yellow-50 border-yellow-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-yellow-600 mr-2 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-yellow-800 font-medium", children: "Template Editor Coming Soon" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-yellow-700 mt-1", children: "Template creation and editing will be available in the next update. For now, templates are managed via the API." })] })] }) }) }) }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogFooter, { children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowTemplateForm(false); }, children: "Close" }) })] }) }))] }));
}
