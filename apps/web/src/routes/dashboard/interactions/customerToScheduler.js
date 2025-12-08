"use strict";
/**
 * Customer → Scheduler Interaction
 *
 * First card interaction implementation: Drag customer to scheduler card
 * to create an appointment.
 *
 * This demonstrates the pattern for implementing card interactions.
 */
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
exports.registerCustomerSearchCard = registerCustomerSearchCard;
exports.registerSchedulerCard = registerSchedulerCard;
exports.initializeCustomerToSchedulerInteraction = initializeCustomerToSchedulerInteraction;
var CardInteractionRegistry_1 = require("../utils/CardInteractionRegistry");
var logger_1 = require("@/utils/logger");
/**
 * Create appointment from customer drag
 */
function createAppointmentFromCustomer(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var customer, appointmentData, event_1;
        return __generator(this, function (_a) {
            try {
                customer = payload.data.entity;
                logger_1.logger.debug('Creating appointment from customer drag', {
                    customerId: customer.id,
                    customerName: customer.name
                });
                appointmentData = {
                    customerId: customer.id,
                    customerName: customer.name,
                    customer: customer,
                    // Default to today, user will select time
                    date: new Date().toISOString().split('T')[0]
                };
                event_1 = new CustomEvent('card-interaction:create-appointment', {
                    detail: {
                        customer: customer,
                        appointmentData: appointmentData
                    }
                });
                window.dispatchEvent(event_1);
                return [2 /*return*/, {
                        success: true,
                        message: "Opening appointment creation for ".concat(customer.name),
                        data: appointmentData
                    }];
            }
            catch (error) {
                logger_1.logger.error('Error creating appointment from customer', error);
                return [2 /*return*/, {
                        success: false,
                        error: error instanceof Error ? error.message : 'Failed to create appointment'
                    }];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Register Customer Search Card configuration
 */
function registerCustomerSearchCard() {
    var registry = (0, CardInteractionRegistry_1.getCardInteractionRegistry)();
    var config = {
        id: 'customer-search',
        type: 'customer-search',
        canDrag: true,
        dragConfig: {
            dataType: 'customer',
            supportsMultiSelect: false,
            getDragPayload: function (customer) { return ({
                sourceCardId: 'customer-search',
                sourceCardType: 'customer-search',
                sourceDataType: 'customer',
                data: {
                    id: customer.id,
                    type: 'customer',
                    entity: customer
                },
                dragPreview: {
                    title: customer.name || 'Customer',
                    icon: '👤',
                    color: '#3b82f6'
                },
                timestamp: Date.now(),
                userId: 'current-user' // Will be replaced with actual user ID
            }); },
            getDragPreview: function (customer) { return ({
                title: customer.name || 'Customer',
                icon: '👤',
                color: '#3b82f6'
            }); }
        }
    };
    registry.registerCard(config);
    logger_1.logger.debug('Registered Customer Search Card for interactions');
}
/**
 * Register Scheduler Card configuration
 */
function registerSchedulerCard() {
    var _this = this;
    var registry = (0, CardInteractionRegistry_1.getCardInteractionRegistry)();
    var config = {
        id: 'scheduler',
        type: 'scheduler',
        dropZones: [
            {
                cardId: 'scheduler',
                cardType: 'scheduler',
                accepts: {
                    dataTypes: ['customer', 'job', 'workorder']
                },
                actions: {
                    'create-appointment': {
                        id: 'create-appointment',
                        label: 'Create Appointment',
                        icon: '📅',
                        description: 'Schedule a new appointment for this customer',
                        handler: createAppointmentFromCustomer,
                        requiresConfirmation: false
                    },
                    'reschedule': {
                        id: 'reschedule',
                        label: 'Reschedule Existing',
                        icon: '🔄',
                        description: 'Reschedule an existing appointment',
                        handler: function (_payload) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                // TODO: Implement reschedule logic
                                return [2 /*return*/, {
                                        success: false,
                                        error: 'Reschedule not yet implemented'
                                    }];
                            });
                        }); },
                        requiresConfirmation: true,
                        confirmationMessage: 'Are you sure you want to reschedule this appointment?'
                    }
                },
                dropZoneStyle: {
                    highlightColor: '#6366f1',
                    borderStyle: 'dashed',
                    backgroundColor: 'rgba(99, 102, 241, 0.05)'
                }
            }
        ]
    };
    registry.registerCard(config);
    logger_1.logger.debug('Registered Scheduler Card for interactions');
}
/**
 * Initialize all customer-to-scheduler interactions
 */
function initializeCustomerToSchedulerInteraction() {
    registerCustomerSearchCard();
    registerSchedulerCard();
    logger_1.logger.info('Customer → Scheduler interaction initialized');
}
