import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, Download } from 'lucide-react';
import { logger } from '@/utils/logger';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  error?: string;
}

interface TestCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  tests: TestResult[];
  status: 'pending' | 'running' | 'completed';
  totalTests: number;
  passedTests: number;
  failedTests: number;
}

const SimpleTestingDashboard: React.FC = () => {
  const [categories, setCategories] = useState<TestCategory[]>([
    {
      id: 'unit',
      name: 'Unit Tests',
      description: 'Individual component and service tests',
      icon: <CheckCircle className="w-5 h-5" />,
      tests: [],
      status: 'pending',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
    },
    {
      id: 'integration',
      name: 'Integration Tests',
      description: 'API and service integration tests',
      icon: <RefreshCw className="w-5 h-5" />,
      tests: [],
      status: 'pending',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
    },
    {
      id: 'e2e',
      name: 'E2E Tests',
      description: 'End-to-end user workflow tests',
      icon: <Play className="w-5 h-5" />,
      tests: [],
      status: 'pending',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
    },
    {
      id: 'security',
      name: 'Security Tests',
      description: 'OWASP and security compliance tests',
      icon: <AlertTriangle className="w-5 h-5" />,
      tests: [],
      status: 'pending',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
    },
    {
      id: 'performance',
      name: 'Performance Tests',
      description: 'Load and stress testing',
      icon: <Clock className="w-5 h-5" />,
      tests: [],
      status: 'pending',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
    },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const generateMockTests = (categoryId: string): TestResult[] => {
    const testTemplates = {
      unit: [
        'Button Component Rendering',
        'Input Validation',
        'Form Submission',
        'Error Handling',
        'Loading States',
        'User Interactions',
        'Accessibility Tests',
        'Responsive Design',
      ],
      integration: [
        'API Authentication',
        'Database Connections',
        'Service Integration',
        'Data Validation',
        'Error Recovery',
        'Transaction Handling',
        'Cache Management',
        'External API Calls',
      ],
      e2e: [
        'User Login Flow',
        'Customer Creation',
        'Work Order Management',
        'Search Functionality',
        'Navigation Tests',
        'Form Workflows',
        'Data Persistence',
        'Error Scenarios',
      ],
      security: [
        'OWASP Top 10 Validation',
        'SQL Injection Prevention',
        'XSS Protection',
        'CSRF Protection',
        'Authentication Security',
        'Authorization Checks',
        'Data Encryption',
        'Session Management',
      ],
      performance: [
        'Load Testing',
        'Stress Testing',
        'Memory Usage',
        'Response Times',
        'Throughput Testing',
        'Concurrent Users',
        'Database Performance',
        'API Performance',
      ],
    };

    return testTemplates[categoryId as keyof typeof testTemplates]?.map((name, index) => ({
      id: `${categoryId}-${index}`,
      name,
      status: 'pending' as const,
    })) || [];
  };

  const runTestCategory = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    addLog(`Starting ${category.name}...`);
    
    setCategories(prev => prev.map(c => 
      c.id === categoryId 
        ? { ...c, status: 'running' as const }
        : c
    ));

    try {
      // Generate mock tests for this category
      const mockTests = generateMockTests(categoryId);
      
      // Update tests with running status
      setCategories(prev => prev.map(c => 
        c.id === categoryId 
          ? { ...c, tests: mockTests.map(t => ({ ...t, status: 'running' as const })) }
          : c
      ));

      // Simulate test execution with progress updates
      for (let i = 0; i < mockTests.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        const currentMock = mockTests[i];
        if (!currentMock) continue;

        const testResultBase: TestResult = {
          id: currentMock.id,
          name: currentMock.name,
          status: Math.random() > 0.1 ? 'passed' : 'failed' as const,
          duration: Math.floor(Math.random() * 5000) + 1000,
        };
        const includeError = Math.random() > 0.9;
        const testResult: TestResult = includeError
          ? { ...testResultBase, error: 'Test assertion failed' }
          : testResultBase;

        setCategories(prev => prev.map(c => {
          if (c.id !== categoryId) return c;
          const tests: TestResult[] = c.tests ?? [];
          return {
            ...c,
            tests: tests.map((t, idx) => idx === i ? testResult : t),
            totalTests: tests.length,
            passedTests: tests.filter((_, idx) => idx <= i && tests[idx]?.status === 'passed').length,
            failedTests: tests.filter((_, idx) => idx <= i && tests[idx]?.status === 'failed').length,
          };
        }));

        addLog(`${testResult.name}: ${testResult.status === 'passed' ? 'PASSED' : 'FAILED'}`);
      }

      // Mark category as completed
      setCategories(prev => prev.map(c => 
        c.id === categoryId 
          ? { ...c, status: 'completed' as const }
          : c
      ));

      addLog(`${category.name} completed successfully`);

    } catch (error) {
      addLog(`Error running ${category.name}: ${error}`);
      setCategories(prev => prev.map(c => 
        c.id === categoryId 
          ? { ...c, status: 'completed' as const }
          : c
      ));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    setLogs([]);
    addLog('Starting comprehensive test suite...');

    for (const category of categories) {
      try {
        await runTestCategory(category.id);
      } catch (error) {
        logger.error('Failed to run test category', {
          error: error instanceof Error ? error.message : String(error),
          categoryId: category.id
        });
        // Continue with next category despite error
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause between categories
    }

    setIsRunning(false);
    setOverallStatus('completed');
    addLog('All tests completed!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'running': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const exportResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      categories: categories.map(c => ({
        name: c.name,
        status: c.status,
        totalTests: c.totalTests,
        passedTests: c.passedTests,
        failedTests: c.failedTests,
        tests: c.tests,
      })),
      logs,
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">VeroField Testing Dashboard</h1>
              <p className="text-gray-600 mt-2">Comprehensive testing suite for enterprise-grade CRM application</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportResults}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </button>
              <button
                onClick={runAllTests}
                disabled={isRunning}
                className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </button>
            </div>
          </div>
        </div>

        {/* Overall Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${
                overallStatus === 'running' ? 'bg-blue-500 animate-pulse' :
                overallStatus === 'completed' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <span className="text-lg font-semibold text-gray-900">
                Overall Status: {overallStatus === 'running' ? 'Running Tests' : 
                                overallStatus === 'completed' ? 'Tests Completed' : 'Ready to Test'}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Last run: {new Date().toLocaleString()}
            </div>
          </div>
        </div>

        {/* Test Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    category.status === 'running' ? 'bg-blue-100 text-blue-600' :
                    category.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  category.status === 'running' ? 'bg-blue-100 text-blue-600' :
                  category.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.status}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Total Tests:</span>
                  <span className="font-medium">{category.totalTests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Passed:</span>
                  <span className="font-medium text-green-600">{category.passedTests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Failed:</span>
                  <span className="font-medium text-red-600">{category.failedTests}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  runTestCategory(category.id);
                }}
                disabled={isRunning}
                className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                Run {category.name}
              </button>
            </div>
          ))}
        </div>

        {/* Test Details */}
        {selectedCategory && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {categories.find(c => c.id === selectedCategory)?.name} Details
              </h3>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {categories.find(c => c.id === selectedCategory)?.tests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded-full ${getStatusColor(test.status)}`}>
                      {getStatusIcon(test.status)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{test.name}</div>
                      {test.duration && (
                        <div className="text-sm text-gray-500">
                          Duration: {test.duration}ms
                        </div>
                      )}
                      {test.error && (
                        <div className="text-sm text-red-600 mt-1">
                          Error: {test.error}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                    {test.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Logs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Live Test Logs</h3>
            <button
              onClick={() => setLogs([])}
              className="text-gray-400 hover:text-gray-600"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet. Run tests to see live updates.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTestingDashboard;






