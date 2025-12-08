import { useState, useCallback, useMemo, useEffect } from 'react';

export interface PredictionModel {
  id: string;
  name: string;
  type: 'pest_pressure' | 'revenue' | 'demand' | 'weather_impact' | 'customer_churn' | 'equipment_failure';
  accuracy: number;
  lastTrained: Date;
  status: 'active' | 'training' | 'error';
  parameters: Record<string, any>;
}

export interface PredictionData {
  id: string;
  modelId: string;
  timestamp: Date;
  input: Record<string, any>;
  prediction: number;
  confidence: number;
  actual?: number;
  error?: number;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rmse: number;
  mae: number;
}

interface UsePredictiveAnalyticsProps {
  customerId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function usePredictiveAnalytics({
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}: UsePredictiveAnalyticsProps = {}) {
  const [models, setModels] = useState<PredictionModel[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [metrics, setMetrics] = useState<Record<string, ModelMetrics>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock models data
  const mockModels: PredictionModel[] = useMemo(() => [
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
  ], []);

  // Mock metrics data
  const mockMetrics: Record<string, ModelMetrics> = useMemo(() => ({
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
  }), []);

  // Initialize models
  useEffect(() => {
    setModels(mockModels);
    setMetrics(mockMetrics);
  }, [mockModels, mockMetrics]);

  // Generate mock predictions
  const generateMockPredictions = useCallback(() => {
    const newPredictions: PredictionData[] = [];
    
    models.forEach(model => {
      // Generate 5-10 recent predictions per model
      const count = Math.floor(Math.random() * 6) + 5;
      
      for (let i = 0; i < count; i++) {
        const timestamp = new Date(Date.now() - Math.random() * 86400000); // Random time in last 24h
        const prediction = Math.random() * 100;
        const confidence = 0.8 + Math.random() * 0.2; // 80-100% confidence
        
        newPredictions.push({
          id: `${model.id}_pred_${i}`,
          modelId: model.id,
          timestamp,
          input: {
            temperature: 70 + Math.random() * 20,
            humidity: 40 + Math.random() * 40,
            season: ['spring', 'summer', 'fall', 'winter'][Math.floor(Math.random() * 4)]
          },
          prediction,
          confidence,
          actual: Math.random() > 0.3 ? prediction + (Math.random() - 0.5) * 10 : 0, // always a number
          error: Math.random() > 0.3 ? Math.random() * 5 : 0 // always a number
        });
      }
    });

    setPredictions(newPredictions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, [models]);

  // Initialize predictions
  useEffect(() => {
    if (models.length > 0) {
      generateMockPredictions();
    }
  }, [models, generateMockPredictions]);

  // Auto-refresh predictions
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      generateMockPredictions();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, generateMockPredictions]);

  // Get predictions by model
  const getPredictionsByModel = useCallback((modelId: string) => {
    return predictions.filter(p => p.modelId === modelId);
  }, [predictions]);

  // Get recent predictions
  const getRecentPredictions = useCallback((hours: number = 24) => {
    const cutoff = new Date(Date.now() - hours * 3600000);
    return predictions.filter(p => p.timestamp > cutoff);
  }, [predictions]);

  // Get model performance
  const getModelPerformance = useCallback((modelId: string) => {
    const modelPredictions = getPredictionsByModel(modelId);
    const withActual = modelPredictions.filter(p => p.actual !== undefined);
    
    if (withActual.length === 0) return null;

    const errors = withActual.map(p => Math.abs((p.actual! - p.prediction) / p.actual!));
    const avgError = errors.reduce((sum, err) => sum + err, 0) / errors.length;
    const accuracy = 1 - avgError;

    return {
      totalPredictions: modelPredictions.length,
      validatedPredictions: withActual.length,
      averageAccuracy: accuracy,
      averageConfidence: modelPredictions.reduce((sum, p) => sum + p.confidence, 0) / modelPredictions.length
    };
  }, [getPredictionsByModel]);

  // Retrain model
  const retrainModel = useCallback(async (modelId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { 
              ...model, 
              status: 'active',
              lastTrained: new Date(),
              accuracy: Math.min(0.99, model.accuracy + Math.random() * 0.05)
            }
          : model
      ));

      // Regenerate predictions
      generateMockPredictions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retrain model');
    } finally {
      setIsLoading(false);
    }
  }, [generateMockPredictions]);

  // Get model by type
  const getModelByType = useCallback((type: string) => {
    return models.find(model => model.type === type);
  }, [models]);

  // Get predictions by type
  const getPredictionsByType = useCallback((type: string) => {
    const model = getModelByType(type);
    return model ? getPredictionsByModel(model.id) : [];
  }, [getModelByType, getPredictionsByModel]);

  // Calculate overall system performance
  const systemPerformance = useMemo(() => {
    const totalModels = models.length;
    const activeModels = models.filter(m => m.status === 'active').length;
    const avgAccuracy = models.reduce((sum, m) => sum + m.accuracy, 0) / totalModels;
    const totalPredictions = predictions.length;
    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / totalPredictions;

    return {
      totalModels,
      activeModels,
      inactiveModels: totalModels - activeModels,
      averageAccuracy: avgAccuracy,
      totalPredictions,
      averageConfidence: avgConfidence,
      systemHealth: activeModels / totalModels
    };
  }, [models, predictions]);

  // Export predictions
  const exportPredictions = useCallback((format: 'csv' | 'json' = 'json') => {
    const data = {
      models,
      predictions,
      metrics,
      systemPerformance,
      exportedAt: new Date().toISOString()
    };

    if (format === 'csv') {
      // Convert to CSV format
      const csvContent = [
        ['Model ID', 'Prediction ID', 'Timestamp', 'Prediction', 'Confidence', 'Actual', 'Error'],
        ...predictions.map(p => [
          p.modelId,
          p.id,
          p.timestamp.toISOString(),
          p.prediction.toFixed(2),
          (p.confidence * 100).toFixed(1),
          p.actual?.toFixed(2) || '',
          p.error?.toFixed(2) || ''
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `predictive_analytics_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `predictive_analytics_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [models, predictions, metrics, systemPerformance]);

  return {
    // State
    models,
    predictions,
    metrics,
    isLoading,
    error,
    systemPerformance,
    
    // Actions
    retrainModel,
    exportPredictions,
    generateMockPredictions,
    
    // Getters
    getPredictionsByModel,
    getPredictionsByType,
    getRecentPredictions,
    getModelByType,
    getModelPerformance,
    
    // Utilities
    clearError: () => setError(null)
  };
}















