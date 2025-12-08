"use strict";
/**
 * useServerLayoutLoader Hook
 *
 * Handles loading the server layout on component mount.
 * Extracted from VeroCardsV3.tsx to improve maintainability and reduce file size.
 */
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
exports.useServerLayoutLoader = useServerLayoutLoader;
var react_1 = require("react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var constants_1 = require("../utils/constants");
function useServerLayoutLoader(_a) {
    var _this = this;
    var serverPersistence = _a.serverPersistence, loadServerLayoutData = _a.loadServerLayoutData, loadLayoutFromData = _a.loadLayoutFromData, setKpiData = _a.setKpiData, processedKpisRef = _a.processedKpisRef;
    // Use a ref to track if we've already loaded to prevent infinite loops
    var hasLoadedRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        // Only load once on mount
        if (hasLoadedRef.current)
            return;
        var loadServerLayout = function () { return __awaiter(_this, void 0, void 0, function () {
            var layout, error_1, raw, parsed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasLoadedRef.current = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        serverPersistence.setIsLoadingLayout(true);
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.getOrCreateDefault()];
                    case 2:
                        layout = _a.sent();
                        if (!layout) {
                            serverPersistence.setIsLoadingLayout(false);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, loadServerLayoutData(layout.id, loadLayoutFromData, serverPersistence.setCurrentLayoutId, serverPersistence.setServerLoadSucceeded)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        // Fallback to localStorage
                        try {
                            raw = localStorage.getItem(constants_1.KPI_DATA_STORAGE_KEY);
                            if (raw) {
                                parsed = JSON.parse(raw);
                                if (parsed && typeof parsed === 'object') {
                                    setKpiData(parsed);
                                    Object.values(parsed).forEach(function (entry) {
                                        if (entry && entry.id) {
                                            processedKpisRef.current.add(entry.id);
                                        }
                                    });
                                }
                            }
                        }
                        catch (e) {
                            // Ignore localStorage errors
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        serverPersistence.setIsLoadingLayout(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        loadServerLayout();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array - only run once on mount
}
