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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraggableContent = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * DraggableContent Component
 *
 * Wraps content to make it draggable for card-to-card interactions.
 * This component handles the drag start and creates the drag payload.
 */
var react_1 = require("react");
var useCardDataDragDrop_1 = require("../hooks/useCardDataDragDrop");
var auth_1 = require("@/stores/auth");
var logger_1 = require("@/utils/logger");
var DraggableContent = function (_a) {
    var cardId = _a.cardId, dataType = _a.dataType, data = _a.data, selectedItems = _a.selectedItems, children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c, onDragStart = _a.onDragStart, getDragPreview = _a.getDragPreview;
    var user = (0, auth_1.useAuthStore)().user;
    var handleContentDragStart = (0, useCardDataDragDrop_1.useCardDataDragDrop)(__assign({}, (onDragStart && { onDragStart: onDragStart }))).handleContentDragStart;
    var handleDragStart = (0, react_1.useCallback)(function (e) {
        var _a;
        if (disabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        // CRITICAL: DO NOT call preventDefault() or stopPropagation() here!
        // This would cancel the drag operation and prevent dragover/drop events from firing.
        // The drag must be allowed to proceed naturally for HTML5 drag-and-drop to work.
        // Store initial mouse position for preview positioning
        var startX = e.clientX || 0;
        var startY = e.clientY || 0;
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('Drag started', {
                cardId: cardId,
                dataType: dataType,
                dataName: data.name || data.title || data.id,
                mouseX: startX,
                mouseY: startY,
                hasDataTransfer: !!e.dataTransfer,
                dataTransferTypes: e.dataTransfer ? Array.from(e.dataTransfer.types) : []
            }, 'DraggableContent');
        }
        // Create drag payload
        var dragPreview = getDragPreview
            ? getDragPreview(data, selectedItems)
            : __assign({ title: data.name || data.title || data.id || 'Item', icon: getIconForDataType(dataType), color: getColorForDataType(dataType) }, (selectedItems && selectedItems.length > 0 && { count: selectedItems.length }));
        var payload = {
            sourceCardId: cardId,
            sourceCardType: cardId,
            sourceDataType: dataType,
            data: __assign({ id: data.id || data._id || String(data), type: dataType, entity: data }, (selectedItems && selectedItems.length > 0 && {
                metadata: { selectedItems: selectedItems }
            })),
            dragPreview: dragPreview,
            timestamp: Date.now(),
            userId: (user === null || user === void 0 ? void 0 : user.id) || 'anonymous'
        };
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('Drag payload created', {
                sourceCardId: payload.sourceCardId,
                dataType: payload.sourceDataType,
                customerName: (_a = payload.dragPreview) === null || _a === void 0 ? void 0 : _a.title,
                customerId: payload.data.id
            }, 'DraggableContent');
        }
        // Set drag data for HTML5 drag-and-drop BEFORE calling handleContentDragStart
        // This ensures the browser has the data available
        // CRITICAL: dataTransfer must be set up correctly or the drag operation may fail
        if (e.dataTransfer) {
            try {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('application/json', JSON.stringify(payload));
                e.dataTransfer.setData('text/plain', dragPreview.title || payload.data.id);
                // Also set a custom type for easier identification
                e.dataTransfer.setData('text/x-verofield-drag', JSON.stringify({
                    cardId: cardId,
                    dataType: dataType,
                    dataId: payload.data.id
                }));
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('DataTransfer configured', {
                        effectAllowed: e.dataTransfer.effectAllowed,
                        types: Array.from(e.dataTransfer.types),
                        hasJson: !!e.dataTransfer.getData('application/json'),
                        hasText: !!e.dataTransfer.getData('text/plain'),
                        hasCustom: !!e.dataTransfer.getData('text/x-verofield-drag')
                    }, 'DraggableContent');
                }
            }
            catch (error) {
                logger_1.logger.error('Error setting dataTransfer', error, 'DraggableContent');
                // Don't prevent drag - continue without data (fallback)
            }
        }
        else {
            logger_1.logger.error('No dataTransfer available in dragstart', {}, 'DraggableContent');
            // This is a critical error - drag may not work properly
        }
        // Create a custom drag image for better visual feedback
        // This is the native browser drag image that follows the cursor
        // CRITICAL: The drag image must be visible and in the DOM when setDragImage is called
        var dragImage = document.createElement('div');
        dragImage.style.cssText = "\n      position: fixed;\n      top: 0px;\n      left: 0px;\n      padding: 10px 16px;\n      background: white;\n      border: 2px solid ".concat(dragPreview.color || '#6366f1', ";\n      border-radius: 8px;\n      box-shadow: 0 8px 24px rgba(0,0,0,0.25);\n      font-size: 14px;\n      font-weight: 600;\n      color: #1f2937;\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      white-space: nowrap;\n      z-index: 999999;\n      pointer-events: none;\n      visibility: visible;\n      opacity: 1;\n      margin: 0;\n    ");
        if (dragPreview.icon) {
            dragImage.innerHTML = "<span style=\"font-size: 16px;\">".concat(dragPreview.icon, "</span> <span>").concat(dragPreview.title, "</span>");
        }
        else {
            dragImage.textContent = dragPreview.title;
        }
        // Append to body FIRST - element must be in DOM for measurement
        document.body.appendChild(dragImage);
        // Force a reflow to ensure the element is measured and rendered
        void dragImage.offsetWidth;
        void dragImage.offsetHeight;
        // Get dimensions while element is visible
        var offsetX = dragImage.offsetWidth / 2;
        var offsetY = dragImage.offsetHeight / 2;
        // Set the drag image BEFORE moving it off-screen
        // Some browsers require the element to be visible when setDragImage is called
        try {
            e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);
        }
        catch (error) {
            logger_1.logger.warn('Failed to set drag image', { error: error }, 'DraggableContent');
            // Continue without custom drag image - browser will use default
        }
        // Move off-screen after setting (but keep in DOM - browser needs it during drag)
        dragImage.style.top = '-10000px';
        dragImage.style.left = '-10000px';
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('Drag image set', {
                width: dragImage.offsetWidth,
                height: dragImage.offsetHeight,
                offsetX: offsetX,
                offsetY: offsetY,
                title: dragPreview.title,
                inDOM: document.body.contains(dragImage)
            }, 'DraggableContent');
        }
        // Clean up the drag image after drag ends (not immediately!)
        // The browser needs it during the entire drag operation
        var cleanupDragImage = function () {
            if (dragImage.parentNode) {
                dragImage.remove();
            }
        };
        // Clean up on drag end
        e.currentTarget.addEventListener('dragend', cleanupDragImage, { once: true });
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('DataTransfer set', {
                json: e.dataTransfer.getData('application/json') ? '✅' : '❌',
                text: e.dataTransfer.getData('text/plain'),
                custom: e.dataTransfer.getData('text/x-verofield-drag') ? '✅' : '❌'
            }, 'DraggableContent');
        }
        // Pass the drag event with mouse position
        handleContentDragStart(cardId, payload, e);
    }, [cardId, dataType, data, selectedItems, disabled, getDragPreview, user, handleContentDragStart]);
    // Handle drag end to ensure cleanup
    var handleDragEnd = (0, react_1.useCallback)(function (e) {
        var _a, _b;
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.debug('DraggableContent dragend event', {
                cardId: cardId,
                dataType: dataType,
                dropEffect: (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.dropEffect,
                effectAllowed: (_b = e.dataTransfer) === null || _b === void 0 ? void 0 : _b.effectAllowed,
                defaultPrevented: e.defaultPrevented
            }, 'DraggableContent');
        }
        // Don't prevent default - let the global handler manage it
        // The hook will handle cleanup
        // But ensure the event can propagate
        e.stopPropagation(); // Stop React event propagation, but let native event continue
    }, [cardId, dataType]);
    return ((0, jsx_runtime_1.jsx)("div", { draggable: !disabled, onDragStart: handleDragStart, onDragEnd: handleDragEnd, onClick: function (e) {
            // Prevent card selection when clicking on draggable content
            e.stopPropagation();
        }, className: "draggable-content ".concat(disabled ? 'draggable-content-disabled' : 'draggable-content-enabled', " ").concat(className), "data-draggable-type": dataType, "data-draggable-id": data.id || data._id, style: {
            cursor: disabled ? 'default' : 'grab',
            userSelect: 'none',
            position: 'relative',
            zIndex: 10
        }, children: children }));
};
exports.DraggableContent = DraggableContent;
/**
 * Helper function to get icon for data type
 */
function getIconForDataType(dataType) {
    var iconMap = {
        customer: '👤',
        job: '📦',
        technician: '👷',
        workorder: '📋',
        invoice: '💰',
        report: '📊',
        filter: '🔍',
        route: '🗺️',
        appointment: '📅',
        note: '📝',
        tag: '🏷️',
        custom: '📌'
    };
    return iconMap[dataType] || '📌';
}
/**
 * Helper function to get color for data type
 */
function getColorForDataType(dataType) {
    var colorMap = {
        customer: '#3b82f6', // blue
        job: '#8b5cf6', // purple
        technician: '#10b981', // green
        workorder: '#f59e0b', // amber
        invoice: '#ef4444', // red
        report: '#6366f1', // indigo
        filter: '#6b7280', // gray
        route: '#14b8a6', // teal
        appointment: '#ec4899', // pink
        note: '#84cc16', // lime
        tag: '#f97316', // orange
        custom: '#64748b' // slate
    };
    return colorMap[dataType] || '#64748b';
}
