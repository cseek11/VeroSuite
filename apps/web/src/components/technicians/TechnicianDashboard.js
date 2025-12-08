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
exports.default = TechnicianDashboard;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useTechnicians_1 = require("@/hooks/useTechnicians");
var useJobs_1 = require("@/hooks/useJobs");
var technician_1 = require("@/types/technician");
var jobs_1 = require("@/types/jobs");
var lucide_react_1 = require("lucide-react");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
function TechnicianDashboard(_a) {
    var _selectedTechnician = _a.selectedTechnician, onTechnicianSelect = _a.onTechnicianSelect, _b = _a.timeRange, timeRange = _b === void 0 ? 'week' : _b;
    var _c = (0, react_1.useState)(''), searchTerm = _c[0], setSearchTerm = _c[1];
    var _d = (0, react_1.useState)(''), filterStatus = _d[0], setFilterStatus = _d[1];
    var _e = (0, react_1.useState)('performance'), sortBy = _e[0], setSortBy = _e[1];
    var _f = (0, useTechnicians_1.useTechnicians)(__assign(__assign({}, (filterStatus ? { status: filterStatus } : {})), { limit: 50 })), techniciansData = _f.data, techniciansLoading = _f.isLoading;
    var _g = (0, useJobs_1.useJobs)({
        start_date: getDateRange(timeRange).start,
        end_date: getDateRange(timeRange).end
    }), jobsData = _g.data, jobsLoading = _g.isLoading;
    var _h = (0, useTechnicians_1.useTechnicianDashboardStats)(), calculatedDashboardStatsData = _h.data, statsLoading = _h.isLoading;
    var _j = (0, useTechnicians_1.useTechnicianPerformanceMetrics)(), performanceMetrics = _j.data, performanceLoading = _j.isLoading;
    // availability data is fetched but not yet used in this view
    var _k = (0, useTechnicians_1.useTechnicianAvailabilityData)(), _availabilityData = _k.data, availabilityLoading = _k.isLoading;
    var technicians = (techniciansData === null || techniciansData === void 0 ? void 0 : techniciansData.technicians) || [];
    var jobs = (jobsData === null || jobsData === void 0 ? void 0 : jobsData.data) || [];
    // Get date range based on time range
    function getDateRange(range) {
        var now = new Date();
        var start = new Date();
        switch (range) {
            case 'today':
                start.setHours(0, 0, 0, 0);
                break;
            case 'week':
                start.setDate(now.getDate() - 7);
                break;
            case 'month':
                start.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                start.setMonth(now.getMonth() - 3);
                break;
        }
        return {
            start: start.toISOString(),
            end: now.toISOString()
        };
    }
    // Calculate technician metrics
    var calculateTechnicianMetrics = function (technician) {
        var technicianJobs = jobs.filter(function (job) { return job.technician_id === technician.id; });
        var totalJobs = technicianJobs.length;
        var completedJobs = technicianJobs.filter(function (job) { return job.status === jobs_1.JobStatus.COMPLETED; }).length;
        var pendingJobs = technicianJobs.filter(function (job) { return job.status === jobs_1.JobStatus.SCHEDULED; }).length;
        var canceledJobs = technicianJobs.filter(function (job) { return job.status === jobs_1.JobStatus.CANCELED; }).length;
        var completionRate = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;
        var averageJobTime = 2.5; // Mock data - would calculate from actual job times
        var totalHours = completedJobs * averageJobTime;
        var utilizationRate = Math.min(100, (totalHours / (7 * 8)) * 100); // 7 days * 8 hours
        var customerRating = 4.2 + Math.random() * 0.8; // Mock rating
        var onTimeRate = 85 + Math.random() * 15; // Mock on-time rate
        var skills = ['General Pest Control', 'Termite Treatment', 'Rodent Control', 'Bed Bug Treatment'];
        var certifications = ['Pesticide License', 'Safety Certification', 'CPR Certified'];
        var performance = 'average';
        if (completionRate >= 90 && customerRating >= 4.5) {
            performance = 'excellent';
        }
        else if (completionRate >= 80 && customerRating >= 4.0) {
            performance = 'good';
        }
        else if (completionRate < 70 || customerRating < 3.5) {
            performance = 'needs_improvement';
        }
        return {
            technician: technician,
            totalJobs: totalJobs,
            completedJobs: completedJobs,
            pendingJobs: pendingJobs,
            canceledJobs: canceledJobs,
            completionRate: completionRate,
            averageJobTime: averageJobTime,
            totalHours: totalHours,
            utilizationRate: utilizationRate,
            customerRating: customerRating,
            onTimeRate: onTimeRate,
            skills: skills,
            certifications: certifications,
            performance: performance
        };
    };
    // Calculate dashboard stats using API data
    var dashboardStats = (0, react_1.useMemo)(function () {
        var _a;
        var totalTechnicians = (calculatedDashboardStatsData === null || calculatedDashboardStatsData === void 0 ? void 0 : calculatedDashboardStatsData.totalTechnicians) || technicians.length;
        var activeTechnicians = (calculatedDashboardStatsData === null || calculatedDashboardStatsData === void 0 ? void 0 : calculatedDashboardStatsData.activeTechnicians) || technicians.filter(function (t) { return t.status === technician_1.TechnicianStatus.ACTIVE; }).length;
        var totalJobs = jobs.length;
        var completedJobs = jobs.filter(function (job) { return job.status === jobs_1.JobStatus.COMPLETED; }).length;
        if (technicians.length === 0) {
            return {
                totalTechnicians: totalTechnicians,
                activeTechnicians: activeTechnicians,
                totalJobs: totalJobs,
                completedJobs: completedJobs,
                averageCompletionRate: 0,
                averageUtilization: 0,
                topPerformers: [],
                recentActivity: []
            };
        }
        var fallbackTech = technicians[0] || {
            id: 'tech-fallback',
            user_id: '',
            employee_id: '',
            hire_date: new Date().toISOString(),
            position: '',
            department: '',
            employment_type: technician_1.EmploymentType.FULL_TIME,
            status: technician_1.TechnicianStatus.ACTIVE,
            country: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user: {
                id: '',
                email: '',
                first_name: 'N/A',
                last_name: '',
            },
        };
        var technicianMetrics = technicians.map(calculateTechnicianMetrics);
        var averageCompletionRate = (performanceMetrics === null || performanceMetrics === void 0 ? void 0 : performanceMetrics.averageCompletionRate) ||
            (technicianMetrics.reduce(function (sum, m) { return sum + m.completionRate; }, 0) / technicianMetrics.length || 0);
        var averageUtilization = (performanceMetrics === null || performanceMetrics === void 0 ? void 0 : performanceMetrics.averageUtilization) ||
            (technicianMetrics.reduce(function (sum, m) { return sum + m.utilizationRate; }, 0) / technicianMetrics.length || 0);
        var topPerformers = ((_a = performanceMetrics === null || performanceMetrics === void 0 ? void 0 : performanceMetrics.metrics) === null || _a === void 0 ? void 0 : _a.slice(0, 5).map(function (metric) { return ({
            technician: technicians.find(function (t) { return t.id === metric.technicianId; }) || fallbackTech,
            totalJobs: metric.jobsCompleted,
            completedJobs: metric.jobsCompleted,
            pendingJobs: 0,
            canceledJobs: 0,
            completionRate: metric.completionRate,
            averageJobTime: 2.5,
            totalHours: metric.jobsCompleted * 2.5,
            utilizationRate: metric.utilizationRate,
            customerRating: parseFloat(metric.customerRating),
            onTimeRate: metric.onTimeRate,
            skills: ['General Pest Control'],
            certifications: ['Pesticide License'],
            performance: metric.completionRate >= 90 ? 'excellent' : metric.completionRate >= 80 ? 'good' : 'average'
        }); })) || technicianMetrics
            .sort(function (a, b) { return b.completionRate - a.completionRate; })
            .slice(0, 5);
        var safeTech = function (index) { return technicians[index] || fallbackTech; };
        var recentActivity = [
            {
                id: '1',
                type: 'job_completed',
                technician: safeTech(0),
                description: 'Completed termite inspection at 123 Main St',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            },
            {
                id: '2',
                type: 'job_assigned',
                technician: safeTech(1),
                description: 'Assigned to rodent control job at 456 Oak Ave',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            },
            {
                id: '3',
                type: 'rating_received',
                technician: safeTech(2),
                description: 'Received 5-star rating from customer',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
            }
        ];
        return {
            totalTechnicians: totalTechnicians,
            activeTechnicians: activeTechnicians,
            totalJobs: totalJobs,
            completedJobs: completedJobs,
            averageCompletionRate: averageCompletionRate,
            averageUtilization: averageUtilization,
            topPerformers: topPerformers,
            recentActivity: recentActivity
        };
    }, [technicians, jobs, calculatedDashboardStatsData, performanceMetrics]);
    // Filter and sort technicians
    var filteredTechnicians = (0, react_1.useMemo)(function () {
        var filtered = technicians;
        // Apply search filter
        if (searchTerm) {
            var searchLower_1 = searchTerm.toLowerCase();
            filtered = filtered.filter(function (tech) {
                var _a, _b, _c, _d, _e, _f, _g;
                return ((_b = (_a = tech.user) === null || _a === void 0 ? void 0 : _a.first_name) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower_1)) ||
                    ((_d = (_c = tech.user) === null || _c === void 0 ? void 0 : _c.last_name) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchLower_1)) ||
                    ((_f = (_e = tech.user) === null || _e === void 0 ? void 0 : _e.email) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes(searchLower_1)) ||
                    ((_g = tech.position) === null || _g === void 0 ? void 0 : _g.toLowerCase().includes(searchLower_1));
            });
        }
        // Apply status filter
        if (filterStatus) {
            filtered = filtered.filter(function (tech) { return tech.status === filterStatus; });
        }
        // Sort technicians
        filtered.sort(function (a, b) {
            var _a, _b, _c, _d;
            var metricsA = calculateTechnicianMetrics(a);
            var metricsB = calculateTechnicianMetrics(b);
            switch (sortBy) {
                case 'performance':
                    return metricsB.completionRate - metricsA.completionRate;
                case 'utilization':
                    return metricsB.utilizationRate - metricsA.utilizationRate;
                case 'completion':
                    return metricsB.completedJobs - metricsA.completedJobs;
                case 'name':
                    return "".concat((_a = a.user) === null || _a === void 0 ? void 0 : _a.first_name, " ").concat((_b = a.user) === null || _b === void 0 ? void 0 : _b.last_name).localeCompare("".concat((_c = b.user) === null || _c === void 0 ? void 0 : _c.first_name, " ").concat((_d = b.user) === null || _d === void 0 ? void 0 : _d.last_name));
                default:
                    return 0;
            }
        });
        return filtered;
    }, [technicians, searchTerm, filterStatus, sortBy]);
    // Get performance color
    var getPerformanceColor = function (performance) {
        switch (performance) {
            case 'excellent': return 'text-green-600 bg-green-50';
            case 'good': return 'text-blue-600 bg-blue-50';
            case 'average': return 'text-yellow-600 bg-yellow-50';
            case 'needs_improvement': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };
    // Get performance icon
    var getPerformanceIcon = function (performance) {
        switch (performance) {
            case 'excellent': return (0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-4 w-4" });
            case 'good': return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" });
            case 'average': return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4" });
            case 'needs_improvement': return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4" });
        }
    };
    if (techniciansLoading || jobsLoading || statsLoading || performanceLoading || availabilityLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading dashboard..." }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Technician Dashboard" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Monitor technician performance and workload" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: (0, jsx_runtime_1.jsxs)("select", { value: timeRange, onChange: function () { }, className: "crm-input", children: [(0, jsx_runtime_1.jsx)("option", { value: "today", children: "Today" }), (0, jsx_runtime_1.jsx)("option", { value: "week", children: "This Week" }), (0, jsx_runtime_1.jsx)("option", { value: "month", children: "This Month" }), (0, jsx_runtime_1.jsx)("option", { value: "quarter", children: "This Quarter" })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-blue-100 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-6 w-6 text-blue-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Total Technicians" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-semibold text-gray-900", children: dashboardStats.totalTechnicians })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-green-100 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-6 w-6 text-green-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Active Technicians" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-semibold text-gray-900", children: dashboardStats.activeTechnicians })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-purple-100 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-6 w-6 text-purple-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Completion Rate" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-2xl font-semibold text-gray-900", children: [dashboardStats.averageCompletionRate.toFixed(1), "%"] })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-orange-100 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-6 w-6 text-orange-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Avg Utilization" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-2xl font-semibold text-gray-900", children: [dashboardStats.averageUtilization.toFixed(1), "%"] })] })] }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col lg:flex-row gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { placeholder: "Search technicians...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("select", { value: filterStatus, onChange: function (e) { return setFilterStatus(e.target.value); }, className: "crm-input", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Statuses" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.TechnicianStatus.ACTIVE, children: "Active" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.TechnicianStatus.INACTIVE, children: "Inactive" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.TechnicianStatus.ON_LEAVE, children: "On Leave" })] }), (0, jsx_runtime_1.jsxs)("select", { value: sortBy, onChange: function (e) { return setSortBy(e.target.value); }, className: "crm-input", children: [(0, jsx_runtime_1.jsx)("option", { value: "performance", children: "Performance" }), (0, jsx_runtime_1.jsx)("option", { value: "utilization", children: "Utilization" }), (0, jsx_runtime_1.jsx)("option", { value: "completion", children: "Jobs Completed" }), (0, jsx_runtime_1.jsx)("option", { value: "name", children: "Name" })] })] })] }) }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Top Performers" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: dashboardStats.topPerformers.map(function (metrics, index) {
                            var _a, _b, _c, _d, _e, _f;
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold", children: index + 1 }), (0, jsx_runtime_1.jsx)("div", { className: "h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium text-purple-600", children: [(_b = (_a = metrics.technician.user) === null || _a === void 0 ? void 0 : _a.first_name) === null || _b === void 0 ? void 0 : _b[0], (_d = (_c = metrics.technician.user) === null || _c === void 0 ? void 0 : _c.last_name) === null || _d === void 0 ? void 0 : _d[0]] }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-medium text-gray-900", children: [(_e = metrics.technician.user) === null || _e === void 0 ? void 0 : _e.first_name, " ", (_f = metrics.technician.user) === null || _f === void 0 ? void 0 : _f.last_name] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: metrics.technician.position })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Completion Rate" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-semibold text-green-600", children: [metrics.completionRate.toFixed(1), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Jobs Completed" }), (0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-gray-900", children: metrics.completedJobs })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Rating" }), (0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-yellow-600", children: metrics.customerRating.toFixed(1) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ".concat(getPerformanceColor(metrics.performance)), children: [getPerformanceIcon(metrics.performance), metrics.performance.replace('_', ' ')] })] })] }, metrics.technician.id));
                        }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredTechnicians.map(function (technician) {
                    var _a, _b, _c, _d, _e, _f;
                    var metrics = calculateTechnicianMetrics(technician);
                    return ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6 hover:shadow-lg transition-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-lg font-medium text-purple-600", children: [(_b = (_a = technician.user) === null || _a === void 0 ? void 0 : _a.first_name) === null || _b === void 0 ? void 0 : _b[0], (_d = (_c = technician.user) === null || _c === void 0 ? void 0 : _c.last_name) === null || _d === void 0 ? void 0 : _d[0]] }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "font-semibold text-gray-900", children: [(_e = technician.user) === null || _e === void 0 ? void 0 : _e.first_name, " ", (_f = technician.user) === null || _f === void 0 ? void 0 : _f.last_name] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: technician.position })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ".concat(getPerformanceColor(metrics.performance)), children: [getPerformanceIcon(metrics.performance), metrics.performance.replace('_', ' ')] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Completion Rate" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold text-green-600", children: [metrics.completionRate.toFixed(1), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Jobs Completed" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold text-gray-900", children: [metrics.completedJobs, "/", metrics.totalJobs] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Utilization" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold text-blue-600", children: [metrics.utilizationRate.toFixed(1), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Customer Rating" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-yellow-600", children: metrics.customerRating.toFixed(1) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-700 mb-2", children: "Skills" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-1", children: [metrics.skills.slice(0, 2).map(function (skill, index) { return ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full", children: skill }, index)); }), metrics.skills.length > 2 && ((0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full", children: ["+", metrics.skills.length - 2] }))] })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return onTechnicianSelect === null || onTechnicianSelect === void 0 ? void 0 : onTechnicianSelect(technician); }, variant: "outline", className: "w-full", children: "View Details" })] }, technician.id));
                }) }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Recent Activity" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: dashboardStats.recentActivity.map(function (activity) {
                            var _a, _b, _c, _d, _e, _f;
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-medium text-purple-600", children: [(_b = (_a = activity.technician.user) === null || _a === void 0 ? void 0 : _a.first_name) === null || _b === void 0 ? void 0 : _b[0], (_d = (_c = activity.technician.user) === null || _c === void 0 ? void 0 : _c.last_name) === null || _d === void 0 ? void 0 : _d[0]] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900", children: activity.description }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500", children: [(_e = activity.technician.user) === null || _e === void 0 ? void 0 : _e.first_name, " ", (_f = activity.technician.user) === null || _f === void 0 ? void 0 : _f.last_name, " \u2022", new Date(activity.timestamp).toLocaleString()] })] })] }, activity.id));
                        }) })] })] }));
}
