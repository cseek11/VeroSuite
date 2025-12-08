"use strict";
/**
 * Shared utilities for scheduling components
 * Last Updated: 2025-12-08
 */
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
exports.getDateRangeStart = getDateRangeStart;
exports.getDateRangeEnd = getDateRangeEnd;
exports.getJobColor = getJobColor;
exports.getConflictBorderColor = getConflictBorderColor;
exports.formatTime = formatTime;
exports.formatDate = formatDate;
exports.timeRangesOverlap = timeRangesOverlap;
exports.calculateDurationMinutes = calculateDurationMinutes;
exports.parseTimeString = parseTimeString;
exports.filterJobs = filterJobs;
exports.sortJobsByDateTime = sortJobsByDateTime;
exports.getTechnicianName = getTechnicianName;
exports.getTechnicianById = getTechnicianById;
/**
 * Get date range start based on view type
 */
function getDateRangeStart(date, view) {
    var d = new Date(date);
    switch (view) {
        case 'month':
            d.setDate(1);
            d.setHours(0, 0, 0, 0);
            return d;
        case 'week':
            var day = d.getDay();
            d.setDate(d.getDate() - day);
            d.setHours(0, 0, 0, 0);
            return d;
        case 'day':
            d.setHours(0, 0, 0, 0);
            return d;
        case 'list':
            // For list view, show a wider range (30 days back)
            d.setDate(d.getDate() - 30);
            d.setHours(0, 0, 0, 0);
            return d;
        default:
            return d;
    }
}
/**
 * Get date range end based on view type
 */
function getDateRangeEnd(date, view) {
    var d = new Date(date);
    switch (view) {
        case 'month':
            d.setMonth(d.getMonth() + 1);
            d.setDate(0);
            d.setHours(23, 59, 59, 999);
            return d;
        case 'week':
            d.setDate(d.getDate() - d.getDay() + 6);
            d.setHours(23, 59, 59, 999);
            return d;
        case 'day':
            d.setHours(23, 59, 59, 999);
            return d;
        case 'list':
            // For list view, show a wider range (30 days forward)
            d.setDate(d.getDate() + 30);
            d.setHours(23, 59, 59, 999);
            return d;
        default:
            return d;
    }
}
/**
 * Get job color based on status, priority, and conflicts
 */
function getJobColor(status, priority, hasConflict) {
    // Override with conflict color if conflict exists
    if (hasConflict)
        return '#ef4444'; // Red for conflicts
    if (status === 'completed')
        return '#22c55e';
    if (status === 'cancelled')
        return '#ef4444';
    if (status === 'in_progress')
        return '#3b82f6';
    switch (priority) {
        case 'urgent':
            return '#dc2626';
        case 'high':
            return '#ea580c';
        case 'medium':
            return '#d97706';
        case 'low':
            return '#65a30d';
        default:
            return '#6b7280';
    }
}
/**
 * Get conflict border color class based on severity
 */
function getConflictBorderColor(severity) {
    switch (severity) {
        case 'critical':
            return 'border-red-500 border-2';
        case 'high':
            return 'border-orange-500 border-2';
        case 'medium':
            return 'border-yellow-500 border-2';
        case 'low':
            return 'border-blue-500 border';
        default:
            return '';
    }
}
/**
 * Format time string for display
 */
function formatTime(timeString) {
    if (!timeString)
        return '00:00';
    // Handle both HH:MM:SS and HH:MM formats
    var parts = timeString.split(':');
    return "".concat(parts[0], ":").concat(parts[1] || '00');
}
/**
 * Format date for display
 */
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
/**
 * Check if two time ranges overlap
 */
function timeRangesOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
}
/**
 * Calculate duration in minutes between two dates
 */
function calculateDurationMinutes(start, end) {
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}
/**
 * Parse time string to Date object
 */
function parseTimeString(date, timeString) {
    var _a = timeString.split(':').map(Number), hours = _a[0], minutes = _a[1];
    var result = new Date(date);
    result.setHours(hours || 0, minutes || 0, 0, 0);
    return result;
}
/**
 * Filter jobs by multiple criteria
 */
function filterJobs(jobs, filters) {
    var _a = filters.searchQuery, searchQuery = _a === void 0 ? '' : _a, _b = filters.filterStatus, filterStatus = _b === void 0 ? 'all' : _b, _c = filters.filterPriority, filterPriority = _c === void 0 ? 'all' : _c, filterTechnician = filters.filterTechnician;
    return jobs.filter(function (job) {
        var _a, _b, _c, _d, _e;
        // Handle different data structures
        var customerName = ((_a = job.customer) === null || _a === void 0 ? void 0 : _a.name) || ((_b = job.account) === null || _b === void 0 ? void 0 : _b.name) || job.account_name || '';
        var serviceType = ((_c = job.service) === null || _c === void 0 ? void 0 : _c.type) || job.service_type || job.service_name || '';
        var locationAddress = ((_d = job.location) === null || _d === void 0 ? void 0 : _d.address) || job.location_address || job.address || '';
        var jobStatus = job.status || '';
        var jobPriority = job.priority || '';
        var jobTechnicianId = job.technician_id || '';
        // Search matching
        var searchLower = searchQuery.toLowerCase();
        var matchesSearch = searchQuery === '' ||
            customerName.toLowerCase().includes(searchLower) ||
            serviceType.toLowerCase().includes(searchLower) ||
            locationAddress.toLowerCase().includes(searchLower) ||
            ((_e = job.id) === null || _e === void 0 ? void 0 : _e.toLowerCase().includes(searchLower));
        // Status matching
        var matchesStatus = filterStatus === 'all' || jobStatus === filterStatus;
        // Priority matching
        var matchesPriority = filterPriority === 'all' || jobPriority === filterPriority;
        // Technician matching
        var matchesTechnician = !filterTechnician || jobTechnicianId === filterTechnician;
        return matchesSearch && matchesStatus && matchesPriority && matchesTechnician;
    });
}
/**
 * Sort jobs by scheduled date and time
 */
function sortJobsByDateTime(jobs) {
    return __spreadArray([], jobs, true).sort(function (a, b) {
        var dateA = new Date("".concat(a.scheduled_date, "T").concat(a.scheduled_start_time || '00:00:00'));
        var dateB = new Date("".concat(b.scheduled_date, "T").concat(b.scheduled_start_time || '00:00:00'));
        return dateA.getTime() - dateB.getTime();
    });
}
/**
 * Get technician name from technician object or ID
 */
function getTechnicianName(technician, _technicians) {
    if (technician) {
        return "".concat(technician.first_name || '', " ").concat(technician.last_name || '').trim() ||
            technician.email ||
            'Unknown';
    }
    return 'Unassigned';
}
/**
 * Get technician by ID from technicians array
 */
function getTechnicianById(technicianId, technicians) {
    if (!technicianId)
        return undefined;
    return technicians.find(function (t) { return (t.id || t.user_id) === technicianId; });
}
