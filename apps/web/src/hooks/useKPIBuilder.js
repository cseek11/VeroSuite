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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKPIBuilder = useKPIBuilder;
var react_1 = require("react");
var logger_1 = require("@/utils/logger");
function useKPIBuilder(_a) {
    var _this = this;
    var _b = _a.availableFields, availableFields = _b === void 0 ? [] : _b, onSave = _a.onSave, onTest = _a.onTest;
    var _c = (0, react_1.useState)({
        category: 'operational',
        formula: {
            id: 'formula-1',
            name: 'Custom Formula',
            expression: '',
            fields: [],
            validation: {
                isValid: false,
                errors: []
            }
        },
        threshold: {
            green: 80,
            yellow: 60,
            red: 40,
            unit: '%'
        },
        chart: {
            type: 'number',
            showTrend: true
        },
        dataSource: {
            table: 'jobs'
        },
        isRealTime: false
    }), currentKPI = _c[0], setCurrentKPI = _c[1];
    var _d = (0, react_1.useState)({
        isDragging: false,
        draggedItem: null,
        dragOverTarget: null
    }), dragState = _d[0], setDragState = _d[1];
    // Available data sources
    var dataSources = (0, react_1.useMemo)(function () { return [
        { id: 'jobs', name: 'Jobs', description: 'Service jobs and appointments' },
        { id: 'customers', name: 'Customers', description: 'Customer information' },
        { id: 'service_history', name: 'Service History', description: 'Historical service records' },
        { id: 'accounts', name: 'Accounts', description: 'Account and billing information' },
        { id: 'technicians', name: 'Technicians', description: 'Technician data and schedules' },
        { id: 'inventory', name: 'Inventory', description: 'Equipment and inventory items' }
    ]; }, []);
    // Get fields for a specific table
    var getFieldsForTable = (0, react_1.useCallback)(function (tableId) {
        return availableFields.filter(function (field) { return field.table === tableId; });
    }, [availableFields]);
    // Update KPI property
    var updateKPI = (0, react_1.useCallback)(function (updates) {
        setCurrentKPI(function (prev) { return (__assign(__assign(__assign({}, prev), updates), { updatedAt: new Date() })); });
    }, []);
    // Update formula
    var updateFormula = (0, react_1.useCallback)(function (formula) {
        setCurrentKPI(function (prev) {
            var _a, _b;
            return (__assign(__assign({}, prev), { formula: __assign(__assign(__assign({}, prev.formula), formula), { validation: validateFormula(formula.expression || ((_a = prev.formula) === null || _a === void 0 ? void 0 : _a.expression) || '', formula.fields || ((_b = prev.formula) === null || _b === void 0 ? void 0 : _b.fields) || []) }) }));
        });
    }, []);
    // Validate formula expression
    var validateFormula = (0, react_1.useCallback)(function (expression, fields) {
        var errors = [];
        if (!expression.trim()) {
            errors.push('Formula expression cannot be empty');
            return { isValid: false, errors: errors };
        }
        // Check for valid field references
        var fieldReferences = expression.match(/\{[^}]+\}/g) || [];
        fieldReferences.forEach(function (ref) {
            var fieldId = ref.slice(1, -1); // Remove { and }
            if (!fields.includes(fieldId)) {
                errors.push("Field ".concat(fieldId, " is not selected"));
            }
        });
        // Check for basic syntax
        try {
            // Simple validation - replace field references with numbers for testing
            var testExpression_1 = expression;
            fieldReferences.forEach(function (ref) {
                testExpression_1 = testExpression_1.replace(ref, '1');
            });
            // Try to evaluate the expression
            new Function('return ' + testExpression_1)();
        }
        catch (_error) {
            errors.push('Invalid formula syntax');
        }
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }, []);
    // Add field to formula
    var addFieldToFormula = (0, react_1.useCallback)(function (fieldId) {
        var field = availableFields.find(function (f) { return f.id === fieldId; });
        if (!field)
            return;
        setCurrentKPI(function (prev) {
            var _a, _b;
            var currentFields = ((_a = prev.formula) === null || _a === void 0 ? void 0 : _a.fields) || [];
            var newFields = __spreadArray(__spreadArray([], currentFields, true), [fieldId], false);
            return __assign(__assign({}, prev), { formula: __assign(__assign({}, prev.formula), { fields: newFields, expression: ((_b = prev.formula) === null || _b === void 0 ? void 0 : _b.expression) || '' }) });
        });
    }, [availableFields]);
    // Remove field from formula
    var removeFieldFromFormula = (0, react_1.useCallback)(function (fieldId) {
        setCurrentKPI(function (prev) {
            var _a, _b;
            var currentFields = ((_a = prev.formula) === null || _a === void 0 ? void 0 : _a.fields) || [];
            var newFields = currentFields.filter(function (id) { return id !== fieldId; });
            // Remove field references from expression
            var newExpression = ((_b = prev.formula) === null || _b === void 0 ? void 0 : _b.expression) || '';
            newExpression = newExpression.replace(new RegExp("\\{".concat(fieldId, "\\}"), 'g'), '');
            return __assign(__assign({}, prev), { formula: __assign(__assign({}, prev.formula), { fields: newFields, expression: newExpression, validation: validateFormula(newExpression, newFields) }) });
        });
    }, [validateFormula]);
    // Insert field reference into expression
    var insertFieldReference = (0, react_1.useCallback)(function (fieldId, position) {
        var fieldReference = "{".concat(fieldId, "}");
        setCurrentKPI(function (prev) {
            var _a, _b;
            var currentExpression = ((_a = prev.formula) === null || _a === void 0 ? void 0 : _a.expression) || '';
            var newExpression;
            if (position !== undefined) {
                newExpression = currentExpression.slice(0, position) + fieldReference + currentExpression.slice(position);
            }
            else {
                newExpression = currentExpression + fieldReference;
            }
            return __assign(__assign({}, prev), { formula: __assign(__assign({}, prev.formula), { expression: newExpression, validation: validateFormula(newExpression, ((_b = prev.formula) === null || _b === void 0 ? void 0 : _b.fields) || []) }) });
        });
    }, [validateFormula]);
    // Add text to formula (for operations, functions, etc.)
    var addToFormula = (0, react_1.useCallback)(function (text, position) {
        setCurrentKPI(function (prev) {
            var _a, _b;
            var currentExpression = ((_a = prev.formula) === null || _a === void 0 ? void 0 : _a.expression) || '';
            var newExpression;
            if (position !== undefined) {
                newExpression = currentExpression.slice(0, position) + text + currentExpression.slice(position);
            }
            else {
                newExpression = currentExpression + text;
            }
            return __assign(__assign({}, prev), { formula: __assign(__assign({}, prev.formula), { expression: newExpression, validation: validateFormula(newExpression, ((_b = prev.formula) === null || _b === void 0 ? void 0 : _b.fields) || []) }) });
        });
    }, [validateFormula]);
    // Drag and drop handlers
    var handleDragStart = (0, react_1.useCallback)(function (item) {
        setDragState({
            isDragging: true,
            draggedItem: item,
            dragOverTarget: null
        });
    }, []);
    var handleDragOver = (0, react_1.useCallback)(function (targetId) {
        setDragState(function (prev) { return (__assign(__assign({}, prev), { dragOverTarget: targetId })); });
    }, []);
    var handleDragEnd = (0, react_1.useCallback)(function () {
        setDragState({
            isDragging: false,
            draggedItem: null,
            dragOverTarget: null
        });
    }, []);
    var handleDrop = (0, react_1.useCallback)(function (targetId) {
        var draggedItem = dragState.draggedItem;
        if (!draggedItem)
            return;
        switch (targetId) {
            case 'formula-builder':
                if (draggedItem.type === 'field') {
                    insertFieldReference(draggedItem.id);
                }
                break;
            case 'field-list':
                if (draggedItem.type === 'field') {
                    addFieldToFormula(draggedItem.id);
                }
                break;
        }
        handleDragEnd();
    }, [dragState, insertFieldReference, addFieldToFormula, handleDragEnd]);
    // Test KPI
    var testKPI = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var testKPI, result, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!currentKPI.name || !((_a = currentKPI.formula) === null || _a === void 0 ? void 0 : _a.expression) || !onTest) {
                        return [2 /*return*/];
                    }
                    testKPI = {
                        id: "test-".concat(Date.now()),
                        name: currentKPI.name,
                        description: currentKPI.description || '',
                        category: currentKPI.category || 'operational',
                        formula: currentKPI.formula,
                        threshold: currentKPI.threshold,
                        chart: currentKPI.chart,
                        dataSource: currentKPI.dataSource,
                        isRealTime: currentKPI.isRealTime || false,
                        refreshInterval: currentKPI.refreshInterval,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, onTest(testKPI)];
                case 2:
                    result = _b.sent();
                    return [2 /*return*/, result];
                case 3:
                    error_1 = _b.sent();
                    logger_1.logger.error('KPI test failed', error_1, 'useKPIBuilder');
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [currentKPI, onTest]);
    // Save KPI
    var saveKPI = (0, react_1.useCallback)(function () {
        var _a;
        if (!currentKPI.name || !((_a = currentKPI.formula) === null || _a === void 0 ? void 0 : _a.expression) || !onSave) {
            return;
        }
        var customKPI = {
            id: "kpi-".concat(Date.now()),
            name: currentKPI.name,
            description: currentKPI.description || '',
            category: currentKPI.category || 'operational',
            formula: currentKPI.formula,
            threshold: currentKPI.threshold,
            chart: currentKPI.chart,
            dataSource: currentKPI.dataSource,
            isRealTime: currentKPI.isRealTime || false,
            refreshInterval: currentKPI.refreshInterval,
            templateId: currentKPI.templateId, // Include template ID if available
            createdAt: new Date(),
            updatedAt: new Date()
        };
        onSave(customKPI);
    }, [currentKPI, onSave]);
    // Reset builder
    var resetBuilder = (0, react_1.useCallback)(function () {
        setCurrentKPI({
            category: 'operational',
            formula: {
                id: 'formula-1',
                name: 'Custom Formula',
                expression: '',
                fields: [],
                validation: {
                    isValid: false,
                    errors: []
                }
            },
            threshold: {
                green: 80,
                yellow: 60,
                red: 40,
                unit: '%'
            },
            chart: {
                type: 'number',
                showTrend: true
            },
            dataSource: {
                table: 'jobs'
            },
            isRealTime: false
        });
    }, []);
    // Load template
    var loadTemplate = (0, react_1.useCallback)(function (template, templateId) {
        setCurrentKPI(function (prev) { return (__assign(__assign(__assign({}, prev), template), { templateId: templateId, updatedAt: new Date() })); });
    }, []);
    // Get formula preview
    var getFormulaPreview = (0, react_1.useCallback)(function () {
        var _a;
        if (!((_a = currentKPI.formula) === null || _a === void 0 ? void 0 : _a.expression))
            return '';
        var preview = currentKPI.formula.expression;
        // Replace field references with field names
        currentKPI.formula.fields.forEach(function (fieldId) {
            var field = availableFields.find(function (f) { return f.id === fieldId; });
            if (field) {
                preview = preview.replace(new RegExp("\\{".concat(fieldId, "\\}"), 'g'), field.name);
            }
        });
        return preview;
    }, [currentKPI.formula, availableFields]);
    // Check if KPI is valid for saving
    var isKPIValid = (0, react_1.useMemo)(function () {
        var _a, _b, _c, _d;
        return !!(currentKPI.name &&
            ((_a = currentKPI.formula) === null || _a === void 0 ? void 0 : _a.expression) &&
            ((_c = (_b = currentKPI.formula) === null || _b === void 0 ? void 0 : _b.validation) === null || _c === void 0 ? void 0 : _c.isValid) &&
            ((_d = currentKPI.dataSource) === null || _d === void 0 ? void 0 : _d.table));
    }, [currentKPI]);
    return {
        // State
        currentKPI: currentKPI,
        dragState: dragState,
        dataSources: dataSources,
        availableFields: availableFields,
        // Actions
        updateKPI: updateKPI,
        updateFormula: updateFormula,
        addFieldToFormula: addFieldToFormula,
        removeFieldFromFormula: removeFieldFromFormula,
        insertFieldReference: insertFieldReference,
        addToFormula: addToFormula,
        // Drag and drop
        handleDragStart: handleDragStart,
        handleDragOver: handleDragOver,
        handleDragEnd: handleDragEnd,
        handleDrop: handleDrop,
        // Utilities
        getFieldsForTable: getFieldsForTable,
        validateFormula: validateFormula,
        testKPI: testKPI,
        saveKPI: saveKPI,
        resetBuilder: resetBuilder,
        loadTemplate: loadTemplate,
        getFormulaPreview: getFormulaPreview,
        // Computed
        isKPIValid: isKPIValid
    };
}
