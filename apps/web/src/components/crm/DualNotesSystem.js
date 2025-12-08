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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DualNotesSystem;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Textarea_1 = __importDefault(require("@/components/ui/Textarea"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
function DualNotesSystem(_a) {
    var notes = _a.notes, _customerId = _a.customerId, isLoading = _a.isLoading;
    var _b = (0, react_1.useState)('internal'), activeTab = _b[0], setActiveTab = _b[1];
    var _c = (0, react_1.useState)(false), showNewNoteModal = _c[0], setShowNewNoteModal = _c[1];
    var _d = (0, react_1.useState)(null), selectedNote = _d[0], setSelectedNote = _d[1];
    var _e = (0, react_1.useState)({
        note_type: 'general',
        note_source: 'office',
        note_content: '',
        priority: 'low',
        is_alert: false,
        is_internal: true
    }), newNote = _e[0], setNewNote = _e[1];
    var getNoteSourceIcon = function (source) {
        switch (source.toLowerCase()) {
            case 'office': return lucide_react_1.User;
            case 'field': return lucide_react_1.MapPin;
            case 'mobile_app': return lucide_react_1.Smartphone;
            default: return lucide_react_1.FileText;
        }
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    var handleCreateNote = function () {
        // Mock create note functionality
        logger_1.logger.debug('Creating note', { noteType: newNote.note_type, priority: newNote.priority }, 'DualNotesSystem');
        setShowNewNoteModal(false);
        setNewNote({
            note_type: 'general',
            note_source: 'office',
            note_content: '',
            priority: 'low',
            is_alert: false,
            is_internal: true
        });
    };
    var internalNotes = notes.filter(function (note) { return note.is_internal; });
    var technicianNotes = notes.filter(function (note) { return !note.is_internal; });
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsx)("div", { className: "text-center py-8", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-slate-600", children: "Loading notes..." }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-slate-900", children: "Notes & Communication" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", onClick: function () { return setShowNewNoteModal(true); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-1" }), "Add Note"] })] }), (0, jsx_runtime_1.jsxs)(ui_1.Tabs, { value: activeTab, onValueChange: setActiveTab, children: [(0, jsx_runtime_1.jsxs)(ui_1.TabsList, { className: "flex gap-2 mb-6 border-b border-slate-200", children: [(0, jsx_runtime_1.jsxs)(ui_1.TabsTrigger, { value: "internal", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4" }), "Internal Notes (", internalNotes.length, ")"] }), (0, jsx_runtime_1.jsxs)(ui_1.TabsTrigger, { value: "technician", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Smartphone, { className: "h-4 w-4" }), "Technician Notes (", technicianNotes.length, ")"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: (activeTab === 'internal' ? internalNotes : technicianNotes).length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-12 w-12 text-slate-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "text-slate-900 mb-2", children: ["No ", activeTab === 'internal' ? 'Internal' : 'Technician', " Notes"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-slate-600", children: activeTab === 'internal'
                                                ? 'No internal notes have been added yet.'
                                                : 'No technician notes have been added yet.' })] })) : ((activeTab === 'internal' ? internalNotes : technicianNotes).map(function (note) {
                                    var SourceIcon = getNoteSourceIcon(note.note_source);
                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ".concat(note.is_alert ? 'border-red-200 bg-red-50' : 'border-slate-200'), onClick: function () { return setSelectedNote(note); }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(SourceIcon, { className: "h-4 w-4 text-slate-500" }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", children: note.note_type }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: note.priority === 'high' ? 'destructive' : 'secondary', children: note.priority }), note.is_alert && ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-red-500" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-sm text-slate-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: formatDate(note.created_at) })] })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-slate-800 mb-3", children: note.note_content }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-slate-600", children: ["By: ", note.created_by] }), note.location_coords && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-sm text-slate-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { children: ["GPS: ", note.location_coords] })] }))] })] }, note.id));
                                })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 grid grid-cols-2 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "flex flex-col items-center p-4 h-auto", onClick: function () {
                                    setNewNote(__assign(__assign({}, newNote), { note_type: 'general', is_internal: true }));
                                    setShowNewNoteModal(true);
                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-6 w-6 mb-2 text-slate-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "General Note" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "flex flex-col items-center p-4 h-auto", onClick: function () {
                                    setNewNote(__assign(__assign({}, newNote), { note_type: 'safety', is_alert: true, is_internal: true }));
                                    setShowNewNoteModal(true);
                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-6 w-6 mb-2 text-red-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Safety Alert" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "flex flex-col items-center p-4 h-auto", onClick: function () {
                                    setNewNote(__assign(__assign({}, newNote), { note_type: 'preference', is_internal: true }));
                                    setShowNewNoteModal(true);
                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-6 w-6 mb-2 text-green-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Customer Preference" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "flex flex-col items-center p-4 h-auto", onClick: function () {
                                    setNewNote(__assign(__assign({}, newNote), { note_type: 'technician', is_internal: false }));
                                    setShowNewNoteModal(true);
                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Smartphone, { className: "h-6 w-6 mb-2 text-blue-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Field Note" })] })] })] }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showNewNoteModal, onOpenChange: function (open) { return !open && setShowNewNoteModal(false); }, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(ui_1.DialogTitle, { children: "Add New Note" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-2", children: "Note Type" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-2", children: ['general', 'safety', 'preference', 'property', 'technician'].map(function (type) { return ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: newNote.note_type === type ? "primary" : "outline", onClick: function () { return setNewNote(__assign(__assign({}, newNote), { note_type: type })); }, className: "justify-start", children: type.charAt(0).toUpperCase() + type.slice(1) }, type)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-2", children: "Note Source" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-3 gap-2", children: ['office', 'field', 'mobile_app'].map(function (source) { return ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: newNote.note_source === source ? "primary" : "outline", onClick: function () { return setNewNote(__assign(__assign({}, newNote), { note_source: source })); }, className: "justify-start", children: source.replace('_', ' ').charAt(0).toUpperCase() + source.replace('_', ' ').slice(1) }, source)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-2", children: "Priority" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-3 gap-2", children: ['low', 'medium', 'high'].map(function (priority) { return ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: newNote.priority === priority ? "primary" : "outline", onClick: function () { return setNewNote(__assign(__assign({}, newNote), { priority: priority })); }, className: "justify-start", children: priority.charAt(0).toUpperCase() + priority.slice(1) }, priority)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-2", children: "Note Content" }), (0, jsx_runtime_1.jsx)(Textarea_1.default, { value: newNote.note_content, onChange: function (e) { return setNewNote(__assign(__assign({}, newNote), { note_content: e.target.value })); }, placeholder: "Enter your note content...", rows: 6 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: newNote.is_alert, onChange: function (e) { return setNewNote(__assign(__assign({}, newNote), { is_alert: e.target.checked })); }, className: "rounded" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Mark as alert/warning" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: newNote.is_internal, onChange: function (e) { return setNewNote(__assign(__assign({}, newNote), { is_internal: e.target.checked })); }, className: "rounded" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Internal note (not customer-facing)" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Camera, { className: "h-4 w-4 mr-1" }), "Attach Photo"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mic, { className: "h-4 w-4 mr-1" }), "Voice Note"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 justify-end", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowNewNoteModal(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { onClick: handleCreateNote, disabled: !newNote.note_content, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-1" }), "Add Note"] })] })] })] }) }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: !!selectedNote, onOpenChange: function (open) { return !open && setSelectedNote(null); }, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(ui_1.DialogTitle, { children: "Note Details" }) }), selectedNote && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Note Type" }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", children: selectedNote.note_type })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Priority" }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: selectedNote.priority === 'high' ? 'destructive' : 'secondary', children: selectedNote.priority })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Source" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedNote.note_source })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Created By" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedNote.created_by })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-2", children: "Content" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedNote.note_content })] }), selectedNote.location_coords && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-2", children: "Location" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-4 w-4 text-slate-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedNote.location_coords })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 justify-end", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setSelectedNote(null); }, children: "Close" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4 mr-1" }), "Edit Note"] })] })] }))] }) })] }));
}
