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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleGlobalSearchBar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// ============================================================================
// SIMPLE GLOBAL SEARCH BAR
// ============================================================================
// Simplified version without dropdowns for header use
// Focuses on core search and command functionality
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var useAdvancedSearch_1 = require("@/hooks/useAdvancedSearch");
var lucide_react_1 = require("lucide-react");
var intent_classification_service_1 = require("@/lib/intent-classification-service");
var action_handlers_1 = require("@/lib/action-handlers");
var ConfirmationDialog_1 = __importDefault(require("@/components/ui/ConfirmationDialog"));
var CommandHelpModal_1 = __importDefault(require("@/components/CommandHelpModal"));
var logger_1 = require("@/utils/logger");
var SimpleGlobalSearchBar = function (_a) {
    var _b, _c, _d, _e, _f;
    var onResultsChange = _a.onResultsChange, onActionExecuted = _a.onActionExecuted, onFiltersChange = _a.onFiltersChange, _g = _a.placeholder, placeholder = _g === void 0 ? "Search customers or use natural language commands..." : _g, _h = _a.className, className = _h === void 0 ? "" : _h, _j = _a.enableCommands, enableCommands = _j === void 0 ? true : _j;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _k = (0, react_1.useState)(''), query = _k[0], setQuery = _k[1];
    var _l = (0, react_1.useState)(false), _isFocused = _l[0], setIsFocused = _l[1];
    var _m = (0, react_1.useState)(false), isExecuting = _m[0], setIsExecuting = _m[1];
    var _o = (0, react_1.useState)({
        isOpen: false,
        data: null,
        result: {}
    }), confirmationDialog = _o[0], setConfirmationDialog = _o[1];
    var _p = (0, react_1.useState)(false), helpModalOpen = _p[0], setHelpModalOpen = _p[1];
    var inputRef = (0, react_1.useRef)(null);
    // Use the advanced search hook but without suggestions
    var _q = (0, useAdvancedSearch_1.useAdvancedSearch)({
        enableSuggestions: false, // Disable suggestions to prevent dropdowns
        enableAutoCorrection: false
    }), results = _q.results, isLoading = _q.isLoading, _error = _q.error, search = _q.search, clearSearchResults = _q.clearSearch;
    // Handle input changes
    var handleInputChange = (0, react_1.useCallback)(function (e) {
        var value = e.target.value;
        setQuery(value);
        // Only perform search if it's not a command
        if (value.trim() && !isCommandQuery(value)) {
            search(value);
        }
    }, [search]);
    // Check if query looks like a command
    var isCommandQuery = function (query) {
        // First check if it's a help command
        var helpPatterns = [
            /^help$/i,
            /^what\s+can\s+I\s+do/i,
            /^how\s+do\s+I/i,
            /^show\s+me\s+examples/i,
            /^commands$/i,
            /^what\s+commands/i,
            /^help\s+me/i,
            /^how\s+to/i,
            /^examples$/i,
            /^tutorial$/i,
            /^guide$/i
        ];
        if (helpPatterns.some(function (pattern) { return pattern.test(query.trim()); })) {
            return true;
        }
        // Then check other command patterns
        var commandPatterns = [
            /^(create|add|new)\s+(a\s+)?(new\s+)?(customer|client|account)/i,
            /^(schedule|book)\s+(an?\s+)?(appointment|visit|service)/i,
            /^(update|edit|modify)\s+(a\s+)?(customer|client|account)/i,
            /^(update|edit|modify)\s+(.+?)\s+(phone|email|address|name)\s+to\s+(.+)/i,
            /^(delete|remove|cancel|close)\s+(the\s+)?(customer\s+)?(account\s+)?(for\s+)?(.+)/i,
            /^(show|display|list)\s+(all\s+)?(customers|clients|accounts)/i,
            /^(search|find)\s+(a\s+)?(customer|client|account)/i,
            /^(view|show|display)\s+customer\s+(.+)/i,
            /^(start|begin)\s+(job|work)\s+(.+)/i,
            /^(complete|finish|done)\s+(job|work)\s+(.+)/i,
            /^(pause|stop|hold)\s+(job|work)\s+(.+)/i,
            /^(resume|continue|restart)\s+(job|work)\s+(.+)/i,
            /^(create|generate|new)\s+invoice\s+(.+)/i,
            /^(record|log)\s+payment\s+(.+)/i,
            /^(send|email|mail)\s+invoice\s+(.+)/i,
            /^(payment|billing)\s+history\s+(.+)/i,
            /^(outstanding|unpaid|pending|overdue)\s+invoices/i
        ];
        return commandPatterns.some(function (pattern) { return pattern.test(query.trim()); });
    };
    // Handle form submission
    var handleSubmit = (0, react_1.useCallback)(function (e) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!query.trim())
                        return [2 /*return*/];
                    if (!(enableCommands && isCommandQuery(query))) return [3 /*break*/, 2];
                    return [4 /*yield*/, executeCommand(query)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: 
                // Regular search - perform search and handle results
                return [4 /*yield*/, performSearchAndNavigate(query)];
                case 3:
                    // Regular search - perform search and handle results
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [query, enableCommands, search, results, navigate, clearSearchResults]);
    // Perform search and navigate to results or customer page
    var performSearchAndNavigate = function (searchQuery) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // Perform the search
                search(searchQuery);
                // Wait a moment for search results to load
                setTimeout(function () {
                    // Check if we have search results
                    if (results && results.length > 0) {
                        // If there's exactly one result and it's a close match, navigate to that customer
                        var exactMatch = results.find(function (result) {
                            return result.name && result.name.toLowerCase() === searchQuery.toLowerCase();
                        });
                        if (exactMatch) {
                            logger_1.logger.debug('Exact match found, navigating to customer page', { customerName: exactMatch.name, customerId: exactMatch.id }, 'SimpleGlobalSearchBar');
                            navigate("/customers/".concat(exactMatch.id));
                            setQuery('');
                            clearSearchResults();
                            return;
                        }
                        // If there are multiple results, navigate to customers page with search
                        logger_1.logger.debug('Multiple results found, navigating to customers page', { resultsCount: results.length }, 'SimpleGlobalSearchBar');
                        navigate("/customers?search=".concat(encodeURIComponent(searchQuery)));
                        setQuery('');
                        clearSearchResults();
                    }
                    else {
                        // No results found, navigate to customers page with search anyway
                        logger_1.logger.debug('No results found, navigating to customers page', { searchQuery: searchQuery }, 'SimpleGlobalSearchBar');
                        navigate("/customers?search=".concat(encodeURIComponent(searchQuery)));
                        setQuery('');
                        clearSearchResults();
                    }
                }, 500); // Wait 500ms for search results to load
            }
            catch (error) {
                logger_1.logger.error('Search navigation error', error, 'SimpleGlobalSearchBar');
            }
            return [2 /*return*/];
        });
    }); };
    // Execute natural language command
    var executeCommand = function (commandQuery) { return __awaiter(void 0, void 0, void 0, function () {
        var intentResult, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isExecuting)
                        return [2 /*return*/];
                    setIsExecuting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, intent_classification_service_1.intentClassificationService.classifyIntent(commandQuery)];
                case 2:
                    intentResult = _a.sent();
                    if (!(intentResult.intent && intentResult.confidence > 0.7)) return [3 /*break*/, 4];
                    return [4 /*yield*/, action_handlers_1.actionExecutorService.executeAction(intentResult)];
                case 3:
                    result = _a.sent();
                    if (result.success) {
                        // Clear the search after successful command
                        setQuery('');
                        clearSearchResults();
                        // Handle navigation if present
                        if (result.navigation) {
                            logger_1.logger.debug('Navigating to', { path: result.navigation.path }, 'SimpleGlobalSearchBar');
                            navigate(result.navigation.path);
                        }
                        // Notify parent component
                        onActionExecuted === null || onActionExecuted === void 0 ? void 0 : onActionExecuted(result);
                        logger_1.logger.debug('Command executed successfully', { message: result.message }, 'SimpleGlobalSearchBar');
                    }
                    else if (result.requiresConfirmation) {
                        // Show confirmation dialog
                        logger_1.logger.debug('Command requires confirmation', { message: result.message }, 'SimpleGlobalSearchBar');
                        setConfirmationDialog({
                            isOpen: true,
                            data: result.data,
                            result: result
                        });
                    }
                    else {
                        logger_1.logger.error('Command failed', new Error(result.message), 'SimpleGlobalSearchBar');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    // Fallback to regular search
                    search(commandQuery);
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    logger_1.logger.error('Error executing command', error_1, 'SimpleGlobalSearchBar');
                    // Fallback to regular search
                    search(commandQuery);
                    return [3 /*break*/, 8];
                case 7:
                    setIsExecuting(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // Handle keyboard shortcuts
    var handleKeyDown = (0, react_1.useCallback)(function (e) {
        var _a;
        if (e.key === 'Escape') {
            setQuery('');
            clearSearchResults();
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            // Trigger form submission
            handleSubmit(e);
        }
    }, [clearSearchResults, handleSubmit]);
    // Clear search
    var clearSearch = (0, react_1.useCallback)(function () {
        var _a;
        setQuery('');
        clearSearchResults();
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, [clearSearchResults]);
    // Handle confirmation dialog
    var handleConfirmAction = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var confirmIntentResult, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirmationDialog.data)
                        return [2 /*return*/];
                    setIsExecuting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    confirmIntentResult = {
                        intent: 'confirmDeleteCustomer',
                        confidence: 1.0,
                        entities: {},
                        originalQuery: '',
                        processedQuery: '',
                        actionData: confirmationDialog.data
                    };
                    return [4 /*yield*/, action_handlers_1.actionExecutorService.executeAction(confirmIntentResult)];
                case 2:
                    result = _a.sent();
                    if (result.success) {
                        // Clear the search after successful command
                        setQuery('');
                        clearSearchResults();
                        // Handle navigation if present
                        if (result.navigation) {
                            logger_1.logger.debug('Navigating to', { path: result.navigation.path }, 'SimpleGlobalSearchBar');
                            navigate(result.navigation.path);
                        }
                        // Notify parent component
                        onActionExecuted === null || onActionExecuted === void 0 ? void 0 : onActionExecuted(result);
                        logger_1.logger.debug('Confirmed action executed successfully', { message: result.message }, 'SimpleGlobalSearchBar');
                    }
                    else {
                        logger_1.logger.error('Confirmed action failed', new Error(result.message), 'SimpleGlobalSearchBar');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    logger_1.logger.error('Confirmation execution error', error_2, 'SimpleGlobalSearchBar');
                    return [3 /*break*/, 5];
                case 4:
                    setIsExecuting(false);
                    setConfirmationDialog({ isOpen: false, data: null, result: {} });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [confirmationDialog.data, clearSearchResults, onActionExecuted]);
    var handleCancelAction = (0, react_1.useCallback)(function () {
        setConfirmationDialog({ isOpen: false, data: null, result: {} });
        setQuery('');
        clearSearchResults();
    }, [clearSearchResults]);
    // Notify parent of results changes
    (0, react_1.useEffect)(function () {
        onResultsChange === null || onResultsChange === void 0 ? void 0 : onResultsChange(results);
    }, [results, onResultsChange]);
    // Notify parent of filters changes (empty for simple version)
    (0, react_1.useEffect)(function () {
        onFiltersChange === null || onFiltersChange === void 0 ? void 0 : onFiltersChange({});
    }, [onFiltersChange]);
    // Handle help modal events
    (0, react_1.useEffect)(function () {
        var handleShowCommandHelp = function () {
            setHelpModalOpen(true);
        };
        window.addEventListener('showCommandHelp', handleShowCommandHelp);
        return function () { return window.removeEventListener('showCommandHelp', handleShowCommandHelp); };
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative ".concat(className), children: [(0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), (0, jsx_runtime_1.jsx)("input", { ref: inputRef, type: "text", value: query, onChange: handleInputChange, onKeyDown: handleKeyDown, onFocus: function () { return setIsFocused(true); }, onBlur: function () { return setIsFocused(false); }, placeholder: placeholder, className: "global-search-input w-full pl-10 pr-16 py-2 bg-white text-gray-900 placeholder-gray-500 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white hover:bg-white transition-colors duration-200", disabled: isExecuting }), query && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: clearSearch, className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })), enableCommands && query && isCommandQuery(query) && ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-10 top-1/2 transform -translate-y-1/2", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-4 h-4 text-purple-500" }) }))] }), isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-10 top-1/2 transform -translate-y-1/2", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent" }) })), isExecuting && ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-10 top-1/2 transform -translate-y-1/2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-purple-600", children: "Executing..." })] }) })), (0, jsx_runtime_1.jsx)(ConfirmationDialog_1.default, { isOpen: confirmationDialog.isOpen, onClose: handleCancelAction, onConfirm: handleConfirmAction, title: ((_b = confirmationDialog.result.confirmationData) === null || _b === void 0 ? void 0 : _b.title) || 'Confirm Action', message: ((_c = confirmationDialog.result.confirmationData) === null || _c === void 0 ? void 0 : _c.message) || 'Are you sure?', confirmText: ((_d = confirmationDialog.result.confirmationData) === null || _d === void 0 ? void 0 : _d.confirmText) || 'Confirm', cancelText: ((_e = confirmationDialog.result.confirmationData) === null || _e === void 0 ? void 0 : _e.cancelText) || 'Cancel', type: ((_f = confirmationDialog.result.confirmationData) === null || _f === void 0 ? void 0 : _f.type) || 'danger', isLoading: isExecuting }), (0, jsx_runtime_1.jsx)(CommandHelpModal_1.default, { isOpen: helpModalOpen, onClose: function () { return setHelpModalOpen(false); } })] }));
};
exports.SimpleGlobalSearchBar = SimpleGlobalSearchBar;
