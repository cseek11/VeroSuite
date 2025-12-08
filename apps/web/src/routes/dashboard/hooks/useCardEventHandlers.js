"use strict";
/**
 * useCardEventHandlers Hook
 *
 * Handles all custom events for card operations (add, expand, minimize, restore, close).
 * Extracted from VeroCardsV3.tsx to improve maintainability and reduce file size.
 */
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
exports.useCardEventHandlers = useCardEventHandlers;
var react_1 = require("react");
var logger_1 = require("@/utils/logger");
var constants_1 = require("../utils/constants");
function useCardEventHandlers(_a) {
    var _this = this;
    var serverPersistence = _a.serverPersistence, localUpdateCardSize = _a.localUpdateCardSize, localUpdateCardPosition = _a.localUpdateCardPosition, localRemoveCard = _a.localRemoveCard, layout = _a.layout, gridManager = _a.gridManager, errorHandling = _a.errorHandling, syncStatus = _a.syncStatus, toggleCardLock = _a.toggleCardLock, containerRef = _a.containerRef;
    (0, react_1.useEffect)(function () {
        var handleAddCanvasCard = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var customEvent, _a, type, position, cardId, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        customEvent = event;
                        _a = customEvent.detail, type = _a.type, position = _a.position;
                        logger_1.logger.debug('Received addCanvasCard event', { type: type, position: position });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, serverPersistence.addCard(type, position)];
                    case 2:
                        cardId = _b.sent();
                        logger_1.logger.info('Successfully added card to canvas', { cardId: cardId, type: type });
                        // Auto-lock page cards
                        if (type.includes('-page') || type === 'customers-page') {
                            toggleCardLock(cardId);
                            logger_1.logger.debug('Auto-locked page card', { cardId: cardId });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        logger_1.logger.error('Failed to add card to canvas', error_1, 'CardSystem');
                        errorHandling.showError("Failed to add ".concat(type, " card. Please try again."), 'addCard', true);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        var handleExpandCard = function (event) {
            var customEvent = event;
            var cardId = customEvent.detail.cardId;
            logger_1.logger.debug('Received expandCard event', { cardId: cardId });
            // Expand card to reasonable maximum size (not full canvas)
            var canvasContainer = containerRef.current;
            if (canvasContainer) {
                var rect = canvasContainer.getBoundingClientRect();
                // Use viewport dimensions with reasonable constraints
                var maxWidth = Math.min(rect.width * 0.95, 1600); // 95% of canvas or max 1600px
                var maxHeight = Math.min(rect.height * 0.9, 1000); // 90% of canvas or max 1000px
                var padding = 20;
                serverPersistence.updateCardSize(cardId, maxWidth - padding, maxHeight - padding);
                serverPersistence.updateCardPosition(cardId, padding / 2, padding / 2);
            }
            // Dispatch specific card event to trigger expanded display
            setTimeout(function () {
                window.dispatchEvent(new CustomEvent("expandCard-".concat(cardId)));
            }, 100);
        };
        var handleMinimizeCard = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var customEvent, _a, cardId, _cardType, card, MINIMIZED, result, position, gridPosition, persistOperation, error_2, errorMessage, isHttp400, isHttp5xx, isNetworkError;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        customEvent = event;
                        _a = customEvent.detail, cardId = _a.cardId, _cardType = _a.cardType;
                        card = layout.cards[cardId];
                        if (!card) {
                            logger_1.logger.error('Card not found in layout', new Error("Card ".concat(cardId, " not found")), 'CardSystem');
                            return [2 /*return*/];
                        }
                        localStorage.setItem("card-state-".concat(cardId), JSON.stringify({
                            originalSize: { width: card.width, height: card.height },
                            originalPosition: { x: card.x, y: card.y }
                        }));
                        MINIMIZED = constants_1.CARD_CONSTANTS.MINIMIZED;
                        result = gridManager.minimizeToGrid(cardId);
                        if (!result || !result.position || !result.gridPosition) {
                            errorHandling.showError('No available grid position found. Please restore some cards first.', 'minimize', false);
                            logger_1.logger.error('Failed to minimize card - no grid position available', { cardId: cardId });
                            return [2 /*return*/];
                        }
                        position = result.position, gridPosition = result.gridPosition;
                        logger_1.logger.debug('Minimizing card', {
                            cardId: cardId,
                            from: { x: card.x, y: card.y, width: card.width, height: card.height },
                            to: __assign(__assign({}, position), { width: MINIMIZED.WIDTH, height: MINIMIZED.HEIGHT }),
                            grid: gridPosition
                        });
                        // Update local state immediately
                        localUpdateCardSize(cardId, MINIMIZED.WIDTH, MINIMIZED.HEIGHT);
                        localUpdateCardPosition(cardId, position.x, position.y);
                        // Persist to server with error handling
                        syncStatus.startSync();
                        persistOperation = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, serverPersistence.updateCardSize(cardId, MINIMIZED.WIDTH, MINIMIZED.HEIGHT, position)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, serverPersistence.updateCardPosition(cardId, position.x, position.y)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, persistOperation()];
                    case 2:
                        _b.sent();
                        syncStatus.completeSync();
                        logger_1.logger.info('Card minimized successfully', { cardId: cardId });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        errorMessage = error_2 instanceof Error ? error_2.message : String(error_2);
                        isHttp400 = /HTTP\s+400|400\s+Bad\s+Request/i.test(errorMessage);
                        isHttp5xx = /HTTP\s+5\d{2}/i.test(errorMessage);
                        isNetworkError = errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('ECONNREFUSED');
                        if (isHttp400) {
                            // HTTP 400 is usually a validation error - local operation works, so suppress
                            logger_1.logger.debug('Card minimized locally (server validation error suppressed)', { cardId: cardId, reason: errorMessage });
                            syncStatus.completeSync(); // Mark as successful since local operation worked
                        }
                        else if (isHttp5xx || isNetworkError) {
                            // Critical errors - show to user
                            syncStatus.setError('Failed to save minimized position');
                            errorHandling.showError('Failed to save minimized position. Changes are saved locally.', 'minimize', true, persistOperation);
                            logger_1.logger.error('Failed to persist minimized card', error_2, 'CardSystem');
                        }
                        else {
                            // Other non-critical errors - just log
                            logger_1.logger.debug('Card minimized locally (server persistence skipped)', { cardId: cardId, reason: errorMessage });
                            syncStatus.completeSync(); // Still mark as successful since local operation worked
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        // Dispatch event
                        setTimeout(function () {
                            window.dispatchEvent(new CustomEvent("minimizeCard-".concat(cardId)));
                        }, 50);
                        return [2 /*return*/];
                }
            });
        }); };
        var handleRestoreCard = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var customEvent, _a, cardId, originalSize, originalPosition, persistOperation, error_3, errorMessage, isHttp400, isHttp5xx, isNetworkError;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        customEvent = event;
                        _a = customEvent.detail, cardId = _a.cardId, originalSize = _a.originalSize, originalPosition = _a.originalPosition;
                        logger_1.logger.debug('Restoring card', {
                            cardId: cardId,
                            size: originalSize,
                            position: originalPosition
                        });
                        // Remove from occupied positions Map
                        gridManager.releasePosition(cardId);
                        // Restore to original size and position
                        localUpdateCardSize(cardId, originalSize.width, originalSize.height);
                        localUpdateCardPosition(cardId, originalPosition.x, originalPosition.y);
                        // Persist to server with error handling
                        syncStatus.startSync();
                        persistOperation = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, serverPersistence.updateCardSize(cardId, originalSize.width, originalSize.height)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, serverPersistence.updateCardPosition(cardId, originalPosition.x, originalPosition.y)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, persistOperation()];
                    case 2:
                        _b.sent();
                        syncStatus.completeSync();
                        logger_1.logger.info('Card restored successfully', { cardId: cardId });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        errorMessage = error_3 instanceof Error ? error_3.message : String(error_3);
                        isHttp400 = /HTTP\s+400|400\s+Bad\s+Request/i.test(errorMessage);
                        isHttp5xx = /HTTP\s+5\d{2}/i.test(errorMessage);
                        isNetworkError = errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('ECONNREFUSED');
                        if (isHttp400) {
                            // HTTP 400 is usually a validation error - local operation works, so suppress
                            logger_1.logger.debug('Card restored locally (server validation error suppressed)', { cardId: cardId, reason: errorMessage });
                            syncStatus.completeSync(); // Mark as successful since local operation worked
                        }
                        else if (isHttp5xx || isNetworkError) {
                            // Critical errors - show to user
                            syncStatus.setError('Failed to save restored position');
                            errorHandling.showError('Failed to save restored position. Changes are saved locally.', 'restore', true, persistOperation);
                            logger_1.logger.error('Failed to persist restored card', error_3, 'CardSystem');
                        }
                        else {
                            // Other non-critical errors - just log
                            logger_1.logger.debug('Card restored locally (server persistence skipped)', { cardId: cardId, reason: errorMessage });
                            syncStatus.completeSync(); // Still mark as successful since local operation worked
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        // Dispatch specific card event to trigger normal display
                        setTimeout(function () {
                            window.dispatchEvent(new CustomEvent("restoreCard-".concat(cardId)));
                        }, 100);
                        return [2 /*return*/];
                }
            });
        }); };
        var handleHalfScreenCard = function (event) {
            var customEvent = event;
            var cardId = customEvent.detail.cardId;
            logger_1.logger.debug('Setting card to half-screen mode', { cardId: cardId });
            var card = layout.cards[cardId];
            if (!card) {
                logger_1.logger.error('Card not found in layout', new Error("Card ".concat(cardId, " not found")), 'CardSystem');
                return;
            }
            // Save current state before changing to half-screen
            localStorage.setItem("card-state-".concat(cardId), JSON.stringify({
                originalSize: { width: card.width, height: card.height },
                originalPosition: { x: card.x, y: card.y }
            }));
            var canvasContainer = containerRef.current;
            if (!canvasContainer)
                return;
            var rect = canvasContainer.getBoundingClientRect();
            var canvasWidth = rect.width;
            var canvasHeight = rect.height;
            // Calculate half-screen dimensions
            var halfWidth = Math.floor(canvasWidth * 0.48); // 48% to leave some gap
            var halfHeight = Math.min(canvasHeight * 0.9, 800); // 90% of canvas or max 800px
            var gap = canvasWidth * 0.02; // 2% gap between cards
            // Find if there's already a card in half-screen mode
            var allCards = Object.values(layout.cards);
            var halfScreenCards = allCards.filter(function (c) {
                // Check if card is approximately half-screen width
                var isHalfWidth = Math.abs(c.width - halfWidth) < 50;
                var isOnLeft = c.x < canvasWidth * 0.5;
                var isOnRight = c.x >= canvasWidth * 0.5;
                return isHalfWidth && (isOnLeft || isOnRight);
            });
            var newX;
            var newY = 20; // Top padding
            if (halfScreenCards.length === 0) {
                // No other half-screen cards, place on left
                newX = gap;
            }
            else if (halfScreenCards.length === 1) {
                // One card already in half-screen, place on opposite side
                var existingCard = halfScreenCards[0];
                var isExistingOnLeft = existingCard.x < canvasWidth * 0.5;
                newX = isExistingOnLeft ? canvasWidth - halfWidth - gap : gap;
            }
            else {
                // Multiple half-screen cards, place on right side
                newX = canvasWidth - halfWidth - gap;
            }
            // Update card size and position
            localUpdateCardSize(cardId, halfWidth, halfHeight);
            localUpdateCardPosition(cardId, newX, newY);
            // Persist to server
            syncStatus.startSync();
            var persistOperation = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, serverPersistence.updateCardSize(cardId, halfWidth, halfHeight)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, serverPersistence.updateCardPosition(cardId, newX, newY)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); };
            persistOperation().then(function () {
                syncStatus.completeSync();
                logger_1.logger.info('Card set to half-screen mode', { cardId: cardId });
            }).catch(function (error) {
                logger_1.logger.error('Failed to persist half-screen card', error, 'CardSystem');
                syncStatus.completeSync(); // Still mark as complete since local update worked
            });
            // Dispatch event
            setTimeout(function () {
                window.dispatchEvent(new CustomEvent("halfScreenCard-".concat(cardId)));
            }, 100);
        };
        var handleCloseCard = function (event) {
            var customEvent = event;
            var cardId = customEvent.detail.cardId;
            logger_1.logger.debug('Closing card', { cardId: cardId });
            // Remove from occupied positions Map
            gridManager.releasePosition(cardId);
            // Remove card from canvas
            localRemoveCard(cardId);
            logger_1.logger.info('Card closed', { cardId: cardId });
        };
        window.addEventListener('addCanvasCard', handleAddCanvasCard);
        window.addEventListener('expandCard', handleExpandCard);
        window.addEventListener('minimizeCard', handleMinimizeCard);
        window.addEventListener('restoreCard', handleRestoreCard);
        window.addEventListener('halfScreenCard', handleHalfScreenCard);
        window.addEventListener('closeCard', handleCloseCard);
        return function () {
            window.removeEventListener('addCanvasCard', handleAddCanvasCard);
            window.removeEventListener('expandCard', handleExpandCard);
            window.removeEventListener('minimizeCard', handleMinimizeCard);
            window.removeEventListener('restoreCard', handleRestoreCard);
            window.removeEventListener('halfScreenCard', handleHalfScreenCard);
            window.removeEventListener('closeCard', handleCloseCard);
        };
    }, [serverPersistence, layout.cards, gridManager, errorHandling, syncStatus, toggleCardLock, containerRef, localUpdateCardSize, localUpdateCardPosition, localRemoveCard]);
}
