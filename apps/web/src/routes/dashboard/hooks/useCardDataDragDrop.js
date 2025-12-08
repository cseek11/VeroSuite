"use strict";
/**
 * useCardDataDragDrop Hook
 *
 * Extends the existing card drag-and-drop system to support data transfer
 * between cards (not just card position movement).
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
exports.useCardDataDragDrop = useCardDataDragDrop;
var react_1 = require("react");
var CardInteractionRegistry_1 = require("../utils/CardInteractionRegistry");
var logger_1 = require("@/utils/logger");
function useCardDataDragDrop(props) {
    var _this = this;
    if (props === void 0) { props = {}; }
    var _a = props.enabled, enabled = _a === void 0 ? true : _a, onDragStart = props.onDragStart, onDragEnd = props.onDragEnd, onActionExecuted = props.onActionExecuted;
    var registry = (0, CardInteractionRegistry_1.getCardInteractionRegistry)();
    var dragPreviewRef = (0, react_1.useRef)(null);
    var isCreatingPreviewRef = (0, react_1.useRef)(false);
    // Subscribe to shared drag state from registry
    var _b = (0, react_1.useState)(function () { return registry.getDragState(); }), dragState = _b[0], setDragState = _b[1];
    // Create dragStateRef early so it can be used in callbacks
    // Use refs to avoid stale closures in event listeners
    var dragStateRef = (0, react_1.useRef)(dragState);
    (0, react_1.useEffect)(function () {
        dragStateRef.current = dragState;
    }, [dragState]);
    (0, react_1.useEffect)(function () {
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('useCardDataDragDrop subscribing to drag state', {}, 'useCardDataDragDrop');
        }
        var unsubscribe = registry.subscribeToDragState(function (state) {
            var _a;
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('useCardDataDragDrop received state update', {
                    isDragging: state.isDragging,
                    hasPayload: !!state.payload,
                    payloadType: (_a = state.payload) === null || _a === void 0 ? void 0 : _a.sourceDataType
                }, 'useCardDataDragDrop');
            }
            setDragState(state);
        });
        return function () {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('useCardDataDragDrop unsubscribing from drag state', {}, 'useCardDataDragDrop');
            }
            unsubscribe();
        };
    }, [registry]);
    /**
     * Cleanup drag preview - enhanced to handle all scenarios
     * Defined early so it can be used in other functions
     */
    var cleanupDragPreview = (0, react_1.useCallback)(function () {
        // Don't cleanup if we're currently creating a preview
        if (isCreatingPreviewRef.current) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Cleanup skipped - preview is being created', {}, 'useCardDataDragDrop');
            }
            return;
        }
        // Store current ref to avoid removing it if it's being created
        var currentRef = dragPreviewRef.current;
        // Remove our custom preview
        if (currentRef) {
            try {
                // Disconnect mutation observer if it exists
                if (currentRef._mutationObserver) {
                    currentRef._mutationObserver.disconnect();
                    delete currentRef._mutationObserver;
                }
                // Only remove if it's actually in the DOM
                if (document.body.contains(currentRef)) {
                    currentRef.remove();
                }
            }
            catch (_e) {
                // Element might already be removed
            }
            dragPreviewRef.current = null;
        }
        // Also remove any orphaned previews (safety net)
        // But only if they're not the current ref (which we just cleared)
        var orphanedPreviews = document.querySelectorAll('[data-drag-preview="true"]');
        orphanedPreviews.forEach(function (preview) {
            // Only remove if it's not the current ref
            if (preview !== currentRef && preview !== dragPreviewRef.current) {
                try {
                    preview.remove();
                }
                catch (_e) {
                    // Ignore errors
                }
            }
        });
    }, []);
    /**
     * Create visual drag preview
     */
    var createDragPreview = (0, react_1.useCallback)(function (payload, initialX, initialY) {
        if (!payload.dragPreview)
            return;
        // Set flag to prevent cleanup during creation
        isCreatingPreviewRef.current = true;
        // Cleanup any existing preview first (but don't remove the one we're about to create)
        // Only remove if it's not the current one
        if (dragPreviewRef.current && dragPreviewRef.current.parentNode) {
            try {
                dragPreviewRef.current.remove();
            }
            catch (_e) {
                // Element might already be removed
            }
            dragPreviewRef.current = null;
        }
        // Remove orphaned previews, but be careful not to remove the one we're creating
        var orphanedPreviews = document.querySelectorAll('[data-drag-preview="true"]');
        orphanedPreviews.forEach(function (preview) {
            // Only remove if it's not the current ref (which we just cleared)
            if (preview !== dragPreviewRef.current) {
                try {
                    preview.remove();
                }
                catch (_e) {
                    // Ignore errors
                }
            }
        });
        var preview = document.createElement('div');
        preview.className = 'card-drag-preview';
        preview.setAttribute('data-drag-preview', 'true');
        preview.id = "drag-preview-".concat(Date.now());
        // Use provided initial position or fallback to center
        var startX = initialX !== null && initialX !== void 0 ? initialX : window.innerWidth / 2;
        var startY = initialY !== null && initialY !== void 0 ? initialY : window.innerHeight / 2;
        // IMPORTANT: Append to DOM FIRST, then set styles
        // Some browsers require the element to be in the DOM for setProperty to work
        try {
            document.body.appendChild(preview);
            // Verify it's actually in the DOM immediately
            if (!document.body.contains(preview)) {
                logger_1.logger.error('Failed to append preview to DOM', {}, 'useCardDataDragDrop');
                isCreatingPreviewRef.current = false;
                return;
            }
            // Double-check after a microtask
            Promise.resolve().then(function () {
                if (!document.body.contains(preview) && preview === dragPreviewRef.current) {
                    logger_1.logger.warn('Preview removed from DOM after append, re-adding', {}, 'useCardDataDragDrop');
                    try {
                        document.body.appendChild(preview);
                    }
                    catch (e) {
                        logger_1.logger.error('Failed to re-append preview', e, 'useCardDataDragDrop');
                    }
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Error appending preview to DOM', error, 'useCardDataDragDrop');
            isCreatingPreviewRef.current = false;
            return;
        }
        // Now set all styles - element must be in DOM for setProperty to work properly
        preview.style.setProperty('position', 'fixed', 'important');
        preview.style.setProperty('top', "".concat(startY, "px"), 'important');
        preview.style.setProperty('left', "".concat(startX, "px"), 'important');
        preview.style.setProperty('padding', '10px 16px', 'important');
        preview.style.setProperty('background', 'white', 'important');
        preview.style.setProperty('border', "2px solid ".concat(payload.dragPreview.color || '#6366f1'), 'important');
        preview.style.setProperty('border-radius', '8px', 'important');
        preview.style.setProperty('box-shadow', '0 8px 24px rgba(0,0,0,0.25)', 'important');
        preview.style.setProperty('z-index', '999999', 'important');
        preview.style.setProperty('pointer-events', 'none', 'important');
        preview.style.setProperty('font-size', '14px', 'important');
        preview.style.setProperty('font-weight', '600', 'important');
        preview.style.setProperty('color', '#1f2937', 'important');
        preview.style.setProperty('display', 'flex', 'important');
        preview.style.setProperty('align-items', 'center', 'important');
        preview.style.setProperty('gap', '8px', 'important');
        preview.style.setProperty('opacity', '1', 'important');
        preview.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
        preview.style.setProperty('white-space', 'nowrap', 'important');
        preview.style.setProperty('min-width', '120px', 'important');
        preview.style.setProperty('visibility', 'visible', 'important');
        preview.style.setProperty('margin', '0', 'important');
        if (payload.dragPreview.icon) {
            var icon = document.createElement('span');
            icon.textContent = payload.dragPreview.icon;
            icon.style.fontSize = '16px';
            preview.appendChild(icon);
        }
        var text = document.createElement('span');
        text.textContent = payload.dragPreview.count
            ? "".concat(payload.dragPreview.count, " ").concat(payload.dragPreview.title)
            : payload.dragPreview.title;
        preview.appendChild(text);
        // Element is already in DOM (appended above), now set the ref
        dragPreviewRef.current = preview;
        // Set up a MutationObserver to detect if the element is removed (for debugging only)
        // Don't try to re-add - just log what's happening
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.removedNodes.forEach(function (node) {
                    if (node === preview) {
                        logger_1.logger.warn('Preview element removed from DOM', {
                            mutationType: mutation.type,
                            target: mutation.target,
                            attributeName: mutation.attributeName
                        }, 'useCardDataDragDrop');
                        // Don't try to re-add - browser may have removed it for a reason
                    }
                });
            });
        });
        // Observe the body for removals
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        // Clean up observer when preview is removed (in cleanup function)
        // Store observer on the preview element for cleanup
        preview._mutationObserver = observer;
        // Force a reflow to ensure styles are applied and element is measured
        void preview.offsetWidth;
        void preview.offsetHeight;
        // Verify it's in the DOM
        if (!document.body.contains(preview)) {
            logger_1.logger.error('Preview not in DOM after append', {}, 'useCardDataDragDrop');
            observer.disconnect();
            isCreatingPreviewRef.current = false;
            return;
        }
        // Simple verification - no loops!
        // Use single requestAnimationFrame to verify element is rendered
        // Don't fight the browser - if it removes it, that's okay
        requestAnimationFrame(function () {
            var _a, _b, _c;
            // Clear the creation flag - preview setup is complete
            isCreatingPreviewRef.current = false;
            // Verify element is still in DOM and is still our ref
            if (!document.body.contains(preview)) {
                logger_1.logger.warn('Preview not in DOM after setup - may have been removed by browser', {
                    previewId: preview.id,
                    refId: (_a = dragPreviewRef.current) === null || _a === void 0 ? void 0 : _a.id,
                    isCurrentRef: preview === dragPreviewRef.current
                }, 'useCardDataDragDrop');
                // Don't try to re-add - browser may have removed it for a reason
                return;
            }
            if (preview !== dragPreviewRef.current) {
                logger_1.logger.warn('Preview ref mismatch', {
                    previewId: preview.id,
                    refId: (_b = dragPreviewRef.current) === null || _b === void 0 ? void 0 : _b.id
                }, 'useCardDataDragDrop');
                return;
            }
            var computed = window.getComputedStyle(preview);
            var rect = preview.getBoundingClientRect();
            var isInViewport = rect.x >= 0 && rect.y >= 0 &&
                rect.x + rect.width <= window.innerWidth &&
                rect.y + rect.height <= window.innerHeight;
            if (process.env.NODE_ENV === 'development' && payload.dragPreview) {
                logger_1.logger.debug('Drag preview created', {
                    title: payload.dragPreview.title,
                    inDOM: document.body.contains(preview),
                    zIndex: computed.zIndex,
                    display: computed.display,
                    visibility: computed.visibility,
                    opacity: computed.opacity,
                    position: computed.position,
                    left: preview.style.left,
                    top: preview.style.top,
                    computedLeft: computed.left,
                    computedTop: computed.top,
                    rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
                    startX: startX,
                    startY: startY,
                    isVisible: rect.width > 0 && rect.height > 0,
                    isInViewport: isInViewport,
                    windowWidth: window.innerWidth,
                    windowHeight: window.innerHeight,
                    parentElement: (_c = preview.parentElement) === null || _c === void 0 ? void 0 : _c.tagName,
                    parentOverflow: preview.parentElement ? window.getComputedStyle(preview.parentElement).overflow : 'N/A'
                }, 'useCardDataDragDrop');
            }
            // If not visible, try to fix it
            if (!isInViewport || rect.width === 0 || rect.height === 0) {
                logger_1.logger.warn('Preview not visible, attempting to fix', {}, 'useCardDataDragDrop');
                preview.style.setProperty('left', "".concat(startX, "px"), 'important');
                preview.style.setProperty('top', "".concat(startY, "px"), 'important');
                preview.style.setProperty('display', 'flex', 'important');
                preview.style.setProperty('opacity', '1', 'important');
                preview.style.setProperty('visibility', 'visible', 'important');
                preview.style.setProperty('z-index', '999999', 'important');
                // Force another reflow after fix
                void preview.offsetWidth;
            }
        });
        // Update preview position on mouse move
        // This is the primary visual feedback since native drag image may not work
        var updatePreview = function (e) {
            if (preview && preview.parentNode) {
                var evt = e;
                var clientX = evt.clientX;
                var clientY = evt.clientY;
                // Update position using setProperty for consistency and !important
                preview.style.setProperty('left', "".concat(clientX, "px"), 'important');
                preview.style.setProperty('top', "".concat(clientY, "px"), 'important');
                preview.style.setProperty('display', 'flex', 'important');
                preview.style.setProperty('opacity', '1', 'important');
                preview.style.setProperty('visibility', 'visible', 'important');
                preview.style.setProperty('z-index', '999999', 'important');
                // Force a repaint to ensure the browser renders the update
                void preview.offsetWidth;
            }
        };
        // Cleanup preview listeners (but NOT drag state)
        var cleanupPreviewListeners = function (e) {
            var _a;
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('cleanupPreviewListeners called', {
                    eventType: e === null || e === void 0 ? void 0 : e.type,
                    isDragEnd: (e === null || e === void 0 ? void 0 : e.type) === 'dragend',
                    dropEffect: (_a = e === null || e === void 0 ? void 0 : e.dataTransfer) === null || _a === void 0 ? void 0 : _a.dropEffect
                }, 'useCardDataDragDrop');
            }
            document.removeEventListener('mousemove', updatePreview);
            document.removeEventListener('dragover', updatePreview);
            // Only clean up the preview visual element, NOT the drag state
            cleanupDragPreview();
            // NOTE: Drag state is managed separately by handleContentDragEnd
            // which is called from the global dragend handler
        };
        // Start listening for mouse/drag events immediately
        document.addEventListener('mousemove', updatePreview);
        document.addEventListener('dragover', updatePreview);
        // DON'T listen to mouseup - it fires too early during drag
        // Only listen to dragend, which fires when drag actually ends
        document.addEventListener('dragend', cleanupPreviewListeners, { once: true });
        // Cleanup on escape key
        var cleanupOnEscape = function (e) {
            if (e.key === 'Escape') {
                cleanupDragPreview();
                document.removeEventListener('keydown', cleanupOnEscape);
            }
        };
        document.addEventListener('keydown', cleanupOnEscape);
        // Cleanup on window blur (user switches tabs/windows)
        var cleanupOnBlur = function () {
            cleanupDragPreview();
            window.removeEventListener('blur', cleanupOnBlur);
        };
        window.addEventListener('blur', cleanupOnBlur, { once: true });
    }, [cleanupDragPreview]);
    /**
     * Start dragging data from a card
     */
    var handleContentDragStart = (0, react_1.useCallback)(function (_cardId, payload, e) {
        var _a;
        if (!enabled || !registry.isEnabled()) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Drag disabled or registry not enabled', { enabled: enabled, registryEnabled: registry.isEnabled() }, 'useCardDataDragDrop');
            }
            // If disabled, prevent the drag
            if ('preventDefault' in e) {
                e.preventDefault();
            }
            return;
        }
        // CRITICAL: DO NOT call preventDefault() or stopPropagation() here!
        // This would cancel the drag operation and prevent dragover events from firing.
        // The drag must be allowed to proceed naturally for HTML5 drag-and-drop to work.
        // Get initial mouse position for preview
        var startX = 'clientX' in e ? e.clientX : window.innerWidth / 2;
        var startY = 'clientY' in e ? e.clientY : window.innerHeight / 2;
        // Set drag data for HTML5 drag-and-drop
        // Note: dataTransfer should already be set by DraggableContent, but we ensure it here too
        if ('dataTransfer' in e && e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            // Only set if not already set (DraggableContent should have set it)
            if (!e.dataTransfer.getData('application/json')) {
                e.dataTransfer.setData('application/json', JSON.stringify(payload));
                e.dataTransfer.setData('text/plain', ((_a = payload.dragPreview) === null || _a === void 0 ? void 0 : _a.title) || payload.data.id);
            }
        }
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('Setting drag state', {
                sourceCardId: payload.sourceCardId,
                dataType: payload.sourceDataType,
                hasPreview: !!payload.dragPreview,
                mouseX: startX,
                mouseY: startY
            }, 'useCardDataDragDrop');
        }
        // Update shared state in registry
        registry.setDragState({
            isDragging: true,
            payload: payload,
            dropTarget: null,
            dropZoneHighlight: null,
            availableActions: []
        });
        // Create drag preview with initial mouse position
        createDragPreview(payload, startX, startY);
        // Callback
        onDragStart === null || onDragStart === void 0 ? void 0 : onDragStart(payload);
        logger_1.logger.debug('Card data drag started', {
            sourceCardId: payload.sourceCardId,
            dataType: payload.sourceDataType,
            dataId: payload.data.id
        });
    }, [enabled, registry, onDragStart, createDragPreview]);
    /**
     * Handle drag move - detect drop zones
     */
    var handleContentDragMove = (0, react_1.useCallback)(function (e) {
        var currentState = dragStateRef.current;
        if (!currentState.isDragging || !currentState.payload) {
            return;
        }
        var evt = e;
        var clientX = evt.clientX;
        var clientY = evt.clientY;
        // Find card element under cursor
        var elementUnderCursor = document.elementFromPoint(clientX, clientY);
        var cardElement = elementUnderCursor === null || elementUnderCursor === void 0 ? void 0 : elementUnderCursor.closest('[data-card-id]');
        if (cardElement) {
            var targetCardId = cardElement.getAttribute('data-card-id');
            if (targetCardId && targetCardId !== currentState.payload.sourceCardId) {
                // Check if this card can accept the payload
                var canAccept = registry.canCardAccept(targetCardId, currentState.payload);
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Checking drop zone', {
                        targetCardId: targetCardId,
                        canAccept: canAccept,
                        sourceCardId: currentState.payload.sourceCardId,
                        dataType: currentState.payload.sourceDataType
                    }, 'useCardDataDragDrop');
                }
                if (canAccept) {
                    var dropZones = registry.getDropZonesForCard(targetCardId);
                    // keep availableActions for future use; currently we highlight by targetCardId
                    registry.setDragState({
                        dropTarget: targetCardId,
                        dropZoneHighlight: targetCardId,
                        availableActions: dropZones
                    });
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Drop zone highlighted', { targetCardId: targetCardId }, 'useCardDataDragDrop');
                    }
                }
                else {
                    registry.setDragState({
                        dropTarget: null,
                        dropZoneHighlight: null,
                        availableActions: []
                    });
                }
            }
        }
        else {
            registry.setDragState({
                dropTarget: null,
                dropZoneHighlight: null,
                availableActions: []
            });
        }
    }, [registry]);
    /**
     * Handle drop - execute action
     */
    var handleContentDrop = (0, react_1.useCallback)(function (targetCardId, payload, actionId) { return __awaiter(_this, void 0, void 0, function () {
        var dropZones, availableActions, actionToExecute, _i, dropZones_1, zone, action, _a, dropZones_2, zone, result, error_1, errorResult;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!enabled || !registry.isEnabled()) {
                        return [2 /*return*/, null];
                    }
                    // Validate drop
                    if (!registry.canCardAccept(targetCardId, payload)) {
                        logger_1.logger.warn('Drop rejected - card cannot accept payload', {
                            targetCardId: targetCardId,
                            dataType: payload.sourceDataType
                        });
                        return [2 /*return*/, {
                                success: false,
                                error: 'This card cannot accept this type of data'
                            }];
                    }
                    dropZones = registry.getDropZonesForCard(targetCardId);
                    availableActions = registry.getAvailableActions(targetCardId, payload);
                    if (actionId) {
                        // Specific action requested
                        for (_i = 0, dropZones_1 = dropZones; _i < dropZones_1.length; _i++) {
                            zone = dropZones_1[_i];
                            if (zone.actions[actionId]) {
                                actionToExecute = zone.actions[actionId];
                                break;
                            }
                        }
                    }
                    else if (availableActions.length === 1) {
                        action = availableActions[0];
                        if (!action) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: 'No action available for this drop'
                                }];
                        }
                        for (_a = 0, dropZones_2 = dropZones; _a < dropZones_2.length; _a++) {
                            zone = dropZones_2[_a];
                            if (zone.actions[action.actionId]) {
                                actionToExecute = zone.actions[action.actionId];
                                break;
                            }
                        }
                    }
                    else if (availableActions.length > 1) {
                        // Multiple actions - return them for user selection
                        // This will be handled by the UI component
                        return [2 /*return*/, {
                                success: false,
                                error: 'Multiple actions available - user must select',
                                data: { availableActions: availableActions }
                            }];
                    }
                    if (!actionToExecute) {
                        return [2 /*return*/, {
                                success: false,
                                error: 'No action available for this drop'
                            }];
                    }
                    // Check if confirmation required
                    if (actionToExecute.requiresConfirmation) {
                        // This will be handled by the UI component
                        return [2 /*return*/, {
                                success: false,
                                error: 'Confirmation required',
                                data: {
                                    action: actionToExecute,
                                    requiresConfirmation: true,
                                    confirmationMessage: actionToExecute.confirmationMessage
                                }
                            }];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    logger_1.logger.debug('Executing card interaction action', {
                        targetCardId: targetCardId,
                        actionId: actionToExecute.id || 'unknown',
                        dataType: payload.sourceDataType
                    });
                    return [4 /*yield*/, actionToExecute.handler(payload)];
                case 2:
                    result = _b.sent();
                    // Callback
                    onActionExecuted === null || onActionExecuted === void 0 ? void 0 : onActionExecuted(actionToExecute.id || 'unknown', result);
                    // Reset drag state
                    registry.setDragState({
                        isDragging: false,
                        payload: null,
                        dropTarget: null,
                        dropZoneHighlight: null,
                        availableActions: []
                    });
                    // Cleanup drag preview
                    cleanupDragPreview();
                    // Callback
                    onDragEnd === null || onDragEnd === void 0 ? void 0 : onDragEnd(payload, result);
                    return [2 /*return*/, result];
                case 3:
                    error_1 = _b.sent();
                    logger_1.logger.error('Error executing card interaction action', error_1);
                    errorResult = {
                        success: false,
                        error: error_1 instanceof Error ? error_1.message : 'Unknown error'
                    };
                    // Reset drag state
                    registry.setDragState({
                        isDragging: false,
                        payload: null,
                        dropTarget: null,
                        dropZoneHighlight: null,
                        availableActions: []
                    });
                    cleanupDragPreview();
                    onDragEnd === null || onDragEnd === void 0 ? void 0 : onDragEnd(payload, errorResult);
                    return [2 /*return*/, errorResult];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [enabled, onDragEnd, onActionExecuted, cleanupDragPreview]);
    /**
     * Handle drag end (cancel)
     */
    var handleContentDragEnd = (0, react_1.useCallback)(function () {
        var currentState = dragStateRef.current;
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('handleContentDragEnd called', {
                isDragging: currentState.isDragging,
                hasPayload: !!currentState.payload,
                stackTrace: new Error().stack
            }, 'useCardDataDragDrop');
        }
        if (currentState.isDragging) {
            cleanupDragPreview();
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Resetting drag state in handleContentDragEnd', {}, 'useCardDataDragDrop');
            }
            registry.setDragState({
                isDragging: false,
                payload: null,
                dropTarget: null,
                dropZoneHighlight: null,
                availableActions: []
            });
            onDragEnd === null || onDragEnd === void 0 ? void 0 : onDragEnd(currentState.payload, undefined);
        }
    }, [registry, onDragEnd, cleanupDragPreview]);
    // Track if cleanup is already scheduled to prevent multiple calls
    var cleanupTimeoutRef = (0, react_1.useRef)(null);
    // Store callbacks in refs to prevent effect from re-running
    var handleContentDragMoveRef = (0, react_1.useRef)(handleContentDragMove);
    var handleContentDropRef = (0, react_1.useRef)(handleContentDrop);
    var handleContentDragEndRef = (0, react_1.useRef)(handleContentDragEnd);
    var cleanupDragPreviewRef = (0, react_1.useRef)(cleanupDragPreview);
    (0, react_1.useEffect)(function () {
        handleContentDragMoveRef.current = handleContentDragMove;
        handleContentDropRef.current = handleContentDrop;
        handleContentDragEndRef.current = handleContentDragEnd;
        cleanupDragPreviewRef.current = cleanupDragPreview;
    }, [handleContentDragMove, handleContentDrop, handleContentDragEnd, cleanupDragPreview]);
    // Global event listeners for HTML5 drag-and-drop
    (0, react_1.useEffect)(function () {
        if (!enabled) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('useCardDataDragDrop disabled, not attaching listeners', {}, 'useCardDataDragDrop');
            }
            return;
        }
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('Attaching global drag-and-drop listeners', {}, 'useCardDataDragDrop');
        }
        // TEST: Add raw native listeners to window to see if events are firing at all
        var testNativeDragOver = function (e) {
            var _a, _b;
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('TEST NATIVE dragover on window', {
                    type: e.type,
                    timestamp: Date.now(),
                    target: (_a = e.target) === null || _a === void 0 ? void 0 : _a.tagName,
                    hasDataTransfer: !!e.dataTransfer,
                    dataTransferTypes: Array.from(((_b = e.dataTransfer) === null || _b === void 0 ? void 0 : _b.types) || [])
                }, 'useCardDataDragDrop');
            }
        };
        var testNativeDragStart = function (e) {
            var _a, _b;
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('TEST NATIVE dragstart on window', {
                    type: e.type,
                    timestamp: Date.now(),
                    target: (_a = e.target) === null || _a === void 0 ? void 0 : _a.tagName,
                    hasDataTransfer: !!e.dataTransfer,
                    dataTransferTypes: Array.from(((_b = e.dataTransfer) === null || _b === void 0 ? void 0 : _b.types) || [])
                }, 'useCardDataDragDrop');
            }
        };
        var testNativeDragEnd = function (e) {
            var _a, _b;
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('TEST NATIVE dragend on window', {
                    type: e.type,
                    timestamp: Date.now(),
                    target: (_a = e.target) === null || _a === void 0 ? void 0 : _a.tagName,
                    dropEffect: (_b = e.dataTransfer) === null || _b === void 0 ? void 0 : _b.dropEffect
                }, 'useCardDataDragDrop');
            }
        };
        window.addEventListener('dragover', testNativeDragOver, true);
        window.addEventListener('dragover', testNativeDragOver, false);
        window.addEventListener('dragstart', testNativeDragStart, true);
        window.addEventListener('dragstart', testNativeDragStart, false);
        window.addEventListener('dragend', testNativeDragEnd, true);
        window.addEventListener('dragend', testNativeDragEnd, false);
        var handleDragOver = function (e) {
            var _a, _b, _c, _d, _f, _g;
            // CRITICAL: ALWAYS prevent default FIRST to allow drop - this is critical for drop events to fire
            // Must be called even if we're not tracking a drag, to allow any drag operations
            e.preventDefault();
            // CRITICAL: Log FIRST to see if events are even reaching us
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Global dragover EVENT RECEIVED', {
                    timestamp: Date.now(),
                    type: e.type,
                    target: (_a = e.target) === null || _a === void 0 ? void 0 : _a.tagName,
                    currentTarget: (_b = e.currentTarget) === null || _b === void 0 ? void 0 : _b.tagName,
                    dataTransferTypes: Array.from(((_c = e.dataTransfer) === null || _c === void 0 ? void 0 : _c.types) || []),
                    dataTransferEffectAllowed: (_d = e.dataTransfer) === null || _d === void 0 ? void 0 : _d.effectAllowed,
                    dataTransferDropEffect: (_f = e.dataTransfer) === null || _f === void 0 ? void 0 : _f.dropEffect,
                    hasDataTransfer: !!e.dataTransfer
                }, 'useCardDataDragDrop');
            }
            // Check drag state from both ref and registry (fallback)
            var currentState = dragStateRef.current;
            var registryState = registry.getDragState();
            var isDragging = currentState.isDragging || registryState.isDragging;
            var payload = currentState.payload || registryState.payload;
            var target = e.target;
            var isDropZone = (target === null || target === void 0 ? void 0 : target.closest('.drop-zone')) || (target === null || target === void 0 ? void 0 : target.closest('[data-card-id]'));
            // Log ALL dragover events to debug
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Global dragover details', {
                    isDragging: isDragging,
                    hasPayload: !!payload,
                    payloadType: payload === null || payload === void 0 ? void 0 : payload.sourceDataType,
                    target: target === null || target === void 0 ? void 0 : target.tagName,
                    targetClass: target === null || target === void 0 ? void 0 : target.className,
                    isDropZone: !!isDropZone,
                    dropZoneCardId: isDropZone === null || isDropZone === void 0 ? void 0 : isDropZone.getAttribute('data-card-id'),
                    clientX: e.clientX,
                    clientY: e.clientY,
                    dataTransferTypes: Array.from(((_g = e.dataTransfer) === null || _g === void 0 ? void 0 : _g.types) || []),
                    refState: { isDragging: currentState.isDragging, hasPayload: !!currentState.payload },
                    registryState: { isDragging: registryState.isDragging, hasPayload: !!registryState.payload }
                }, 'useCardDataDragDrop');
            }
            // Set drop effect based on whether we have a valid drag
            if (e.dataTransfer) {
                if (isDragging && payload) {
                    e.dataTransfer.dropEffect = 'move';
                }
                else {
                    // Still allow drop even if we're not tracking it (might be external drag)
                    e.dataTransfer.dropEffect = 'move';
                }
            }
            if (isDragging && payload) {
                // DON'T call stopPropagation() - let React and native events fire on DropZone
                // Update drag preview position
                if (dragPreviewRef.current) {
                    dragPreviewRef.current.style.left = "".concat(e.clientX, "px");
                    dragPreviewRef.current.style.top = "".concat(e.clientY, "px");
                }
                handleContentDragMoveRef.current(e);
            }
        };
        var handleDrop = function (e) {
            var _a, _b, _c, _d;
            var currentState = dragStateRef.current;
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Global drop event', {
                    isDragging: currentState.isDragging,
                    hasPayload: !!currentState.payload,
                    target: (_a = e.target) === null || _a === void 0 ? void 0 : _a.tagName,
                    targetClass: (_b = e.target) === null || _b === void 0 ? void 0 : _b.className,
                    dropEffect: (_c = e.dataTransfer) === null || _c === void 0 ? void 0 : _c.dropEffect,
                    types: Array.from(((_d = e.dataTransfer) === null || _d === void 0 ? void 0 : _d.types) || [])
                }, 'useCardDataDragDrop');
            }
            if (currentState.isDragging && currentState.payload) {
                var target = e.target;
                var dropZone = target.closest('[data-card-id]');
                var dropZoneElement = target.closest('.drop-zone');
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Global drop - checking drop zone', {
                        hasDropZoneElement: !!dropZoneElement,
                        hasCardId: !!dropZone,
                        cardId: dropZone === null || dropZone === void 0 ? void 0 : dropZone.getAttribute('data-card-id'),
                        sourceCardId: currentState.payload.sourceCardId
                    }, 'useCardDataDragDrop');
                }
                // If there's a React DropZone element, let React handle it
                // CRITICAL: Only prevent default to allow drop, but DON'T stop propagation
                // This allows React's synthetic event system to receive and handle the event
                if (dropZoneElement) {
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Drop on React DropZone - allowing React to handle, preventing default only', {}, 'useCardDataDragDrop');
                    }
                    // Prevent default to allow drop, but let event bubble to React
                    e.preventDefault();
                    // DO NOT stop propagation - React needs the event to bubble to handle it
                    return;
                }
                // No React drop zone found - handle it globally
                e.preventDefault();
                e.stopPropagation();
                var targetCardId = dropZone === null || dropZone === void 0 ? void 0 : dropZone.getAttribute('data-card-id');
                if (targetCardId && targetCardId !== currentState.payload.sourceCardId) {
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Global handler processing drop on card', { targetCardId: targetCardId }, 'useCardDataDragDrop');
                    }
                    handleContentDropRef.current(targetCardId, currentState.payload);
                }
                else {
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Dropped outside valid drop zone - cleaning up', {}, 'useCardDataDragDrop');
                    }
                    // Dropped outside a valid drop zone - cleanup
                    handleContentDragEndRef.current();
                }
            }
            else {
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Global drop - no active drag, ignoring', {}, 'useCardDataDragDrop');
                }
            }
        };
        // Handle drag end (when user releases mouse or cancels drag)
        var handleDragEnd = function (e) {
            var _a, _b, _c;
            var currentState = dragStateRef.current;
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Global dragend event', {
                    isDragging: currentState.isDragging,
                    hasPayload: !!currentState.payload,
                    dropEffect: (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.dropEffect,
                    relatedTarget: e.relatedTarget,
                    dataTransferTypes: Array.from(((_b = e.dataTransfer) === null || _b === void 0 ? void 0 : _b.types) || [])
                }, 'useCardDataDragDrop');
            }
            // Cancel any pending cleanup timeout
            if (cleanupTimeoutRef.current) {
                clearTimeout(cleanupTimeoutRef.current);
                cleanupTimeoutRef.current = null;
            }
            // ALWAYS cleanup the preview on dragend
            cleanupDragPreviewRef.current();
            // Check if drop was successful
            if (currentState.isDragging) {
                var dropEffect = (_c = e.dataTransfer) === null || _c === void 0 ? void 0 : _c.dropEffect;
                if (dropEffect === 'move') {
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Drag completed successfully - drop was handled', {}, 'useCardDataDragDrop');
                    }
                    // Drop was successful - state will be reset by handleDrop
                    // But if handleDrop didn't fire, reset here as fallback
                    setTimeout(function () {
                        var stillDragging = dragStateRef.current.isDragging;
                        if (stillDragging) {
                            logger_1.logger.warn('Drop was successful but state not reset - cleaning up', {}, 'useCardDataDragDrop');
                            handleContentDragEndRef.current();
                        }
                    }, 100);
                }
                else if (dropEffect === 'none') {
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Drag cancelled - resetting state', {}, 'useCardDataDragDrop');
                    }
                    handleContentDragEndRef.current();
                }
                else {
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Drag end - unknown dropEffect, resetting state', { dropEffect: dropEffect }, 'useCardDataDragDrop');
                    }
                    handleContentDragEndRef.current();
                }
            }
        };
        // Handle drag leave (when dragged outside window)
        var handleDragLeave = function (e) {
            var currentState = dragStateRef.current;
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Global dragleave event', {
                    isDragging: currentState.isDragging,
                    relatedTarget: e.relatedTarget,
                    target: e.target
                }, 'useCardDataDragDrop');
            }
            // Only cleanup if leaving the window (not just moving between elements)
            if (currentState.isDragging && (!e.relatedTarget || e.relatedTarget === null)) {
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Leaving window - cleaning up', {}, 'useCardDataDragDrop');
                }
                cleanupDragPreviewRef.current();
                handleContentDragEndRef.current();
            }
        };
        // Handle escape key to cancel drag
        var handleEscape = function (e) {
            var currentState = dragStateRef.current;
            if (currentState.isDragging && e.key === 'Escape') {
                cleanupDragPreviewRef.current();
                handleContentDragEndRef.current();
            }
        };
        // Handle mouse up anywhere (safety net)
        // NOTE: This is a fallback in case dragend doesn't fire
        // We use a timeout to give dragend a chance to fire first
        var handleMouseUp = function () {
            var currentState = dragStateRef.current;
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Global mouseup event (safety net)', {
                    isDragging: currentState.isDragging,
                    hasPayload: !!currentState.payload
                }, 'useCardDataDragDrop');
            }
            // If dragging, wait a bit for dragend to fire, then cleanup if it didn't
            if (currentState.isDragging && !cleanupTimeoutRef.current) {
                logger_1.logger.warn('mouseup fired during drag - waiting for dragend', {}, 'useCardDataDragDrop');
                cleanupTimeoutRef.current = setTimeout(function () {
                    var stillDragging = dragStateRef.current.isDragging;
                    if (stillDragging) {
                        logger_1.logger.warn('dragend never fired - cleaning up via mouseup fallback', {}, 'useCardDataDragDrop');
                        cleanupDragPreviewRef.current();
                        handleContentDragEndRef.current();
                    }
                    cleanupTimeoutRef.current = null;
                }, 200); // Give dragend 200ms to fire
            }
        };
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('Adding event listeners to document', {}, 'useCardDataDragDrop');
        }
        // Add listeners with capture phase to catch events early
        document.addEventListener('dragover', handleDragOver, true); // CAPTURE PHASE
        document.addEventListener('drop', handleDrop, true); // CAPTURE PHASE
        document.addEventListener('dragend', handleDragEnd, true); // CAPTURE PHASE
        document.addEventListener('dragleave', handleDragLeave, true); // CAPTURE PHASE
        // Also add in bubble phase as backup
        document.addEventListener('dragover', handleDragOver, false);
        document.addEventListener('drop', handleDrop, false);
        document.addEventListener('dragend', handleDragEnd, false);
        document.addEventListener('dragleave', handleDragLeave, false);
        document.addEventListener('keydown', handleEscape, false);
        document.addEventListener('mouseup', handleMouseUp, false);
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('Event listeners attached (both capture and bubble phases)', {}, 'useCardDataDragDrop');
        }
        return function () {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Removing global drag-and-drop listeners', {}, 'useCardDataDragDrop');
            }
            // Remove test native listeners
            window.removeEventListener('dragover', testNativeDragOver, true);
            window.removeEventListener('dragover', testNativeDragOver, false);
            window.removeEventListener('dragstart', testNativeDragStart, true);
            window.removeEventListener('dragstart', testNativeDragStart, false);
            window.removeEventListener('dragend', testNativeDragEnd, true);
            window.removeEventListener('dragend', testNativeDragEnd, false);
            // Remove capture phase listeners
            document.removeEventListener('dragover', handleDragOver, true);
            document.removeEventListener('drop', handleDrop, true);
            document.removeEventListener('dragend', handleDragEnd, true);
            document.removeEventListener('dragleave', handleDragLeave, true);
            // Remove bubble phase listeners
            document.removeEventListener('dragover', handleDragOver, false);
            document.removeEventListener('drop', handleDrop, false);
            document.removeEventListener('dragend', handleDragEnd, false);
            document.removeEventListener('dragleave', handleDragLeave, false);
            document.removeEventListener('keydown', handleEscape, false);
            document.removeEventListener('mouseup', handleMouseUp, false);
            // Cleanup on unmount
            cleanupDragPreviewRef.current();
        };
    }, [enabled]); // Only depend on enabled - callbacks are in refs
    return {
        // State
        isDragging: dragState.isDragging,
        draggingPayload: dragState.payload,
        dropTarget: dragState.dropTarget,
        dropZoneHighlight: dragState.dropZoneHighlight,
        availableActions: dragState.availableActions,
        // Actions
        handleContentDragStart: handleContentDragStart,
        handleContentDragMove: handleContentDragMove,
        handleContentDrop: handleContentDrop,
        handleContentDragEnd: handleContentDragEnd,
        // Utilities
        canCardAccept: function (cardId, payload) {
            return registry.canCardAccept(cardId, payload);
        },
        getAvailableActions: function (cardId, payload) {
            return registry.getAvailableActions(cardId, payload);
        }
    };
}
