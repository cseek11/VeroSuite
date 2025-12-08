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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateManager = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Dialog_1 = require("@/components/ui/Dialog");
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Switch_1 = require("@/components/ui/Switch");
var Label_1 = require("@/components/ui/Label");
var toast_1 = require("@/utils/toast");
var logger_1 = require("@/utils/logger");
var enhanced_api_1 = require("@/lib/enhanced-api");
var offline_queue_service_1 = require("@/services/offline-queue.service");
var pwa_1 = require("@/utils/pwa");
var TemplateManager = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, currentRegions = _a.currentRegions, onLoadTemplate = _a.onLoadTemplate, onSaveAsTemplate = _a.onSaveAsTemplate;
    var _b = (0, react_1.useState)([]), templates = _b[0], setTemplates = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(false), showSaveDialog = _d[0], setShowSaveDialog = _d[1];
    var _e = (0, react_1.useState)(''), templateName = _e[0], setTemplateName = _e[1];
    var _f = (0, react_1.useState)(''), templateDescription = _f[0], setTemplateDescription = _f[1];
    var _g = (0, react_1.useState)(false), saving = _g[0], setSaving = _g[1];
    var _h = (0, react_1.useState)(false), showShareDialog = _h[0], setShowShareDialog = _h[1];
    var _j = (0, react_1.useState)(null), selectedTemplate = _j[0], setSelectedTemplate = _j[1];
    var _k = (0, react_1.useState)(false), isPublic = _k[0], setIsPublic = _k[1];
    var _l = (0, react_1.useState)(''), shareLink = _l[0], setShareLink = _l[1];
    // Load templates from backend
    (0, react_1.useEffect)(function () {
        if (isOpen) {
            loadTemplates();
        }
    }, [isOpen]);
    var loadTemplates = function () { return __awaiter(void 0, void 0, void 0, function () {
        var templatesData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.templates.list()];
                case 2:
                    templatesData = _a.sent();
                    setTemplates(templatesData || []);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to load templates', { error: error_1 }, 'TemplateManager');
                    toast_1.toast.error('Failed to load templates');
                    // Fallback to empty array
                    setTemplates([]);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleSaveTemplate = function () { return __awaiter(void 0, void 0, void 0, function () {
        var templateData, descriptionValue, newTemplate, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!templateName.trim()) {
                        toast_1.toast.error('Template name is required');
                        return [2 /*return*/];
                    }
                    if (currentRegions.length === 0) {
                        toast_1.toast.error('Cannot save empty dashboard as template');
                        return [2 /*return*/];
                    }
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 9]);
                    templateData = {
                        name: templateName.trim(),
                        regions: currentRegions.map(function (r) { return (__assign({}, r)); }),
                        is_public: false
                    };
                    descriptionValue = templateDescription.trim();
                    if (descriptionValue) {
                        templateData.description = descriptionValue;
                    }
                    newTemplate = void 0;
                    if (!(0, pwa_1.isOnline)()) return [3 /*break*/, 3];
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.templates.create(templateData)];
                case 2:
                    newTemplate = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    // Queue for offline sync
                    offline_queue_service_1.offlineQueueService.enqueue({
                        type: 'create',
                        resource: 'template',
                        data: templateData
                    });
                    // Create optimistic template
                    newTemplate = __assign(__assign({ id: "temp-".concat(Date.now()) }, templateData), { created_at: new Date().toISOString(), updated_at: new Date().toISOString(), is_system: false });
                    toast_1.toast.info('Template will be saved when online');
                    _a.label = 4;
                case 4:
                    setTemplates(__spreadArray(__spreadArray([], templates, true), [newTemplate], false));
                    if (!onSaveAsTemplate) return [3 /*break*/, 6];
                    return [4 /*yield*/, onSaveAsTemplate(templateName.trim(), templateDescription.trim() || undefined)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    setShowSaveDialog(false);
                    setTemplateName('');
                    setTemplateDescription('');
                    toast_1.toast.success('Template saved successfully');
                    return [3 /*break*/, 9];
                case 7:
                    error_2 = _a.sent();
                    logger_1.logger.error('Failed to save template', { error: error_2 }, 'TemplateManager');
                    toast_1.toast.error('Failed to save template');
                    return [3 /*break*/, 9];
                case 8:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var handleLoadTemplate = function (template) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (template.regions.length === 0) {
                        toast_1.toast.info('This template is empty. Add regions to customize it.');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, onLoadTemplate(template)];
                case 2:
                    _a.sent();
                    toast_1.toast.success("Loaded template: ".concat(template.name));
                    onClose();
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    logger_1.logger.error('Failed to load template', { error: error_3, templateId: template.id }, 'TemplateManager');
                    toast_1.toast.error('Failed to load template');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteTemplate = function (templateId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm('Are you sure you want to delete this template?')) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    if (!(0, pwa_1.isOnline)()) return [3 /*break*/, 3];
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.templates.delete(templateId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    // Queue for offline sync
                    offline_queue_service_1.offlineQueueService.enqueue({
                        type: 'delete',
                        resource: 'template',
                        resourceId: templateId,
                        data: {}
                    });
                    toast_1.toast.info('Template will be deleted when online');
                    _a.label = 4;
                case 4:
                    setTemplates(templates.filter(function (t) { return t.id !== templateId; }));
                    toast_1.toast.success('Template deleted');
                    return [3 /*break*/, 6];
                case 5:
                    error_4 = _a.sent();
                    logger_1.logger.error('Failed to delete template', { error: error_4, templateId: templateId }, 'TemplateManager');
                    toast_1.toast.error('Failed to delete template');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleDuplicateTemplate = function (template) { return __awaiter(void 0, void 0, void 0, function () {
        var templateData, duplicated, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    templateData = {
                        name: "".concat(template.name, " (Copy)"),
                        regions: template.regions,
                        is_public: false
                    };
                    if (template.description) {
                        templateData.description = template.description;
                    }
                    if (template.thumbnail) {
                        templateData.thumbnail = template.thumbnail;
                    }
                    duplicated = void 0;
                    if (!(0, pwa_1.isOnline)()) return [3 /*break*/, 2];
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.templates.create(templateData)];
                case 1:
                    duplicated = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    // Queue for offline sync
                    offline_queue_service_1.offlineQueueService.enqueue({
                        type: 'create',
                        resource: 'template',
                        data: templateData
                    });
                    // Create optimistic template
                    duplicated = __assign(__assign({ id: "temp-".concat(Date.now()) }, templateData), { created_at: new Date().toISOString(), updated_at: new Date().toISOString(), is_system: false });
                    toast_1.toast.info('Template will be duplicated when online');
                    _a.label = 3;
                case 3:
                    setTemplates(__spreadArray(__spreadArray([], templates, true), [duplicated], false));
                    toast_1.toast.success('Template duplicated');
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    logger_1.logger.error('Failed to duplicate template', { error: error_5, templateId: template.id }, 'TemplateManager');
                    toast_1.toast.error('Failed to duplicate template');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleShareTemplate = function (template) {
        setSelectedTemplate(template);
        setIsPublic(template.is_public || false);
        setShareLink("".concat(window.location.origin, "/dashboard?template=").concat(template.id));
        setShowShareDialog(true);
    };
    var handleTogglePublic = function () { return __awaiter(void 0, void 0, void 0, function () {
        var updateData, updated_1, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedTemplate)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    updateData = { is_public: !isPublic };
                    if (!(0, pwa_1.isOnline)()) return [3 /*break*/, 3];
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.templates.update(selectedTemplate.id, updateData)];
                case 2:
                    updated_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    // Queue for offline sync
                    offline_queue_service_1.offlineQueueService.enqueue({
                        type: 'update',
                        resource: 'template',
                        resourceId: selectedTemplate.id,
                        data: updateData
                    });
                    // Optimistic update
                    updated_1 = __assign(__assign({}, selectedTemplate), updateData);
                    toast_1.toast.info('Sharing settings will be updated when online');
                    _a.label = 4;
                case 4:
                    setIsPublic(!isPublic);
                    setTemplates(templates.map(function (t) { return t.id === selectedTemplate.id ? updated_1 : t; }));
                    toast_1.toast.success("Template ".concat(!isPublic ? 'made public' : 'made private'));
                    return [3 /*break*/, 6];
                case 5:
                    error_6 = _a.sent();
                    logger_1.logger.error('Failed to update template sharing', { error: error_6, templateId: selectedTemplate.id }, 'TemplateManager');
                    toast_1.toast.error('Failed to update sharing settings');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleCopyLink = function () {
        navigator.clipboard.writeText(shareLink);
        toast_1.toast.success('Link copied to clipboard!');
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: isOpen, onOpenChange: onClose, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-hidden flex flex-col", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FolderOpen, { className: "w-5 h-5" }), "Dashboard Templates"] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 overflow-y-auto", children: [currentRegions.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-blue-900 mb-1", children: "Save Current Layout" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-blue-700", children: "Save your current dashboard layout as a reusable template" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { onClick: function () { return setShowSaveDialog(true); }, className: "bg-blue-600 hover:bg-blue-700 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "w-4 h-4" }), "Save as Template"] })] }) })), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: templates.map(function (template) { return ((0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-gray-900 mb-1", children: template.name }), template.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-2", children: template.description })), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500", children: [template.regions.length, " region", template.regions.length !== 1 ? 's' : ''] })] }), template.is_system && ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded", children: "System" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mt-4", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { onClick: function () { return handleLoadTemplate(template); }, disabled: loading, className: "flex-1 bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FolderOpen, { className: "w-4 h-4" }), "Load"] }), !template.is_system && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return handleShareTemplate(template); }, variant: "outline", className: "px-3", "aria-label": "Share template", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Share2, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return handleDuplicateTemplate(template); }, variant: "outline", className: "px-3", "aria-label": "Duplicate template", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return handleDeleteTemplate(template.id); }, variant: "outline", className: "px-3 text-red-600 hover:text-red-700 hover:bg-red-50", "aria-label": "Delete template", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4" }) })] })), template.is_public && ((0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-1 text-xs bg-green-100 text-green-700 rounded flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "w-3 h-3" }), "Public"] }))] })] }, template.id)); }) }), templates.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FolderOpen, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-4", children: "No templates available" }), currentRegions.length > 0 && ((0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return setShowSaveDialog(true); }, className: "bg-purple-600 hover:bg-purple-700", children: "Save Current as Template" }))] }))] }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogFooter, { children: (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: onClose, variant: "outline", children: "Close" }) })] }) }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showSaveDialog, onOpenChange: setShowSaveDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-md", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Save as Template" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Template Name *" }), (0, jsx_runtime_1.jsx)(Input_1.default, { value: templateName, onChange: function (e) { return setTemplateName(e.target.value); }, placeholder: "e.g., My Custom Dashboard", maxLength: 100 })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description (optional)" }), (0, jsx_runtime_1.jsx)("textarea", { value: templateDescription, onChange: function (e) { return setTemplateDescription(e.target.value); }, placeholder: "Describe what this template is for...", rows: 3, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none", maxLength: 500 })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-gray-50 p-3 rounded-lg", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-600", children: ["This will save ", currentRegions.length, " region", currentRegions.length !== 1 ? 's' : '', " as a template."] }) })] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () {
                                        setShowSaveDialog(false);
                                        setTemplateName('');
                                        setTemplateDescription('');
                                    }, variant: "outline", disabled: saving, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handleSaveTemplate, disabled: saving || !templateName.trim(), className: "bg-purple-600 hover:bg-purple-700", children: saving ? 'Saving...' : 'Save Template' })] })] }) }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showShareDialog, onOpenChange: setShowShareDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-md", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Share2, { className: "w-5 h-5" }), "Share Template"] }) }), selectedTemplate && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-gray-900 mb-2", children: selectedTemplate.name }), selectedTemplate.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-4", children: selectedTemplate.description }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [isPublic ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "w-5 h-5 text-green-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-5 h-5 text-gray-400" })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { className: "font-semibold", children: isPublic ? 'Public Template' : 'Private Template' }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600", children: isPublic
                                                                ? 'Anyone in your organization can view and use this template'
                                                                : 'Only you can view and use this template' })] })] }), (0, jsx_runtime_1.jsx)(Switch_1.Switch, { checked: isPublic, onCheckedChange: handleTogglePublic })] }), isPublic && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { children: "Share Link" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(Input_1.default, { value: shareLink, readOnly: true, className: "flex-1 font-mono text-sm" }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handleCopyLink, variant: "outline", className: "px-3", "aria-label": "Copy link", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Link, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "Share this link with others in your organization to let them use this template" })] }))] })), (0, jsx_runtime_1.jsx)(Dialog_1.DialogFooter, { children: (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return setShowShareDialog(false); }, variant: "outline", children: "Close" }) })] }) })] }));
};
exports.TemplateManager = TemplateManager;
