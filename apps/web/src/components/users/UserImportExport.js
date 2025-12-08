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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserImportExport;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var exportUtils_1 = require("@/utils/exportUtils");
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
function exportUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var token, tenantId, response, error_1, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem('verofield_auth')
                        ? JSON.parse(localStorage.getItem('verofield_auth')).token
                        : localStorage.getItem('jwt');
                    tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/v1/users/export"), {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token),
                                'x-tenant-id': tenantId,
                            },
                        })];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to export users', {
                        error: error_1 instanceof Error ? error_1.message : String(error_1)
                    });
                    throw error_1;
                case 4:
                    if (!response.ok) {
                        throw new Error("Failed to export users: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 5:
                    data = _a.sent();
                    return [2 /*return*/, data.users];
            }
        });
    });
}
function importUsers(file) {
    return __awaiter(this, void 0, void 0, function () {
        var token, tenantId, formData, response, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem('verofield_auth')
                        ? JSON.parse(localStorage.getItem('verofield_auth')).token
                        : localStorage.getItem('jwt');
                    tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';
                    formData = new FormData();
                    formData.append('file', file);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/v1/users/import"), {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'x-tenant-id': tenantId,
                            },
                            body: formData,
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json().catch(function () { return ({ message: response.statusText }); })];
                case 2:
                    error = _a.sent();
                    throw new Error(error.message || 'Failed to import users');
                case 3: return [2 /*return*/, response.json()];
            }
        });
    });
}
function UserImportExport() {
    var _a = (0, react_1.useState)(null), selectedFile = _a[0], setSelectedFile = _a[1];
    var _b = (0, react_1.useState)(null), importResult = _b[0], setImportResult = _b[1];
    var exportMutation = (0, react_query_1.useMutation)({
        mutationFn: exportUsers,
        onSuccess: function (users) {
            // Use existing export utility
            (0, exportUtils_1.exportToCSV)({
                title: 'Users Export',
                level: { id: 'users', name: 'Users', data: users, filters: [], breadcrumb: [] },
                data: users,
                metadata: {
                    exportedAt: new Date().toISOString(),
                    exportedBy: 'System',
                    totalRecords: users.length,
                    filteredRecords: users.length,
                },
            }, {
                format: 'csv',
                filename: "users-export-".concat(new Date().toISOString().split('T')[0]),
                includeMetadata: true,
            });
        },
        onError: function (error) {
            logger_1.logger.error('Error exporting users', error, 'UserImportExport');
        },
    });
    var importMutation = (0, react_query_1.useMutation)({
        mutationFn: importUsers,
        onSuccess: function (result) {
            setImportResult(result);
            logger_1.logger.info('Users imported', { result: result }, 'UserImportExport');
        },
        onError: function (error) {
            logger_1.logger.error('Error importing users', error, 'UserImportExport');
        },
    });
    var handleFileSelect = function (event) {
        var _a;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            if (!file.name.endsWith('.csv')) {
                alert('Please select a CSV file');
                return;
            }
            setSelectedFile(file);
            setImportResult(null);
        }
    };
    var handleImport = function () {
        if (!selectedFile) {
            alert('Please select a file to import');
            return;
        }
        if (!confirm('Are you sure you want to import users? Existing users with matching emails will be updated.')) {
            return;
        }
        importMutation.mutate(selectedFile);
    };
    var downloadTemplate = function () {
        var template = [
            {
                email: 'user@example.com',
                first_name: 'John',
                last_name: 'Doe',
                phone: '(555) 123-4567',
                roles: 'technician',
                department: 'Field Operations',
                position: 'Technician',
                employee_id: '',
                technician_number: '',
                pesticide_license_number: '',
                license_expiration_date: '',
            },
        ];
        (0, exportUtils_1.exportToCSV)({
            title: 'User Import Template',
            level: { id: 'template', name: 'Template', data: [], filters: [], breadcrumb: [] },
            data: template,
        }, {
            format: 'csv',
            filename: 'user-import-template',
            includeMetadata: false,
        });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Export Users" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: "Export all users to a CSV file for backup or migration" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return exportMutation.mutate(); }, disabled: exportMutation.isPending, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-4 w-4 mr-2" }), exportMutation.isPending ? 'Exporting...' : 'Export CSV'] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Import Users" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: "Import users from a CSV file. Existing users with matching emails will be updated." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-2", children: selectedFile ? selectedFile.name : 'Select a CSV file to import' }), (0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".csv", onChange: handleFileSelect, className: "hidden", id: "user-import-file" }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "user-import-file", className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "h-4 w-4 mr-2" }), "Select File"] })] }), selectedFile && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-5 w-5 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700", children: selectedFile.name }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-500", children: ["(", (selectedFile.size / 1024).toFixed(2), " KB)"] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                            setSelectedFile(null);
                                            setImportResult(null);
                                        }, className: "text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-5 w-5" }) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: downloadTemplate, className: "inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-4 w-4 mr-2" }), "Download Template"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleImport, disabled: !selectedFile || importMutation.isPending, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "h-4 w-4 mr-2" }), importMutation.isPending ? 'Importing...' : 'Import Users'] })] })] }), importResult && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 p-4 rounded-lg border ".concat(importResult.failed === 0
                            ? 'bg-green-50 border-green-200'
                            : 'bg-yellow-50 border-yellow-200'), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [importResult.failed === 0 ? ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-5 w-5 text-green-600 mt-0.5" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-5 w-5 text-yellow-600 mt-0.5" })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium mb-2", children: "Import Complete" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm space-y-1", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Total:" }), " ", importResult.total, " rows"] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-green-700", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Successful:" }), " ", importResult.successful] }), importResult.failed > 0 && ((0, jsx_runtime_1.jsxs)("p", { className: "text-red-700", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Failed:" }), " ", importResult.failed] }))] }), importResult.errors.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3 max-h-40 overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-medium mb-1", children: "Errors:" }), importResult.errors.map(function (error, index) { return ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-red-700", children: ["Row ", error.row, " (", error.email, "): ", error.error] }, index)); })] }))] })] }) })), importMutation.isError && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 p-4 bg-red-50 border border-red-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-5 w-5 text-red-600 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-red-800", children: "Import Failed" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700 mt-1", children: importMutation.error instanceof Error
                                                ? importMutation.error.message
                                                : 'Unknown error occurred' })] })] }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-blue-900 mb-2", children: "CSV Format Requirements" }), (0, jsx_runtime_1.jsxs)("ul", { className: "text-sm text-blue-800 space-y-1 list-disc list-inside", children: [(0, jsx_runtime_1.jsx)("li", { children: "Required columns: email, first_name, last_name" }), (0, jsx_runtime_1.jsx)("li", { children: "Optional columns: phone, roles (semicolon-separated), department, position, employee_id" }), (0, jsx_runtime_1.jsx)("li", { children: "Roles should be separated by semicolons (e.g., \"technician;dispatcher\")" }), (0, jsx_runtime_1.jsx)("li", { children: "Existing users with matching emails will be updated" }), (0, jsx_runtime_1.jsx)("li", { children: "New users will be created with default password (they'll need to reset it)" })] })] })] }));
}
