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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.RegionContainer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var react_dom_1 = require("react-dom");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var RegionContent_1 = require("./RegionContent");
var RegionSettingsDialog_1 = require("./RegionSettingsDialog");
var RegionErrorBoundary_1 = require("./RegionErrorBoundary");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
exports.RegionContainer = react_1.default.memo(function (_a) {
    var _b, _c, _d;
    var region = _a.region, children = _a.children, _onResize = _a.onResize, _onMove = _a.onMove, onToggleCollapse = _a.onToggleCollapse, onToggleLock = _a.onToggleLock, onDelete = _a.onDelete, onUpdate = _a.onUpdate, onAddRegion = _a.onAddRegion, _e = _a.className, className = _e === void 0 ? '' : _e, _f = _a.style, style = _f === void 0 ? {} : _f;
    var _g = (0, react_1.useState)(false), showSettings = _g[0], setShowSettings = _g[1];
    var _h = (0, react_1.useState)(false), showContextMenu = _h[0], setShowContextMenu = _h[1];
    var _j = (0, react_1.useState)({ x: 0, y: 0 }), contextMenuPosition = _j[0], setContextMenuPosition = _j[1];
    var _k = (0, react_1.useState)(false), isDuplicating = _k[0], setIsDuplicating = _k[1];
    var containerRef = (0, react_1.useRef)(null);
    // Context menu handler
    var handleContextMenu = (0, react_1.useCallback)(function (e) {
        e.preventDefault();
        e.stopPropagation();
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
    }, []);
    // Close context menu on outside click
    (0, react_1.useEffect)(function () {
        if (!showContextMenu) {
            return undefined;
        }
        var handleClickOutside = function (event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowContextMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, [showContextMenu]);
    // Handle duplicate region
    var handleDuplicate = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!onAddRegion) return [3 /*break*/, 6];
                    setIsDuplicating(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // Create a duplicate with offset position
                    return [4 /*yield*/, onAddRegion(region.region_type, {
                            row: region.grid_row + 1,
                            col: region.grid_col + 1
                        })];
                case 2:
                    // Create a duplicate with offset position
                    _a.sent();
                    toast_1.toast.success('Region duplicated successfully');
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    errorMessage = error_1 instanceof Error ? error_1.message : 'Failed to duplicate region';
                    logger_1.logger.error('Failed to duplicate region', { error: error_1, regionId: region.id }, 'RegionContainer');
                    toast_1.toast.error("Failed to duplicate region: ".concat(errorMessage));
                    return [3 /*break*/, 5];
                case 4:
                    setIsDuplicating(false);
                    setShowContextMenu(false);
                    return [7 /*endfinally*/];
                case 5: return [3 /*break*/, 7];
                case 6:
                    setShowContextMenu(false);
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); }, [region, onAddRegion]);
    // Grid style - Note: React Grid Layout handles positioning, but we keep this for fallback
    var gridStyle = __assign(__assign(__assign({ width: '100%', height: '100%', minWidth: "".concat(region.min_width, "px"), minHeight: "".concat(region.min_height, "px") }, (((_b = region.config) === null || _b === void 0 ? void 0 : _b.backgroundColor) && { backgroundColor: region.config.backgroundColor })), (((_c = region.config) === null || _c === void 0 ? void 0 : _c.borderColor) && { borderColor: region.config.borderColor })), style);
    // Workspace-style design: no shadows, no rounded corners, subtle borders
    var baseClasses = "\n    region-container \n    relative \n    bg-[var(--color-surface)] \n    border \n    border-[var(--color-border)]\n    transition-all \n    duration-200 \n    group \n    overflow-hidden\n    ".concat(region.is_collapsed ? 'collapsed' : '', " \n    ").concat(region.is_locked ? 'locked border-red-400 bg-red-50/30' : 'hover:border-slate-300', " \n  ").trim().replace(/\s+/g, ' ');
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { ref: containerRef, className: "".concat(baseClasses, " ").concat(className), style: gridStyle, role: "region", "aria-label": "Region: ".concat(region.region_type), "aria-expanded": !region.is_collapsed, tabIndex: 0, onContextMenu: handleContextMenu, initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.2, ease: 'easeOut' }, whileHover: { borderColor: 'var(--color-border)' }, layout: true, children: [!region.is_locked && ((0, jsx_runtime_1.jsx)("div", { className: "region-drag-handle absolute top-2 left-2 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1 bg-[var(--color-surface)]/95 backdrop-blur-md px-1.5 py-1 border border-[var(--color-border)] rounded", children: (0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "w-4 h-4 text-gray-500" }) }) })), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 right-2 z-50 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 bg-[var(--color-surface)]/95 backdrop-blur-md px-1.5 py-1 border border-[var(--color-border)]", children: [onUpdate && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setShowSettings(true);
                                            }, onMouseDown: function (e) { return e.stopPropagation(); }, tabIndex: -1, className: "w-7 h-7 flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 shadow-sm", title: "Settings", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-3.5 h-3.5" }) }), (0, jsx_runtime_1.jsx)("div", { className: "w-px h-4 bg-gray-300" })] })), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        onToggleCollapse === null || onToggleCollapse === void 0 ? void 0 : onToggleCollapse(region.id);
                                    }, onMouseDown: function (e) { return e.stopPropagation(); }, tabIndex: -1, className: "w-7 h-7 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 shadow-sm", title: region.is_collapsed ? 'Expand' : 'Collapse', children: region.is_collapsed ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-3.5 h-3.5" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronUp, { className: "w-3.5 h-3.5" })) }), (0, jsx_runtime_1.jsx)("div", { className: "w-px h-4 bg-gray-300" }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        onToggleLock === null || onToggleLock === void 0 ? void 0 : onToggleLock(region.id);
                                    }, onMouseDown: function (e) { return e.stopPropagation(); }, tabIndex: -1, className: "w-7 h-7 flex items-center justify-center rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm ".concat(region.is_locked
                                        ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400'
                                        : 'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-400'), title: region.is_locked ? 'Unlock' : 'Lock', children: region.is_locked ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Unlock, { className: "w-3.5 h-3.5" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-3.5 h-3.5" })) }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        handleContextMenu(e);
                                    }, onMouseDown: function (e) { return e.stopPropagation(); }, tabIndex: -1, className: "w-7 h-7 flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 shadow-sm", title: "More options", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { className: "w-3.5 h-3.5" }) })] }) }), typeof document !== 'undefined' && (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: showContextMenu && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "fixed inset-0 z-[9998]", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: function () { return setShowContextMenu(false); } }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "fixed z-[9999] bg-white border border-[var(--color-border)] shadow-lg rounded-md py-1 min-w-[160px]", style: {
                                        left: contextMenuPosition.x,
                                        top: contextMenuPosition.y,
                                    }, initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.15 }, onClick: function (e) { return e.stopPropagation(); }, children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function (e) {
                                                e.stopPropagation();
                                                setShowSettings(true);
                                                setShowContextMenu(false);
                                            }, className: "w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-4 h-4" }), "Settings"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function (e) {
                                                e.stopPropagation();
                                                handleDuplicate();
                                            }, disabled: isDuplicating, className: "w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "w-4 h-4" }), isDuplicating ? 'Duplicating...' : 'Duplicate'] }), (0, jsx_runtime_1.jsx)("div", { className: "border-t border-gray-200 my-1" }), (0, jsx_runtime_1.jsxs)("button", { onClick: function (e) {
                                                e.stopPropagation();
                                                onDelete === null || onDelete === void 0 ? void 0 : onDelete(region.id);
                                                setShowContextMenu(false);
                                            }, className: "w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4" }), "Delete"] })] })] })) }), document.body), region.is_collapsed ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center p-4 min-h-[60px] text-gray-500 text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "capitalize", children: ((_d = region.config) === null || _d === void 0 ? void 0 : _d.title) || region.region_type.replace('-', ' ') }), (0, jsx_runtime_1.jsx)("span", { className: "mx-2", children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { children: "Collapsed" })] })) : ((0, jsx_runtime_1.jsx)(RegionErrorBoundary_1.RegionErrorBoundary, { regionId: region.id, onRecover: function () {
                            // Reload region on recovery
                            logger_1.logger.info('Region recovered from error', { regionId: region.id }, 'RegionContainer');
                        }, children: (0, jsx_runtime_1.jsx)(RegionContent_1.RegionContent, { region: region, children: children }) }))] }), typeof document !== 'undefined' && (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: showSettings && onUpdate && ((0, jsx_runtime_1.jsx)(RegionSettingsDialog_1.RegionSettingsDialog, { region: region, isOpen: showSettings, onClose: function () { return setShowSettings(false); }, onSave: function (updates) { return onUpdate(region.id, updates); } })) }), document.body)] }));
}, function (prevProps, nextProps) {
    // Custom comparison for React.memo
    // Returns true if props are equal (skip re-render), false if different (re-render)
    if (prevProps.region.id !== nextProps.region.id)
        return false;
    if (prevProps.region.grid_row !== nextProps.region.grid_row)
        return false;
    if (prevProps.region.grid_col !== nextProps.region.grid_col)
        return false;
    if (prevProps.region.row_span !== nextProps.region.row_span)
        return false;
    if (prevProps.region.col_span !== nextProps.region.col_span)
        return false;
    if (prevProps.region.is_collapsed !== nextProps.region.is_collapsed)
        return false;
    if (prevProps.region.is_locked !== nextProps.region.is_locked)
        return false;
    if (prevProps.className !== nextProps.className)
        return false;
    // Deep compare config object (but skip children comparison to prevent unnecessary re-renders)
    var prevConfig = prevProps.region.config || {};
    var nextConfig = nextProps.region.config || {};
    if (JSON.stringify(prevConfig) !== JSON.stringify(nextConfig))
        return false;
    // Only compare children reference, not content (prevents flashing)
    // Children will re-render when their own props change
    return true; // Props are equal, skip re-render
});
