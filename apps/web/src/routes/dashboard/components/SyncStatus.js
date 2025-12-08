"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncStatus = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var SyncStatus = function (_a) {
    var status = _a.status, lastSynced = _a.lastSynced, errorMessage = _a.errorMessage, className = _a.className;
    var getStatusConfig = function () {
        switch (status) {
            case 'syncing':
                return {
                    icon: lucide_react_1.Loader2,
                    text: 'Syncing...',
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-50',
                    iconClass: 'animate-spin',
                };
            case 'synced':
                return {
                    icon: lucide_react_1.CheckCircle2,
                    text: lastSynced
                        ? "Synced ".concat(formatLastSynced(lastSynced))
                        : 'Synced',
                    color: 'text-green-500',
                    bgColor: 'bg-green-50',
                    iconClass: '',
                };
            case 'error':
                return {
                    icon: lucide_react_1.AlertCircle,
                    text: errorMessage || 'Sync failed',
                    color: 'text-red-500',
                    bgColor: 'bg-red-50',
                    iconClass: '',
                };
            case 'offline':
                return {
                    icon: lucide_react_1.CloudOff,
                    text: 'Offline',
                    color: 'text-gray-500',
                    bgColor: 'bg-gray-50',
                    iconClass: '',
                };
            default:
                return {
                    icon: lucide_react_1.Cloud,
                    text: 'Ready',
                    color: 'text-gray-400',
                    bgColor: 'bg-gray-50',
                    iconClass: '',
                };
        }
    };
    var formatLastSynced = function (date) {
        var now = new Date();
        var diff = now.getTime() - date.getTime();
        var seconds = Math.floor(diff / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        if (seconds < 60)
            return 'just now';
        if (minutes < 60)
            return "".concat(minutes, "m ago");
        if (hours < 24)
            return "".concat(hours, "h ago");
        return date.toLocaleTimeString();
    };
    var config = getStatusConfig();
    var Icon = config.icon;
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)('flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors', config.bgColor, config.color, className), title: errorMessage || config.text, children: [(0, jsx_runtime_1.jsx)(Icon, { className: (0, utils_1.cn)('w-3.5 h-3.5', config.iconClass) }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: config.text })] }));
};
exports.SyncStatus = SyncStatus;
