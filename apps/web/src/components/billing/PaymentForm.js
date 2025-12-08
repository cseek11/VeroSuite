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
exports.default = PaymentForm;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var stripe_js_1 = require("@stripe/stripe-js");
var react_stripe_js_1 = require("@stripe/react-stripe-js");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var ErrorMessage_1 = require("@/components/ui/ErrorMessage");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var PaymentMethodSelector_1 = __importDefault(require("./PaymentMethodSelector"));
var PaymentConfirmation_1 = __importDefault(require("./PaymentConfirmation"));
// Initialize Stripe
var stripePromise = (0, stripe_js_1.loadStripe)(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
// Inner component that uses Stripe hooks
function PaymentFormInner(_a) {
    var _this = this;
    var _b;
    var invoice = _a.invoice, _paymentMethods = _a.paymentMethods, onSuccess = _a.onSuccess, onCancel = _a.onCancel, clientSecret = _a.clientSecret;
    var stripe = (0, react_stripe_js_1.useStripe)();
    var elements = (0, react_stripe_js_1.useElements)();
    var _c = (0, react_1.useState)('method'), paymentStep = _c[0], setPaymentStep = _c[1];
    var _d = (0, react_1.useState)(null), selectedPaymentMethod = _d[0], setSelectedPaymentMethod = _d[1];
    var _e = (0, react_1.useState)(false), useNewCard = _e[0], setUseNewCard = _e[1];
    var _f = (0, react_1.useState)(''), cardError = _f[0], setCardError = _f[1];
    var _g = (0, react_1.useState)(''), paymentError = _g[0], setPaymentError = _g[1];
    var _h = (0, react_1.useState)(false), isProcessing = _h[0], setIsProcessing = _h[1];
    var _j = (0, react_1.useState)(null), paymentIntent = _j[0], setPaymentIntent = _j[1];
    var _k = (0, react_1.useState)(0), retryCount = _k[0], setRetryCount = _k[1];
    var _l = (0, react_1.useState)(null), lastError = _l[0], setLastError = _l[1];
    var _m = (0, react_1.useState)(false), showRetry = _m[0], setShowRetry = _m[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    var lastErrorMessage = (_b = lastError === null || lastError === void 0 ? void 0 : lastError.message) !== null && _b !== void 0 ? _b : '';
    // Process Payment
    var processPaymentMutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var cardElement, _a, error, paymentIntent_1;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(useNewCard && stripe && elements && clientSecret)) return [3 /*break*/, 2];
                        cardElement = elements.getElement(react_stripe_js_1.CardElement);
                        if (!cardElement) {
                            throw new Error('Card element not found');
                        }
                        return [4 /*yield*/, stripe.confirmCardPayment(clientSecret, {
                                payment_method: {
                                    card: cardElement,
                                    billing_details: {
                                        name: ((_b = invoice.accounts) === null || _b === void 0 ? void 0 : _b.name) || '',
                                        email: ((_c = invoice.accounts) === null || _c === void 0 ? void 0 : _c.email) || '',
                                    },
                                },
                            })];
                    case 1:
                        _a = _d.sent(), error = _a.error, paymentIntent_1 = _a.paymentIntent;
                        if (error) {
                            throw new Error(error.message);
                        }
                        // Store payment intent for confirmation screen
                        setPaymentIntent(paymentIntent_1);
                        return [2 /*return*/, paymentIntent_1];
                    case 2:
                        if (selectedPaymentMethod) {
                            // Process with existing payment method
                            return [2 /*return*/, enhanced_api_1.billing.processPayment(invoice.id, {
                                    invoice_id: invoice.id,
                                    payment_method_id: selectedPaymentMethod.id,
                                    amount: Number(invoice.total_amount),
                                    payment_date: new Date().toISOString(),
                                    notes: 'Online payment'
                                })];
                        }
                        else {
                            throw new Error('No payment method selected');
                        }
                        _d.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        onSuccess: function (result) { return __awaiter(_this, void 0, void 0, function () {
            var intent, status_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(useNewCard && result && typeof result === 'object' && 'id' in result)) return [3 /*break*/, 5];
                        intent = result;
                        setPaymentIntent(intent);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, enhanced_api_1.billing.getStripePaymentStatus(intent.id)];
                    case 2:
                        status_1 = _a.sent();
                        logger_1.logger.debug('Payment status verified', { status: status_1.status, id: intent.id }, 'PaymentForm');
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        logger_1.logger.warn('Could not verify payment status', error_1, 'PaymentForm');
                        return [3 /*break*/, 4];
                    case 4:
                        // Invalidate queries to refresh data
                        queryClient.invalidateQueries({ queryKey: ['billing'] });
                        setPaymentStep('success');
                        return [3 /*break*/, 6];
                    case 5:
                        // Non-Stripe payment - show success immediately
                        setPaymentStep('success');
                        queryClient.invalidateQueries({ queryKey: ['billing'] });
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); },
        onError: function (error) {
            logger_1.logger.error('Payment failed', error, 'PaymentForm');
            var errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
            setPaymentError(errorMessage);
            setLastError(error instanceof Error ? error : new Error(errorMessage));
            var newRetryCount = retryCount + 1;
            setRetryCount(newRetryCount);
            setShowRetry(newRetryCount < 3); // Allow up to 3 retries
            setPaymentStep('details');
            setIsProcessing(false);
            // Show toast notification
            toast_1.toast.error(errorMessage);
        }
    });
    var handlePaymentMethodSelect = function (method) {
        if (method === 'new') {
            setUseNewCard(true);
            setSelectedPaymentMethod(null);
            setPaymentStep('details');
        }
        else {
            setUseNewCard(false);
            setSelectedPaymentMethod(method);
            setPaymentStep('details');
        }
    };
    var handleCardElementChange = function (event) {
        if (event.error) {
            setCardError(event.error.message || '');
            setPaymentError(''); // Clear payment error when user fixes card
        }
        else {
            setCardError('');
            setPaymentError(''); // Clear payment error when card is valid
        }
    };
    var handleRetryPayment = function () { return __awaiter(_this, void 0, void 0, function () {
        var cardElement, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setPaymentError('');
                    setLastError(null);
                    setShowRetry(false);
                    setPaymentStep('processing');
                    setIsProcessing(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    // Reset card element if using new card
                    if (useNewCard && elements) {
                        cardElement = elements.getElement(react_stripe_js_1.CardElement);
                        if (cardElement) {
                            cardElement.clear();
                        }
                    }
                    // Wait a moment before retrying
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    // Wait a moment before retrying
                    _a.sent();
                    // Retry the payment
                    return [4 /*yield*/, processPaymentMutation.mutateAsync()];
                case 3:
                    // Retry the payment
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    // Error is handled by mutation's onError
                    logger_1.logger.error('Retry payment failed', error_2, 'PaymentForm');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleSubmitPayment = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (useNewCard && !clientSecret) {
                        setPaymentError('Payment form is not ready. Please wait.');
                        return [2 /*return*/];
                    }
                    // Validate card if using new card
                    if (useNewCard && cardError) {
                        setPaymentError('Please fix card errors before submitting.');
                        return [2 /*return*/];
                    }
                    // Reset error states
                    setPaymentError('');
                    setCardError('');
                    setLastError(null);
                    setShowRetry(false);
                    setRetryCount(0);
                    setPaymentStep('processing');
                    setIsProcessing(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, processPaymentMutation.mutateAsync()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    // Error is handled by mutation's onError
                    logger_1.logger.error('Payment submission failed', error_3, 'PaymentForm');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };
    var renderPaymentMethodSelection = function () { return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold", children: "Select Payment Method" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-green-600 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "w-4 h-4 mr-1" }), "Secure"] })] }), (0, jsx_runtime_1.jsx)(PaymentMethodSelector_1.default, __assign({ accountId: invoice.account_id }, ((selectedPaymentMethod === null || selectedPaymentMethod === void 0 ? void 0 : selectedPaymentMethod.id) ? { value: selectedPaymentMethod.id } : {}), { onChange: function (method) {
                        if (method === 'new') {
                            handlePaymentMethodSelect('new');
                        }
                        else if (method) {
                            handlePaymentMethodSelect(method);
                        }
                    }, onAddNew: function () { return handlePaymentMethodSelect('new'); }, showAddNew: true })), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Total Amount:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-lg font-bold text-gray-900", children: ["$", Number(invoice.total_amount).toFixed(2)] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 flex justify-between", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: onCancel, icon: lucide_react_1.ArrowLeft, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: function () {
                                if (selectedPaymentMethod || useNewCard) {
                                    setPaymentStep('details');
                                }
                            }, disabled: !selectedPaymentMethod && !useNewCard, icon: lucide_react_1.CreditCard, children: "Continue" })] })] }) })); };
    var renderPaymentDetails = function () { return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-purple-50 border-purple-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold mb-4 text-purple-800", children: "Payment Summary" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-700", children: "Invoice:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: invoice.invoice_number })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-700", children: "Due Date:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: new Date(invoice.due_date).toLocaleDateString() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-lg font-semibold text-purple-800 border-t pt-3", children: [(0, jsx_runtime_1.jsx)("span", { children: "Total Amount:" }), (0, jsx_runtime_1.jsxs)("span", { children: ["$", Number(invoice.total_amount).toFixed(2)] })] })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold", children: "Payment Details" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-green-600 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "w-4 h-4 mr-1" }), "Secure Payment"] })] }), paymentError && ((0, jsx_runtime_1.jsx)("div", { className: "mb-6", children: (0, jsx_runtime_1.jsx)(ErrorMessage_1.ErrorMessage, __assign({ message: paymentError, type: "error" }, (retryCount < 3 ? {
                                actionable: {
                                    label: 'Retry Payment',
                                    onClick: handleRetryPayment
                                }
                            } : {}))) })), paymentError && false && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-red-800 mb-1", children: paymentError }), lastError !== null && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-red-600 mb-3", children: lastErrorMessage.includes('card')
                                                    ? 'Please check your card details and try again.'
                                                    : lastErrorMessage.includes('network')
                                                        ? 'Network error. Please check your connection and try again.'
                                                        : 'An error occurred while processing your payment.' })), showRetry && retryCount < 3 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mt-3", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: handleRetryPayment, icon: lucide_react_1.RefreshCw, className: "text-red-700 border-red-300 hover:bg-red-100", children: "Retry Payment" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-red-600", children: ["Attempt ", retryCount, " of 3"] })] })), retryCount >= 3 && ((0, jsx_runtime_1.jsx)("div", { className: "mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-medium text-yellow-800 mb-1", children: "Maximum retry attempts reached" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-yellow-700", children: "Please contact support or try again later. Your card has not been charged." })] })] }) }))] })] }) })), useNewCard ? ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: !clientSecret ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center py-8", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "md", text: "Loading secure payment form..." }) })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-300 rounded-lg p-4 bg-white", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-2", children: "Card Information" }), (0, jsx_runtime_1.jsx)("div", { className: "py-2", children: (0, jsx_runtime_1.jsx)(react_stripe_js_1.CardElement, { options: cardElementOptions, onChange: handleCardElementChange }) }), cardError && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsx)(ErrorMessage_1.ErrorMessage, { message: cardError, type: "error" }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-4 h-4 mr-2" }), "Your payment information is encrypted and secure"] })] })) })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-gray-50 p-4 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-5 h-5 text-gray-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: (selectedPaymentMethod === null || selectedPaymentMethod === void 0 ? void 0 : selectedPaymentMethod.payment_name) ||
                                                        "".concat(selectedPaymentMethod === null || selectedPaymentMethod === void 0 ? void 0 : selectedPaymentMethod.card_type, " ending in ").concat(selectedPaymentMethod === null || selectedPaymentMethod === void 0 ? void 0 : selectedPaymentMethod.card_last4) }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Saved payment method" })] })] }) }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between mt-6", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setPaymentStep('method'); }, icon: lucide_react_1.ArrowLeft, children: "Back" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: handleSubmitPayment, disabled: isProcessing || (useNewCard && (!stripe || !elements || !clientSecret || !!cardError)), icon: lucide_react_1.CreditCard, className: "px-8", children: isProcessing ? 'Processing...' : "Pay $".concat(Number(invoice.total_amount).toFixed(2)) })] })] }) })] })); };
    var renderProcessing = function () { return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4 md:p-12 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative inline-block mb-6", children: [(0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "xl" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "w-6 h-6 text-purple-400" }) })] }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold mb-2 text-gray-900", children: "Processing Payment" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 mb-4", children: "Please wait while we securely process your payment." }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500 mb-6", children: "Do not close this window or refresh the page." }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-2 text-sm text-purple-600 mt-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Your payment is being secured..." })] }), retryCount > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4 text-xs text-gray-500", children: ["Retry attempt ", retryCount] }))] }) })); };
    var handleDownloadReceipt = function () {
        var _a;
        // Generate receipt data
        var receiptData = {
            invoiceNumber: invoice.invoice_number,
            transactionId: (paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.id) || 'N/A',
            amount: Number(invoice.total_amount).toFixed(2),
            date: new Date().toLocaleDateString(),
            customer: ((_a = invoice.accounts) === null || _a === void 0 ? void 0 : _a.name) || 'N/A',
        };
        // Create receipt text
        var receiptText = "\nPAYMENT RECEIPT\n================\n\nInvoice Number: ".concat(receiptData.invoiceNumber, "\nTransaction ID: ").concat(receiptData.transactionId, "\nAmount Paid: $").concat(receiptData.amount, "\nPayment Date: ").concat(receiptData.date, "\nCustomer: ").concat(receiptData.customer, "\n\nThank you for your payment!\n    ").trim();
        // Create and download file
        var blob = new Blob([receiptText], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "Receipt-".concat(invoice.invoice_number, "-").concat(Date.now(), ".txt");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        logger_1.logger.debug('Receipt downloaded', { invoiceNumber: invoice.invoice_number }, 'PaymentForm');
        toast_1.toast.success('Receipt downloaded');
    };
    // renderSuccess removed - now using PaymentConfirmation component
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-2xl mx-auto", children: [paymentStep === 'method' && renderPaymentMethodSelection(), paymentStep === 'details' && renderPaymentDetails(), paymentStep === 'processing' && renderProcessing(), paymentStep === 'success' && ((0, jsx_runtime_1.jsx)(PaymentConfirmation_1.default, { invoice: invoice, paymentIntent: paymentIntent, paymentMethod: selectedPaymentMethod, onDownloadReceipt: handleDownloadReceipt, onClose: onSuccess }))] }));
}
// Main component with Stripe Elements provider
function PaymentForm(_a) {
    var _this = this;
    var invoice = _a.invoice, paymentMethods = _a.paymentMethods, onSuccess = _a.onSuccess, onCancel = _a.onCancel;
    var _b = (0, react_1.useState)(null), clientSecret = _b[0], setClientSecret = _b[1];
    var _c = (0, react_1.useState)(false), isLoadingIntent = _c[0], setIsLoadingIntent = _c[1];
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    // Create payment intent when component mounts or when needed
    (0, react_1.useEffect)(function () {
        var createIntent = function () { return __awaiter(_this, void 0, void 0, function () {
            var data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsLoadingIntent(true);
                        setError('');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, enhanced_api_1.billing.createStripePaymentIntent(invoice.id)];
                    case 2:
                        data = _a.sent();
                        setClientSecret(data.clientSecret);
                        logger_1.logger.debug('Payment intent created', { invoiceId: invoice.id }, 'PaymentForm');
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        logger_1.logger.error('Failed to create payment intent', err_1, 'PaymentForm');
                        setError('Failed to initialize payment. Please try again.');
                        return [3 /*break*/, 5];
                    case 4:
                        setIsLoadingIntent(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        // Only create intent if Stripe key is configured
        if (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY !== 'pk_test_your_stripe_publishable_key_here') {
            createIntent();
        }
        else {
            setError('Stripe is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables.');
        }
    }, [invoice.id]);
    if (error && !clientSecret) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-red-600 mr-2" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-800", children: error })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: onCancel, icon: lucide_react_1.ArrowLeft, children: "Cancel" }) })] }) }));
    }
    if (!clientSecret && isLoadingIntent) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4 md:p-12 text-center", children: [(0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "lg" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold mb-2 mt-4", children: "Initializing Payment" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Please wait while we set up secure payment processing..." })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)(react_stripe_js_1.Elements, __assign({ stripe: stripePromise }, (clientSecret !== null ? { options: { clientSecret: clientSecret } } : {}), { children: (0, jsx_runtime_1.jsx)(PaymentFormInner, { invoice: invoice, paymentMethods: paymentMethods, onSuccess: onSuccess, onCancel: onCancel, clientSecret: clientSecret }) })));
}
