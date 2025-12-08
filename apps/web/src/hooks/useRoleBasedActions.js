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
exports.useRoleBasedActions = void 0;
var react_1 = require("react");
var auth_1 = require("@/stores/auth");
var logger_1 = require("@/utils/logger");
var role_actions_1 = require("@/types/role-actions");
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
var useRoleBasedActions = function (cardContext) {
    var _a = (0, react_1.useState)(false), isExecuting = _a[0], setIsExecuting = _a[1];
    var _b = (0, react_1.useState)(null), lastResult = _b[0], setLastResult = _b[1];
    var authStore = (0, auth_1.useAuthStore)();
    // Get user's role from auth store
    var userRole = (0, react_1.useMemo)(function () {
        var user = authStore.user;
        if (!user || !user.roles || user.roles.length === 0) {
            return 'technician'; // Default role
        }
        return user.roles[0]; // Use first role for now
    }, [authStore.user]);
    // Get user's permissions from auth store (includes custom permissions already combined by backend)
    var userPermissions = (0, react_1.useMemo)(function () {
        var user = authStore.user;
        // Use permissions directly from the user object, which includes custom permissions
        // combined with role-based permissions by the backend PermissionsService
        if (user && user.permissions && Array.isArray(user.permissions)) {
            return user.permissions;
        }
        // Fallback to role-based permissions if user.permissions is not available
        var role = role_actions_1.PREDEFINED_ROLES.find(function (r) { return r.id === userRole; });
        if (!role)
            return [];
        return role.permissions.map(function (p) { return "".concat(p.resource, ":").concat(p.action); });
    }, [authStore.user, userRole]);
    // Filter actions based on user's role and permissions
    var availableActions = (0, react_1.useMemo)(function () {
        return role_actions_1.PREDEFINED_ACTIONS.filter(function (action) {
            // Check if user has required permissions
            var hasPermission = action.permissions.every(function (permission) {
                return userPermissions.includes(permission);
            });
            // Check if action requires selection and we have selected items
            var hasSelection = !action.requiresSelection ||
                ((cardContext === null || cardContext === void 0 ? void 0 : cardContext.selectedItems) && cardContext.selectedItems.length > 0);
            return hasPermission && hasSelection;
        });
    }, [userRole, userPermissions, cardContext === null || cardContext === void 0 ? void 0 : cardContext.selectedItems]);
    // Group actions by category
    var actionsByCategory = (0, react_1.useMemo)(function () {
        var grouped = availableActions.reduce(function (acc, action) {
            var _a;
            var bucket = (_a = acc[action.category]) !== null && _a !== void 0 ? _a : [];
            bucket.push(action);
            acc[action.category] = bucket;
            return acc;
        }, {});
        return grouped;
    }, [availableActions]);
    // Execute an action
    var executeAction = (0, react_1.useCallback)(function (action, payload) { return __awaiter(void 0, void 0, void 0, function () {
        var requestPayload, response, errorData, result, error_1, result;
        var _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setIsExecuting(true);
                    setLastResult(null);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, 7, 8]);
                    requestPayload = __assign(__assign({}, payload), { selectedItems: (cardContext === null || cardContext === void 0 ? void 0 : cardContext.selectedItems) || [], filters: (cardContext === null || cardContext === void 0 ? void 0 : cardContext.activeFilters) || {}, userId: (_b = authStore.user) === null || _b === void 0 ? void 0 : _b.id, tenantId: (_c = authStore.user) === null || _c === void 0 ? void 0 : _c.tenant_id });
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL).concat(action.endpoint), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(authStore.token)
                            },
                            body: JSON.stringify(requestPayload)
                        })];
                case 2:
                    response = _d.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json().catch(function () { return ({}); })];
                case 3:
                    errorData = _d.sent();
                    throw new Error(errorData.message || "HTTP ".concat(response.status, ": ").concat(response.statusText));
                case 4:
                    _a = {
                        success: true,
                        message: action.successMessage || 'Action completed successfully'
                    };
                    return [4 /*yield*/, response.json()];
                case 5:
                    result = (_a.data = _d.sent(),
                        _a);
                    setLastResult(result);
                    return [2 /*return*/, result];
                case 6:
                    error_1 = _d.sent();
                    result = {
                        success: false,
                        error: error_1 instanceof Error ? error_1.message : 'Unknown error occurred'
                    };
                    setLastResult(result);
                    return [2 /*return*/, result];
                case 7:
                    setIsExecuting(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); }, [cardContext, authStore]);
    // Execute action with confirmation
    var executeActionWithConfirmation = (0, react_1.useCallback)(function (action, payload, onConfirm) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (action.confirmMessage && !onConfirm) {
                // This would typically trigger a confirmation modal
                // For now, we'll return a pending result
                return [2 /*return*/, {
                        success: false,
                        error: 'Confirmation required'
                    }];
            }
            return [2 /*return*/, executeAction(action, payload)];
        });
    }); }, [executeAction]);
    // Get actions for a specific context
    var getActionsForContext = (0, react_1.useCallback)(function (context) {
        return availableActions.filter(function (action) { return action.context === context; });
    }, [availableActions]);
    // Get actions for a specific category
    var getActionsForCategory = (0, react_1.useCallback)(function (category) {
        return actionsByCategory[category] || [];
    }, [actionsByCategory]);
    // Check if user can perform a specific action
    var canPerformAction = (0, react_1.useCallback)(function (actionId) {
        var action = role_actions_1.PREDEFINED_ACTIONS.find(function (a) { return a.id === actionId; });
        if (!action)
            return false;
        var hasPermission = action.permissions.every(function (permission) {
            return userPermissions.includes(permission);
        });
        var hasSelection = !action.requiresSelection ||
            ((cardContext === null || cardContext === void 0 ? void 0 : cardContext.selectedItems) && cardContext.selectedItems.length > 0);
        return hasPermission && hasSelection;
    }, [userPermissions, cardContext === null || cardContext === void 0 ? void 0 : cardContext.selectedItems]);
    // Get action by ID
    var getActionById = (0, react_1.useCallback)(function (actionId) {
        return role_actions_1.PREDEFINED_ACTIONS.find(function (a) { return a.id === actionId; });
    }, []);
    // Execute multiple actions in sequence
    var executeMultipleActions = (0, react_1.useCallback)(function (actionIds, payloads) { return __awaiter(void 0, void 0, void 0, function () {
        var results, _i, actionIds_1, actionId, action, payload, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = [];
                    _i = 0, actionIds_1 = actionIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < actionIds_1.length)) return [3 /*break*/, 6];
                    actionId = actionIds_1[_i];
                    action = getActionById(actionId);
                    if (!(action && canPerformAction(actionId))) return [3 /*break*/, 5];
                    payload = payloads === null || payloads === void 0 ? void 0 : payloads[actionId];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, executeAction(action, payload)];
                case 3:
                    result = _a.sent();
                    results.push(result);
                    // Stop on first failure
                    if (!result.success) {
                        return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    logger_1.logger.error('Failed to execute role-based action', {
                        error: error_2 instanceof Error ? error_2.message : String(error_2),
                        actionId: actionId
                    });
                    // Add error result and continue
                    results.push({
                        success: false,
                        error: 'Unexpected error during action execution'
                    });
                    return [3 /*break*/, 6];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, results];
            }
        });
    }); }, [executeAction, getActionById, canPerformAction]);
    return {
        // Data
        userRole: userRole,
        userPermissions: userPermissions,
        availableActions: availableActions,
        actionsByCategory: actionsByCategory,
        // State
        isExecuting: isExecuting,
        lastResult: lastResult,
        // Actions
        executeAction: executeAction,
        executeActionWithConfirmation: executeActionWithConfirmation,
        executeMultipleActions: executeMultipleActions,
        // Utilities
        getActionsForContext: getActionsForContext,
        getActionsForCategory: getActionsForCategory,
        canPerformAction: canPerformAction,
        getActionById: getActionById
    };
};
exports.useRoleBasedActions = useRoleBasedActions;
