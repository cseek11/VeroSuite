"use strict";
/**
 * Billing Analytics Tracking
 *
 * Analytics tracking for billing-related user interactions.
 * Provides insights into billing feature usage.
 *
 * Last Updated: 2025-12-07
 */
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackBillingEvent = trackBillingEvent;
exports.trackInvoiceView = trackInvoiceView;
exports.trackInvoiceDownload = trackInvoiceDownload;
exports.trackPaymentInitiated = trackPaymentInitiated;
exports.trackPaymentCompleted = trackPaymentCompleted;
exports.trackPaymentMethodAdded = trackPaymentMethodAdded;
exports.trackPaymentMethodDeleted = trackPaymentMethodDeleted;
exports.trackInvoiceSearch = trackInvoiceSearch;
exports.trackInvoiceFilter = trackInvoiceFilter;
var Sentry = __importStar(require("@sentry/react"));
var logger_1 = require("@/utils/logger");
/**
 * Track billing-related events
 */
function trackBillingEvent(event) {
    try {
        // Structured logging
        logger_1.logger.info('Billing event tracked', {
            context: 'BillingAnalytics',
            operation: 'trackBillingEvent',
            event: event.event,
            properties: event.properties,
            invoiceId: event.invoiceId,
            customerId: event.customerId,
            amount: event.amount,
            paymentMethod: event.paymentMethod,
        }, 'BillingAnalytics');
        // Sentry tracking (if available)
        if (typeof Sentry !== 'undefined' && typeof Sentry.captureMessage === 'function') {
            Sentry.addBreadcrumb({
                category: 'billing',
                message: event.event,
                level: 'info',
                data: __assign({ invoiceId: event.invoiceId, customerId: event.customerId, amount: event.amount, paymentMethod: event.paymentMethod }, event.properties),
            });
        }
        // Future: Add analytics service integration here
        // Example: analytics.track(event.event, event.properties);
    }
    catch (error) {
        logger_1.logger.error('Failed to track billing event', error, 'BillingAnalytics');
    }
}
/**
 * Track invoice view
 */
function trackInvoiceView(invoiceId, customerId) {
    trackBillingEvent(__assign({ event: 'invoice_viewed', invoiceId: invoiceId }, (customerId !== undefined ? { customerId: customerId } : {})));
}
/**
 * Track invoice download
 */
function trackInvoiceDownload(invoiceId, customerId) {
    trackBillingEvent(__assign({ event: 'invoice_downloaded', invoiceId: invoiceId }, (customerId !== undefined ? { customerId: customerId } : {})));
}
/**
 * Track payment initiated
 */
function trackPaymentInitiated(invoiceId, amount, paymentMethod, customerId) {
    trackBillingEvent(__assign(__assign({ event: 'payment_initiated', invoiceId: invoiceId, amount: amount }, (paymentMethod !== undefined ? { paymentMethod: paymentMethod } : {})), (customerId !== undefined ? { customerId: customerId } : {})));
}
/**
 * Track payment completed
 */
function trackPaymentCompleted(invoiceId, amount, paymentMethod, customerId) {
    trackBillingEvent(__assign(__assign({ event: 'payment_completed', invoiceId: invoiceId, amount: amount }, (paymentMethod !== undefined ? { paymentMethod: paymentMethod } : {})), (customerId !== undefined ? { customerId: customerId } : {})));
}
/**
 * Track payment method added
 */
function trackPaymentMethodAdded(paymentMethod, customerId) {
    trackBillingEvent(__assign({ event: 'payment_method_added', paymentMethod: paymentMethod }, (customerId !== undefined ? { customerId: customerId } : {})));
}
/**
 * Track payment method deleted
 */
function trackPaymentMethodDeleted(paymentMethodId, customerId) {
    trackBillingEvent(__assign({ event: 'payment_method_deleted', properties: { paymentMethodId: paymentMethodId } }, (customerId !== undefined ? { customerId: customerId } : {})));
}
/**
 * Track invoice search
 */
function trackInvoiceSearch(searchTerm, filters) {
    trackBillingEvent({
        event: 'invoice_searched',
        properties: {
            searchTerm: searchTerm,
            filters: filters,
        },
    });
}
/**
 * Track invoice filter applied
 */
function trackInvoiceFilter(filterType, filterValue) {
    trackBillingEvent({
        event: 'invoice_filter_applied',
        properties: {
            filterType: filterType,
            filterValue: filterValue,
        },
    });
}
