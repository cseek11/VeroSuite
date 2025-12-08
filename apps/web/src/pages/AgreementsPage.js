"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AgreementsPage;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var AgreementList_1 = require("@/components/agreements/AgreementList");
var agreements_api_1 = require("@/lib/agreements-api");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
function AgreementsPage() {
    var navigate = (0, react_router_dom_1.useNavigate)();
    // Fetch agreement statistics
    var _a = (0, react_query_1.useQuery)({
        queryKey: ['agreement-stats'],
        queryFn: function () { return agreements_api_1.agreementsApi.getAgreementStats(); },
    }), stats = _a.data, statsLoading = _a.isLoading;
    // Fetch expiring agreements
    var _b = (0, react_query_1.useQuery)({
        queryKey: ['expiring-agreements'],
        queryFn: function () { return agreements_api_1.agreementsApi.getExpiringAgreements(30); },
    }), expiringAgreements = _b.data, expiringLoading = _b.isLoading;
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-gray-900", children: "Service Agreements" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 mt-1", children: "Manage customer service agreements and contracts" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", onClick: function () { return navigate('/agreements/create'); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }), "New Agreement"] })] }), !statsLoading && stats && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Total Agreements" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-gray-900", children: stats.totalAgreements })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-8 w-8 text-blue-600" })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Active Agreements" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-green-600", children: stats.activeAgreements })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-8 w-8 text-green-600" })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Total Value" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-gray-900", children: formatCurrency(stats.totalValue) })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-8 w-8 text-green-600" })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Expiring Soon" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-yellow-600", children: stats.expiredAgreements })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-8 w-8 text-yellow-600" })] }) })] })), !expiringLoading && expiringAgreements && expiringAgreements.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-yellow-600" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-yellow-900", children: "Agreements Expiring Soon" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", children: ["You have ", expiringAgreements.length, " agreement(s) expiring in the next 30 days:"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [expiringAgreements.slice(0, 3).map(function (agreement) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "font-medium", children: [agreement.title, " - ", agreement.account.name] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["Expires: ", new Date(agreement.end_date).toLocaleDateString()] })] }, agreement.id)); }), expiringAgreements.length > 3 && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["...and ", expiringAgreements.length - 3, " more"] }))] })] })] })), (0, jsx_runtime_1.jsx)(AgreementList_1.AgreementList, {}), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-4", children: "Quick Actions" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "h-20 flex flex-col items-center justify-center", onClick: function () { return navigate('/agreements/create'); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-6 w-6 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Create Agreement" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "h-20 flex flex-col items-center justify-center", onClick: function () {
                                    // TODO: Implement agreement templates
                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-6 w-6 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Agreement Templates" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "h-20 flex flex-col items-center justify-center", onClick: function () {
                                    // TODO: Implement bulk operations
                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-6 w-6 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Bulk Operations" })] })] })] })] }));
}
