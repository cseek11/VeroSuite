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
exports.handleKpiBuilderSave = exports.handleTemplateLibraryUseTemplate = exports.handleKpiBuilderUseTemplate = void 0;
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var kpiTemplateUtils_1 = require("@/utils/kpiTemplateUtils");
var cardHelpers_1 = require("./cardHelpers");
var handleKpiBuilderUseTemplate = function (template, localAddCard, currentLayoutId, setKpiData, setShowKPIBuilder) { return __awaiter(void 0, void 0, void 0, function () {
    var cardId_1, kpiData_1, linkage, cfg, serverPayload, retryCount_1, maxRetries, lastError, err_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                cardId_1 = localAddCard('kpi-display', { x: 0, y: 0 });
                kpiData_1 = (0, kpiTemplateUtils_1.transformTemplateToKpiData)(template, cardId_1);
                linkage = (0, cardHelpers_1.isUserTemplate)(template)
                    ? { user_kpi_id: template.id }
                    : { template_id: template.id };
                if (!linkage.user_kpi_id && !linkage.template_id) {
                    throw new Error('No valid linkage found for template');
                }
                cfg = {
                    name: kpiData_1.name,
                    description: kpiData_1.description,
                    threshold: kpiData_1.threshold || { green: 80, yellow: 60, unit: '%' },
                    chart: kpiData_1.chart || { type: 'line' }
                };
                serverPayload = __assign(__assign({ card_uid: cardId_1, type: 'kpi-display', x: 0, y: 0, width: 300, height: 200 }, linkage), { config: cfg });
                if (!currentLayoutId) return [3 /*break*/, 9];
                retryCount_1 = 0;
                maxRetries = 3;
                lastError = null;
                _a.label = 1;
            case 1:
                if (!(retryCount_1 < maxRetries)) return [3 /*break*/, 8];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 7]);
                return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, serverPayload)];
            case 3:
                _a.sent();
                return [3 /*break*/, 8];
            case 4:
                err_1 = _a.sent();
                lastError = err_1;
                retryCount_1++;
                if (!(retryCount_1 < maxRetries)) return [3 /*break*/, 6];
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, Math.pow(2, retryCount_1) * 1000); })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 1];
            case 8:
                if (retryCount_1 >= maxRetries) {
                    throw new Error("KPI Builder server operation failed after ".concat(maxRetries, " attempts: ").concat(lastError === null || lastError === void 0 ? void 0 : lastError.message));
                }
                setKpiData(function (prev) {
                    var _a;
                    return (__assign(__assign({}, prev), (_a = {}, _a[cardId_1] = kpiData_1, _a)));
                });
                return [3 /*break*/, 10];
            case 9: throw new Error('No currentLayoutId available for KPI Builder atomic operation');
            case 10:
                setShowKPIBuilder(false);
                return [3 /*break*/, 12];
            case 11:
                error_1 = _a.sent();
                throw error_1;
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.handleKpiBuilderUseTemplate = handleKpiBuilderUseTemplate;
var handleTemplateLibraryUseTemplate = function (template, localAddCard, currentLayoutId, setKpiData, setShowTemplateLibrary) { return __awaiter(void 0, void 0, void 0, function () {
    var cardId_2, kpiData_2, linkage, cfg, serverPayload, retryCount_2, maxRetries, lastError, err_2, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                cardId_2 = localAddCard('kpi-display', { x: 0, y: 0 });
                kpiData_2 = (0, kpiTemplateUtils_1.transformTemplateToKpiData)(template, cardId_2);
                linkage = (0, cardHelpers_1.isUserTemplate)(template)
                    ? { user_kpi_id: template.id }
                    : { template_id: template.id };
                if (!linkage.user_kpi_id && !linkage.template_id) {
                    throw new Error('No valid linkage found for template');
                }
                cfg = {
                    name: kpiData_2.name,
                    description: kpiData_2.description,
                    threshold: kpiData_2.threshold || { green: 80, yellow: 60, unit: '%' },
                    chart: kpiData_2.chart || { type: 'line' }
                };
                serverPayload = __assign(__assign({ card_uid: cardId_2, type: 'kpi-display', x: 0, y: 0, width: 300, height: 200 }, linkage), { config: cfg });
                if (!currentLayoutId) return [3 /*break*/, 9];
                retryCount_2 = 0;
                maxRetries = 3;
                lastError = null;
                _a.label = 1;
            case 1:
                if (!(retryCount_2 < maxRetries)) return [3 /*break*/, 8];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 7]);
                return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, serverPayload)];
            case 3:
                _a.sent();
                return [3 /*break*/, 8];
            case 4:
                err_2 = _a.sent();
                lastError = err_2;
                retryCount_2++;
                if (!(retryCount_2 < maxRetries)) return [3 /*break*/, 6];
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, Math.pow(2, retryCount_2) * 1000); })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 1];
            case 8:
                if (retryCount_2 >= maxRetries) {
                    throw new Error("Server operation failed after ".concat(maxRetries, " attempts: ").concat(lastError === null || lastError === void 0 ? void 0 : lastError.message));
                }
                setKpiData(function (prev) {
                    var _a;
                    return (__assign(__assign({}, prev), (_a = {}, _a[cardId_2] = kpiData_2, _a)));
                });
                return [3 /*break*/, 10];
            case 9: throw new Error('No currentLayoutId available for atomic operation');
            case 10:
                setShowTemplateLibrary(false);
                return [3 /*break*/, 12];
            case 11:
                error_2 = _a.sent();
                throw error_2;
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.handleTemplateLibraryUseTemplate = handleTemplateLibraryUseTemplate;
var handleKpiBuilderSave = function (kpi, addCard, currentLayoutId, setKpiData, setShowKPIBuilder) { return __awaiter(void 0, void 0, void 0, function () {
    var trackingId, userKpiData, savedKpi_1, newCardId_1, error_3, error_4, error_5;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 10, , 11]);
                trackingId = kpi.templateId || null;
                userKpiData = {
                    name: kpi.name,
                    description: kpi.description,
                    category: kpi.category || 'operational',
                    threshold: kpi.threshold || {
                        green: 80,
                        yellow: 60,
                        red: 40,
                        unit: '%'
                    },
                    enabled: true,
                    realTime: kpi.isRealTime || false,
                    tags: [],
                    templateId: trackingId,
                    formulaExpression: ((_a = kpi.formula) === null || _a === void 0 ? void 0 : _a.expression) || 'SUM(value)',
                    formulaFields: (((_b = kpi.formula) === null || _b === void 0 ? void 0 : _b.fields) || []).filter(function (field) { return field && typeof field === 'string'; })
                };
                return [4 /*yield*/, enhanced_api_1.enhancedApi.userKpis.create(userKpiData)];
            case 1:
                savedKpi_1 = _c.sent();
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, addCard('kpi-display', { x: 0, y: 0 })];
            case 3:
                newCardId_1 = _c.sent();
                return [3 /*break*/, 5];
            case 4:
                error_3 = _c.sent();
                logger_1.logger.error('Failed to add KPI display card', error_3, 'kpiHandlers');
                throw error_3;
            case 5:
                setKpiData(function (prev) {
                    var _a;
                    var transformedKpiData = {
                        id: savedKpi_1.id,
                        name: savedKpi_1.name,
                        description: savedKpi_1.description || 'User-defined KPI',
                        category: savedKpi_1.category || 'operational',
                        formula_expression: savedKpi_1.formula_expression,
                        formula_fields: savedKpi_1.formula_fields || [],
                        threshold_config: savedKpi_1.threshold_config || {},
                        chart_config: savedKpi_1.chart_config || { type: 'number' },
                        data_source_config: savedKpi_1.data_source_config || {},
                        tags: savedKpi_1.tags || [],
                        is_active: savedKpi_1.is_active,
                        created_at: savedKpi_1.created_at,
                        template_id: savedKpi_1.template_id,
                        user_id: savedKpi_1.user_id,
                        tenant_id: savedKpi_1.tenant_id,
                        enabled: savedKpi_1.is_active !== false,
                        realTime: savedKpi_1.realTime || false,
                        threshold: savedKpi_1.threshold_config || {
                            green: 80,
                            yellow: 60,
                            unit: '%'
                        },
                        chart: savedKpi_1.chart_config || { type: 'line' }
                    };
                    return __assign(__assign({}, prev), (_a = {}, _a[newCardId_1] = transformedKpiData, _a));
                });
                if (!currentLayoutId) return [3 /*break*/, 9];
                _c.label = 6;
            case 6:
                _c.trys.push([6, 8, , 9]);
                return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, {
                        id: newCardId_1,
                        type: 'kpi-display',
                        x: 0,
                        y: 0,
                        width: 300,
                        height: 200
                    })];
            case 7:
                _c.sent();
                return [3 /*break*/, 9];
            case 8:
                error_4 = _c.sent();
                logger_1.logger.error('Failed to persist KPI card to layout', error_4, 'kpiHandlers');
                throw error_4;
            case 9:
                setShowKPIBuilder(false);
                return [3 /*break*/, 11];
            case 10:
                error_5 = _c.sent();
                logger_1.logger.error('Failed to save KPI from builder', error_5, 'kpiHandlers');
                throw error_5;
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.handleKpiBuilderSave = handleKpiBuilderSave;
