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
exports.useUserPreferences = exports.useUserPreferencesStore = void 0;
var zustand_1 = require("zustand");
var middleware_1 = require("zustand/middleware");
var defaultPreferences = {
    viewMode: 'list',
    densityMode: 'dense',
    defaultFilters: {},
    sortPreferences: {
        name: 'asc',
        created_at: 'desc',
    },
    theme: 'light',
    notifications: {
        email: true,
        push: true,
        sms: false,
    },
};
exports.useUserPreferencesStore = (0, zustand_1.create)()((0, middleware_1.persist)(function (set, get) { return ({
    preferences: defaultPreferences,
    isLoading: false,
    error: null,
    updatePreferences: function (updates) { return __awaiter(void 0, void 0, void 0, function () {
        var preferences, newPreferences;
        return __generator(this, function (_a) {
            preferences = get().preferences;
            newPreferences = __assign(__assign({}, preferences), updates);
            set({ preferences: newPreferences, isLoading: true });
            try {
                // Update local storage immediately for responsive UX
                localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
                // Sync to database in background
                // TODO: Implement when user preferences API is ready
                // await enhancedApi.userPreferences.update(newPreferences);
                set({ isLoading: false, error: null });
            }
            catch (error) {
                set({
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Failed to update preferences'
                });
            }
            return [2 /*return*/];
        });
    }); },
    resetPreferences: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            set({ isLoading: true });
            try {
                set({ preferences: defaultPreferences, isLoading: false, error: null });
                localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
            }
            catch (error) {
                set({
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Failed to reset preferences'
                });
            }
            return [2 /*return*/];
        });
    }); },
    syncWithDatabase: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            set({ isLoading: true });
            try {
                // TODO: Implement when user preferences API is ready
                // const dbPreferences = await enhancedApi.userPreferences.getByUser(userId);
                // const localPreferences = get().preferences;
                // const mergedPreferences = { ...defaultPreferences, ...dbPreferences, ...localPreferences };
                // set({ preferences: mergedPreferences, isLoading: false, error: null });
                set({ isLoading: false, error: null });
            }
            catch (error) {
                set({
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Failed to sync preferences'
                });
            }
            return [2 /*return*/];
        });
    }); },
}); }, {
    name: 'userPreferences',
    partialize: function (state) { return ({ preferences: state.preferences }); },
}));
// Hook for easy access to preferences
var useUserPreferences = function () {
    var _a = (0, exports.useUserPreferencesStore)(), preferences = _a.preferences, updatePreferences = _a.updatePreferences, isLoading = _a.isLoading, error = _a.error;
    return {
        preferences: preferences,
        updatePreferences: updatePreferences,
        isLoading: isLoading,
        error: error,
        // Convenience methods
        setViewMode: function (viewMode) { return updatePreferences({ viewMode: viewMode }); },
        setDensityMode: function (densityMode) { return updatePreferences({ densityMode: densityMode }); },
        setTheme: function (theme) { return updatePreferences({ theme: theme }); },
    };
};
exports.useUserPreferences = useUserPreferences;
