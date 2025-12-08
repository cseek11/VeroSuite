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
exports.default = ApiKeyManagement;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
// Mock API - In production, this would call actual backend endpoints
function fetchApiKeys(userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: Implement actual API call when backend endpoint is available
            logger_1.logger.debug('fetchApiKeys stub called', { userId: userId }, 'ApiKeyManagement');
            return [2 /*return*/, []];
        });
    });
}
function createApiKey(userId, name, scopes) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: Implement actual API call when backend endpoint is available
            logger_1.logger.debug('createApiKey stub called', { userId: userId, name: name, scopes: scopes }, 'ApiKeyManagement');
            throw new Error('API key creation not yet implemented');
        });
    });
}
function revokeApiKey(userId, keyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: Implement actual API call when backend endpoint is available
            logger_1.logger.debug('revokeApiKey stub called', { userId: userId, keyId: keyId }, 'ApiKeyManagement');
            throw new Error('API key revocation not yet implemented');
        });
    });
}
function ApiKeyManagement(_a) {
    var userId = _a.userId;
    var _b = (0, react_1.useState)(false), showNewKeyForm = _b[0], setShowNewKeyForm = _b[1];
    var _c = (0, react_1.useState)(''), newKeyName = _c[0], setNewKeyName = _c[1];
    var _d = (0, react_1.useState)([]), selectedScopes = _d[0], setSelectedScopes = _d[1];
    var _e = (0, react_1.useState)(new Set()), visibleKeys = _e[0], setVisibleKeys = _e[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['api-keys', userId],
        queryFn: function () { return fetchApiKeys(userId); },
        enabled: !!userId,
    }), _g = _f.data, apiKeys = _g === void 0 ? [] : _g, isLoading = _f.isLoading;
    var createMutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return createApiKey(userId, newKeyName, selectedScopes); },
        onSuccess: function (data) {
            queryClient.invalidateQueries({ queryKey: ['api-keys', userId] });
            setShowNewKeyForm(false);
            setNewKeyName('');
            setSelectedScopes([]);
            // Show the full key to user (only time it's visible)
            alert("API Key created! Save this key now - it won't be shown again:\n\n".concat(data.key));
        },
        onError: function (error) {
            logger_1.logger.error('Error creating API key', error, 'ApiKeyManagement');
        },
    });
    var revokeMutation = (0, react_query_1.useMutation)({
        mutationFn: function (keyId) { return revokeApiKey(userId, keyId); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['api-keys', userId] });
        },
        onError: function (error) {
            logger_1.logger.error('Error revoking API key', error, 'ApiKeyManagement');
        },
    });
    var toggleKeyVisibility = function (keyId) {
        setVisibleKeys(function (prev) {
            var next = new Set(prev);
            if (next.has(keyId)) {
                next.delete(keyId);
            }
            else {
                next.add(keyId);
            }
            return next;
        });
    };
    var copyToClipboard = function (text) {
        navigator.clipboard.writeText(text);
        // Could show a toast notification here
    };
    var availableScopes = [
        'read:users',
        'write:users',
        'read:jobs',
        'write:jobs',
        'read:customers',
        'write:customers',
        'read:reports',
        'write:reports',
    ];
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-32", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "API Keys" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: "Manage API keys for programmatic access" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setShowNewKeyForm(!showNewKeyForm); }, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }), "Create API Key"] })] }), showNewKeyForm && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-6", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-900 mb-4", children: "Create New API Key" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Key Name ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newKeyName, onChange: function (e) { return setNewKeyName(e.target.value); }, placeholder: "e.g., Production API Key", className: "block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Scopes" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", children: availableScopes.map(function (scope) { return ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedScopes.includes(scope), onChange: function (e) {
                                                        if (e.target.checked) {
                                                            setSelectedScopes(__spreadArray(__spreadArray([], selectedScopes, true), [scope], false));
                                                        }
                                                        else {
                                                            setSelectedScopes(selectedScopes.filter(function (s) { return s !== scope; }));
                                                        }
                                                    }, className: "rounded border-gray-300 text-purple-600 focus:ring-purple-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700", children: scope })] }, scope)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                            setShowNewKeyForm(false);
                                            setNewKeyName('');
                                            setSelectedScopes([]);
                                        }, className: "px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return createMutation.mutate(); }, disabled: !newKeyName || createMutation.isPending, className: "px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50", children: createMutation.isPending ? 'Creating...' : 'Create Key' })] })] })] })), apiKeys.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Key, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { children: "No API keys created yet" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm mt-1", children: "Create your first API key to get started" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: apiKeys.map(function (apiKey) { return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Key, { className: "h-5 w-5 text-purple-500" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-900", children: apiKey.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 mt-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500 font-mono", children: visibleKeys.has(apiKey.id)
                                                                ? "".concat(apiKey.key_prefix, "...")
                                                                : "".concat(apiKey.key_prefix, "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022") }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Created ", new Date(apiKey.created_at).toLocaleDateString()] })] }), apiKey.last_used && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Last used ", new Date(apiKey.last_used).toLocaleDateString()] })] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1 mt-2", children: apiKey.scopes.map(function (scope) { return ((0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800", children: scope }, scope)); }) })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return toggleKeyVisibility(apiKey.id); }, className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md", title: visibleKeys.has(apiKey.id) ? 'Hide Key' : 'Show Key', children: visibleKeys.has(apiKey.id) ? ((0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { className: "h-4 w-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" })) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return copyToClipboard(apiKey.key_prefix); }, className: "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md", title: "Copy Key", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                            if (confirm('Are you sure you want to revoke this API key?')) {
                                                revokeMutation.mutate(apiKey.id);
                                            }
                                        }, className: "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md", title: "Revoke Key", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4" }) })] })] }) }, apiKey.id)); }) })), (0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-blue-900 mb-2", children: "API Key Security" }), (0, jsx_runtime_1.jsxs)("ul", { className: "text-sm text-blue-800 space-y-1 list-disc list-inside", children: [(0, jsx_runtime_1.jsx)("li", { children: "API keys provide full access to your account - keep them secure" }), (0, jsx_runtime_1.jsx)("li", { children: "Never share API keys in public repositories or client-side code" }), (0, jsx_runtime_1.jsx)("li", { children: "Rotate keys regularly for better security" }), (0, jsx_runtime_1.jsx)("li", { children: "Revoke keys immediately if they're compromised" })] })] })] }));
}
