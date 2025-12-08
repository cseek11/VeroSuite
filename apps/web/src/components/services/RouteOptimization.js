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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RouteOptimization;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var supabase_client_1 = require("@/lib/supabase-client");
var lucide_react_1 = require("lucide-react");
function RouteOptimization() {
    var _this = this;
    var _a = (0, react_1.useState)(new Date().toISOString().split('T')[0]), selectedDate = _a[0], setSelectedDate = _a[1];
    var _b = (0, react_1.useState)('all'), selectedTechnician = _b[0], setSelectedTechnician = _b[1];
    var _c = (0, react_1.useState)('nearest_neighbor'), optimizationMethod = _c[0], setOptimizationMethod = _c[1];
    // Fetch service schedules for the selected date
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['service-schedules-for-routing', selectedDate, selectedTechnician],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var query, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = supabase_client_1.supabase
                            .from('service_schedules')
                            .select("\n          *,\n          customers (\n            id,\n            name,\n            address,\n            city,\n            state,\n            zip_code,\n            account_type\n          ),\n          service_types (\n            id,\n            type_name,\n            estimated_duration\n          ),\n          technicians (\n            id,\n            name,\n            email\n          )\n        ")
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
                            .eq('scheduled_date', selectedDate)
                            .in('status', ['scheduled', 'confirmed']);
                        if (selectedTechnician !== 'all') {
                            query = query.eq('technician_id', selectedTechnician);
                        }
                        query = query.order('scheduled_time');
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
    }), serviceSchedules = _d.data, loadingSchedules = _d.isLoading;
    // Fetch technicians for filter
    var technicians = (0, react_query_1.useQuery)({
        queryKey: ['technicians-for-routing'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('technicians')
                            .select('*')
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
                            .eq('is_active', true)
                            .order('name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
    }).data;
    // Optimize routes based on selected method
    var optimizedRoutes = (0, react_1.useMemo)(function () {
        if (!serviceSchedules || !technicians)
            return [];
        var routes = [];
        var technicianIds = selectedTechnician === 'all'
            ? technicians.map(function (t) { return t.id; })
            : [selectedTechnician];
        technicianIds.forEach(function (technicianId) {
            var technician = technicians.find(function (t) { return t.id === technicianId; });
            if (!technician)
                return;
            var technicianSchedules = serviceSchedules.filter(function (s) { return s.technician_id === technicianId; });
            if (technicianSchedules.length === 0)
                return;
            var stops = technicianSchedules.map(function (schedule) {
                var _a, _b, _c, _d, _e, _f, _g;
                return ({
                    customer_id: schedule.customer_id,
                    customer_name: ((_a = schedule.customers) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
                    address: "".concat((_b = schedule.customers) === null || _b === void 0 ? void 0 : _b.address, ", ").concat((_c = schedule.customers) === null || _c === void 0 ? void 0 : _c.city, ", ").concat((_d = schedule.customers) === null || _d === void 0 ? void 0 : _d.state, " ").concat((_e = schedule.customers) === null || _e === void 0 ? void 0 : _e.zip_code),
                    scheduled_time: schedule.scheduled_time,
                    service_type: ((_f = schedule.service_types) === null || _f === void 0 ? void 0 : _f.type_name) || 'Unknown',
                    estimated_duration: ((_g = schedule.service_types) === null || _g === void 0 ? void 0 : _g.estimated_duration) || 60,
                    priority: schedule.priority,
                    sequence: 0,
                });
            });
            // Apply optimization algorithm
            stops = optimizeRoute(stops, optimizationMethod);
            // Calculate totals
            var totalDuration = stops.reduce(function (sum, stop) { return sum + stop.estimated_duration; }, 0);
            var totalRevenue = stops.reduce(function (sum, _stop) {
                // Mock revenue calculation - replace with actual pricing logic
                return sum + 150; // Assume $150 per service
            }, 0);
            routes.push({
                technician_id: technician.id,
                technician_name: technician.name,
                stops: stops,
                total_distance: calculateTotalDistance(stops), // Mock distance calculation
                total_duration: totalDuration,
                total_revenue: totalRevenue,
            });
        });
        return routes;
    }, [serviceSchedules, technicians, selectedTechnician, optimizationMethod]);
    var optimizeRoute = function (stops, method) {
        switch (method) {
            case 'nearest_neighbor':
                return optimizeNearestNeighbor(stops);
            case 'priority_based':
                return optimizePriorityBased(stops);
            case 'time_windows':
                return optimizeTimeWindows(stops);
            default:
                return stops;
        }
    };
    var optimizeNearestNeighbor = function (stops) {
        // Simple nearest neighbor algorithm
        // In a real implementation, this would use actual coordinates and distance calculations
        var optimized = __spreadArray([], stops, true);
        for (var i = 0; i < optimized.length - 1; i++) {
            // Mock optimization - in reality, this would calculate actual distances
            if (Math.random() > 0.5) {
                var current = optimized[i];
                var nextStop = optimized[i + 1];
                if (!current || !nextStop)
                    continue;
                optimized[i + 1] = current;
                optimized[i] = nextStop;
            }
        }
        return optimized.map(function (stop, index) { return (__assign(__assign({}, stop), { sequence: index + 1 })); });
    };
    var optimizePriorityBased = function (stops) {
        var priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return __spreadArray([], stops, true).sort(function (a, b) { return priorityOrder[b.priority] - priorityOrder[a.priority]; })
            .map(function (stop, index) { return (__assign(__assign({}, stop), { sequence: index + 1 })); });
    };
    var optimizeTimeWindows = function (stops) {
        return __spreadArray([], stops, true).sort(function (a, b) { return a.scheduled_time.localeCompare(b.scheduled_time); })
            .map(function (stop, index) { return (__assign(__assign({}, stop), { sequence: index + 1 })); });
    };
    var calculateTotalDistance = function (stops) {
        // Mock distance calculation - replace with actual distance API calls
        return stops.length * 5.2; // Assume 5.2 miles between stops on average
    };
    var formatTime = function (timeString) {
        return new Date("2000-01-01T".concat(timeString)).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };
    var getPriorityColor = function (priority) {
        var colors = {
            'low': 'bg-gray-100 text-gray-800',
            'medium': 'bg-blue-100 text-blue-800',
            'high': 'bg-orange-100 text-orange-800',
            'urgent': 'bg-red-100 text-red-800',
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };
    if (loadingSchedules) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg", children: (0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Route Optimization" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Optimize technician routes for efficient service delivery" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-purple-600", children: optimizedRoutes.reduce(function (sum, route) { return sum + route.stops.length; }, 0) }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "Total Stops" })] })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "px-6 py-4 border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Optimization Settings" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Date" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: selectedDate, onChange: function (e) { return setSelectedDate(e.target.value); }, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Technician" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedTechnician, onChange: function (e) { return setSelectedTechnician(e.target.value); }, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Technicians" }), technicians === null || technicians === void 0 ? void 0 : technicians.map(function (technician) { return ((0, jsx_runtime_1.jsx)("option", { value: technician.id, children: technician.name }, technician.id)); })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Optimization Method" }), (0, jsx_runtime_1.jsxs)("select", { value: optimizationMethod, onChange: function (e) { return setOptimizationMethod(e.target.value); }, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "nearest_neighbor", children: "Nearest Neighbor" }), (0, jsx_runtime_1.jsx)("option", { value: "priority_based", children: "Priority Based" }), (0, jsx_runtime_1.jsx)("option", { value: "time_windows", children: "Time Windows" })] })] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Truck, { className: "h-8 w-8 text-blue-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-gray-900", children: optimizedRoutes.reduce(function (sum, route) { return sum + route.total_distance; }, 0).toFixed(1) }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "Total Miles" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-8 w-8 text-green-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-gray-900", children: Math.round(optimizedRoutes.reduce(function (sum, route) { return sum + route.total_duration; }, 0) / 60) }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "Total Hours" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Calculator, { className: "h-8 w-8 text-purple-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-gray-900", children: ["$", optimizedRoutes.reduce(function (sum, route) { return sum + route.total_revenue; }, 0).toLocaleString()] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "Total Revenue" })] })] }) })] }), optimizedRoutes.map(function (route) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-5 w-5 text-gray-400 mr-2" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: route.technician_name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 text-sm text-gray-500", children: [(0, jsx_runtime_1.jsxs)("span", { children: [route.stops.length, " stops"] }), (0, jsx_runtime_1.jsxs)("span", { children: [route.total_distance.toFixed(1), " miles"] }), (0, jsx_runtime_1.jsxs)("span", { children: [Math.round(route.total_duration / 60), " hours"] }), (0, jsx_runtime_1.jsxs)("span", { children: ["$", route.total_revenue.toLocaleString()] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16", children: "#" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Customer" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Address" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Time" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Service" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Duration" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Priority" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: route.stops.map(function (stop) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: stop.sequence }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: stop.customer_name }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-sm text-gray-500 max-w-xs truncate", children: stop.address }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: formatTime(stop.scheduled_time) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: stop.service_type }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [stop.estimated_duration, " min"] }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(getPriorityColor(stop.priority)), children: stop.priority }) })] }, stop.customer_id)); }) })] }) })] }, route.technician_id)); }), optimizedRoutes.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-12 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Map, { className: "mx-auto h-12 w-12 text-gray-400" }), (0, jsx_runtime_1.jsx)("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No routes to optimize" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-500", children: "No scheduled services found for the selected date and technician." })] })), (0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-blue-900 mb-2", children: "Optimization Notes" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-blue-800 space-y-2", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Nearest Neighbor:" }), " Routes are optimized to minimize travel distance between consecutive stops."] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Priority Based:" }), " Routes prioritize urgent and high-priority services first."] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Time Windows:" }), " Routes respect scheduled appointment times and optimize for time efficiency."] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs mt-4", children: "Note: This is a basic optimization implementation. For production use, integrate with mapping APIs (Google Maps, Mapbox) for accurate distance calculations and real-time traffic data." })] })] })] }));
}
