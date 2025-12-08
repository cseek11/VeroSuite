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
exports.default = Uploads;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
// TODO: Update to use enhanced API for file uploads
// import { enhancedApi } from '@/lib/enhanced-api';
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var logger_1 = require("@/utils/logger");
var upload_service_1 = require("@/lib/upload-service");
var lucide_react_1 = require("lucide-react");
function Uploads() {
    var _a = (0, react_1.useState)([]), files = _a[0], setFiles = _a[1];
    var _b = (0, react_1.useState)(false), uploading = _b[0], setUploading = _b[1];
    var _c = (0, react_1.useState)(null), uploadError = _c[0], setUploadError = _c[1];
    function onSelect(file) {
        return __awaiter(this, void 0, void 0, function () {
            var presign_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setUploading(true);
                        setUploadError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, (0, upload_service_1.presignUpload)(file.name, file.type)];
                    case 2:
                        presign_1 = _a.sent();
                        return [4 /*yield*/, fetch(presign_1.uploadUrl, { method: presign_1.method, headers: presign_1.headers, body: file })];
                    case 3:
                        _a.sent();
                        setFiles(function (prev) { return __spreadArray([presign_1.fileUrl], prev, true); });
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        setUploadError('Upload failed. Please try again.');
                        logger_1.logger.error('Upload error', error_1, 'Uploads');
                        return [3 /*break*/, 6];
                    case 5:
                        setUploading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    var handleFileSelect = function (e) {
        var _a;
        var selectedFile = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (selectedFile) {
            onSelect(selectedFile);
        }
    };
    var handleRemoveFile = function (index) {
        setFiles(function (prev) { return prev.filter(function (_, i) { return i !== index; }); });
    };
    var handleCopyUrl = function (url) {
        navigator.clipboard.writeText(url);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-3", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1", children: "File Uploads" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm", children: "Upload and manage images and documents for your pest control operations." })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1 bg-indigo-100 rounded-md", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "h-4 w-4 text-indigo-600" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-slate-800", children: "Upload Files" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "h-12 w-12 text-slate-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600 mb-2", children: "Drag and drop files here, or click to select" }), (0, jsx_runtime_1.jsx)("input", { type: "file", accept: "image/*", disabled: uploading, onChange: handleFileSelect, className: "hidden", id: "file-upload" }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "file-upload", className: "inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200", children: uploading ? 'Uploading...' : 'Select File' })] }), uploading && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center py-4", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Uploading file..." }) })), uploadError && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-3", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-800", children: uploadError }) }))] })] }), files.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1 bg-emerald-100 rounded-md", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Image, { className: "h-4 w-4 text-emerald-600" }) }), (0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold text-slate-800", children: ["Uploaded Files (", files.length, ")"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3", children: files.map(function (url, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "overflow-hidden hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("img", { src: url, alt: "Uploaded file ".concat(index + 1), className: "w-full h-48 object-cover" }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute top-2 right-2 flex gap-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleCopyUrl(url); }, className: "bg-white/90 hover:bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded hover:shadow-lg transition-all duration-200", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "h-3 w-3" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleRemoveFile(index); }, className: "bg-white/90 hover:bg-white border border-slate-200 text-red-600 hover:text-red-700 px-2 py-1 rounded hover:shadow-lg transition-all duration-200", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-3 w-3" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 text-slate-400" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-slate-600 truncate", children: ["File ", index + 1] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: (0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                                                    try {
                                                        window.open(url, '_blank');
                                                    }
                                                    catch (error) {
                                                        logger_1.logger.error('Failed to open uploaded file', error, 'Uploads');
                                                    }
                                                }, className: "flex-1 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-white hover:shadow-lg transition-all duration-200 text-xs flex items-center justify-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-3 w-3" }), "View"] }) })] })] }, url)); }) })] })), !uploading && files.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-8 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Image, { className: "h-12 w-12 text-slate-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-slate-900 mb-2", children: "No Files Uploaded" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600", children: "Upload your first file to get started." })] }))] }));
}
