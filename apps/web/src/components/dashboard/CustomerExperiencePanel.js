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
var jsx_runtime_1 = require("react/jsx-runtime");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var react_query_1 = require("@tanstack/react-query");
// Note: enhancedApi not used - methods not available
var CustomerExperiencePanel = function () {
    // Fetch customer metrics from API
    var _a = (0, react_query_1.useQuery)({
        queryKey: ['customer', 'experience-metrics'],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Note: getExperienceMetrics not available in enhancedApi.customers
                // Return default metrics
                return [2 /*return*/, {
                        totalCustomers: 0,
                        satisfactionScore: 0,
                        responseTime: '0 hours',
                        retentionRate: 0,
                        complaints: 0,
                        testimonials: 0
                    }];
            });
        }); },
    }), _b = _a.data, customerMetrics = _b === void 0 ? {
        totalCustomers: 0,
        satisfactionScore: 0,
        responseTime: '0 hours',
        retentionRate: 0,
        complaints: 0,
        testimonials: 0
    } : _b, _isLoading = _a.isLoading;
    // Fetch recent feedback from API
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['customer', 'recent-feedback'],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Note: getRecentFeedback not available in enhancedApi.customers
                // Return empty array
                return [2 /*return*/, []];
            });
        }); },
    }).data, recentFeedback = _c === void 0 ? [] : _c;
    var getRatingColor = function (rating) {
        if (rating >= 4.5)
            return 'bg-green-100 text-green-800';
        if (rating >= 3.5)
            return 'bg-blue-100 text-blue-800';
        return 'bg-yellow-100 text-yellow-800';
    };
    var renderStars = function (rating) {
        return Array.from({ length: 5 }, function (_, i) { return ((0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-4 w-4 ".concat(i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300') }, i)); });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { title: "Customer Experience Overview", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "mx-auto h-8 w-8 text-blue-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-blue-600", children: customerMetrics.totalCustomers.toLocaleString() }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Total Customers" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "mx-auto h-8 w-8 text-yellow-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-yellow-600", children: customerMetrics.satisfactionScore }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Satisfaction Score" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mx-auto h-8 w-8 text-green-500 mb-2" }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "font-bold text-green-600", children: [customerMetrics.retentionRate, "%"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Retention Rate" })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { title: "Response Metrics", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { className: "h-5 w-5 text-blue-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: "Average Response Time" })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: customerMetrics.responseTime })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-red-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: "Open Complaints" })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium text-red-600", children: customerMetrics.complaints })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { className: "h-5 w-5 text-green-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: "Testimonials" })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium text-green-600", children: customerMetrics.testimonials })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { title: "Satisfaction Trend", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: "Overall Satisfaction" }), (0, jsx_runtime_1.jsxs)(ui_1.Badge, { variant: "default", className: getRatingColor(customerMetrics.satisfactionScore), children: [customerMetrics.satisfactionScore, "/5.0"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-1 mb-2", children: renderStars(customerMetrics.satisfactionScore) }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-2 rounded-full ".concat(customerMetrics.satisfactionScore >= 4.5 ? 'bg-green-500' :
                                            customerMetrics.satisfactionScore >= 3.5 ? 'bg-blue-500' : 'bg-yellow-500'), style: { width: "".concat((customerMetrics.satisfactionScore / 5) * 100, "%") } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 text-center", children: [Math.round((customerMetrics.satisfactionScore / 5) * 100), "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "text-center pt-2", children: (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["Based on ", customerMetrics.testimonials, " reviews"] }) })] }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { title: "Recent Customer Feedback", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: recentFeedback.map(function (feedback) { return ((0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: feedback.customer }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-1", children: renderStars(feedback.rating) })] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600 mb-2", children: ["\"", feedback.comment, "\""] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-400", children: new Date(feedback.date).toLocaleDateString() })] }, feedback.id)); }) }) })] }));
};
exports.default = CustomerExperiencePanel;
