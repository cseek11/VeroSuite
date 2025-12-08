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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardToRegionMigration = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var region_types_1 = require("@/routes/dashboard/types/region.types");
var CardToRegionMigration = function (_a) {
    var layoutId = _a.layoutId, onComplete = _a.onComplete, onCancel = _a.onCancel;
    var _b = (0, react_1.useState)('preview'), step = _b[0], setStep = _b[1];
    var _c = (0, react_1.useState)([]), cards = _c[0], setCards = _c[1];
    var _d = (0, react_1.useState)([]), proposedRegions = _d[0], setProposedRegions = _d[1];
    var _e = (0, react_1.useState)(true), loading = _e[0], setLoading = _e[1];
    var _f = (0, react_1.useState)(null), error = _f[0], setError = _f[1];
    var _g = (0, react_1.useState)(null), migrationResult = _g[0], setMigrationResult = _g[1];
    (0, react_1.useEffect)(function () {
        loadPreview();
    }, [layoutId]);
    var loadPreview = function () { return __awaiter(void 0, void 0, void 0, function () {
        var existingCards, regions, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.listCards(layoutId)];
                case 1:
                    existingCards = _a.sent();
                    setCards(existingCards);
                    regions = generateProposedRegions(existingCards);
                    setProposedRegions(regions);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'Failed to load preview');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var generateProposedRegions = function (cards) {
        // Group cards by type
        var cardGroups = {};
        cards.forEach(function (card) {
            var groupKey = mapCardTypeToRegionType(card.type);
            if (!cardGroups[groupKey]) {
                cardGroups[groupKey] = [];
            }
            cardGroups[groupKey].push(card.id);
        });
        // Convert to regions
        var regions = [];
        var row = 0;
        var col = 0;
        var maxCols = 2;
        Object.entries(cardGroups).forEach(function (_a) {
            var regionType = _a[0], cardIds = _a[1];
            regions.push({
                regionType: regionType,
                cardIds: cardIds,
                gridRow: row,
                gridCol: col
            });
            col++;
            if (col >= maxCols) {
                col = 0;
                row++;
            }
        });
        return regions;
    };
    var mapCardTypeToRegionType = function (cardType) {
        var mapping = {
            'jobs-calendar': region_types_1.RegionType.SCHEDULING,
            'scheduling': region_types_1.RegionType.SCHEDULING,
            'customer-search': region_types_1.RegionType.CUSTOMER_SEARCH,
            'customers-page': region_types_1.RegionType.CUSTOMER_SEARCH,
            'reports': region_types_1.RegionType.REPORTS,
            'technician-dispatch': region_types_1.RegionType.SCHEDULING,
            'team-overview': region_types_1.RegionType.TEAM_OVERVIEW,
            'analytics': region_types_1.RegionType.ANALYTICS,
            'financial-summary': region_types_1.RegionType.FINANCIAL_SUMMARY,
            'settings': region_types_1.RegionType.SETTINGS,
            'quick-actions': region_types_1.RegionType.QUICK_ACTIONS
        };
        return mapping[cardType] || region_types_1.RegionType.CUSTOM;
    };
    var handleMigrate = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setStep('migrating');
                    setError(null);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.migrateCardsToRegions(layoutId)];
                case 1:
                    result = _a.sent();
                    setMigrationResult(result);
                    setStep('complete');
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    setError(err_2 instanceof Error ? err_2.message : 'Migration failed');
                    setStep('error');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-6 bg-gray-200 rounded w-1/3 mb-4" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: [1, 2, 3].map(function (i) { return ((0, jsx_runtime_1.jsx)("div", { className: "h-20 bg-gray-100 rounded" }, i)); }) })] }) }));
    }
    if (step === 'migrating') {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Migrating cards to regions..." }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-2", children: "This may take a few moments" })] }));
    }
    if (step === 'complete') {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-green-50 border border-green-200 rounded p-4 mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-green-800 mb-2", children: "Migration Complete!" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-green-700", children: ["Successfully migrated ", (migrationResult === null || migrationResult === void 0 ? void 0 : migrationResult.regionsCreated) || 0, " regions from ", cards.length, " cards."] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: onComplete, className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Continue" }) })] }));
    }
    if (step === 'error') {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 border border-red-200 rounded p-4 mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-red-800 mb-2", children: "Migration Failed" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700", children: error })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onCancel, className: "px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setStep('preview'); }, className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Try Again" })] })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "card-to-region-migration p-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold mb-4", children: "Migrate Cards to Regions" }), (0, jsx_runtime_1.jsx)("div", { className: "mb-6", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-4", children: "This will convert your existing dashboard cards into a region-based layout. Review the proposed mapping below before proceeding." }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-6 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold mb-3", children: ["Current Cards (", cards.length, ")"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2 max-h-96 overflow-y-auto", children: cards.map(function (card) { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-gray-50 border border-gray-200 rounded", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium", children: card.type }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500", children: ["ID: ", card.id.slice(0, 8), "..."] })] }, card.id)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold mb-3", children: ["Proposed Regions (", proposedRegions.length, ")"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2 max-h-96 overflow-y-auto", children: proposedRegions.map(function (region, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium capitalize", children: region.regionType.replace('-', ' ') }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-600 mt-1", children: [region.cardIds.length, " ", region.cardIds.length === 1 ? 'card' : 'cards', " \u2022 Position: (", region.gridRow, ", ", region.gridCol, ")"] })] }, index)); }) })] })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-800", children: error }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onCancel, className: "px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleMigrate, disabled: cards.length === 0, className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed", children: "Start Migration" })] })] }));
};
exports.CardToRegionMigration = CardToRegionMigration;
