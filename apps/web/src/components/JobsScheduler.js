"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JobsScheduler;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var toast_1 = require("@/utils/toast");
function JobsScheduler() {
    var _a = (0, react_1.useState)([]), jobs = _a[0], setJobs = _a[1];
    var _b = (0, react_1.useState)(null), selectedJob = _b[0], setSelectedJob = _b[1];
    var _c = (0, react_1.useState)(new Date(2025, 7, 1)), currentDate = _c[0], setCurrentDate = _c[1];
    var getDaysInMonth = function (date) {
        var year = date.getFullYear();
        var month = date.getMonth();
        var firstDay = new Date(year, month, 1);
        var lastDay = new Date(year, month + 1, 0);
        var startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        var days = [];
        var current = new Date(startDate);
        while (current <= lastDay || current.getDay() !== 0) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    };
    var getJobsForDate = function (date) {
        return jobs.filter(function (job) {
            var jobDate = new Date(job.start);
            return jobDate.toDateString() === date.toDateString();
        });
    };
    // Helper function for date formatting (currently unused, kept for potential future use)
    var _formatDate = function (date) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };
    void _formatDate; // Suppress unused warning
    var navigateMonth = function (direction) {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };
    var days = getDaysInMonth(currentDate);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold mb-4", children: "Jobs Scheduler" }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return navigateMonth(-1); }, className: "px-3 py-1 bg-gray-200 rounded hover:bg-gray-300", children: "\u2190 Previous" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold", children: currentDate.toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return navigateMonth(1); }, className: "px-3 py-1 bg-gray-200 rounded hover:bg-gray-300", children: "Next \u2192" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-7 gap-1", children: [['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(function (day) { return ((0, jsx_runtime_1.jsx)("div", { className: "text-center font-semibold text-gray-600 p-2 text-sm", children: day }, day)); }), days.map(function (date, index) {
                                var dayJobs = getJobsForDate(date);
                                var isCurrentMonth = date.getMonth() === currentDate.getMonth();
                                return ((0, jsx_runtime_1.jsxs)("div", { className: "border rounded p-2 min-h-[100px] ".concat(isCurrentMonth ? 'bg-white' : 'bg-gray-50', " ").concat(!isCurrentMonth ? 'text-gray-400' : ''), children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium mb-1", children: date.getDate() }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: dayJobs.map(function (job) { return ((0, jsx_runtime_1.jsx)("div", { className: "text-xs p-1 rounded cursor-pointer text-white", style: { backgroundColor: job.color }, onClick: function () { return setSelectedJob(job); }, children: job.title }, job.id)); }) })] }, index));
                            })] })] }), selectedJob && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-6 max-w-md w-full", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold mb-4", children: selectedJob.title }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Technician:" }), " ", selectedJob.technician] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Start:" }), " ", new Date(selectedJob.start).toLocaleString()] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "End:" }), " ", new Date(selectedJob.end).toLocaleString()] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600", onClick: function () {
                                        toast_1.toast.info('Edit functionality would be implemented here');
                                    }, children: "Edit" }), (0, jsx_runtime_1.jsx)("button", { className: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600", onClick: function () {
                                        setJobs(jobs.filter(function (job) { return job.id !== selectedJob.id; }));
                                        setSelectedJob(null);
                                    }, children: "Delete" }), (0, jsx_runtime_1.jsx)("button", { className: "bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600", onClick: function () { return setSelectedJob(null); }, children: "Close" })] })] }) }))] }));
}
