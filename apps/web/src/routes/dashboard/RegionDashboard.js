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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionDashboard = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var useRegionLayout_1 = require("@/hooks/useRegionLayout");
var useLayoutVersioning_1 = require("@/hooks/useLayoutVersioning");
var useZoomPan_1 = require("@/hooks/useZoomPan");
var regionStore_1 = require("@/stores/regionStore");
var useLayoutIntelligence_1 = require("@/hooks/useLayoutIntelligence");
var RegionGrid_1 = require("@/components/dashboard/regions/RegionGrid");
var VirtualizedRegionGrid_1 = require("@/components/dashboard/regions/VirtualizedRegionGrid");
var MinimizedRegionDock_1 = require("@/components/dashboard/regions/MinimizedRegionDock");
var MobileDashboard_1 = require("@/components/dashboard/regions/MobileDashboard");
var FloatingNavBar_1 = require("@/components/dashboard/layered-ui/FloatingNavBar");
var UtilityDock_1 = require("@/components/dashboard/layered-ui/UtilityDock");
var CommandPalette_1 = require("@/components/dashboard/layered-ui/CommandPalette");
var InspectorPanel_1 = require("@/components/dashboard/layered-ui/InspectorPanel");
var region_types_1 = require("@/routes/dashboard/types/region.types");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var ErrorBoundary_1 = require("@/components/ErrorBoundary");
var toast_1 = require("@/utils/toast");
var ConflictResolutionDialog_1 = require("@/components/dashboard/regions/ConflictResolutionDialog");
var featureFlags_1 = require("@/lib/featureFlags");
var DashboardOnboarding_1 = require("@/components/dashboard/onboarding/DashboardOnboarding");
var EmptyDashboard_1 = require("@/components/dashboard/EmptyDashboard");
var OfflineIndicator_1 = require("@/components/dashboard/OfflineIndicator");
var TemplateManager_1 = require("@/components/dashboard/templates/TemplateManager");
var RegionDashboard = function (_a) {
    var layoutId = _a.layoutId, _userId = _a.userId;
    var _b = (0, react_1.useState)(null), currentLayoutId = _b[0], setCurrentLayoutId = _b[1];
    var _c = (0, react_1.useState)(true), loadingLayout = _c[0], setLoadingLayout = _c[1];
    var _d = (0, react_1.useState)(false), isScrolled = _d[0], setIsScrolled = _d[1];
    // Load default layout on mount
    (0, react_1.useEffect)(function () {
        var loadDefaultLayout = function () { return __awaiter(void 0, void 0, void 0, function () {
            var layout, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, 5, 6]);
                        setLoadingLayout(true);
                        if (!(!layoutId || layoutId.trim() === '')) return [3 /*break*/, 2];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.getOrCreateDefault()];
                    case 1:
                        layout = _a.sent();
                        if (layout === null || layout === void 0 ? void 0 : layout.id) {
                            setCurrentLayoutId(layout.id);
                        }
                        else {
                            throw new Error('Failed to get or create default layout');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        setCurrentLayoutId(layoutId);
                        _a.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        logger_1.logger.error('Failed to load layout', { error: error_1, layoutId: layoutId }, 'RegionDashboard');
                        return [3 /*break*/, 6];
                    case 5:
                        setLoadingLayout(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        loadDefaultLayout();
    }, [layoutId]);
    var _e = (0, useRegionLayout_1.useRegionLayout)({
        layoutId: currentLayoutId || '',
        autoSave: true,
        debounceMs: 500
    }), regions = _e.regions, regionsLoading = _e.loading, regionsError = _e.error, addRegion = _e.addRegion, removeRegion = _e.removeRegion, updateRegionPosition = _e.updateRegionPosition, updateRegionSize = _e.updateRegionSize, toggleCollapse = _e.toggleCollapse, toggleLock = _e.toggleLock, loadRoleDefaults = _e.loadRoleDefaults, updateRegionInStore = _e.updateRegion;
    var _f = (0, useLayoutVersioning_1.useLayoutVersioning)({
        layoutId: currentLayoutId || ''
    }), _versions = _f.versions, _versionsLoading = _f.loading, _currentVersion = _f.currentVersion, _createVersion = _f.createVersion, _publishVersion = _f.publishVersion, _revertToVersion = _f.revertToVersion, _loadVersions = _f.loadVersions;
    var _g = (0, react_1.useState)(false), showAddRegionDialog = _g[0], setShowAddRegionDialog = _g[1];
    var _h = (0, react_1.useState)(new Map()), minimizedRegions = _h[0], _setMinimizedRegions = _h[1];
    var _j = (0, react_1.useState)(true), utilityDockVisible = _j[0], _setUtilityDockVisible = _j[1];
    var _k = (0, react_1.useState)(false), inspectorOpen = _k[0], setInspectorOpen = _k[1];
    var _l = (0, react_1.useState)(null), inspectorContent = _l[0], setInspectorContent = _l[1];
    var _m = (0, react_1.useState)(new Set()), activeFilters = _m[0], setActiveFilters = _m[1];
    var _o = (0, react_1.useState)({
        types: [],
        status: 'all',
        dateRange: 'all'
    }), advancedFilters = _o[0], setAdvancedFilters = _o[1];
    // Onboarding state
    var _p = (0, react_1.useState)(false), showOnboarding = _p[0], setShowOnboarding = _p[1];
    var _q = (0, react_1.useState)(false), showEmptyState = _q[0], setShowEmptyState = _q[1];
    var _r = (0, react_1.useState)(false), showTemplateManager = _r[0], setShowTemplateManager = _r[1];
    // Check if user has completed onboarding
    (0, react_1.useEffect)(function () {
        var hasCompletedOnboarding = localStorage.getItem('dashboard_onboarding_complete');
        var hasRegions = regions.length > 0;
        // Show onboarding if not completed and no regions
        if (!hasCompletedOnboarding && !hasRegions && !loadingLayout && !regionsLoading) {
            setShowOnboarding(true);
        }
        // Show empty state if no regions but onboarding completed
        if (hasCompletedOnboarding && !hasRegions && !loadingLayout && !regionsLoading) {
            setShowEmptyState(true);
        }
        else {
            setShowEmptyState(false);
        }
    }, [regions.length, loadingLayout, regionsLoading]);
    // Mobile detection and feature flag
    var _s = (0, react_1.useState)(false), isMobile = _s[0], setIsMobile = _s[1];
    var mobileBetaEnabled = (0, featureFlags_1.useFeatureFlag)('DASHBOARD_MOBILE_BETA');
    // Virtualization feature flag and threshold
    var virtualizationEnabled = (0, featureFlags_1.useFeatureFlag)('DASHBOARD_VIRTUALIZATION');
    var VIRTUALIZATION_THRESHOLD = 50; // Use virtualization when > 50 regions
    (0, react_1.useEffect)(function () {
        var checkMobile = function () {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return function () { return window.removeEventListener('resize', checkMobile); };
    }, []);
    // Conflict resolution
    var conflicts = (0, regionStore_1.useRegionStore)(function (state) { return Array.from(state.conflicts.values()); });
    var resolveConflict = (0, regionStore_1.useRegionStore)(function (state) { return state.resolveConflict; });
    var clearConflict = (0, regionStore_1.useRegionStore)(function (state) { return state.clearConflict; });
    // Undo/Redo from store
    var saveLayoutSnapshot = (0, regionStore_1.useRegionStore)(function (state) { return state.saveLayoutSnapshot; });
    var undoLayout = (0, regionStore_1.useRegionStore)(function (state) { return state.undoLayout; });
    var redoLayout = (0, regionStore_1.useRegionStore)(function (state) { return state.redoLayout; });
    var canUndoStore = (0, regionStore_1.useRegionStore)(function (state) { return state.canUndo; });
    var canRedoStore = (0, regionStore_1.useRegionStore)(function (state) { return state.canRedo; });
    var _t = (0, react_1.useState)(''), searchTerm = _t[0], setSearchTerm = _t[1];
    // Zoom and pan functionality
    var _u = (0, useZoomPan_1.useZoomPan)(), containerRef = _u.containerRef, zoom = _u.zoom, zoomIn = _u.zoomIn, zoomOut = _u.zoomOut, resetView = _u.resetView, handlePanStart = _u.handlePanStart, getTransformStyle = _u.getTransformStyle, calculateCanvasSize = _u.calculateCanvasSize;
    // Track scroll state from the scroll container
    (0, react_1.useEffect)(function () {
        var el = containerRef.current;
        if (!el)
            return;
        var onScroll = function () { return setIsScrolled((el.scrollTop || 0) > 100); };
        onScroll();
        el.addEventListener('scroll', onScroll);
        return function () { return el.removeEventListener('scroll', onScroll); };
    }, [containerRef]);
    // Calculate canvas bounds from regions
    var canvasBounds = (0, react_1.useMemo)(function () {
        if (regions.length === 0) {
            return { width: 0, height: 0, minX: 0, minY: 0, maxX: 0, maxY: 0 };
        }
        var rowHeight = 100;
        var colWidth = 100; // Approximate based on rowHeight
        var gap = 16;
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        regions.forEach(function (region) {
            var x = region.grid_col * (colWidth + gap);
            var y = region.grid_row * (rowHeight + gap);
            var width = region.col_span * (colWidth + gap) - gap;
            var height = region.row_span * (rowHeight + gap) - gap;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + width);
            maxY = Math.max(maxY, y + height);
        });
        return {
            width: maxX - minX,
            height: maxY - minY,
            minX: minX === Infinity ? 0 : minX,
            minY: minY === Infinity ? 0 : minY,
            maxX: maxX === -Infinity ? 0 : maxX,
            maxY: maxY === -Infinity ? 0 : maxY
        };
    }, [regions]);
    // Calculate dynamic canvas size
    var canvasSize = (0, react_1.useMemo)(function () {
        return calculateCanvasSize(canvasBounds);
    }, [canvasBounds, calculateCanvasSize]);
    // Memoize filtered regions for performance
    var filteredRegions = (0, react_1.useMemo)(function () {
        return regions.filter(function (r) {
            var _a, _b;
            // Apply advanced status filter
            if (advancedFilters.status !== 'all') {
                if (advancedFilters.status === 'active' && r.is_locked)
                    return false;
                if (advancedFilters.status === 'locked' && !r.is_locked)
                    return false;
                if (advancedFilters.status === 'collapsed' && !r.is_collapsed)
                    return false;
            }
            // Filter out collapsed regions (unless specifically filtering for them)
            if (r.is_collapsed && advancedFilters.status !== 'collapsed')
                return false;
            // Apply region type filter
            if (advancedFilters.types.length > 0 && !advancedFilters.types.includes(r.region_type)) {
                return false;
            }
            // Apply date range filter
            if (advancedFilters.dateRange !== 'all') {
                var now = new Date();
                var regionDate = new Date(r.updated_at || r.created_at);
                var diffMs = now.getTime() - regionDate.getTime();
                var diffDays = diffMs / (1000 * 60 * 60 * 24);
                if (advancedFilters.dateRange === 'today' && diffDays >= 1)
                    return false;
                if (advancedFilters.dateRange === 'week' && diffDays >= 7)
                    return false;
                if (advancedFilters.dateRange === 'month' && diffDays >= 30)
                    return false;
            }
            // Apply search filter
            if (searchTerm) {
                var term = searchTerm.toLowerCase();
                var matchesSearch = r.region_type.toLowerCase().includes(term) ||
                    (((_a = r.config) === null || _a === void 0 ? void 0 : _a.title) && r.config.title.toLowerCase().includes(term)) ||
                    (((_b = r.config) === null || _b === void 0 ? void 0 : _b.description) && r.config.description.toLowerCase().includes(term));
                if (!matchesSearch)
                    return false;
            }
            // Apply legacy active filters (for backward compatibility)
            if (activeFilters.has('active') && r.is_locked)
                return false;
            if (activeFilters.has('locked') && !r.is_locked)
                return false;
            return true;
        });
    }, [regions, searchTerm, activeFilters, advancedFilters]);
    var shouldUseVirtualization = virtualizationEnabled && filteredRegions.length > VIRTUALIZATION_THRESHOLD;
    // Undo/Redo functionality
    // Use store's undo/redo methods (already defined above)
    // Layout Intelligence
    var _v = (0, useLayoutIntelligence_1.useLayoutIntelligence)({
        regions: regions,
        userRole: 'user', // TODO: Get from auth store
        currentTime: new Date(),
        workloadMetrics: {
            activeJobs: 0, // TODO: Get from API
            pendingTasks: 0,
            peakHours: new Date().getHours() >= 8 && new Date().getHours() <= 18
        }
    }), _mode = _v.mode, _setMode = _v.setMode, _suggestedLayout = _v.suggestedLayout, _optimizeLayout = _v.optimizeLayout, _getContextualBehavior = _v.getContextualBehavior;
    // Save state to history when regions change (debounced)
    (0, react_1.useEffect)(function () {
        if (!(regions.length > 0 && currentLayoutId)) {
            return;
        }
        var timer = setTimeout(function () {
            saveLayoutSnapshot(currentLayoutId);
        }, 500); // Debounce snapshot saving
        return function () { return clearTimeout(timer); };
    }, [regions, currentLayoutId, saveLayoutSnapshot]);
    // Handle undo/redo using store methods
    var handleUndo = function () { return __awaiter(void 0, void 0, void 0, function () {
        var success, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentLayoutId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, undoLayout(currentLayoutId)];
                case 2:
                    success = _a.sent();
                    if (success) {
                        toast_1.toast.success('Undone');
                    }
                    else {
                        toast_1.toast.info('Nothing to undo');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    logger_1.logger.error('Failed to undo', { error: error_2 }, 'RegionDashboard');
                    toast_1.toast.error('Failed to undo');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleRedo = function () { return __awaiter(void 0, void 0, void 0, function () {
        var success, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentLayoutId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, redoLayout(currentLayoutId)];
                case 2:
                    success = _a.sent();
                    if (success) {
                        toast_1.toast.success('Redone');
                    }
                    else {
                        toast_1.toast.info('Nothing to redo');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    logger_1.logger.error('Failed to redo', { error: error_3 }, 'RegionDashboard');
                    toast_1.toast.error('Failed to redo');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleResetAll = function () { return __awaiter(void 0, void 0, void 0, function () {
        var currentRegions, _i, currentRegions_1, region, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm('Are you sure you want to reset all regions? This cannot be undone.')) return [3 /*break*/, 9];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    // Reset zoom and pan
                    resetView();
                    currentRegions = __spreadArray([], regions, true);
                    _i = 0, currentRegions_1 = currentRegions;
                    _a.label = 2;
                case 2:
                    if (!(_i < currentRegions_1.length)) return [3 /*break*/, 5];
                    region = currentRegions_1[_i];
                    return [4 /*yield*/, removeRegion(region.id)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: 
                // Wait a bit for deletions to complete
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 6:
                    // Wait a bit for deletions to complete
                    _a.sent();
                    // Reset to default layout
                    return [4 /*yield*/, loadRoleDefaults('default')];
                case 7:
                    // Reset to default layout
                    _a.sent();
                    toast_1.toast.success('Dashboard reset successfully');
                    return [3 /*break*/, 9];
                case 8:
                    error_4 = _a.sent();
                    logger_1.logger.error('Failed to reset all', { error: error_4 }, 'RegionDashboard');
                    toast_1.toast.error('Failed to reset dashboard');
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var handleAddRegion = function (type, position) { return __awaiter(void 0, void 0, void 0, function () {
        var scrollTop_1, error_5, errorMessage, fullMessage;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    if (!currentLayoutId || currentLayoutId.trim() === '') {
                        toast_1.toast.error('Cannot add region: Layout is not loaded yet. Please wait...');
                        logger_1.logger.error('Cannot add region: currentLayoutId is missing', { currentLayoutId: currentLayoutId }, 'RegionDashboard');
                        return [2 /*return*/];
                    }
                    if (!type) return [3 /*break*/, 2];
                    scrollTop_1 = ((_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.scrollTop) || 0;
                    return [4 /*yield*/, addRegion(type, position)];
                case 1:
                    _b.sent();
                    setShowAddRegionDialog(false);
                    toast_1.toast.success('Region added successfully');
                    // Restore scroll after render
                    requestAnimationFrame(function () {
                        if (containerRef.current) {
                            containerRef.current.scrollTop = scrollTop_1;
                        }
                    });
                    _b.label = 2;
                case 2: return [3 /*break*/, 4];
                case 3:
                    error_5 = _b.sent();
                    errorMessage = error_5 instanceof Error ? error_5.message : 'Failed to add region';
                    logger_1.logger.error('Failed to add region', { error: error_5, type: type, position: position, currentLayoutId: currentLayoutId }, 'RegionDashboard');
                    fullMessage = errorMessage;
                    if ((error_5 === null || error_5 === void 0 ? void 0 : error_5.validationErrors) && Array.isArray(error_5.validationErrors)) {
                        fullMessage = "".concat(errorMessage, "\n\n").concat(error_5.validationErrors.map(function (e, i) { return "  ".concat(i + 1, ". ").concat(e); }).join('\n'));
                    }
                    toast_1.toast.error("Failed to add region: ".concat(fullMessage), 8000);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleUpdateRegion = function (id, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var error_6, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Use store's updateRegion method (handles optimistic updates, queuing, and conflict resolution)
                    return [4 /*yield*/, updateRegionInStore(id, updates)];
                case 1:
                    // Use store's updateRegion method (handles optimistic updates, queuing, and conflict resolution)
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    errorMessage = error_6 instanceof Error ? error_6.message : 'Failed to update region';
                    logger_1.logger.error('Failed to update region', { error: error_6, regionId: id, updates: updates }, 'RegionDashboard');
                    toast_1.toast.error("Failed to update region: ".concat(errorMessage));
                    throw error_6;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleRemoveRegion = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var error_7, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, removeRegion(id)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    errorMessage = error_7 instanceof Error ? error_7.message : 'Failed to remove region';
                    logger_1.logger.error('Failed to remove region', { error: error_7, regionId: id }, 'RegionDashboard');
                    toast_1.toast.error("Failed to remove region: ".concat(errorMessage));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Export layout
    var handleExportLayout = function () {
        var layoutData = {
            layoutId: currentLayoutId,
            regions: regions,
            version: '1.0',
            exportedAt: new Date().toISOString(),
            metadata: {
                regionCount: regions.length,
                regionTypes: __spreadArray([], new Set(regions.map(function (r) { return r.region_type; })), true)
            }
        };
        var blob = new Blob([JSON.stringify(layoutData, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "dashboard-layout-".concat(currentLayoutId, "-").concat(Date.now(), ".json");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    // Load template
    var handleLoadTemplate = function (template) { return __awaiter(void 0, void 0, void 0, function () {
        var _i, regions_1, region, _a, _b, regionData, error_8;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 9, , 10]);
                    if (!currentLayoutId) {
                        toast_1.toast.error('No layout available');
                        return [2 /*return*/];
                    }
                    _i = 0, regions_1 = regions;
                    _c.label = 1;
                case 1:
                    if (!(_i < regions_1.length)) return [3 /*break*/, 4];
                    region = regions_1[_i];
                    return [4 /*yield*/, removeRegion(region.id)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    _a = 0, _b = template.regions;
                    _c.label = 5;
                case 5:
                    if (!(_a < _b.length)) return [3 /*break*/, 8];
                    regionData = _b[_a];
                    return [4 /*yield*/, addRegion(regionData.region_type, {
                            row: regionData.grid_row,
                            col: regionData.grid_col
                        })];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 5];
                case 8:
                    toast_1.toast.success('Template loaded successfully');
                    return [3 /*break*/, 10];
                case 9:
                    error_8 = _c.sent();
                    logger_1.logger.error('Failed to load template', { error: error_8 }, 'RegionDashboard');
                    toast_1.toast.error('Failed to load template');
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    // Import layout
    var handleImportLayout = function (event) {
        var _a;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        var reader = new FileReader();
        reader.onload = function (e) { return __awaiter(void 0, void 0, void 0, function () {
            var layoutData, validRegions, _i, regions_2, region, error_9, _a, validRegions_1, regionData, error_10, error_11;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 17, , 18]);
                        layoutData = JSON.parse((_b = e.target) === null || _b === void 0 ? void 0 : _b.result);
                        if (!(layoutData.regions && Array.isArray(layoutData.regions))) return [3 /*break*/, 15];
                        validRegions = layoutData.regions.filter(function (r) {
                            return r.id && r.region_type && typeof r.grid_row === 'number' && typeof r.grid_col === 'number';
                        });
                        if (!(validRegions.length > 0)) return [3 /*break*/, 13];
                        _i = 0, regions_2 = regions;
                        _c.label = 1;
                    case 1:
                        if (!(_i < regions_2.length)) return [3 /*break*/, 6];
                        region = regions_2[_i];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, removeRegion(region.id)];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_9 = _c.sent();
                        logger_1.logger.error('Failed to remove region during import', { error: error_9, regionId: region.id }, 'RegionDashboard');
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        _a = 0, validRegions_1 = validRegions;
                        _c.label = 7;
                    case 7:
                        if (!(_a < validRegions_1.length)) return [3 /*break*/, 12];
                        regionData = validRegions_1[_a];
                        _c.label = 8;
                    case 8:
                        _c.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, addRegion(regionData.region_type, {
                                row: regionData.grid_row,
                                col: regionData.grid_col
                            })];
                    case 9:
                        _c.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        error_10 = _c.sent();
                        logger_1.logger.error('Failed to add imported region', { error: error_10, regionData: regionData }, 'RegionDashboard');
                        return [3 /*break*/, 11];
                    case 11:
                        _a++;
                        return [3 /*break*/, 7];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        alert('Invalid layout file: No valid regions found');
                        _c.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        alert('Invalid layout file: Missing regions array');
                        _c.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        error_11 = _c.sent();
                        logger_1.logger.error('Failed to import layout', { error: error_11 }, 'RegionDashboard');
                        toast_1.toast.error('Failed to import layout. Please check the file format.');
                        alert('Failed to import layout: Invalid JSON file');
                        return [3 /*break*/, 18];
                    case 18: return [2 /*return*/];
                }
            });
        }); };
        reader.readAsText(file);
    };
    var handleToggleCollapse = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var region_1, originalPos, error_12, error_13, error_14, error_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 16, , 17]);
                    region_1 = regions.find(function (r) { return r.id === id; });
                    if (!region_1)
                        return [2 /*return*/];
                    if (!region_1.is_collapsed) return [3 /*break*/, 10];
                    originalPos = minimizedRegions.get(id);
                    if (!originalPos) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, updateRegionPosition(id, originalPos.row, originalPos.col)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, toggleCollapse(id)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_12 = _a.sent();
                    logger_1.logger.error('Failed to restore collapsed region', { error: error_12, regionId: id }, 'RegionDashboard');
                    toast_1.toast.error('Failed to restore region position');
                    return [3 /*break*/, 5];
                case 5:
                    _setMinimizedRegions(function (prev) {
                        var next = new Map(prev);
                        next.delete(id);
                        return next;
                    });
                    return [3 /*break*/, 9];
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, toggleCollapse(id)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_13 = _a.sent();
                    logger_1.logger.error('Failed to toggle collapse (restore path)', { error: error_13, regionId: id }, 'RegionDashboard');
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 15];
                case 10:
                    // Minimize: store original position first, then toggle
                    _setMinimizedRegions(function (prev) {
                        var next = new Map(prev);
                        next.set(id, { row: region_1.grid_row, col: region_1.grid_col });
                        return next;
                    });
                    _a.label = 11;
                case 11:
                    _a.trys.push([11, 14, , 15]);
                    return [4 /*yield*/, toggleCollapse(id)];
                case 12:
                    _a.sent();
                    // Do not move region out of valid bounds; keep original position to respect server validation
                    return [4 /*yield*/, updateRegionPosition(id, region_1.grid_row, region_1.grid_col)];
                case 13:
                    // Do not move region out of valid bounds; keep original position to respect server validation
                    _a.sent();
                    return [3 /*break*/, 15];
                case 14:
                    error_14 = _a.sent();
                    logger_1.logger.error('Failed to minimize region', { error: error_14, regionId: id }, 'RegionDashboard');
                    toast_1.toast.error('Failed to minimize region');
                    return [3 /*break*/, 15];
                case 15: return [3 /*break*/, 17];
                case 16:
                    error_15 = _a.sent();
                    logger_1.logger.error('Failed to toggle collapse', { error: error_15, regionId: id }, 'RegionDashboard');
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    }); };
    var handleRestoreRegion = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var originalPos, error_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    originalPos = minimizedRegions.get(id);
                    if (!originalPos)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, updateRegionPosition(id, originalPos.row, originalPos.col)];
                case 2:
                    _a.sent();
                    _setMinimizedRegions(function (prev) {
                        var next = new Map(prev);
                        next.delete(id);
                        return next;
                    });
                    return [4 /*yield*/, toggleCollapse(id)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_16 = _a.sent();
                    logger_1.logger.error('Failed to restore region', { error: error_16, regionId: id }, 'RegionDashboard');
                    toast_1.toast.error('Failed to restore region');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleToggleLock = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var error_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, toggleLock(id)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_17 = _a.sent();
                    logger_1.logger.error('Failed to toggle lock', { error: error_17, regionId: id }, 'RegionDashboard');
                    toast_1.toast.error('Failed to toggle region lock');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var renderRegionContent = function (region) {
        if (region.widget_type && region.widget_config) {
            // Render widget in sandbox
            // In a real implementation, we'd load the widget manifest
            return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: ["Widget: ", region.widget_type] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400 mt-1", children: "Widget rendering would go here" })] }));
        }
        // Render default content based on region type
        switch (region.region_type) {
            case region_types_1.RegionType.SCHEDULING:
                return (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: "Scheduling Widget" });
            case region_types_1.RegionType.REPORTS:
                return (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: "Reports Widget" });
            case region_types_1.RegionType.CUSTOMER_SEARCH:
                return (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: "Customer Search Widget" });
            case region_types_1.RegionType.SETTINGS:
                return (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: "Settings Widget" });
            case region_types_1.RegionType.QUICK_ACTIONS:
                return (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: "Quick Actions Widget" });
            case region_types_1.RegionType.ANALYTICS:
                return (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: "Analytics Widget" });
            default:
                return (0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-500", children: "No content configured" });
        }
    };
    if (loadingLayout || regionsLoading || !currentLayoutId) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-screen", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-gray-600", children: "Loading dashboard..." })] }) }));
    }
    if (regionsError) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-red-50 border border-red-200 rounded", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-red-800 font-semibold", children: "Error Loading Dashboard" }), (0, jsx_runtime_1.jsx)("p", { className: "text-red-600 text-sm mt-1", children: regionsError.message })] }));
    }
    // Command palette commands
    var commands = [
        {
            id: 'add-region',
            label: 'Add Region',
            category: 'Regions',
            action: function () { return setShowAddRegionDialog(true); },
            keywords: ['add', 'new', 'create', 'region']
        },
        {
            id: 'open-inspector',
            label: 'Open Inspector',
            category: 'View',
            action: function () { return setInspectorOpen(true); },
            keywords: ['inspector', 'details', 'panel']
        },
        {
            id: 'reset-layout',
            label: 'Reset Layout',
            category: 'Layout',
            action: function () { return handleResetAll(); },
            keywords: ['reset', 'clear', 'default']
        },
        {
            id: 'templates',
            label: 'Manage Templates',
            category: 'Layout',
            action: function () { return setShowTemplateManager(true); },
            keywords: ['template', 'save', 'load', 'preset']
        }
    ];
    // Mobile Dashboard (if feature flag enabled and on mobile device)
    if (isMobile && mobileBetaEnabled && currentLayoutId) {
        return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsx)(MobileDashboard_1.MobileDashboard, { regions: regions, onResize: function (id, rowSpan, colSpan) { return __awaiter(void 0, void 0, void 0, function () {
                    var region, error_18;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                region = regions.find(function (r) { return r.id === id; });
                                if (!region) return [3 /*break*/, 2];
                                return [4 /*yield*/, updateRegionSize(id, rowSpan, colSpan)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [3 /*break*/, 4];
                            case 3:
                                error_18 = _a.sent();
                                logger_1.logger.error('Mobile: failed to resize region', { error: error_18, id: id, rowSpan: rowSpan, colSpan: colSpan }, 'RegionDashboard');
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }, onMove: function (id, row, col) { return __awaiter(void 0, void 0, void 0, function () {
                    var region, error_19;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                region = regions.find(function (r) { return r.id === id; });
                                if (!region) return [3 /*break*/, 2];
                                return [4 /*yield*/, updateRegionPosition(id, row, col)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [3 /*break*/, 4];
                            case 3:
                                error_19 = _a.sent();
                                logger_1.logger.error('Mobile: failed to move region', { error: error_19, id: id, row: row, col: col }, 'RegionDashboard');
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }, onToggleCollapse: function (id) { return __awaiter(void 0, void 0, void 0, function () {
                    var error_20;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, toggleCollapse(id)];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                error_20 = _a.sent();
                                logger_1.logger.error('Mobile: failed to toggle collapse', { error: error_20, id: id }, 'RegionDashboard');
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); }, onToggleLock: function (id) { return __awaiter(void 0, void 0, void 0, function () {
                    var error_21;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, toggleLock(id)];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                error_21 = _a.sent();
                                logger_1.logger.error('Mobile: failed to toggle lock', { error: error_21, id: id }, 'RegionDashboard');
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); }, onDelete: function (id) { return __awaiter(void 0, void 0, void 0, function () {
                    var error_22;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, removeRegion(id)];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                error_22 = _a.sent();
                                logger_1.logger.error('Mobile: failed to delete region', { error: error_22, id: id }, 'RegionDashboard');
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); }, onUpdate: function (id, updates) { return __awaiter(void 0, void 0, void 0, function () {
                    var error_23;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                if (!currentLayoutId) return [3 /*break*/, 2];
                                return [4 /*yield*/, updateRegionInStore(id, updates)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [3 /*break*/, 4];
                            case 3:
                                error_23 = _a.sent();
                                logger_1.logger.error('Mobile: failed to update region', { error: error_23, id: id, updates: updates }, 'RegionDashboard');
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }, onAddRegion: function (type) { return __awaiter(void 0, void 0, void 0, function () {
                    var error_24;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                if (!currentLayoutId) return [3 /*break*/, 2];
                                return [4 /*yield*/, addRegion(type)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [3 /*break*/, 4];
                            case 3:
                                error_24 = _a.sent();
                                logger_1.logger.error('Mobile: failed to add region', { error: error_24, type: type }, 'RegionDashboard');
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); } }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "region-dashboard w-full h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative flex flex-col overflow-hidden", children: [(0, jsx_runtime_1.jsx)(CommandPalette_1.CommandPalette, { commands: commands }), (0, jsx_runtime_1.jsxs)("header", { className: "dashboard-header transition-all ".concat(isScrolled ? 'floating-header shadow-lg' : ''), style: {
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'saturate(1.2) blur(6px)',
                    WebkitBackdropFilter: 'saturate(1.2) blur(6px)',
                    borderBottom: '1px solid rgba(229,231,235,0.6)'
                }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between px-4 py-2.5", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: zoomOut, className: "w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-50", title: "Zoom Out", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ZoomOut, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm px-2 py-1 min-w-[3rem] text-center", children: [Math.round(zoom * 100), "%"] }), (0, jsx_runtime_1.jsx)("button", { onClick: zoomIn, className: "w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-50", title: "Zoom In", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ZoomIn, { className: "w-4 h-4" }) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleUndo, disabled: !currentLayoutId ? true : !canUndoStore(currentLayoutId), className: "w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-50 disabled:opacity-50", title: "Undo (Ctrl+Z)", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Undo, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleRedo, disabled: !currentLayoutId ? true : !canRedoStore(currentLayoutId), className: "w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-50 disabled:opacity-50", title: "Redo (Ctrl+Shift+Z)", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Redo, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setShowAddRegionDialog(true); }, className: "px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4" }), "Add Region"] }), (0, jsx_runtime_1.jsx)("div", { className: "relative", children: (0, jsx_runtime_1.jsxs)("details", { className: "relative", children: [(0, jsx_runtime_1.jsx)("summary", { className: "list-none w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-50 cursor-pointer", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute right-0 mt-2 bg-white border rounded-md shadow-lg min-w-[180px] z-50", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: handleExportLayout, className: "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4" }), "Export Layout"] }), (0, jsx_runtime_1.jsxs)("label", { className: "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "w-4 h-4" }), "Import Layout", (0, jsx_runtime_1.jsx)("input", { type: "file", accept: "application/json", onChange: handleImportLayout, className: "hidden" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleResetAll, className: "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RotateCcw, { className: "w-4 h-4" }), "Reset Layout"] })] })] }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "border-t px-4 py-2", children: (0, jsx_runtime_1.jsx)(FloatingNavBar_1.FloatingNavBar, { title: "Filters & Context", offsetTop: 72, filters: [
                                {
                                    id: 'active',
                                    label: 'Active Regions',
                                    active: activeFilters.has('active'),
                                    onClick: function () {
                                        setActiveFilters(function (prev) {
                                            var next = new Set(prev);
                                            if (next.has('active')) {
                                                next.delete('active');
                                            }
                                            else {
                                                next.add('active');
                                            }
                                            return next;
                                        });
                                    }
                                },
                                {
                                    id: 'recent',
                                    label: 'Recent Activity',
                                    active: activeFilters.has('recent'),
                                    onClick: function () {
                                        setActiveFilters(function (prev) {
                                            var next = new Set(prev);
                                            if (next.has('recent')) {
                                                next.delete('recent');
                                            }
                                            else {
                                                next.add('recent');
                                            }
                                            return next;
                                        });
                                    }
                                },
                                {
                                    id: 'locked',
                                    label: 'Locked Regions',
                                    active: activeFilters.has('locked'),
                                    onClick: function () {
                                        setActiveFilters(function (prev) {
                                            var next = new Set(prev);
                                            if (next.has('locked')) {
                                                next.delete('locked');
                                            }
                                            else {
                                                next.add('locked');
                                            }
                                            return next;
                                        });
                                    }
                                }
                            ], onSearch: function (term) {
                                setSearchTerm(term);
                            }, onAdvancedFiltersChange: function (filters) {
                                setAdvancedFilters(filters);
                            } }, "stable-navbar") })] }), (0, jsx_runtime_1.jsx)(UtilityDock_1.UtilityDock, { isVisible: utilityDockVisible }), (0, jsx_runtime_1.jsx)(InspectorPanel_1.InspectorPanel, { isOpen: inspectorOpen, onClose: function () {
                    setInspectorOpen(false);
                    setInspectorContent(null);
                }, title: "Inspector", position: "right", children: inspectorContent || ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: (0, jsx_runtime_1.jsx)("p", { children: "Select a region or item to view details" }) })) }), showAddRegionDialog && ((0, jsx_runtime_1.jsxs)("div", { className: "fixed top-4 left-32 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-56", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2 mb-3", children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Add Region" }) }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: Object.values(region_types_1.RegionType).map(function (type) { return ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleAddRegion(type); }, className: "w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg capitalize transition-colors", children: type.replace('-', ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }) }, type)); }) })] })), showOnboarding && ((0, jsx_runtime_1.jsx)(DashboardOnboarding_1.DashboardOnboarding, { onComplete: function () {
                    localStorage.setItem('dashboard_onboarding_complete', 'true');
                    setShowOnboarding(false);
                    toast_1.toast.success('Welcome to your dashboard!');
                }, onSkip: function () {
                    localStorage.setItem('dashboard_onboarding_complete', 'true');
                    setShowOnboarding(false);
                }, onSelectTemplate: function (_templateId) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        localStorage.setItem('dashboard_onboarding_complete', 'true');
                        setShowOnboarding(false);
                        setShowTemplateManager(true);
                        return [2 /*return*/];
                    });
                }); } })), showEmptyState && !showOnboarding && ((0, jsx_runtime_1.jsx)(EmptyDashboard_1.EmptyDashboard, { onAddRegion: function (type) { return __awaiter(void 0, void 0, void 0, function () {
                    var error_25;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!currentLayoutId) return [3 /*break*/, 4];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, addRegion(type)];
                            case 2:
                                _a.sent();
                                setShowEmptyState(false);
                                return [3 /*break*/, 4];
                            case 3:
                                error_25 = _a.sent();
                                logger_1.logger.error('Failed to add region from empty state', { error: error_25, type: type }, 'RegionDashboard');
                                toast_1.toast.error('Failed to add region');
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }, onSelectTemplate: function (_templateId) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        setShowTemplateManager(true);
                        return [2 /*return*/];
                    });
                }); }, onStartOnboarding: function () {
                    localStorage.removeItem('dashboard_onboarding_complete');
                    setShowOnboarding(true);
                    setShowEmptyState(false);
                } })), !showEmptyState && !showOnboarding && ((0, jsx_runtime_1.jsx)("div", { ref: containerRef, className: "flex-1 overflow-auto p-4 min-h-0\n          [&::-webkit-scrollbar]:w-2\n          [&::-webkit-scrollbar-track]:bg-purple-50\n          [&::-webkit-scrollbar-thumb]:bg-purple-300\n          hover:[&::-webkit-scrollbar-thumb]:bg-purple-400", style: {
                    position: 'relative'
                }, onMouseDown: handlePanStart, children: regions.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 text-lg mb-4", children: "No regions configured" }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                                setShowAddRegionDialog(true);
                            }, className: "px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-5 h-5" }), "Add Your First Region"] })] })) : ((0, jsx_runtime_1.jsx)("div", { style: __assign({ width: "".concat(Math.max(canvasSize.width, 1200), "px"), height: "".concat(Math.max(canvasSize.height, 800), "px"), minWidth: '100%', minHeight: '100%', position: 'relative', imageRendering: 'crisp-edges', willChange: 'transform' }, getTransformStyle()), className: "overflow-visible", children: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: shouldUseVirtualization ? ((0, jsx_runtime_1.jsx)(VirtualizedRegionGrid_1.VirtualizedRegionGrid, { regions: filteredRegions, cols: 12, rowHeight: 100, onResize: updateRegionSize, onMove: updateRegionPosition, onToggleCollapse: handleToggleCollapse, onToggleLock: handleToggleLock, onDelete: handleRemoveRegion, onUpdate: handleUpdateRegion })) : ((0, jsx_runtime_1.jsx)(RegionGrid_1.RegionGrid, { regions: filteredRegions, rows: Math.ceil(canvasSize.height / 100) || 12, cols: 12, gap: 16, onResize: updateRegionSize, onMove: updateRegionPosition, onToggleCollapse: handleToggleCollapse, onToggleLock: handleToggleLock, onDelete: handleRemoveRegion, onUpdate: handleUpdateRegion, onAddRegion: handleAddRegion, renderRegion: renderRegionContent, isDraggable: true, isResizable: true })) }) })) })), (0, jsx_runtime_1.jsx)(MinimizedRegionDock_1.MinimizedRegionDock, { minimizedRegions: regions
                    .filter(function (r) { return r.is_collapsed && minimizedRegions.has(r.id); })
                    .map(function (r) { return (__assign(__assign({}, r), { originalPosition: minimizedRegions.get(r.id) || { row: r.grid_row, col: r.grid_col } })); }), onRestore: handleRestoreRegion }), (0, jsx_runtime_1.jsx)(TemplateManager_1.TemplateManager, { isOpen: showTemplateManager, onClose: function () { return setShowTemplateManager(false); }, currentRegions: regions, onLoadTemplate: handleLoadTemplate }), conflicts.map(function (conflict) { return ((0, jsx_runtime_1.jsx)(ConflictResolutionDialog_1.ConflictResolutionDialog, { conflict: conflict, onResolve: function (resolution) { return __awaiter(void 0, void 0, void 0, function () {
                    var error_26;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, resolveConflict(conflict.regionId, resolution)];
                            case 1:
                                _a.sent();
                                toast_1.toast.success('Conflict resolved successfully');
                                return [3 /*break*/, 3];
                            case 2:
                                error_26 = _a.sent();
                                toast_1.toast.error('Failed to resolve conflict');
                                logger_1.logger.error('Failed to resolve conflict', { error: error_26, conflict: conflict }, 'RegionDashboard');
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); }, onCancel: function () { return clearConflict(conflict.regionId); } }, conflict.regionId)); }), (0, jsx_runtime_1.jsx)(OfflineIndicator_1.OfflineIndicator, {})] }));
};
exports.RegionDashboard = RegionDashboard;
exports.default = exports.RegionDashboard;
