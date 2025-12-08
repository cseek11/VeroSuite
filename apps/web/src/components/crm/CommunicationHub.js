"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CommunicationHub;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Textarea_1 = __importDefault(require("@/components/ui/Textarea"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
function CommunicationHub(_a) {
    var _customerId = _a.customerId;
    var _b = (0, react_1.useState)(''), selectedCommunicationType = _b[0], setSelectedCommunicationType = _b[1];
    var _c = (0, react_1.useState)(''), message = _c[0], setMessage = _c[1];
    var _d = (0, react_1.useState)(''), subject = _d[0], setSubject = _d[1];
    var _e = (0, react_1.useState)(false), showNewMessageModal = _e[0], setShowNewMessageModal = _e[1];
    // Mock communication logs
    var communicationLogs = [
        {
            id: '1',
            communication_type: 'call',
            direction: 'inbound',
            subject: 'Service inquiry',
            message_content: 'Customer called to ask about scheduling a termite inspection.',
            staff_member: 'John Smith',
            timestamp: '2024-01-20T10:30:00Z',
            follow_up_required: true,
            follow_up_date: '2024-01-22'
        },
        {
            id: '2',
            communication_type: 'email',
            direction: 'outbound',
            subject: 'Service confirmation',
            message_content: 'Thank you for choosing our services. Your appointment has been confirmed for January 25th at 2:00 PM.',
            staff_member: 'Sarah Johnson',
            timestamp: '2024-01-19T14:15:00Z',
            follow_up_required: false
        },
        {
            id: '3',
            communication_type: 'sms',
            direction: 'outbound',
            subject: 'Appointment reminder',
            message_content: 'Reminder: Your pest control service is scheduled for tomorrow at 2:00 PM. Please ensure access to the property.',
            staff_member: 'System',
            timestamp: '2024-01-18T09:00:00Z',
            follow_up_required: false
        }
    ];
    var getCommunicationTypeIcon = function (type) {
        switch (type.toLowerCase()) {
            case 'call': return lucide_react_1.Phone;
            case 'email': return lucide_react_1.Mail;
            case 'sms': return lucide_react_1.MessageCircle;
            case 'in-person': return lucide_react_1.User;
            default: return lucide_react_1.MessageCircle;
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
    var handleSendMessage = function () {
        // Mock send functionality
        logger_1.logger.debug('Sending message', {
            communicationType: selectedCommunicationType,
            hasSubject: !!subject,
            messageLength: message.length
        }, 'CommunicationHub');
        setShowNewMessageModal(false);
        setMessage('');
        setSubject('');
        setSelectedCommunicationType('');
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-slate-900", children: "Communication Hub" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", onClick: function () { return setShowNewMessageModal(true); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Send, { className: "h-4 w-4 mr-1" }), "New Message"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: communicationLogs.map(function (log) {
                            var IconComponent = getCommunicationTypeIcon(log.communication_type);
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4 p-4 rounded-lg border ".concat(log.direction === 'inbound'
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-green-50 border-green-200'), children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full ".concat(log.direction === 'inbound'
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-green-100 text-green-600'), children: (0, jsx_runtime_1.jsx)(IconComponent, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: log.communication_type.charAt(0).toUpperCase() + log.communication_type.slice(1) }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: log.direction === 'inbound' ? 'default' : 'secondary', children: log.direction }), log.follow_up_required && ((0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "destructive", children: "Follow-up Required" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-sm text-slate-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: formatDate(log.timestamp) })] })] }), log.subject && ((0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-800 mb-2", children: log.subject })), log.message_content && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-slate-700 mb-2", children: log.message_content })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: log.staff_member }), log.follow_up_required && log.follow_up_date && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-sm text-red-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Follow-up: ", new Date(log.follow_up_date).toLocaleDateString()] })] }))] })] })] }, log.id));
                        }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 grid grid-cols-2 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "flex flex-col items-center p-4 h-auto", onClick: function () {
                                    setSelectedCommunicationType('call');
                                    setShowNewMessageModal(true);
                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-6 w-6 mb-2 text-blue-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Call Customer" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "flex flex-col items-center p-4 h-auto", onClick: function () {
                                    setSelectedCommunicationType('email');
                                    setShowNewMessageModal(true);
                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-6 w-6 mb-2 text-green-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Send Email" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "flex flex-col items-center p-4 h-auto", onClick: function () {
                                    setSelectedCommunicationType('sms');
                                    setShowNewMessageModal(true);
                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { className: "h-6 w-6 mb-2 text-purple-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Send SMS" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "flex flex-col items-center p-4 h-auto", onClick: function () {
                                    setSelectedCommunicationType('in-person');
                                    setShowNewMessageModal(true);
                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-6 w-6 mb-2 text-orange-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "In-Person" })] })] })] }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showNewMessageModal, onOpenChange: function (open) { return !open && setShowNewMessageModal(false); }, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsxs)(ui_1.DialogTitle, { children: ["New ", selectedCommunicationType ? selectedCommunicationType.charAt(0).toUpperCase() + selectedCommunicationType.slice(1) : 'Communication'] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [!selectedCommunicationType && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-2", children: "Communication Type" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "flex flex-col items-center p-4 h-auto", onClick: function () { return setSelectedCommunicationType('call'); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-6 w-6 mb-2 text-blue-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Call" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "flex flex-col items-center p-4 h-auto", onClick: function () { return setSelectedCommunicationType('email'); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-6 w-6 mb-2 text-green-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Email" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "flex flex-col items-center p-4 h-auto", onClick: function () { return setSelectedCommunicationType('sms'); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { className: "h-6 w-6 mb-2 text-purple-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "SMS" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "flex flex-col items-center p-4 h-auto", onClick: function () { return setSelectedCommunicationType('in-person'); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-6 w-6 mb-2 text-orange-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "In-Person" })] })] })] })), selectedCommunicationType && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [selectedCommunicationType === 'email' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-2", children: "Subject" }), (0, jsx_runtime_1.jsx)(Input_1.default, { value: subject, onChange: function (e) { return setSubject(e.target.value); }, placeholder: "Enter subject..." })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-2", children: "Message" }), (0, jsx_runtime_1.jsx)(Textarea_1.default, { value: message, onChange: function (e) { return setMessage(e.target.value); }, placeholder: "Enter your ".concat(selectedCommunicationType, " message..."), rows: 6 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Paperclip, { className: "h-4 w-4 mr-1" }), "Attach File"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Camera, { className: "h-4 w-4 mr-1" }), "Photo"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Video, { className: "h-4 w-4 mr-1" }), "Video"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", className: "rounded" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", children: "Requires follow-up" })] }), (0, jsx_runtime_1.jsx)("input", { type: "date", className: "p-2 border border-slate-300 rounded-md", placeholder: "Follow-up date" })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 justify-end", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () {
                                                setShowNewMessageModal(false);
                                                setMessage('');
                                                setSubject('');
                                                setSelectedCommunicationType('');
                                            }, children: "Cancel" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { onClick: handleSendMessage, disabled: !selectedCommunicationType || !message, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Send, { className: "h-4 w-4 mr-1" }), "Send ", selectedCommunicationType ? selectedCommunicationType.charAt(0).toUpperCase() + selectedCommunicationType.slice(1) : 'Message'] })] })] })] }) })] }));
}
