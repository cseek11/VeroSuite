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
exports.RecurrencePatternSelector = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Label_1 = require("@/components/ui/Label");
var CRMComponents_1 = require("@/components/ui/CRMComponents");
var Switch_1 = require("@/components/ui/Switch");
var daysOfWeek = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' },
];
var RecurrencePatternSelector = function (_a) {
    var _b, _c, _d;
    var value = _a.value, onChange = _a.onChange, _e = _a.startDate, startDate = _e === void 0 ? new Date() : _e, endDate = _a.endDate;
    var _f = (0, react_1.useState)(function () {
        var _a, _b;
        var basePattern = {
            recurrence_type: 'weekly',
            recurrence_interval: 1,
            start_date: (_a = startDate.toISOString().split('T')[0]) !== null && _a !== void 0 ? _a : new Date().toISOString().substring(0, 10),
            end_date: (_b = endDate === null || endDate === void 0 ? void 0 : endDate.toISOString().split('T')[0]) !== null && _b !== void 0 ? _b : undefined,
        };
        return value ? __assign(__assign({}, basePattern), value) : basePattern;
    }), pattern = _f[0], setPattern = _f[1];
    (0, react_1.useEffect)(function () {
        if (value) {
            setPattern(__assign({}, value));
        }
    }, [value]);
    var handleChange = function (updates) {
        var newPattern = __assign(__assign({}, pattern), updates);
        setPattern(newPattern);
        onChange(newPattern);
    };
    var toggleDayOfWeek = function (day) {
        var currentDays = pattern.recurrence_days_of_week || [];
        var newDays = currentDays.includes(day)
            ? currentDays.filter(function (d) { return d !== day; })
            : __spreadArray(__spreadArray([], currentDays, true), [day], false).sort();
        handleChange({ recurrence_days_of_week: newDays });
    };
    return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Repeat, { className: "w-5 h-5 text-blue-600" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Recurrence Pattern" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "recurrence-type", children: "Pattern Type" }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.Select, { value: pattern.recurrence_type, onValueChange: function (value) {
                                return handleChange({ recurrence_type: value });
                            }, children: [(0, jsx_runtime_1.jsx)(CRMComponents_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(CRMComponents_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "daily", children: "Daily" }), (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "weekly", children: "Weekly" }), (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "monthly", children: "Monthly" }), (0, jsx_runtime_1.jsx)(CRMComponents_1.SelectItem, { value: "custom", children: "Custom" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(Label_1.Label, { htmlFor: "interval", children: ["Repeat Every", ' ', pattern.recurrence_type === 'daily' && 'Day(s)', pattern.recurrence_type === 'weekly' && 'Week(s)', pattern.recurrence_type === 'monthly' && 'Month(s)', pattern.recurrence_type === 'custom' && 'Day(s)'] }), (0, jsx_runtime_1.jsx)(Input_1.default, { id: "interval", type: "number", min: "1", value: pattern.recurrence_interval || 1, onChange: function (e) { return handleChange({ recurrence_interval: parseInt(e.target.value) || 1 }); }, className: "w-24" })] }), pattern.recurrence_type === 'weekly' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { children: "Days of Week" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2 mt-2", children: daysOfWeek.map(function (day) {
                                var _a;
                                return ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: function () { return toggleDayOfWeek(day.value); }, className: "px-3 py-1.5 rounded-md text-sm font-medium transition-colors ".concat(((_a = pattern.recurrence_days_of_week) === null || _a === void 0 ? void 0 : _a.includes(day.value))
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'), children: day.short }, day.value));
                            }) }), (!pattern.recurrence_days_of_week || pattern.recurrence_days_of_week.length === 0) && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-red-600 mt-1", children: "Please select at least one day" }))] })), pattern.recurrence_type === 'monthly' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "day-of-month", children: "Day of Month" }), (0, jsx_runtime_1.jsx)(Input_1.default, { id: "day-of-month", type: "number", min: "1", max: "31", value: (_b = pattern.recurrence_day_of_month) !== null && _b !== void 0 ? _b : startDate.getDate(), onChange: function (e) {
                                return handleChange({ recurrence_day_of_month: parseInt(e.target.value) || undefined });
                            }, className: "w-24" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Day of the month (1-31)" })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "start-date", children: "Start Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { id: "start-date", type: "date", value: pattern.start_date, onChange: function (e) { return handleChange({ start_date: e.target.value }); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(Switch_1.Switch, { id: "has-end-date", checked: pattern.end_date !== undefined, onCheckedChange: function (checked) { var _a; return handleChange({ end_date: checked ? (_a = pattern.end_date) !== null && _a !== void 0 ? _a : '' : undefined }); } }), (0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "has-end-date", children: "Set End Date" })] }), pattern.end_date !== undefined && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "end-date", children: "End Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { id: "end-date", type: "date", value: (_c = pattern.end_date) !== null && _c !== void 0 ? _c : '', onChange: function (e) { return handleChange({ end_date: e.target.value || undefined }); }, min: pattern.start_date })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(Switch_1.Switch, { id: "has-max-occurrences", checked: pattern.max_occurrences !== undefined, onCheckedChange: function (checked) { var _a; return handleChange({ max_occurrences: checked ? (_a = pattern.max_occurrences) !== null && _a !== void 0 ? _a : 1 : undefined }); } }), (0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "has-max-occurrences", children: "Set Maximum Occurrences" })] }), pattern.max_occurrences !== undefined && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Label_1.Label, { htmlFor: "max-occurrences", children: "Maximum Occurrences" }), (0, jsx_runtime_1.jsx)(Input_1.default, { id: "max-occurrences", type: "number", min: "1", value: (_d = pattern.max_occurrences) !== null && _d !== void 0 ? _d : '', onChange: function (e) {
                                        return handleChange({ max_occurrences: parseInt(e.target.value) || undefined });
                                    }, className: "w-32" })] }))] })] }) }));
};
exports.RecurrencePatternSelector = RecurrencePatternSelector;
