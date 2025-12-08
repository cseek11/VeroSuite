"use strict";
// ============================================================================
// ENHANCED ACTION HANDLER SERVICE
// ============================================================================
// Robust action execution with transactions, validation, and error recovery
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
exports.EnhancedActionHandler = void 0;
var secure_api_client_1 = require("./secure-api-client");
var queryClient_1 = require("./queryClient");
var logger_1 = require("@/utils/logger");
var EnhancedActionHandler = /** @class */ (function () {
    function EnhancedActionHandler() {
        Object.defineProperty(this, "activeTransactions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    /**
     * Execute action with comprehensive error handling and validation
     */
    Object.defineProperty(EnhancedActionHandler.prototype, "executeAction", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, transactionId, preValidation, transaction, result, error_1, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = Date.now();
                            transactionId = crypto.randomUUID();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Enhanced action execution started', {
                                    intent: intentResult.intent,
                                    transactionId: transactionId,
                                    entities: intentResult.entities
                                }, 'enhanced-action-handler');
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 9, 12, 13]);
                            return [4 /*yield*/, this.preValidateAction(intentResult)];
                        case 2:
                            preValidation = _a.sent();
                            if (!preValidation.isValid) {
                                return [2 /*return*/, {
                                        success: false,
                                        message: 'Validation failed',
                                        errors: preValidation.errors,
                                        warnings: [],
                                        suggestions: preValidation.suggestions,
                                        executionTime: Date.now() - startTime
                                    }];
                            }
                            transaction = this.createTransaction(transactionId);
                            return [4 /*yield*/, this.executeWithTransaction(intentResult, transaction)];
                        case 3:
                            result = _a.sent();
                            if (!result.success) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.commitTransaction(transaction)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, this.invalidateRelevantCaches(intentResult.intent)];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 6: return [4 /*yield*/, this.rollbackTransaction(transaction)];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8:
                            result.executionTime = Date.now() - startTime;
                            result.transactionId = transactionId;
                            return [2 /*return*/, result];
                        case 9:
                            error_1 = _a.sent();
                            logger_1.logger.error('Enhanced action execution failed', error_1, 'enhanced-action-handler');
                            transaction = this.activeTransactions.get(transactionId);
                            if (!transaction) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.rollbackTransaction(transaction)];
                        case 10:
                            _a.sent();
                            _a.label = 11;
                        case 11: return [2 /*return*/, {
                                success: false,
                                message: 'Action execution failed',
                                errors: [error_1 instanceof Error ? error_1.message : 'Unknown error'],
                                warnings: [],
                                suggestions: ['Please try again or contact support'],
                                executionTime: Date.now() - startTime,
                                transactionId: transactionId
                            }];
                        case 12:
                            this.activeTransactions.delete(transactionId);
                            return [7 /*endfinally*/];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Pre-validate action before execution
     */
    Object.defineProperty(EnhancedActionHandler.prototype, "preValidateAction", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult) {
            return __awaiter(this, void 0, void 0, function () {
                var errors, suggestions, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            errors = [];
                            suggestions = [];
                            // Check if we have validation errors from intent classification
                            if (intentResult.validationErrors.length > 0) {
                                errors.push.apply(errors, intentResult.validationErrors);
                            }
                            _a = intentResult.intent;
                            switch (_a) {
                                case 'updateCustomer': return [3 /*break*/, 1];
                                case 'deleteCustomer': return [3 /*break*/, 3];
                                case 'createCustomer': return [3 /*break*/, 5];
                            }
                            return [3 /*break*/, 7];
                        case 1: return [4 /*yield*/, this.validateUpdateCustomer(intentResult, errors, suggestions)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 7];
                        case 3: return [4 /*yield*/, this.validateDeleteCustomer(intentResult, errors, suggestions)];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.validateCreateCustomer(intentResult, errors, suggestions)];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/, {
                                isValid: errors.length === 0,
                                errors: errors,
                                suggestions: suggestions
                            }];
                    }
                });
            });
        }
    });
    /**
     * Validate customer update operation
     */
    Object.defineProperty(EnhancedActionHandler.prototype, "validateUpdateCustomer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult, errors, suggestions) {
            return __awaiter(this, void 0, void 0, function () {
                var entities, customer, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            entities = intentResult.entities;
                            // Check if customer name is provided
                            if (!entities.customerName) {
                                errors.push('Customer name is required for updates');
                                suggestions.push('Please specify which customer to update');
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.findCustomerSafely(entities.customerName)];
                        case 2:
                            customer = _a.sent();
                            if (!customer) {
                                errors.push("Customer \"".concat(entities.customerName, "\" not found"));
                                suggestions.push('Please check the customer name spelling');
                                return [2 /*return*/];
                            }
                            // Validate update fields
                            if (entities.phone && entities.validation.phone && !entities.validation.phone.isValid) {
                                errors.push.apply(errors, entities.validation.phone.issues);
                                suggestions.push.apply(suggestions, entities.validation.phone.suggestions);
                            }
                            if (entities.email && entities.validation.email && !entities.validation.email.isValid) {
                                errors.push.apply(errors, entities.validation.email.issues);
                                suggestions.push.apply(suggestions, entities.validation.email.suggestions);
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            errors.push('Failed to verify customer exists');
                            suggestions.push('Please try again or check your connection');
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Safely find customer with error handling
     */
    Object.defineProperty(EnhancedActionHandler.prototype, "findCustomerSafely", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (customerName) {
            return __awaiter(this, void 0, void 0, function () {
                var customers, exactMatch, partialMatch, error_3;
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
                            exactMatch = customers.find(function (c) {
                                return c.name.toLowerCase() === customerName.toLowerCase();
                            });
                            if (exactMatch)
                                return [2 /*return*/, exactMatch];
                            partialMatch = customers.find(function (c) {
                                return c.name.toLowerCase().includes(customerName.toLowerCase()) ||
                                    customerName.toLowerCase().includes(c.name.toLowerCase());
                            });
                            return [2 /*return*/, partialMatch || null];
                        case 2:
                            error_3 = _a.sent();
                            logger_1.logger.error('Error finding customer', error_3, 'enhanced-action-handler');
                            throw new Error('Failed to search for customer');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Execute action with transaction support
     */
    Object.defineProperty(EnhancedActionHandler.prototype, "executeWithTransaction", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult, transaction) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = intentResult.intent;
                            switch (_a) {
                                case 'updateCustomer': return [3 /*break*/, 1];
                                case 'deleteCustomer': return [3 /*break*/, 3];
                                case 'createCustomer': return [3 /*break*/, 5];
                            }
                            return [3 /*break*/, 7];
                        case 1: return [4 /*yield*/, this.executeUpdateCustomer(intentResult, transaction)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3: return [4 /*yield*/, this.executeDeleteCustomer(intentResult, transaction)];
                        case 4: return [2 /*return*/, _b.sent()];
                        case 5: return [4 /*yield*/, this.executeCreateCustomer(intentResult, transaction)];
                        case 6: return [2 /*return*/, _b.sent()];
                        case 7: throw new Error("Unsupported intent: ".concat(intentResult.intent));
                    }
                });
            });
        }
    });
    /**
     * Execute customer update with transaction support
     */
    Object.defineProperty(EnhancedActionHandler.prototype, "executeUpdateCustomer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intentResult, transaction) {
            return __awaiter(this, void 0, void 0, function () {
                var entities, customer, originalData, updateData, result, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            entities = intentResult.entities;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.findCustomerSafely(entities.customerName)];
                        case 2:
                            customer = _a.sent();
                            if (!customer) {
                                return [2 /*return*/, {
                                        success: false,
                                        message: "Customer \"".concat(entities.customerName, "\" not found"),
                                        errors: ['Customer not found'],
                                        warnings: [],
                                        suggestions: ['Please check the customer name spelling']
                                    }];
                            }
                            originalData = __assign({}, customer);
                            updateData = {};
                            if (entities.phone)
                                updateData.phone = entities.phone;
                            if (entities.email)
                                updateData.email = entities.email;
                            if (entities.address)
                                updateData.address = entities.address;
                            if (entities.city)
                                updateData.city = entities.city;
                            if (entities.state)
                                updateData.state = entities.state;
                            if (entities.zipCode)
                                updateData.zipCode = entities.zipCode;
                            // Add to transaction
                            this.addTransactionOperation(transaction, {
                                type: 'update',
                                table: 'accounts',
                                id: customer.id,
                                data: updateData,
                                originalData: originalData
                            });
                            // Execute update
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Executing customer update', {
                                    customerId: customer.id,
                                    updateData: updateData
                                }, 'enhanced-action-handler');
                            }
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.updateAccount(customer.id, updateData)];
                        case 3:
                            result = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Update result', { result: result }, 'enhanced-action-handler');
                            }
                            // Validate result
                            if (!result || typeof result !== 'object') {
                                throw new Error('Invalid response from update operation');
                            }
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Customer \"".concat(entities.customerName, "\" updated successfully"),
                                    data: result,
                                    errors: [],
                                    warnings: [],
                                    suggestions: []
                                }];
                        case 4:
                            error_4 = _a.sent();
                            logger_1.logger.error('Customer update failed', error_4, 'enhanced-action-handler');
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Failed to update customer',
                                    errors: [error_4 instanceof Error ? error_4.message : 'Unknown error'],
                                    warnings: [],
                                    suggestions: ['Please try again or contact support']
                                }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Create transaction context
     */
    Object.defineProperty(EnhancedActionHandler.prototype, "createTransaction", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id) {
            var transaction = {
                id: id,
                operations: [],
                rollbackData: [],
                startTime: new Date(),
                status: 'pending'
            };
            this.activeTransactions.set(id, transaction);
            return transaction;
        }
    });
    /**
     * Add operation to transaction
     */
    Object.defineProperty(EnhancedActionHandler.prototype, "addTransactionOperation", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (transaction, operation) {
            transaction.operations.push(operation);
            if (operation.originalData) {
                transaction.rollbackData.push(operation.originalData);
            }
        }
    });
    /**
     * Commit transaction
     */
    Object.defineProperty(EnhancedActionHandler.prototype, "commitTransaction", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (transaction) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        transaction.status = 'committed';
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Transaction committed', { transactionId: transaction.id }, 'enhanced-action-handler');
                        }
                    }
                    catch (error) {
                        logger_1.logger.error('Transaction commit failed', error, 'enhanced-action-handler');
                        transaction.status = 'failed';
                        throw error;
                    }
                    return [2 /*return*/];
                });
            });
        }
    });
    /**
     * Rollback transaction
     */
    Object.defineProperty(EnhancedActionHandler.prototype, "rollbackTransaction", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (transaction) {
            return __awaiter(this, void 0, void 0, function () {
                var i, operation, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Rolling back transaction', { transactionId: transaction.id }, 'enhanced-action-handler');
                            }
                            i = transaction.operations.length - 1;
                            _a.label = 1;
                        case 1:
                            if (!(i >= 0)) return [3 /*break*/, 4];
                            operation = transaction.operations[i];
                            if (!operation) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.rollbackOperation(operation)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            i--;
                            return [3 /*break*/, 1];
                        case 4:
                            transaction.status = 'rolled_back';
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Transaction rolled back', { transactionId: transaction.id }, 'enhanced-action-handler');
                            }
                            return [3 /*break*/, 6];
                        case 5:
                            error_5 = _a.sent();
                            logger_1.logger.error('Transaction rollback failed', error_5, 'enhanced-action-handler');
                            transaction.status = 'failed';
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Rollback individual operation
     */
    Object.defineProperty(EnhancedActionHandler.prototype, "rollbackOperation", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (operation) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, error_6;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 11, , 12]);
                            _a = operation.type;
                            switch (_a) {
                                case 'update': return [3 /*break*/, 1];
                                case 'create': return [3 /*break*/, 4];
                                case 'delete': return [3 /*break*/, 7];
                            }
                            return [3 /*break*/, 10];
                        case 1:
                            if (!(operation.id && operation.originalData)) return [3 /*break*/, 3];
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.updateAccount(operation.id, operation.originalData)];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3: return [3 /*break*/, 10];
                        case 4:
                            if (!operation.id) return [3 /*break*/, 6];
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.deleteAccount(operation.id)];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6: return [3 /*break*/, 10];
                        case 7:
                            if (!operation.originalData) return [3 /*break*/, 9];
                            return [4 /*yield*/, secure_api_client_1.secureApiClient.createAccount(operation.originalData)];
                        case 8:
                            _b.sent();
                            _b.label = 9;
                        case 9: return [3 /*break*/, 10];
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            error_6 = _b.sent();
                            logger_1.logger.error('Failed to rollback operation', error_6, 'enhanced-action-handler');
                            return [3 /*break*/, 12];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Invalidate relevant caches after successful operation
     */
    Object.defineProperty(EnhancedActionHandler.prototype, "invalidateRelevantCaches", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intent) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, error_7;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 5, , 6]);
                            _a = intent;
                            switch (_a) {
                                case 'updateCustomer': return [3 /*break*/, 1];
                                case 'createCustomer': return [3 /*break*/, 1];
                                case 'deleteCustomer': return [3 /*break*/, 1];
                            }
                            return [3 /*break*/, 4];
                        case 1: return [4 /*yield*/, queryClient_1.queryClient.invalidateQueries({ queryKey: ['accounts'] })];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, queryClient_1.queryClient.invalidateQueries({ queryKey: ['customers'] })];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_7 = _b.sent();
                            logger_1.logger.error('Cache invalidation failed', error_7, 'enhanced-action-handler');
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    });
    // Placeholder methods for other operations
    Object.defineProperty(EnhancedActionHandler.prototype, "validateDeleteCustomer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult, _errors, _suggestions) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        }
    });
    Object.defineProperty(EnhancedActionHandler.prototype, "validateCreateCustomer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult, _errors, _suggestions) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        }
    });
    Object.defineProperty(EnhancedActionHandler.prototype, "executeDeleteCustomer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult, _transaction) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Implement delete operation
                    throw new Error('Delete customer not implemented');
                });
            });
        }
    });
    Object.defineProperty(EnhancedActionHandler.prototype, "executeCreateCustomer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_intentResult, _transaction) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Implement create operation
                    throw new Error('Create customer not implemented');
                });
            });
        }
    });
    return EnhancedActionHandler;
}());
exports.EnhancedActionHandler = EnhancedActionHandler;
