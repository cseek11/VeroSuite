"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var ui_1 = require("@/components/ui");
var logger_1 = require("@/utils/logger");
var CustomerCommunications = function (_a) {
    var _customerId = _a.customerId;
    var _b = (0, react_1.useState)('messages'), activeTab = _b[0], setActiveTab = _b[1];
    var _c = (0, react_1.useState)(''), newMessage = _c[0], setNewMessage = _c[1];
    var communications = [
        {
            id: 1,
            type: 'email',
            date: '2024-01-02',
            time: '10:30 AM',
            subject: 'Service Reminder - Quarterly Pest Control',
            content: 'Hi John, this is a reminder that your quarterly pest control service is scheduled for January 15th at 9:00 AM. Please ensure access to your property.',
            status: 'sent',
            direction: 'outbound'
        },
        {
            id: 2,
            type: 'phone',
            date: '2023-12-28',
            time: '2:15 PM',
            subject: 'Payment Confirmation Call',
            content: 'Called to confirm payment of $300.00 received. Customer was satisfied with recent service.',
            status: 'completed',
            direction: 'inbound'
        },
        {
            id: 3,
            type: 'sms',
            date: '2023-12-20',
            time: '9:45 AM',
            subject: 'Service Completion Notification',
            content: 'Your pest control service has been completed. Technician Mike Johnson finished at 9:30 AM. Thank you for choosing our services!',
            status: 'sent',
            direction: 'outbound'
        },
        {
            id: 4,
            type: 'email',
            date: '2023-12-15',
            time: '11:20 AM',
            subject: 'Emergency Service Request',
            content: 'Customer reported spider infestation in basement. Emergency service scheduled for tomorrow.',
            status: 'sent',
            direction: 'inbound'
        }
    ];
    var getTypeIcon = function (type) {
        switch (type) {
            case 'email':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-4 h-4" });
            case 'phone':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-4 h-4" });
            case 'sms':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.MessageSquare, { className: "w-4 h-4" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.MessageSquare, { className: "w-4 h-4" });
        }
    };
    var getTypeColor = function (type) {
        switch (type) {
            case 'email':
                return 'bg-blue-500';
            case 'phone':
                return 'bg-green-500';
            case 'sms':
                return 'bg-purple-500';
            default:
                return 'bg-gray-500';
        }
    };
    var getDirectionColor = function (direction) {
        return direction === 'outbound' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
    };
    var handleSendMessage = function () {
        if (newMessage.trim()) {
            // Here you would typically send the message via API
            logger_1.logger.debug('Sending message', { messageLength: newMessage.length }, 'CustomerCommunications');
            setNewMessage('');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h3", className: "text-lg font-semibold text-gray-900", children: "Communications" }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { size: "sm", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4" }), "New Message"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-1 bg-gray-100 rounded-lg p-1", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab('messages'); }, className: "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ".concat(activeTab === 'messages'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'), children: ["Messages (", communications.length, ")"] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setActiveTab('compose'); }, className: "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ".concat(activeTab === 'compose'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'), children: "Compose" })] }), activeTab === 'messages' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: communications.map(function (comm) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 ".concat(getTypeColor(comm.type), " rounded-lg flex items-center justify-center"), children: getTypeIcon(comm.type) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: comm.subject }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 text-xs rounded-full ".concat(getDirectionColor(comm.direction)), children: comm.direction === 'outbound' ? 'Sent' : 'Received' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: [new Date(comm.date).toLocaleDateString(), " at ", comm.time] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-700 mb-3", children: comm.content }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [comm.status === 'sent' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-3 h-3 text-green-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-3 h-3 text-yellow-500" })), comm.status.charAt(0).toUpperCase() + comm.status.slice(1)] }), (0, jsx_runtime_1.jsx)("span", { className: "capitalize", children: comm.type })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-3", children: [(0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", children: "Reply" }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", children: "Forward" }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", children: "View Details" })] })] }, comm.id)); }) })), activeTab === 'compose' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900 mb-4", children: "Send New Message" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Message Type" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-4 h-4" }), "Email"] }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageSquare, { className: "w-4 h-4" }), "SMS"] }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-4 h-4" }), "Call"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Subject" }), (0, jsx_runtime_1.jsx)(ui_1.Input, { placeholder: "Enter subject...", value: "", onChange: function () { }, className: "w-full" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Message" }), (0, jsx_runtime_1.jsx)(ui_1.Textarea, { placeholder: "Type your message here...", value: newMessage, onChange: function (value) { return setNewMessage(value); }, rows: 4, className: "w-full" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)(ui_1.Button, { onClick: handleSendMessage, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Send, { className: "w-4 h-4" }), "Send Message"] }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", children: "Save Draft" }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", children: "Schedule" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900 mb-3", children: "Quick Templates" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", className: "text-left justify-start", children: "Service Reminder" }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", className: "text-left justify-start", children: "Payment Reminder" }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", className: "text-left justify-start", children: "Follow-up Call" }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", className: "text-left justify-start", children: "Emergency Contact" })] })] })] }))] }));
};
exports.default = CustomerCommunications;
