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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServiceScheduling;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var react_query_1 = require("@tanstack/react-query");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var supabase_client_1 = require("@/lib/supabase-client");
var lucide_react_1 = require("lucide-react");
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Textarea_1 = __importDefault(require("@/components/ui/Textarea"));
var Select_1 = __importDefault(require("@/components/ui/Select"));
var CustomerSearchSelector_1 = __importDefault(require("@/components/ui/CustomerSearchSelector"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Dialog_1 = require("@/components/ui/Dialog");
function ServiceScheduling() {
    var _this = this;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _a = (0, react_1.useState)(false), isAddingSchedule = _a[0], setIsAddingSchedule = _a[1];
    var _b = (0, react_1.useState)(null), editingSchedule = _b[0], setEditingSchedule = _b[1];
    var _c = (0, react_1.useState)(new Date().toISOString().split('T')[0]), selectedDate = _c[0], setSelectedDate = _c[1];
    var _d = (0, react_1.useState)('all'), selectedTechnician = _d[0], setSelectedTechnician = _d[1];
    // Fetch service schedules
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['service-schedules', selectedDate, selectedTechnician],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var query, startOfDay, endOfDay, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = supabase_client_1.supabase
                            .from('service_schedules')
                            .select("\n          *,\n          customers (\n            id,\n            name,\n            account_type,\n            address,\n            city,\n            state,\n            zip_code\n          ),\n          service_types (\n            id,\n            type_name,\n            type_code,\n            base_price,\n            estimated_duration\n          ),\n          technicians (\n            id,\n            name,\n            email\n          )\n        ")
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28');
                        // Apply date filter
                        if (selectedDate) {
                            startOfDay = new Date(selectedDate);
                            startOfDay.setHours(0, 0, 0, 0);
                            endOfDay = new Date(selectedDate);
                            endOfDay.setHours(23, 59, 59, 999);
                            query = query.gte('scheduled_date', startOfDay.toISOString())
                                .lte('scheduled_date', endOfDay.toISOString());
                        }
                        // Apply technician filter
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
    }), serviceSchedules = _e.data, loadingSchedules = _e.isLoading;
    // Fetch customers
    var customers = (0, react_query_1.useQuery)({
        queryKey: ['customers-for-scheduling'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('accounts')
                            .select('id, name, account_type, address, city, state, zip_code')
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
                            .eq('status', 'active')
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
    // Fetch service types
    var serviceTypes = (0, react_query_1.useQuery)({
        queryKey: ['service-types-for-scheduling'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_types')
                            .select('*')
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
                            .eq('is_active', true)
                            .order('type_name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
    }).data;
    // Fetch technicians
    var technicians = (0, react_query_1.useQuery)({
        queryKey: ['technicians-for-scheduling'],
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
    // Create schedule mutation
    var createScheduleMutation = (0, react_query_1.useMutation)({
        mutationFn: function (schedule) { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_schedules')
                            .insert(__assign(__assign({}, schedule), { tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28' }))
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['service-schedules'] });
            setIsAddingSchedule(false);
        },
    });
    // Update schedule mutation
    var updateScheduleMutation = (0, react_query_1.useMutation)({
        mutationFn: function (schedule) { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_schedules')
                            .update(schedule)
                            .eq('id', schedule.id)
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['service-schedules'] });
            setEditingSchedule(null);
        },
    });
    // Delete schedule mutation
    var deleteScheduleMutation = (0, react_query_1.useMutation)({
        mutationFn: function (id) { return __awaiter(_this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_schedules')
                            .delete()
                            .eq('id', id)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['service-schedules'] });
        },
    });
    if (loadingSchedules) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" }) }));
    }
    var getStatusColor = function (status) {
        var colors = {
            'scheduled': 'bg-blue-100 text-blue-800',
            'confirmed': 'bg-green-100 text-green-800',
            'in_progress': 'bg-yellow-100 text-yellow-800',
            'completed': 'bg-purple-100 text-purple-800',
            'cancelled': 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-slate-100 text-slate-800';
    };
    var formatTime = function (timeString) {
        return new Date("2000-01-01T".concat(timeString)).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };
    var getTimeSlots = function () {
        var slots = [];
        for (var hour = 6; hour <= 20; hour++) {
            for (var minute = 0; minute < 60; minute += 30) {
                var time = "".concat(hour.toString().padStart(2, '0'), ":").concat(minute.toString().padStart(2, '0'), ":00");
                slots.push(time);
            }
        }
        return slots;
    };
    var timeSlots = getTimeSlots();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-slate-200 rounded-lg", children: (0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-slate-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-slate-900", children: "Service Scheduling" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600", children: "Schedule and manage service appointments for customers" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setIsAddingSchedule(true); }, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }), "Schedule Service"] })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-slate-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "px-6 py-4 border-b border-slate-200", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-slate-900 mb-4", children: "Schedule Filters" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Date" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: selectedDate, onChange: function (e) { return setSelectedDate(e.target.value); }, className: "block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Technician" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedTechnician, onChange: function (e) { return setSelectedTechnician(e.target.value); }, className: "block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Technicians" }), technicians === null || technicians === void 0 ? void 0 : technicians.map(function (technician) { return ((0, jsx_runtime_1.jsx)("option", { value: technician.id, children: technician.name }, technician.id)); })] })] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-slate-200 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-slate-200", children: (0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-medium text-slate-900", children: ["Schedule for ", selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }) : 'Select a date'] }) }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-slate-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-24", children: "Time" }), technicians === null || technicians === void 0 ? void 0 : technicians.map(function (technician) { return ((0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-48", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4 text-slate-400 mr-2" }), technician.name] }) }, technician.id)); })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: timeSlots.map(function (timeSlot) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-slate-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-2 text-sm font-medium text-slate-900 border-r border-slate-200", children: formatTime(timeSlot) }), technicians === null || technicians === void 0 ? void 0 : technicians.map(function (technician) {
                                                var _a, _b;
                                                var schedule = serviceSchedules === null || serviceSchedules === void 0 ? void 0 : serviceSchedules.find(function (s) { return s.technician_id === technician.id &&
                                                    s.scheduled_time === timeSlot &&
                                                    s.status !== 'cancelled'; });
                                                return ((0, jsx_runtime_1.jsx)("td", { className: "px-6 py-2 border-r border-slate-200", children: schedule ? ((0, jsx_runtime_1.jsxs)("div", { className: "p-2 bg-purple-50 border border-purple-200 rounded-md", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-purple-900", children: (_a = schedule.customers) === null || _a === void 0 ? void 0 : _a.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-purple-600", children: (_b = schedule.service_types) === null || _b === void 0 ? void 0 : _b.type_name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mt-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(getStatusColor(schedule.status)), children: schedule.status.replace('_', ' ') }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setEditingSchedule(schedule); }, className: "text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-100", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { className: "h-3 w-3" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return deleteScheduleMutation.mutate(schedule.id); }, className: "text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-3 w-3" }) })] })] })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "h-16 border-2 border-dashed border-slate-300 rounded-md flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-slate-400", children: "Available" }) })) }, technician.id));
                                            })] }, timeSlot)); }) })] }) })] }), (isAddingSchedule || editingSchedule) && ((0, jsx_runtime_1.jsx)(ScheduleForm, { schedule: editingSchedule, customers: customers || [], serviceTypes: serviceTypes || [], technicians: technicians || [], selectedDate: selectedDate || new Date().toISOString().split('T')[0], onSubmit: function (data) {
                    if (editingSchedule) {
                        updateScheduleMutation.mutate(__assign(__assign({}, data), { id: editingSchedule.id }));
                    }
                    else {
                        createScheduleMutation.mutate(data);
                    }
                }, onCancel: function () {
                    setIsAddingSchedule(false);
                    setEditingSchedule(null);
                } }))] }));
}
// Schedule Form Schema
var scheduleSchema = zod_2.z.object({
    customer_id: zod_2.z.string().uuid('Please select a valid customer'),
    service_type_id: zod_2.z.string().min(1, 'Service type is required'),
    technician_id: zod_2.z.string().min(1, 'Technician is required'),
    scheduled_date: zod_2.z.string().min(1, 'Date is required'),
    scheduled_time: zod_2.z.string().min(1, 'Time is required'),
    estimated_duration: zod_2.z.number().min(1, 'Duration must be at least 1 minute'),
    status: zod_2.z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled']).default('scheduled'),
    notes: zod_2.z.string().optional(),
    priority: zod_2.z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    location_notes: zod_2.z.string().optional(),
});
function ScheduleForm(_a) {
    var schedule = _a.schedule, _customers = _a.customers, serviceTypes = _a.serviceTypes, technicians = _a.technicians, selectedDate = _a.selectedDate, onSubmit = _a.onSubmit, onCancel = _a.onCancel;
    var _b = (0, react_1.useState)(true), isOpen = _b[0], setIsOpen = _b[1];
    var _c = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(scheduleSchema),
        defaultValues: {
            customer_id: (schedule === null || schedule === void 0 ? void 0 : schedule.customer_id) || '',
            service_type_id: (schedule === null || schedule === void 0 ? void 0 : schedule.service_type_id) || '',
            technician_id: (schedule === null || schedule === void 0 ? void 0 : schedule.technician_id) || '',
            scheduled_date: (schedule === null || schedule === void 0 ? void 0 : schedule.scheduled_date) || selectedDate,
            scheduled_time: (schedule === null || schedule === void 0 ? void 0 : schedule.scheduled_time) || '09:00:00',
            estimated_duration: (schedule === null || schedule === void 0 ? void 0 : schedule.estimated_duration) || 60,
            status: (schedule === null || schedule === void 0 ? void 0 : schedule.status) || 'scheduled',
            notes: (schedule === null || schedule === void 0 ? void 0 : schedule.notes) || '',
            priority: (schedule === null || schedule === void 0 ? void 0 : schedule.priority) || 'medium',
            location_notes: (schedule === null || schedule === void 0 ? void 0 : schedule.location_notes) || '',
        },
    }), control = _c.control, handleSubmit = _c.handleSubmit, errors = _c.formState.errors, watch = _c.watch, setValue = _c.setValue, reset = _c.reset;
    var selectedServiceType = watch('service_type_id');
    // Update estimated duration when service type changes
    react_1.default.useEffect(function () {
        if (selectedServiceType) {
            var serviceType = serviceTypes.find(function (s) { return s.id === selectedServiceType; });
            if (serviceType) {
                setValue('estimated_duration', serviceType.estimated_duration);
            }
        }
    }, [selectedServiceType, serviceTypes, setValue]);
    var handleFormSubmit = function (data) {
        onSubmit(data);
        setIsOpen(false);
    };
    var handleCancel = function () {
        setIsOpen(false);
        reset();
        onCancel();
    };
    var getTimeSlots = function () {
        var slots = [];
        for (var hour = 6; hour <= 20; hour++) {
            for (var minute = 0; minute < 60; minute += 30) {
                var time = "".concat(hour.toString().padStart(2, '0'), ":").concat(minute.toString().padStart(2, '0'), ":00");
                slots.push(time);
            }
        }
        return slots;
    };
    var timeSlots = getTimeSlots();
    return ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: isOpen, onOpenChange: function (open) { return setIsOpen(open); }, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: schedule ? 'Edit Service Schedule' : 'Schedule New Service' }) }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(handleFormSubmit), className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "col-span-2", children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "customer_id", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { value: field.value, onChange: function (customerId) { return field.onChange(customerId); }, label: "Customer", required: true, showSelectedBox: true, apiSource: "direct", error: (_b = errors.customer_id) === null || _b === void 0 ? void 0 : _b.message, placeholder: "Search customers..." }));
                                        } }) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "service_type_id", control: control, render: function (_a) {
                                        var _b;
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)(Select_1.default, __assign({ label: "Service Type *", value: field.value, onChange: function (value) { return field.onChange(value); }, options: __spreadArray([
                                                { value: '', label: 'Select Service' }
                                            ], serviceTypes.map(function (serviceType) { return ({
                                                value: serviceType.id,
                                                label: "".concat(serviceType.type_name, " ($").concat(serviceType.base_price, ")"),
                                            }); }), true) }, (((_b = errors.service_type_id) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.service_type_id.message } : {}))));
                                    } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "scheduled_date", control: control, render: function (_a) {
                                        var _b;
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Date *", type: "date", value: field.value, onChange: function (e) { return field.onChange(e.target.value); } }, (((_b = errors.scheduled_date) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.scheduled_date.message } : {}))));
                                    } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "scheduled_time", control: control, render: function (_a) {
                                        var _b;
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)(Select_1.default, __assign({ label: "Time *", value: field.value, onChange: function (value) { return field.onChange(value); }, options: timeSlots.map(function (time) { return ({
                                                value: time,
                                                label: new Date("2000-01-01T".concat(time)).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                }),
                                            }); }) }, (((_b = errors.scheduled_time) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.scheduled_time.message } : {}))));
                                    } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "estimated_duration", control: control, render: function (_a) {
                                        var _b;
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Duration (min) *", type: "number", min: "1", value: field.value.toString(), onChange: function (e) { return field.onChange(parseInt(e.target.value) || 60); } }, (((_b = errors.estimated_duration) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.estimated_duration.message } : {}))));
                                    } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "technician_id", control: control, render: function (_a) {
                                        var _b;
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)(Select_1.default, __assign({ label: "Technician *", value: field.value, onChange: function (value) { return field.onChange(value); }, options: __spreadArray([
                                                { value: '', label: 'Select Technician' }
                                            ], technicians.map(function (technician) { return ({
                                                value: technician.id,
                                                label: technician.name,
                                            }); }), true) }, (((_b = errors.technician_id) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.technician_id.message } : {}))));
                                    } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "priority", control: control, render: function (_a) {
                                        var _b;
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)(Select_1.default, __assign({ label: "Priority *", value: field.value, onChange: function (value) { return field.onChange(value); }, options: [
                                                { value: 'low', label: 'Low' },
                                                { value: 'medium', label: 'Medium' },
                                                { value: 'high', label: 'High' },
                                                { value: 'urgent', label: 'Urgent' },
                                            ] }, (((_b = errors.priority) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.priority.message } : {}))));
                                    } })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "notes", control: control, render: function (_a) {
                                var _b;
                                var field = _a.field;
                                return ((0, jsx_runtime_1.jsx)(Textarea_1.default, __assign({ label: "Notes", value: field.value || '', onChange: function (e) { return field.onChange(e.target.value); }, rows: 3, placeholder: "Service notes, special instructions..." }, (((_b = errors.notes) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.notes.message } : {}))));
                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "location_notes", control: control, render: function (_a) {
                                var _b;
                                var field = _a.field;
                                return ((0, jsx_runtime_1.jsx)(Textarea_1.default, __assign({ label: "Location Notes", value: field.value || '', onChange: function (e) { return field.onChange(e.target.value); }, rows: 2, placeholder: "Access instructions, parking info..." }, (((_b = errors.location_notes) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.location_notes.message } : {}))));
                            } }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "outline", onClick: handleCancel, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", children: schedule ? 'Update Schedule' : 'Schedule Service' })] })] })] }) }));
}
