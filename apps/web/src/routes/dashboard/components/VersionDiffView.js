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
exports.VersionDiffView = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useLayoutVersioning_1 = require("@/hooks/useLayoutVersioning");
var VersionDiffView = function (_a) {
    var layoutId = _a.layoutId, version1 = _a.version1, version2 = _a.version2;
    var _b = (0, react_1.useState)(null), diff = _b[0], setDiff = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var getVersionDiff = (0, useLayoutVersioning_1.useLayoutVersioning)({ layoutId: layoutId }).getVersionDiff;
    (0, react_1.useEffect)(function () {
        var loadDiff = function () { return __awaiter(void 0, void 0, void 0, function () {
            var diffData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        return [4 /*yield*/, getVersionDiff(version1.id, version2.id)];
                    case 1:
                        diffData = _a.sent();
                        setDiff(diffData);
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Failed to load diff:', error_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        loadDiff();
    }, [version1.id, version2.id, getVersionDiff]);
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-1/4 mb-4" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-8 bg-gray-100 rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-8 bg-gray-100 rounded" })] })] }) }));
    }
    if (!diff) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-500", children: (0, jsx_runtime_1.jsx)("p", { children: "No differences found between versions" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "version-diff p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold", children: "Version Comparison" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: ["Version ", version1.version_number, " \u2192 Version ", version2.version_number] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [diff.added && diff.added.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-sm font-semibold text-green-700 mb-2", children: ["Added Regions (", diff.added.length, ")"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: diff.added.map(function (region, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-2 bg-green-50 border border-green-200 rounded", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium", children: region.region_type }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-600", children: ["Position: (", region.grid_row, ", ", region.grid_col, ")"] })] }, index)); }) })] })), diff.removed && diff.removed.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-sm font-semibold text-red-700 mb-2", children: ["Removed Regions (", diff.removed.length, ")"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: diff.removed.map(function (region, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-2 bg-red-50 border border-red-200 rounded", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium", children: region.region_type }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-600", children: ["Position: (", region.grid_row, ", ", region.grid_col, ")"] })] }, index)); }) })] })), diff.modified && diff.modified.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-sm font-semibold text-yellow-700 mb-2", children: ["Modified Regions (", diff.modified.length, ")"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: diff.modified.map(function (change, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-2 bg-yellow-50 border border-yellow-200 rounded", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium", children: change.new.region_type }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1 text-xs space-y-1", children: [change.old.grid_row !== change.new.grid_row && ((0, jsx_runtime_1.jsxs)("p", { className: "text-gray-600", children: ["Row: ", change.old.grid_row, " \u2192 ", change.new.grid_row] })), change.old.grid_col !== change.new.grid_col && ((0, jsx_runtime_1.jsxs)("p", { className: "text-gray-600", children: ["Col: ", change.old.grid_col, " \u2192 ", change.new.grid_col] })), change.old.row_span !== change.new.row_span && ((0, jsx_runtime_1.jsxs)("p", { className: "text-gray-600", children: ["Row Span: ", change.old.row_span, " \u2192 ", change.new.row_span] })), change.old.col_span !== change.new.col_span && ((0, jsx_runtime_1.jsxs)("p", { className: "text-gray-600", children: ["Col Span: ", change.old.col_span, " \u2192 ", change.new.col_span] }))] })] }, index)); }) })] })), (!diff.added || diff.added.length === 0) &&
                        (!diff.removed || diff.removed.length === 0) &&
                        (!diff.modified || diff.modified.length === 0) && ((0, jsx_runtime_1.jsx)("div", { className: "p-4 text-center text-gray-500", children: (0, jsx_runtime_1.jsx)("p", { children: "No differences found between these versions" }) }))] })] }));
};
exports.VersionDiffView = VersionDiffView;
