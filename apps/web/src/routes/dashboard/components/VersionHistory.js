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
exports.VersionHistory = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importDefault(require("react"));
var useLayoutVersioning_1 = require("@/hooks/useLayoutVersioning");
var VersionHistory = function (_a) {
    var layoutId = _a.layoutId, onSelectVersion = _a.onSelectVersion, onRevert = _a.onRevert;
    var _b = (0, useLayoutVersioning_1.useLayoutVersioning)({ layoutId: layoutId }), versions = _b.versions, loading = _b.loading, error = _b.error, currentVersion = _b.currentVersion, loadVersions = _b.loadVersions, revertToVersion = _b.revertToVersion;
    react_1.default.useEffect(function () {
        loadVersions();
    }, [loadVersions]);
    var handleRevert = function (version) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm("Are you sure you want to revert to version ".concat(version.version_number, "? This will create a new version with the reverted state."))) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, revertToVersion(version.id)];
                case 2:
                    _a.sent();
                    onRevert === null || onRevert === void 0 ? void 0 : onRevert(version);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to revert:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-1/4 mb-4" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: [1, 2, 3].map(function (i) { return ((0, jsx_runtime_1.jsx)("div", { className: "h-16 bg-gray-100 rounded" }, i)); }) })] }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-4 bg-red-50 border border-red-200 rounded", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-red-800", children: ["Error loading versions: ", error.message] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "version-history p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-4", children: "Version History" }), versions.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-sm", children: "No versions found" })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: versions.map(function (version) { return ((0, jsx_runtime_1.jsx)("div", { className: "p-3 border rounded cursor-pointer hover:bg-gray-50 ".concat((currentVersion === null || currentVersion === void 0 ? void 0 : currentVersion.id) === version.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'), onClick: function () { return onSelectVersion === null || onSelectVersion === void 0 ? void 0 : onSelectVersion(version); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "font-semibold", children: ["Version ", version.version_number] }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 text-xs rounded ".concat(version.status === useLayoutVersioning_1.VersionStatus.PUBLISHED
                                                    ? 'bg-green-100 text-green-800'
                                                    : version.status === useLayoutVersioning_1.VersionStatus.PREVIEW
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'), children: version.status }), (currentVersion === null || currentVersion === void 0 ? void 0 : currentVersion.id) === version.id && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs text-blue-600 font-medium", children: "(Current)" }))] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mt-1", children: new Date(version.created_at).toLocaleString() }), version.notes && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: version.notes }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: (currentVersion === null || currentVersion === void 0 ? void 0 : currentVersion.id) !== version.id && ((0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                        e.stopPropagation();
                                        handleRevert(version);
                                    }, className: "px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700", children: "Revert" })) })] }) }, version.id)); }) }))] }));
};
exports.VersionHistory = VersionHistory;
