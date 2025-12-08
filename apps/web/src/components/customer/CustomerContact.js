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
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var ui_1 = require("@/components/ui");
var CustomerContact = function (_a) {
    var _customerId = _a.customerId;
    var _b = (0, react_1.useState)(false), isEditing = _b[0], setIsEditing = _b[1];
    var _c = (0, react_1.useState)([
        {
            id: 1,
            name: 'John Smith',
            title: 'Primary Contact',
            phone: '+1 (555) 123-4567',
            email: 'john.smith@email.com',
            type: 'primary'
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            title: 'Billing Contact',
            phone: '+1 (555) 987-6543',
            email: 'billing@company.com',
            type: 'billing'
        }
    ]), contacts = _c[0], setContacts = _c[1];
    var _d = (0, react_1.useState)({
        name: '',
        title: '',
        phone: '',
        email: '',
        type: 'additional'
    }), newContact = _d[0], setNewContact = _d[1];
    var handleSave = function () {
        if (newContact.name && newContact.phone) {
            setContacts(__spreadArray(__spreadArray([], contacts, true), [__assign(__assign({}, newContact), { id: Date.now() })], false));
            setNewContact({ name: '', title: '', phone: '', email: '', type: 'additional' });
        }
        setIsEditing(false);
    };
    var handleDelete = function (id) {
        setContacts(contacts.filter(function (contact) { return contact.id !== id; }));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h3", className: "text-lg font-semibold text-gray-900", children: "Contact Information" }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", onClick: function () { return setIsEditing(!isEditing); }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit2, { className: "w-4 h-4" }), isEditing ? 'Cancel' : 'Edit'] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-5 h-5 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-gray-900", children: "Primary Contact" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Main point of contact" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-4 h-4 text-gray-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700", children: "+1 (555) 123-4567" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-4 h-4 text-gray-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700", children: "john.smith@email.com" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h4", className: "text-md font-medium text-gray-900", children: "Additional Contacts" }), isEditing && ((0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", onClick: handleSave, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4" }), "Add Contact"] }))] }), contacts.filter(function (c) { return c.type !== 'primary'; }).map(function (contact) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-3 border border-gray-200/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h5", { className: "font-medium text-gray-900", children: contact.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: contact.title })] }), isEditing && ((0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "ghost", size: "sm", onClick: function () { return handleDelete(contact.id); }, className: "text-red-500 hover:text-red-700 hover:bg-red-50", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4" }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-3 h-3 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: contact.phone })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-3 h-3 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: contact.email })] })] })] }, contact.id)); }), isEditing && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-lg p-4 border border-gray-200/50", children: [(0, jsx_runtime_1.jsx)("h5", { className: "font-medium text-gray-900 mb-3", children: "Add New Contact" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [(0, jsx_runtime_1.jsx)(ui_1.Input, { placeholder: "Name", value: newContact.name, onChange: function (value) { return setNewContact(__assign(__assign({}, newContact), { name: value })); }, className: "text-sm" }), (0, jsx_runtime_1.jsx)(ui_1.Input, { placeholder: "Title", value: newContact.title, onChange: function (value) { return setNewContact(__assign(__assign({}, newContact), { title: value })); }, className: "text-sm" }), (0, jsx_runtime_1.jsx)(ui_1.Input, { placeholder: "Phone", value: newContact.phone, onChange: function (value) { return setNewContact(__assign(__assign({}, newContact), { phone: value })); }, className: "text-sm" }), (0, jsx_runtime_1.jsx)(ui_1.Input, { placeholder: "Email", value: newContact.email, onChange: function (value) { return setNewContact(__assign(__assign({}, newContact), { email: value })); }, className: "text-sm" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-3", children: [(0, jsx_runtime_1.jsx)(ui_1.Button, { size: "sm", onClick: handleSave, children: "Save Contact" }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", onClick: function () { return setNewContact({ name: '', title: '', phone: '', email: '', type: 'additional' }); }, children: "Clear" })] })] }))] })] }));
};
exports.default = CustomerContact;
