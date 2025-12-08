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
exports.useServerPersistence = void 0;
var react_1 = require("react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var cardHelpers_1 = require("../utils/cardHelpers");
var logger_1 = require("@/utils/logger");
var useServerPersistence = function (localUpdateCardPosition, localUpdateCardSize, localAddCard, localRemoveCard, localUpdateMultipleCardPositions, _loadLayoutFromData, layout, kpiData, setKpiData, KPI_DATA_STORAGE_KEY) {
    var _a = (0, react_1.useState)(null), currentLayoutId = _a[0], setCurrentLayoutId = _a[1];
    var _b = (0, react_1.useState)(true), isLoadingLayout = _b[0], setIsLoadingLayout = _b[1];
    var _c = (0, react_1.useState)(false), serverLoadSucceeded = _c[0], setServerLoadSucceeded = _c[1];
    var updateCardPosition = (0, react_1.useCallback)(function (cardId, x, y) { return __awaiter(void 0, void 0, void 0, function () {
        var card, kd, linkage, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localUpdateCardPosition(cardId, x, y);
                    // Only attempt server persistence if we have a layout ID
                    // If no layout ID, operation succeeds locally (no error)
                    if (!currentLayoutId) {
                        logger_1.logger.debug('No layout ID, skipping server persistence for card position', { cardId: cardId });
                        return [2 /*return*/]; // Success - local update only
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    card = layout.cards[cardId];
                    if (!card) {
                        logger_1.logger.warn('Card not found in layout, skipping server persistence', { cardId: cardId });
                        return [2 /*return*/]; // Not an error - card might not be in layout yet
                    }
                    kd = kpiData[cardId] || {};
                    linkage = {};
                    // Only include user_kpi_id if it's a valid UUID
                    if (kd.user_kpi_id && typeof kd.user_kpi_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.user_kpi_id)) {
                        linkage.user_kpi_id = kd.user_kpi_id;
                    }
                    // Only include template_id if it's a valid UUID or valid string
                    if (kd.template_id && typeof kd.template_id === 'string') {
                        // Check if it's a valid UUID format
                        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.template_id)) {
                            linkage.template_id = kd.template_id;
                        }
                    }
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, __assign({ card_uid: cardId, type: card.type, x: x, y: y, width: card.width, height: card.height }, linkage))];
                case 2:
                    _a.sent();
                    logger_1.logger.debug('Card position updated on server successfully', { cardId: cardId });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to update card position on server', error_1, 'ServerPersistence');
                    // Re-throw only actual errors (network failures, API errors, etc.)
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [localUpdateCardPosition, currentLayoutId, layout.cards, kpiData]);
    var updateCardSize = (0, react_1.useCallback)(function (cardId, width, height, position) { return __awaiter(void 0, void 0, void 0, function () {
        var card, kd, linkage, x, y, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    localUpdateCardSize(cardId, width, height);
                    // Only attempt server persistence if we have a layout ID
                    // If no layout ID, operation succeeds locally (no error)
                    if (!currentLayoutId) {
                        logger_1.logger.debug('No layout ID, skipping server persistence for card size', { cardId: cardId });
                        return [2 /*return*/]; // Success - local update only
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    card = layout.cards[cardId];
                    if (!card) {
                        logger_1.logger.warn('Card not found in layout, skipping server persistence', { cardId: cardId });
                        return [2 /*return*/]; // Not an error - card might not be in layout yet
                    }
                    kd = kpiData[cardId] || {};
                    linkage = {};
                    // Only include user_kpi_id if it's a valid UUID
                    if (kd.user_kpi_id && typeof kd.user_kpi_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.user_kpi_id)) {
                        linkage.user_kpi_id = kd.user_kpi_id;
                    }
                    // Only include template_id if it's a valid UUID or valid string
                    if (kd.template_id && typeof kd.template_id === 'string') {
                        // Check if it's a valid UUID format
                        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.template_id)) {
                            linkage.template_id = kd.template_id;
                        }
                    }
                    x = (_a = position === null || position === void 0 ? void 0 : position.x) !== null && _a !== void 0 ? _a : card.x;
                    y = (_b = position === null || position === void 0 ? void 0 : position.y) !== null && _b !== void 0 ? _b : card.y;
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, __assign({ card_uid: cardId, type: card.type, x: x, y: y, width: width, height: height }, linkage))];
                case 2:
                    _c.sent();
                    logger_1.logger.debug('Card size updated on server successfully', { cardId: cardId });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _c.sent();
                    logger_1.logger.error('Failed to update card size on server', error_2, 'ServerPersistence');
                    // Re-throw only actual errors (network failures, API errors, etc.)
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [localUpdateCardSize, currentLayoutId, layout.cards, kpiData]);
    var addCard = (0, react_1.useCallback)(function (type, position) { return __awaiter(void 0, void 0, void 0, function () {
        var cardId, pos, defaultSize, kd, linkage, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cardId = localAddCard(type, position);
                    if (!currentLayoutId) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    pos = position || { x: 0, y: 0 };
                    defaultSize = (0, cardHelpers_1.getDefaultCardSize)(type);
                    kd = kpiData[cardId] || {};
                    linkage = {};
                    // Only include user_kpi_id if it's a valid UUID
                    if (kd.user_kpi_id && typeof kd.user_kpi_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.user_kpi_id)) {
                        linkage.user_kpi_id = kd.user_kpi_id;
                    }
                    // Only include template_id if it's a valid UUID
                    if (kd.template_id && typeof kd.template_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.template_id)) {
                        linkage.template_id = kd.template_id;
                    }
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, __assign({ card_uid: cardId, type: type, x: pos.x, y: pos.y, width: defaultSize.width, height: defaultSize.height }, linkage))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    logger_1.logger.error('Failed to add card on server', error_3, 'ServerPersistence');
                    throw error_3; // Re-throw for error handling system
                case 4: return [2 /*return*/, cardId];
            }
        });
    }); }, [localAddCard, currentLayoutId, kpiData]);
    var removeCard = (0, react_1.useCallback)(function (cardId) { return __awaiter(void 0, void 0, void 0, function () {
        var cards, serverCard, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localRemoveCard(cardId);
                    setKpiData(function (prev) {
                        if (!prev[cardId])
                            return prev;
                        var next = __assign({}, prev);
                        delete next[cardId];
                        return next;
                    });
                    try {
                        localStorage.setItem(KPI_DATA_STORAGE_KEY, JSON.stringify(kpiData));
                    }
                    catch (_b) { }
                    if (!currentLayoutId) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.listCards(currentLayoutId)];
                case 2:
                    cards = _a.sent();
                    serverCard = cards.find(function (c) { return c.card_uid === cardId; });
                    if (!serverCard) return [3 /*break*/, 4];
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.deleteCard(serverCard.id)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_4 = _a.sent();
                    logger_1.logger.error('Failed to remove card on server', error_4, 'ServerPersistence');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [localRemoveCard, currentLayoutId, KPI_DATA_STORAGE_KEY, kpiData, setKpiData]);
    var updateMultipleCardPositions = (0, react_1.useCallback)(function (updates) { return __awaiter(void 0, void 0, void 0, function () {
        var _i, updates_1, update, card, kd, linkage, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localUpdateMultipleCardPositions(updates);
                    if (!currentLayoutId) return [3 /*break*/, 7];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    _i = 0, updates_1 = updates;
                    _a.label = 2;
                case 2:
                    if (!(_i < updates_1.length)) return [3 /*break*/, 5];
                    update = updates_1[_i];
                    card = layout.cards[update.cardId];
                    if (!card) return [3 /*break*/, 4];
                    kd = kpiData[update.cardId] || {};
                    linkage = {};
                    // Only include user_kpi_id if it's a valid UUID
                    if (kd.user_kpi_id && typeof kd.user_kpi_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.user_kpi_id)) {
                        linkage.user_kpi_id = kd.user_kpi_id;
                    }
                    // Only include template_id if it's a valid UUID
                    if (kd.template_id && typeof kd.template_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.template_id)) {
                        linkage.template_id = kd.template_id;
                    }
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, __assign({ card_uid: update.cardId, type: card.type, x: card.x, y: card.y, width: card.width, height: card.height }, linkage))];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_5 = _a.sent();
                    logger_1.logger.error('Failed to update multiple card positions on server', error_5, 'ServerPersistence');
                    throw error_5; // Re-throw for error handling system
                case 7: return [2 /*return*/];
            }
        });
    }); }, [localUpdateMultipleCardPositions, currentLayoutId, layout.cards, kpiData]);
    return {
        currentLayoutId: currentLayoutId,
        setCurrentLayoutId: setCurrentLayoutId,
        isLoadingLayout: isLoadingLayout,
        setIsLoadingLayout: setIsLoadingLayout,
        serverLoadSucceeded: serverLoadSucceeded,
        setServerLoadSucceeded: setServerLoadSucceeded,
        updateCardPosition: updateCardPosition,
        updateCardSize: updateCardSize,
        addCard: addCard,
        removeCard: removeCard,
        updateMultipleCardPositions: updateMultipleCardPositions
    };
};
exports.useServerPersistence = useServerPersistence;
