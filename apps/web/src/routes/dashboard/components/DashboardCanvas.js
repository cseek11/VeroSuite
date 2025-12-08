"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardCanvas = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var CardGroup_1 = __importDefault(require("@/components/dashboard/CardGroup"));
var VirtualCardContainer_1 = require("@/components/dashboard/VirtualCardContainer");
var DashboardCanvas = function (_a) {
    var containerRef = _a.containerRef, canvasHeight = _a.canvasHeight, handleDeselectAll = _a.handleDeselectAll, handlePanStart = _a.handlePanStart, getTransformStyle = _a.getTransformStyle, groups = _a.groups, updateGroup = _a.updateGroup, deleteGroup = _a.deleteGroup, ungroupCards = _a.ungroupCards, selectedGroupId = _a.selectedGroupId, setSelectedGroupId = _a.setSelectedGroupId, handleGroupDragStart = _a.handleGroupDragStart, handleGroupDeleteRequest = _a.handleGroupDeleteRequest, isVirtualScrolling = _a.isVirtualScrolling, filteredCards = _a.filteredCards, renderVirtualCard = _a.renderVirtualCard, virtualScrollingThreshold = _a.virtualScrollingThreshold, cardsLength = _a.cardsLength, setShowCardSelector = _a.setShowCardSelector;
    return ((0, jsx_runtime_1.jsxs)("div", { ref: containerRef, className: "dashboard-canvas relative bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border-2 border-dashed border-slate-200 min-h-[600px] overflow-hidden cursor-grab", style: { height: "".concat(Math.max(600, canvasHeight), "px") }, onClick: function (e) {
            if (e.target === e.currentTarget) {
                handleDeselectAll();
            }
        }, onMouseDown: handlePanStart, children: [(0, jsx_runtime_1.jsxs)("div", { style: getTransformStyle(), children: [Object.values(groups).map(function (group) { return ((0, jsx_runtime_1.jsx)(CardGroup_1.default, { group: group, onUpdateGroup: updateGroup, onDeleteGroup: deleteGroup, onUngroupCards: ungroupCards, isSelected: selectedGroupId === group.id, onClick: function () { return setSelectedGroupId(selectedGroupId === group.id ? null : group.id); }, onGroupDragStart: handleGroupDragStart, onRequestDelete: handleGroupDeleteRequest }, group.id)); }), isVirtualScrolling ? ((0, jsx_runtime_1.jsx)(VirtualCardContainer_1.VirtualCardContainer, { cards: filteredCards, cardWidth: 300, cardHeight: 200, containerWidth: 1200, containerHeight: canvasHeight, renderCard: renderVirtualCard, overscan: 5, threshold: virtualScrollingThreshold })) : (
                    // Fallback to normal rendering for small card sets
                    filteredCards.map(function (card) { return renderVirtualCard(card, 0); }))] }), cardsLength === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-lg font-medium mb-2", children: "Your Customizable Dashboard" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 text-sm mb-4", children: "Add cards to create your personalized workspace" }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setShowCardSelector(true); }, className: "flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4" }), "Add Your First Card"] })] }) }))] }));
};
exports.DashboardCanvas = DashboardCanvas;
