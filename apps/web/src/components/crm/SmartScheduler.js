"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SmartScheduler;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
function SmartScheduler(_a) {
    var customerId = _a.customerId;
    var _b = (0, react_1.useState)(''), selectedDate = _b[0], setSelectedDate = _b[1];
    var _c = (0, react_1.useState)(''), selectedTime = _c[0], setSelectedTime = _c[1];
    var _d = (0, react_1.useState)(''), selectedService = _d[0], setSelectedService = _d[1];
    var _e = (0, react_1.useState)(''), selectedTechnician = _e[0], setSelectedTechnician = _e[1];
    var _f = (0, react_1.useState)(false), showSchedulingModal = _f[0], setShowSchedulingModal = _f[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Mock data for demonstration
    var technicians = [
        {
            id: 'tech-1',
            name: 'John Smith',
            skills: ['termite', 'ant', 'rodent'],
            rating: 4.8,
            availability: []
        },
        {
            id: 'tech-2',
            name: 'Sarah Johnson',
            skills: ['spider', 'mosquito', 'prevention'],
            rating: 4.9,
            availability: []
        }
    ];
    var serviceTypes = [
        {
            id: 'service-1',
            name: 'General Pest Control',
            duration: 90,
            requiredSkills: ['ant', 'spider'],
            estimatedCost: 150
        },
        {
            id: 'service-2',
            name: 'Termite Treatment',
            duration: 120,
            requiredSkills: ['termite'],
            estimatedCost: 300
        },
        {
            id: 'service-3',
            name: 'Rodent Control',
            duration: 60,
            requiredSkills: ['rodent'],
            estimatedCost: 200
        }
    ];
    // Schedule service mutation
    var scheduleService = (0, react_query_1.useMutation)({
        mutationFn: function (_data) {
            // Mock API call
            return Promise.resolve({ success: true });
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['crm', 'customer', customerId, 'service-history'] });
            setShowSchedulingModal(false);
        },
    });
    // Mock AI recommendations
    var aiRecommendations = {
        optimalDate: '2024-02-01',
        optimalTime: '09:00',
        recommendedTechnician: 'tech-1',
        routeOptimization: 'Can be combined with nearby jobs',
        weatherForecast: 'Sunny, 75°F - Optimal for outdoor treatments',
        seasonalFactors: 'Peak ant season - Recommend preventive treatment',
        estimatedDuration: 90,
        costSavings: 25
    };
    var getTechnicianRating = function (rating) {
        var stars = [];
        for (var i = 1; i <= 5; i++) {
            stars.push((0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-4 w-4 ".concat(i <= rating ? 'text-yellow-400 fill-current' : 'text-slate-300') }, i));
        }
        return stars;
    };
    var handleSchedule = function () {
        if (selectedDate && selectedTime && selectedService && selectedTechnician) {
            scheduleService.mutate({
                customerId: customerId,
                serviceTypeId: selectedService,
                technicianId: selectedTechnician,
                scheduledDate: selectedDate,
                scheduledTime: selectedTime,
            });
        }
    };
    var availableTimeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
    ];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-slate-900", children: "Smart Scheduler" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", onClick: function () { return setShowSchedulingModal(true); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4 mr-1" }), "Schedule Service"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-5 w-5 text-green-600" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: "AI Recommendations" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-3 rounded-lg border", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-1", children: "Optimal Date" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-green-900 font-semibold", children: aiRecommendations.optimalDate })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-3 rounded-lg border", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-1", children: "Optimal Time" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-blue-900 font-semibold", children: aiRecommendations.optimalTime })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-3 rounded-lg border", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-1", children: "Duration" }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "text-purple-900 font-semibold", children: [aiRecommendations.estimatedDuration, " min"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Route, { className: "h-4 w-4 text-blue-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-900", children: aiRecommendations.routeOptimization })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-900", children: aiRecommendations.weatherForecast })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-orange-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-900", children: aiRecommendations.seasonalFactors })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900 mb-4", children: "Available Technicians" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: technicians.map(function (tech) { return ((0, jsx_runtime_1.jsxs)("div", { className: "border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer", onClick: function () {
                                        setSelectedTechnician(tech.id);
                                        setShowSchedulingModal(true);
                                    }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: tech.name }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1", children: getTechnicianRating(tech.rating) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1 mb-3", children: tech.skills.map(function (skill) { return ((0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", children: skill }, skill)); }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-slate-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Available today" })] })] }, tech.id)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900 mb-4", children: "Service Types" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: serviceTypes.map(function (service) { return ((0, jsx_runtime_1.jsxs)("div", { className: "border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer", onClick: function () {
                                        setSelectedService(service.id);
                                        setShowSchedulingModal(true);
                                    }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: service.name }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "text-green-600 font-semibold", children: ["$", service.estimatedCost] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-slate-400" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-slate-600", children: [service.duration, " minutes"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", children: service.requiredSkills.map(function (skill) { return ((0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", children: skill }, skill)); }) })] }, service.id)); }) })] })] }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showSchedulingModal, onOpenChange: function (open) { return !open && setShowSchedulingModal(false); }, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(ui_1.DialogTitle, { children: "Schedule Service" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "crm-label !mb-1", children: "Service Type" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedService, onChange: function (e) { return setSelectedService(e.target.value); }, className: "crm-select", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select service type" }), serviceTypes.map(function (service) { return ((0, jsx_runtime_1.jsxs)("option", { value: service.id, children: [service.name, " - $", service.estimatedCost] }, service.id)); })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "crm-label !mb-1", children: "Date" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: selectedDate, onChange: function (e) { return setSelectedDate(e.target.value); }, className: "crm-input" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "crm-label !mb-1", children: "Time" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedTime, onChange: function (e) { return setSelectedTime(e.target.value); }, className: "crm-select", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select time" }), availableTimeSlots.map(function (time) { return ((0, jsx_runtime_1.jsx)("option", { value: time, children: time }, time)); })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "crm-label !mb-1", children: "Technician" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedTechnician, onChange: function (e) { return setSelectedTechnician(e.target.value); }, className: "crm-select", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select technician" }), technicians.map(function (tech) { return ((0, jsx_runtime_1.jsxs)("option", { value: tech.id, children: [tech.name, " - ", tech.rating, "/5 stars"] }, tech.id)); })] })] }), selectedDate && selectedTime && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-blue-800 mb-2", children: "AI Insights" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-500" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", children: ["Optimal weather conditions for ", selectedDate] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4 text-blue-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Route optimized - 15% time savings" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-4 w-4 text-yellow-500" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", children: ["$", aiRecommendations.costSavings, " potential savings with bundle"] })] })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 justify-end", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowSchedulingModal(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handleSchedule, disabled: !selectedDate || !selectedTime || !selectedService || !selectedTechnician || scheduleService.isPending, children: scheduleService.isPending ? 'Scheduling...' : 'Schedule Service' })] })] })] }) })] }));
}
