"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurrencePreview = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var RecurrencePreview = function (_a) {
    var pattern = _a.pattern, startTime = _a.startTime, endTime = _a.endTime, _b = _a.maxPreview, maxPreview = _b === void 0 ? 10 : _b;
    var previewDates = (0, react_1.useMemo)(function () {
        var dates = [];
        var startDate = new Date(pattern.start_date);
        var endDate = pattern.end_date ? new Date(pattern.end_date) : null;
        var maxOccurrences = pattern.max_occurrences || maxPreview;
        var interval = pattern.recurrence_interval || 1;
        var currentDate = new Date(startDate);
        var occurrenceCount = 0;
        while (occurrenceCount < maxOccurrences && occurrenceCount < maxPreview) {
            // Check end date limit
            if (endDate && currentDate > endDate) {
                break;
            }
            var shouldInclude = false;
            switch (pattern.recurrence_type) {
                case 'daily':
                    shouldInclude = true;
                    if (occurrenceCount > 0) {
                        currentDate.setDate(currentDate.getDate() + interval);
                    }
                    break;
                case 'weekly':
                    if (pattern.recurrence_days_of_week && pattern.recurrence_days_of_week.length > 0) {
                        var dayOfWeek = currentDate.getDay();
                        if (pattern.recurrence_days_of_week.includes(dayOfWeek)) {
                            shouldInclude = true;
                        }
                        // Move to next day
                        currentDate.setDate(currentDate.getDate() + 1);
                        // If we've passed all days, move to next week
                        if (currentDate.getDay() === 0 && !pattern.recurrence_days_of_week.includes(0)) {
                            currentDate.setDate(currentDate.getDate() + (7 * (interval - 1)));
                        }
                    }
                    else {
                        shouldInclude = true;
                        if (occurrenceCount > 0) {
                            currentDate.setDate(currentDate.getDate() + (7 * interval));
                        }
                    }
                    break;
                case 'monthly':
                    if (pattern.recurrence_day_of_month) {
                        if (currentDate.getDate() === pattern.recurrence_day_of_month) {
                            shouldInclude = true;
                        }
                        if (occurrenceCount > 0) {
                            currentDate.setMonth(currentDate.getMonth() + interval);
                            currentDate.setDate(pattern.recurrence_day_of_month);
                        }
                    }
                    else {
                        var dayOfMonth = startDate.getDate();
                        if (currentDate.getDate() === dayOfMonth) {
                            shouldInclude = true;
                        }
                        if (occurrenceCount > 0) {
                            currentDate.setMonth(currentDate.getMonth() + interval);
                            currentDate.setDate(dayOfMonth);
                        }
                    }
                    break;
                case 'custom':
                    shouldInclude = true;
                    if (occurrenceCount > 0) {
                        currentDate.setDate(currentDate.getDate() + interval);
                    }
                    break;
                default:
                    currentDate.setDate(currentDate.getDate() + 1);
                    break;
            }
            if (shouldInclude && currentDate >= startDate) {
                dates.push(new Date(currentDate));
                occurrenceCount++;
            }
            // Safety check
            if (dates.length >= maxPreview || occurrenceCount >= maxOccurrences) {
                break;
            }
            // Prevent infinite loops
            if (dates.length > 100) {
                break;
            }
        }
        return dates;
    }, [pattern, maxPreview]);
    var totalOccurrences = (0, react_1.useMemo)(function () {
        var _a;
        if (pattern.max_occurrences) {
            return pattern.max_occurrences;
        }
        if (pattern.end_date) {
            // Estimate based on pattern
            var start = new Date(pattern.start_date);
            var end = new Date(pattern.end_date);
            var daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            switch (pattern.recurrence_type) {
                case 'daily':
                    return Math.floor(daysDiff / (pattern.recurrence_interval || 1)) + 1;
                case 'weekly':
                    var weeks = Math.floor(daysDiff / 7);
                    var daysPerWeek = ((_a = pattern.recurrence_days_of_week) === null || _a === void 0 ? void 0 : _a.length) || 1;
                    return Math.floor(weeks / (pattern.recurrence_interval || 1)) * daysPerWeek + daysPerWeek;
                case 'monthly':
                    var months = Math.floor(daysDiff / 30);
                    return Math.floor(months / (pattern.recurrence_interval || 1)) + 1;
                default:
                    return Math.floor(daysDiff / (pattern.recurrence_interval || 1)) + 1;
            }
        }
        return 'Unlimited';
    }, [pattern]);
    return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-5 h-5 text-green-600" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Preview" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 p-3 rounded-md", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Total Occurrences:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-bold text-gray-900", children: totalOccurrences })] }), pattern.end_date && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Ends:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-900", children: new Date(pattern.end_date).toLocaleDateString() })] }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-medium text-gray-700 mb-2", children: ["Next ", maxPreview, " Occurrences:"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1 max-h-48 overflow-y-auto", children: previewDates.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 italic", children: "No occurrences match this pattern" })) : (previewDates.map(function (date, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-900", children: date.toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                }) })] }), startTime && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsxs)("span", { children: [startTime, endTime && " - ".concat(endTime)] })] }))] }, index)); })) })] }), previewDates.length === maxPreview && ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500 italic", children: ["Showing first ", maxPreview, " occurrences. More may exist."] }))] }) }));
};
exports.RecurrencePreview = RecurrencePreview;
