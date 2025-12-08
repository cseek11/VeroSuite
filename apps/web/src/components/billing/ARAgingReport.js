"use strict";
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
exports.default = ARAgingReport;
var jsx_runtime_1 = require("react/jsx-runtime");
// React import removed - not needed with React 17+
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var jspdf_1 = __importDefault(require("jspdf"));
function ARAgingReport() {
    var _a = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'ar-summary'],
        queryFn: function () { return enhanced_api_1.billing.getARSummary(); },
    }), arSummary = _a.data, isLoading = _a.isLoading, error = _a.error;
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };
    var handleExportPDF = function () {
        if (!arSummary)
            return;
        var doc = new jspdf_1.default();
        var pageWidth = doc.internal.pageSize.getWidth();
        var margin = 20;
        var yPos = margin;
        // Title
        doc.setFontSize(18);
        doc.text('AR Aging Report', pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;
        // Date
        doc.setFontSize(10);
        doc.text("Generated: ".concat(new Date().toLocaleDateString()), pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;
        // Summary
        doc.setFontSize(14);
        doc.text('SUMMARY', margin, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.text("Total AR: ".concat(formatCurrency(arSummary.totalAR)), margin + 5, yPos);
        yPos += 6;
        doc.text("Total Customers: ".concat(arSummary.totalCustomers), margin + 5, yPos);
        yPos += 6;
        doc.text("Total Invoices: ".concat(arSummary.totalInvoices), margin + 5, yPos);
        yPos += 10;
        // Aging Buckets
        doc.setFontSize(14);
        doc.text('AGING BUCKETS', margin, yPos);
        yPos += 8;
        doc.setFontSize(10);
        arSummary.agingBuckets.forEach(function (bucket) {
            doc.text("".concat(bucket.bucket === '90+' ? '90+' : bucket.bucket, " Days: ").concat(formatCurrency(bucket.amount)), margin + 5, yPos);
            yPos += 6;
        });
        yPos += 5;
        // Customer AR
        if (arSummary.customerAR && arSummary.customerAR.length > 0) {
            doc.setFontSize(14);
            doc.text('CUSTOMER AR BREAKDOWN', margin, yPos);
            yPos += 8;
            doc.setFontSize(10);
            arSummary.customerAR.slice(0, 20).forEach(function (customer) {
                if (yPos > pageWidth - 20) {
                    doc.addPage();
                    yPos = margin;
                }
                doc.text("".concat(customer.customerName, ": ").concat(formatCurrency(customer.totalAR)), margin + 5, yPos);
                yPos += 6;
            });
        }
        doc.save("AR-Aging-Report-".concat(new Date().toISOString().split('T')[0], ".pdf"));
        logger_1.logger.debug('AR Aging report exported', {}, 'ARAgingReport');
    };
    var handleExportCSV = function () {
        if (!arSummary)
            return;
        var csv = __spreadArray(__spreadArray(__spreadArray([
            ['AR Aging Report'],
            ["Generated: ".concat(new Date().toLocaleDateString())],
            [],
            ['Summary'],
            ['Total AR', arSummary.totalAR.toFixed(2)],
            ['Total Customers', arSummary.totalCustomers.toString()],
            ['Total Invoices', arSummary.totalInvoices.toString()],
            [],
            ['Aging Buckets'],
            ['Bucket', 'Amount']
        ], arSummary.agingBuckets.map(function (bucket) { return [
            bucket.bucket === '90+' ? '90+' : "".concat(bucket.bucket, " Days"),
            bucket.amount.toFixed(2)
        ]; }), true), [
            [],
            ['Customer AR Breakdown'],
            ['Customer', 'Total AR']
        ], false), arSummary.customerAR.map(function (customer) { return [
            customer.customerName,
            customer.totalAR.toFixed(2)
        ]; }), true).map(function (row) { return row.join(','); }).join('\n');
        var blob = new Blob([csv], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "AR-Aging-Report-".concat(new Date().toISOString().split('T')[0], ".csv");
        a.click();
        window.URL.revokeObjectURL(url);
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading AR aging data..." })] }));
    }
    if (error || !arSummary) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { children: "Failed to load AR aging data. Please try again." }) }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900", children: "AR Aging Report" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 mt-1", children: "Accounts receivable aging analysis" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", icon: lucide_react_1.Download, onClick: handleExportCSV, children: "Export CSV" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", icon: lucide_react_1.Download, onClick: handleExportPDF, children: "Export PDF" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-purple-700 font-medium text-sm", children: "Total AR" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-purple-900 font-bold mt-1", children: formatCurrency(arSummary.totalAR) })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-6 h-6 text-purple-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-blue-700 font-medium text-sm", children: "Customers" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-blue-900 font-bold mt-1", children: arSummary.totalCustomers })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-6 h-6 text-blue-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-green-700 font-medium text-sm", children: "Invoices" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-green-900 font-bold mt-1", children: arSummary.totalInvoices })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-6 h-6 text-green-600" }) })] }) }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold", children: "Aging Buckets" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.BarChart3, children: "View Chart" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: arSummary.agingBuckets.map(function (bucket) { return ((0, jsx_runtime_1.jsxs)("div", { className: "border-2 rounded-lg p-4 ".concat(bucket.bucket === '0-30'
                                    ? 'bg-green-50 border-green-200 text-green-800'
                                    : bucket.bucket === '31-60'
                                        ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                        : bucket.bucket === '61-90'
                                            ? 'bg-orange-50 border-orange-200 text-orange-800'
                                            : 'bg-red-50 border-red-200 text-red-800'), children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium mb-1", children: bucket.bucket === '90+' ? '90+ Days' : "".concat(bucket.bucket, " Days") }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: formatCurrency(bucket.amount) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs mt-1 opacity-75", children: [arSummary.totalAR > 0
                                                ? "".concat(((bucket.amount / arSummary.totalAR) * 100).toFixed(1), "%")
                                                : '0%', " of total AR"] })] }, bucket.bucket)); }) })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-6", children: (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold", children: "Customer AR Breakdown" }) }), arSummary.customerAR.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-500 mb-2", children: "No outstanding receivables" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 font-semibold text-gray-700", children: "Customer" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-3 px-4 font-semibold text-gray-700", children: "Total AR" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-3 px-4 font-semibold text-gray-700", children: "Invoices" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-3 px-4 font-semibold text-gray-700", children: "Oldest (Days)" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: arSummary.customerAR.map(function (customer) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: customer.customerName }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-right font-semibold", children: formatCurrency(customer.totalAR) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-right text-gray-600", children: customer.invoices.length }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-right text-gray-600", children: Math.max.apply(Math, customer.invoices.map(function (inv) { return inv.daysPastDue; })) })] }, customer.customerId)); }) })] }) }))] }) })] }));
}
