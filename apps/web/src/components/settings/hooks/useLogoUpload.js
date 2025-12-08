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
exports.useLogoUpload = void 0;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var useLogoUpload = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    // Separate states for header and invoice logos
    var _a = (0, react_1.useState)(null), headerLogoFile = _a[0], setHeaderLogoFile = _a[1];
    var _b = (0, react_1.useState)(''), headerLogoPreview = _b[0], setHeaderLogoPreview = _b[1];
    var _c = (0, react_1.useState)(null), invoiceLogoFile = _c[0], setInvoiceLogoFile = _c[1];
    var _d = (0, react_1.useState)(''), invoiceLogoPreview = _d[0], setInvoiceLogoPreview = _d[1];
    // Header logo upload mutation
    var uploadHeaderLogoMutation = (0, react_query_1.useMutation)({
        mutationFn: function (file) { return enhanced_api_1.company.uploadLogo(file, 'header'); },
        onSuccess: function (data) {
            logger_1.logger.debug('Header logo uploaded successfully', { logo_url: data.logo_url }, 'useLogoUpload');
            setHeaderLogoPreview(data.logo_url);
            setHeaderLogoFile(null);
            queryClient.invalidateQueries({ queryKey: ['company', 'settings'] });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to upload header logo', error, 'useLogoUpload');
            toast_1.toast.error('Failed to upload header logo. Please try again.');
        }
    });
    // Invoice logo upload mutation
    var uploadInvoiceLogoMutation = (0, react_query_1.useMutation)({
        mutationFn: function (file) { return enhanced_api_1.company.uploadLogo(file, 'invoice'); },
        onSuccess: function (data) {
            logger_1.logger.debug('Invoice logo uploaded successfully', { logo_url: data.logo_url }, 'useLogoUpload');
            setInvoiceLogoPreview(data.logo_url);
            setInvoiceLogoFile(null);
            queryClient.invalidateQueries({ queryKey: ['company', 'settings'] });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to upload invoice logo', error, 'useLogoUpload');
            toast_1.toast.error('Failed to upload invoice logo. Please try again.');
        }
    });
    // Logo deletion mutations
    var deleteLogoMutation = (0, react_query_1.useMutation)({
        mutationFn: function (logoType) { return enhanced_api_1.company.deleteLogo(logoType); },
        onSuccess: function (_data, logoType) {
            logger_1.logger.debug("".concat(logoType, " logo deleted successfully"), {}, 'useLogoUpload');
            if (logoType === 'header') {
                setHeaderLogoPreview('');
            }
            else {
                setInvoiceLogoPreview('');
            }
            queryClient.invalidateQueries({ queryKey: ['company', 'settings'] });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to delete logo', error, 'useLogoUpload');
            toast_1.toast.error('Failed to delete logo. Please try again.');
        }
    });
    // Validate logo file
    var validateLogoFile = function (file) {
        var validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        var maxSize = 2 * 1024 * 1024; // 2MB
        if (!validTypes.includes(file.type)) {
            toast_1.toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
            return false;
        }
        if (file.size > maxSize) {
            toast_1.toast.error('File size must be less than 2MB');
            return false;
        }
        return true;
    };
    // Handle header logo selection and upload
    var handleHeaderLogoSelect = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var file, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!(file && validateLogoFile(file))) return [3 /*break*/, 6];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    if (!headerLogoPreview) return [3 /*break*/, 3];
                    logger_1.logger.debug('Replacing existing header logo - deleting old one first', {}, 'useLogoUpload');
                    return [4 /*yield*/, deleteLogoMutation.mutateAsync('header')];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: 
                // Upload to Supabase Storage
                return [4 /*yield*/, uploadHeaderLogoMutation.mutateAsync(file)];
                case 4:
                    // Upload to Supabase Storage
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    setHeaderLogoPreview(''); // Clear preview on error
                    logger_1.logger.error('Failed to upload/replace header logo', error_1, 'useLogoUpload');
                    return [3 /*break*/, 6];
                case 6:
                    // Reset input
                    event.target.value = '';
                    return [2 /*return*/];
            }
        });
    }); };
    // Handle invoice logo selection and upload
    var handleInvoiceLogoSelect = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var file, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!(file && validateLogoFile(file))) return [3 /*break*/, 6];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    if (!invoiceLogoPreview) return [3 /*break*/, 3];
                    logger_1.logger.debug('Replacing existing invoice logo - deleting old one first', {}, 'useLogoUpload');
                    return [4 /*yield*/, deleteLogoMutation.mutateAsync('invoice')];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: 
                // Upload to Supabase Storage
                return [4 /*yield*/, uploadInvoiceLogoMutation.mutateAsync(file)];
                case 4:
                    // Upload to Supabase Storage
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _b.sent();
                    setInvoiceLogoPreview(''); // Clear preview on error
                    logger_1.logger.error('Failed to upload/replace invoice logo', error_2, 'useLogoUpload');
                    return [3 /*break*/, 6];
                case 6:
                    // Reset input
                    event.target.value = '';
                    return [2 /*return*/];
            }
        });
    }); };
    // Set logo previews from company settings
    var setLogoPreviews = function (companySettings) {
        var headerUrl = companySettings.header_logo_url || '';
        var invoiceUrl = companySettings.invoice_logo_url || '';
        setHeaderLogoPreview(headerUrl);
        setInvoiceLogoPreview(invoiceUrl);
        logger_1.logger.debug('Logo previews updated', { headerUrl: headerUrl, invoiceUrl: invoiceUrl }, 'useLogoUpload');
    };
    return {
        // State
        headerLogoFile: headerLogoFile,
        headerLogoPreview: headerLogoPreview,
        invoiceLogoFile: invoiceLogoFile,
        invoiceLogoPreview: invoiceLogoPreview,
        // Actions
        handleHeaderLogoSelect: handleHeaderLogoSelect,
        handleInvoiceLogoSelect: handleInvoiceLogoSelect,
        setLogoPreviews: setLogoPreviews,
        // Mutations
        uploadHeaderLogoMutation: uploadHeaderLogoMutation,
        uploadInvoiceLogoMutation: uploadInvoiceLogoMutation,
        deleteLogoMutation: deleteLogoMutation,
        // Utilities
        validateLogoFile: validateLogoFile,
    };
};
exports.useLogoUpload = useLogoUpload;
