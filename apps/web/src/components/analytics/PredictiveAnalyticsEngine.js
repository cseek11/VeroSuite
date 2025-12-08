"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PredictiveAnalyticsEngine;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var utils_1 = require("@/lib/utils");
// Suppress unused warning by referencing the type
var _unusedPredictionData = undefined;
void _unusedPredictionData;
function PredictiveAnalyticsEngine(_a) {
    var _customerId = _a.customerId, _b = _a.showAdvanced, showAdvanced = _b === void 0 ? false : _b, onPredictionSelect = _a.onPredictionSelect;
    var _c = (0, react_1.useState)('30d'), selectedTimeframe = _c[0], setSelectedTimeframe = _c[1];
    var _d = (0, react_1.useState)(null), selectedPrediction = _d[0], setSelectedPrediction = _d[1];
    var _e = (0, react_1.useState)(false), _isLoading = _e[0], _setIsLoading = _e[1];
    // Mock ML predictions with realistic data
    var mlPredictions = (0, react_1.useMemo)(function () { return [
        {
            id: 'pest_pressure_1',
            type: 'pest_pressure',
            title: 'Ant Activity Prediction',
            description: 'Predicted ant activity based on weather patterns and historical data',
            currentValue: 35,
            predictedValue: 42,
            confidence: 87,
            trend: 'increasing',
            timeframe: 'Next 14 days',
            factors: ['Temperature increase', 'Humidity levels', 'Seasonal patterns', 'Neighborhood activity'],
            recommendations: [
                'Increase monitoring frequency',
                'Schedule preventive treatment',
                'Notify customer of potential activity'
            ],
            riskLevel: 'medium',
            lastUpdated: new Date()
        },
        {
            id: 'revenue_1',
            type: 'revenue',
            title: 'Monthly Revenue Forecast',
            description: 'AI-powered revenue prediction based on customer behavior and market trends',
            currentValue: 8500,
            predictedValue: 9200,
            confidence: 92,
            trend: 'increasing',
            timeframe: 'Next 30 days',
            factors: ['Customer retention rate', 'Seasonal demand', 'Service completion rates', 'New customer acquisition'],
            recommendations: [
                'Focus on upselling existing customers',
                'Optimize technician scheduling',
                'Launch targeted marketing campaign'
            ],
            riskLevel: 'low',
            lastUpdated: new Date()
        },
        {
            id: 'demand_1',
            type: 'demand',
            title: 'Service Demand Prediction',
            description: 'Predictive model for service request volume and timing',
            currentValue: 45,
            predictedValue: 52,
            confidence: 89,
            trend: 'increasing',
            timeframe: 'Next 7 days',
            factors: ['Weather forecast', 'Historical patterns', 'Customer behavior', 'Seasonal factors'],
            recommendations: [
                'Increase technician capacity',
                'Prepare additional equipment',
                'Optimize route planning'
            ],
            riskLevel: 'medium',
            lastUpdated: new Date()
        },
        {
            id: 'weather_impact_1',
            type: 'weather_impact',
            title: 'Weather Impact Analysis',
            description: 'How weather conditions affect pest activity and service effectiveness',
            currentValue: 68,
            predictedValue: 72,
            confidence: 94,
            trend: 'increasing',
            timeframe: 'Next 10 days',
            factors: ['Temperature trends', 'Humidity levels', 'Precipitation forecast', 'Wind patterns'],
            recommendations: [
                'Adjust treatment schedules',
                'Use weather-resistant products',
                'Plan indoor services during rain'
            ],
            riskLevel: 'low',
            lastUpdated: new Date()
        },
        {
            id: 'customer_churn_1',
            type: 'customer_churn',
            title: 'Customer Retention Risk',
            description: 'Predictive model identifying customers at risk of cancellation',
            currentValue: 12,
            predictedValue: 8,
            confidence: 85,
            trend: 'decreasing',
            timeframe: 'Next 60 days',
            factors: ['Service satisfaction', 'Payment history', 'Communication frequency', 'Competitor activity'],
            recommendations: [
                'Schedule follow-up calls',
                'Offer service upgrades',
                'Address any complaints promptly'
            ],
            riskLevel: 'medium',
            lastUpdated: new Date()
        },
        {
            id: 'equipment_failure_1',
            type: 'equipment_failure',
            title: 'Equipment Maintenance Prediction',
            description: 'Predictive maintenance model for equipment failure prevention',
            currentValue: 95,
            predictedValue: 88,
            confidence: 91,
            trend: 'decreasing',
            timeframe: 'Next 45 days',
            factors: ['Usage patterns', 'Maintenance history', 'Environmental conditions', 'Age of equipment'],
            recommendations: [
                'Schedule preventive maintenance',
                'Order replacement parts',
                'Update maintenance protocols'
            ],
            riskLevel: 'high',
            lastUpdated: new Date()
        }
    ]; }, []);
    // Mock weather data
    var weatherData = {
        temperature: 72,
        humidity: 65,
        precipitation: 15,
        windSpeed: 8,
        pressure: 30.2,
        conditions: 'Partly Cloudy'
    };
    // Mock seasonal data
    var seasonalData = {
        season: 'Spring',
        pestActivity: 78,
        serviceDemand: 85,
        customerBehavior: 72
    };
    var getRiskColor = function (risk) {
        switch (risk.toLowerCase()) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    var getTrendIcon = function (trend) {
        switch (trend) {
            case 'increasing':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4 text-green-600" });
            case 'decreasing':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "h-4 w-4 text-red-600" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4 text-gray-600" });
        }
    };
    var getPredictionIcon = function (type) {
        switch (type) {
            case 'pest_pressure':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-5 w-5 text-purple-600" });
            case 'revenue':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-5 w-5 text-green-600" });
            case 'demand':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-5 w-5 text-blue-600" });
            case 'weather_impact':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Cloud, { className: "h-5 w-5 text-cyan-600" });
            case 'customer_churn':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-orange-600" });
            case 'equipment_failure':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-5 w-5 text-red-600" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "h-5 w-5 text-gray-600" });
        }
    };
    var formatValue = function (value, type) {
        switch (type) {
            case 'revenue':
                return "$".concat(value.toLocaleString());
            case 'pest_pressure':
            case 'demand':
            case 'customer_churn':
            case 'equipment_failure':
                return "".concat(value, "%");
            case 'weather_impact':
                return "".concat(value, "%");
            default:
                return value.toString();
        }
    };
    var handlePredictionClick = function (prediction) {
        setSelectedPrediction(prediction);
        onPredictionSelect === null || onPredictionSelect === void 0 ? void 0 : onPredictionSelect(prediction);
    };
    var filteredPredictions = (0, react_1.useMemo)(function () {
        return mlPredictions.filter(function (_prediction) {
            // Filter by timeframe if needed
            return true;
        });
    }, [selectedTimeframe]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "h-6 w-6 text-purple-600" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900", children: "Predictive Analytics Engine" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: (0, jsx_runtime_1.jsxs)("select", { value: selectedTimeframe, onChange: function (e) { return setSelectedTimeframe(e.target.value); }, className: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "7d", children: "7 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "30d", children: "30 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "90d", children: "90 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "1y", children: "1 Year" })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Thermometer, { className: "h-4 w-4 text-blue-600" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-blue-800", children: "Temperature" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-blue-900", children: [weatherData.temperature, "\u00B0F"] })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Droplets, { className: "h-4 w-4 text-green-600" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-green-800", children: "Humidity" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-green-900", children: [weatherData.humidity, "%"] })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sun, { className: "h-4 w-4 text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-purple-800", children: "Season" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-purple-900", children: seasonalData.season })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4 text-orange-600" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-orange-800", children: "Pest Activity" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-orange-900", children: [seasonalData.pestActivity, "%"] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredPredictions.map(function (prediction) { return ((0, jsx_runtime_1.jsx)("div", { onClick: function () { return handlePredictionClick(prediction); }, className: (0, utils_1.cn)("cursor-pointer", (selectedPrediction === null || selectedPrediction === void 0 ? void 0 : selectedPrediction.id) === prediction.id
                        ? "ring-2 ring-purple-500 bg-purple-50"
                        : ""), children: (0, jsx_runtime_1.jsxs)(Card_1.default, { className: (0, utils_1.cn)("p-6 transition-all duration-200 hover:shadow-lg", (selectedPrediction === null || selectedPrediction === void 0 ? void 0 : selectedPrediction.id) === prediction.id
                            ? ""
                            : "hover:bg-gray-50"), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [getPredictionIcon(prediction.type), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-1", children: prediction.title }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: prediction.timeframe })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [getTrendIcon(prediction.trend), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: "text-xs ".concat(getRiskColor(prediction.riskLevel)), children: prediction.riskLevel })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Current" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-bold text-gray-900", children: formatValue(prediction.currentValue, prediction.type) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Predicted" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-bold text-purple-600", children: formatValue(prediction.predictedValue, prediction.type) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Confidence" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-2 bg-gray-200 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-purple-600 rounded-full transition-all duration-300", style: { width: "".concat(prediction.confidence, "%") } }) }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "font-medium text-gray-900", children: [prediction.confidence, "%"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mb-2", children: "Key Factors:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-1", children: [prediction.factors.slice(0, 2).map(function (factor, index) { return ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full", children: factor }, index)); }), prediction.factors.length > 2 && ((0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full", children: ["+", prediction.factors.length - 2] }))] })] })] })] }) }, prediction.id)); }) }), selectedPrediction && ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [getPredictionIcon(selectedPrediction.type), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900", children: selectedPrediction.title }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: selectedPrediction.description })] })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return setSelectedPrediction(null); }, children: "Close" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-4", children: "Prediction Details" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Current Value:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: formatValue(selectedPrediction.currentValue, selectedPrediction.type) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Predicted Value:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-purple-600", children: formatValue(selectedPrediction.predictedValue, selectedPrediction.type) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Confidence:" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-medium", children: [selectedPrediction.confidence, "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Timeframe:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: selectedPrediction.timeframe })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Risk Level:" }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: "text-xs ".concat(getRiskColor(selectedPrediction.riskLevel)), children: selectedPrediction.riskLevel })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-4", children: "AI Recommendations" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: selectedPrediction.recommendations.map(function (recommendation, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-700", children: recommendation })] }, index)); }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-4", children: "Influencing Factors" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: selectedPrediction.factors.map(function (factor, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-orange-500 flex-shrink-0" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-700", children: factor })] }, index)); }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 pt-4 border-t border-gray-200", children: (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-500 text-center", children: ["Last updated: ", selectedPrediction.lastUpdated.toLocaleString()] }) })] })), showAdvanced && ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-4", children: "Advanced ML Controls" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "justify-start", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "h-4 w-4 mr-2" }), "Retrain Models"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "justify-start", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-4 w-4 mr-2" }), "Export Predictions"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", className: "justify-start", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-4 w-4 mr-2" }), "Model Settings"] })] })] }))] }));
}
