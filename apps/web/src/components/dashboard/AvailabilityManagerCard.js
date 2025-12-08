"use strict";
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
exports.default = AvailabilityManagerCard;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Availability Manager Card Component
 *
 * Dashboard card for managing technician availability.
 * Shows list of technicians and allows setting availability patterns.
 */
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var react_query_1 = require("@tanstack/react-query");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var TechnicianAvailabilityCalendar_1 = require("../scheduling/TechnicianAvailabilityCalendar");
var Button_1 = __importDefault(require("@/components/ui/Button"));
function AvailabilityManagerCard(_a) {
    var _this = this;
    var _b = _a.cardId, cardId = _b === void 0 ? 'availability-manager' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var _d = (0, react_1.useState)(null), selectedTechnician = _d[0], setSelectedTechnician = _d[1];
    // Fetch technicians
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['technicians', 'availability-manager'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var users, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(enhanced_api_1.enhancedApi.technicians && typeof enhanced_api_1.enhancedApi.technicians.list === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.list()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!(enhanced_api_1.enhancedApi.users && typeof enhanced_api_1.enhancedApi.users.list === 'function')) return [3 /*break*/, 4];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.users.list()];
                    case 3:
                        users = _a.sent();
                        return [2 /*return*/, users.filter(function (u) { var _a; return (_a = u.roles) === null || _a === void 0 ? void 0 : _a.includes('technician'); })];
                    case 4: return [2 /*return*/, []];
                    case 5:
                        error_1 = _a.sent();
                        logger_1.logger.error('Failed to fetch technicians', error_1);
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        }); },
        staleTime: 5 * 60 * 1000
    }), _f = _e.data, technicians = _f === void 0 ? [] : _f, isLoading = _e.isLoading;
    var handleTechnicianSelect = function (technician) {
        setSelectedTechnician({
            id: technician.id || technician.user_id,
            name: "".concat(technician.first_name || '', " ").concat(technician.last_name || '').trim() || technician.email || technician.name || 'Unknown',
            email: technician.email,
            status: technician.status
        });
    };
    var handleCloseCalendar = function () {
        setSelectedTechnician(null);
    };
    if (selectedTechnician) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col min-h-[400px] ".concat(className), "data-card-id": cardId, children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-5 h-5 text-blue-600" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Manage Availability" })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "ghost", size: "sm", onClick: handleCloseCalendar, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600 mt-1", children: ["Setting availability for ", selectedTechnician.name] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 p-4 overflow-auto", children: (0, jsx_runtime_1.jsx)(TechnicianAvailabilityCalendar_1.TechnicianAvailabilityCalendar, { technicianId: selectedTechnician.id, technicianName: selectedTechnician.name, onClose: handleCloseCalendar }) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col min-h-[400px] ".concat(className), "data-card-id": cardId, children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-5 h-5 text-blue-600" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Availability Manager" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Manage technician availability schedules" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 p-4 overflow-auto", children: [isLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center py-12", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading technicians..." }) })) : technicians.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 font-medium", children: "No technicians found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: "Add technicians to manage their availability" })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-semibold text-gray-700 mb-3", children: "Technicians" }), technicians.map(function (technician) {
                                var techId = technician.id || technician.user_id;
                                var techName = "".concat(technician.first_name || '', " ").concat(technician.last_name || '').trim() || technician.email || technician.name || 'Unknown';
                                return ((0, jsx_runtime_1.jsxs)("div", { onClick: function () { return handleTechnicianSelect(technician); }, className: "flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-5 h-5 text-blue-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900 truncate", children: techName }), technician.email && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 truncate mt-1", children: technician.email }))] })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "w-5 h-5 text-gray-400 flex-shrink-0" })] }, techId));
                            })] })), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-blue-900", children: "About Availability" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-blue-700 mt-1", children: "Set recurring weekly availability patterns for each technician. These patterns determine when technicians are available for job assignments." })] })] }) })] })] }));
}
