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
exports.usePredictiveAnalytics = usePredictiveAnalytics;
var react_1 = require("react");
function usePredictiveAnalytics(_a) {
    var _this = this;
    var _b = _a === void 0 ? {} : _a, _c = _b.autoRefresh, autoRefresh = _c === void 0 ? true : _c, _d = _b.refreshInterval // 30 seconds
    , refreshInterval = _d === void 0 ? 30000 : _d // 30 seconds
    ;
    var _e = (0, react_1.useState)([]), models = _e[0], setModels = _e[1];
    var _f = (0, react_1.useState)([]), predictions = _f[0], setPredictions = _f[1];
    var _g = (0, react_1.useState)({}), metrics = _g[0], setMetrics = _g[1];
    var _h = (0, react_1.useState)(false), isLoading = _h[0], setIsLoading = _h[1];
    var _j = (0, react_1.useState)(null), error = _j[0], setError = _j[1];
    // Mock models data
    var mockModels = (0, react_1.useMemo)(function () { return [
        {
            id: 'pest_pressure_model',
            name: 'Pest Pressure Predictor',
            type: 'pest_pressure',
            accuracy: 0.87,
            lastTrained: new Date(Date.now() - 86400000), // 1 day ago
            status: 'active',
            parameters: {
                features: ['temperature', 'humidity', 'season', 'location', 'historical_data'],
                algorithm: 'Random Forest',
                trainingSize: 10000
            }
        },
        {
            id: 'revenue_forecast_model',
            name: 'Revenue Forecasting Model',
            type: 'revenue',
            accuracy: 0.92,
            lastTrained: new Date(Date.now() - 172800000), // 2 days ago
            status: 'active',
            parameters: {
                features: ['customer_count', 'service_completion', 'seasonal_factors', 'market_trends'],
                algorithm: 'LSTM Neural Network',
                trainingSize: 25000
            }
        },
        {
            id: 'demand_prediction_model',
            name: 'Service Demand Predictor',
            type: 'demand',
            accuracy: 0.89,
            lastTrained: new Date(Date.now() - 259200000), // 3 days ago
            status: 'active',
            parameters: {
                features: ['weather', 'historical_demand', 'customer_behavior', 'events'],
                algorithm: 'XGBoost',
                trainingSize: 15000
            }
        },
        {
            id: 'customer_churn_model',
            name: 'Customer Churn Predictor',
            type: 'customer_churn',
            accuracy: 0.85,
            lastTrained: new Date(Date.now() - 345600000), // 4 days ago
            status: 'active',
            parameters: {
                features: ['satisfaction_score', 'payment_history', 'service_frequency', 'complaints'],
                algorithm: 'Logistic Regression',
                trainingSize: 8000
            }
        },
        {
            id: 'equipment_failure_model',
            name: 'Equipment Failure Predictor',
            type: 'equipment_failure',
            accuracy: 0.91,
            lastTrained: new Date(Date.now() - 432000000), // 5 days ago
            status: 'training',
            parameters: {
                features: ['usage_hours', 'maintenance_history', 'environmental_conditions', 'age'],
                algorithm: 'Support Vector Machine',
                trainingSize: 5000
            }
        }
    ]; }, []);
    // Mock metrics data
    var mockMetrics = (0, react_1.useMemo)(function () { return ({
        pest_pressure_model: {
            accuracy: 0.87,
            precision: 0.85,
            recall: 0.89,
            f1Score: 0.87,
            rmse: 0.12,
            mae: 0.08
        },
        revenue_forecast_model: {
            accuracy: 0.92,
            precision: 0.91,
            recall: 0.93,
            f1Score: 0.92,
            rmse: 0.08,
            mae: 0.05
        },
        demand_prediction_model: {
            accuracy: 0.89,
            precision: 0.88,
            recall: 0.90,
            f1Score: 0.89,
            rmse: 0.10,
            mae: 0.07
        },
        customer_churn_model: {
            accuracy: 0.85,
            precision: 0.83,
            recall: 0.87,
            f1Score: 0.85,
            rmse: 0.15,
            mae: 0.10
        },
        equipment_failure_model: {
            accuracy: 0.91,
            precision: 0.90,
            recall: 0.92,
            f1Score: 0.91,
            rmse: 0.09,
            mae: 0.06
        }
    }); }, []);
    // Initialize models
    (0, react_1.useEffect)(function () {
        setModels(mockModels);
        setMetrics(mockMetrics);
    }, [mockModels, mockMetrics]);
    // Generate mock predictions
    var generateMockPredictions = (0, react_1.useCallback)(function () {
        var newPredictions = [];
        models.forEach(function (model) {
            // Generate 5-10 recent predictions per model
            var count = Math.floor(Math.random() * 6) + 5;
            for (var i = 0; i < count; i++) {
                var timestamp = new Date(Date.now() - Math.random() * 86400000); // Random time in last 24h
                var prediction = Math.random() * 100;
                var confidence = 0.8 + Math.random() * 0.2; // 80-100% confidence
                newPredictions.push({
                    id: "".concat(model.id, "_pred_").concat(i),
                    modelId: model.id,
                    timestamp: timestamp,
                    input: {
                        temperature: 70 + Math.random() * 20,
                        humidity: 40 + Math.random() * 40,
                        season: ['spring', 'summer', 'fall', 'winter'][Math.floor(Math.random() * 4)]
                    },
                    prediction: prediction,
                    confidence: confidence,
                    actual: Math.random() > 0.3 ? prediction + (Math.random() - 0.5) * 10 : 0, // always a number
                    error: Math.random() > 0.3 ? Math.random() * 5 : 0 // always a number
                });
            }
        });
        setPredictions(newPredictions.sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); }));
    }, [models]);
    // Initialize predictions
    (0, react_1.useEffect)(function () {
        if (models.length > 0) {
            generateMockPredictions();
        }
    }, [models, generateMockPredictions]);
    // Auto-refresh predictions
    (0, react_1.useEffect)(function () {
        if (!autoRefresh)
            return;
        var interval = setInterval(function () {
            generateMockPredictions();
        }, refreshInterval);
        return function () { return clearInterval(interval); };
    }, [autoRefresh, refreshInterval, generateMockPredictions]);
    // Get predictions by model
    var getPredictionsByModel = (0, react_1.useCallback)(function (modelId) {
        return predictions.filter(function (p) { return p.modelId === modelId; });
    }, [predictions]);
    // Get recent predictions
    var getRecentPredictions = (0, react_1.useCallback)(function (hours) {
        if (hours === void 0) { hours = 24; }
        var cutoff = new Date(Date.now() - hours * 3600000);
        return predictions.filter(function (p) { return p.timestamp > cutoff; });
    }, [predictions]);
    // Get model performance
    var getModelPerformance = (0, react_1.useCallback)(function (modelId) {
        var modelPredictions = getPredictionsByModel(modelId);
        var withActual = modelPredictions.filter(function (p) { return p.actual !== undefined; });
        if (withActual.length === 0)
            return null;
        var errors = withActual.map(function (p) { return Math.abs((p.actual - p.prediction) / p.actual); });
        var avgError = errors.reduce(function (sum, err) { return sum + err; }, 0) / errors.length;
        var accuracy = 1 - avgError;
        return {
            totalPredictions: modelPredictions.length,
            validatedPredictions: withActual.length,
            averageAccuracy: accuracy,
            averageConfidence: modelPredictions.reduce(function (sum, p) { return sum + p.confidence; }, 0) / modelPredictions.length
        };
    }, [getPredictionsByModel]);
    // Retrain model
    var retrainModel = (0, react_1.useCallback)(function (modelId) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // Simulate API call
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 2:
                    // Simulate API call
                    _a.sent();
                    setModels(function (prev) { return prev.map(function (model) {
                        return model.id === modelId
                            ? __assign(__assign({}, model), { status: 'active', lastTrained: new Date(), accuracy: Math.min(0.99, model.accuracy + Math.random() * 0.05) }) : model;
                    }); });
                    // Regenerate predictions
                    generateMockPredictions();
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'Failed to retrain model');
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [generateMockPredictions]);
    // Get model by type
    var getModelByType = (0, react_1.useCallback)(function (type) {
        return models.find(function (model) { return model.type === type; });
    }, [models]);
    // Get predictions by type
    var getPredictionsByType = (0, react_1.useCallback)(function (type) {
        var model = getModelByType(type);
        return model ? getPredictionsByModel(model.id) : [];
    }, [getModelByType, getPredictionsByModel]);
    // Calculate overall system performance
    var systemPerformance = (0, react_1.useMemo)(function () {
        var totalModels = models.length;
        var activeModels = models.filter(function (m) { return m.status === 'active'; }).length;
        var avgAccuracy = models.reduce(function (sum, m) { return sum + m.accuracy; }, 0) / totalModels;
        var totalPredictions = predictions.length;
        var avgConfidence = predictions.reduce(function (sum, p) { return sum + p.confidence; }, 0) / totalPredictions;
        return {
            totalModels: totalModels,
            activeModels: activeModels,
            inactiveModels: totalModels - activeModels,
            averageAccuracy: avgAccuracy,
            totalPredictions: totalPredictions,
            averageConfidence: avgConfidence,
            systemHealth: activeModels / totalModels
        };
    }, [models, predictions]);
    // Export predictions
    var exportPredictions = (0, react_1.useCallback)(function (format) {
        if (format === void 0) { format = 'json'; }
        var data = {
            models: models,
            predictions: predictions,
            metrics: metrics,
            systemPerformance: systemPerformance,
            exportedAt: new Date().toISOString()
        };
        if (format === 'csv') {
            // Convert to CSV format
            var csvContent = __spreadArray([
                ['Model ID', 'Prediction ID', 'Timestamp', 'Prediction', 'Confidence', 'Actual', 'Error']
            ], predictions.map(function (p) {
                var _a, _b;
                return [
                    p.modelId,
                    p.id,
                    p.timestamp.toISOString(),
                    p.prediction.toFixed(2),
                    (p.confidence * 100).toFixed(1),
                    ((_a = p.actual) === null || _a === void 0 ? void 0 : _a.toFixed(2)) || '',
                    ((_b = p.error) === null || _b === void 0 ? void 0 : _b.toFixed(2)) || ''
                ];
            }), true).map(function (row) { return row.join(','); }).join('\n');
            var blob = new Blob([csvContent], { type: 'text/csv' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "predictive_analytics_".concat(new Date().toISOString().split('T')[0], ".csv");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        else {
            var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "predictive_analytics_".concat(new Date().toISOString().split('T')[0], ".json");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }, [models, predictions, metrics, systemPerformance]);
    return {
        // State
        models: models,
        predictions: predictions,
        metrics: metrics,
        isLoading: isLoading,
        error: error,
        systemPerformance: systemPerformance,
        // Actions
        retrainModel: retrainModel,
        exportPredictions: exportPredictions,
        generateMockPredictions: generateMockPredictions,
        // Getters
        getPredictionsByModel: getPredictionsByModel,
        getPredictionsByType: getPredictionsByType,
        getRecentPredictions: getRecentPredictions,
        getModelByType: getModelByType,
        getModelPerformance: getModelPerformance,
        // Utilities
        clearError: function () { return setError(null); }
    };
}
