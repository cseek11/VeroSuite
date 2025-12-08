"use strict";
// ============================================================================
// ACTION HANDLERS SERVICE
// ============================================================================
// Executes actions based on classified intents for Global Smart Search
// 
// This service handles the execution of natural language commands like
// creating customers, scheduling appointments, adding notes, etc.
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionExecutorService = void 0;
var secure_api_client_1 = require("./secure-api-client");
var queryClient_1 = require("./queryClient");
var logger_1 = require("@/utils/logger");
// ============================================================================
// ACTION HANDLERS SERVICE
// ============================================================================
var ActionExecutorService = /** @class */ (function () {
    function ActionExecutorService() {
    }
    /**
     * Extract a likely customer name and address tokens from a free-form string.
     * Example input: "Chris Seek 135 Thompson Ave Donora Pa 15033"
     * - name: "Chris Seek"
     * - address tokens: { streetNumber: "135", street: "Thompson Ave", city: "Donora", state: "PA", zip: "15033" }
     */
    Object.defineProperty(ActionExecutorService.prototype, "extractNameAndAddress", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (raw) {
            if (!raw)
                return { name: '', tokens: {} };
            var cleaned = raw.replace(/\s+,/g, ' ,').replace(/\s+/g, ' ').trim();
            // Try to find a street number (first numeric token after the name)
            var parts = cleaned.split(' ');
            var idxWithNumber = parts.findIndex(function (p) { return /\d/.test(p); });
            var name = cleaned;
            var trailing = '';
            if (idxWithNumber > 0) {
                name = parts.slice(0, idxWithNumber).join(' ');
                trailing = parts.slice(idxWithNumber).join(' ');
            }
            // Parse trailing address pieces: number, street words until hitting city/state/zip
            var tokens = {};
            if (trailing) {
                var streetNumMatch = trailing.match(/^(\d+[A-Za-z]?)/);
                if (streetNumMatch && streetNumMatch[1]) {
                    tokens.streetNumber = streetNumMatch[1];
                }
                // Common street suffixes
                var streetSuffixes = ['st', 'street', 'ave', 'avenue', 'rd', 'road', 'blvd', 'lane', 'ln', 'dr', 'drive', 'ct', 'court', 'cir', 'circle', 'way', 'terrace', 'ter'];
                var streetMatch = trailing.match(new RegExp(String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["^d+[A-Za-z]?s+([A-Za-z]+(?:s+[A-Za-z]+)*s+(?:", ")\b)"], ["^\\d+[A-Za-z]?\\s+([A-Za-z]+(?:\\s+[A-Za-z]+)*\\s+(?:", ")\\b)"])), streetSuffixes.join('|')), 'i'));
                if (streetMatch && streetMatch[1]) {
                    tokens.street = streetMatch[1];
                }
                // State as 2-letter code
                var stateMatch = trailing.match(/\b([A-Za-z]{2})\b(?!.*\b\1\b)/);
                if (stateMatch && stateMatch[1])
                    tokens.state = stateMatch[1].toUpperCase();
                // ZIP code (5 digits)
                var zipMatch = trailing.match(/\b\d{5}\b/);
                if (zipMatch)
                    tokens.zip = zipMatch[0];
                // City: take the word(s) before state or zip if present
                if (!tokens.city) {
                    var withoutZip = tokens.zip ? trailing.replace(tokens.zip, '').trim() : trailing;
                    var withoutState = tokens.state ? withoutZip.replace(new RegExp(String.raw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\b", "\b"], ["\\b", "\\b"])), tokens.state), 'i'), '').trim() : withoutZip;
                    // Remove street number and street phrase for city guess
                    var remainder = withoutState;
                    if (tokens.streetNumber)
                        remainder = remainder.replace(new RegExp("^".concat(tokens.streetNumber, "\\b")), '').trim();
                    if (tokens.street)
                        remainder = remainder.replace(new RegExp(tokens.street, 'i'), '').trim();
                    var words = remainder.split(/\s+/).filter(Boolean);
                    if (words.length > 0)
                        tokens.city = words.join(' ');
                }
            }
            // Final sanitize name: remove trailing commas and spaces
            name = name.replace(/[\s,]+$/, '').trim();
            return { name: name, tokens: tokens };
        }
    });
    /**
     * Validate an action before execution
     */
    Object.defineProperty(ActionExecutorService.prototype, "validateAction", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            var _a, _b;
            var errors = [];
            var warnings = [];
            switch (intentResult.intent) {
                case 'createCustomer':
                    if (!intentResult.entities.customerName) {
                        errors.push('Customer name is required');
                    }
                    if (!intentResult.entities.address && !intentResult.entities.phone && !intentResult.entities.email) {
                        warnings.push('At least one contact method (address, phone, or email) is recommended');
                    }
                    break;
                case 'scheduleAppointment':
                    if (!intentResult.entities.customerName && !intentResult.entities.customerId) {
                        errors.push('Customer name or ID is required');
                    }
                    if (!intentResult.entities.serviceType && !intentResult.entities.pestType) {
                        errors.push('Service type or pest type is required');
                    }
                    if (!intentResult.entities.date) {
                        warnings.push('No date specified, will default to tomorrow');
                    }
                    break;
                case 'updateAppointment':
                    if (!intentResult.entities.customerName && !intentResult.entities.customerId) {
                        errors.push('Customer name or ID is required');
                    }
                    if (!intentResult.entities.date && !intentResult.entities.time && !intentResult.entities.technician) {
                        errors.push('At least one update (date, time, or technician) is required');
                    }
                    break;
                case 'cancelAppointment':
                    if (!intentResult.entities.customerName && !intentResult.entities.customerId) {
                        errors.push('Customer name or ID is required');
                    }
                    break;
                case 'addNote':
                    if (!intentResult.entities.customerName && !intentResult.entities.customerId) {
                        errors.push('Customer name or ID is required');
                    }
                    if (!intentResult.entities.notes && !((_b = (_a = intentResult.actionData) === null || _a === void 0 ? void 0 : _a.noteData) === null || _b === void 0 ? void 0 : _b.note)) {
                        errors.push('Note content is required');
                    }
                    break;
                case 'markInvoicePaid':
                    if (!intentResult.entities.invoiceId) {
                        errors.push('Invoice ID is required');
                    }
                    break;
                case 'assignTechnician':
                    if (!intentResult.entities.technician) {
                        errors.push('Technician name is required');
                    }
                    if (!intentResult.entities.customerName && !intentResult.entities.customerId) {
                        errors.push('Customer name or ID is required');
                    }
                    break;
                case 'sendReminder':
                    if (!intentResult.entities.customerName && !intentResult.entities.customerId) {
                        errors.push('Customer name or ID is required');
                    }
                    break;
                case 'createServicePlan':
                    if (!intentResult.entities.customerName && !intentResult.entities.customerId) {
                        errors.push('Customer name or ID is required');
                    }
                    if (!intentResult.entities.address) {
                        warnings.push('Service address is recommended for service plans');
                    }
                    break;
            }
            return {
                isValid: errors.length === 0,
                errors: errors,
                warnings: warnings
            };
        }
    });
    /**
     * Get confirmation data for an action
     */
    Object.defineProperty(ActionExecutorService.prototype, "getConfirmationData", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            var _a, _b, _c, _d, _e, _f;
            switch (intentResult.intent) {
                case 'createCustomer':
                    return {
                        action: 'Create Customer',
                        description: "Create a new customer account for ".concat(intentResult.entities.customerName),
                        data: (_a = intentResult.actionData) === null || _a === void 0 ? void 0 : _a.customerData,
                        benefits: ['New customer added to system', 'Ready for service scheduling'],
                        risks: ['Duplicate customer if already exists']
                    };
                case 'scheduleAppointment':
                    return {
                        action: 'Schedule Appointment',
                        description: "Schedule ".concat(intentResult.entities.serviceType || intentResult.entities.pestType, " appointment for ").concat(intentResult.entities.customerName),
                        data: (_b = intentResult.actionData) === null || _b === void 0 ? void 0 : _b.appointmentData,
                        benefits: ['Customer service scheduled', 'Technician assignment ready'],
                        risks: ['May conflict with existing appointments', 'Customer may not be available']
                    };
                case 'updateAppointment':
                    return {
                        action: 'Update Appointment',
                        description: "Update appointment for ".concat(intentResult.entities.customerName),
                        data: (_c = intentResult.actionData) === null || _c === void 0 ? void 0 : _c.appointmentData,
                        benefits: ['Appointment updated', 'Customer notified'],
                        risks: ['May affect technician schedule', 'Customer may need to be notified']
                    };
                case 'cancelAppointment':
                    return {
                        action: 'Cancel Appointment',
                        description: "Cancel appointment for ".concat(intentResult.entities.customerName),
                        data: { customerName: intentResult.entities.customerName },
                        benefits: ['Appointment cancelled', 'Technician freed up'],
                        risks: ['Customer may need rescheduling', 'Revenue impact']
                    };
                case 'addNote':
                    return {
                        action: 'Add Note',
                        description: "Add note for ".concat(intentResult.entities.customerName),
                        data: (_d = intentResult.actionData) === null || _d === void 0 ? void 0 : _d.noteData,
                        benefits: ['Customer information updated', 'Better service context'],
                        risks: ['Note may be sensitive information']
                    };
                case 'markInvoicePaid':
                    return {
                        action: 'Mark Invoice Paid',
                        description: "Mark invoice ".concat(intentResult.entities.invoiceId, " as paid"),
                        data: (_e = intentResult.actionData) === null || _e === void 0 ? void 0 : _e.invoiceData,
                        benefits: ['Payment recorded', 'Customer account updated'],
                        risks: ['Financial record change', 'May affect accounting']
                    };
                case 'assignTechnician':
                    return {
                        action: 'Assign Technician',
                        description: "Assign ".concat(intentResult.entities.technician, " to ").concat(intentResult.entities.customerName),
                        data: {
                            technician: intentResult.entities.technician,
                            customerName: intentResult.entities.customerName
                        },
                        benefits: ['Technician assigned', 'Job ready for execution'],
                        risks: ['May affect technician schedule', 'Technician may not be available']
                    };
                case 'sendReminder':
                    return {
                        action: 'Send Reminder',
                        description: "Send reminder to ".concat(intentResult.entities.customerName),
                        data: { customerName: intentResult.entities.customerName },
                        benefits: ['Customer notified', 'Reduced no-shows'],
                        risks: ['May be seen as spam', 'Customer contact preferences']
                    };
                case 'createServicePlan':
                    return {
                        action: 'Create Service Plan',
                        description: "Create recurring service plan for ".concat(intentResult.entities.customerName),
                        data: (_f = intentResult.actionData) === null || _f === void 0 ? void 0 : _f.appointmentData,
                        benefits: ['Recurring revenue', 'Customer retention', 'Automated scheduling'],
                        risks: ['Long-term commitment', 'Customer may cancel']
                    };
                default:
                    return {
                        action: 'Unknown Action',
                        description: 'Action not recognized',
                        data: {},
                        risks: ['Unknown action type']
                    };
            }
        }
    });
    /**
     * Execute an action based on intent result
     */
    Object.defineProperty(ActionExecutorService.prototype, "executeAction", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 145, , 146]);
                            logger_1.logger.debug('Executing action', { intent: intentResult.intent, entities: intentResult.entities }, 'action-handlers');
                            _a = intentResult.intent;
                            switch (_a) {
                                case 'createCustomer': return [3 /*break*/, 1];
                                case 'deleteCustomer': return [3 /*break*/, 3];
                                case 'confirmDeleteCustomer': return [3 /*break*/, 5];
                                case 'scheduleAppointment': return [3 /*break*/, 7];
                                case 'updateAppointment': return [3 /*break*/, 9];
                                case 'cancelAppointment': return [3 /*break*/, 11];
                                case 'addNote': return [3 /*break*/, 13];
                                case 'markInvoicePaid': return [3 /*break*/, 15];
                                case 'assignTechnician': return [3 /*break*/, 17];
                                case 'sendReminder': return [3 /*break*/, 19];
                                case 'createServicePlan': return [3 /*break*/, 21];
                                case 'help': return [3 /*break*/, 23];
                                case 'updateCustomer': return [3 /*break*/, 25];
                                case 'viewCustomerDetails': return [3 /*break*/, 27];
                                case 'customerHistory': return [3 /*break*/, 29];
                                case 'startJob': return [3 /*break*/, 31];
                                case 'completeJob': return [3 /*break*/, 33];
                                case 'pauseJob': return [3 /*break*/, 35];
                                case 'resumeJob': return [3 /*break*/, 37];
                                case 'jobStatus': return [3 /*break*/, 39];
                                case 'createInvoice': return [3 /*break*/, 41];
                                case 'recordPayment': return [3 /*break*/, 43];
                                case 'sendInvoice': return [3 /*break*/, 45];
                                case 'paymentHistory': return [3 /*break*/, 47];
                                case 'outstandingInvoices': return [3 /*break*/, 49];
                                case 'advancedSearch': return [3 /*break*/, 51];
                                case 'showReports': return [3 /*break*/, 53];
                                case 'technicianSchedule': return [3 /*break*/, 55];
                                case 'technicianAvailability': return [3 /*break*/, 57];
                                case 'technicianPerformance': return [3 /*break*/, 59];
                                case 'technicianLocation': return [3 /*break*/, 61];
                                case 'equipmentAvailability': return [3 /*break*/, 63];
                                case 'assignEquipment': return [3 /*break*/, 65];
                                case 'equipmentMaintenance': return [3 /*break*/, 67];
                                case 'inventoryLevels': return [3 /*break*/, 69];
                                case 'sendAppointmentReminder': return [3 /*break*/, 71];
                                case 'emailConfirmation': return [3 /*break*/, 73];
                                case 'textMessage': return [3 /*break*/, 75];
                                case 'callCustomer': return [3 /*break*/, 77];
                                case 'communicationHistory': return [3 /*break*/, 79];
                                case 'sendFollowUpSurvey': return [3 /*break*/, 81];
                                case 'notifyManager': return [3 /*break*/, 83];
                                case 'alertTechnician': return [3 /*break*/, 85];
                                case 'escalateIssue': return [3 /*break*/, 87];
                                case 'revenueReport': return [3 /*break*/, 89];
                                case 'customerSatisfaction': return [3 /*break*/, 91];
                                case 'serviceCompletionRates': return [3 /*break*/, 93];
                                case 'customerRetention': return [3 /*break*/, 95];
                                case 'dailySchedule': return [3 /*break*/, 97];
                                case 'weeklySummary': return [3 /*break*/, 99];
                                case 'monthlyGrowth': return [3 /*break*/, 101];
                                case 'addServiceNotes': return [3 /*break*/, 103];
                                case 'uploadPhotos': return [3 /*break*/, 105];
                                case 'addChemicalUsed': return [3 /*break*/, 107];
                                case 'serviceDocumentation': return [3 /*break*/, 109];
                                case 'addTechnician': return [3 /*break*/, 111];
                                case 'updateTechnician': return [3 /*break*/, 113];
                                case 'deactivateUser': return [3 /*break*/, 115];
                                case 'resetPassword': return [3 /*break*/, 117];
                                case 'userPermissions': return [3 /*break*/, 119];
                                case 'auditLog': return [3 /*break*/, 121];
                                case 'backupData': return [3 /*break*/, 123];
                                case 'exportData': return [3 /*break*/, 125];
                                case 'importData': return [3 /*break*/, 127];
                                case 'systemHealth': return [3 /*break*/, 129];
                                case 'updateServiceAreas': return [3 /*break*/, 131];
                                case 'configureNotifications': return [3 /*break*/, 133];
                                case 'trendAnalysis': return [3 /*break*/, 135];
                                case 'performanceComparison': return [3 /*break*/, 137];
                                case 'seasonalPatterns': return [3 /*break*/, 139];
                                case 'customerPreferences': return [3 /*break*/, 141];
                            }
                            return [3 /*break*/, 143];
                        case 1: return [4 /*yield*/, this.createCustomer(intentResult)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3: return [4 /*yield*/, this.deleteCustomer(intentResult)];
                        case 4: return [2 /*return*/, _b.sent()];
                        case 5: return [4 /*yield*/, this.confirmDeleteCustomer(intentResult)];
                        case 6: return [2 /*return*/, _b.sent()];
                        case 7: return [4 /*yield*/, this.scheduleAppointment(intentResult)];
                        case 8: return [2 /*return*/, _b.sent()];
                        case 9: return [4 /*yield*/, this.updateAppointment(intentResult)];
                        case 10: return [2 /*return*/, _b.sent()];
                        case 11: return [4 /*yield*/, this.cancelAppointment(intentResult)];
                        case 12: return [2 /*return*/, _b.sent()];
                        case 13: return [4 /*yield*/, this.addNote(intentResult)];
                        case 14: return [2 /*return*/, _b.sent()];
                        case 15: return [4 /*yield*/, this.markInvoicePaid(intentResult)];
                        case 16: return [2 /*return*/, _b.sent()];
                        case 17: return [4 /*yield*/, this.assignTechnician(intentResult)];
                        case 18: return [2 /*return*/, _b.sent()];
                        case 19: return [4 /*yield*/, this.sendReminder(intentResult)];
                        case 20: return [2 /*return*/, _b.sent()];
                        case 21: return [4 /*yield*/, this.createServicePlan(intentResult)];
                        case 22: return [2 /*return*/, _b.sent()];
                        case 23: return [4 /*yield*/, this.showHelp(intentResult)];
                        case 24: return [2 /*return*/, _b.sent()];
                        case 25: return [4 /*yield*/, this.updateCustomer(intentResult)];
                        case 26: return [2 /*return*/, _b.sent()];
                        case 27: return [4 /*yield*/, this.viewCustomerDetails(intentResult)];
                        case 28: return [2 /*return*/, _b.sent()];
                        case 29: return [4 /*yield*/, this.customerHistory(intentResult)];
                        case 30: return [2 /*return*/, _b.sent()];
                        case 31: return [4 /*yield*/, this.startJob(intentResult)];
                        case 32: return [2 /*return*/, _b.sent()];
                        case 33: return [4 /*yield*/, this.completeJob(intentResult)];
                        case 34: return [2 /*return*/, _b.sent()];
                        case 35: return [4 /*yield*/, this.pauseJob(intentResult)];
                        case 36: return [2 /*return*/, _b.sent()];
                        case 37: return [4 /*yield*/, this.resumeJob(intentResult)];
                        case 38: return [2 /*return*/, _b.sent()];
                        case 39: return [4 /*yield*/, this.jobStatus(intentResult)];
                        case 40: return [2 /*return*/, _b.sent()];
                        case 41: return [4 /*yield*/, this.createInvoice(intentResult)];
                        case 42: return [2 /*return*/, _b.sent()];
                        case 43: return [4 /*yield*/, this.recordPayment(intentResult)];
                        case 44: return [2 /*return*/, _b.sent()];
                        case 45: return [4 /*yield*/, this.sendInvoice(intentResult)];
                        case 46: return [2 /*return*/, _b.sent()];
                        case 47: return [4 /*yield*/, this.paymentHistory(intentResult)];
                        case 48: return [2 /*return*/, _b.sent()];
                        case 49: return [4 /*yield*/, this.outstandingInvoices(intentResult)];
                        case 50: return [2 /*return*/, _b.sent()];
                        case 51: return [4 /*yield*/, this.advancedSearch(intentResult)];
                        case 52: return [2 /*return*/, _b.sent()];
                        case 53: return [4 /*yield*/, this.showReports(intentResult)];
                        case 54: return [2 /*return*/, _b.sent()];
                        case 55: return [4 /*yield*/, this.technicianSchedule(intentResult)];
                        case 56: return [2 /*return*/, _b.sent()];
                        case 57: return [4 /*yield*/, this.technicianAvailability(intentResult)];
                        case 58: return [2 /*return*/, _b.sent()];
                        case 59: return [4 /*yield*/, this.technicianPerformance(intentResult)];
                        case 60: return [2 /*return*/, _b.sent()];
                        case 61: return [4 /*yield*/, this.technicianLocation(intentResult)];
                        case 62: return [2 /*return*/, _b.sent()];
                        case 63: return [4 /*yield*/, this.equipmentAvailability(intentResult)];
                        case 64: return [2 /*return*/, _b.sent()];
                        case 65: return [4 /*yield*/, this.assignEquipment(intentResult)];
                        case 66: return [2 /*return*/, _b.sent()];
                        case 67: return [4 /*yield*/, this.equipmentMaintenance(intentResult)];
                        case 68: return [2 /*return*/, _b.sent()];
                        case 69: return [4 /*yield*/, this.inventoryLevels(intentResult)];
                        case 70: return [2 /*return*/, _b.sent()];
                        case 71: return [4 /*yield*/, this.sendAppointmentReminder(intentResult)];
                        case 72: return [2 /*return*/, _b.sent()];
                        case 73: return [4 /*yield*/, this.emailConfirmation(intentResult)];
                        case 74: return [2 /*return*/, _b.sent()];
                        case 75: return [4 /*yield*/, this.textMessage(intentResult)];
                        case 76: return [2 /*return*/, _b.sent()];
                        case 77: return [4 /*yield*/, this.callCustomer(intentResult)];
                        case 78: return [2 /*return*/, _b.sent()];
                        case 79: return [4 /*yield*/, this.communicationHistory(intentResult)];
                        case 80: return [2 /*return*/, _b.sent()];
                        case 81: return [4 /*yield*/, this.sendFollowUpSurvey(intentResult)];
                        case 82: return [2 /*return*/, _b.sent()];
                        case 83: return [4 /*yield*/, this.notifyManager(intentResult)];
                        case 84: return [2 /*return*/, _b.sent()];
                        case 85: return [4 /*yield*/, this.alertTechnician(intentResult)];
                        case 86: return [2 /*return*/, _b.sent()];
                        case 87: return [4 /*yield*/, this.escalateIssue(intentResult)];
                        case 88: return [2 /*return*/, _b.sent()];
                        case 89: return [4 /*yield*/, this.revenueReport(intentResult)];
                        case 90: return [2 /*return*/, _b.sent()];
                        case 91: return [4 /*yield*/, this.customerSatisfaction(intentResult)];
                        case 92: return [2 /*return*/, _b.sent()];
                        case 93: return [4 /*yield*/, this.serviceCompletionRates(intentResult)];
                        case 94: return [2 /*return*/, _b.sent()];
                        case 95: return [4 /*yield*/, this.customerRetention(intentResult)];
                        case 96: return [2 /*return*/, _b.sent()];
                        case 97: return [4 /*yield*/, this.dailySchedule(intentResult)];
                        case 98: return [2 /*return*/, _b.sent()];
                        case 99: return [4 /*yield*/, this.weeklySummary(intentResult)];
                        case 100: return [2 /*return*/, _b.sent()];
                        case 101: return [4 /*yield*/, this.monthlyGrowth(intentResult)];
                        case 102: return [2 /*return*/, _b.sent()];
                        case 103: return [4 /*yield*/, this.addServiceNotes(intentResult)];
                        case 104: return [2 /*return*/, _b.sent()];
                        case 105: return [4 /*yield*/, this.uploadPhotos(intentResult)];
                        case 106: return [2 /*return*/, _b.sent()];
                        case 107: return [4 /*yield*/, this.addChemicalUsed(intentResult)];
                        case 108: return [2 /*return*/, _b.sent()];
                        case 109: return [4 /*yield*/, this.serviceDocumentation(intentResult)];
                        case 110: return [2 /*return*/, _b.sent()];
                        case 111: return [4 /*yield*/, this.addTechnician(intentResult)];
                        case 112: return [2 /*return*/, _b.sent()];
                        case 113: return [4 /*yield*/, this.updateTechnician(intentResult)];
                        case 114: return [2 /*return*/, _b.sent()];
                        case 115: return [4 /*yield*/, this.deactivateUser(intentResult)];
                        case 116: return [2 /*return*/, _b.sent()];
                        case 117: return [4 /*yield*/, this.resetPassword(intentResult)];
                        case 118: return [2 /*return*/, _b.sent()];
                        case 119: return [4 /*yield*/, this.userPermissions(intentResult)];
                        case 120: return [2 /*return*/, _b.sent()];
                        case 121: return [4 /*yield*/, this.auditLog(intentResult)];
                        case 122: return [2 /*return*/, _b.sent()];
                        case 123: return [4 /*yield*/, this.backupData(intentResult)];
                        case 124: return [2 /*return*/, _b.sent()];
                        case 125: return [4 /*yield*/, this.exportData(intentResult)];
                        case 126: return [2 /*return*/, _b.sent()];
                        case 127: return [4 /*yield*/, this.importData(intentResult)];
                        case 128: return [2 /*return*/, _b.sent()];
                        case 129: return [4 /*yield*/, this.systemHealth(intentResult)];
                        case 130: return [2 /*return*/, _b.sent()];
                        case 131: return [4 /*yield*/, this.updateServiceAreas(intentResult)];
                        case 132: return [2 /*return*/, _b.sent()];
                        case 133: return [4 /*yield*/, this.configureNotifications(intentResult)];
                        case 134: return [2 /*return*/, _b.sent()];
                        case 135: return [4 /*yield*/, this.trendAnalysis(intentResult)];
                        case 136: return [2 /*return*/, _b.sent()];
                        case 137: return [4 /*yield*/, this.performanceComparison(intentResult)];
                        case 138: return [2 /*return*/, _b.sent()];
                        case 139: return [4 /*yield*/, this.seasonalPatterns(intentResult)];
                        case 140: return [2 /*return*/, _b.sent()];
                        case 141: return [4 /*yield*/, this.customerPreferences(intentResult)];
                        case 142: return [2 /*return*/, _b.sent()];
                        case 143: return [2 /*return*/, {
                                success: false,
                                message: 'Action not implemented',
                                error: "Action type \"".concat(intentResult.intent, "\" is not supported")
                            }];
                        case 144: return [3 /*break*/, 146];
                        case 145:
                            error_1 = _b.sent();
                            logger_1.logger.error('Action execution failed', error_1, 'action-handlers');
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Action execution failed',
                                    error: error_1 instanceof Error ? error_1.message : 'Unknown error'
                                }];
                        case 146: return [2 /*return*/];
                    }
                });
            });
        }
    });
    // ============================================================================
    // INDIVIDUAL ACTION IMPLEMENTATIONS
    // ============================================================================
    Object.defineProperty(ActionExecutorService.prototype, "createCustomer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerData, requestData, result, resultError, error_2;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            logger_1.logger.debug('createCustomer - processing intent', { intent: intentResult.intent }, 'action-handlers');
                            customerData = (_a = intentResult.actionData) === null || _a === void 0 ? void 0 : _a.customerData;
                            if (!customerData) {
                                throw new Error('Customer data not found');
                            }
                            requestData = {
                                name: customerData.name,
                                address: customerData.address,
                                city: customerData.city,
                                state: customerData.state,
                                zip_code: customerData.zipCode,
                                phone: customerData.phone,
                                email: customerData.email,
                                notes: customerData.notes,
                                account_type: 'residential'
                            };
                            logger_1.logger.debug('createCustomer - API request prepared', { hasRequestData: !!requestData }, 'action-handlers');
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.post('/accounts', requestData)];
                        case 1:
                            result = _b.sent();
                            logger_1.logger.debug('createCustomer - API response received', { customerId: result === null || result === void 0 ? void 0 : result.id }, 'action-handlers');
                            // Invalidate customer-related queries to refresh the UI
                            return [4 /*yield*/, Promise.all([
                                    queryClient_1.invalidateQueries.accounts(),
                                    queryClient_1.queryClient.invalidateQueries({ queryKey: ['secure-customers'] }),
                                    queryClient_1.queryClient.invalidateQueries({ queryKey: ['customers'] }),
                                    queryClient_1.queryClient.invalidateQueries({ queryKey: ['enhanced-account-details'] }),
                                    queryClient_1.queryClient.invalidateQueries({ queryKey: ['customers-count'] }),
                                    queryClient_1.queryClient.invalidateQueries({ queryKey: ['customers-for-scheduling'] }),
                                    queryClient_1.queryClient.invalidateQueries({ queryKey: ['customers-for-filter'] }),
                                    queryClient_1.queryClient.invalidateQueries({ queryKey: ['customer-search'] })
                                ])];
                        case 2:
                            // Invalidate customer-related queries to refresh the UI
                            _b.sent();
                            logger_1.logger.debug('All customer-related caches invalidated after creation', {}, 'action-handlers');
                            resultError = result && typeof result === 'object' && 'error' in result ? result.error : null;
                            if (resultError && typeof resultError === 'string' &&
                                resultError.includes('permission denied for materialized view')) {
                                logger_1.logger.warn('Materialized view permission error (non-critical)', { error: resultError }, 'action-handlers');
                                return [2 /*return*/, {
                                        success: true,
                                        message: "Customer \"".concat(customerData.name, "\" created successfully"),
                                        data: { id: 'created', name: customerData.name }, // Return basic success data
                                        navigation: {
                                            type: 'navigate',
                                            path: "/customers/created",
                                            message: "Navigating to ".concat(customerData.name, "'s customer page...")
                                        }
                                    }];
                            }
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Customer \"".concat(customerData.name, "\" created successfully"),
                                    data: result,
                                    navigation: {
                                        type: 'navigate',
                                        path: "/customers/".concat(result.id || 'created'),
                                        message: "Navigating to ".concat(customerData.name, "'s customer page...")
                                    }
                                }];
                        case 3:
                            error_2 = _b.sent();
                            logger_1.logger.error('createCustomer - Error', error_2, 'action-handlers');
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to create customer',
                                    error: error_2 instanceof Error ? error_2.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "deleteCustomer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerName, bestMatch, error_3;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            logger_1.logger.debug('deleteCustomer - processing intent', { intent: intentResult.intent }, 'action-handlers');
                            customerName = intentResult.entities.customerName;
                            if (!customerName) {
                                throw new Error('Customer name not found');
                            }
                            return [4 /*yield*/, this.findBestCustomerMatch(customerName)];
                        case 1:
                            bestMatch = _b.sent();
                            if (!bestMatch) {
                                throw new Error("No customer found matching \"".concat(customerName, "\". Please check the spelling and try again."));
                            }
                            logger_1.logger.debug('deleteCustomer - found best match', { customerId: (_a = bestMatch === null || bestMatch === void 0 ? void 0 : bestMatch.customer) === null || _a === void 0 ? void 0 : _a.id, score: bestMatch === null || bestMatch === void 0 ? void 0 : bestMatch.score }, 'action-handlers');
                            // Return confirmation request with the actual customer name found
                            return [2 /*return*/, {
                                    success: false, // Not successful yet, requires confirmation
                                    message: "Delete customer \"".concat(bestMatch.name, "\"?"),
                                    requiresConfirmation: true,
                                    confirmationData: {
                                        title: 'Delete Customer',
                                        message: "Are you sure you want to delete \"".concat(bestMatch.name, "\"? This action cannot be undone."),
                                        confirmText: 'Delete Customer',
                                        cancelText: 'Cancel',
                                        type: 'danger'
                                    },
                                    data: {
                                        customerId: bestMatch.id,
                                        customerName: bestMatch.name,
                                        action: 'deleteCustomer'
                                    }
                                }];
                        case 2:
                            error_3 = _b.sent();
                            logger_1.logger.error('deleteCustomer - Error', error_3, 'action-handlers');
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to delete customer',
                                    error: error_3 instanceof Error ? error_3.message : 'Unknown error'
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "confirmDeleteCustomer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var actionData, customerId, customerName, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            logger_1.logger.debug('confirmDeleteCustomer - processing intent', { intent: intentResult.intent }, 'action-handlers');
                            actionData = intentResult.actionData;
                            customerId = actionData === null || actionData === void 0 ? void 0 : actionData.customerId;
                            customerName = actionData === null || actionData === void 0 ? void 0 : actionData.customerName;
                            if (!customerId || !customerName) {
                                throw new Error('Customer ID or name not found in confirmation data');
                            }
                            logger_1.logger.debug('confirmDeleteCustomer - deleting customer', { customerId: customerId, customerName: customerName }, 'action-handlers');
                            // Delete customer via backend API
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.deleteAccount(customerId)];
                        case 1:
                            // Delete customer via backend API
                            _a.sent();
                            logger_1.logger.debug('confirmDeleteCustomer - API response received', { success: true }, 'action-handlers');
                            // Invalidate customer-related queries to refresh the UI
                            return [4 /*yield*/, Promise.all([
                                    queryClient_1.invalidateQueries.accounts(),
                                    queryClient_1.queryClient.invalidateQueries({ queryKey: ['secure-customers'] }),
                                    queryClient_1.queryClient.invalidateQueries({ queryKey: ['customers'] }),
                                    queryClient_1.queryClient.invalidateQueries({ queryKey: ['enhanced-account-details'] }),
                                    queryClient_1.queryClient.invalidateQueries({ queryKey: ['customers-count'] }),
                                    queryClient_1.queryClient.invalidateQueries({ queryKey: ['customers-for-scheduling'] }),
                                    queryClient_1.queryClient.invalidateQueries({ queryKey: ['customers-for-filter'] }),
                                    queryClient_1.queryClient.invalidateQueries({ queryKey: ['customer-search'] })
                                ])];
                        case 2:
                            // Invalidate customer-related queries to refresh the UI
                            _a.sent();
                            logger_1.logger.debug('All customer-related caches invalidated after deletion', {}, 'action-handlers');
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Customer \"".concat(customerName, "\" has been deleted successfully"),
                                    data: { id: customerId, name: customerName },
                                    navigation: {
                                        type: 'navigate',
                                        path: '/customers',
                                        message: 'Redirecting to customer search page...'
                                    }
                                }];
                        case 3:
                            error_4 = _a.sent();
                            logger_1.logger.error('confirmDeleteCustomer - Error', error_4, 'action-handlers');
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to delete customer',
                                    error: error_4 instanceof Error ? error_4.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "scheduleAppointment", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var appointmentData, customer, result, error_5;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            appointmentData = (_a = intentResult.actionData) === null || _a === void 0 ? void 0 : _a.appointmentData;
                            if (!appointmentData) {
                                throw new Error('Appointment data not found');
                            }
                            return [4 /*yield*/, this.findCustomer(appointmentData.customerName || '')];
                        case 1:
                            customer = _b.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(appointmentData.customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.post('/jobs', {
                                    customer_id: customer.id,
                                    service_type: appointmentData.serviceType,
                                    scheduled_date: this.parseDate(appointmentData.date || 'tomorrow'),
                                    scheduled_time: appointmentData.time,
                                    technician: appointmentData.technician,
                                    notes: appointmentData.notes,
                                    status: 'scheduled'
                                })];
                        case 2:
                            result = _b.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Appointment scheduled for ".concat(appointmentData.customerName),
                                    data: result
                                }];
                        case 3:
                            error_5 = _b.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to schedule appointment',
                                    error: error_5 instanceof Error ? error_5.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "updateAppointment", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var appointmentData, customer, appointments, appointment, updateData, result, error_6;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            appointmentData = (_a = intentResult.actionData) === null || _a === void 0 ? void 0 : _a.appointmentData;
                            if (!appointmentData) {
                                throw new Error('Appointment data not found');
                            }
                            return [4 /*yield*/, this.findCustomer(appointmentData.customerName || '')];
                        case 1:
                            customer = _b.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(appointmentData.customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.get("/jobs?customer_id=".concat(customer.id))];
                        case 2:
                            appointments = _b.sent();
                            if (!appointments || appointments.length === 0) {
                                throw new Error("No appointments found for ".concat(appointmentData.customerName));
                            }
                            appointment = appointments[0];
                            updateData = {};
                            if (appointmentData.date)
                                updateData.scheduled_date = this.parseDate(appointmentData.date);
                            if (appointmentData.time)
                                updateData.scheduled_time = appointmentData.time;
                            if (appointmentData.technician)
                                updateData.technician = appointmentData.technician;
                            if (appointmentData.notes)
                                updateData.notes = appointmentData.notes;
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.put("/jobs/".concat(appointment.id), updateData)];
                        case 3:
                            result = _b.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Appointment updated for ".concat(appointmentData.customerName),
                                    data: result
                                }];
                        case 4:
                            error_6 = _b.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to update appointment',
                                    error: error_6 instanceof Error ? error_6.message : 'Unknown error'
                                }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "cancelAppointment", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerName, customer, appointments, appointment, result, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            customerName = intentResult.entities.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _a.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.get("/jobs?customer_id=".concat(customer.id))];
                        case 2:
                            appointments = _a.sent();
                            if (!appointments || appointments.length === 0) {
                                throw new Error("No appointments found for ".concat(customerName));
                            }
                            appointment = appointments[0];
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.put("/jobs/".concat(appointment.id), {
                                    status: 'cancelled'
                                })];
                        case 3:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Appointment cancelled for ".concat(customerName),
                                    data: result
                                }];
                        case 4:
                            error_7 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to cancel appointment',
                                    error: error_7 instanceof Error ? error_7.message : 'Unknown error'
                                }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "addNote", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var noteData, customerName, customer, result, error_8;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            noteData = (_a = intentResult.actionData) === null || _a === void 0 ? void 0 : _a.noteData;
                            if (!noteData) {
                                throw new Error('Note data not found');
                            }
                            customerName = noteData.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _b.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.post('/customer-notes', {
                                    customer_id: customer.id,
                                    note: noteData.note,
                                    priority: noteData.priority || 'medium',
                                    created_by: 'system'
                                })];
                        case 2:
                            result = _b.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Note added for ".concat(customerName),
                                    data: result
                                }];
                        case 3:
                            error_8 = _b.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to add note',
                                    error: error_8 instanceof Error ? error_8.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "markInvoicePaid", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var invoiceId, result, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            invoiceId = intentResult.entities.invoiceId;
                            if (!invoiceId) {
                                throw new Error('Invoice ID is required');
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.put("/invoices/".concat(invoiceId), {
                                    status: 'paid',
                                    paid_date: new Date().toISOString()
                                })];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Invoice ".concat(invoiceId, " marked as paid"),
                                    data: result
                                }];
                        case 2:
                            error_9 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to mark invoice as paid',
                                    error: error_9 instanceof Error ? error_9.message : 'Unknown error'
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "assignTechnician", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var technician, customerName, customer, appointments, appointment, result, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            technician = intentResult.entities.technician;
                            customerName = intentResult.entities.customerName;
                            if (!technician) {
                                throw new Error('Technician name is required');
                            }
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _a.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.get("/jobs?customer_id=".concat(customer.id))];
                        case 2:
                            appointments = _a.sent();
                            if (!appointments || appointments.length === 0) {
                                throw new Error("No appointments found for ".concat(customerName));
                            }
                            appointment = appointments[0];
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.put("/jobs/".concat(appointment.id), {
                                    technician: technician
                                })];
                        case 3:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Technician ".concat(technician, " assigned to ").concat(customerName),
                                    data: result
                                }];
                        case 4:
                            error_10 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to assign technician',
                                    error: error_10 instanceof Error ? error_10.message : 'Unknown error'
                                }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "sendReminder", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerName, customer, result, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            customerName = intentResult.entities.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _a.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.post('/reminders', {
                                    customer_id: customer.id,
                                    type: 'appointment_reminder',
                                    message: 'Reminder: You have an upcoming appointment',
                                    sent_at: new Date().toISOString()
                                })];
                        case 2:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Reminder sent to ".concat(customerName),
                                    data: result
                                }];
                        case 3:
                            error_11 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to send reminder',
                                    error: error_11 instanceof Error ? error_11.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "createServicePlan", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var appointmentData, customerName, customer, result, error_12;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            appointmentData = (_a = intentResult.actionData) === null || _a === void 0 ? void 0 : _a.appointmentData;
                            if (!appointmentData) {
                                throw new Error('Service plan data not found');
                            }
                            customerName = appointmentData.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _b.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.post('/service-plans', {
                                    customer_id: customer.id,
                                    service_type: appointmentData.serviceType || 'general treatment',
                                    frequency: 'quarterly',
                                    start_date: this.parseDate(appointmentData.date || 'next monday'),
                                    address: intentResult.entities.address,
                                    notes: appointmentData.notes
                                })];
                        case 2:
                            result = _b.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Service plan created for ".concat(customerName),
                                    data: result
                                }];
                        case 3:
                            error_12 = _b.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to create service plan',
                                    error: error_12 instanceof Error ? error_12.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "showHelp", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var helpEvent;
                return __generator(this, function (_a) {
                    try {
                        helpEvent = new CustomEvent('showCommandHelp');
                        window.dispatchEvent(helpEvent);
                        return [2 /*return*/, {
                                success: true,
                                message: 'Opening command help...',
                                data: { action: 'showHelp' }
                            }];
                    }
                    catch (error) {
                        return [2 /*return*/, {
                                success: false,
                                message: 'Failed to show help',
                                error: error instanceof Error ? error.message : 'Unknown error'
                            }];
                    }
                    return [2 /*return*/];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "createInvoice", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var invoiceData, customerName, customer, prerequisites, invoiceNumber, result, error_13;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 5, , 6]);
                            invoiceData = (_a = intentResult.actionData) === null || _a === void 0 ? void 0 : _a.invoiceData;
                            if (!invoiceData) {
                                throw new Error('Invoice data not found');
                            }
                            customerName = intentResult.entities.customerName || invoiceData.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _b.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [4 /*yield*/, this.checkInvoicePrerequisites(customer.id)];
                        case 2:
                            prerequisites = _b.sent();
                            if (!prerequisites.canCreateInvoice) {
                                return [2 /*return*/, {
                                        success: false,
                                        message: 'Cannot create invoice - missing prerequisites',
                                        error: prerequisites.missingItems.join(', '),
                                        confirmationData: {
                                            title: 'Missing Prerequisites',
                                            message: "To create an invoice for ".concat(customerName, ", you need to complete the following first:\n\n").concat(prerequisites.missingItems.map(function (item) { return "\u2022 ".concat(item); }).join('\n'), "\n\nWould you like me to help you create these missing items?"),
                                            confirmText: 'Create Missing Items',
                                            cancelText: 'Cancel',
                                            type: 'warning',
                                            action: 'createMissingPrerequisites',
                                            data: { customerId: customer.id, missingItems: prerequisites.missingItems }
                                        }
                                    }];
                            }
                            return [4 /*yield*/, this.generateInvoiceNumber()];
                        case 3:
                            invoiceNumber = _b.sent();
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.post('/invoices', {
                                    invoice_number: invoiceNumber,
                                    account_id: customer.id,
                                    service_agreement_id: prerequisites.serviceAgreementId,
                                    work_order_id: prerequisites.workOrderId,
                                    job_id: prerequisites.jobId,
                                    issue_date: new Date().toISOString().split('T')[0],
                                    due_date: invoiceData.dueDate || this.parseDate('30 days from now'),
                                    subtotal: invoiceData.amount || 0,
                                    tax_amount: 0, // Calculate based on location
                                    total_amount: invoiceData.amount || 0,
                                    balance_due: invoiceData.amount || 0,
                                    payment_terms: 30,
                                    notes: invoiceData.description || 'Service invoice',
                                    items: [{
                                            description: invoiceData.description || 'Service provided',
                                            quantity: 1,
                                            unit_price: invoiceData.amount || 0,
                                            total_price: invoiceData.amount || 0,
                                            service_type_id: prerequisites.serviceTypeId
                                        }]
                                })];
                        case 4:
                            result = _b.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Invoice ".concat(invoiceNumber, " created for ").concat(customerName, " - Amount: $").concat(invoiceData.amount || 0),
                                    data: result
                                }];
                        case 5:
                            error_13 = _b.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to create invoice',
                                    error: error_13 instanceof Error ? error_13.message : 'Unknown error'
                                }];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "checkInvoicePrerequisites", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (customerId) {
            return __awaiter(this, void 0, void 0, function () {
                var missingItems, serviceAgreementId, workOrderId, jobId, serviceTypeId, serviceAgreements, serviceAgreementsData, workOrders, workOrdersData, jobs, jobsData, serviceTypes, serviceTypesData, paymentMethods, paymentMethodsData, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 10, , 11]);
                            missingItems = [];
                            serviceAgreementId = void 0;
                            workOrderId = void 0;
                            jobId = void 0;
                            serviceTypeId = void 0;
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.get("/service-agreements?customer_id=".concat(customerId, "&status=active"))];
                        case 1:
                            serviceAgreements = _a.sent();
                            serviceAgreementsData = serviceAgreements.data || [];
                            if (!serviceAgreementsData || serviceAgreementsData.length === 0) {
                                missingItems.push('Active Service Agreement (Contract)');
                            }
                            else {
                                serviceAgreementId = serviceAgreementsData[0].id;
                                serviceTypeId = serviceAgreementsData[0].service_type_id;
                            }
                            if (!serviceAgreementId) return [3 /*break*/, 3];
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.get("/v1/work-orders?service_agreement_id=".concat(serviceAgreementId, "&status=completed"))];
                        case 2:
                            workOrders = _a.sent();
                            workOrdersData = workOrders.data || [];
                            if (!workOrdersData || workOrdersData.length === 0) {
                                missingItems.push('Completed Work Order (Instructions for Technician)');
                            }
                            else {
                                workOrderId = workOrdersData[0].id;
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            missingItems.push('Completed Work Order (requires Service Agreement first)');
                            _a.label = 4;
                        case 4:
                            if (!workOrderId) return [3 /*break*/, 6];
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.get("/jobs?work_order_id=".concat(workOrderId, "&status=completed"))];
                        case 5:
                            jobs = _a.sent();
                            jobsData = jobs.data || [];
                            if (!jobsData || jobsData.length === 0) {
                                missingItems.push('Completed Job (Work performed by Technician)');
                            }
                            else {
                                jobId = jobsData[0].id;
                            }
                            return [3 /*break*/, 7];
                        case 6:
                            missingItems.push('Completed Job (requires Work Order first)');
                            _a.label = 7;
                        case 7: return [4 /*yield*/, secure_api_client_1.secureApiClient.get('/service-types')];
                        case 8:
                            serviceTypes = _a.sent();
                            serviceTypesData = serviceTypes.data || [];
                            if (!serviceTypesData || serviceTypesData.length === 0) {
                                missingItems.push('Service Types and Pricing Configuration');
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.get("/payment-methods?customer_id=".concat(customerId))];
                        case 9:
                            paymentMethods = _a.sent();
                            paymentMethodsData = paymentMethods.data || [];
                            if (!paymentMethodsData || paymentMethodsData.length === 0) {
                                missingItems.push('Customer Payment Method on File');
                            }
                            return [2 /*return*/, __assign(__assign(__assign(__assign({ canCreateInvoice: missingItems.length === 0, missingItems: missingItems }, (serviceAgreementId && { serviceAgreementId: serviceAgreementId })), (workOrderId && { workOrderId: workOrderId })), (jobId && { jobId: jobId })), (serviceTypeId && { serviceTypeId: serviceTypeId }))];
                        case 10:
                            error_14 = _a.sent();
                            logger_1.logger.error('Error checking invoice prerequisites', error_14, 'action-handlers');
                            return [2 /*return*/, {
                                    canCreateInvoice: false,
                                    missingItems: ['Unable to verify prerequisites - system error']
                                }];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "generateInvoiceNumber", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var now, year, month, response, error_15, timestamp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            now = new Date();
                            year = now.getFullYear();
                            month = String(now.getMonth() + 1).padStart(2, '0');
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.get("/invoices/next-number?year=".concat(year, "&month=").concat(month))];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.invoice_number];
                        case 2:
                            error_15 = _a.sent();
                            timestamp = Date.now().toString().slice(-6);
                            return [2 /*return*/, "INV-".concat(new Date().getFullYear()).concat(String(new Date().getMonth() + 1).padStart(2, '0'), "-").concat(timestamp)];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    // ============================================================================
    // PHASE 1: HIGH PRIORITY COMMAND IMPLEMENTATIONS
    // ============================================================================
    Object.defineProperty(ActionExecutorService.prototype, "updateCustomer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerName, customer, updateData, filteredUpdateData, result, error_16;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            customerName = intentResult.entities.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _b.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            updateData = ((_a = intentResult.actionData) === null || _a === void 0 ? void 0 : _a.customerData) || {};
                            logger_1.logger.debug('Updating customer', { customerName: customer.name, hasUpdateData: !!updateData }, 'action-handlers');
                            filteredUpdateData = Object.fromEntries(Object.entries(updateData).filter(function (_a) {
                                var _ = _a[0], value = _a[1];
                                return value !== undefined && value !== null && value !== '';
                            }));
                            // Ensure we're using the correct field names for the database
                            logger_1.logger.debug('Filtered update data prepared', { fieldCount: Object.keys(filteredUpdateData).length }, 'action-handlers');
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.put("/accounts/".concat(customer.id), filteredUpdateData)];
                        case 2:
                            result = _b.sent();
                            logger_1.logger.debug('Update result received', { success: !!result }, 'action-handlers');
                            // Dispatch custom event to invalidate React Query cache
                            window.dispatchEvent(new CustomEvent('customerUpdated', {
                                detail: { customerId: customer.id, updates: filteredUpdateData }
                            }));
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Customer \"".concat(customerName, "\" updated successfully"),
                                    data: result
                                }];
                        case 3:
                            error_16 = _b.sent();
                            logger_1.logger.error('Update error', error_16, 'action-handlers');
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to update customer',
                                    error: error_16 instanceof Error ? error_16.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "viewCustomerDetails", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerName, customer, error_17;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            customerName = intentResult.entities.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _a.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Showing details for ".concat(customerName),
                                    navigation: {
                                        type: 'navigate',
                                        path: "/customers/".concat(customer.id),
                                        message: "Navigating to ".concat(customerName, "'s profile")
                                    }
                                }];
                        case 2:
                            error_17 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to view customer details',
                                    error: error_17 instanceof Error ? error_17.message : 'Unknown error'
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "customerHistory", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerName, customer, history_1, error_18;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            customerName = intentResult.entities.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _a.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.get("/accounts/".concat(customer.id, "/service-history"))];
                        case 2:
                            history_1 = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Service history for ".concat(customerName),
                                    data: history_1.data
                                }];
                        case 3:
                            error_18 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to get customer history',
                                    error: error_18 instanceof Error ? error_18.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "startJob", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerName, customer, result, error_19;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            customerName = intentResult.entities.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _a.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.post("/jobs/start", {
                                    customer_id: customer.id,
                                    start_time: new Date().toISOString()
                                })];
                        case 2:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Job started for ".concat(customerName),
                                    data: result
                                }];
                        case 3:
                            error_19 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to start job',
                                    error: error_19 instanceof Error ? error_19.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "completeJob", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerName, customer, notes, result, error_20;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            customerName = intentResult.entities.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _a.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            notes = intentResult.entities.notes || 'Job completed';
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.post("/jobs/complete", {
                                    customer_id: customer.id,
                                    completion_notes: notes,
                                    end_time: new Date().toISOString()
                                })];
                        case 2:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Job completed for ".concat(customerName),
                                    data: result
                                }];
                        case 3:
                            error_20 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to complete job',
                                    error: error_20 instanceof Error ? error_20.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "pauseJob", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerName, customer, result, error_21;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            customerName = intentResult.entities.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _a.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.post("/jobs/pause", {
                                    customer_id: customer.id
                                })];
                        case 2:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Job paused for ".concat(customerName),
                                    data: result
                                }];
                        case 3:
                            error_21 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to pause job',
                                    error: error_21 instanceof Error ? error_21.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "resumeJob", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerName, customer, result, error_22;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            customerName = intentResult.entities.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _a.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.post("/jobs/resume", {
                                    customer_id: customer.id
                                })];
                        case 2:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Job resumed for ".concat(customerName),
                                    data: result
                                }];
                        case 3:
                            error_22 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to resume job',
                                    error: error_22 instanceof Error ? error_22.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "jobStatus", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerName, customer, status_1, error_23;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            customerName = intentResult.entities.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _a.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.get("/jobs/status?customer_id=".concat(customer.id))];
                        case 2:
                            status_1 = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Job status for ".concat(customerName),
                                    data: status_1.data
                                }];
                        case 3:
                            error_23 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to get job status',
                                    error: error_23 instanceof Error ? error_23.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "recordPayment", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerName, amount, customer, result, error_24;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            customerName = intentResult.entities.customerName;
                            amount = intentResult.entities.amount;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            if (!amount) {
                                throw new Error('Payment amount is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _a.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.post('/payments', {
                                    customer_id: customer.id,
                                    amount: amount,
                                    payment_date: new Date().toISOString().split('T')[0],
                                    payment_method: 'cash'
                                })];
                        case 2:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Payment of $".concat(amount, " recorded for ").concat(customerName),
                                    data: result
                                }];
                        case 3:
                            error_24 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to record payment',
                                    error: error_24 instanceof Error ? error_24.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "sendInvoice", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerName, customer, result, error_25;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            customerName = intentResult.entities.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _a.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.post("/invoices/send", {
                                    customer_id: customer.id
                                })];
                        case 2:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Invoice sent to ".concat(customerName),
                                    data: result
                                }];
                        case 3:
                            error_25 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to send invoice',
                                    error: error_25 instanceof Error ? error_25.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "paymentHistory", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var customerName, customer, history_2, error_26;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            customerName = intentResult.entities.customerName;
                            if (!customerName) {
                                throw new Error('Customer name is required');
                            }
                            return [4 /*yield*/, this.findCustomer(customerName)];
                        case 1:
                            customer = _a.sent();
                            if (!customer) {
                                throw new Error("Customer \"".concat(customerName, "\" not found"));
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.get("/payments?customer_id=".concat(customer.id))];
                        case 2:
                            history_2 = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Payment history for ".concat(customerName),
                                    data: history_2.data
                                }];
                        case 3:
                            error_26 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to get payment history',
                                    error: error_26 instanceof Error ? error_26.message : 'Unknown error'
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "outstandingInvoices", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var invoices, error_27;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.get('/invoices?status=outstanding')];
                        case 1:
                            invoices = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Outstanding invoices retrieved',
                                    data: invoices.data
                                }];
                        case 2:
                            error_27 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to get outstanding invoices',
                                    error: error_27 instanceof Error ? error_27.message : 'Unknown error'
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "advancedSearch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var query, results, error_28;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            query = intentResult.originalQuery;
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.post('/search/advanced', {
                                    query: query,
                                    filters: intentResult.entities
                                })];
                        case 1:
                            results = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Advanced search results for \"".concat(query, "\""),
                                    data: results.data
                                }];
                        case 2:
                            error_28 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Advanced search failed',
                                    error: error_28 instanceof Error ? error_28.message : 'Unknown error'
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "showReports", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        return [2 /*return*/, {
                                success: true,
                                message: 'Opening reports dashboard',
                                navigation: {
                                    type: 'navigate',
                                    path: '/reports',
                                    message: 'Navigating to reports page'
                                }
                            }];
                    }
                    catch (error) {
                        return [2 /*return*/, {
                                success: false,
                                message: 'Failed to show reports',
                                error: error instanceof Error ? error.message : 'Unknown error'
                            }];
                    }
                    return [2 /*return*/];
                });
            });
        }
    });
    // ============================================================================
    // PHASE 2 & 3: STUB IMPLEMENTATIONS
    // ============================================================================
    // These are placeholder implementations that return "not implemented" messages
    // They can be fully implemented as needed
    Object.defineProperty(ActionExecutorService.prototype, "technicianSchedule", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Technician schedule feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "technicianAvailability", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Technician availability feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "technicianPerformance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Technician performance feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "technicianLocation", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Technician location feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "equipmentAvailability", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Equipment availability feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "assignEquipment", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Assign equipment feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "equipmentMaintenance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Equipment maintenance feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "inventoryLevels", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Inventory levels feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "sendAppointmentReminder", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Send appointment reminder feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "emailConfirmation", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Email confirmation feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "textMessage", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Text message feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "callCustomer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Call customer feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "communicationHistory", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Communication history feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "sendFollowUpSurvey", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Send follow-up survey feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "notifyManager", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Notify manager feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "alertTechnician", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Alert technician feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "escalateIssue", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Escalate issue feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "revenueReport", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Revenue report feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "customerSatisfaction", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Customer satisfaction feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "serviceCompletionRates", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Service completion rates feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "customerRetention", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Customer retention feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "dailySchedule", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Daily schedule feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "weeklySummary", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Weekly summary feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "monthlyGrowth", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Monthly growth feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "addServiceNotes", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Add service notes feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "uploadPhotos", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Upload photos feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "addChemicalUsed", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Add chemical used feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "serviceDocumentation", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Service documentation feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "addTechnician", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Add technician feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "updateTechnician", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Update technician feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "deactivateUser", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Deactivate user feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "resetPassword", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Reset password feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "userPermissions", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'User permissions feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "auditLog", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Audit log feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "backupData", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Backup data feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "exportData", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Export data feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "importData", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Import data feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "systemHealth", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'System health feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "updateServiceAreas", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Update service areas feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "configureNotifications", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Configure notifications feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "trendAnalysis", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Trend analysis feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "performanceComparison", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Performance comparison feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "seasonalPatterns", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Seasonal patterns feature not yet implemented' }];
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "customerPreferences", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: false, message: 'Customer preferences feature not yet implemented' }];
                });
            });
        }
    });
    // ============================================================================
    // HELPER METHODS
    // ============================================================================
    Object.defineProperty(ActionExecutorService.prototype, "findCustomer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (customerName_1) {
            return __awaiter(this, arguments, void 0, function (customerName, requireExactMatch) {
                var _a, sanitizedName, tokens_1, customers, target_1, exactMatch, partialMatch, hasAddressTokens, scored, best, error_29;
                if (requireExactMatch === void 0) { requireExactMatch = false; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            _a = this.extractNameAndAddress(customerName || ''), sanitizedName = _a.name, tokens_1 = _a.tokens;
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.getAllAccounts()];
                        case 1:
                            customers = _b.sent();
                            if (customers && customers.length > 0) {
                                target_1 = sanitizedName || customerName;
                                exactMatch = customers.find(function (c) {
                                    return c.name.toLowerCase() === target_1.toLowerCase();
                                });
                                if (exactMatch)
                                    return [2 /*return*/, exactMatch];
                                // If exact match required (for delete operations), don't do partial matching
                                if (requireExactMatch) {
                                    return [2 /*return*/, null];
                                }
                                partialMatch = customers.find(function (c) {
                                    return c.name.toLowerCase().includes(target_1.toLowerCase());
                                });
                                if (partialMatch)
                                    return [2 /*return*/, partialMatch];
                                hasAddressTokens = !!(tokens_1.streetNumber || tokens_1.street || tokens_1.city || tokens_1.state || tokens_1.zip);
                                if (hasAddressTokens) {
                                    scored = customers.map(function (c) {
                                        var addr = "".concat(c.address || '', " ").concat(c.city || '', " ").concat(c.state || '', " ").concat(c.zip_code || '').toLowerCase();
                                        var score = 0;
                                        if (tokens_1.zip && addr.includes((tokens_1.zip || '').toLowerCase()))
                                            score += 50;
                                        if (tokens_1.state && addr.includes((tokens_1.state || '').toLowerCase()))
                                            score += 20;
                                        if (tokens_1.city && addr.includes((tokens_1.city || '').toLowerCase()))
                                            score += 25;
                                        if (tokens_1.streetNumber && addr.includes((tokens_1.streetNumber || '').toLowerCase()))
                                            score += 20;
                                        if (tokens_1.street) {
                                            // boost for presence of all words of street
                                            var streetWords = (tokens_1.street || '').toLowerCase().split(/\s+/).filter(Boolean);
                                            var matchedWords = streetWords.filter(function (w) { return addr.includes(w); }).length;
                                            score += matchedWords * 8;
                                        }
                                        return { c: c, score: score };
                                    }).sort(function (a, b) { return b.score - a.score; });
                                    best = scored[0];
                                    if (best && best.score >= 40) {
                                        return [2 /*return*/, best.c];
                                    }
                                }
                                // Return null if no match found
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, null];
                        case 2:
                            error_29 = _b.sent();
                            logger_1.logger.error('Failed to find customer', error_29, 'action-handlers');
                            return [2 /*return*/, null];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "findBestCustomerMatch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (searchName) {
            return __awaiter(this, void 0, void 0, function () {
                var customers, searchLower_1, scoredMatches, bestMatch, error_30;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.getAllAccounts()];
                        case 1:
                            customers = _a.sent();
                            if (!customers || customers.length === 0) {
                                return [2 /*return*/, null];
                            }
                            searchLower_1 = searchName.toLowerCase().trim();
                            scoredMatches = customers.map(function (customer) {
                                var customerName = customer.name.toLowerCase().trim();
                                var score = 0;
                                // Exact match gets highest score
                                if (customerName === searchLower_1) {
                                    score = 100;
                                }
                                // Starts with search term gets high score
                                else if (customerName.startsWith(searchLower_1)) {
                                    score = 80;
                                }
                                // Contains search term gets medium score
                                else if (customerName.includes(searchLower_1)) {
                                    score = 60;
                                }
                                // Word boundary matches get medium-high score
                                else if (new RegExp("\\b".concat(searchLower_1), 'i').test(customerName)) {
                                    score = 70;
                                }
                                // Levenshtein distance for fuzzy matching
                                else {
                                    var distance = _this.levenshteinDistance(searchLower_1, customerName);
                                    var maxLength = Math.max(searchLower_1.length, customerName.length);
                                    score = Math.max(0, 50 - (distance / maxLength) * 50);
                                }
                                return { customer: customer, score: score };
                            });
                            // Sort by score (highest first) and return the best match
                            scoredMatches.sort(function (a, b) { return b.score - a.score; });
                            bestMatch = scoredMatches[0];
                            if (bestMatch && bestMatch.score >= 30) {
                                logger_1.logger.debug('Best customer match found', { searchName: searchName, matchedName: bestMatch.customer.name, score: bestMatch.score }, 'action-handlers');
                                return [2 /*return*/, bestMatch.customer];
                            }
                            return [2 /*return*/, null];
                        case 2:
                            error_30 = _a.sent();
                            logger_1.logger.error('Failed to find best customer match', error_30, 'action-handlers');
                            return [2 /*return*/, null];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "levenshteinDistance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (str1, str2) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var matrix = [];
            // Initialize matrix
            for (var j = 0; j <= str2.length; j++) {
                matrix[j] = [];
                for (var i = 0; i <= str1.length; i++) {
                    if (j === 0) {
                        matrix[j][i] = i;
                    }
                    else if (i === 0) {
                        matrix[j][i] = j;
                    }
                    else {
                        matrix[j][i] = 0;
                    }
                }
            }
            // Fill the matrix
            for (var j = 1; j <= str2.length; j++) {
                for (var i = 1; i <= str1.length; i++) {
                    var indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                    var deletion = ((_b = (_a = matrix[j]) === null || _a === void 0 ? void 0 : _a[i - 1]) !== null && _b !== void 0 ? _b : 0) + 1;
                    var insertion = ((_d = (_c = matrix[j - 1]) === null || _c === void 0 ? void 0 : _c[i]) !== null && _d !== void 0 ? _d : 0) + 1;
                    var substitution = ((_f = (_e = matrix[j - 1]) === null || _e === void 0 ? void 0 : _e[i - 1]) !== null && _f !== void 0 ? _f : 0) + indicator;
                    matrix[j][i] = Math.min(deletion, insertion, substitution);
                }
            }
            return (_h = (_g = matrix[str2.length]) === null || _g === void 0 ? void 0 : _g[str1.length]) !== null && _h !== void 0 ? _h : 0;
        }
    });
    Object.defineProperty(ActionExecutorService.prototype, "parseDate", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (dateString) {
            var now = new Date();
            var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            switch (dateString.toLowerCase()) {
                case 'today': {
                    return today.toISOString().split('T')[0] || '';
                }
                case 'tomorrow': {
                    var tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return tomorrow.toISOString().split('T')[0] || '';
                }
                case 'yesterday': {
                    var yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    return yesterday.toISOString().split('T')[0] || '';
                }
                default: {
                    // Try to parse as date
                    var parsed = new Date(dateString);
                    if (!isNaN(parsed.getTime())) {
                        return parsed.toISOString().split('T')[0] || '';
                    }
                    // Default to tomorrow
                    var defaultDate = new Date(today);
                    defaultDate.setDate(defaultDate.getDate() + 1);
                    return defaultDate.toISOString().split('T')[0] || '';
                }
            }
        }
    });
    return ActionExecutorService;
}());
// Export singleton instance
exports.actionExecutorService = new ActionExecutorService();
var templateObject_1, templateObject_2;
// Types are already exported above
