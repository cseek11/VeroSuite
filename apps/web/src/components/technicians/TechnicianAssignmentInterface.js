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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TechnicianAssignmentInterface;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useTechnicians_1 = require("@/hooks/useTechnicians");
var technician_1 = require("@/types/technician");
var lucide_react_1 = require("lucide-react");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var Dialog_1 = require("@/components/ui/Dialog");
function TechnicianAssignmentInterface(_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var workOrder = _a.workOrder, selectedDate = _a.selectedDate, selectedTimeSlot = _a.selectedTimeSlot, _onTechnicianSelect = _a.onTechnicianSelect, onAssignmentComplete = _a.onAssignmentComplete, _j = _a.mode, _mode = _j === void 0 ? 'work-order' : _j;
    var _k = (0, react_1.useState)(''), searchTerm = _k[0], setSearchTerm = _k[1];
    var _l = (0, react_1.useState)(''), filterStatus = _l[0], setFilterStatus = _l[1];
    var _m = (0, react_1.useState)('score'), sortBy = _m[0], setSortBy = _m[1];
    var _o = (0, react_1.useState)(null), selectedTechnician = _o[0], setSelectedTechnician = _o[1];
    var _p = (0, react_1.useState)(false), showAssignmentDialog = _p[0], setShowAssignmentDialog = _p[1];
    var _q = (0, react_1.useState)(''), assignmentNotes = _q[0], setAssignmentNotes = _q[1];
    var technicianQueryParams = __assign(__assign({}, (filterStatus ? { status: filterStatus } : {})), { limit: 50 });
    var _r = (0, useTechnicians_1.useTechnicians)(technicianQueryParams), techniciansData = _r.data, techniciansLoading = _r.isLoading;
    // Get jobs for all technicians to check availability
    var technicians = (techniciansData === null || techniciansData === void 0 ? void 0 : techniciansData.technicians) || [];
    // Calculate availability and conflicts for each technician
    var techniciansWithAvailability = (0, react_1.useMemo)(function () {
        if (!technicians.length || !selectedDate || !selectedTimeSlot) {
            return technicians.map(function (tech) { return (__assign(__assign({}, tech), { availability: {
                    isAvailable: false,
                    currentWorkload: 0,
                    maxWorkload: 8, // 8 hours default
                    skills: [],
                    certifications: [],
                    location: { lat: 0, lng: 0, address: '' },
                    estimatedTravelTime: 0
                }, conflicts: [], score: 0 })); });
        }
        return technicians.map(function (technician) {
            var availability = calculateAvailability(technician, selectedDate, selectedTimeSlot);
            var conflicts = detectConflicts(technician, selectedDate, selectedTimeSlot, workOrder);
            var score = calculateAssignmentScore(technician, availability, conflicts);
            return __assign(__assign({}, technician), { availability: availability, conflicts: conflicts, score: score });
        });
    }, [technicians, selectedDate, selectedTimeSlot, workOrder]);
    // Filter and sort technicians
    var filteredAndSortedTechnicians = (0, react_1.useMemo)(function () {
        var filtered = techniciansWithAvailability;
        // Apply search filter
        if (searchTerm) {
            var searchLower_1 = searchTerm.toLowerCase();
            filtered = filtered.filter(function (tech) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return ((_b = (_a = tech.user) === null || _a === void 0 ? void 0 : _a.first_name) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower_1)) ||
                    ((_d = (_c = tech.user) === null || _c === void 0 ? void 0 : _c.last_name) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchLower_1)) ||
                    ((_f = (_e = tech.user) === null || _e === void 0 ? void 0 : _e.email) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes(searchLower_1)) ||
                    ((_g = tech.position) === null || _g === void 0 ? void 0 : _g.toLowerCase().includes(searchLower_1)) ||
                    ((_h = tech.department) === null || _h === void 0 ? void 0 : _h.toLowerCase().includes(searchLower_1));
            });
        }
        // Apply status filter
        if (filterStatus) {
            filtered = filtered.filter(function (tech) { return tech.status === filterStatus; });
        }
        // Sort technicians
        filtered.sort(function (a, b) {
            var _a, _b, _c, _d;
            switch (sortBy) {
                case 'score':
                    return b.score - a.score;
                case 'workload':
                    return a.availability.currentWorkload - b.availability.currentWorkload;
                case 'distance':
                    return a.availability.estimatedTravelTime - b.availability.estimatedTravelTime;
                case 'name':
                    return "".concat((_a = a.user) === null || _a === void 0 ? void 0 : _a.first_name, " ").concat((_b = a.user) === null || _b === void 0 ? void 0 : _b.last_name).localeCompare("".concat((_c = b.user) === null || _c === void 0 ? void 0 : _c.first_name, " ").concat((_d = b.user) === null || _d === void 0 ? void 0 : _d.last_name));
                default:
                    return 0;
            }
        });
        return filtered;
    }, [techniciansWithAvailability, searchTerm, filterStatus, sortBy]);
    // Calculate technician availability
    var calculateAvailability = function (technician, _date, _timeSlot) {
        // Mock implementation - in real app, this would check actual schedules
        var isAvailable = technician.status === technician_1.TechnicianStatus.ACTIVE;
        var currentWorkload = Math.floor(Math.random() * 6) + 2; // 2-8 hours
        var maxWorkload = 8;
        var skills = ['General Pest Control', 'Termite Treatment', 'Rodent Control'];
        var certifications = ['Pesticide License', 'Safety Certification'];
        var location = {
            lat: 40.4406 + (Math.random() - 0.5) * 0.1,
            lng: -79.9959 + (Math.random() - 0.5) * 0.1,
            address: 'Pittsburgh, PA'
        };
        var estimatedTravelTime = Math.floor(Math.random() * 30) + 10; // 10-40 minutes
        return {
            isAvailable: isAvailable,
            currentWorkload: currentWorkload,
            maxWorkload: maxWorkload,
            skills: skills,
            certifications: certifications,
            location: location,
            estimatedTravelTime: estimatedTravelTime
        };
    };
    // Detect conflicts for technician assignment
    var detectConflicts = function (technician, date, timeSlot, workOrder) {
        var conflicts = [];
        // Check if technician is available
        if (technician.status !== technician_1.TechnicianStatus.ACTIVE) {
            conflicts.push({
                type: 'time',
                severity: 'high',
                message: 'Technician is not active'
            });
        }
        // Check workload
        var availability = calculateAvailability(technician, date, timeSlot);
        if (availability.currentWorkload >= availability.maxWorkload) {
            conflicts.push({
                type: 'workload',
                severity: 'high',
                message: 'Technician is at maximum workload'
            });
        }
        else if (availability.currentWorkload >= availability.maxWorkload * 0.8) {
            conflicts.push({
                type: 'workload',
                severity: 'medium',
                message: 'Technician has high workload'
            });
        }
        // Check skills match
        if (workOrder === null || workOrder === void 0 ? void 0 : workOrder.service_type) {
            var hasRequiredSkill = availability.skills.some(function (skill) {
                return skill.toLowerCase().includes(workOrder.service_type.toLowerCase());
            });
            if (!hasRequiredSkill) {
                conflicts.push({
                    type: 'skill',
                    severity: 'medium',
                    message: "Technician may not have required skills for ".concat(workOrder.service_type)
                });
            }
        }
        // Check travel time
        if (availability.estimatedTravelTime > 45) {
            conflicts.push({
                type: 'location',
                severity: 'low',
                message: "Long travel time: ".concat(availability.estimatedTravelTime, " minutes")
            });
        }
        return conflicts;
    };
    // Calculate assignment score
    var calculateAssignmentScore = function (technician, availability, conflicts) {
        var score = 100;
        // Deduct points for conflicts
        conflicts.forEach(function (conflict) {
            switch (conflict.severity) {
                case 'high':
                    score -= 30;
                    break;
                case 'medium':
                    score -= 15;
                    break;
                case 'low':
                    score -= 5;
                    break;
            }
        });
        // Bonus for low workload
        var workloadRatio = availability.currentWorkload / availability.maxWorkload;
        if (workloadRatio < 0.5) {
            score += 10;
        }
        else if (workloadRatio < 0.8) {
            score += 5;
        }
        // Bonus for short travel time
        if (availability.estimatedTravelTime < 20) {
            score += 10;
        }
        else if (availability.estimatedTravelTime < 30) {
            score += 5;
        }
        // Bonus for active status
        if (technician.status === technician_1.TechnicianStatus.ACTIVE) {
            score += 5;
        }
        return Math.max(0, Math.min(100, score));
    };
    // Handle technician selection
    var handleTechnicianSelect = function (technician) {
        setSelectedTechnician(technician);
        setShowAssignmentDialog(true);
    };
    // Handle assignment completion
    var handleAssignmentComplete = function () {
        if (!selectedTechnician || !selectedDate || !selectedTimeSlot)
            return;
        var technicianWithAvailability = techniciansWithAvailability.find(function (t) { return t.id === selectedTechnician.id; });
        if (technicianWithAvailability) {
            var assignment = __assign(__assign({ technician: selectedTechnician }, (workOrder ? { workOrder: workOrder } : {})), { scheduledDate: selectedDate, timeSlot: selectedTimeSlot, conflicts: technicianWithAvailability.conflicts, availability: technicianWithAvailability.availability });
            onAssignmentComplete === null || onAssignmentComplete === void 0 ? void 0 : onAssignmentComplete(assignment);
            setShowAssignmentDialog(false);
            setSelectedTechnician(null);
            setAssignmentNotes('');
        }
    };
    // Get conflict severity color
    var getConflictColor = function (severity) {
        switch (severity) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            case 'low': return 'text-blue-600 bg-blue-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };
    // Get score color
    var getScoreColor = function (score) {
        if (score >= 80)
            return 'text-green-600 bg-green-50';
        if (score >= 60)
            return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };
    if (techniciansLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading technicians..." }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Technician Assignment" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Select the best technician for this assignment" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: [filteredAndSortedTechnicians.length, " technician(s) available"] })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col lg:flex-row gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { placeholder: "Search technicians...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("select", { value: filterStatus, onChange: function (e) { return setFilterStatus(e.target.value); }, className: "crm-input", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Statuses" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.TechnicianStatus.ACTIVE, children: "Active" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.TechnicianStatus.INACTIVE, children: "Inactive" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.TechnicianStatus.ON_LEAVE, children: "On Leave" })] }), (0, jsx_runtime_1.jsxs)("select", { value: sortBy, onChange: function (e) { return setSortBy(e.target.value); }, className: "crm-input", children: [(0, jsx_runtime_1.jsx)("option", { value: "score", children: "Best Match" }), (0, jsx_runtime_1.jsx)("option", { value: "workload", children: "Lowest Workload" }), (0, jsx_runtime_1.jsx)("option", { value: "distance", children: "Closest Distance" }), (0, jsx_runtime_1.jsx)("option", { value: "name", children: "Name" })] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredAndSortedTechnicians.map(function (technician) {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6 hover:shadow-lg transition-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-lg font-medium text-purple-600", children: [(_b = (_a = technician.user) === null || _a === void 0 ? void 0 : _a.first_name) === null || _b === void 0 ? void 0 : _b[0], (_d = (_c = technician.user) === null || _c === void 0 ? void 0 : _c.last_name) === null || _d === void 0 ? void 0 : _d[0]] }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "font-semibold text-gray-900", children: [(_e = technician.user) === null || _e === void 0 ? void 0 : _e.first_name, " ", (_f = technician.user) === null || _f === void 0 ? void 0 : _f.last_name] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: technician.position })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "px-2 py-1 rounded-full text-xs font-medium ".concat(getScoreColor(technician.score)), children: [technician.score, "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Workload:" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-medium", children: [technician.availability.currentWorkload, "h / ", technician.availability.maxWorkload, "h"] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 bg-gray-200 rounded-full h-2 ml-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-blue-500 h-2 rounded-full", style: {
                                                        width: "".concat((technician.availability.currentWorkload / technician.availability.maxWorkload) * 100, "%")
                                                    } }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Navigation, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Travel Time:" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-medium", children: [technician.availability.estimatedTravelTime, " min"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Award, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Skills:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: technician.availability.skills.length })] })] }), technician.conflicts.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-700 mb-2", children: "Conflicts:" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [technician.conflicts.slice(0, 2).map(function (conflict, index) { return ((0, jsx_runtime_1.jsx)("div", { className: "px-2 py-1 rounded text-xs ".concat(getConflictColor(conflict.severity)), children: conflict.message }, index)); }), technician.conflicts.length > 2 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: ["+", technician.conflicts.length - 2, " more conflicts"] }))] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-700 mb-2", children: "Skills:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-1", children: [technician.availability.skills.slice(0, 3).map(function (skill, index) { return ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full", children: skill }, index)); }), technician.availability.skills.length > 3 && ((0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full", children: ["+", technician.availability.skills.length - 3] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 mb-4", children: [((_g = technician.user) === null || _g === void 0 ? void 0 : _g.phone) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-3 w-3" }), technician.user.phone] })), ((_h = technician.user) === null || _h === void 0 ? void 0 : _h.email) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-3 w-3" }), technician.user.email] }))] }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return handleTechnicianSelect(technician); }, variant: "primary", className: "w-full", disabled: !technician.availability.isAvailable, children: technician.availability.isAvailable ? 'Assign' : 'Not Available' })] }, technician.id));
                }) }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showAssignmentDialog, onOpenChange: setShowAssignmentDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Confirm Technician Assignment" }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: "Review the assignment details before confirming" })] }), selectedTechnician && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 p-4 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-xl font-medium text-purple-600", children: [(_c = (_b = selectedTechnician.user) === null || _b === void 0 ? void 0 : _b.first_name) === null || _c === void 0 ? void 0 : _c[0], (_e = (_d = selectedTechnician.user) === null || _d === void 0 ? void 0 : _d.last_name) === null || _e === void 0 ? void 0 : _e[0]] }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-gray-900", children: [(_f = selectedTechnician.user) === null || _f === void 0 ? void 0 : _f.first_name, " ", (_g = selectedTechnician.user) === null || _g === void 0 ? void 0 : _g.last_name] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: selectedTechnician.position }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: selectedTechnician.department })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Scheduled Date" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900", children: selectedDate })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Time Slot" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-900", children: [selectedTimeSlot === null || selectedTimeSlot === void 0 ? void 0 : selectedTimeSlot.start, " - ", selectedTimeSlot === null || selectedTimeSlot === void 0 ? void 0 : selectedTimeSlot.end] })] })] }), workOrder && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Work Order" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900", children: workOrder.description }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500", children: ["Customer: ", (_h = workOrder.account) === null || _h === void 0 ? void 0 : _h.name] })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Assignment Notes (Optional)" }), (0, jsx_runtime_1.jsx)("textarea", { value: assignmentNotes, onChange: function (e) { return setAssignmentNotes(e.target.value); }, rows: 3, className: "crm-textarea", placeholder: "Add any special instructions or notes for this assignment..." })] })] })), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowAssignmentDialog(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: handleAssignmentComplete, children: "Confirm Assignment" })] })] }) })] }));
}
