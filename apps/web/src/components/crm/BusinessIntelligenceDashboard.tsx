// React import removed (not needed with new JSX transform)
import Card from '@/components/ui/Card';
import {
  Badge,
  Heading,
  Text,
} from '@/components/ui';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target,
  Activity
} from 'lucide-react';

interface BusinessIntelligenceDashboardProps {
  customerId: string;
}

export default function BusinessIntelligenceDashboard({ customerId: _customerId }: BusinessIntelligenceDashboardProps) {
  // Mock business intelligence data
  const biData = {
    churnRisk: {
      score: 0.15,
      risk: 'Low',
      factors: ['High satisfaction score', 'Recent service completion', 'Active contract'],
      trend: 'decreasing'
    },
    customerLifetimeValue: {
      current: 12500,
      projected: 18500,
      trend: 'increasing'
    },
    satisfactionScore: {
      current: 4.8,
      trend: 'stable',
      history: [4.5, 4.6, 4.7, 4.8, 4.8]
    },
    pestPressure: {
      score: 0.35,
      risk: 'Medium',
      factors: ['Seasonal increase', 'Neighborhood activity'],
      trend: 'increasing'
    },
    revenueForecast: {
      nextMonth: 2500,
      nextQuarter: 7200,
      trend: 'increasing'
    },
    serviceEffectiveness: {
      score: 0.85,
      trend: 'improving'
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'red';
      default: return 'gray';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Heading level={3} className="text-slate-900">
          Business Intelligence
        </Heading>
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          AI-Powered Insights
        </Badge>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Churn Risk */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <Heading level={4} className="text-slate-900">
                Churn Risk
              </Heading>
            </div>
            {getTrendIcon(biData.churnRisk.trend)}
          </div>
          
          <div className="mb-4">
            <Heading level={2} className="text-red-900 font-bold">
              {Math.round(biData.churnRisk.score * 100)}%
            </Heading>
            <Badge
              variant="default"
              className={
                getRiskColor(biData.churnRisk.risk) === 'green' ? 'bg-green-100 text-green-800' :
                getRiskColor(biData.churnRisk.risk) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                getRiskColor(biData.churnRisk.risk) === 'red' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }
            >
              {biData.churnRisk.risk} Risk
            </Badge>
          </div>
          
          <div className="space-y-2">
            <Text variant="small" className="text-slate-700 font-medium">
              Contributing Factors:
            </Text>
            {biData.churnRisk.factors.map((factor, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Lifetime Value */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              <Heading level={4} className="text-slate-900">
                Customer LTV
              </Heading>
            </div>
            {getTrendIcon(biData.customerLifetimeValue.trend)}
          </div>
          
          <div className="mb-4">
            <Heading level={2} className="text-green-900 font-bold">
              ${biData.customerLifetimeValue.current.toLocaleString()}
            </Heading>
            <Text variant="small" className="text-slate-600">
              Projected: ${biData.customerLifetimeValue.projected.toLocaleString()}
            </Text>
          </div>
          
          <div className="bg-white p-3 rounded-lg">
            <Text variant="small" className="text-slate-700 font-medium mb-2">
              Growth Trend
            </Text>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(biData.customerLifetimeValue.current / biData.customerLifetimeValue.projected) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Satisfaction Score */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              <Heading level={4} className="text-slate-900">
                Satisfaction
              </Heading>
            </div>
            {getTrendIcon(biData.satisfactionScore.trend)}
          </div>
          
          <div className="mb-4">
            <Heading level={2} className="text-blue-900 font-bold">
              {biData.satisfactionScore.current}/5.0
            </Heading>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`w-4 h-4 rounded-full ${
                    star <= biData.satisfactionScore.current
                      ? 'bg-yellow-400'
                      : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg">
            <Text variant="small" className="text-slate-700 font-medium mb-2">
              Historical Trend
            </Text>
            <div className="flex items-center gap-1">
              {biData.satisfactionScore.history.map((score, index) => (
                <div
                  key={index}
                  className="flex-1 bg-slate-200 rounded"
                  style={{ height: `${score * 8}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Predictive Analytics */}
      <div className="mb-8">
        <Heading level={4} className="text-slate-900 mb-4">
          Predictive Analytics
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pest Pressure Prediction */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                <Heading level={4} className="text-slate-900">
                  Pest Pressure Prediction
                </Heading>
              </div>
              {getTrendIcon(biData.pestPressure.trend)}
            </div>
            
            <div className="mb-4">
              <Heading level={3} className="text-purple-900 font-bold">
                {Math.round(biData.pestPressure.score * 100)}%
              </Heading>
              <Badge
                variant="default"
                className={
                  getRiskColor(biData.pestPressure.risk) === 'green' ? 'bg-green-100 text-green-800' :
                  getRiskColor(biData.pestPressure.risk) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  getRiskColor(biData.pestPressure.risk) === 'red' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }
              >
                {biData.pestPressure.risk} Risk
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Text variant="small" className="text-slate-700 font-medium">
                Risk Factors:
              </Text>
              {biData.pestPressure.factors.map((factor, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Forecast */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
                <Heading level={4} className="text-slate-900">
                  Revenue Forecast
                </Heading>
              </div>
              {getTrendIcon(biData.revenueForecast.trend)}
            </div>
            
            <div className="space-y-4">
              <div>
                <Text variant="small" className="text-slate-600">
                  Next Month
                </Text>
                <Heading level={4} className="text-emerald-900 font-bold">
                  ${biData.revenueForecast.nextMonth.toLocaleString()}
                </Heading>
              </div>
              
              <div>
                <Text variant="small" className="text-slate-600">
                  Next Quarter
                </Text>
                <Heading level={4} className="text-emerald-900 font-bold">
                  ${biData.revenueForecast.nextQuarter.toLocaleString()}
                </Heading>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Effectiveness */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-amber-600" />
            <Heading level={4} className="text-slate-900">
              Service Effectiveness
            </Heading>
          </div>
          {getTrendIcon(biData.serviceEffectiveness.trend)}
        </div>
        
        <div className="mb-4">
          <Heading level={3} className="text-amber-900 font-bold">
            {Math.round(biData.serviceEffectiveness.score * 100)}%
          </Heading>
          <Text variant="small" className="text-slate-600">
            Treatment success rate
          </Text>
        </div>
        
        <div className="bg-white p-3 rounded-lg">
          <Text variant="small" className="text-slate-700 font-medium mb-2">
            Effectiveness Trend
          </Text>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-amber-500 h-3 rounded-full"
              style={{ width: `${biData.serviceEffectiveness.score * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
        <Heading level={4} className="text-slate-900 mb-4">
          AI Recommendations
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Text variant="body" className="font-medium">
                Proactive Service
              </Text>
            </div>
            <Text variant="small" className="text-slate-600">
              Schedule preventive treatment within 30 days to maintain low pest pressure.
            </Text>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <Text variant="body" className="font-medium">
                Upsell Opportunity
              </Text>
            </div>
            <Text variant="small" className="text-slate-600">
              Customer shows high satisfaction - consider premium service upgrade.
            </Text>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-500" />
              <Text variant="body" className="font-medium">
                Retention Strategy
              </Text>
            </div>
            <Text variant="small" className="text-slate-600">
              Send personalized thank you note and satisfaction survey.
            </Text>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-orange-500" />
              <Text variant="body" className="font-medium">
                Seasonal Alert
              </Text>
            </div>
            <Text variant="small" className="text-slate-600">
              Anticipate increased pest activity in spring - prepare treatment plan.
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}







