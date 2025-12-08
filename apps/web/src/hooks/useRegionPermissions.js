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
exports.useRegionPermissions = useRegionPermissions;
var react_1 = require("react");
function useRegionPermissions(_a) {
    var _this = this;
    var _b, _c, _d;
    var regionId = _a.regionId;
    var _e = (0, react_1.useState)(null), permissions = _e[0], setPermissions = _e[1];
    var acls = (0, react_1.useState)([])[0];
    var _f = (0, react_1.useState)(false), loading = _f[0], setLoading = _f[1];
    var _g = (0, react_1.useState)(null), error = _g[0], setError = _g[1];
    var loadACLs = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var effectivePermissions;
        return __generator(this, function (_a) {
            if (!regionId)
                return [2 /*return*/];
            try {
                setLoading(true);
                setError(null);
                effectivePermissions = {
                    read: true, // Default to read for now
                    edit: false,
                    share: false
                };
                setPermissions(effectivePermissions);
            }
            catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load ACLs'));
            }
            finally {
                setLoading(false);
            }
            return [2 /*return*/];
        });
    }); }, [regionId]);
    var checkPermission = (0, react_1.useCallback)(function (permission) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!permissions) return [3 /*break*/, 2];
                    return [4 /*yield*/, loadACLs()];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2: return [2 /*return*/, (_a = permissions === null || permissions === void 0 ? void 0 : permissions[permission]) !== null && _a !== void 0 ? _a : false];
            }
        });
    }); }, [permissions, loadACLs]);
    var setACL = (0, react_1.useCallback)(function (
    // principalType: 'user' | 'role' | 'team',
    // principalId: string,
    // permissionSet: PermissionSet
    ) { return __awaiter(_this, void 0, void 0, function () {
        var err_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setError(null);
                    // In a real implementation, this would call the API
                    // await enhancedApi.dashboardLayouts.setRegionACL(regionId, {
                    //   principal_type: principalType,
                    //   principal_id: principalId,
                    //   permission_set: permissionSet
                    // });
                    // Reload ACLs
                    return [4 /*yield*/, loadACLs()];
                case 1:
                    // In a real implementation, this would call the API
                    // await enhancedApi.dashboardLayouts.setRegionACL(regionId, {
                    //   principal_type: principalType,
                    //   principal_id: principalId,
                    //   permission_set: permissionSet
                    // });
                    // Reload ACLs
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    error_1 = err_1 instanceof Error ? err_1 : new Error('Failed to set ACL');
                    setError(error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [regionId, loadACLs]);
    var removeACL = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var err_2, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setError(null);
                    // In a real implementation, this would call the API
                    // await enhancedApi.dashboardLayouts.removeRegionACL(regionId, aclId);
                    // Reload ACLs
                    return [4 /*yield*/, loadACLs()];
                case 1:
                    // In a real implementation, this would call the API
                    // await enhancedApi.dashboardLayouts.removeRegionACL(regionId, aclId);
                    // Reload ACLs
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    error_2 = err_2 instanceof Error ? err_2 : new Error('Failed to remove ACL');
                    setError(error_2);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [regionId, loadACLs]);
    // Load ACLs on mount
    (0, react_1.useEffect)(function () {
        loadACLs();
    }, [loadACLs]);
    return {
        permissions: permissions,
        acls: acls,
        loading: loading,
        error: error,
        canRead: (_b = permissions === null || permissions === void 0 ? void 0 : permissions.read) !== null && _b !== void 0 ? _b : false,
        canEdit: (_c = permissions === null || permissions === void 0 ? void 0 : permissions.edit) !== null && _c !== void 0 ? _c : false,
        canShare: (_d = permissions === null || permissions === void 0 ? void 0 : permissions.share) !== null && _d !== void 0 ? _d : false,
        checkPermission: checkPermission,
        setACL: setACL,
        removeACL: removeACL,
        loadACLs: loadACLs
    };
}
