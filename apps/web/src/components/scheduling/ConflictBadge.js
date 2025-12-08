"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictBadge = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// React import removed (not needed with new JSX transform)
var lucide_react_1 = require("lucide-react");
var ConflictBadge = function (_a) {
    var type = _a.type, severity = _a.severity, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.size, size = _c === void 0 ? 'sm' : _c;
    var sizeClasses = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5'
    };
    var severityColors = {
        critical: 'bg-red-500 text-white',
        high: 'bg-orange-500 text-white',
        medium: 'bg-yellow-500 text-white',
        low: 'bg-blue-500 text-white'
    };
    var getIcon = function () {
        var iconSize = size === 'sm' ? 10 : size === 'md' ? 14 : 16;
        switch (type) {
            case 'time_overlap':
            case 'technician_double_booking':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { size: iconSize });
            case 'location_conflict':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { size: iconSize });
            case 'capacity_warning':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: iconSize });
            case 'skill_mismatch':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { size: iconSize });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { size: iconSize });
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "inline-flex items-center justify-center rounded-full ".concat(severityColors[severity], " ").concat(sizeClasses[size], " ").concat(className), title: "".concat(type.replace('_', ' '), " - ").concat(severity), children: getIcon() }));
};
exports.ConflictBadge = ConflictBadge;
