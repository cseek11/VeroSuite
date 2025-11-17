import React, { useState, useEffect } from 'react';
import { X, Search, Command, Users, Calendar, DollarSign, BarChart3, Wrench, MessageSquare, Shield, ChevronDown, ChevronRight } from 'lucide-react';

interface CommandHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandCategory {
  title: string;
  icon: React.ReactNode;
  commands: CommandExample[];
}

interface CommandExample {
  command: string;
  description: string;
  example: string;
}

const CommandHelpModal: React.FC<CommandHelpModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCommands, setExpandedCommands] = useState<Set<string>>(new Set());

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const commandCategories: CommandCategory[] = [
    {
      title: 'Customer Management',
      icon: <Users className="h-5 w-5 text-purple-600" />,
      commands: [
        { command: 'create customer', description: 'Create a new customer account', example: 'create new customer John Smith 123 Main St, Anytown, CA, 12345' },
        { command: 'update customer', description: 'Update customer information', example: 'update customer John Smith phone to 555-1234' },
        { command: 'view customer details', description: 'View detailed customer information', example: 'view customer details for John Smith' },
        { command: 'customer history', description: 'View customer service history', example: 'customer history for John Smith' },
        { command: 'delete customer', description: 'Delete a customer account', example: 'delete customer John Smith' },
        { command: 'add customer tag', description: 'Add a tag to customer', example: 'add customer tag "VIP" to John Smith' },
        { command: 'set customer priority', description: 'Set customer priority level', example: 'set customer priority to high for John Smith' },
        { command: 'mark customer inactive', description: 'Mark customer as inactive', example: 'mark customer John Smith as inactive' },
        { command: 'activate customer', description: 'Activate a customer', example: 'activate customer John Smith' }
      ]
    },
    {
      title: 'Job & Service Management',
      icon: <Calendar className="h-5 w-5 text-purple-600" />,
      commands: [
        { command: 'schedule appointment', description: 'Schedule a service appointment', example: 'schedule bed bug treatment for John Smith tomorrow at 2pm' },
        { command: 'start job', description: 'Start a job', example: 'start job for John Smith' },
        { command: 'complete job', description: 'Complete a job with notes', example: 'complete job for John Smith with notes "treatment successful"' },
        { command: 'pause job', description: 'Pause a job', example: 'pause job for John Smith' },
        { command: 'resume job', description: 'Resume a paused job', example: 'resume job for John Smith' },
        { command: 'job status', description: 'Check job status', example: 'job status for John Smith' },
        { command: 'update appointment', description: 'Update appointment details', example: 'reschedule John Smith appointment to Friday at 10am' },
        { command: 'cancel appointment', description: 'Cancel an appointment', example: 'cancel appointment for John Smith' },
        { command: 'assign technician', description: 'Assign technician to job', example: 'assign technician Alex to John Smith job' },
        { command: 'add service notes', description: 'Add notes to a job', example: 'add service notes to John Smith job: "found termite damage"' },
        { command: 'add chemical used', description: 'Record chemical used', example: 'add chemical used "Termidor" to John Smith job' },
        { command: 'create service agreement', description: 'Create service contract', example: 'create service agreement for John Smith quarterly pest control' },
        { command: 'create work order', description: 'Create technician instructions', example: 'create work order for John Smith bed bug treatment' },
        { command: 'generate work order', description: 'Generate work order from agreement', example: 'generate work order from agreement 12345' }
      ]
    },
    {
      title: 'Financial & Billing',
      icon: <DollarSign className="h-5 w-5 text-purple-600" />,
      commands: [
        { command: 'create invoice', description: 'Create invoice (requires agreement, work order, completed job)', example: 'create invoice for John Smith $150' },
        { command: 'send invoice', description: 'Send invoice to customer', example: 'send invoice to John Smith' },
        { command: 'record payment', description: 'Record payment received', example: 'record payment $150 from John Smith' },
        { command: 'mark invoice paid', description: 'Mark invoice as paid', example: 'mark invoice 12345 as paid' },
        { command: 'payment history', description: 'View payment history', example: 'payment history for John Smith' },
        { command: 'outstanding invoices', description: 'Show outstanding invoices', example: 'outstanding invoices' }
      ]
    },
    {
      title: 'Technician & Equipment',
      icon: <Wrench className="h-5 w-5 text-purple-600" />,
      commands: [
        { command: 'technician schedule', description: 'View technician schedule', example: 'technician schedule for Alex' },
        { command: 'technician availability', description: 'Check technician availability', example: 'technician availability tomorrow' },
        { command: 'technician performance', description: 'View technician performance', example: 'technician performance report' },
        { command: 'technician location', description: 'Get technician location', example: 'technician location for Alex' },
        { command: 'equipment availability', description: 'Check equipment availability', example: 'check equipment availability' },
        { command: 'assign equipment', description: 'Assign equipment to job', example: 'assign equipment to John Smith job' },
        { command: 'equipment maintenance', description: 'Check equipment maintenance', example: 'equipment maintenance due' },
        { command: 'inventory levels', description: 'Check inventory levels', example: 'inventory levels for chemicals' }
      ]
    },
    {
      title: 'Communication',
      icon: <MessageSquare className="h-5 w-5 text-purple-600" />,
      commands: [
        { command: 'send reminder', description: 'Send appointment reminder', example: 'send appointment reminder to John Smith' },
        { command: 'email confirmation', description: 'Send email confirmation', example: 'email confirmation to John Smith' },
        { command: 'text message', description: 'Send text message', example: 'text message to John Smith about reschedule' },
        { command: 'call customer', description: 'Call customer', example: 'call customer John Smith' },
        { command: 'communication history', description: 'View communication history', example: 'communication history for John Smith' },
        { command: 'send follow-up survey', description: 'Send follow-up survey', example: 'send follow-up survey to John Smith' },
        { command: 'notify manager', description: 'Notify manager', example: 'notify manager about John Smith complaint' },
        { command: 'alert technician', description: 'Alert technician', example: 'alert technician about John Smith special requirements' }
      ]
    },
    {
      title: 'Reports & Analytics',
      icon: <BarChart3 className="h-5 w-5 text-purple-600" />,
      commands: [
        { command: 'revenue report', description: 'Show revenue report', example: 'show revenue report for this month' },
        { command: 'customer satisfaction', description: 'Customer satisfaction report', example: 'customer satisfaction report' },
        { command: 'service completion rates', description: 'Service completion rates', example: 'service completion rates' },
        { command: 'customer retention', description: 'Customer retention report', example: 'customer retention report' },
        { command: 'daily schedule', description: 'Daily schedule report', example: 'daily schedule report' },
        { command: 'weekly summary', description: 'Weekly service summary', example: 'weekly service summary' },
        { command: 'monthly growth', description: 'Monthly customer growth', example: 'monthly customer growth' },
        { command: 'trend analysis', description: 'Trend analysis', example: 'trend analysis for this quarter' },
        { command: 'performance comparison', description: 'Performance comparison', example: 'performance comparison this month vs last month' }
      ]
    },
    {
      title: 'Search & Navigation',
      icon: <Search className="h-5 w-5 text-purple-600" />,
      commands: [
        { command: 'find', description: 'Find customers, jobs, or invoices', example: 'find John Smith' },
        { command: 'search', description: 'Search for specific information', example: 'search for customers with bed bug issues' },
        { command: 'show', description: 'Show specific data', example: 'show all jobs completed this week' },
        { command: 'list', description: 'List items', example: 'list customers with outstanding payments' },
        { command: 'advanced search', description: 'Complex search queries', example: 'find all customers with termite issues in downtown area' }
      ]
    },
    {
      title: 'System Administration',
      icon: <Shield className="h-5 w-5 text-purple-600" />,
      commands: [
        { command: 'add technician', description: 'Add new technician', example: 'add new technician Alex Smith' },
        { command: 'update technician', description: 'Update technician profile', example: 'update technician profile for Alex' },
        { command: 'deactivate user', description: 'Deactivate user account', example: 'deactivate user account for Mike' },
        { command: 'reset password', description: 'Reset user password', example: 'reset password for John' },
        { command: 'user permissions', description: 'Manage user permissions', example: 'user permissions for Emily' },
        { command: 'audit log', description: 'View audit log', example: 'audit log for today' },
        { command: 'backup data', description: 'Backup customer data', example: 'backup customer data' },
        { command: 'export data', description: 'Export data to CSV', example: 'export customer list to CSV' },
        { command: 'system health', description: 'System health check', example: 'system health check' }
      ]
    }
  ];

  // Toggle expanded state for a command
  const toggleExpanded = (commandKey: string) => {
    const newExpanded = new Set(expandedCommands);
    if (newExpanded.has(commandKey)) {
      newExpanded.delete(commandKey);
    } else {
      newExpanded.add(commandKey);
    }
    setExpandedCommands(newExpanded);
  };

  // Expand or collapse all commands
  const toggleAllExpanded = () => {
    if (expandedCommands.size === 0) {
      // Expand all
      const allCommandKeys = new Set<string>();
      filteredCategories.forEach(category => {
        category.commands.forEach((_, index) => {
          allCommandKeys.add(`${category.title}-${index}`);
        });
      });
      setExpandedCommands(allCommandKeys);
    } else {
      // Collapse all
      setExpandedCommands(new Set());
    }
  };

  // Filter commands based on search term and selected category
  const filteredCategories = commandCategories.map(category => ({
    ...category,
    commands: category.commands.filter(cmd => 
      (selectedCategory === 'all' || category.title === selectedCategory) &&
      (searchTerm === '' || 
        cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.example.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(category => category.commands.length > 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Command className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Command Help</h2>
              <p className="text-sm text-gray-600">Natural language commands for VeroField</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search commands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-modal-search="true"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="all">All Categories</option>
              {commandCategories.map(category => (
                <option key={category.title} value={category.title}>{category.title}</option>
              ))}
            </select>
            <button
              onClick={toggleAllExpanded}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center space-x-2"
            >
              {expandedCommands.size === 0 ? (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span>Expand All</span>
                </>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <span>Collapse All</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Commands List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No commands found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCategories.map((category) => (
                <div key={category.title} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                    <span className="text-sm text-gray-500">({category.commands.length} commands)</span>
                  </div>
                  
                  <div className="space-y-2">
                    {category.commands.map((cmd, index) => {
                      const commandKey = `${category.title}-${index}`;
                      const isExpanded = expandedCommands.has(commandKey);
                      
                      return (
                        <div key={index} className="border border-gray-200 rounded-lg hover:border-purple-300 transition-all">
                          <button
                            onClick={() => toggleExpanded(commandKey)}
                            className="w-full p-4 text-left flex items-center justify-between hover:bg-purple-50 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{cmd.command}</h4>
                              <p className="text-sm text-gray-600 mt-1">{cmd.description}</p>
                            </div>
                            <div className="ml-4">
                              {isExpanded ? (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </button>
                          
                          {isExpanded && (
                            <div className="px-4 pb-4 border-t border-gray-100">
                              <div className="pt-3">
                                <p className="text-xs text-gray-500 mb-2 font-medium">Example:</p>
                                <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                                  <code className="text-sm text-purple-700 font-mono">{cmd.example}</code>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>💡 <strong>Tip:</strong> You can use natural language - the system understands various phrasings</p>
            </div>
            <div className="text-sm text-gray-500">
              Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Esc</kbd> to close
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandHelpModal;
