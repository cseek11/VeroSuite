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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var react_leaflet_1 = require("react-leaflet");
var lucide_react_1 = require("lucide-react");
var react_query_1 = require("@tanstack/react-query");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var ui_1 = require("@/components/ui");
var CustomerOverview = function (_a) {
    var customerId = _a.customerId, _onNavigateToNote = _a.onNavigateToNote;
    var _b = (0, react_1.useState)(false), isEditing = _b[0], setIsEditing = _b[1];
    var _c = (0, react_1.useState)(null), editedCustomer = _c[0], setEditedCustomer = _c[1];
    var _d = (0, react_1.useState)(false), isSaving = _d[0], setIsSaving = _d[1];
    var _e = (0, react_1.useState)(['VIP', 'Quarterly Service', 'High Priority']), customerTags = _e[0], _setCustomerTags = _e[1];
    var _f = (0, react_1.useState)([]), openPopups = _f[0], setOpenPopups = _f[1];
    var _g = (0, react_1.useState)(null), hoveredCard = _g[0], setHoveredCard = _g[1];
    var _h = (0, react_1.useState)(''), newNoteContent = _h[0], setNewNoteContent = _h[1];
    var _j = (0, react_1.useState)('low'), newNotePriority = _j[0], setNewNotePriority = _j[1];
    var _k = (0, react_1.useState)(false), isSubmittingNote = _k[0], setIsSubmittingNote = _k[1];
    var _l = (0, react_1.useState)(null), draggedPopupId = _l[0], setDraggedPopupId = _l[1];
    var _m = (0, react_1.useState)({ x: 0, y: 0 }), dragOffset = _m[0], setDragOffset = _m[1];
    var _o = (0, react_1.useState)([]), noteData = _o[0], setNoteData = _o[1];
    // Fetch customer data
    var _p = (0, react_query_1.useQuery)({
        queryKey: ['customer', customerId],
        queryFn: function () { return enhanced_api_1.enhancedApi.customers.getById(customerId); },
        enabled: !!customerId
    }), customer = _p.data, isLoading = _p.isLoading, error = _p.error;
    // Initialize edited customer when data loads
    react_1.default.useEffect(function () {
        if (customer && !editedCustomer) {
            setEditedCustomer(customer);
        }
    }, [customer, editedCustomer]);
    var handleInputChange = function (field, value) {
        setEditedCustomer(function (prev) {
            var _a;
            return prev ? __assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)) : prev;
        });
    };
    var handleSaveCustomer = function () { return __awaiter(void 0, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!editedCustomer)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setIsSaving(true);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.customers.update(customerId, {
                            name: editedCustomer.name,
                            phone: editedCustomer.phone,
                            email: editedCustomer.email,
                            address: editedCustomer.address,
                            city: editedCustomer.city,
                            state: editedCustomer.state,
                            zip_code: editedCustomer.zip_code,
                        })];
                case 2:
                    _a.sent();
                    setIsEditing(false);
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _a.sent();
                    logger_1.logger.error('Failed to save customer', e_1, 'CustomerOverview');
                    return [3 /*break*/, 5];
                case 4:
                    setIsSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Placeholder for note data until backend wiring is ready
    (0, react_1.useEffect)(function () {
        setNoteData([]);
    }, []);
    // Handle note click to show popup
    var handleNoteClick = function (note, event) {
        event.preventDefault();
        event.stopPropagation();
        // Check if popup is already open
        var existingPopup = openPopups.find(function (popup) { return popup.note.id === note.id; });
        if (existingPopup) {
            // Close the popup if it's already open
            setOpenPopups(function (prev) { return prev.filter(function (popup) { return popup.note.id !== note.id; }); });
            return;
        }
        // Calculate position for new popup
        var rect = event.currentTarget.getBoundingClientRect();
        var horizontalOffset = -320; // Popup width + some margin
        var verticalOffset = -100; // Center vertically
        var newPopup = {
            id: "popup-".concat(note.id, "-").concat(Date.now()),
            note: note,
            position: {
                x: rect.left + horizontalOffset,
                y: rect.top + verticalOffset
            },
            isDragging: false,
            dragOffset: { x: 0, y: 0 }
        };
        setOpenPopups(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newPopup], false); });
    };
    // Handle popup drag start
    var handleMouseDown = function (popupId, event) {
        event.preventDefault();
        event.stopPropagation();
        var popup = openPopups.find(function (p) { return p.id === popupId; });
        if (!popup)
            return;
        var rect = event.currentTarget.getBoundingClientRect();
        var offsetX = event.clientX - rect.left;
        var offsetY = event.clientY - rect.top;
        setDraggedPopupId(popupId);
        setDragOffset({ x: offsetX, y: offsetY });
        setOpenPopups(function (prev) { return prev.map(function (p) {
            return p.id === popupId
                ? __assign(__assign({}, p), { isDragging: true, dragOffset: { x: offsetX, y: offsetY } }) : p;
        }); });
    };
    // Handle popup drag move
    var handleMouseMove = function (event) {
        if (!draggedPopupId)
            return;
        var newX = event.clientX - dragOffset.x;
        var newY = event.clientY - dragOffset.y;
        setOpenPopups(function (prev) { return prev.map(function (popup) {
            return popup.id === draggedPopupId
                ? __assign(__assign({}, popup), { position: { x: newX, y: newY } }) : popup;
        }); });
    };
    // Handle popup drag end
    var handleMouseUp = function () {
        if (draggedPopupId) {
            setOpenPopups(function (prev) { return prev.map(function (popup) {
                return popup.id === draggedPopupId
                    ? __assign(__assign({}, popup), { isDragging: false }) : popup;
            }); });
            setDraggedPopupId(null);
        }
    };
    // Add mouse event listeners for dragging
    (0, react_1.useEffect)(function () {
        if (draggedPopupId) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return function () {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
        return undefined;
    }, [draggedPopupId, dragOffset]);
    // Handle note submission
    var handleAddNote = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!newNoteContent.trim())
                return [2 /*return*/];
            setIsSubmittingNote(true);
            // Simulate API call
            setTimeout(function () {
                var newNote = {
                    id: "new-".concat(Date.now()),
                    type: 'internal',
                    title: "Internal Note - ".concat(newNotePriority, " Priority"),
                    content: newNoteContent,
                    author: 'Current User',
                    timestamp: new Date().toISOString(),
                    priority: newNotePriority,
                    createdBy: 'Current User'
                };
                // Add to noteData (in real app, this would be an API call)
                setNoteData(function (prev) { return __spreadArray([newNote], prev, true); });
                setNewNoteContent('');
                setNewNotePriority('low');
                setIsSubmittingNote(false);
            }, 1000);
            return [2 /*return*/];
        });
    }); };
    // Get customer coordinates for map
    var getCustomerCoordinates = function () {
        var coordinates = {
            'Pittsburgh': [40.4406, -79.9959],
            'Monroeville': [40.4321, -79.7889],
            'Cranberry Twp': [40.6847, -80.1072],
            'Greensburg': [40.3015, -79.5389],
            'Butler': [40.8612, -79.8953],
            'Washington': [40.1734, -80.2462],
            'Beaver': [40.6953, -80.3109]
        };
        return coordinates[(customer === null || customer === void 0 ? void 0 : customer.city) || 'Pittsburgh'] || [40.4406, -79.9959];
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }) }));
    }
    if (error || !customer) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-12 h-12 text-red-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Failed to load customer data" })] }));
    }
    var customerStatus = customer.status;
    var statusDotClass = customerStatus === 'active'
        ? 'bg-green-500'
        : (customerStatus === 'prospect')
            ? 'bg-yellow-500'
            : 'bg-red-500';
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-2 flex flex-col gap-6 h-full", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)(ui_1.Typography, { variant: "h6", className: "text-purple-900 flex items-center gap-2 text-sm font-semibold", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4" }), "Customer Information"] }), isEditing ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Button, { size: "sm", onClick: handleSaveCustomer, disabled: isSaving, className: "text-xs px-2 py-1 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50", children: isSaving ? 'Saving...' : 'Save' }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", onClick: function () { setEditedCustomer(customer); setIsEditing(false); }, className: "text-xs px-2 py-1 border-purple-300 text-purple-700 hover:bg-purple-50", children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", onClick: function () { return setIsEditing(true); }, className: "text-xs px-2 py-1 border-purple-300 text-purple-700 hover:bg-purple-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "w-3 h-3 mr-1" }), "Edit"] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-medium text-purple-700 mb-1 block", children: "Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: (editedCustomer === null || editedCustomer === void 0 ? void 0 : editedCustomer.name) || '', onChange: function (e) { return handleInputChange('name', e.target.value); }, disabled: !isEditing, className: "w-full text-sm px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-medium text-purple-700 mb-1 block", children: "Phone" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: (editedCustomer === null || editedCustomer === void 0 ? void 0 : editedCustomer.phone) || '', onChange: function (e) { return handleInputChange('phone', e.target.value); }, disabled: !isEditing, className: "w-full text-sm px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-medium text-purple-700 mb-1 block", children: "Email" }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: (editedCustomer === null || editedCustomer === void 0 ? void 0 : editedCustomer.email) || '', onChange: function (e) { return handleInputChange('email', e.target.value); }, disabled: !isEditing, className: "w-full text-sm px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-medium text-purple-700 mb-1 block", children: "Status" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 bg-white px-2 py-1 rounded border border-purple-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 rounded-full ".concat(statusDotClass) }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium capitalize text-purple-700", children: customerStatus })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-3", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-medium text-purple-700 mb-1 block", children: "Address" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Street Address", value: (editedCustomer === null || editedCustomer === void 0 ? void 0 : editedCustomer.address) || '', onChange: function (e) { return handleInputChange('address', e.target.value); }, disabled: !isEditing, className: "w-full text-sm px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 col-span-2" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "City", value: (editedCustomer === null || editedCustomer === void 0 ? void 0 : editedCustomer.city) || '', onChange: function (e) { return handleInputChange('city', e.target.value); }, disabled: !isEditing, className: "w-full text-sm px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "State", value: (editedCustomer === null || editedCustomer === void 0 ? void 0 : editedCustomer.state) || '', onChange: function (e) { return handleInputChange('state', e.target.value); }, disabled: !isEditing, className: "w-full text-sm px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "ZIP Code", value: (editedCustomer === null || editedCustomer === void 0 ? void 0 : editedCustomer.zip_code) || '', onChange: function (e) { return handleInputChange('zip_code', e.target.value); }, disabled: !isEditing, className: "w-full text-sm px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl border border-purple-200 p-4 flex-1 flex flex-col", children: [(0, jsx_runtime_1.jsxs)(ui_1.Typography, { variant: "h6", className: "text-purple-900 flex items-center gap-2 text-sm font-semibold mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-4 h-4" }), "Service Location"] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 rounded-lg overflow-hidden border border-purple-200", children: (0, jsx_runtime_1.jsxs)(react_leaflet_1.MapContainer, { center: getCustomerCoordinates(), zoom: 13, className: "w-full h-full", style: { minHeight: '300px' }, children: [(0, jsx_runtime_1.jsx)(react_leaflet_1.TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }), (0, jsx_runtime_1.jsx)(react_leaflet_1.Marker, { position: getCustomerCoordinates(), children: (0, jsx_runtime_1.jsx)(react_leaflet_1.Popup, { children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-purple-900", children: customer.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: customer.address }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: [customer.city, ", ", customer.state] })] }) }) })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl border border-purple-200 p-4", children: [(0, jsx_runtime_1.jsxs)(ui_1.Typography, { variant: "h6", className: "text-purple-900 flex items-center gap-2 text-sm font-semibold mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "w-4 h-4" }), "Service Locations"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-2 bg-white rounded border border-purple-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-4 h-4 text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-purple-900", children: "Primary Location" })] }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "outline", className: "text-xs bg-green-100 text-green-800 border-green-200", children: "Active" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-2 bg-white rounded border border-purple-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-4 h-4 text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-purple-900", children: "Secondary Location" })] }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "outline", className: "text-xs bg-yellow-100 text-yellow-800 border-yellow-200", children: "Pending" })] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl border border-purple-200 p-4 h-full", children: [(0, jsx_runtime_1.jsxs)(ui_1.Typography, { variant: "h6", className: "text-purple-900 flex items-center gap-2 text-sm font-semibold mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4" }), "Account History"] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-2", children: (0, jsx_runtime_1.jsx)(ui_1.Textarea, { value: newNoteContent, onChange: function (value) { return setNewNoteContent(value); }, placeholder: "Add internal note...", rows: 2, className: "w-full text-sm border-purple-300 bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-medium text-purple-700", children: "Priority:" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-1", children: ['low', 'medium', 'high'].map(function (priority) { return ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-1 text-xs", children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "priority", value: priority, checked: newNotePriority === priority, onChange: function (e) { return setNewNotePriority(e.target.value); }, className: "text-purple-600 focus:ring-purple-500 w-3 h-3" }), (0, jsx_runtime_1.jsx)("span", { className: "text-purple-700 capitalize", children: priority })] }, priority)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Button, { onClick: handleAddNote, disabled: !newNoteContent.trim() || isSubmittingNote, className: "text-xs px-2 py-1 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50", children: isSubmittingNote ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-3 h-3 animate-spin" }) : 'Add Note' }), (0, jsx_runtime_1.jsx)(ui_1.Button, { onClick: function () { return setNewNoteContent(''); }, variant: "outline", className: "text-xs px-2 py-1 border-purple-300 text-purple-700 hover:bg-purple-50", children: "Cancel" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2 max-h-96 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-purple-50 [&::-webkit-scrollbar-thumb]:bg-purple-300 hover:[&::-webkit-scrollbar-thumb]:bg-purple-400", children: noteData.map(function (note) { return ((0, jsx_runtime_1.jsx)("div", { className: "relative p-2 bg-white rounded border border-purple-200 hover:border-purple-300 transition-all duration-200 cursor-pointer group", onClick: function (e) { return handleNoteClick(note, e); }, onMouseEnter: function () { return setHoveredCard(note.id); }, onMouseLeave: function () { return setHoveredCard(null); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1 rounded ".concat(getNoteColor(note.type)), children: getNoteIcon(note.type) }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-medium text-purple-900 truncate", children: note.title })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-purple-700 line-clamp-2", children: note.content }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mt-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-purple-600", children: note.createdBy || note.author }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-purple-500", children: new Date(note.timestamp).toLocaleDateString() })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-xs text-purple-600 transition-all duration-200 ".concat(hoveredCard === note.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsx)("span", { children: "View" })] })] }) }, note.id)); }) })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-orange-50 rounded-xl border border-orange-200 p-4 hover:bg-orange-100 transition-all duration-200", children: [(0, jsx_runtime_1.jsxs)(ui_1.Typography, { variant: "h6", className: "text-orange-900 flex items-center gap-2 text-sm font-semibold mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4" }), "Recent Activity"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-orange-500 rounded-full" }), (0, jsx_runtime_1.jsx)("span", { className: "text-orange-800", children: "Service completed - Jan 15" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-orange-500 rounded-full" }), (0, jsx_runtime_1.jsx)("span", { className: "text-orange-800", children: "Payment received - Jan 10" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-orange-500 rounded-full" }), (0, jsx_runtime_1.jsx)("span", { className: "text-orange-800", children: "Account updated - Jan 9" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-yellow-50 rounded-xl border border-yellow-200 p-4 hover:bg-yellow-100 transition-all duration-200", children: [(0, jsx_runtime_1.jsxs)(ui_1.Typography, { variant: "h6", className: "text-yellow-900 flex items-center gap-2 text-sm font-semibold mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Tag, { className: "w-4 h-4" }), "Tags"] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", children: customerTags.map(function (tag, index) { return ((0, jsx_runtime_1.jsx)(ui_1.Chip, { variant: "outline", className: "text-xs bg-yellow-100 text-yellow-800 border-yellow-300", children: tag }, index)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl border border-purple-200 p-4", children: [(0, jsx_runtime_1.jsxs)(ui_1.Typography, { variant: "h6", className: "text-purple-900 flex items-center gap-2 text-sm font-semibold mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "w-4 h-4" }), "Property Information"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-purple-700", children: "Type:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-purple-900", children: customer.property_type || 'Residential' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-purple-700", children: "Size:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-purple-900", children: customer.property_size || '2,500 sq ft' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-purple-700", children: "Access:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-purple-900", children: customer.access_instructions ? 'Yes' : 'No' })] })] })] })] }), openPopups.map(function (popup) { return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed z-50 bg-white rounded-lg border border-purple-200 shadow-xl p-4 w-80 max-h-96 overflow-y-auto", style: {
                    left: popup.position.x,
                    top: popup.position.y,
                    cursor: popup.isDragging ? 'grabbing' : 'grab'
                }, onMouseDown: function (e) { return handleMouseDown(popup.id, e); }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1 rounded ".concat(getNoteColor(popup.note.type)), children: getNoteIcon(popup.note.type) }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-semibold text-purple-900", children: popup.note.title })] }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "ghost", size: "sm", onClick: function () { return setOpenPopups(function (prev) { return prev.filter(function (p) { return p.id !== popup.id; }); }); }, className: "text-purple-600 hover:text-purple-800 p-1", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-3", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-purple-700 leading-relaxed", children: popup.note.content }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs text-purple-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-3 h-3" }), popup.note.createdBy || popup.note.author] }), (0, jsx_runtime_1.jsx)("span", { children: new Date(popup.note.timestamp).toLocaleString() })] }), popup.note.priority && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsxs)(ui_1.Badge, { variant: "outline", className: "text-xs ".concat(getPriorityColor(popup.note.priority)), children: [popup.note.priority.charAt(0).toUpperCase() + popup.note.priority.slice(1), " Priority"] }) }))] }, popup.id)); })] }));
};
// Helper functions
var getNoteIcon = function (type) {
    switch (type) {
        case 'service':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4" });
        case 'internal':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.MessageSquare, { className: "w-4 h-4" });
        case 'email':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-4 h-4" });
        case 'phone':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-4 h-4" });
        case 'invoice':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-4 h-4" });
        case 'payment':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "w-4 h-4" });
        case 'account':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4" });
        default:
            return (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4" });
    }
};
var getNoteColor = function (type) {
    switch (type) {
        case 'service':
            return 'bg-blue-100 text-blue-800';
        case 'internal':
            return 'bg-purple-100 text-purple-800';
        case 'email':
            return 'bg-green-100 text-green-800';
        case 'phone':
            return 'bg-orange-100 text-orange-800';
        case 'invoice':
            return 'bg-yellow-100 text-yellow-800';
        case 'payment':
            return 'bg-emerald-100 text-emerald-800';
        case 'account':
            return 'bg-purple-100 text-purple-800';
        default:
            return 'bg-purple-100 text-purple-800';
    }
};
var getPriorityColor = function (priority) {
    switch (priority) {
        case 'high':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'low':
            return 'bg-green-100 text-green-800 border-green-200';
        default:
            return 'bg-purple-100 text-purple-800 border-purple-200';
    }
};
exports.default = CustomerOverview;
