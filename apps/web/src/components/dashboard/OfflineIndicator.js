"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineIndicator = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var offline_queue_service_1 = require("@/services/offline-queue.service");
var pwa_1 = require("@/utils/pwa");
var toast_1 = require("@/utils/toast");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var OfflineIndicator = function () {
    var _a = (0, react_1.useState)((0, pwa_1.isOnline)()), online = _a[0], setOnline = _a[1];
    var _b = (0, react_1.useState)([]), queue = _b[0], setQueue = _b[1];
    var _c = (0, react_1.useState)(false), showDetails = _c[0], setShowDetails = _c[1];
    (0, react_1.useEffect)(function () {
        // Subscribe to online status changes
        var unsubscribeOnline = (0, pwa_1.onOnlineStatusChange)(function (isOnline) {
            setOnline(isOnline);
            if (isOnline) {
                toast_1.toast.success('Connection restored. Syncing changes...');
            }
            else {
                toast_1.toast.info('You\'re offline. Changes will be synced when connection is restored.');
            }
        });
        // Subscribe to queue changes
        var unsubscribeQueue = offline_queue_service_1.offlineQueueService.subscribe(function (updatedQueue) {
            setQueue(updatedQueue);
        });
        // Initial queue load
        setQueue(offline_queue_service_1.offlineQueueService.getQueue());
        return function () {
            unsubscribeOnline();
            unsubscribeQueue();
        };
    }, []);
    var status = offline_queue_service_1.offlineQueueService.getQueueStatus();
    var hasPendingChanges = status.pending > 0 || status.syncing > 0;
    var hasFailedChanges = status.failed > 0;
    if (online && !hasPendingChanges && !hasFailedChanges) {
        return null; // Don't show indicator when online and no pending changes
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed bottom-4 right-4 z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px] max-w-[400px]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [online ? (hasPendingChanges ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Cloud, { className: "w-5 h-5 text-blue-600 animate-pulse" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "w-5 h-5 text-green-600" }))) : ((0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { className: "w-5 h-5 text-red-600" })), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-sm", children: online
                                        ? hasPendingChanges
                                            ? 'Syncing...'
                                            : 'All synced'
                                        : 'Offline' })] }), hasPendingChanges && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowDetails(!showDetails); }, className: "text-xs text-blue-600 hover:text-blue-700", children: showDetails ? 'Hide' : 'Details' }))] }), !online && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600 mb-3", children: "Your changes are being saved locally and will sync when you're back online." })), online && hasPendingChanges && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 mb-3", children: [status.syncing > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs text-blue-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Cloud, { className: "w-4 h-4 animate-pulse" }), (0, jsx_runtime_1.jsxs)("span", { children: [status.syncing, " operation", status.syncing !== 1 ? 's' : '', " syncing..."] })] })), status.pending > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CloudOff, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsxs)("span", { children: [status.pending, " operation", status.pending !== 1 ? 's' : '', " pending"] })] }))] })), hasFailedChanges && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-3 p-2 bg-red-50 border border-red-200 rounded", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs text-red-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsxs)("span", { children: [status.failed, " operation", status.failed !== 1 ? 's' : '', " failed"] })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return offline_queue_service_1.offlineQueueService.retryFailed(); }, className: "w-full text-xs py-1 bg-red-600 hover:bg-red-700", children: "Retry Failed" })] })), showDetails && queue.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "mt-3 pt-3 border-t border-gray-200 max-h-48 overflow-y-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [queue.slice(0, 5).map(function (op) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs p-2 bg-gray-50 rounded", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-medium text-gray-900", children: [op.type, " ", op.resource] }), op.status === 'failed' && op.error && ((0, jsx_runtime_1.jsx)("div", { className: "text-red-600 text-xs mt-1", children: op.error }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [op.status === 'syncing' && ((0, jsx_runtime_1.jsx)(lucide_react_1.Cloud, { className: "w-3 h-3 text-blue-600 animate-pulse" })), op.status === 'failed' && ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-3 h-3 text-red-600" })), op.status === 'completed' && ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "w-3 h-3 text-green-600" }))] })] }, op.id)); }), queue.length > 5 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500 text-center pt-1", children: ["+", queue.length - 5, " more"] }))] }) })), online && hasPendingChanges && ((0, jsx_runtime_1.jsx)("div", { className: "mt-3 pt-3 border-t border-gray-200", children: (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return offline_queue_service_1.offlineQueueService.syncQueue(); }, className: "w-full text-xs py-1 bg-blue-600 hover:bg-blue-700", children: "Sync Now" }) }))] }) }));
};
exports.OfflineIndicator = OfflineIndicator;
