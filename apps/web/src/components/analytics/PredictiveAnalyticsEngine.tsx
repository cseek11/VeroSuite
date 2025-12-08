import { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Brain,
  AlertTriangle,
  CheckCircle,
  Zap,
  Activity,
  Users,
  DollarSign,
  Thermometer,
  Cloud,
  Droplets,
  Sun,
  Settings
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Badge,
  Heading,
  Text,
} from '@/components/ui';
import { cn } from '@/lib/utils';

// PredictionData interface (currently unused, kept for potential future use)
// TypeScript doesn't allow void statements for interfaces, so we'll keep it commented
 
type _PredictionData = {
  value: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  factors: string[];
  timeframe: string;
  lastUpdated: Date;
};
// Suppress unused warning by referencing the type
const _unusedPredictionData: _PredictionData | undefined = undefined;
void _unusedPredictionData;

interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  pressure: number;
  conditions: string;
}

interface SeasonalData {
  season: string;
  pestActivity: number;
  serviceDemand: number;
  customerBehavior: number;
}

interface MLPrediction {
  id: string;
  type: 'pest_pressure' | 'revenue' | 'demand' | 'weather_impact' | 'customer_churn' | 'equipment_failure';
  title: string;
  description: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  timeframe: string;
  factors: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: Date;
}

interface PredictiveAnalyticsEngineProps {
  customerId?: string;
  showAdvanced?: boolean;
  onPredictionSelect?: (prediction: MLPrediction) => void;
}

export default function PredictiveAnalyticsEngine({ 
  customerId: _customerId, 
  showAdvanced = false,
  onPredictionSelect 
}: PredictiveAnalyticsEngineProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedPrediction, setSelectedPrediction] = useState<MLPrediction | null>(null);
   
  const [_isLoading, _setIsLoading] = useState(false);

  // Mock ML predictions with realistic data
  const mlPredictions: MLPrediction[] = useMemo(() => [
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
  ], []);

  // Mock weather data
  const weatherData: WeatherData = {
    temperature: 72,
    humidity: 65,
    precipitation: 15,
    windSpeed: 8,
    pressure: 30.2,
    conditions: 'Partly Cloudy'
  };

  // Mock seasonal data
  const seasonalData: SeasonalData = {
    season: 'Spring',
    pestActivity: 78,
    serviceDemand: 85,
    customerBehavior: 72
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'pest_pressure':
        return <Target className="h-5 w-5 text-purple-600" />;
      case 'revenue':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'demand':
        return <Users className="h-5 w-5 text-blue-600" />;
      case 'weather_impact':
        return <Cloud className="h-5 w-5 text-cyan-600" />;
      case 'customer_churn':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'equipment_failure':
        return <Zap className="h-5 w-5 text-red-600" />;
      default:
        return <Brain className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'revenue':
        return `$${value.toLocaleString()}`;
      case 'pest_pressure':
      case 'demand':
      case 'customer_churn':
      case 'equipment_failure':
        return `${value}%`;
      case 'weather_impact':
        return `${value}%`;
      default:
        return value.toString();
    }
  };

  const handlePredictionClick = (prediction: MLPrediction) => {
    setSelectedPrediction(prediction);
    onPredictionSelect?.(prediction);
  };

  const filteredPredictions = useMemo(() => {
    return mlPredictions.filter(_prediction => {
      // Filter by timeframe if needed
      return true;
    });
  }, [selectedTimeframe]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-purple-600" />
          <Heading level={4} className="text-gray-900">
            Predictive Analytics Engine
          </Heading>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          >
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
            <option value="1y">1 Year</option>
          </select>
        </div>
      </div>

      {/* Weather & Environmental Context */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Temperature</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{weatherData.temperature}°F</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Humidity</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{weatherData.humidity}%</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Season</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{seasonalData.season}</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Pest Activity</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">{seasonalData.pestActivity}%</div>
        </Card>
      </div>

      {/* ML Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPredictions.map((prediction) => (
          <div
            key={prediction.id}
            onClick={() => handlePredictionClick(prediction)}
            className={cn(
              "cursor-pointer",
              selectedPrediction?.id === prediction.id
                ? "ring-2 ring-purple-500 bg-purple-50"
                : ""
            )}
          >
            <Card
              className={cn(
                "p-6 transition-all duration-200 hover:shadow-lg",
                selectedPrediction?.id === prediction.id
                  ? ""
                  : "hover:bg-gray-50"
              )}
            >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getPredictionIcon(prediction.type)}
                <div>
                  <Heading level={4} className="text-gray-900 mb-1">
                    {prediction.title}
                  </Heading>
                  <Text variant="small" className="text-gray-600">
                    {prediction.timeframe}
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(prediction.trend)}
                <Badge
                  variant="default"
                  className={`text-xs ${getRiskColor(prediction.riskLevel)}`}
                >
                  {prediction.riskLevel}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Text variant="small" className="text-gray-600">Current</Text>
                  <Heading level={4} className="font-bold text-gray-900">
                    {formatValue(prediction.currentValue, prediction.type)}
                  </Heading>
                </div>
                <div className="text-right">
                  <Text variant="small" className="text-gray-600">Predicted</Text>
                  <Heading level={4} className="font-bold text-purple-600">
                    {formatValue(prediction.predictedValue, prediction.type)}
                  </Heading>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Text variant="small" className="text-gray-600">Confidence</Text>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                  <Text variant="small" className="font-medium text-gray-900">
                    {prediction.confidence}%
                  </Text>
                </div>
              </div>

              <div>
                <Text variant="small" className="text-gray-600 mb-2">
                  Key Factors:
                </Text>
                <div className="flex flex-wrap gap-1">
                  {prediction.factors.slice(0, 2).map((factor, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {factor}
                    </span>
                  ))}
                  {prediction.factors.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{prediction.factors.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
          </div>
        ))}
      </div>

      {/* Detailed Prediction View */}
      {selectedPrediction && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {getPredictionIcon(selectedPrediction.type)}
              <div>
                <Heading level={4} className="text-gray-900">
                  {selectedPrediction.title}
                </Heading>
                <Text variant="small" className="text-gray-600">
                  {selectedPrediction.description}
                </Text>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPrediction(null)}
            >
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                  <Heading level={4} className="text-gray-900 mb-4">
                Prediction Details
              </Heading>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Value:</span>
                  <span className="font-medium">{formatValue(selectedPrediction.currentValue, selectedPrediction.type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Predicted Value:</span>
                  <span className="font-medium text-purple-600">{formatValue(selectedPrediction.predictedValue, selectedPrediction.type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-medium">{selectedPrediction.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeframe:</span>
                  <span className="font-medium">{selectedPrediction.timeframe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Level:</span>
                  <Badge
                    variant="default"
                    className={`text-xs ${getRiskColor(selectedPrediction.riskLevel)}`}
                  >
                    {selectedPrediction.riskLevel}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
                  <Heading level={4} className="text-gray-900 mb-4">
                AI Recommendations
              </Heading>
              <div className="space-y-2">
                {selectedPrediction.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <Text variant="small" className="text-gray-700">
                      {recommendation}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
                  <Heading level={4} className="text-gray-900 mb-4">
              Influencing Factors
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedPrediction.factors.map((factor, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                  <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  <Text variant="small" className="text-gray-700">
                    {factor}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <Text variant="small" className="text-gray-500 text-center">
              Last updated: {selectedPrediction.lastUpdated.toLocaleString()}
            </Text>
          </div>
        </Card>
      )}

      {/* Advanced ML Controls */}
      {showAdvanced && (
        <Card className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200">
                  <Heading level={4} className="text-gray-900 mb-4">
            Advanced ML Controls
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Brain className="h-4 w-4 mr-2" />
              Retrain Models
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Predictions
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Model Settings
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}










