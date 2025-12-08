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
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var layoutStorage_1 = require("@/services/layoutStorage");
var LayoutManager = function (_a) {
    var currentLayout = _a.currentLayout, currentZoom = _a.currentZoom, currentPan = _a.currentPan, isOpen = _a.isOpen, onClose = _a.onClose, onLoadLayout = _a.onLoadLayout;
    var _b = (0, react_1.useState)([]), layouts = _b[0], setLayouts = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(null), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(''), searchQuery = _e[0], setSearchQuery = _e[1];
    var _f = (0, react_1.useState)(false), showSaveForm = _f[0], setShowSaveForm = _f[1];
    var _g = (0, react_1.useState)(null), editingLayout = _g[0], setEditingLayout = _g[1];
    var _h = (0, react_1.useState)(new Set()), selectedLayouts = _h[0], setSelectedLayouts = _h[1];
    var _j = (0, react_1.useState)(null), notification = _j[0], setNotification = _j[1];
    var fileInputRef = (0, react_1.useRef)(null);
    // Save form state
    var _k = (0, react_1.useState)({
        name: '',
        description: '',
        tags: [],
        isPublic: false
    }), saveForm = _k[0], setSaveForm = _k[1];
    // Edit form state
    var _l = (0, react_1.useState)({
        name: '',
        description: '',
        tags: [],
        isPublic: false
    }), editForm = _l[0], setEditForm = _l[1];
    // Load layouts on mount
    (0, react_1.useEffect)(function () {
        if (isOpen) {
            loadLayouts();
        }
    }, [isOpen]);
    var showNotification = function (type, message) {
        setNotification({ type: type, message: message });
        setTimeout(function () { return setNotification(null); }, 3000);
    };
    var loadLayouts = function () { return __awaiter(void 0, void 0, void 0, function () {
        var userLayouts, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, layoutStorage_1.layoutStorage.getUserLayouts()];
                case 1:
                    userLayouts = _a.sent();
                    setLayouts(userLayouts);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'Failed to load layouts');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSaveLayout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var layoutWithViewport, err_2, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!saveForm.name.trim())
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    setLoading(true);
                    setError(null);
                    layoutWithViewport = __assign(__assign({}, currentLayout), { zoom: currentZoom, pan: currentPan });
                    return [4 /*yield*/, layoutStorage_1.layoutStorage.saveLayout(saveForm.name, layoutWithViewport, saveForm.description || undefined, saveForm.tags.length > 0 ? saveForm.tags : undefined, saveForm.isPublic)];
                case 2:
                    _a.sent();
                    setSaveForm({ name: '', description: '', tags: [], isPublic: false });
                    setShowSaveForm(false);
                    return [4 /*yield*/, loadLayouts()];
                case 3:
                    _a.sent();
                    showNotification('success', 'Layout saved successfully!');
                    return [3 /*break*/, 6];
                case 4:
                    err_2 = _a.sent();
                    errorMessage = err_2 instanceof Error ? err_2.message : 'Failed to save layout';
                    setError(errorMessage);
                    showNotification('error', errorMessage);
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleLoadLayout = function (layoutId) { return __awaiter(void 0, void 0, void 0, function () {
        var layoutData, err_3, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, layoutStorage_1.layoutStorage.loadLayoutData(layoutId)];
                case 1:
                    layoutData = _a.sent();
                    if (layoutData) {
                        onLoadLayout(layoutData);
                        onClose();
                        showNotification('success', 'Layout loaded successfully!');
                    }
                    return [3 /*break*/, 4];
                case 2:
                    err_3 = _a.sent();
                    errorMessage = err_3 instanceof Error ? err_3.message : 'Failed to load layout';
                    setError(errorMessage);
                    showNotification('error', errorMessage);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDuplicateLayout = function (layoutId) { return __awaiter(void 0, void 0, void 0, function () {
        var layout, layoutData, err_4, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 6]);
                    setLoading(true);
                    setError(null);
                    layout = layouts.find(function (l) { return l.id === layoutId; });
                    if (!layout) {
                        throw new Error('Layout not found');
                    }
                    return [4 /*yield*/, layoutStorage_1.layoutStorage.loadLayoutData(layoutId)];
                case 1:
                    layoutData = _a.sent();
                    if (!layoutData) {
                        throw new Error('Failed to load layout data');
                    }
                    return [4 /*yield*/, layoutStorage_1.layoutStorage.saveLayout("".concat(layout.name, " (Copy)"), layoutData, layout.description, layout.tags, layout.is_public)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loadLayouts()];
                case 3:
                    _a.sent();
                    showNotification('success', 'Layout duplicated successfully!');
                    return [3 /*break*/, 6];
                case 4:
                    err_4 = _a.sent();
                    errorMessage = err_4 instanceof Error ? err_4.message : 'Failed to duplicate layout';
                    setError(errorMessage);
                    showNotification('error', errorMessage);
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var toggleLayoutSelection = function (layoutId) {
        setSelectedLayouts(function (prev) {
            var newSet = new Set(prev);
            if (newSet.has(layoutId)) {
                newSet.delete(layoutId);
            }
            else {
                newSet.add(layoutId);
            }
            return newSet;
        });
    };
    var handleBulkExport = function () { return __awaiter(void 0, void 0, void 0, function () {
        var layoutsToExport, exportData, blob, url, link, errorMessage;
        return __generator(this, function (_a) {
            try {
                layoutsToExport = selectedLayouts.size > 0
                    ? layouts.filter(function (layout) { return selectedLayouts.has(layout.id); })
                    : layouts;
                exportData = {
                    version: '2.0',
                    exportedAt: Date.now(),
                    layouts: layoutsToExport.map(function (layout) { return ({
                        name: layout.name,
                        description: layout.description,
                        tags: layout.tags,
                        is_public: layout.is_public,
                        created_at: layout.created_at,
                        updated_at: layout.updated_at
                    }); })
                };
                blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                url = window.URL.createObjectURL(blob);
                link = document.createElement('a');
                link.href = url;
                link.download = "verocards-layouts-export-".concat(new Date().toISOString().split('T')[0], ".json");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                showNotification('success', "Exported ".concat(layoutsToExport.length, " layouts successfully!"));
            }
            catch (err) {
                errorMessage = err instanceof Error ? err.message : 'Failed to export layouts';
                setError(errorMessage);
                showNotification('error', errorMessage);
            }
            return [2 /*return*/];
        });
    }); };
    var handleBulkDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        var deletePromises, err_5, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("Are you sure you want to delete ".concat(selectedLayouts.size, " layout(s)? This cannot be undone."))) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    setLoading(true);
                    setError(null);
                    deletePromises = Array.from(selectedLayouts).map(function (id) { return layoutStorage_1.layoutStorage.deleteLayout(id); });
                    return [4 /*yield*/, Promise.all(deletePromises)];
                case 2:
                    _a.sent();
                    setSelectedLayouts(new Set());
                    return [4 /*yield*/, loadLayouts()];
                case 3:
                    _a.sent();
                    showNotification('success', "Deleted ".concat(selectedLayouts.size, " layouts successfully!"));
                    return [3 /*break*/, 6];
                case 4:
                    err_5 = _a.sent();
                    errorMessage = err_5 instanceof Error ? err_5.message : 'Failed to delete layouts';
                    setError(errorMessage);
                    showNotification('error', errorMessage);
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteLayout = function (layoutId) { return __awaiter(void 0, void 0, void 0, function () {
        var err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Are you sure you want to delete this layout?'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, layoutStorage_1.layoutStorage.deleteLayout(layoutId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loadLayouts()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_6 = _a.sent();
                    setError(err_6 instanceof Error ? err_6.message : 'Failed to delete layout');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleUpdateLayout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var updateData, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!editingLayout || !editForm.name.trim())
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    setLoading(true);
                    setError(null);
                    updateData = {
                        name: editForm.name,
                        tags: editForm.tags.length > 0 ? editForm.tags : [],
                        is_public: editForm.isPublic
                    };
                    if (editForm.description) {
                        updateData.description = editForm.description;
                    }
                    return [4 /*yield*/, layoutStorage_1.layoutStorage.updateLayout(editingLayout.id, updateData)];
                case 2:
                    _a.sent();
                    setEditingLayout(null);
                    return [4 /*yield*/, loadLayouts()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_7 = _a.sent();
                    setError(err_7 instanceof Error ? err_7.message : 'Failed to update layout');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var startEdit = function (layout) {
        setEditingLayout(layout);
        setEditForm({
            name: layout.name,
            description: layout.description || '',
            tags: layout.tags || [],
            isPublic: layout.is_public
        });
    };
    var handleDownloadLayout = function (layoutId) { return __awaiter(void 0, void 0, void 0, function () {
        var err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, layoutStorage_1.layoutStorage.downloadLayout(layoutId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    err_8 = _a.sent();
                    setError(err_8 instanceof Error ? err_8.message : 'Failed to download layout');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleUploadLayout = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var file, err_9;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!file)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, 5, 6]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, layoutStorage_1.layoutStorage.uploadLayout(file)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, loadLayouts()];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_9 = _b.sent();
                    setError(err_9 instanceof Error ? err_9.message : 'Failed to upload layout');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6:
                    // Reset file input
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var filteredLayouts = layouts.filter(function (layout) {
        return layout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (layout.description && layout.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (layout.tags && layout.tags.some(function (tag) { return tag.toLowerCase().includes(searchQuery.toLowerCase()); }));
    });
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [notification && ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-4 right-4 z-60", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ".concat(notification.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'), children: [notification.type === 'success' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "w-4 h-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4" })), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: notification.message })] }) })), (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-[9999]", onClick: onClose }), (0, jsx_runtime_1.jsxs)("div", { className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] max-h-[80vh] bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Layout Manager" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "p-2 rounded-lg hover:bg-gray-100 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-5 w-5 text-gray-500" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 overflow-hidden flex flex-col", children: [error && ((0, jsx_runtime_1.jsx)("div", { className: "mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600", children: error }) })), (0, jsx_runtime_1.jsx)("div", { className: "p-6 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setShowSaveForm(!showSaveForm); }, className: "flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "w-4 h-4" }), "Save Current Layout"] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileUp, { className: "w-4 h-4" }), "Upload Layout File", (0, jsx_runtime_1.jsx)("input", { ref: fileInputRef, type: "file", accept: ".json", onChange: handleUploadLayout, className: "hidden" })] }), selectedLayouts.size > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: handleBulkExport, className: "flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4" }), "Export (", selectedLayouts.size, ")"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleBulkDelete, className: "flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4" }), "Delete (", selectedLayouts.size, ")"] })] })), showSaveForm && ((0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Layout name...", value: saveForm.name, onChange: function (e) { return setSaveForm(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }, className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSaveLayout, disabled: !saveForm.name.trim() || loading, className: "px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors", children: "Save" })] }))] }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-6 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search layouts...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); }, className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-y-auto p-6", children: loading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center py-8", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" }) })) : filteredLayouts.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500", children: "No layouts found" }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-4", children: filteredLayouts.map(function (layout) { return ((0, jsx_runtime_1.jsx)("div", { className: "border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedLayouts.has(layout.id), onChange: function () { return toggleLayoutSelection(layout.id); }, className: "mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900", children: layout.name }), layout.is_public ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "w-4 h-4 text-green-500", "aria-label": "Public" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-4 h-4 text-gray-400", "aria-label": "Private" }))] }), layout.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-2", children: layout.description })), layout.tags && layout.tags.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1 mb-2", children: layout.tags.map(function (tag, index) { return ((0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Tag, { className: "w-3 h-3 mr-1" }), tag] }, index)); }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)("span", { children: new Date(layout.created_at).toLocaleDateString() }), (0, jsx_runtime_1.jsx)("span", { children: layout.file_size ? "".concat(Math.round(layout.file_size / 1024), "KB") : 'Unknown size' })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 ml-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleLoadLayout(layout.id); }, className: "p-2 text-green-600 hover:bg-green-100 rounded transition-colors", title: "Load Layout", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleDownloadLayout(layout.id); }, className: "p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors", title: "Download Layout File", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleDuplicateLayout(layout.id); }, className: "p-2 text-purple-600 hover:bg-purple-100 rounded transition-colors", title: "Duplicate Layout", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return startEdit(layout); }, className: "p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors", title: "Edit Layout", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit2, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleDeleteLayout(layout.id); }, className: "p-2 text-red-600 hover:bg-red-100 rounded transition-colors", title: "Delete Layout", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4" }) })] })] }) }, layout.id)); }) })) })] }), editingLayout && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-96 bg-white rounded-xl shadow-2xl border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Edit Layout" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: editForm.name, onChange: function (e) { return setEditForm(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { value: editForm.description, onChange: function (e) { return setEditForm(function (prev) { return (__assign(__assign({}, prev), { description: e.target.value })); }); }, rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tags (comma-separated)" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: editForm.tags.join(', '), onChange: function (e) { return setEditForm(function (prev) { return (__assign(__assign({}, prev), { tags: e.target.value.split(',').map(function (tag) { return tag.trim(); }).filter(Boolean) })); }); }, placeholder: "dashboard, productivity, custom", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: "isPublic", checked: editForm.isPublic, onChange: function (e) { return setEditForm(function (prev) { return (__assign(__assign({}, prev), { isPublic: e.target.checked })); }); }, className: "mr-2" }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "isPublic", className: "text-sm text-gray-700", children: "Make this layout public (visible to other users in your organization)" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-2 mt-6", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setEditingLayout(null); }, className: "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleUpdateLayout, disabled: !editForm.name.trim() || loading, className: "px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 transition-colors", children: "Update" })] })] }) }) }))] })] }));
};
exports.default = LayoutManager;
