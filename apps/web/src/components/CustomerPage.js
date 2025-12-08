"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_query_1 = require("@tanstack/react-query");
require("leaflet/dist/leaflet.css");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var logger_1 = require("@/utils/logger");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var CustomerOverview_1 = __importDefault(require("./customer/CustomerOverview"));
var CustomerContact_1 = __importDefault(require("./customer/CustomerContact"));
var CustomerServices_1 = __importDefault(require("./customer/CustomerServices"));
var CustomerFinancials_1 = __importDefault(require("./customer/CustomerFinancials"));
var CustomerCommunications_1 = __importDefault(require("./customer/CustomerCommunications"));
var CustomerDocuments_1 = __importDefault(require("./customer/CustomerDocuments"));
var CustomerAnalytics_1 = __importDefault(require("./customer/CustomerAnalytics"));
var CustomerSettings_1 = __importDefault(require("./customer/CustomerSettings"));
var CustomerNotesHistory_1 = __importDefault(require("./customer/CustomerNotesHistory"));
var CustomerInfoPanel_1 = __importDefault(require("./customer/CustomerInfoPanel"));
var CustomerPage = function (_a) {
    var propCustomerId = _a.customerId;
    var params = (0, react_router_dom_1.useParams)();
    var navigate = (0, react_router_dom_1.useNavigate)();
    var queryClient = (0, react_query_1.useQueryClient)();
    var customerId = propCustomerId || params.customerId;
    var _b = (0, react_1.useState)('overview'), activeTab = _b[0], setActiveTab = _b[1];
    // const [isEditing, setIsEditing] = useState(false); // Unused - kept for potential future use
    // const [showQuickActions, setShowQuickActions] = useState(false); // Unused - kept for potential future use
    // Handle tab changes
    var handleTabChange = function (value) {
        setActiveTab(value);
    };
    // const handleNavigateToNote = (noteId: string) => { // Unused - kept for potential future use
    //   setActiveTab('notes');
    //   logger.debug('Navigating to note', { noteId }, 'CustomerPage');
    // };
    // Fetch customer data
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['customer', customerId],
        queryFn: function () { return enhanced_api_1.enhancedApi.customers.getById(customerId); },
        enabled: !!customerId
    }), customer = _c.data, customerLoading = _c.isLoading, customerError = _c.error;
    // Update customer mutation with comprehensive cache invalidation
    // Note: Currently unused but kept for potential future use
    // const updateCustomerMutation = useMutation({
    //   mutationFn: (updates: Partial<Account>) => enhancedApi.customers.update(customerId!, updates),
    //   onSuccess: (data) => {
    //     logger.debug('Customer updated successfully', { customerName: data.name, customerId }, 'CustomerPage');
    //     
    //     // Invalidate all customer-related queries
    //     queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
    //     queryClient.invalidateQueries({ queryKey: ['crm', 'customer', customerId] });
    //     queryClient.invalidateQueries({ queryKey: ['enhanced-customer', customerId] });
    //     queryClient.invalidateQueries({ queryKey: ['customers'] });
    //     queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
    //     queryClient.invalidateQueries({ queryKey: ['search'] });
    //     queryClient.invalidateQueries({ queryKey: ['unified-search'] });
    //     
    //     // setIsEditing(false); // Commented out - setIsEditing is unused
    //     
    //     // Dispatch custom event for real-time updates
    //     window.dispatchEvent(new CustomEvent('customerUpdated', {
    //       detail: { customerId, customer: data }
    //     }));
    //   },
    //   onError: (error) => {
    //     logger.error('Customer update failed', error, 'CustomerPage');
    //   }
    // });
    // Delete customer mutation with automatic redirection
    var deleteCustomerMutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return enhanced_api_1.enhancedApi.customers.delete(customerId); },
        onSuccess: function () {
            logger_1.logger.debug('Customer deleted successfully', { customerId: customerId }, 'CustomerPage');
            // Invalidate all customer-related queries
            queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
            queryClient.invalidateQueries({ queryKey: ['crm', 'customer', customerId] });
            queryClient.invalidateQueries({ queryKey: ['enhanced-customer', customerId] });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
            queryClient.invalidateQueries({ queryKey: ['search'] });
            queryClient.invalidateQueries({ queryKey: ['unified-search'] });
            // Dispatch custom event for real-time updates
            window.dispatchEvent(new CustomEvent('customerDeleted', {
                detail: { customerId: customerId }
            }));
            // Redirect to customer search page
            navigate('/customers');
        },
        onError: function (error) {
            logger_1.logger.error('Customer deletion failed', error, 'CustomerPage');
        }
    });
    // Listen for customer updates from action handlers
    (0, react_1.useEffect)(function () {
        var handleCustomerUpdate = function (event) {
            var updatedCustomerId = event.detail.customerId;
            if (updatedCustomerId === customerId) {
                logger_1.logger.debug('Customer updated via action handler, invalidating cache', { customerId: customerId }, 'CustomerPage');
                queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
            }
        };
        window.addEventListener('customerUpdated', handleCustomerUpdate);
        return function () {
            window.removeEventListener('customerUpdated', handleCustomerUpdate);
        };
    }, [customerId, queryClient]);
    // Handle delete confirmation
    var handleDeleteCustomer = function () {
        if (window.confirm("Are you sure you want to delete ".concat(customer === null || customer === void 0 ? void 0 : customer.name, "? This action cannot be undone."))) {
            deleteCustomerMutation.mutate();
        }
    };
    // Quick actions
    var quickActions = [
        {
            label: 'Create Work Order',
            icon: lucide_react_1.Plus,
            action: function () { return navigate("/work-orders/new?customer=".concat(customerId)); },
            variant: 'default'
        },
        {
            label: 'Schedule Service',
            icon: lucide_react_1.Calendar,
            action: function () { return navigate("/scheduler?customer=".concat(customerId)); },
            variant: 'outline'
        },
        {
            label: 'Send Message',
            icon: lucide_react_1.MessageSquare,
            action: function () { return setActiveTab('communications'); },
            variant: 'outline'
        },
        {
            label: 'View Map',
            icon: lucide_react_1.MapPin,
            action: function () { return setActiveTab('overview'); },
            variant: 'outline'
        },
        {
            label: 'Delete Customer',
            icon: lucide_react_1.Trash2,
            action: handleDeleteCustomer,
            variant: 'destructive',
            disabled: deleteCustomerMutation.isPending
        }
    ];
    // Tab configuration - matching the popup layout
    var tabs = [
        { id: 'overview', label: 'Overview', icon: lucide_react_1.User },
        { id: 'contact', label: 'Contact', icon: lucide_react_1.Phone },
        { id: 'services', label: 'Services', icon: lucide_react_1.Calendar },
        { id: 'financials', label: 'Financials', icon: lucide_react_1.DollarSign },
        { id: 'communications', label: 'Messages', icon: lucide_react_1.MessageSquare },
        { id: 'documents', label: 'Documents', icon: lucide_react_1.FileText },
        { id: 'notes', label: 'History', icon: lucide_react_1.FileText },
        { id: 'analytics', label: 'Analytics', icon: lucide_react_1.BarChart3 },
        { id: 'settings', label: 'Settings', icon: lucide_react_1.Settings }
    ];
    if (customerLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-3", children: (0, jsx_runtime_1.jsx)("div", { className: "w-16 h-8 bg-gray-200 rounded animate-pulse" }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-8 bg-gray-200 rounded w-64 mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-40" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-pulse", children: (0, jsx_runtime_1.jsx)("div", { className: "h-96 bg-gray-200 rounded w-full" }) }) })] }));
    }
    if (customerError || !customer) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-3", children: (0, jsx_runtime_1.jsxs)(Button_1.default, { onClick: function () { return navigate('/customers'); }, variant: "outline", size: "sm", className: "flex items-center gap-1.5 text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-700 text-xs px-2 py-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-3 w-3" }), "Back to Customers"] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-red-800", children: "Error" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700 mt-1", children: "Failed to load customer data. Please try again." })] })] }) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-3", children: (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return navigate('/customers'); }, className: "px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 hover:border-gray-400 text-xs inline-flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-3 w-3 mr-1.5" }), "Back to Customers"] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-6 h-6 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-1", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900 truncate", children: customer.name }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: customer.status === 'active' ? 'default' : customer.status === 'inactive' ? 'secondary' : 'destructive', className: "text-xs px-2 py-1", children: customer.status })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-4 text-sm text-gray-600", children: [customer.address && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsxs)("span", { className: "truncate", children: [customer.address, ", ", customer.city, ", ", customer.state, " ", customer.zip_code] })] })), customer.phone && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: customer.phone })] })), customer.email && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: customer.email })] }))] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2 flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: quickActions.map(function (action, index) {
                                        var Icon = action.icon;
                                        var isDestructive = action.variant === 'destructive';
                                        var isDisabled = action.disabled;
                                        return ((0, jsx_runtime_1.jsxs)("button", { onClick: action.action, disabled: isDisabled, className: "px-3 py-1.5 text-xs font-medium shadow-md hover:shadow-lg transition-all duration-200 rounded-md flex items-center ".concat(isDestructive
                                                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 disabled:from-red-400 disabled:to-red-500'
                                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500', " ").concat(isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'), children: [isDisabled ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-3 h-3 mr-1.5 animate-spin" })) : ((0, jsx_runtime_1.jsx)(Icon, { className: "w-3 h-3 mr-1.5" })), action.label] }, index));
                                    }) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2 pt-2 border-t border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-1 bg-white/70 rounded border border-gray-200", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-600", children: "Total Services" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-gray-900 text-xs", children: "0" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-1 bg-white/70 rounded border border-gray-200", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-600", children: "Total Spend" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-gray-900 text-xs", children: "$0.00" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-1 bg-white/70 rounded border border-gray-200", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-600", children: "Active Contracts" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-gray-900 text-xs", children: "0" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-1 bg-white/70 rounded border border-gray-200", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-600", children: "AR Balance" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-green-600 text-xs", children: "$0.00" })] })] }) })] }), customer && ((0, jsx_runtime_1.jsx)(CustomerInfoPanel_1.default, { customer: customer })), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden pt-20", children: (0, jsx_runtime_1.jsx)("div", { className: "px-4 py-2 bg-white border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)(ui_1.Tabs, { value: activeTab, onValueChange: handleTabChange, className: "w-full", children: [(0, jsx_runtime_1.jsx)(ui_1.TabsList, { className: "grid grid-cols-9 w-full h-12 bg-gray-100 border border-gray-200 rounded-lg p-1", children: tabs.map(function (tab) {
                                    var Icon = tab.icon;
                                    return ((0, jsx_runtime_1.jsxs)(ui_1.TabsTrigger, { value: tab.id, className: "flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: tab.label })] }, tab.id));
                                }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "overview", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerOverview_1.default, { customerId: customerId || '' }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "contact", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerContact_1.default, { customerId: customerId || '' }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "services", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerServices_1.default, { customerId: customerId || '' }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "financials", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerFinancials_1.default, { customerId: customerId || '' }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "communications", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerCommunications_1.default, { customerId: customerId || '' }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "documents", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerDocuments_1.default, { customerId: customerId || '' }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "notes", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerNotesHistory_1.default, { customerId: customerId || '' }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "analytics", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerAnalytics_1.default, { customerId: customerId || '' }) }) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "settings", className: "mt-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0, jsx_runtime_1.jsx)(CustomerSettings_1.default, { customerId: customerId || '' }) }) })] })] }) }) })] }));
};
exports.default = CustomerPage;
