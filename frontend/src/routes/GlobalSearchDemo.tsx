// ============================================================================
// GLOBAL SEARCH DEMO PAGE
// ============================================================================
// Demo page showcasing the Global Smart Search functionality
// 
// This page demonstrates natural language commands and search capabilities

import React, { useState, useCallback } from 'react';
import { Card, Button } from '@/components/ui/EnhancedUI';
import GlobalSearchBar from '@/components/search/GlobalSearchBar';
import { 
  Search, 
  Command, 
  Lightbulb, 
  CheckCircle, 
  AlertCircle,
  UserPlus,
  Calendar,
  FileText,
  DollarSign,
  UserCheck,
  Bell,
  Settings,
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { ActionResult } from '@/lib/action-handlers';
import type { IntentResult } from '@/lib/intent-classification-service';
import { intentClassificationService } from '@/lib/intent-classification-service';

export const GlobalSearchDemo: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [actionResults, setActionResults] = useState<ActionResult[]>([]);
  const [showExamples, setShowExamples] = useState(true);

  const handleResultsChange = useCallback((results: any[]) => {
    setSearchResults(results);
  }, []);

  const handleActionExecuted = useCallback((result: ActionResult) => {
    setActionResults(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 results
  }, []);

  const getIntentExamples = () => {
    const examples = intentClassificationService.getIntentExamples();
    return [
      {
        category: 'Customer Management',
        icon: <UserPlus className="w-5 h-5" />,
        color: 'text-green-600 bg-green-50 border-green-200',
        examples: examples.createCustomer.slice(0, 2)
      },
      {
        category: 'Appointment Scheduling',
        icon: <Calendar className="w-5 h-5" />,
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        examples: examples.scheduleAppointment.slice(0, 2)
      },
      {
        category: 'Customer Notes',
        icon: <FileText className="w-5 h-5" />,
        color: 'text-purple-600 bg-purple-50 border-purple-200',
        examples: examples.addNote.slice(0, 2)
      },
      {
        category: 'Invoice Management',
        icon: <DollarSign className="w-5 h-5" />,
        color: 'text-green-600 bg-green-50 border-green-200',
        examples: examples.markInvoicePaid.slice(0, 2)
      },
      {
        category: 'Technician Assignment',
        icon: <UserCheck className="w-5 h-5" />,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        examples: examples.assignTechnician.slice(0, 2)
      },
      {
        category: 'Customer Communication',
        icon: <Bell className="w-5 h-5" />,
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        examples: examples.sendReminder.slice(0, 2)
      }
    ];
  };

  const getActionStatusIcon = (result: ActionResult) => {
    if (result.success) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getActionStatusColor = (result: ActionResult) => {
    if (result.success) {
      return 'bg-green-50 border-green-200';
    } else {
      return 'bg-red-50 border-red-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Global Smart Search</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search for customers or use natural language commands to manage your pest control business. 
            Try commands like "create customer", "schedule appointment", or "add note".
          </p>
        </div>

        {/* Main Search Interface */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Command className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Smart Search & Commands</h2>
            </div>
            
            <GlobalSearchBar
              onResultsChange={handleResultsChange}
              onActionExecuted={handleActionExecuted}
              placeholder="Try: 'Create customer John Smith at 123 Main St' or 'Find Lisa Nguyen'"
              className="w-full"
            />

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Search Results ({searchResults.length})
                </h3>
                <div className="grid gap-3">
                  {searchResults.slice(0, 5).map((result, index) => (
                    <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="font-medium text-gray-900">{result.name}</div>
                      <div className="text-sm text-gray-600">{result.address}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {result.phone} • {result.email}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Action Results */}
        {actionResults.length > 0 && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Recent Actions</h2>
              </div>
              
              <div className="space-y-3">
                {actionResults.map((result, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${getActionStatusColor(result)}`}>
                    <div className="flex items-start space-x-3">
                      {getActionStatusIcon(result)}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{result.message}</div>
                        {result.error && (
                          <div className="text-sm text-red-600 mt-1">{result.error}</div>
                        )}
                        {result.data && (
                          <div className="text-xs text-gray-500 mt-1">
                            Action ID: {result.data.id || 'N/A'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Command Examples */}
        {showExamples && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Command Examples</h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExamples(false)}
                >
                  Hide Examples
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getIntentExamples().map((category, index) => (
                  <div key={index} className="space-y-3">
                    <div className={`flex items-center space-x-2 p-3 rounded-lg border ${category.color}`}>
                      {category.icon}
                      <h3 className="font-medium text-gray-900">{category.category}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {category.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="text-sm text-gray-700 font-mono">{example}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* How It Works */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">1. Natural Language Input</h3>
                <p className="text-sm text-gray-600">
                  Type your request in plain English. The system understands commands like 
                  "create customer" or "schedule appointment".
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Command className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">2. Intent Classification</h3>
                <p className="text-sm text-gray-600">
                  The system analyzes your input to understand what you want to do and 
                  extracts relevant information like customer names and dates.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">3. Action Execution</h3>
                <p className="text-sm text-gray-600">
                  The system executes your command, creating customers, scheduling appointments, 
                  or performing other actions as requested.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Smart Intent Recognition</h3>
                  <p className="text-sm text-gray-600">
                    Automatically detects whether you want to search or perform an action.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Customer Management</h3>
                  <p className="text-sm text-gray-600">
                    Create customers, add notes, and manage customer information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Appointment Scheduling</h3>
                  <p className="text-sm text-gray-600">
                    Schedule, reschedule, and cancel appointments with natural language.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Confirmation & Safety</h3>
                  <p className="text-sm text-gray-600">
                    Shows confirmation dialogs for important actions to prevent mistakes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GlobalSearchDemo;