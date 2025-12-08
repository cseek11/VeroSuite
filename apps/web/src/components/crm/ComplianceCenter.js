"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ComplianceCenter;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
function ComplianceCenter(_a) {
    var _customerId = _a.customerId;
    var _b = (0, react_1.useState)(null), selectedRecord = _b[0], setSelectedRecord = _b[1];
    var _c = (0, react_1.useState)(false), showRecordModal = _c[0], setShowRecordModal = _c[1];
    // Mock compliance data
    var complianceData = {
        overallScore: 92,
        criticalIssues: 1,
        pendingActions: 3,
        upcomingDeadlines: 2,
        chemicalUsage: {
            totalApplications: 24,
            chemicalsUsed: ['Bifenthrin', 'Fipronil', 'Imidacloprid'],
            safetyIncidents: 0,
            lastInspection: '2024-01-15'
        },
        regulatoryCompliance: {
            epaCompliance: 100,
            stateCompliance: 95,
            localCompliance: 88
        }
    };
    var complianceRecords = [
        {
            id: '1',
            record_type: 'Chemical Application',
            status: 'completed',
            due_date: '2024-01-20',
            completed_date: '2024-01-18',
            regulatory_body: 'EPA',
            description: 'Quarterly termite treatment application',
            priority: 'high',
            is_critical: true,
            chemical_used: 'Fipronil',
            application_rate: '0.125%',
            safety_measures: ['PPE worn', 'Area cordoned off', 'Weather conditions suitable']
        },
        {
            id: '2',
            record_type: 'Safety Inspection',
            status: 'pending',
            due_date: '2024-02-15',
            regulatory_body: 'State Department',
            description: 'Annual safety equipment inspection',
            priority: 'medium',
            is_critical: false
        },
        {
            id: '3',
            record_type: 'Chemical Inventory',
            status: 'overdue',
            due_date: '2024-01-10',
            regulatory_body: 'Local Authority',
            description: 'Monthly chemical inventory report',
            priority: 'high',
            is_critical: true
        },
        {
            id: '4',
            record_type: 'Training Certification',
            status: 'completed',
            due_date: '2024-01-30',
            completed_date: '2024-01-25',
            regulatory_body: 'EPA',
            description: 'Annual pesticide applicator certification renewal',
            priority: 'high',
            is_critical: true
        }
    ];
    var getStatusColor = function (status) {
        switch (status.toLowerCase()) {
            case 'completed': return 'green';
            case 'pending': return 'yellow';
            case 'overdue': return 'red';
            default: return 'gray';
        }
    };
    var getPriorityColor = function (priority) {
        switch (priority.toLowerCase()) {
            case 'high': return 'red';
            case 'medium': return 'yellow';
            case 'low': return 'green';
            default: return 'gray';
        }
    };
    var getDaysUntilDue = function (dueDate) {
        var due = new Date(dueDate);
        var now = new Date();
        var diffTime = due.getTime() - now.getTime();
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    var getTrendIcon = function (value, threshold) {
        if (threshold === void 0) { threshold = 0; }
        if (value > threshold)
            return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4 text-green-500" });
        if (value < threshold)
            return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "h-4 w-4 text-red-500" });
        return (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4 text-blue-500" });
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-slate-900", children: "Compliance Center" }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", children: "Regulatory Tracking" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-6 w-6 text-green-600" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: "Compliance Score" })] }), getTrendIcon(complianceData.overallScore, 90)] }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 2, className: "text-green-900 font-bold mb-2", children: [complianceData.overallScore, "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-3", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-green-500 h-3 rounded-full", style: { width: "".concat(complianceData.overallScore, "%") } }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg border border-red-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-6 w-6 text-red-600" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: "Critical Issues" })] }) }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-red-900 font-bold mb-2", children: complianceData.criticalIssues }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Requires immediate attention" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg border border-yellow-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-6 w-6 text-yellow-600" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: "Pending Actions" })] }) }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-yellow-900 font-bold mb-2", children: complianceData.pendingActions }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Awaiting completion" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-6 w-6 text-blue-600" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: "Due Soon" })] }) }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-blue-900 font-bold mb-2", children: complianceData.upcomingDeadlines }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Within 30 days" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900 mb-4", children: "Regulatory Compliance" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-6 rounded-lg border border-slate-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: "EPA Compliance" }), getTrendIcon(complianceData.regulatoryCompliance.epaCompliance, 95)] }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "text-green-900 font-bold mb-2", children: [complianceData.regulatoryCompliance.epaCompliance, "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-green-500 h-2 rounded-full", style: { width: "".concat(complianceData.regulatoryCompliance.epaCompliance, "%") } }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-6 rounded-lg border border-slate-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: "State Compliance" }), getTrendIcon(complianceData.regulatoryCompliance.stateCompliance, 90)] }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "text-blue-900 font-bold mb-2", children: [complianceData.regulatoryCompliance.stateCompliance, "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-blue-500 h-2 rounded-full", style: { width: "".concat(complianceData.regulatoryCompliance.stateCompliance, "%") } }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-6 rounded-lg border border-slate-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: "Local Compliance" }), getTrendIcon(complianceData.regulatoryCompliance.localCompliance, 85)] }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "text-yellow-900 font-bold mb-2", children: [complianceData.regulatoryCompliance.localCompliance, "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-yellow-500 h-2 rounded-full", style: { width: "".concat(complianceData.regulatoryCompliance.localCompliance, "%") } }) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900 mb-4", children: "Chemical Usage Monitoring" }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900 mb-2", children: "Total Applications" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-purple-900 font-bold", children: complianceData.chemicalUsage.totalApplications }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "This quarter" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900 mb-2", children: "Chemicals Used" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: complianceData.chemicalUsage.chemicalsUsed.map(function (chemical, index) { return ((0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: "bg-purple-100 text-purple-800", children: chemical }, index)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900 mb-2", children: "Safety Record" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-green-900 font-bold", children: complianceData.chemicalUsage.safetyIncidents }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Safety incidents" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 pt-4 border-t border-purple-200", children: (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-slate-600", children: ["Last inspection: ", formatDate(complianceData.chemicalUsage.lastInspection)] }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900 mb-4", children: "Compliance Records" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: complianceRecords.map(function (record) {
                                    var daysUntilDue = getDaysUntilDue(record.due_date);
                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ".concat(record.is_critical ? 'border-red-200 bg-red-50' : 'border-slate-200'), onClick: function () {
                                            setSelectedRecord(record);
                                            setShowRecordModal(true);
                                        }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full ".concat(record.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                                    record.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                                        'bg-red-100 text-red-600'), children: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: record.record_type }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: record.regulatory_body })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", children: record.status }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: getPriorityColor(record.priority) === 'red' ? 'bg-red-100 text-red-800' :
                                                                    getPriorityColor(record.priority) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-green-100 text-green-800', children: record.priority }), record.is_critical && ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-red-500" }))] })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-slate-800 mb-3", children: record.description }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 text-sm text-slate-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Due: ", formatDate(record.due_date)] })] }), record.completed_date && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Completed: ", formatDate(record.completed_date)] })] }))] }), record.status !== 'completed' && ((0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium ".concat(daysUntilDue < 0 ? 'text-red-600' :
                                                            daysUntilDue <= 7 ? 'text-yellow-600' : 'text-slate-600'), children: daysUntilDue < 0 ? "".concat(Math.abs(daysUntilDue), " days overdue") :
                                                            daysUntilDue === 0 ? 'Due today' :
                                                                "".concat(daysUntilDue, " days remaining") }))] })] }, record.id));
                                }) })] })] }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showRecordModal, onOpenChange: function (open) { return !open && setShowRecordModal(false); }, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-4xl", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsxs)(ui_1.DialogTitle, { children: ["Compliance Record - ", selectedRecord === null || selectedRecord === void 0 ? void 0 : selectedRecord.record_type] }) }), selectedRecord && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Status" }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: getStatusColor(selectedRecord.status) === 'green' ? 'bg-green-100 text-green-800' :
                                                        getStatusColor(selectedRecord.status) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                                            getStatusColor(selectedRecord.status) === 'red' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800', children: selectedRecord.status })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Priority" }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: getPriorityColor(selectedRecord.priority) === 'red' ? 'bg-red-100 text-red-800' :
                                                        getPriorityColor(selectedRecord.priority) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800', children: selectedRecord.priority })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Regulatory Body" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedRecord.regulatory_body })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Due Date" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: formatDate(selectedRecord.due_date) })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-2", children: "Description" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedRecord.description })] }), selectedRecord.chemical_used && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Chemical Used" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedRecord.chemical_used })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Application Rate" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedRecord.application_rate })] })] })), selectedRecord.safety_measures && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-2", children: "Safety Measures" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: selectedRecord.safety_measures.map(function (measure, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: measure })] }, index)); }) })] })), selectedRecord.is_critical && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-yellow-800 mb-1", children: "Critical Compliance Issue" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-yellow-700", children: "This record requires immediate attention to maintain regulatory compliance." })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 justify-end", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-4 w-4 mr-1" }), "Download Report"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4 mr-1" }), "View Documentation"] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowRecordModal(false); }, children: "Close" })] })] }))] }) })] }));
}
