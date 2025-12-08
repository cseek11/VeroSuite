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
exports.useCustomerPopup = exports.useCustomerPopupStore = void 0;
var zustand_1 = require("zustand");
var react_1 = require("react");
var enhanced_api_1 = require("@/lib/enhanced-api");
exports.useCustomerPopupStore = (0, zustand_1.create)(function (set) { return ({
    customer: null,
    isLoading: false,
    error: null,
    loadCustomer: function (customerId) { return __awaiter(void 0, void 0, void 0, function () {
        var customer, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ isLoading: true, error: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.customers.getById(customerId)];
                case 2:
                    customer = _a.sent();
                    set({ customer: customer, isLoading: false });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    set({
                        error: error_1 instanceof Error ? error_1.message : 'Failed to load customer',
                        isLoading: false
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    clearCustomer: function () {
        set({ customer: null, error: null });
    },
}); });
// Hook for popup component
var useCustomerPopup = function (customerId) {
    var _a = (0, exports.useCustomerPopupStore)(), customer = _a.customer, isLoading = _a.isLoading, error = _a.error, loadCustomer = _a.loadCustomer, clearCustomer = _a.clearCustomer;
    // Auto-load customer when ID changes
    (0, react_1.useEffect)(function () {
        if (customerId) {
            loadCustomer(customerId);
        }
        else {
            clearCustomer();
        }
    }, [customerId]);
    return {
        customer: customer,
        isLoading: isLoading,
        error: error,
        reload: function () { return customerId ? loadCustomer(customerId) : Promise.resolve(); },
    };
};
exports.useCustomerPopup = useCustomerPopup;
