import { useState, useEffect, useCallback } from 'react';
import { enhancedApi } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';

interface DiagnosticResult {
  apiEndpoint: boolean;
  authentication: boolean;
  network: boolean;
  server: boolean;
  overall: 'healthy' | 'degraded' | 'unhealthy';
  issues: string[];
  recommendations: string[];
}

export const useTemplateDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult>({
    apiEndpoint: false,
    authentication: false,
    network: false,
    server: false,
    overall: 'unhealthy',
    issues: [],
    recommendations: []
  });

  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = useCallback(async () => {
    setIsRunning(true);
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    let apiEndpoint = false;
    let authentication = false;
    let network = false;
    let server = false;

    try {
      // Test 1: API Endpoint Availability
      logger.debug('Testing API endpoint');
      try {
        const response = await fetch('http://localhost:3001/api/v1/kpi-templates', {
          method: 'HEAD',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        apiEndpoint = response.ok;
        if (!apiEndpoint) {
          issues.push('API endpoint not responding');
          recommendations.push('Check if backend server is running on port 3001');
        }
      } catch (error) {
        issues.push('Cannot reach API endpoint');
        recommendations.push('Start the backend server: npm run dev:server');
      }

      // Test 2: Authentication
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Testing authentication', {}, 'useTemplateDiagnostics');
      }
      try {
        const token = localStorage.getItem('jwt') || localStorage.getItem('verofield_auth');
        if (token) {
          const response = await fetch('http://localhost:3001/api/v1/kpi-templates', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          authentication = response.status !== 401;
          if (!authentication) {
            issues.push('Authentication failed');
            recommendations.push('Login again or check token validity');
          }
        } else {
          issues.push('No authentication token found');
          recommendations.push('Login to the application');
        }
      } catch (error) {
        issues.push('Authentication test failed');
        recommendations.push('Check network connection and try logging in again');
      }

      // Test 3: Network Connectivity
      logger.debug('Testing network connectivity');
      try {
        const response = await fetch('http://localhost:3001/health', {
          method: 'GET',
        });
        network = response.ok;
        if (!network) {
          issues.push('Network connectivity issues');
          recommendations.push('Check internet connection and server status');
        }
      } catch (error) {
        issues.push('Cannot reach server');
        recommendations.push('Verify server is running and accessible');
      }

      // Test 4: Server Response
      logger.debug('Testing server response');
      try {
        const templates = await enhancedApi.kpiTemplates.list();
        server = Array.isArray(templates);
        if (!server) {
          issues.push('Server returned invalid data');
          recommendations.push('Check server logs for errors');
        }
      } catch (error) {
        issues.push('Server request failed');
        recommendations.push('Check server configuration and database connection');
      }

      // Determine overall health
      const healthyCount = [apiEndpoint, authentication, network, server].filter(Boolean).length;
      let overall: 'healthy' | 'degraded' | 'unhealthy';
      
      if (healthyCount === 4) {
        overall = 'healthy';
      } else if (healthyCount >= 2) {
        overall = 'degraded';
      } else {
        overall = 'unhealthy';
      }

      setDiagnostics({
        apiEndpoint,
        authentication,
        network,
        server,
        overall,
        issues,
        recommendations
      });

    } catch (error) {
      logger.error('Diagnostics failed', error, 'TemplateDiagnostics');
      setDiagnostics(prev => ({
        ...prev,
        overall: 'unhealthy',
        issues: [...prev.issues, 'Diagnostics failed'],
        recommendations: [...prev.recommendations, 'Check console for detailed errors']
      }));
    } finally {
      setIsRunning(false);
    }
  }, []);

  useEffect(() => {
    runDiagnostics();
  }, [runDiagnostics]);

  return {
    diagnostics,
    isRunning,
    runDiagnostics
  };
};




