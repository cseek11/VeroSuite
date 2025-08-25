import React, { useState } from 'react';
import {
  Card,
  Button,
  Typography,
  Chip,
  Modal,
  ProgressBar,
  Alert
} from '@/components/ui/EnhancedUI';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
  Eye
} from 'lucide-react';

interface ComplianceCenterProps {
  customerId: string;
}

interface ComplianceRecord {
  id: string;
  record_type: string;
  status: string;
  due_date: string;
  completed_date?: string;
  regulatory_body: string;
  description: string;
  priority: string;
  is_critical: boolean;
  chemical_used?: string;
  application_rate?: string;
  safety_measures?: string[];
}

export default function ComplianceCenter({ customerId }: ComplianceCenterProps) {
  const [selectedRecord, setSelectedRecord] = useState<ComplianceRecord | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Mock compliance data
  const complianceData = {
    overallScore: 92,
    criticalIssues: 1,
    pendingActions: 3,
    upcomingDeadlines: 2,
    chemicalUsage: {
      totalApplications: 24,
      chemicalsUsed: ['Bifenthrin', 'Fipronil', 'Imidacloprid'],
      safetyIncidents: 0,
      lastInspection: '2024-01-15'
    },
    regulatoryCompliance: {
      epaCompliance: 100,
      stateCompliance: 95,
      localCompliance: 88
    }
  };

  const complianceRecords: ComplianceRecord[] = [
    {
      id: '1',
      record_type: 'Chemical Application',
      status: 'completed',
      due_date: '2024-01-20',
      completed_date: '2024-01-18',
      regulatory_body: 'EPA',
      description: 'Quarterly termite treatment application',
      priority: 'high',
      is_critical: true,
      chemical_used: 'Fipronil',
      application_rate: '0.125%',
      safety_measures: ['PPE worn', 'Area cordoned off', 'Weather conditions suitable']
    },
    {
      id: '2',
      record_type: 'Safety Inspection',
      status: 'pending',
      due_date: '2024-02-15',
      regulatory_body: 'State Department',
      description: 'Annual safety equipment inspection',
      priority: 'medium',
      is_critical: false
    },
    {
      id: '3',
      record_type: 'Chemical Inventory',
      status: 'overdue',
      due_date: '2024-01-10',
      regulatory_body: 'Local Authority',
      description: 'Monthly chemical inventory report',
      priority: 'high',
      is_critical: true
    },
    {
      id: '4',
      record_type: 'Training Certification',
      status: 'completed',
      due_date: '2024-01-30',
      completed_date: '2024-01-25',
      regulatory_body: 'EPA',
      description: 'Annual pesticide applicator certification renewal',
      priority: 'high',
      is_critical: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'green';
      case 'pending': return 'yellow';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value < threshold) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-blue-500" />;
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h3" className="text-gray-900">
            Compliance Center
          </Typography>
          <Chip variant="default">
            Regulatory Tracking
          </Chip>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Overall Compliance Score */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                <Typography variant="h4" className="text-gray-900">
                  Compliance Score
                </Typography>
              </div>
              {getTrendIcon(complianceData.overallScore, 90)}
            </div>
            
            <Typography variant="h2" className="text-green-900 font-bold mb-2">
              {complianceData.overallScore}%
            </Typography>
            
            <ProgressBar
              value={complianceData.overallScore}
              color="success"
              className="h-3"
            />
          </div>

          {/* Critical Issues */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <Typography variant="h4" className="text-gray-900">
                  Critical Issues
                </Typography>
              </div>
            </div>
            
            <Typography variant="h2" className="text-red-900 font-bold mb-2">
              {complianceData.criticalIssues}
            </Typography>
            
            <Typography variant="body2" className="text-gray-600">
              Requires immediate attention
            </Typography>
          </div>

          {/* Pending Actions */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-yellow-600" />
                <Typography variant="h4" className="text-gray-900">
                  Pending Actions
                </Typography>
              </div>
            </div>
            
            <Typography variant="h2" className="text-yellow-900 font-bold mb-2">
              {complianceData.pendingActions}
            </Typography>
            
            <Typography variant="body2" className="text-gray-600">
              Awaiting completion
            </Typography>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <Typography variant="h4" className="text-gray-900">
                  Due Soon
                </Typography>
              </div>
            </div>
            
            <Typography variant="h2" className="text-blue-900 font-bold mb-2">
              {complianceData.upcomingDeadlines}
            </Typography>
            
            <Typography variant="body2" className="text-gray-600">
              Within 30 days
            </Typography>
          </div>
        </div>

        {/* Regulatory Compliance */}
        <div className="mb-8">
          <Typography variant="h4" className="text-gray-900 mb-4">
            Regulatory Compliance
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h5" className="text-gray-900">
                  EPA Compliance
                </Typography>
                {getTrendIcon(complianceData.regulatoryCompliance.epaCompliance, 95)}
              </div>
              
              <Typography variant="h3" className="text-green-900 font-bold mb-2">
                {complianceData.regulatoryCompliance.epaCompliance}%
              </Typography>
              
              <ProgressBar
                value={complianceData.regulatoryCompliance.epaCompliance}
                color="green"
                className="h-2"
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h5" className="text-gray-900">
                  State Compliance
                </Typography>
                {getTrendIcon(complianceData.regulatoryCompliance.stateCompliance, 90)}
              </div>
              
              <Typography variant="h3" className="text-blue-900 font-bold mb-2">
                {complianceData.regulatoryCompliance.stateCompliance}%
              </Typography>
              
              <ProgressBar
                value={complianceData.regulatoryCompliance.stateCompliance}
                color="blue"
                className="h-2"
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h5" className="text-gray-900">
                  Local Compliance
                </Typography>
                {getTrendIcon(complianceData.regulatoryCompliance.localCompliance, 85)}
              </div>
              
              <Typography variant="h3" className="text-yellow-900 font-bold mb-2">
                {complianceData.regulatoryCompliance.localCompliance}%
              </Typography>
              
              <ProgressBar
                value={complianceData.regulatoryCompliance.localCompliance}
                color="yellow"
                className="h-2"
              />
            </div>
          </div>
        </div>

        {/* Chemical Usage Monitoring */}
        <div className="mb-8">
          <Typography variant="h4" className="text-gray-900 mb-4">
            Chemical Usage Monitoring
          </Typography>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Typography variant="h5" className="text-gray-900 mb-2">
                  Total Applications
                </Typography>
                <Typography variant="h3" className="text-purple-900 font-bold">
                  {complianceData.chemicalUsage.totalApplications}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  This quarter
                </Typography>
              </div>
              
              <div>
                <Typography variant="h5" className="text-gray-900 mb-2">
                  Chemicals Used
                </Typography>
                <div className="space-y-1">
                  {complianceData.chemicalUsage.chemicalsUsed.map((chemical, index) => (
                    <Chip key={index} color="purple" variant="default" size="sm">
                      {chemical}
                    </Chip>
                  ))}
                </div>
              </div>
              
              <div>
                <Typography variant="h5" className="text-gray-900 mb-2">
                  Safety Record
                </Typography>
                <Typography variant="h3" className="text-green-900 font-bold">
                  {complianceData.chemicalUsage.safetyIncidents}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Safety incidents
                </Typography>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-purple-200">
              <Typography variant="body2" className="text-gray-600">
                Last inspection: {formatDate(complianceData.chemicalUsage.lastInspection)}
              </Typography>
            </div>
          </div>
        </div>

        {/* Compliance Records */}
        <div>
          <Typography variant="h4" className="text-gray-900 mb-4">
            Compliance Records
          </Typography>
          
          <div className="space-y-4">
            {complianceRecords.map((record) => {
              const daysUntilDue = getDaysUntilDue(record.due_date);
              
              return (
                <div
                  key={record.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    record.is_critical ? 'border-red-200 bg-red-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    setSelectedRecord(record);
                    setShowRecordModal(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        record.status === 'completed' ? 'bg-green-100 text-green-600' :
                        record.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      
                      <div>
                        <Typography variant="h5" className="text-gray-900">
                          {record.record_type}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {record.regulatory_body}
                        </Typography>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                                  <Chip
              variant="default"
            >
              {record.status}
            </Chip>
                      <Chip
                        color={getPriorityColor(record.priority)}
                        variant="default"
                      >
                        {record.priority}
                      </Chip>
                      {record.is_critical && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  <Typography variant="body1" className="text-gray-800 mb-3">
                    {record.description}
                  </Typography>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {formatDate(record.due_date)}</span>
                      </div>
                      
                      {record.completed_date && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Completed: {formatDate(record.completed_date)}</span>
                        </div>
                      )}
                    </div>
                    
                    {record.status !== 'completed' && (
                      <div className={`text-sm font-medium ${
                        daysUntilDue < 0 ? 'text-red-600' :
                        daysUntilDue <= 7 ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                         daysUntilDue === 0 ? 'Due today' :
                         `${daysUntilDue} days remaining`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Compliance Record Detail Modal */}
      <Modal
        isOpen={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        title={`Compliance Record - ${selectedRecord?.record_type}`}
        size="lg"
      >
        {selectedRecord && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="body2" className="text-gray-600">Status</Typography>
                <Chip color={getStatusColor(selectedRecord.status)}>
                  {selectedRecord.status}
                </Chip>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Priority</Typography>
                <Chip color={getPriorityColor(selectedRecord.priority)}>
                  {selectedRecord.priority}
                </Chip>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Regulatory Body</Typography>
                <Typography variant="body1">{selectedRecord.regulatory_body}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Due Date</Typography>
                <Typography variant="body1">{formatDate(selectedRecord.due_date)}</Typography>
              </div>
            </div>

            <div>
              <Typography variant="body2" className="text-gray-600 mb-2">Description</Typography>
              <Typography variant="body1">{selectedRecord.description}</Typography>
            </div>

            {selectedRecord.chemical_used && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="body2" className="text-gray-600">Chemical Used</Typography>
                  <Typography variant="body1">{selectedRecord.chemical_used}</Typography>
                </div>
                <div>
                  <Typography variant="body2" className="text-gray-600">Application Rate</Typography>
                  <Typography variant="body1">{selectedRecord.application_rate}</Typography>
                </div>
              </div>
            )}

            {selectedRecord.safety_measures && (
              <div>
                <Typography variant="body2" className="text-gray-600 mb-2">Safety Measures</Typography>
                <div className="space-y-1">
                  {selectedRecord.safety_measures.map((measure, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Typography variant="body2">{measure}</Typography>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRecord.is_critical && (
              <Alert type="warning" title="Critical Compliance Issue">
                This record requires immediate attention to maintain regulatory compliance.
              </Alert>
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Download Report
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                View Documentation
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRecordModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
