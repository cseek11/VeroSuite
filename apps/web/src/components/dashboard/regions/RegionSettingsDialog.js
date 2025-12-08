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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionSettingsDialog = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var region_types_1 = require("@/routes/dashboard/types/region.types");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var Dialog_1 = require("@/components/ui/Dialog");
var CRMComponents_1 = require("@/components/ui/CRMComponents");
var Label_1 = require("@/components/ui/Label");
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Switch_1 = require("@/components/ui/Switch");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var RegionSettingsDialog = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    var region = _a.region, isOpen = _a.isOpen, onClose = _a.onClose, onSave = _a.onSave;
    var _t = (0, react_1.useState)('general'), activeTab = _t[0], setActiveTab = _t[1];
    var _u = (0, react_1.useState)(false), loading = _u[0], setLoading = _u[1];
    var _v = (0, react_1.useState)(false), hasChanges = _v[0], setHasChanges = _v[1];
    // General settings
    var _w = (0, react_1.useState)(region.region_type), regionType = _w[0], setRegionType = _w[1];
    var _x = (0, react_1.useState)(((_b = region.config) === null || _b === void 0 ? void 0 : _b.title) || region.region_type.replace('-', ' ')), title = _x[0], setTitle = _x[1];
    var _y = (0, react_1.useState)(((_c = region.config) === null || _c === void 0 ? void 0 : _c.description) || ''), description = _y[0], setDescription = _y[1];
    // Appearance settings
    var defaultColors = {
        backgroundColor: 'rgb(255,255,255)',
        headerColor: 'rgb(249,250,251)',
        borderColor: 'rgb(229,231,235)'
    };
    var _z = (0, react_1.useState)(((_d = region.config) === null || _d === void 0 ? void 0 : _d.backgroundColor) || defaultColors.backgroundColor), backgroundColor = _z[0], setBackgroundColor = _z[1];
    var _0 = (0, react_1.useState)(((_e = region.config) === null || _e === void 0 ? void 0 : _e.headerColor) || defaultColors.headerColor), headerColor = _0[0], setHeaderColor = _0[1];
    var _1 = (0, react_1.useState)(((_f = region.config) === null || _f === void 0 ? void 0 : _f.borderColor) || defaultColors.borderColor), borderColor = _1[0], setBorderColor = _1[1];
    var _2 = (0, react_1.useState)(((_g = region.config) === null || _g === void 0 ? void 0 : _g.fontSize) || 'medium'), fontSize = _2[0], setFontSize = _2[1];
    var _3 = (0, react_1.useState)((_j = (_h = region.config) === null || _h === void 0 ? void 0 : _h.padding) !== null && _j !== void 0 ? _j : 16), padding = _3[0], setPadding = _3[1];
    var _4 = (0, react_1.useState)((_l = (_k = region.config) === null || _k === void 0 ? void 0 : _k.borderRadius) !== null && _l !== void 0 ? _l : 8), borderRadius = _4[0], setBorderRadius = _4[1];
    var _5 = (0, react_1.useState)((_o = (_m = region.config) === null || _m === void 0 ? void 0 : _m.shadowDepth) !== null && _o !== void 0 ? _o : 1), shadowDepth = _5[0], setShadowDepth = _5[1];
    // Behavior settings
    var _6 = (0, react_1.useState)(region.is_locked || false), isLocked = _6[0], setIsLocked = _6[1];
    var _7 = (0, react_1.useState)(region.is_collapsed || false), isCollapsed = _7[0], setIsCollapsed = _7[1];
    var _8 = (0, react_1.useState)(region.is_hidden_mobile || false), isHiddenMobile = _8[0], setIsHiddenMobile = _8[1];
    var _9 = (0, react_1.useState)((_q = (_p = region.config) === null || _p === void 0 ? void 0 : _p.enableAnimations) !== null && _q !== void 0 ? _q : true), enableAnimations = _9[0], setEnableAnimations = _9[1];
    var _10 = (0, react_1.useState)((_s = (_r = region.config) === null || _r === void 0 ? void 0 : _r.enableHoverEffects) !== null && _s !== void 0 ? _s : true), enableHoverEffects = _10[0], setEnableHoverEffects = _10[1];
    // Helper to convert RGB to hex for color picker
    var rgbToHex = function (rgb) {
        var match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match && match[1] && match[2] && match[3]) {
            var r = parseInt(match[1], 10).toString(16).padStart(2, '0');
            var g = parseInt(match[2], 10).toString(16).padStart(2, '0');
            var b = parseInt(match[3], 10).toString(16).padStart(2, '0');
            return "#".concat(r).concat(g).concat(b);
        }
        if (rgb.startsWith('#'))
            return rgb;
        return '#ffffff';
    };
    // Reset all settings to defaults
    var handleReset = function () {
        setBackgroundColor(defaultColors.backgroundColor);
        setHeaderColor(defaultColors.headerColor);
        setBorderColor(defaultColors.borderColor);
        setFontSize('medium');
        setPadding(16);
        setBorderRadius(8);
        setShadowDepth(1);
        setEnableAnimations(true);
        setEnableHoverEffects(true);
        setHasChanges(true);
    };
    // Initialize state when dialog opens
    (0, react_1.useEffect)(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        if (isOpen) {
            setRegionType(region.region_type);
            var bgColor = ((_a = region.config) === null || _a === void 0 ? void 0 : _a.backgroundColor) || defaultColors.backgroundColor;
            var hdrColor = ((_b = region.config) === null || _b === void 0 ? void 0 : _b.headerColor) || defaultColors.headerColor;
            var brdColor = ((_c = region.config) === null || _c === void 0 ? void 0 : _c.borderColor) || defaultColors.borderColor;
            setBackgroundColor(bgColor);
            setHeaderColor(hdrColor);
            setBorderColor(brdColor);
            setTitle(((_d = region.config) === null || _d === void 0 ? void 0 : _d.title) || region.region_type.replace('-', ' '));
            setDescription(((_e = region.config) === null || _e === void 0 ? void 0 : _e.description) || '');
            setFontSize(((_f = region.config) === null || _f === void 0 ? void 0 : _f.fontSize) || 'medium');
            setPadding((_h = (_g = region.config) === null || _g === void 0 ? void 0 : _g.padding) !== null && _h !== void 0 ? _h : 16);
            setBorderRadius((_k = (_j = region.config) === null || _j === void 0 ? void 0 : _j.borderRadius) !== null && _k !== void 0 ? _k : 8);
            setShadowDepth((_m = (_l = region.config) === null || _l === void 0 ? void 0 : _l.shadowDepth) !== null && _m !== void 0 ? _m : 1);
            setIsLocked(region.is_locked || false);
            setIsCollapsed(region.is_collapsed || false);
            setIsHiddenMobile(region.is_hidden_mobile || false);
            setEnableAnimations((_p = (_o = region.config) === null || _o === void 0 ? void 0 : _o.enableAnimations) !== null && _p !== void 0 ? _p : true);
            setEnableHoverEffects((_r = (_q = region.config) === null || _q === void 0 ? void 0 : _q.enableHoverEffects) !== null && _r !== void 0 ? _r : true);
            setHasChanges(false);
            setActiveTab('general');
        }
    }, [isOpen, region]);
    // Track changes
    (0, react_1.useEffect)(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        var hasGeneralChanges = regionType !== region.region_type ||
            title !== (((_a = region.config) === null || _a === void 0 ? void 0 : _a.title) || region.region_type.replace('-', ' ')) ||
            description !== (((_b = region.config) === null || _b === void 0 ? void 0 : _b.description) || '');
        var hasAppearanceChanges = backgroundColor !== (((_c = region.config) === null || _c === void 0 ? void 0 : _c.backgroundColor) || defaultColors.backgroundColor) ||
            headerColor !== (((_d = region.config) === null || _d === void 0 ? void 0 : _d.headerColor) || defaultColors.headerColor) ||
            borderColor !== (((_e = region.config) === null || _e === void 0 ? void 0 : _e.borderColor) || defaultColors.borderColor) ||
            fontSize !== (((_f = region.config) === null || _f === void 0 ? void 0 : _f.fontSize) || 'medium') ||
            padding !== ((_h = (_g = region.config) === null || _g === void 0 ? void 0 : _g.padding) !== null && _h !== void 0 ? _h : 16) ||
            borderRadius !== ((_k = (_j = region.config) === null || _j === void 0 ? void 0 : _j.borderRadius) !== null && _k !== void 0 ? _k : 8) ||
            shadowDepth !== ((_m = (_l = region.config) === null || _l === void 0 ? void 0 : _l.shadowDepth) !== null && _m !== void 0 ? _m : 1);
        var hasBehaviorChanges = isLocked !== (region.is_locked || false) ||
            isCollapsed !== (region.is_collapsed || false) ||
            isHiddenMobile !== (region.is_hidden_mobile || false) ||
            enableAnimations !== ((_p = (_o = region.config) === null || _o === void 0 ? void 0 : _o.enableAnimations) !== null && _p !== void 0 ? _p : true) ||
            enableHoverEffects !== ((_r = (_q = region.config) === null || _q === void 0 ? void 0 : _q.enableHoverEffects) !== null && _r !== void 0 ? _r : true);
        setHasChanges(hasGeneralChanges || hasAppearanceChanges || hasBehaviorChanges);
    }, [
        regionType, title, description,
        backgroundColor, headerColor, borderColor, fontSize, padding, borderRadius, shadowDepth,
        isLocked, isCollapsed, isHiddenMobile, enableAnimations, enableHoverEffects,
        region
    ]);
    // Live preview region
    var previewRegion = (0, react_1.useMemo)(function () { return (__assign(__assign({}, region), { region_type: regionType, is_locked: isLocked, is_collapsed: isCollapsed, is_hidden_mobile: isHiddenMobile, config: __assign(__assign({}, region.config), { title: title, description: description, backgroundColor: backgroundColor, headerColor: headerColor, borderColor: borderColor, fontSize: fontSize, padding: padding, borderRadius: borderRadius, shadowDepth: shadowDepth, enableAnimations: enableAnimations, enableHoverEffects: enableHoverEffects }) })); }, [
        region, regionType, title, description,
        backgroundColor, headerColor, borderColor, fontSize, padding, borderRadius, shadowDepth,
        isLocked, isCollapsed, isHiddenMobile, enableAnimations, enableHoverEffects
    ]);
    var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var normalizeColor, error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@/lib/sanitization')); })];
                case 2:
                    normalizeColor = (_a.sent()).normalizeColor;
                    return [4 /*yield*/, onSave({
                            region_type: regionType,
                            is_locked: isLocked,
                            is_collapsed: isCollapsed,
                            is_hidden_mobile: isHiddenMobile,
                            config: __assign(__assign({}, region.config), { title: title, description: description, backgroundColor: normalizeColor(backgroundColor) || backgroundColor, headerColor: normalizeColor(headerColor) || headerColor, borderColor: normalizeColor(borderColor) || borderColor, fontSize: fontSize, padding: padding, borderRadius: borderRadius, shadowDepth: shadowDepth, enableAnimations: enableAnimations, enableHoverEffects: enableHoverEffects })
                        })];
                case 3:
                    _a.sent();
                    setHasChanges(false);
                    onClose();
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    errorMessage = error_1 instanceof Error ? error_1.message : 'Failed to save region settings';
                    logger_1.logger.error('Failed to save region settings', { error: error_1, regionId: region.id }, 'RegionSettingsDialog');
                    toast_1.toast.error("Failed to save region settings: ".concat(errorMessage));
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var fontSizeClasses = {
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base'
    };
    var shadowClasses = {
        0: 'shadow-none',
        1: 'shadow-sm',
        2: 'shadow',
        3: 'shadow-md',
        4: 'shadow-lg',
        5: 'shadow-xl'
    };
    return ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: isOpen, onOpenChange: onClose, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-hidden flex flex-col", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-5 h-5" }), "Region Settings"] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 overflow-hidden flex gap-4 min-h-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-y-auto pr-2", children: (0, jsx_runtime_1.jsxs)(CRMComponents_1.Tabs, { value: activeTab, onValueChange: function (v) { return setActiveTab(v); }, children: [(0, jsx_runtime_1.jsxs)(CRMComponents_1.TabsList, { className: "grid w-full grid-cols-4 mb-4", children: [(0, jsx_runtime_1.jsxs)(CRMComponents_1.TabsTrigger, { value: "general", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: "General" })] }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.TabsTrigger, { value: "appearance", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Palette, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: "Appearance" })] }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.TabsTrigger, { value: "behavior", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: "Behavior" })] }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.TabsTrigger, { value: "advanced", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Code, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: "Advanced" })] })] }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.TabsContent, { value: "general", className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "region-type", children: "Region Type" }), (0, jsx_runtime_1.jsx)("select", { id: "region-type", value: regionType, onChange: function (e) { return setRegionType(e.target.value); }, className: "w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent", children: Object.values(region_types_1.RegionType).map(function (type) { return ((0, jsx_runtime_1.jsx)("option", { value: type, children: type.replace('-', ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }) }, type)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "title", children: "Title" }), (0, jsx_runtime_1.jsx)(Input_1.default, { id: "title", type: "text", value: title, onChange: function (e) {
                                                            var value = e.target.value;
                                                            if (value.length <= 100) {
                                                                setTitle(value);
                                                            }
                                                        }, maxLength: 100, placeholder: "Region title", className: "mt-1" }), title.length > 80 && ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500 mt-1", children: [100 - title.length, " characters remaining"] }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "description", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { id: "description", value: description, onChange: function (e) {
                                                            var value = e.target.value;
                                                            if (value.length <= 500) {
                                                                setDescription(value);
                                                            }
                                                        }, maxLength: 500, rows: 3, placeholder: "Optional description", className: "w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" }), description.length > 450 && ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500 mt-1", children: [500 - description.length, " characters remaining"] }))] })] }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.TabsContent, { value: "appearance", className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { children: "Background Color" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-1", children: [(0, jsx_runtime_1.jsx)("input", { type: "color", value: rgbToHex(backgroundColor), onChange: function (e) {
                                                                            var hex = e.target.value;
                                                                            var r = parseInt(hex.slice(1, 3), 16);
                                                                            var g = parseInt(hex.slice(3, 5), 16);
                                                                            var b = parseInt(hex.slice(5, 7), 16);
                                                                            setBackgroundColor("rgb(".concat(r, ",").concat(g, ",").concat(b, ")"));
                                                                        }, className: "w-12 h-10 border border-gray-300 rounded cursor-pointer" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", value: backgroundColor, onChange: function (e) { return setBackgroundColor(e.target.value); }, placeholder: "rgb(255,255,255)", className: "flex-1" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { children: "Header Color" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-1", children: [(0, jsx_runtime_1.jsx)("input", { type: "color", value: rgbToHex(headerColor), onChange: function (e) {
                                                                            var hex = e.target.value;
                                                                            var r = parseInt(hex.slice(1, 3), 16);
                                                                            var g = parseInt(hex.slice(3, 5), 16);
                                                                            var b = parseInt(hex.slice(5, 7), 16);
                                                                            setHeaderColor("rgb(".concat(r, ",").concat(g, ",").concat(b, ")"));
                                                                        }, className: "w-12 h-10 border border-gray-300 rounded cursor-pointer" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", value: headerColor, onChange: function (e) { return setHeaderColor(e.target.value); }, placeholder: "rgb(249,250,251)", className: "flex-1" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { children: "Border Color" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-1", children: [(0, jsx_runtime_1.jsx)("input", { type: "color", value: rgbToHex(borderColor), onChange: function (e) {
                                                                            var hex = e.target.value;
                                                                            var r = parseInt(hex.slice(1, 3), 16);
                                                                            var g = parseInt(hex.slice(3, 5), 16);
                                                                            var b = parseInt(hex.slice(5, 7), 16);
                                                                            setBorderColor("rgb(".concat(r, ",").concat(g, ",").concat(b, ")"));
                                                                        }, className: "w-12 h-10 border border-gray-300 rounded cursor-pointer" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", value: borderColor, onChange: function (e) { return setBorderColor(e.target.value); }, placeholder: "rgb(229,231,235)", className: "flex-1" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "font-size", children: "Font Size" }), (0, jsx_runtime_1.jsxs)("select", { id: "font-size", value: fontSize, onChange: function (e) { return setFontSize(e.target.value); }, className: "w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent", children: [(0, jsx_runtime_1.jsx)("option", { value: "small", children: "Small" }), (0, jsx_runtime_1.jsx)("option", { value: "medium", children: "Medium" }), (0, jsx_runtime_1.jsx)("option", { value: "large", children: "Large" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "padding", children: "Padding (px)" }), (0, jsx_runtime_1.jsx)(Input_1.default, { id: "padding", type: "number", min: "0", max: "48", value: padding, onChange: function (e) { return setPadding(Math.max(0, Math.min(48, parseInt(e.target.value) || 0))); }, className: "mt-1" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "border-radius", children: "Border Radius (px)" }), (0, jsx_runtime_1.jsx)(Input_1.default, { id: "border-radius", type: "number", min: "0", max: "24", value: borderRadius, onChange: function (e) { return setBorderRadius(Math.max(0, Math.min(24, parseInt(e.target.value) || 0))); }, className: "mt-1" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "shadow", children: "Shadow Depth" }), (0, jsx_runtime_1.jsx)("select", { id: "shadow", value: shadowDepth, onChange: function (e) { return setShadowDepth(parseInt(e.target.value)); }, className: "w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent", children: [0, 1, 2, 3, 4, 5].map(function (depth) { return ((0, jsx_runtime_1.jsx)("option", { value: depth, children: depth === 0 ? 'None' : "Level ".concat(depth) }, depth)); }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "pt-2 border-t border-gray-200", children: (0, jsx_runtime_1.jsxs)(Button_1.default, { onClick: handleReset, variant: "outline", className: "w-full flex items-center justify-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RotateCcw, { className: "w-4 h-4" }), "Reset to Defaults"] }) })] }), (0, jsx_runtime_1.jsx)(CRMComponents_1.TabsContent, { value: "behavior", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "lock", children: "Lock Region" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-0.5", children: "Prevent dragging and resizing" })] }), (0, jsx_runtime_1.jsx)(Switch_1.Switch, { id: "lock", checked: isLocked, onCheckedChange: setIsLocked })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "collapse", children: "Collapsed" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-0.5", children: "Start in collapsed state" })] }), (0, jsx_runtime_1.jsx)(Switch_1.Switch, { id: "collapse", checked: isCollapsed, onCheckedChange: setIsCollapsed })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "hide-mobile", children: "Hide on Mobile" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-0.5", children: "Hide this region on mobile devices" })] }), (0, jsx_runtime_1.jsx)(Switch_1.Switch, { id: "hide-mobile", checked: isHiddenMobile, onCheckedChange: setIsHiddenMobile })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "animations", children: "Enable Animations" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-0.5", children: "Enable transition animations" })] }), (0, jsx_runtime_1.jsx)(Switch_1.Switch, { id: "animations", checked: enableAnimations, onCheckedChange: setEnableAnimations })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "hover-effects", children: "Enable Hover Effects" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-0.5", children: "Enable hover state effects" })] }), (0, jsx_runtime_1.jsx)(Switch_1.Switch, { id: "hover-effects", checked: enableHoverEffects, onCheckedChange: setEnableHoverEffects })] })] }) }), (0, jsx_runtime_1.jsx)(CRMComponents_1.TabsContent, { value: "advanced", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { children: "Widget Configuration" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-1 mb-2", children: "Advanced widget settings (JSON format)" }), (0, jsx_runtime_1.jsx)("textarea", { value: JSON.stringify(region.widget_config || {}, null, 2), readOnly: true, rows: 8, className: "w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-md bg-gray-50 resize-none" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400 mt-1", children: "Widget configuration is managed by the widget itself" })] }) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "w-80 flex-shrink-0 border-l border-gray-200 pl-4 overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "sticky top-0 bg-white pb-2 mb-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm font-medium text-gray-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "w-4 h-4" }), "Live Preview"] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg overflow-hidden", style: {
                                        backgroundColor: previewRegion.config.backgroundColor,
                                        borderColor: previewRegion.config.borderColor,
                                        borderRadius: "".concat(previewRegion.config.borderRadius, "px"),
                                        boxShadow: shadowClasses[previewRegion.config.shadowDepth] || 'shadow-sm'
                                    }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "px-4 py-2 border-b flex items-center justify-between", style: {
                                                backgroundColor: previewRegion.config.headerColor,
                                                borderColor: previewRegion.config.borderColor
                                            }, children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold truncate ".concat(fontSizeClasses[previewRegion.config.fontSize] || 'text-sm'), children: previewRegion.config.title || previewRegion.region_type.replace('-', ' ') }), previewRegion.is_locked && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: "\uD83D\uDD12" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", style: {
                                                padding: "".concat(previewRegion.config.padding, "px"),
                                                fontSize: previewRegion.config.fontSize === 'small' ? '0.75rem' :
                                                    previewRegion.config.fontSize === 'large' ? '1rem' : '0.875rem'
                                            }, children: [(0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 text-sm", children: previewRegion.config.description || 'Preview of your region settings' }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 p-3 bg-gray-50 rounded border border-gray-200", children: (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "This is how your region will appear with the current settings." }) })] })] })] })] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { onClick: onClose, variant: "outline", disabled: loading, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handleSave, disabled: loading || !hasChanges, className: "bg-purple-600 hover:bg-purple-700", children: loading ? 'Saving...' : 'Save Changes' })] })] }) }));
};
exports.RegionSettingsDialog = RegionSettingsDialog;
