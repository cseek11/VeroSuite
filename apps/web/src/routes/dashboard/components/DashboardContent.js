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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardContent = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var index_1 = require("./index");
var LayoutManager_1 = __importDefault(require("@/components/dashboard/LayoutManager"));
var DialogModals_1 = require("@/components/ui/DialogModals");
var DrillDownModal_1 = __importDefault(require("@/components/dashboard/DrillDownModal"));
var MobileNavigation_1 = require("@/components/dashboard/MobileNavigation");
var KPIBuilder_1 = __importDefault(require("@/components/kpi/KPIBuilder"));
var KpiTemplateLibraryModal_1 = __importDefault(require("@/components/kpi/KpiTemplateLibraryModal"));
var TemplateLoadingIndicator_1 = require("./TemplateLoadingIndicator");
var kpiHandlers_1 = require("../utils/kpiHandlers");
var logger_1 = require("@/utils/logger");
var DashboardContent = function (_a) {
    var _b, _c, _d;
    var _e = _a.showHeader, showHeader = _e === void 0 ? true : _e, user = _a.user, scrollableContainerRef = _a.scrollableContainerRef, containerRef = _a.containerRef, dashboardState = _a.dashboardState, modalManagement = _a.modalManagement, errorHandling = _a.errorHandling, syncStatus = _a.syncStatus, smartKPIs = _a.smartKPIs, templateLoading = _a.templateLoading, layout = _a.layout, canvasHeight = _a.canvasHeight, isCollabConnected = _a.isCollabConnected, connectionStatus = _a.connectionStatus, collaborators = _a.collaborators, onToggleConnection = _a.onToggleConnection, applyTemplate = _a.applyTemplate, undo = _a.undo, redo = _a.redo, canUndo = _a.canUndo, canRedo = _a.canRedo, zoom = _a.zoom, pan = _a.pan, zoomIn = _a.zoomIn, zoomOut = _a.zoomOut, canZoomIn = _a.canZoomIn, canZoomOut = _a.canZoomOut, resetView = _a.resetView, handleResetAll = _a.handleResetAll, handleFullscreenToggle = _a.handleFullscreenToggle, handleMobileNavigate = _a.handleMobileNavigate, handleMobileSearch = _a.handleMobileSearch, handleToggleMobileView = _a.handleToggleMobileView, handleLoadPreset = _a.handleLoadPreset, handleGroupDeleteConfirm = _a.handleGroupDeleteConfirm, handlePanStart = _a.handlePanStart, getTransformStyle = _a.getTransformStyle, groups = _a.groups, selectedGroupId = _a.selectedGroupId, setSelectedGroupId = _a.setSelectedGroupId, updateGroup = _a.updateGroup, deleteGroup = _a.deleteGroup, ungroupCards = _a.ungroupCards, handleGroupDragStart = _a.handleGroupDragStart, handleGroupDeleteRequest = _a.handleGroupDeleteRequest, virtualScrolling = _a.virtualScrolling, renderVirtualCard = _a.renderVirtualCard, filteredCards = _a.filteredCards, cardTypes = _a.cardTypes, _kpiData = _a.kpiData, setKpiData = _a.setKpiData, availableKpiFields = _a.availableKpiFields, serverPersistence = _a.serverPersistence, localAddCard = _a.localAddCard, shortcuts = _a.shortcuts;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative flex flex-col", children: [showHeader && ((0, jsx_runtime_1.jsx)(index_1.DashboardFAB, { showCardSelector: dashboardState.showCardSelector, setShowCardSelector: dashboardState.setShowCardSelector, isCollabConnected: isCollabConnected, connectionStatus: connectionStatus, collaborators: collaborators.map(function (c) { return (__assign({ id: c.id, name: c.name }, (c.avatar_url ? { avatar: c.avatar_url } : {}))); }), onToggleConnection: onToggleConnection, undo: undo, redo: redo, canUndo: canUndo, canRedo: canRedo, setShowLayoutManager: dashboardState.setShowLayoutManager, zoom: zoom, zoomIn: zoomIn, zoomOut: zoomOut, canZoomIn: canZoomIn, canZoomOut: canZoomOut, resetView: resetView, cardsCount: Object.keys(layout.cards).length, handleResetAll: handleResetAll, handleFullscreenToggle: handleFullscreenToggle, isMobileFullscreen: dashboardState.isMobileFullscreen })), dashboardState.showMobileNavigation && ((0, jsx_runtime_1.jsx)(MobileNavigation_1.MobileNavigation, { currentPage: "dashboard", onNavigate: handleMobileNavigate, onSearch: handleMobileSearch, onToggleFullscreen: handleFullscreenToggle, isFullscreen: dashboardState.isMobileFullscreen, onToggleView: handleToggleMobileView, user: __assign({ name: (user === null || user === void 0 ? void 0 : user.name) || 'User', email: (user === null || user === void 0 ? void 0 : user.email) || 'user@example.com' }, ((user === null || user === void 0 ? void 0 : user.avatar_url) ? { avatar: user.avatar_url } : {})), onLogout: function () { } })), (0, jsx_runtime_1.jsxs)("div", { ref: scrollableContainerRef, className: "dashboard-content dashboard-scroll flex-1 overflow-hidden", style: { minHeight: "".concat(Math.max(600, canvasHeight), "px") }, children: [showHeader && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-4 right-4 z-40", children: (0, jsx_runtime_1.jsx)("button", { onClick: function () { return dashboardState.setShowKeyboardHelp(true); }, className: "p-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200", title: "Keyboard Shortcuts (?)", children: (0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "w-4 h-4" }) }) })), (0, jsx_runtime_1.jsxs)("div", { className: "max-w-full mx-auto", children: [(0, jsx_runtime_1.jsx)(index_1.DashboardCanvas, { containerRef: containerRef, canvasHeight: canvasHeight, handleDeselectAll: dashboardState.handleDeselectAll, handlePanStart: handlePanStart, getTransformStyle: getTransformStyle, groups: groups, updateGroup: updateGroup, deleteGroup: deleteGroup, ungroupCards: ungroupCards, selectedGroupId: selectedGroupId, setSelectedGroupId: setSelectedGroupId, handleGroupDragStart: handleGroupDragStart, handleGroupDeleteRequest: handleGroupDeleteRequest, isVirtualScrolling: virtualScrolling.isVirtualScrolling, filteredCards: Object.values(layout.cards), renderVirtualCard: renderVirtualCard, virtualScrollingThreshold: dashboardState.virtualScrollingThreshold, cardsLength: Object.keys(layout.cards).length, setShowCardSelector: dashboardState.setShowCardSelector }), showHeader && ((0, jsx_runtime_1.jsx)(index_1.StatusBar, { searchTerm: dashboardState.searchTerm, filteredCardsLength: filteredCards.length, totalCardsLength: Object.keys(layout.cards).length, isVirtualScrolling: virtualScrolling.isVirtualScrolling, virtualScrollingThreshold: dashboardState.virtualScrollingThreshold, currentLayout: layout.currentLayout || 'custom', applyTemplate: applyTemplate, syncStatus: syncStatus.status, lastSynced: syncStatus.lastSynced, syncErrorMessage: syncStatus.errorMessage }))] }), (0, jsx_runtime_1.jsx)(index_1.ErrorDisplay, { errors: errorHandling.errors.map(function (err) { return ({
                            id: err.id,
                            message: err.message,
                            operation: 'unknown',
                            timestamp: err.timestamp,
                            retryable: err.retryable || false,
                            retryCount: 0
                        }); }), onDismiss: errorHandling.clearError, onRetry: function (errorId) {
                            errorHandling.retryOperation(errorId);
                        } }), (0, jsx_runtime_1.jsx)(index_1.KeyboardShortcutsModal, { showKeyboardHelp: dashboardState.showKeyboardHelp, setShowKeyboardHelp: dashboardState.setShowKeyboardHelp, shortcuts: Object.entries(shortcuts).flatMap(function (_a) {
                            var key = _a[0], value = _a[1];
                            return value.keys.map(function (k) { return ({
                                key: k,
                                description: value.description,
                                action: key,
                                category: 'general'
                            }); });
                        }) }), (0, jsx_runtime_1.jsx)(index_1.CardSelector, { showCardSelector: dashboardState.showCardSelector, setShowCardSelector: dashboardState.setShowCardSelector, cardTypes: cardTypes, handleAddCard: function (type) {
                            serverPersistence.addCard(type).then(function (cardId) {
                                dashboardState.setSelectedCards(new Set([cardId]));
                            });
                        } }), (0, jsx_runtime_1.jsx)(LayoutManager_1.default, { currentLayout: __assign({ cards: Object.fromEntries(Object.entries(layout.cards).map(function (_a) {
                                var id = _a[0], card = _a[1];
                                return [
                                    id,
                                    {
                                        id: card.id,
                                        x: card.x,
                                        y: card.y,
                                        width: card.width,
                                        height: card.height,
                                        type: card.type,
                                        visible: true
                                    }
                                ];
                            })), canvasHeight: canvasHeight, theme: 'light' }, (layout.currentLayout ? { currentLayout: layout.currentLayout } : { currentLayout: 'custom' })), currentZoom: zoom, currentPan: pan, isOpen: dashboardState.showLayoutManager, onClose: function () { return dashboardState.setShowLayoutManager(false); }, onLoadLayout: function (dashboardLayout) {
                            var layoutType = dashboardLayout.currentLayout || 'custom';
                            handleLoadPreset({
                                id: layoutType,
                                name: layoutType === 'custom' ? 'Custom' : layoutType.charAt(0).toUpperCase() + layoutType.slice(1),
                                layout: {
                                    cards: dashboardLayout.cards,
                                    currentLayout: layoutType
                                }
                            });
                        } }), (0, jsx_runtime_1.jsx)(DialogModals_1.AlertDialog, { open: modalManagement.alertModal.isOpen, onOpenChange: function (open) { return modalManagement.setAlertModal(function (prev) { return (__assign(__assign({}, prev), { isOpen: open })); }); }, title: modalManagement.alertModal.title, message: modalManagement.alertModal.message, type: modalManagement.alertModal.type }), (0, jsx_runtime_1.jsx)(DialogModals_1.ConfirmDialog, { open: modalManagement.confirmModal.isOpen, onOpenChange: function (open) { return modalManagement.setConfirmModal(function (prev) { return (__assign(__assign({}, prev), { isOpen: open })); }); }, onConfirm: function () {
                            if (modalManagement.confirmModal.onConfirm) {
                                modalManagement.confirmModal.onConfirm();
                            }
                            modalManagement.setConfirmModal(function (prev) { return (__assign(__assign({}, prev), { isOpen: false })); });
                        }, title: modalManagement.confirmModal.title, message: modalManagement.confirmModal.message, type: modalManagement.confirmModal.type }), (0, jsx_runtime_1.jsx)(DialogModals_1.PromptDialog, { open: modalManagement.promptModal.isOpen, onOpenChange: function (open) { return modalManagement.setPromptModal(function (prev) { return (__assign(__assign({}, prev), { isOpen: open })); }); }, onConfirm: modalManagement.promptModal.onConfirm || (function (_value) { }), title: modalManagement.promptModal.title, message: modalManagement.promptModal.message, placeholder: modalManagement.promptModal.placeholder, defaultValue: modalManagement.promptModal.defaultValue }), (0, jsx_runtime_1.jsx)(DrillDownModal_1.default, { isOpen: smartKPIs.isDrillDownOpen, onClose: function () { return smartKPIs.setIsDrillDownOpen(false); }, kpi: smartKPIs.selectedKPI ? {
                            id: smartKPIs.selectedKPI.id,
                            metric: smartKPIs.selectedKPI.metric,
                            value: 0,
                            threshold: {
                                green: smartKPIs.selectedKPI.threshold.green,
                                yellow: smartKPIs.selectedKPI.threshold.yellow,
                                red: smartKPIs.selectedKPI.threshold.yellow * 1.5,
                                unit: (_b = smartKPIs.selectedKPI.threshold.unit) !== null && _b !== void 0 ? _b : ''
                            },
                            trend: 'stable',
                            lastUpdated: new Date().toISOString(),
                            category: smartKPIs.selectedKPI.category || 'operational',
                            realTime: (_c = smartKPIs.selectedKPI.realTime) !== null && _c !== void 0 ? _c : false
                        } : null, data: smartKPIs.drillDownData || {} }), (0, jsx_runtime_1.jsx)(DialogModals_1.ConfirmDialog, { open: modalManagement.groupDeleteModal.isOpen, onOpenChange: function (open) { return modalManagement.setGroupDeleteModal(function (prev) { return (__assign(__assign({}, prev), { isOpen: open })); }); }, onConfirm: handleGroupDeleteConfirm, title: "Delete Group", message: "Delete group \"".concat(modalManagement.groupDeleteModal.groupName, "\" and all cards inside?"), type: "danger", confirmText: "Delete", cancelText: "Cancel" }), (0, jsx_runtime_1.jsx)(KPIBuilder_1.default, { isOpen: dashboardState.showKPIBuilder, onClose: function () { return dashboardState.setShowKPIBuilder(false); }, isEditingTemplate: false, onSaveTemplate: function (_template) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }, onUseTemplate: function (template) { return __awaiter(void 0, void 0, void 0, function () {
                            var error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, (0, kpiHandlers_1.handleKpiBuilderUseTemplate)(template, localAddCard, serverPersistence.currentLayoutId, function (data) { return setKpiData(data); }, dashboardState.setShowKPIBuilder)];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_1 = _a.sent();
                                        logger_1.logger.error('Failed to use KPI builder template', error_1, 'DashboardContent');
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }, onSave: function (kpi) { return __awaiter(void 0, void 0, void 0, function () {
                            var error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, (0, kpiHandlers_1.handleKpiBuilderSave)(kpi, serverPersistence.addCard, serverPersistence.currentLayoutId, function (data) { return setKpiData(data); }, dashboardState.setShowKPIBuilder)];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_2 = _a.sent();
                                        logger_1.logger.error('Failed to save KPI', error_2, 'DashboardContent');
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }, onTest: function (_kpi) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Promise(function (resolve) {
                                        setTimeout(function () {
                                            resolve({
                                                value: Math.floor(Math.random() * 100),
                                                status: 'success',
                                                timestamp: new Date().toISOString()
                                            });
                                        }, 1000);
                                    })];
                            });
                        }); }, availableFields: availableKpiFields.map(function (field) { return ({
                            id: field.id,
                            name: field.name,
                            type: field.type,
                            table: '',
                            column: ''
                        }); }) }), (0, jsx_runtime_1.jsx)(KpiTemplateLibraryModal_1.default, { isOpen: dashboardState.showTemplateLibrary || false, onClose: function () {
                            if (dashboardState.setShowTemplateLibrary) {
                                dashboardState.setShowTemplateLibrary(false);
                            }
                        }, onUseTemplate: function (template) { return __awaiter(void 0, void 0, void 0, function () {
                            var error_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, (0, kpiHandlers_1.handleTemplateLibraryUseTemplate)(template, localAddCard, serverPersistence.currentLayoutId, function (data) { return setKpiData(data); }, dashboardState.setShowTemplateLibrary || (function () { }))];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_3 = _a.sent();
                                        logger_1.logger.error('Failed to use KPI template library item', error_3, 'DashboardContent');
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); } }), (0, jsx_runtime_1.jsx)(TemplateLoadingIndicator_1.TemplateLoadingIndicator, { isLoading: templateLoading.isLoading, error: templateLoading.error || null, templatesCount: ((_d = templateLoading.templates) === null || _d === void 0 ? void 0 : _d.length) || 0, onRetry: templateLoading.retry || (function () { }), onDismiss: templateLoading.clearError || (function () { }), canRetry: templateLoading.canRetry || false, autoHideDelay: 4000 })] })] }));
};
exports.DashboardContent = DashboardContent;
