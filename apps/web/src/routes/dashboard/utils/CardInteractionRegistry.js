"use strict";
/**
 * Card Interaction Registry
 *
 * Centralized registry for managing card interactions, drop zones, and drag configurations.
 * This enables cards to discover what interactions are available and what data they can accept.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardInteractionRegistry = void 0;
exports.getCardInteractionRegistry = getCardInteractionRegistry;
exports.resetCardInteractionRegistry = resetCardInteractionRegistry;
var logger_1 = require("@/utils/logger");
var CardInteractionRegistry = /** @class */ (function () {
    function CardInteractionRegistry() {
        Object.defineProperty(this, "cards", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "interactions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "enabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "dragState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                isDragging: false,
                payload: null,
                dropTarget: null,
                dropZoneHighlight: null,
                availableActions: []
            }
        });
        Object.defineProperty(this, "dragStateListeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
    }
    /**
     * Register a card configuration
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "registerCard", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (config) {
            if (!config.id || !config.type) {
                throw new Error('Card config must have id and type');
            }
            this.cards.set(config.id, config);
        }
    });
    /**
     * Register an interaction between cards
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "registerInteraction", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (config) {
            if (!config.id) {
                throw new Error('Interaction config must have id');
            }
            this.interactions.set(config.id, config);
        }
    });
    /**
     * Get card configuration
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "getCardConfig", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (cardId) {
            return this.cards.get(cardId);
        }
    });
    /**
     * Get all drop zones for a card
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "getDropZonesForCard", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (cardId) {
            var config = this.cards.get(cardId);
            return (config === null || config === void 0 ? void 0 : config.dropZones) || [];
        }
    });
    /**
     * Get drag configuration for a card
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "getDragConfigForCard", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (cardId) {
            var config = this.cards.get(cardId);
            return (config === null || config === void 0 ? void 0 : config.canDrag) ? config.dragConfig : undefined;
        }
    });
    /**
     * Find all cards that accept a specific data type
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "findCardsThatAccept", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (dataType) {
            var acceptingCards = [];
            this.cards.forEach(function (config, cardId) {
                var _a;
                var accepts = (_a = config.dropZones) === null || _a === void 0 ? void 0 : _a.some(function (zone) {
                    return zone.accepts.dataTypes.includes(dataType);
                });
                if (accepts) {
                    acceptingCards.push(cardId);
                }
            });
            return acceptingCards;
        }
    });
    /**
     * Check if a card can accept a specific payload
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "canCardAccept", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (cardId, payload) {
            var dropZones = this.getDropZonesForCard(cardId);
            return dropZones.some(function (zone) {
                var _a, _b;
                // Check data type
                if (!zone.accepts.dataTypes.includes(payload.sourceDataType)) {
                    return false;
                }
                // Check max items
                if (zone.accepts.maxItems !== undefined) {
                    var itemCount = ((_b = (_a = payload.data.metadata) === null || _a === void 0 ? void 0 : _a.selectedItems) === null || _b === void 0 ? void 0 : _b.length) || 1;
                    if (itemCount > zone.accepts.maxItems) {
                        return false;
                    }
                }
                // Check required fields
                if (zone.accepts.requiredFields) {
                    var hasAllFields = zone.accepts.requiredFields.every(function (field) { var _a; return ((_a = payload.data.entity) === null || _a === void 0 ? void 0 : _a[field]) !== undefined; });
                    if (!hasAllFields) {
                        return false;
                    }
                }
                // Custom validator
                if (zone.accepts.customValidator) {
                    if (!zone.accepts.customValidator(payload)) {
                        return false;
                    }
                }
                // Run zone validator if present
                if (zone.validator) {
                    var result = zone.validator(payload);
                    if (!result.valid) {
                        return false;
                    }
                }
                return true;
            });
        }
    });
    /**
     * Get available actions for a payload on a target card
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "getAvailableActions", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (cardId, payload) {
            var _this = this;
            var dropZones = this.getDropZonesForCard(cardId);
            var availableActions = [];
            dropZones.forEach(function (zone) {
                if (_this.canCardAccept(cardId, payload)) {
                    Object.entries(zone.actions).forEach(function (_a) {
                        var actionId = _a[0], actionConfig = _a[1];
                        // Check if action is disabled
                        if (actionConfig.disabled) {
                            return;
                        }
                        availableActions.push({
                            id: "".concat(cardId, "-").concat(actionId),
                            sourceCardType: payload.sourceCardType,
                            targetCardType: zone.cardType,
                            sourceDataType: payload.sourceDataType,
                            actionId: actionId,
                            handler: actionConfig.handler,
                            metadata: __assign(__assign({}, actionConfig), { dropZoneId: zone.cardId })
                        });
                    });
                }
            });
            return availableActions;
        }
    });
    /**
     * Get all registered cards
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "getAllCards", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return Array.from(this.cards.values());
        }
    });
    /**
     * Get all registered interactions
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "getAllInteractions", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return Array.from(this.interactions.values());
        }
    });
    /**
     * Unregister a card
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "unregisterCard", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (cardId) {
            this.cards.delete(cardId);
        }
    });
    /**
     * Unregister an interaction
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "unregisterInteraction", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (interactionId) {
            this.interactions.delete(interactionId);
        }
    });
    /**
     * Clear all registrations
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "clear", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.cards.clear();
            this.interactions.clear();
        }
    });
    /**
     * Enable/disable the registry
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "setEnabled", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (enabled) {
            this.enabled = enabled;
        }
    });
    /**
     * Check if registry is enabled
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "isEnabled", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return this.enabled;
        }
    });
    /**
     * Get registry state (for debugging/monitoring)
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "getState", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {
                cards: this.cards,
                interactions: this.interactions,
                enabled: this.enabled
            };
        }
    });
    /**
     * Drag state management - shared across all components
     */
    Object.defineProperty(CardInteractionRegistry.prototype, "setDragState", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (state) {
            var _this = this;
            var _a;
            var oldState = __assign({}, this.dragState);
            this.dragState = __assign(__assign({}, this.dragState), state);
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Registry setDragState', {
                    oldState: { isDragging: oldState.isDragging, hasPayload: !!oldState.payload },
                    newState: { isDragging: this.dragState.isDragging, hasPayload: !!this.dragState.payload },
                    listenerCount: this.dragStateListeners.size,
                    payloadType: (_a = this.dragState.payload) === null || _a === void 0 ? void 0 : _a.sourceDataType
                }, 'CardInteractionRegistry');
            }
            // Notify all listeners
            this.dragStateListeners.forEach(function (listener) {
                try {
                    listener(_this.dragState);
                }
                catch (error) {
                    logger_1.logger.error('Error in drag state listener', error, 'CardInteractionRegistry');
                }
            });
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Registry notified all listeners', {}, 'CardInteractionRegistry');
            }
        }
    });
    Object.defineProperty(CardInteractionRegistry.prototype, "getDragState", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __assign({}, this.dragState);
        }
    });
    Object.defineProperty(CardInteractionRegistry.prototype, "subscribeToDragState", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (listener) {
            var _this = this;
            this.dragStateListeners.add(listener);
            // Immediately call with current state
            listener(this.dragState);
            // Return unsubscribe function
            return function () {
                _this.dragStateListeners.delete(listener);
            };
        }
    });
    return CardInteractionRegistry;
}());
exports.CardInteractionRegistry = CardInteractionRegistry;
// Singleton instance
var registryInstance = null;
/**
 * Get the global card interaction registry instance
 */
function getCardInteractionRegistry() {
    if (!registryInstance) {
        registryInstance = new CardInteractionRegistry();
    }
    return registryInstance;
}
/**
 * Reset the registry (useful for testing)
 */
function resetCardInteractionRegistry() {
    registryInstance = null;
}
