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
exports.default = CustomerProfileCard;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var enhanced_api_1 = require("@/lib/enhanced-api");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var Dialog_1 = require("@/components/ui/Dialog");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var logger_1 = require("@/utils/logger");
function CustomerProfileCard(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var customer = _a.customer, profile = _a.profile, _l = _a.contacts, contacts = _l === void 0 ? [] : _l;
    var _m = (0, react_1.useState)(false), isEditing = _m[0], setIsEditing = _m[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _o = (0, react_1.useState)(customer), editedCustomer = _o[0], setEditedCustomer = _o[1];
    var _p = (0, react_1.useState)(false), showPhotoModal = _p[0], setShowPhotoModal = _p[1];
    var _q = (0, react_1.useState)(null), selectedPhoto = _q[0], setSelectedPhoto = _q[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    var profileMetrics = (profile !== null && profile !== void 0 ? profile : {});
    // Enhanced customer stats using optional profile data
    var customerStats = {
        totalServices: (_b = profileMetrics.total_services) !== null && _b !== void 0 ? _b : 0,
        activeContracts: (_c = profileMetrics.active_contracts) !== null && _c !== void 0 ? _c : 0,
        lastVisit: (_d = profileMetrics.last_service_date) !== null && _d !== void 0 ? _d : 'N/A',
        nextScheduled: (_e = profileMetrics.next_service_date) !== null && _e !== void 0 ? _e : 'N/A',
        satisfactionScore: (_f = profileMetrics.satisfaction_score) !== null && _f !== void 0 ? _f : 0,
        churnRisk: (_g = profileMetrics.churn_risk) !== null && _g !== void 0 ? _g : 'Low',
        lifetimeValue: (_h = profileMetrics.lifetime_value) !== null && _h !== void 0 ? _h : 0
    };
    // Update customer mutation
    var updateCustomer = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return enhanced_api_1.enhancedApi.customers.update(customer.id, data); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['enhanced-customer', customer.id] });
            setIsEditing(false);
        },
    });
    // Upload photo mutation (placeholder for now)
    var uploadPhoto = (0, react_query_1.useMutation)({
        mutationFn: function (file) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Placeholder - will be implemented when photo API is enhanced
                logger_1.logger.debug('Uploading photo', { fileName: file.name, fileSize: file.size }, 'CustomerProfileCard');
                return [2 /*return*/, { success: true }];
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['customer-photos', customer.id] });
            setShowPhotoModal(false);
            setSelectedPhoto(null);
        },
    });
    var handleSave = function () {
        updateCustomer.mutate(editedCustomer);
    };
    var handlePhotoUpload = function () {
        if (selectedPhoto) {
            uploadPhoto.mutate(selectedPhoto);
        }
    };
    var customerSince = new Date(customer.created_at);
    var primaryContact = contacts.find(function (contact) { return contact.is_primary; });
    var emergencyContact = contacts.find(function (contact) { return contact.is_emergency_contact; });
    var primaryContactName = primaryContact
        ? "".concat((_j = primaryContact.first_name) !== null && _j !== void 0 ? _j : '', " ").concat((_k = primaryContact.last_name) !== null && _k !== void 0 ? _k : '').trim() || primaryContact.email || primaryContact.phone
        : undefined;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-8 h-8 text-purple-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: customer.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mt-1", children: [(0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "outline", className: "text-sm", children: customer.status.replace('_', ' ').toUpperCase() }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-slate-600", children: [customer.account_type, " \u2022 Customer since ", customerSince.toLocaleDateString()] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", size: "sm", onClick: function () { return navigate("/billing/".concat(customer.id)); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-4 h-4 mr-2" }), "Payment Portal"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return setShowPhotoModal(true); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Camera, { className: "w-4 h-4 mr-2" }), "Add Photo"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return setIsEditing(!isEditing); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "w-4 h-4 mr-2" }), isEditing ? 'Cancel' : 'Edit'] }), isEditing && ((0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", size: "sm", onClick: handleSave, disabled: updateCustomer.isPending, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "w-4 h-4 mr-2" }), "Save"] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: "Contact Information" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-4 h-4 text-slate-500" }), isEditing ? ((0, jsx_runtime_1.jsx)(Input_1.default, { value: editedCustomer.phone || '', onChange: function (e) { return setEditedCustomer(function (prev) { return (__assign(__assign({}, prev), { phone: e.target.value })); }); }, placeholder: "Phone number", className: "flex-1" })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-slate-700", children: customer.phone || 'Not provided' }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-4 h-4 text-slate-500" }), isEditing ? ((0, jsx_runtime_1.jsx)(Input_1.default, { value: editedCustomer.email || '', onChange: function (e) { return setEditedCustomer(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); }); }, placeholder: "Email address", className: "flex-1" })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-slate-700", children: customer.email || 'Not provided' }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-4 h-4 text-slate-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-slate-700", children: customer.address ? "".concat(customer.address, ", ").concat(customer.city, ", ").concat(customer.state, " ").concat(customer.zip_code) : 'Address not provided' })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: "Business Information" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(profile === null || profile === void 0 ? void 0 : profile.business_name) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "w-4 h-4 text-slate-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-slate-700", children: profile.business_name })] })), (profile === null || profile === void 0 ? void 0 : profile.business_type) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "w-4 h-4 text-slate-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-slate-700", children: profile.business_type })] })), primaryContact && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4 text-slate-500" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-slate-700", children: ["Primary: ", primaryContactName] })] })), emergencyContact && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-4 h-4 text-slate-500" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-slate-700", children: ["Emergency: ", emergencyContact.phone] })] }))] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-slate-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-purple-600 font-bold", children: customerStats.totalServices }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Total Services" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-slate-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-green-600 font-bold", children: customerStats.activeContracts }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Active Contracts" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-slate-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "w-4 h-4 text-yellow-500" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-yellow-600 font-bold", children: customerStats.satisfactionScore })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Satisfaction" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-slate-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "text-blue-600 font-bold", children: ["$", customerStats.lifetimeValue.toLocaleString()] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Lifetime Value" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 p-4 bg-slate-50 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: "Churn Risk Assessment" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Based on service history and engagement" })] }), (0, jsx_runtime_1.jsxs)(ui_1.Badge, { variant: "outline", className: "text-sm font-medium", children: [customerStats.churnRisk.toUpperCase(), " RISK"] })] }) })] }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showPhotoModal, onOpenChange: setShowPhotoModal, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-md", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(ui_1.DialogTitle, { children: "Upload Customer Photo" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "border-2 border-dashed border-slate-300 rounded-lg p-6 text-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: "image/*", onChange: function (e) { var _a; return setSelectedPhoto(((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) || null); }, className: "hidden", id: "photo-upload" }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "photo-upload", className: "cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Camera, { className: "w-8 h-8 text-slate-400 mx-auto mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Click to select a photo or drag and drop" })] })] }), selectedPhoto && ((0, jsx_runtime_1.jsx)("div", { className: "text-center", children: (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-slate-600", children: ["Selected: ", selectedPhoto.name] }) }))] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowPhotoModal(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: handlePhotoUpload, disabled: !selectedPhoto || uploadPhoto.isPending, children: "Upload Photo" })] })] }) })] }));
}
