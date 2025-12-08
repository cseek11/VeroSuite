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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var ui_1 = require("@/components/ui");
var react_query_1 = require("@tanstack/react-query");
// Note: enhancedApi not used - customerNotes API not available
var logger_1 = require("@/utils/logger");
var CustomerNotesHistory = function (_a) {
    var customerId = _a.customerId;
    var _b = (0, react_1.useState)(''), newNoteContent = _b[0], setNewNoteContent = _b[1];
    var _c = (0, react_1.useState)('low'), newNotePriority = _c[0], setNewNotePriority = _c[1];
    var _d = (0, react_1.useState)(false), showAddNoteModal = _d[0], setShowAddNoteModal = _d[1];
    var _e = (0, react_1.useState)(false), isSubmittingNote = _e[0], setIsSubmittingNote = _e[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch notes from API
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['customer-notes', customerId],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Note: customerNotes API not available in enhancedApi
                // Return empty array as fallback
                return [2 /*return*/, []];
            });
        }); },
    }), notesData = _f.data, notesLoading = _f.isLoading, notesError = _f.error;
    // Create note mutation
    var createNoteMutation = (0, react_query_1.useMutation)({
        mutationFn: function (noteData) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Note: customerNotes API not available in enhancedApi
                // Return mock response
                return [2 /*return*/, Promise.resolve({
                        id: "note-".concat(Date.now()),
                        customer_id: customerId,
                        note_type: 'internal',
                        note_source: 'office',
                        note_content: noteData.content,
                        priority: noteData.priority,
                        is_alert: false,
                        is_internal: true,
                        created_at: new Date().toISOString(),
                        created_by: 'system'
                    })];
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['customer-notes', customerId] });
            setNewNoteContent('');
            setNewNotePriority('low');
            setShowAddNoteModal(false);
            setIsSubmittingNote(false);
        },
        onError: function (error) {
            logger_1.logger.error('Error creating note', error, 'CustomerNotesHistory');
            setIsSubmittingNote(false);
        },
    });
    var handleAddNote = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!newNoteContent.trim())
                return [2 /*return*/];
            setIsSubmittingNote(true);
            createNoteMutation.mutate({
                content: newNoteContent,
                priority: newNotePriority,
            });
            return [2 /*return*/];
        });
    }); };
    var handleCancelAddNote = function () {
        setNewNoteContent('');
        setNewNotePriority('low');
        setShowAddNoteModal(false);
    };
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
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4" });
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
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var getPriorityColor = function (priority) {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
    // Transform API data to match the component's expected format
    var transformedNotes = (notesData === null || notesData === void 0 ? void 0 : notesData.map(function (note) { return ({
        id: note.id,
        type: note.note_type,
        title: "Internal Note - ".concat(note.priority, " Priority"),
        content: note.note_content,
        author: note.created_by,
        timestamp: note.created_at,
        priority: note.priority,
        status: note.is_alert ? 'alert' : undefined
    }); })) || [];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Account Notes History" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "View and manage all customer interactions and notes" })] }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { onClick: function () { return setShowAddNoteModal(true); }, className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4" }), "Add Internal Note"] })] }), notesLoading && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Loading notes..." })] })), notesError && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-12 h-12 text-red-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Error Loading Notes" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Failed to load notes. Please try again." })] })), !notesLoading && !notesError && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: transformedNotes.map(function (note) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-lg ".concat(getNoteColor(note.type)), children: getNoteIcon(note.type) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: note.title }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mt-1", children: [(0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "outline", className: getNoteColor(note.type), children: note.type.charAt(0).toUpperCase() + note.type.slice(1) }), note.priority && ((0, jsx_runtime_1.jsxs)(ui_1.Badge, { variant: "outline", className: getPriorityColor(note.priority), children: [note.priority.charAt(0).toUpperCase() + note.priority.slice(1), " Priority"] })), note.status && ((0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "outline", className: "bg-red-100 text-red-800", children: "Alert" }))] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4" }), formatDate(note.timestamp)] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-3", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-700 text-sm leading-relaxed", children: note.content }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-3 h-3" }), note.author] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: note.priority === 'high' && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-red-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-3 h-3" }), "High Priority"] })) })] })] }, note.id)); }) })), !notesLoading && !notesError && transformedNotes.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No Notes Found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Start by adding an internal note or wait for system-generated notes." })] })), showAddNoteModal && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-6 w-full max-w-md mx-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-purple-900 mb-4", children: "Add Internal Note" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-purple-700 mb-2", children: "Note Content" }), (0, jsx_runtime_1.jsx)(ui_1.Textarea, { value: newNoteContent, onChange: function (value) { return setNewNoteContent(value); }, placeholder: "Enter your internal note...", rows: 4, className: "w-full border-purple-300 bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-purple-700 mb-2", children: "Priority" }), (0, jsx_runtime_1.jsxs)("select", { value: newNotePriority, onChange: function (e) { return setNewNotePriority(e.target.value); }, className: "w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white", children: [(0, jsx_runtime_1.jsx)("option", { value: "low", children: "Low" }), (0, jsx_runtime_1.jsx)("option", { value: "medium", children: "Medium" }), (0, jsx_runtime_1.jsx)("option", { value: "high", children: "High" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 mt-6", children: [(0, jsx_runtime_1.jsxs)(ui_1.Button, { onClick: handleAddNote, disabled: !newNoteContent.trim() || isSubmittingNote, className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl flex items-center gap-2", children: [isSubmittingNote ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-4 w-4 animate-spin" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Send, { className: "h-4 w-4" })), isSubmittingNote ? 'Creating...' : 'Create Note'] }), (0, jsx_runtime_1.jsx)(ui_1.Button, { onClick: handleCancelAddNote, disabled: isSubmittingNote, className: "px-4 py-2 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all duration-200 font-medium text-purple-700 hover:border-purple-400", children: "Cancel" })] })] }) }))] }));
};
exports.default = CustomerNotesHistory;
