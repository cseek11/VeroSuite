"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.CompanySettings = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var SettingsCard_1 = require("../shared/SettingsCard");
var SuccessMessage_1 = require("../shared/SuccessMessage");
var useCompanySettings_1 = require("../hooks/useCompanySettings");
var useLogoUpload_1 = require("../hooks/useLogoUpload");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var CompanySettings = function (_a) {
    var _parentLoading = _a.isLoading;
    var _b = (0, useCompanySettings_1.useCompanySettings)(), companyData = _b.companyData, updateCompanyData = _b.updateCompanyData, companySettings = _b.companySettings, saveCompanySettings = _b.saveCompanySettings;
    var _c = (0, react_1.useState)(false), isSaving = _c[0], setIsSaving = _c[1];
    var _d = (0, react_1.useState)(false), showSuccess = _d[0], setShowSuccess = _d[1];
    var _e = (0, useLogoUpload_1.useLogoUpload)(), headerLogoPreview = _e.headerLogoPreview, invoiceLogoPreview = _e.invoiceLogoPreview, handleHeaderLogoSelect = _e.handleHeaderLogoSelect, handleInvoiceLogoSelect = _e.handleInvoiceLogoSelect, deleteLogoMutation = _e.deleteLogoMutation, uploadHeaderLogoMutation = _e.uploadHeaderLogoMutation, uploadInvoiceLogoMutation = _e.uploadInvoiceLogoMutation, setLogoPreviews = _e.setLogoPreviews;
    // Set logo previews when company settings load
    react_1.default.useEffect(function () {
        if (companySettings) {
            logger_1.logger.debug('Setting logo previews', {
                header_logo_url: companySettings.header_logo_url,
                invoice_logo_url: companySettings.invoice_logo_url,
                logo_url: companySettings.logo_url
            }, 'CompanySettings');
            setLogoPreviews(companySettings);
        }
    }, [companySettings, companyData, setLogoPreviews]);
    var handleInputChange = function (field, value) {
        var _a;
        updateCompanyData((_a = {}, _a[field] = value, _a));
    };
    var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var savePromise, timeoutPromise, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    savePromise = saveCompanySettings();
                    timeoutPromise = new Promise(function (_, reject) {
                        return setTimeout(function () { return reject(new Error('Save operation timed out after 30 seconds')); }, 30000);
                    });
                    return [4 /*yield*/, Promise.race([savePromise, timeoutPromise])];
                case 2:
                    _a.sent();
                    logger_1.logger.debug('Company settings saved successfully', {}, 'CompanySettings');
                    setShowSuccess(true);
                    setTimeout(function () { return setShowSuccess(false); }, 3000);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Company settings save failed', error_1, 'CompanySettings');
                    toast_1.toast.error("Failed to save company settings: ".concat(error_1 instanceof Error ? error_1.message : 'Unknown error'));
                    return [3 /*break*/, 5];
                case 4:
                    setIsSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(SuccessMessage_1.SuccessMessage, { show: showSuccess, message: "Company settings saved successfully!" }), (0, jsx_runtime_1.jsx)(SettingsCard_1.SettingsCard, { title: "Company Information", icon: lucide_react_1.Building2, children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Company Name *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: companyData.company_name, onChange: function (e) { return handleInputChange('company_name', e.target.value); }, className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500", placeholder: "Enter company name", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Phone" }), (0, jsx_runtime_1.jsx)("input", { type: "tel", value: companyData.phone, onChange: function (e) { return handleInputChange('phone', e.target.value); }, className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500", placeholder: "(555) 123-4567" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Email" }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: companyData.email, onChange: function (e) { return handleInputChange('email', e.target.value); }, className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500", placeholder: "contact@company.com" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Website" }), (0, jsx_runtime_1.jsx)("input", { type: "url", value: companyData.website, onChange: function (e) { return handleInputChange('website', e.target.value); }, className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500", placeholder: "https://www.company.com" })] })] }) }), (0, jsx_runtime_1.jsx)(SettingsCard_1.SettingsCard, { title: "Company Address", icon: lucide_react_1.MapPin, children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Street Address" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: companyData.address, onChange: function (e) { return handleInputChange('address', e.target.value); }, className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500", placeholder: "123 Main Street" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "City" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: companyData.city, onChange: function (e) { return handleInputChange('city', e.target.value); }, className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500", placeholder: "City" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "State" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: companyData.state, onChange: function (e) { return handleInputChange('state', e.target.value); }, className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500", placeholder: "State" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "ZIP Code" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: companyData.zip_code, onChange: function (e) { return handleInputChange('zip_code', e.target.value); }, className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500", placeholder: "12345" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Country" }), (0, jsx_runtime_1.jsxs)("select", { value: companyData.country, onChange: function (e) { return handleInputChange('country', e.target.value); }, className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "USA", children: "United States" }), (0, jsx_runtime_1.jsx)("option", { value: "CA", children: "Canada" }), (0, jsx_runtime_1.jsx)("option", { value: "UK", children: "United Kingdom" }), (0, jsx_runtime_1.jsx)("option", { value: "AU", children: "Australia" })] })] })] }) }), (0, jsx_runtime_1.jsx)(SettingsCard_1.SettingsCard, { title: "Header Logo", description: "Navigation & Header", icon: lucide_react_1.Image, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50", children: headerLogoPreview ? ((0, jsx_runtime_1.jsx)("img", { src: headerLogoPreview, alt: "Header Logo", className: "w-20 h-20 object-contain rounded", onError: function (e) {
                                    logger_1.logger.error('Header logo preview failed to load', new Error("URL: ".concat(headerLogoPreview)), 'CompanySettings');
                                    // Try adding cache-busting parameter
                                    var img = e.currentTarget;
                                    if (!img.src.includes('?t=')) {
                                        img.src = headerLogoPreview + '?t=' + Date.now();
                                    }
                                }, onLoad: function () { return logger_1.logger.debug('Header logo preview loaded', { url: headerLogoPreview }, 'CompanySettings'); } })) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Image, { className: "w-8 h-8 text-slate-400 mx-auto mb-1" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500", children: "No header logo" })] })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-3", children: [!headerLogoPreview ? ((0, jsx_runtime_1.jsxs)("label", { className: "block", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: "image/*", onChange: handleHeaderLogoSelect, className: "hidden", disabled: uploadHeaderLogoMutation.isPending }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium cursor-pointer ".concat(uploadHeaderLogoMutation.isPending
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'), children: uploadHeaderLogoMutation.isPending ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" }), (0, jsx_runtime_1.jsx)("span", { children: "Uploading..." })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Upload Header Logo" })] })) })] })) : ((0, jsx_runtime_1.jsxs)("label", { className: "block", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: "image/*", onChange: handleHeaderLogoSelect, className: "hidden", disabled: uploadHeaderLogoMutation.isPending || deleteLogoMutation.isPending }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium cursor-pointer ".concat((uploadHeaderLogoMutation.isPending || deleteLogoMutation.isPending)
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'), children: (uploadHeaderLogoMutation.isPending || deleteLogoMutation.isPending) ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" }), (0, jsx_runtime_1.jsx)("span", { children: deleteLogoMutation.isPending ? 'Removing old logo...' : 'Uploading new logo...' })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Replace Header Logo" })] })) })] })), headerLogoPreview && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return deleteLogoMutation.mutate('header'); }, disabled: deleteLogoMutation.isPending, className: "w-full flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium ".concat(deleteLogoMutation.isPending
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'), children: deleteLogoMutation.isPending ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" }), (0, jsx_runtime_1.jsx)("span", { children: "Deleting..." })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Delete Header Logo" })] })) }))] })] }) }), (0, jsx_runtime_1.jsx)(SettingsCard_1.SettingsCard, { title: "Invoice Logo", description: "Invoices & PDFs", icon: lucide_react_1.Image, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50", children: invoiceLogoPreview ? ((0, jsx_runtime_1.jsx)("img", { src: invoiceLogoPreview, alt: "Invoice Logo", className: "w-20 h-20 object-contain rounded", onError: function (e) {
                                    logger_1.logger.error('Invoice logo preview failed to load', new Error("URL: ".concat(invoiceLogoPreview)), 'CompanySettings');
                                    // Try adding cache-busting parameter
                                    var img = e.currentTarget;
                                    if (!img.src.includes('?t=')) {
                                        img.src = invoiceLogoPreview + '?t=' + Date.now();
                                    }
                                }, onLoad: function () { return logger_1.logger.debug('Invoice logo preview loaded', { url: invoiceLogoPreview }, 'CompanySettings'); } })) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Image, { className: "w-8 h-8 text-slate-400 mx-auto mb-1" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500", children: "No invoice logo" })] })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-3", children: [!invoiceLogoPreview ? ((0, jsx_runtime_1.jsxs)("label", { className: "block", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: "image/*", onChange: handleInvoiceLogoSelect, className: "hidden", disabled: uploadInvoiceLogoMutation.isPending }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium cursor-pointer ".concat(uploadInvoiceLogoMutation.isPending
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'), children: uploadInvoiceLogoMutation.isPending ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" }), (0, jsx_runtime_1.jsx)("span", { children: "Uploading..." })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Upload Invoice Logo" })] })) })] })) : ((0, jsx_runtime_1.jsxs)("label", { className: "block", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: "image/*", onChange: handleInvoiceLogoSelect, className: "hidden", disabled: uploadInvoiceLogoMutation.isPending || deleteLogoMutation.isPending }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium cursor-pointer ".concat((uploadInvoiceLogoMutation.isPending || deleteLogoMutation.isPending)
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'), children: (uploadInvoiceLogoMutation.isPending || deleteLogoMutation.isPending) ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" }), (0, jsx_runtime_1.jsx)("span", { children: deleteLogoMutation.isPending ? 'Removing old logo...' : 'Uploading new logo...' })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Replace Invoice Logo" })] })) })] })), invoiceLogoPreview && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return deleteLogoMutation.mutate('invoice'); }, disabled: deleteLogoMutation.isPending, className: "w-full flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium ".concat(deleteLogoMutation.isPending
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'), children: deleteLogoMutation.isPending ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" }), (0, jsx_runtime_1.jsx)("span", { children: "Deleting..." })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Delete Invoice Logo" })] })) }))] })] }) }), (0, jsx_runtime_1.jsx)(SettingsCard_1.SettingsCard, { title: "Logo Guidelines", icon: lucide_react_1.AlertTriangle, children: (0, jsx_runtime_1.jsx)("div", { className: "bg-blue-50/80 backdrop-blur-xl rounded-xl border border-blue-200/50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-blue-700 space-y-1", children: [(0, jsx_runtime_1.jsxs)("p", { children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "Size:" }), " 200x200px or larger (square format preferred)"] }), (0, jsx_runtime_1.jsxs)("p", { children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "Format:" }), " PNG, JPEG, GIF, or WebP"] }), (0, jsx_runtime_1.jsxs)("p", { children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "File Size:" }), " Maximum 2MB per logo"] }), (0, jsx_runtime_1.jsxs)("p", { children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "Background:" }), " Transparent PNG recommended"] }), (0, jsx_runtime_1.jsxs)("p", { children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "Actions:" }), " Upload, replace, or delete logos independently"] }), (0, jsx_runtime_1.jsxs)("p", { children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "Limit:" }), " One header logo + one invoice logo per tenant"] })] }) }) }), (0, jsx_runtime_1.jsx)(SettingsCard_1.SettingsCard, { title: "", children: (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: handleSave, disabled: isSaving, className: "px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ".concat(isSaving
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'), children: isSaving ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" }), (0, jsx_runtime_1.jsx)("span", { children: "Saving..." })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Save Company Settings" })] })) }) }) })] }));
};
exports.CompanySettings = CompanySettings;
