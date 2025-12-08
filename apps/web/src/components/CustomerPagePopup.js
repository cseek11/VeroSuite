"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var react_query_1 = require("@tanstack/react-query");
var enhanced_api_1 = require("@/lib/enhanced-api");
var ui_1 = require("@/components/ui");
var CustomerOverviewPopup_1 = __importDefault(require("./customer/CustomerOverviewPopup"));
var CustomerContact_1 = __importDefault(require("./customer/CustomerContact"));
var CustomerServices_1 = __importDefault(require("./customer/CustomerServices"));
var CustomerFinancials_1 = __importDefault(require("./customer/CustomerFinancials"));
var CustomerCommunications_1 = __importDefault(require("./customer/CustomerCommunications"));
var CustomerDocuments_1 = __importDefault(require("./customer/CustomerDocuments"));
var CustomerAnalytics_1 = __importDefault(require("./customer/CustomerAnalytics"));
var CustomerSettings_1 = __importDefault(require("./customer/CustomerSettings"));
var CustomerNotesHistory_1 = __importDefault(require("./customer/CustomerNotesHistory"));
var CustomerPagePopup = function (_a) {
    var customerId = _a.customerId, isOpen = _a.isOpen, onClose = _a.onClose;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = (0, react_1.useState)('overview'), activeTab = _b[0], setActiveTab = _b[1];
    var _c = (0, react_1.useState)({ x: 0, y: 0 }), position = _c[0], setPosition = _c[1];
    var _d = (0, react_1.useState)({ width: 720, height: 480 }), size = _d[0], setSize = _d[1]; // Default size
    var _e = (0, react_1.useState)(false), isDragging = _e[0], setIsDragging = _e[1];
    var _f = (0, react_1.useState)(false), isResizing = _f[0], setIsResizing = _f[1];
    var _g = (0, react_1.useState)({ x: 0, y: 0 }), dragOffset = _g[0], setDragOffset = _g[1];
    var _h = (0, react_1.useState)({ x: 0, y: 0, width: 0, height: 0 }), resizeStart = _h[0], setResizeStart = _h[1];
    var popupRef = (0, react_1.useRef)(null);
    var headerRef = (0, react_1.useRef)(null);
    // Fetch customer data for header
    var _j = (0, react_query_1.useQuery)({
        queryKey: ['customer', customerId],
        queryFn: function () { return enhanced_api_1.enhancedApi.customers.getById(customerId); },
        enabled: !!customerId && isOpen
    }), customer = _j.data, isLoading = _j.isLoading;
    // Handle mouse down for dragging
    var handleMouseDown = function (e) {
        var _a;
        if (e.target !== headerRef.current && !((_a = headerRef.current) === null || _a === void 0 ? void 0 : _a.contains(e.target))) {
            return;
        }
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };
    // Handle mouse move for dragging
    var handleMouseMove = function (e) {
        if (isDragging) {
            var newX = e.clientX - dragOffset.x;
            var newY = e.clientY - dragOffset.y;
            // Allow popup to move freely without strict boundary constraints
            setPosition({
                x: newX,
                y: newY
            });
        }
        if (isResizing) {
            var deltaX = e.clientX - resizeStart.x;
            var deltaY = e.clientY - resizeStart.y;
            var newWidth = Math.max(400, Math.min(1200, resizeStart.width + deltaX));
            var newHeight = Math.max(400, Math.min(800, resizeStart.height + deltaY));
            setSize({ width: newWidth, height: newHeight });
        }
    };
    // Handle mouse up
    var handleMouseUp = function () {
        setIsDragging(false);
        setIsResizing(false);
    };
    // Handle resize start
    var handleResizeStart = function (e) {
        e.stopPropagation();
        setIsResizing(true);
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height
        });
    };
    // Handle expand to main content
    var handleExpand = function () {
        onClose(); // Close the popup
        navigate("/customers/".concat(customerId)); // Navigate to the full customer page
    };
    // Add/remove event listeners
    (0, react_1.useEffect)(function () {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return function () {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
        return undefined;
    }, [isDragging, isResizing, dragOffset, resizeStart, size.width, size.height]);
    // Reset position when popup opens
    (0, react_1.useEffect)(function () {
        if (isOpen) {
            setPosition({ x: 0, y: 0 });
            setSize({ width: 720, height: 480 });
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    var tabs = [
        { id: 'overview', label: 'Overview', icon: lucide_react_1.User },
        { id: 'contact', label: 'Contact', icon: lucide_react_1.Phone },
        { id: 'services', label: 'Services', icon: lucide_react_1.Calendar },
        { id: 'financials', label: 'Financials', icon: lucide_react_1.DollarSign },
        { id: 'communications', label: 'Messages', icon: lucide_react_1.MessageSquare },
        { id: 'documents', label: 'Documents', icon: lucide_react_1.FileText },
        { id: 'notes', label: 'History', icon: lucide_react_1.FileText },
        { id: 'analytics', label: 'Analytics', icon: lucide_react_1.BarChart3 },
        { id: 'settings', label: 'Settings', icon: lucide_react_1.Settings },
    ];
    var popupContent = ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 flex items-center justify-center p-4 z-[9999]", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { ref: popupRef, className: "bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col", style: {
                width: size.width,
                height: size.height,
                transform: "translate(".concat(position.x, "px, ").concat(position.y, "px)"),
                cursor: isDragging ? 'grabbing' : 'default'
            }, onClick: function (e) { return e.stopPropagation(); }, children: [(0, jsx_runtime_1.jsxs)("div", { ref: headerRef, className: "flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200 cursor-grab active:cursor-grabbing select-none", onMouseDown: handleMouseDown, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "w-3 h-3 text-gray-400 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center shadow-sm flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-3 h-3 text-white" }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 min-w-0", children: isLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-32 mb-1" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 bg-gray-200 rounded w-40" })] })) : customer ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-semibold text-gray-900 truncate", children: customer.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-2 text-xs text-gray-600", children: [customer.address && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-2.5 h-2.5" }), (0, jsx_runtime_1.jsxs)("span", { className: "truncate", children: [customer.address, ", ", customer.city, ", ", customer.state, " ", customer.zip_code] })] })), customer.phone && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-2.5 h-2.5" }), (0, jsx_runtime_1.jsx)("span", { children: customer.phone })] })), customer.email && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-2.5 h-2.5" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: customer.email })] }))] })] })) : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-semibold text-gray-900", children: "Customer Not Found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "Unable to load customer information" })] })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleExpand, className: "p-1 text-gray-400 hover:text-gray-600 hover:bg-white/20 rounded transition-all duration-200 flex-shrink-0", title: "Expand to full view", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Maximize2, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "p-1 text-gray-400 hover:text-gray-600 hover:bg-white/20 rounded transition-all duration-200 flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "px-4 py-2 bg-white border-b border-gray-200", children: (0, jsx_runtime_1.jsx)(ui_1.Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: (0, jsx_runtime_1.jsx)(ui_1.TabsList, { className: "grid grid-cols-9 w-full h-10 bg-gray-100 border border-gray-200 rounded-lg p-1", children: tabs.map(function (tab) {
                                var Icon = tab.icon;
                                return ((0, jsx_runtime_1.jsxs)(ui_1.TabsTrigger, { value: tab.id, className: "flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: tab.label })] }, tab.id));
                            }) }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full overflow-y-auto overflow-x-hidden\r\n            [&::-webkit-scrollbar]:w-2\r\n            [&::-webkit-scrollbar-track]:bg-gray-50\r\n            [&::-webkit-scrollbar-thumb]:bg-purple-300\r\n            hover:[&::-webkit-scrollbar-thumb]:bg-purple-400\r\n            dark:[&::-webkit-scrollbar-track]:bg-gray-50\r\n            dark:[&::-webkit-scrollbar-thumb]:bg-purple-300\r\n            dark:hover:[&::-webkit-scrollbar-thumb]:bg-purple-400", children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)(ui_1.Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [(0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "overview", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerOverviewPopup_1.default, { customerId: customerId }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "contact", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerContact_1.default, { customerId: customerId }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "services", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerServices_1.default, { customerId: customerId }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "financials", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerFinancials_1.default, { customerId: customerId }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "communications", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerCommunications_1.default, { customerId: customerId }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "documents", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerDocuments_1.default, { customerId: customerId }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "notes", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerNotesHistory_1.default, { customerId: customerId }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "analytics", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerAnalytics_1.default, { customerId: customerId }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "settings", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerSettings_1.default, { customerId: customerId }) }) })] }) }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center", onMouseDown: handleResizeStart, children: (0, jsx_runtime_1.jsx)("div", { className: "w-0 h-0 border-l-[8px] border-l-transparent border-b-[8px] border-b-gray-400" }) })] }) }));
    // Render to document body using portal
    return (0, react_dom_1.createPortal)(popupContent, document.body);
};
exports.default = CustomerPagePopup;
