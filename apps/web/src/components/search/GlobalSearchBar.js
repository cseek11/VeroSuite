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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalSearchBar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// ============================================================================
// GLOBAL SEARCH BAR
// ============================================================================
// Unified search interface that handles both search and natural language commands
// 
// This component extends the AdvancedSearchBar to support natural language
// commands like "create customer", "schedule appointment", etc.
var react_1 = require("react");
var useAdvancedSearch_1 = require("@/hooks/useAdvancedSearch");
var lucide_react_1 = require("lucide-react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var intent_classification_service_1 = require("@/lib/intent-classification-service");
var action_handlers_1 = require("@/lib/action-handlers");
var CommandHelpModal_1 = __importDefault(require("@/components/CommandHelpModal"));
var logger_1 = require("@/utils/logger");
var GlobalSearchBar = function (_a) {
    var onResultsChange = _a.onResultsChange, onActionExecuted = _a.onActionExecuted, _onFiltersChange = _a.onFiltersChange, _b = _a.placeholder, placeholder = _b === void 0 ? "Search customers or use natural language commands..." : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.showModeSelector, showModeSelector = _d === void 0 ? true : _d, _e = _a.showSuggestions, showSuggestions = _e === void 0 ? true : _e, _f = _a.enableAutoCorrection, enableAutoCorrection = _f === void 0 ? true : _f, _g = _a.enableCommands, enableCommands = _g === void 0 ? true : _g;
    var _h = (0, react_1.useState)(false), _isFocused = _h[0], setIsFocused = _h[1];
    var _j = (0, react_1.useState)(false), showModeDropdown = _j[0], setShowModeDropdown = _j[1];
    var _k = (0, react_1.useState)(false), showSuggestionsDropdown = _k[0], setShowSuggestionsDropdown = _k[1];
    var _l = (0, react_1.useState)(false), showCommandExamples = _l[0], setShowCommandExamples = _l[1];
    var _m = (0, react_1.useState)(null), currentIntent = _m[0], setCurrentIntent = _m[1];
    var _o = (0, react_1.useState)(null), confirmationData = _o[0], setConfirmationData = _o[1];
    var _p = (0, react_1.useState)(false), isExecutingAction = _p[0], setIsExecutingAction = _p[1];
    var _q = (0, react_1.useState)(false), helpModalOpen = _q[0], setHelpModalOpen = _q[1];
    var inputRef = (0, react_1.useRef)(null);
    var dropdownRef = (0, react_1.useRef)(null);
    var _r = (0, useAdvancedSearch_1.useAdvancedSearch)({
        enableAutoCorrection: enableAutoCorrection,
        enableSuggestions: showSuggestions,
        defaultSearchMode: 'hybrid'
    }), query = _r.query, results = _r.results, suggestions = _r.suggestions, correctedQuery = _r.correctedQuery, isLoading = _r.isLoading, error = _r.error, searchMode = _r.searchMode, hasSearched = _r.hasSearched, search = _r.search, clearSearch = _r.clearSearch, updateSearchMode = _r.updateSearchMode, searchWithSuggestion = _r.searchWithSuggestion, searchWithCorrection = _r.searchWithCorrection, getSearchStats = _r.getSearchStats;
    // Classify intent when query changes
    (0, react_1.useEffect)(function () {
        if (query.length > 3 && enableCommands) {
            var intent = intent_classification_service_1.intentClassificationService.classifyIntent(query);
            setCurrentIntent(intent);
            // If it's a high-confidence action intent, show confirmation
            if (intent.intent !== 'search' && intent.confidence >= 0.7) {
                var confirmation = action_handlers_1.actionExecutorService.getConfirmationData(intent);
                setConfirmationData(confirmation);
            }
            else {
                setConfirmationData(null);
            }
        }
        else {
            setCurrentIntent(null);
            setConfirmationData(null);
        }
    }, [query, enableCommands]);
    // Notify parent when results change
    (0, react_1.useEffect)(function () {
        if (hasSearched && !isLoading && onResultsChange) {
            onResultsChange(results);
        }
    }, [results, hasSearched, isLoading, onResultsChange]);
    // Handle clicks outside dropdown
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSuggestionsDropdown(false);
                setShowModeDropdown(false);
                setShowCommandExamples(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    // Handle help modal events
    (0, react_1.useEffect)(function () {
        var handleShowCommandHelp = function () {
            setHelpModalOpen(true);
        };
        window.addEventListener('showCommandHelp', handleShowCommandHelp);
        return function () { return window.removeEventListener('showCommandHelp', handleShowCommandHelp); };
    }, []);
    var handleInputChange = function (e) {
        var value = e.target.value;
        search(value);
        setShowSuggestionsDropdown(value.length > 0);
    };
    var handleKeyDown = function (e) {
        var _a;
        if (e.key === 'Escape') {
            setShowSuggestionsDropdown(false);
            setShowModeDropdown(false);
            setShowCommandExamples(false);
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
        }
        else if (e.key === 'Enter' && confirmationData && !isExecutingAction) {
            handleExecuteAction();
        }
    };
    var handleSuggestionClick = function (suggestion) {
        var _a;
        searchWithSuggestion(suggestion);
        setShowSuggestionsDropdown(false);
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    var handleCorrectionClick = function () {
        if (correctedQuery) {
            searchWithCorrection(correctedQuery);
            setShowSuggestionsDropdown(false);
        }
    };
    var handleExecuteAction = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentIntent || !confirmationData || isExecutingAction)
                        return [2 /*return*/];
                    setIsExecutingAction(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, action_handlers_1.actionExecutorService.executeAction(currentIntent)];
                case 2:
                    result = _a.sent();
                    if (onActionExecuted) {
                        onActionExecuted(result);
                    }
                    if (result.success) {
                        // Clear the search and show success
                        clearSearch();
                        setConfirmationData(null);
                        setCurrentIntent(null);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Action execution failed', error_1, 'GlobalSearchBar');
                    return [3 /*break*/, 5];
                case 4:
                    setIsExecutingAction(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleCancelAction = function () {
        setConfirmationData(null);
        setCurrentIntent(null);
    };
    var getSearchModeIcon = function (mode) {
        switch (mode) {
            case 'standard': return (0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "w-4 h-4" });
            case 'fuzzy': return (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-4 h-4" });
            case 'hybrid': return (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "w-4 h-4" });
            case 'vector': return (0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "w-4 h-4" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-4 h-4" });
        }
    };
    var getSearchModeLabel = function (mode) {
        switch (mode) {
            case 'standard': return 'Standard';
            case 'fuzzy': return 'Fuzzy';
            case 'hybrid': return 'Hybrid';
            case 'vector': return 'Vector';
            default: return 'Search';
        }
    };
    var getSearchModeDescription = function (mode) {
        switch (mode) {
            case 'standard': return 'Exact text matching';
            case 'fuzzy': return 'Typo-tolerant matching';
            case 'hybrid': return 'Best of both worlds';
            case 'vector': return 'AI-powered semantic search';
            default: return '';
        }
    };
    var getIntentIcon = function (intent) {
        switch (intent) {
            case 'createCustomer': return (0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { className: "w-4 h-4" });
            case 'scheduleAppointment': return (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4" });
            case 'updateAppointment': return (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4" });
            case 'cancelAppointment': return (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" });
            case 'addNote': return (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4" });
            case 'markInvoicePaid': return (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-4 h-4" });
            case 'assignTechnician': return (0, jsx_runtime_1.jsx)(lucide_react_1.UserCheck, { className: "w-4 h-4" });
            case 'sendReminder': return (0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "w-4 h-4" });
            case 'createServicePlan': return (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-4 h-4" });
            case 'showReports': return (0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "w-4 h-4" });
            case 'help': return (0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "w-4 h-4" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-4 h-4" });
        }
    };
    var getIntentColor = function (intent) {
        switch (intent) {
            case 'createCustomer': return 'text-green-600 bg-green-50 border-green-200';
            case 'scheduleAppointment': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'updateAppointment': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'cancelAppointment': return 'text-red-600 bg-red-50 border-red-200';
            case 'addNote': return 'text-purple-600 bg-purple-50 border-purple-200';
            case 'markInvoicePaid': return 'text-green-600 bg-green-50 border-green-200';
            case 'assignTechnician': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
            case 'sendReminder': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'createServicePlan': return 'text-teal-600 bg-teal-50 border-teal-200';
            case 'showReports': return 'text-gray-600 bg-gray-50 border-gray-200';
            case 'help': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };
    var getCommandExamples = function () {
        var examples = intent_classification_service_1.intentClassificationService.getIntentExamples();
        return __spreadArray(__spreadArray(__spreadArray([], examples.createCustomer.slice(0, 2), true), examples.scheduleAppointment.slice(0, 2), true), examples.addNote.slice(0, 1), true);
    };
    var stats = getSearchStats();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative ".concat(className), ref: dropdownRef, children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [showModeSelector && ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return setShowModeDropdown(!showModeDropdown); }, className: "flex items-center space-x-2 min-w-[100px]", children: [getSearchModeIcon(searchMode), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: getSearchModeLabel(searchMode) }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-3 h-3" })] }), showModeDropdown && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "absolute top-full left-0 mt-1 z-50 min-w-[200px] p-2 bg-white border border-gray-200 shadow-lg backdrop-blur-sm", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: ['standard', 'fuzzy', 'hybrid', 'vector'].map(function (mode) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                                                    updateSearchMode(mode);
                                                    setShowModeDropdown(false);
                                                }, className: "w-full text-left px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors ".concat(searchMode === mode
                                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                    : 'hover:bg-gray-100 hover:border-gray-200'), children: [getSearchModeIcon(mode), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: getSearchModeLabel(mode) }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: getSearchModeDescription(mode) })] })] }, mode)); }) }) }))] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 relative", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), (0, jsx_runtime_1.jsx)("input", { ref: inputRef, type: "text", value: query, onChange: handleInputChange, onKeyDown: handleKeyDown, onFocus: function () {
                                                    setIsFocused(true);
                                                    if (query.length > 0)
                                                        setShowSuggestionsDropdown(true);
                                                }, onBlur: function () { return setIsFocused(false); }, placeholder: placeholder, className: "global-search-input w-full pl-10 pr-10 py-2 bg-white text-gray-900 placeholder-gray-500 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white hover:bg-white transition-colors duration-200" }), query && ((0, jsx_runtime_1.jsx)("button", { onClick: clearSearch, className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) }))] }), isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-3 top-1/2 transform -translate-y-1/2", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500" }) }))] }), enableCommands && ((0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return setShowCommandExamples(!showCommandExamples); }, className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Command, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: "Examples" })] }))] }), currentIntent && currentIntent.intent !== 'search' && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 p-3 rounded-lg border ".concat(getIntentColor(currentIntent.intent)), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [getIntentIcon(currentIntent.intent), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: currentIntent.intent.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); }) }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm opacity-75", children: ["(", (currentIntent.confidence * 100).toFixed(0), "% confidence)"] })] }), currentIntent.entities.customerName && ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm mt-1", children: ["Customer: ", (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: currentIntent.entities.customerName })] }))] })), confirmationData && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5 text-blue-500 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-blue-900", children: confirmationData.action }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-blue-700 mt-1", children: confirmationData.description }), confirmationData.benefits && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-medium text-blue-800", children: "Benefits:" }), (0, jsx_runtime_1.jsx)("ul", { className: "text-xs text-blue-700 list-disc list-inside", children: confirmationData.benefits.map(function (benefit, index) { return ((0, jsx_runtime_1.jsx)("li", { children: benefit }, index)); }) })] })), confirmationData.risks && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-medium text-blue-800", children: "Risks:" }), (0, jsx_runtime_1.jsx)("ul", { className: "text-xs text-blue-700 list-disc list-inside", children: confirmationData.risks.map(function (risk, index) { return ((0, jsx_runtime_1.jsx)("li", { children: risk }, index)); }) })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mt-3", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handleExecuteAction, disabled: isExecutingAction, className: "bg-blue-600 hover:bg-blue-700 text-white", size: "sm", children: isExecutingAction ? 'Executing...' : 'Execute Action' }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handleCancelAction, variant: "outline", size: "sm", className: "border-blue-300 text-blue-600 hover:bg-blue-100", children: "Cancel" })] })] })), correctedQuery && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lightbulb, { className: "w-4 h-4 text-blue-500" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-blue-700", children: ["Did you mean \"", correctedQuery, "\"?"] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: handleCorrectionClick, className: "ml-auto text-blue-600 border-blue-300 hover:bg-blue-100", children: "Use correction" })] }) })), error && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 p-2 bg-red-50 border border-red-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-red-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-red-700", children: error })] }) })), hasSearched && stats && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center space-x-4 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsxs)("span", { children: [stats.totalResults, " results"] }), stats.exactMatches > 0 && (0, jsx_runtime_1.jsxs)("span", { children: [stats.exactMatches, " exact"] }), stats.fuzzyMatches > 0 && (0, jsx_runtime_1.jsxs)("span", { children: [stats.fuzzyMatches, " fuzzy"] }), stats.vectorMatches > 0 && (0, jsx_runtime_1.jsxs)("span", { children: [stats.vectorMatches, " vector"] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Avg relevance: ", (stats.averageRelevance * 100).toFixed(0), "%"] })] }))] }), showCommandExamples && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "absolute top-full left-0 right-0 mt-1 z-40 max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-lg backdrop-blur-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-xs font-medium text-gray-500 mb-3 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Natural Language Commands" }), (0, jsx_runtime_1.jsx)("span", { className: "text-purple-600 font-medium", children: "Try these examples" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: getCommandExamples().map(function (example, index) { return ((0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                    search(example);
                                    setShowCommandExamples(false);
                                }, className: "w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-colors", children: (0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: example }) }, index)); }) })] }) })), showSuggestionsDropdown && suggestions.length > 0 && !showCommandExamples && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "absolute top-full left-0 right-0 mt-1 z-40 max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-lg backdrop-blur-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-xs font-medium text-gray-500 mb-2 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Smart Suggestions" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-purple-600 font-medium", children: [suggestions.length, " found"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: suggestions.map(function (suggestion, index) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleSuggestionClick(suggestion); }, className: "w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-purple-50 hover:border-purple-200 border border-transparent flex items-center space-x-2 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: suggestion.text }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500 flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "capitalize", children: suggestion.type }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-medium text-purple-600", children: [(suggestion.confidence * 100).toFixed(0), "% match"] })] })] }), suggestion.type === 'correction' && ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-green-500" })), suggestion.type === 'completion' && ((0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-4 h-4 text-purple-400" }))] }, index)); }) })] }) })), (0, jsx_runtime_1.jsx)(CommandHelpModal_1.default, { isOpen: helpModalOpen, onClose: function () { return setHelpModalOpen(false); } })] }));
};
exports.GlobalSearchBar = GlobalSearchBar;
exports.default = exports.GlobalSearchBar;
