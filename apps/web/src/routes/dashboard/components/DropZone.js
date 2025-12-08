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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropZone = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * DropZone Component
 *
 * Wraps a card to make it accept drops from other cards.
 * Handles drop detection, visual feedback, and action execution.
 */
var react_1 = __importStar(require("react"));
var useCardDataDragDrop_1 = require("../hooks/useCardDataDragDrop");
var CardInteractionRegistry_1 = require("../utils/CardInteractionRegistry");
var Dialog_1 = require("@/components/ui/Dialog");
var ConfirmationDialog_1 = __importDefault(require("@/components/ui/ConfirmationDialog"));
var logger_1 = require("@/utils/logger");
var DropZone = function (_a) {
    var _b;
    var cardId = _a.cardId, dropZoneConfig = _a.dropZoneConfig, children = _a.children, _c = _a.className, className = _c === void 0 ? '' : _c, onDrop = _a.onDrop, _d = _a.showActionMenu, showActionMenu = _d === void 0 ? true : _d;
    var _e = (0, react_1.useState)(false), isDragOver = _e[0], setIsDragOver = _e[1];
    var _f = (0, react_1.useState)(false), showConfirmModal = _f[0], setShowConfirmModal = _f[1];
    var _g = (0, react_1.useState)(null), pendingAction = _g[0], setPendingAction = _g[1];
    var _h = (0, react_1.useState)(false), showActionMenuModal = _h[0], setShowActionMenuModal = _h[1];
    var _j = (0, react_1.useState)(null), actionMenuPayload = _j[0], setActionMenuPayload = _j[1];
    var _k = (0, useCardDataDragDrop_1.useCardDataDragDrop)({
        onActionExecuted: function (_actionId, result) {
            if (pendingAction && onDrop) {
                onDrop(pendingAction.payload, result);
            }
            setPendingAction(null);
            setShowConfirmModal(false);
        }
    }), isDragging = _k.isDragging, draggingPayload = _k.draggingPayload, dropZoneHighlight = _k.dropZoneHighlight, handleContentDrop = _k.handleContentDrop, canCardAccept = _k.canCardAccept;
    // Use ref to access the DOM element
    var dropZoneRef = react_1.default.useRef(null);
    // Register this drop zone with the registry
    (0, react_1.useEffect)(function () {
        var _a;
        var registry = (0, CardInteractionRegistry_1.getCardInteractionRegistry)();
        // Get or create card config
        var cardConfig = registry.getCardConfig(cardId);
        if (!cardConfig) {
            cardConfig = {
                id: cardId,
                type: dropZoneConfig.cardType || cardId,
                dropZones: []
            };
            registry.registerCard(cardConfig);
        }
        // Add this drop zone to the card's drop zones if not already present
        var existingZone = (_a = cardConfig.dropZones) === null || _a === void 0 ? void 0 : _a.find(function (zone) { return zone.cardId === cardId; });
        if (!existingZone) {
            if (!cardConfig.dropZones) {
                cardConfig.dropZones = [];
            }
            cardConfig.dropZones.push(dropZoneConfig);
            registry.registerCard(cardConfig);
            logger_1.logger.debug('Registered drop zone', { cardId: cardId, dataTypes: dropZoneConfig.accepts.dataTypes });
        }
        return function () {
            var _a;
            // Cleanup: remove drop zone on unmount
            var currentConfig = registry.getCardConfig(cardId);
            if (currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.dropZones) {
                currentConfig.dropZones = currentConfig.dropZones.filter(function (zone) { return zone.cardId !== cardId || zone !== dropZoneConfig; });
                if (currentConfig.dropZones.length === 0) {
                    // Remove card if no drop zones left
                    (_a = registry.unregisterCard) === null || _a === void 0 ? void 0 : _a.call(registry, cardId);
                }
                else {
                    registry.registerCard(currentConfig);
                }
            }
        };
    }, [cardId, dropZoneConfig]);
    // Check if this drop zone is highlighted
    var isHighlighted = dropZoneHighlight === cardId && isDragging && draggingPayload;
    // Check if current drag can be accepted
    var canAccept = isDragging && draggingPayload && canCardAccept(cardId, draggingPayload);
    /**
     * Handle drag over (React synthetic event)
     */
    var handleDragOver = (0, react_1.useCallback)(function (e) {
        var _a, _b;
        // CRITICAL: Always prevent default FIRST to allow drop
        e.preventDefault();
        // Don't stop propagation - let it bubble if needed, but we handle it here
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('DropZone dragover event received', {
                cardId: cardId,
                target: e.target,
                currentTarget: e.currentTarget,
                targetTag: (_a = e.target) === null || _a === void 0 ? void 0 : _a.tagName,
                targetClass: (_b = e.target) === null || _b === void 0 ? void 0 : _b.className,
                isDragging: isDragging,
                hasPayload: !!draggingPayload,
                payloadType: draggingPayload === null || draggingPayload === void 0 ? void 0 : draggingPayload.sourceDataType
            }, 'DropZone');
        }
        // Always check canAccept fresh on each event
        var freshCanAccept = isDragging && draggingPayload && canCardAccept(cardId, draggingPayload);
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('DropZone canAccept check', {
                cardId: cardId,
                isDragging: isDragging,
                hasPayload: !!draggingPayload,
                payloadType: draggingPayload === null || draggingPayload === void 0 ? void 0 : draggingPayload.sourceDataType,
                freshCanAccept: freshCanAccept
            }, 'DropZone');
        }
        if (!freshCanAccept) {
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'none';
            }
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('DropZone rejecting drag - cannot accept', {}, 'DropZone');
            }
            return;
        }
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
        setIsDragOver(true);
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('Drop zone active', {
                cardId: cardId,
                dataType: draggingPayload === null || draggingPayload === void 0 ? void 0 : draggingPayload.sourceDataType,
                isDragging: isDragging,
                hasPayload: !!draggingPayload,
                canAccept: freshCanAccept
            }, 'DropZone');
        }
    }, [cardId, isDragging, draggingPayload, canCardAccept]);
    /**
     * Handle drag over (native event - fallback)
     * Use refs to avoid re-creating the handler when state changes
     */
    var isDraggingRef = (0, react_1.useRef)(isDragging);
    var draggingPayloadRef = (0, react_1.useRef)(draggingPayload);
    (0, react_1.useEffect)(function () {
        isDraggingRef.current = isDragging;
        draggingPayloadRef.current = draggingPayload;
    }, [isDragging, draggingPayload]);
    var handleNativeDragOver = (0, react_1.useCallback)(function (e) {
        // Only handle if React event didn't fire (fallback)
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('DropZone NATIVE dragover event', {
                cardId: cardId,
                target: e.target,
                isDragging: isDraggingRef.current,
                hasPayload: !!draggingPayloadRef.current
            }, 'DropZone');
        }
        // CRITICAL: Always prevent default to allow drop
        e.preventDefault();
        e.stopPropagation(); // Stop propagation so React handler doesn't also fire
        // Always check canAccept fresh on each event
        var freshCanAccept = isDraggingRef.current && draggingPayloadRef.current && canCardAccept(cardId, draggingPayloadRef.current);
        if (!freshCanAccept) {
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'none';
            }
            return;
        }
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
        setIsDragOver(true);
    }, [cardId, canCardAccept]);
    // Add native event listeners as fallback (in case React events don't fire)
    (0, react_1.useEffect)(function () {
        var element = dropZoneRef.current;
        if (!element) {
            logger_1.logger.warn('DropZone element not found', { cardId: cardId }, 'DropZone');
            return;
        }
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('Adding native drag listeners to DropZone', {
                cardId: cardId,
                element: element.tagName,
                inDOM: document.body.contains(element),
                hasListeners: element.ondragover !== null
            }, 'DropZone');
        }
        // Add native dragover listener with capture phase to catch events early
        var nativeDragOverHandler = function (e) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('DropZone NATIVE dragover event', {
                    cardId: cardId,
                    target: e.target,
                    currentTarget: e.currentTarget,
                    phase: 'capture'
                }, 'DropZone');
            }
            handleNativeDragOver(e);
        };
        // Add native drop listener as fallback (in case React event doesn't fire)
        // This ensures the drop is allowed even if React's event system has issues
        var nativeDropHandler = function (e) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('DropZone NATIVE drop event (capture phase)', {
                    cardId: cardId,
                    target: e.target,
                    currentTarget: e.currentTarget,
                    isDragging: isDraggingRef.current,
                    hasPayload: !!draggingPayloadRef.current,
                    defaultPrevented: e.defaultPrevented
                }, 'DropZone');
            }
            // Always prevent default to allow drop (if not already prevented)
            // This ensures the drop is allowed even if React hasn't handled it yet
            // React's handler will process the actual drop logic
            if (!e.defaultPrevented && isDraggingRef.current && draggingPayloadRef.current) {
                var freshCanAccept = canCardAccept(cardId, draggingPayloadRef.current);
                if (freshCanAccept) {
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Native drop handler - preventing default to allow drop', {}, 'DropZone');
                    }
                    e.preventDefault();
                    // DO NOT stop propagation - let React handle the processing
                }
            }
        };
        element.addEventListener('dragover', nativeDragOverHandler, true); // Use capture phase
        element.addEventListener('drop', nativeDropHandler, true); // Use capture phase as fallback
        return function () {
            element.removeEventListener('dragover', nativeDragOverHandler, true);
            element.removeEventListener('drop', nativeDropHandler, true);
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Removed native drag listeners from DropZone', { cardId: cardId }, 'DropZone');
            }
        };
    }, [cardId, handleNativeDragOver, canCardAccept]);
    /**
     * Handle drag leave
     */
    var handleDragLeave = (0, react_1.useCallback)(function (e) {
        // Only set drag over to false if we're leaving the drop zone
        var relatedTarget = e.relatedTarget;
        if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
            setIsDragOver(false);
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Left drop zone', { cardId: cardId }, 'DropZone');
            }
        }
    }, [cardId]);
    /**
     * Handle drop
     */
    var handleDrop = (0, react_1.useCallback)(function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var payload, data, availableActions, firstAction, actionId, action, result, firstAction, actionId, action, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    // CRITICAL: Prevent default FIRST to allow drop
                    e.preventDefault();
                    e.stopPropagation();
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('DropZone drop event', {
                            cardId: cardId,
                            canAccept: canAccept,
                            hasPayload: !!draggingPayload,
                            isDragging: isDragging,
                            dataTransferTypes: Array.from(e.dataTransfer.types),
                            target: e.target,
                            currentTarget: e.currentTarget,
                            defaultPrevented: e.defaultPrevented
                        }, 'DropZone');
                    }
                    if (!canAccept || !draggingPayload) {
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('DropZone drop rejected', {
                                canAccept: canAccept,
                                hasPayload: !!draggingPayload,
                                isDragging: isDragging,
                                payloadType: draggingPayload === null || draggingPayload === void 0 ? void 0 : draggingPayload.sourceDataType
                            }, 'DropZone');
                        }
                        return [2 /*return*/];
                    }
                    setIsDragOver(false);
                    try {
                        data = e.dataTransfer.getData('application/json');
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('DataTransfer data', {
                                hasJson: !!data,
                                jsonLength: data === null || data === void 0 ? void 0 : data.length,
                                textPlain: e.dataTransfer.getData('text/plain')
                            }, 'DropZone');
                        }
                        payload = data ? JSON.parse(data) : draggingPayload;
                    }
                    catch (error) {
                        logger_1.logger.error('Failed to parse payload', error, 'DropZone');
                        payload = draggingPayload;
                    }
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Final payload', {
                            sourceCardId: payload.sourceCardId,
                            dataType: payload.sourceDataType,
                            customerName: ((_a = payload.dragPreview) === null || _a === void 0 ? void 0 : _a.title) || ((_b = payload.data.entity) === null || _b === void 0 ? void 0 : _b.name),
                            customerId: payload.data.id
                        }, 'DropZone');
                    }
                    availableActions = Object.entries(dropZoneConfig.actions);
                    if (availableActions.length === 0) {
                        logger_1.logger.warn('No actions available for drop zone', { cardId: cardId });
                        return [2 /*return*/];
                    }
                    if (!(availableActions.length === 1)) return [3 /*break*/, 4];
                    firstAction = availableActions[0];
                    if (!firstAction)
                        return [2 /*return*/];
                    actionId = firstAction[0], action = firstAction[1];
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Executing single action', { actionId: actionId, actionLabel: action.label }, 'DropZone');
                    }
                    if (!action.requiresConfirmation) return [3 /*break*/, 1];
                    setPendingAction({ payload: payload, actionId: actionId, action: action });
                    setShowConfirmModal(true);
                    return [3 /*break*/, 3];
                case 1:
                    // Execute directly
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Calling handleContentDrop', { cardId: cardId, actionId: actionId, payloadType: payload.sourceDataType }, 'DropZone');
                    }
                    return [4 /*yield*/, handleContentDrop(cardId, payload, actionId)];
                case 2:
                    result = _c.sent();
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Drop result', { result: result }, 'DropZone');
                    }
                    if (result && onDrop) {
                        onDrop(payload, result);
                    }
                    _c.label = 3;
                case 3: return [3 /*break*/, 8];
                case 4:
                    if (!showActionMenu) return [3 /*break*/, 5];
                    // Multiple actions - show menu
                    setActionMenuPayload(payload);
                    setShowActionMenuModal(true);
                    return [3 /*break*/, 8];
                case 5:
                    firstAction = availableActions[0];
                    if (!firstAction)
                        return [2 /*return*/];
                    actionId = firstAction[0], action = firstAction[1];
                    if (!action.requiresConfirmation) return [3 /*break*/, 6];
                    setPendingAction({ payload: payload, actionId: actionId, action: action });
                    setShowConfirmModal(true);
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, handleContentDrop(cardId, payload, actionId)];
                case 7:
                    result = _c.sent();
                    if (result && onDrop) {
                        onDrop(payload, result);
                    }
                    _c.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); }, [canAccept, draggingPayload, dropZoneConfig, cardId, handleContentDrop, onDrop, showActionMenu]);
    /**
     * Execute action after confirmation
     */
    var executePendingAction = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!pendingAction)
                        return [2 /*return*/];
                    return [4 /*yield*/, handleContentDrop(cardId, pendingAction.payload, pendingAction.actionId)];
                case 1:
                    result = _a.sent();
                    if (result && onDrop) {
                        onDrop(pendingAction.payload, result);
                    }
                    setPendingAction(null);
                    setShowConfirmModal(false);
                    return [2 /*return*/];
            }
        });
    }); }, [pendingAction, cardId, handleContentDrop, onDrop]);
    /**
     * Execute action from menu
     */
    var executeActionFromMenu = (0, react_1.useCallback)(function (actionId) { return __awaiter(void 0, void 0, void 0, function () {
        var action, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!actionMenuPayload)
                        return [2 /*return*/];
                    action = dropZoneConfig.actions[actionId];
                    if (!action)
                        return [2 /*return*/];
                    setShowActionMenuModal(false);
                    if (!action.requiresConfirmation) return [3 /*break*/, 1];
                    setPendingAction({ payload: actionMenuPayload, actionId: actionId, action: action });
                    setShowConfirmModal(true);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, handleContentDrop(cardId, actionMenuPayload, actionId)];
                case 2:
                    result = _a.sent();
                    if (result && onDrop) {
                        onDrop(actionMenuPayload, result);
                    }
                    _a.label = 3;
                case 3:
                    setActionMenuPayload(null);
                    return [2 /*return*/];
            }
        });
    }); }, [actionMenuPayload, dropZoneConfig, cardId, handleContentDrop, onDrop]);
    // Update drag over state based on highlight
    (0, react_1.useEffect)(function () {
        if (isHighlighted && !isDragOver) {
            setIsDragOver(true);
            return undefined;
        }
        else if (!isHighlighted && isDragOver) {
            // Small delay to prevent flickering
            var timer_1 = setTimeout(function () { return setIsDragOver(false); }, 100);
            return function () { return clearTimeout(timer_1); };
        }
        return undefined;
    }, [isHighlighted, isDragOver]);
    var dropZoneStyle = dropZoneConfig.dropZoneStyle || {};
    var highlightColor = dropZoneStyle.highlightColor || '#6366f1';
    var borderStyle = dropZoneStyle.borderStyle || 'dashed';
    var borderWidth = dropZoneStyle.borderWidth || 2;
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('DropZone render', {
            cardId: cardId,
            isDragging: isDragging,
            hasPayload: !!draggingPayload,
            canAccept: isDragging && draggingPayload && canCardAccept(cardId, draggingPayload)
        }, 'DropZone');
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { ref: dropZoneRef, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, className: "drop-zone ".concat(isDragOver && canAccept ? 'drop-zone-active' : '', " ").concat(className), "data-card-id": cardId, "data-accepts": dropZoneConfig.accepts.dataTypes.join(','), style: __assign({ position: 'relative', width: '100%', height: '100%', minHeight: '200px', transition: 'all 0.2s ease', 
                    // Ensure this element can receive drag events
                    pointerEvents: 'auto', zIndex: 1 }, (isDragOver && canAccept ? {
                    border: "".concat(borderWidth, "px ").concat(borderStyle, " ").concat(highlightColor),
                    backgroundColor: dropZoneStyle.backgroundColor || 'rgba(99, 102, 241, 0.05)',
                    borderRadius: '8px'
                } : {})), children: [children, isDragOver && canAccept && ((0, jsx_runtime_1.jsx)("div", { className: "drop-zone-overlay", style: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                            zIndex: 10
                        }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                                padding: '12px 24px',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#1f2937'
                            }, children: ["Drop here to ", ((_b = Object.values(dropZoneConfig.actions)[0]) === null || _b === void 0 ? void 0 : _b.label) || 'perform action'] }) }))] }), showConfirmModal && pendingAction && ((0, jsx_runtime_1.jsx)(ConfirmationDialog_1.default, { isOpen: showConfirmModal, onClose: function () {
                    setShowConfirmModal(false);
                    setPendingAction(null);
                }, onConfirm: executePendingAction, title: "Confirm Action", message: pendingAction.action.confirmationMessage || "Are you sure you want to ".concat(pendingAction.action.label.toLowerCase(), "?"), type: pendingAction.action.requiresConfirmation ? 'warning' : 'info' })), showActionMenuModal && actionMenuPayload && ((0, jsx_runtime_1.jsx)(ActionMenuModal, { isOpen: showActionMenuModal, onClose: function () {
                    setShowActionMenuModal(false);
                    setActionMenuPayload(null);
                }, actions: dropZoneConfig.actions, onSelectAction: executeActionFromMenu, payload: actionMenuPayload }))] }));
};
exports.DropZone = DropZone;
var ActionMenuModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, actions = _a.actions, onSelectAction = _a.onSelectAction, payload = _a.payload;
    return ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: isOpen, onOpenChange: function (open) { return !open && onClose(); }, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-md", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Choose Action" }) }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600 mb-4", children: ["What would you like to do with this ", payload.sourceDataType, "?"] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col gap-2", children: Object.entries(actions).map(function (_a) {
                        var actionId = _a[0], action = _a[1];
                        return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return onSelectAction(actionId); }, disabled: action.disabled, className: "w-full px-4 py-3 text-left border rounded-lg transition-colors ".concat(action.disabled
                                ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-indigo-500'), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [action.icon && (0, jsx_runtime_1.jsx)("span", { children: action.icon }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: action.label })] }), action.description && ((0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 mt-1", children: action.description }))] }, actionId));
                    }) }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogFooter, { children: (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors", children: "Cancel" }) })] }) }));
};
