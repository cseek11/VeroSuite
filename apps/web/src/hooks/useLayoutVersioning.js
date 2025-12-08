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
exports.VersionStatus = void 0;
exports.useLayoutVersioning = useLayoutVersioning;
var react_1 = require("react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var VersionStatus;
(function (VersionStatus) {
    VersionStatus["DRAFT"] = "draft";
    VersionStatus["PREVIEW"] = "preview";
    VersionStatus["PUBLISHED"] = "published";
})(VersionStatus || (exports.VersionStatus = VersionStatus = {}));
function useLayoutVersioning(_a) {
    var _this = this;
    var layoutId = _a.layoutId;
    var _b = (0, react_1.useState)([]), versions = _b[0], setVersions = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(null), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(null), currentVersion = _e[0], setCurrentVersion = _e[1];
    var loadVersions = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var data, published, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!layoutId) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.getVersions(layoutId)];
                case 2:
                    data = _a.sent();
                    setVersions(data);
                    published = data.find(function (v) { return v.status === VersionStatus.PUBLISHED; });
                    setCurrentVersion(published || null);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1 : new Error('Failed to load versions'));
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [layoutId]);
    // Don't load if layoutId is not available
    (0, react_1.useEffect)(function () {
        if (layoutId) {
            loadVersions();
        }
    }, [layoutId, loadVersions]);
    var createVersion = (0, react_1.useCallback)(function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (status, notes) {
            var version_1, err_2, error_1;
            if (status === void 0) { status = VersionStatus.DRAFT; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        setError(null);
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.createVersion(layoutId, status, notes)];
                    case 1:
                        version_1 = _a.sent();
                        setVersions(function (prev) { return __spreadArray([version_1], prev, true); });
                        return [2 /*return*/, version_1];
                    case 2:
                        err_2 = _a.sent();
                        error_1 = err_2 instanceof Error ? err_2 : new Error('Failed to create version');
                        setError(error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, [layoutId]);
    var publishVersion = (0, react_1.useCallback)(function (versionId, notes) { return __awaiter(_this, void 0, void 0, function () {
        var version, err_3, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setError(null);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.publishVersion(layoutId, versionId, notes)];
                case 1:
                    version = _a.sent();
                    // Update versions list
                    setVersions(function (prev) { return prev.map(function (v) {
                        if (v.id === versionId) {
                            return __assign(__assign({}, v), { status: VersionStatus.PUBLISHED, notes: notes !== null && notes !== void 0 ? notes : v.notes });
                        }
                        if (v.status === VersionStatus.PUBLISHED) {
                            return __assign(__assign({}, v), { status: VersionStatus.DRAFT });
                        }
                        return v;
                    }); });
                    setCurrentVersion(version);
                    return [2 /*return*/, version];
                case 2:
                    err_3 = _a.sent();
                    error_2 = err_3 instanceof Error ? err_3 : new Error('Failed to publish version');
                    setError(error_2);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [layoutId]);
    var revertToVersion = (0, react_1.useCallback)(function (versionId) { return __awaiter(_this, void 0, void 0, function () {
        var err_4, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    setError(null);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.revertToVersion(layoutId, versionId)];
                case 1:
                    _a.sent();
                    // Reload versions after revert
                    return [4 /*yield*/, loadVersions()];
                case 2:
                    // Reload versions after revert
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _a.sent();
                    error_3 = err_4 instanceof Error ? err_4 : new Error('Failed to revert to version');
                    setError(error_3);
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [layoutId, loadVersions]);
    var getVersionDiff = (0, react_1.useCallback)(function (versionId1, versionId2) { return __awaiter(_this, void 0, void 0, function () {
        var version1, version2, diff, regions1, regions2, regionMap1, regionMap2, _i, regionMap2_1, _a, id, region, _b, regionMap1_1, _c, id, region, _d, regionMap1_2, _e, id, region1, region2, error_4;
        var _f, _g;
        return __generator(this, function (_h) {
            try {
                setError(null);
                version1 = versions.find(function (v) { return v.id === versionId1; });
                version2 = versions.find(function (v) { return v.id === versionId2; });
                if (!version1 || !version2) {
                    throw new Error('One or both versions not found');
                }
                diff = {
                    added: [],
                    removed: [],
                    modified: []
                };
                regions1 = ((_f = version1.payload) === null || _f === void 0 ? void 0 : _f.regions) || [];
                regions2 = ((_g = version2.payload) === null || _g === void 0 ? void 0 : _g.regions) || [];
                regionMap1 = new Map(regions1.map(function (r) { return [r.id, r]; }));
                regionMap2 = new Map(regions2.map(function (r) { return [r.id, r]; }));
                // Find added regions
                for (_i = 0, regionMap2_1 = regionMap2; _i < regionMap2_1.length; _i++) {
                    _a = regionMap2_1[_i], id = _a[0], region = _a[1];
                    if (!regionMap1.has(id)) {
                        diff.added.push(region);
                    }
                }
                // Find removed regions
                for (_b = 0, regionMap1_1 = regionMap1; _b < regionMap1_1.length; _b++) {
                    _c = regionMap1_1[_b], id = _c[0], region = _c[1];
                    if (!regionMap2.has(id)) {
                        diff.removed.push(region);
                    }
                }
                // Find modified regions
                for (_d = 0, regionMap1_2 = regionMap1; _d < regionMap1_2.length; _d++) {
                    _e = regionMap1_2[_d], id = _e[0], region1 = _e[1];
                    region2 = regionMap2.get(id);
                    if (region2 && JSON.stringify(region1) !== JSON.stringify(region2)) {
                        diff.modified.push({
                            id: id,
                            old: region1,
                            new: region2
                        });
                    }
                }
                return [2 /*return*/, diff];
            }
            catch (err) {
                error_4 = err instanceof Error ? err : new Error('Failed to get version diff');
                setError(error_4);
                throw error_4;
            }
            return [2 /*return*/];
        });
    }); }, [versions]);
    return {
        versions: versions,
        loading: loading,
        error: error,
        currentVersion: currentVersion,
        createVersion: createVersion,
        publishVersion: publishVersion,
        revertToVersion: revertToVersion,
        getVersionDiff: getVersionDiff,
        loadVersions: loadVersions
    };
}
