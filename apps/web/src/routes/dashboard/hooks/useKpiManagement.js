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
exports.useKpiManagement = void 0;
var react_1 = require("react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var constants_1 = require("../utils/constants");
var logger_1 = require("@/utils/logger");
var useKpiManagement = function () {
    var _a = (0, react_1.useState)({}), kpiData = _a[0], setKpiData = _a[1];
    var processedKpisRef = (0, react_1.useRef)(new Set());
    // Persist KPI data changes
    (0, react_1.useEffect)(function () {
        try {
            localStorage.setItem(constants_1.KPI_DATA_STORAGE_KEY, JSON.stringify(kpiData));
        }
        catch (_e) { }
    }, [kpiData]);
    // Test KPI templates loading with proper error handling
    (0, react_1.useEffect)(function () {
        var testKpiTemplates = function () { return __awaiter(void 0, void 0, void 0, function () {
            var templates, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        logger_1.logger.debug('Testing KPI templates loading');
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.kpiTemplates.list()];
                    case 1:
                        templates = _a.sent();
                        logger_1.logger.info('KPI templates test successful', { count: (templates === null || templates === void 0 ? void 0 : templates.length) || 0 });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        logger_1.logger.error('KPI templates test failed', error_1, 'KpiManagement');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        testKpiTemplates();
    }, []);
    var loadServerLayoutData = function (layoutId, loadLayoutFromData, setCurrentLayoutId, setServerLoadSucceeded) { return __awaiter(void 0, void 0, void 0, function () {
        var cards, serverCards, serverKpiData, kpiCards, templateIds, userKpiIds, templateMap, templates, _e_1, userKpiMap, userKpisList, _e_2, mergedCards, saved, localLayout_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.listCards(layoutId)];
                case 1:
                    cards = _a.sent();
                    serverCards = {};
                    serverKpiData = {};
                    kpiCards = [];
                    templateIds = new Set();
                    userKpiIds = new Set();
                    cards.forEach(function (card) {
                        serverCards[card.card_uid] = {
                            id: card.card_uid,
                            type: card.type,
                            x: card.x,
                            y: card.y,
                            width: card.width,
                            height: card.height
                        };
                        if (card.type === 'kpi-display' && (card.user_kpi_id || card.template_id)) {
                            kpiCards.push(card);
                            if (card.template_id)
                                templateIds.add(card.template_id);
                            if (card.user_kpi_id)
                                userKpiIds.add(card.user_kpi_id);
                        }
                    });
                    templateMap = {};
                    if (!(templateIds.size > 0)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.kpiTemplates.list()];
                case 3:
                    templates = _a.sent();
                    templateMap = Object.fromEntries((templates || [])
                        .filter(function (t) { return templateIds.has(t.id); })
                        .map(function (t) { return [t.id, t]; }));
                    return [3 /*break*/, 5];
                case 4:
                    _e_1 = _a.sent();
                    return [3 /*break*/, 5];
                case 5:
                    userKpiMap = {};
                    if (!(userKpiIds.size > 0)) return [3 /*break*/, 9];
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.userKpis.list()];
                case 7:
                    userKpisList = _a.sent();
                    userKpiMap = Object.fromEntries((userKpisList || [])
                        .filter(function (u) { return userKpiIds.has(u.id); })
                        .map(function (u) { return [u.id, u]; }));
                    return [3 /*break*/, 9];
                case 8:
                    _e_2 = _a.sent();
                    return [3 /*break*/, 9];
                case 9:
                    // Build KPI display data
                    kpiCards.forEach(function (card) {
                        var cfg = (card.config || {});
                        var tpl = card.template_id ? templateMap[card.template_id] : undefined;
                        var userKpi = card.user_kpi_id ? userKpiMap[card.user_kpi_id] : undefined;
                        var threshold = cfg.threshold || (userKpi === null || userKpi === void 0 ? void 0 : userKpi.threshold_config) || (tpl === null || tpl === void 0 ? void 0 : tpl.threshold_config) ||
                            { green: 80, yellow: 60, unit: '%' };
                        var chart = cfg.chart || (userKpi === null || userKpi === void 0 ? void 0 : userKpi.chart_config) || (tpl === null || tpl === void 0 ? void 0 : tpl.chart_config) || { type: 'line' };
                        var name = cfg.name || (userKpi === null || userKpi === void 0 ? void 0 : userKpi.name) || (tpl === null || tpl === void 0 ? void 0 : tpl.name) || 'KPI Display';
                        var description = cfg.description || (userKpi === null || userKpi === void 0 ? void 0 : userKpi.description) || (tpl === null || tpl === void 0 ? void 0 : tpl.description) || '';
                        var kpiDisplayData = {
                            id: card.user_kpi_id || card.template_id,
                            template_id: card.template_id,
                            user_kpi_id: card.user_kpi_id,
                            name: name,
                            description: description,
                            enabled: true,
                            realTime: false,
                            threshold: threshold,
                            chart: chart,
                            config: cfg
                        };
                        serverKpiData[card.card_uid] = kpiDisplayData;
                    });
                    mergedCards = __assign({}, serverCards);
                    // Load localStorage data and merge page cards
                    try {
                        saved = localStorage.getItem('verocards-v2-layout');
                        if (saved) {
                            localLayout_1 = JSON.parse(saved);
                            if (localLayout_1.cards) {
                                // Keep page cards from localStorage (they have updated sizes/positions)
                                Object.keys(localLayout_1.cards).forEach(function (cardId) {
                                    if (cardId.includes('-page') || localLayout_1.cards[cardId].type.includes('-page')) {
                                        mergedCards[cardId] = localLayout_1.cards[cardId];
                                    }
                                });
                            }
                        }
                    }
                    catch (error) {
                        logger_1.logger.warn('Failed to merge localStorage layout data', undefined, 'KpiManagement');
                    }
                    // Update layout with merged cards
                    if (Object.keys(mergedCards).length > 0) {
                        loadLayoutFromData({
                            cards: mergedCards,
                            canvasHeight: 600,
                            theme: 'light'
                        });
                    }
                    // Update KPI data
                    if (Object.keys(serverKpiData).length > 0) {
                        setKpiData(serverKpiData);
                    }
                    setCurrentLayoutId(layoutId);
                    setServerLoadSucceeded(true);
                    // If no server cards, ensure layout is empty
                    if (Object.keys(serverCards).length === 0) {
                        loadLayoutFromData({ cards: {}, canvasHeight: 600, theme: 'light' });
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        kpiData: kpiData,
        setKpiData: setKpiData,
        processedKpisRef: processedKpisRef,
        loadServerLayoutData: loadServerLayoutData
    };
};
exports.useKpiManagement = useKpiManagement;
