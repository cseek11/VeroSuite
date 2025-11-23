import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Heading,
  Text,
} from '@/components/ui';
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

export default function ComplianceCenter({ customerId: _customerId }: ComplianceCenterProps) {
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
          <Heading level={3} className="text-slate-900">
            Compliance Center
          </Heading>
          <Badge variant="default">
            Regulatory Tracking
          </Badge>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Overall Compliance Score */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                <Heading level={4} className="text-slate-900">
                  Compliance Score
                </Heading>
              </div>
              {getTrendIcon(complianceData.overallScore, 90)}
            </div>
            
            <Heading level={2} className="text-green-900 font-bold mb-2">
              {complianceData.overallScore}%
            </Heading>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${complianceData.overallScore}%` }}
              />
            </div>
          </div>

          {/* Critical Issues */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <Heading level={4} className="text-slate-900">
                  Critical Issues
                </Heading>
              </div>
            </div>
            
            <Heading level={2} className="text-red-900 font-bold mb-2">
              {complianceData.criticalIssues}
            </Heading>
            
            <Text variant="small" className="text-slate-600">
              Requires immediate attention
            </Text>
          </div>

          {/* Pending Actions */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-yellow-600" />
                <Heading level={4} className="text-slate-900">
                  Pending Actions
                </Heading>
              </div>
            </div>
            
            <Heading level={2} className="text-yellow-900 font-bold mb-2">
              {complianceData.pendingActions}
            </Heading>
            
            <Text variant="small" className="text-slate-600">
              Awaiting completion
            </Text>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <Heading level={4} className="text-slate-900">
                  Due Soon
                </Heading>
              </div>
            </div>
            
            <Heading level={2} className="text-blue-900 font-bold mb-2">
              {complianceData.upcomingDeadlines}
            </Heading>
            
            <Text variant="small" className="text-slate-600">
              Within 30 days
            </Text>
          </div>
        </div>

        {/* Regulatory Compliance */}
        <div className="mb-8">
          <Heading level={4} className="text-slate-900 mb-4">
            Regulatory Compliance
          </Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <Heading level={5} className="text-slate-900">
                  EPA Compliance
                </Heading>
                {getTrendIcon(complianceData.regulatoryCompliance.epaCompliance, 95)}
              </div>
              
              <Heading level={3} className="text-green-900 font-bold mb-2">
                {complianceData.regulatoryCompliance.epaCompliance}%
              </Heading>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${complianceData.regulatoryCompliance.epaCompliance}%` }}
                />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <Heading level={5} className="text-slate-900">
                  State Compliance
                </Heading>
                {getTrendIcon(complianceData.regulatoryCompliance.stateCompliance, 90)}
              </div>
              
              <Heading level={3} className="text-blue-900 font-bold mb-2">
                {complianceData.regulatoryCompliance.stateCompliance}%
              </Heading>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${complianceData.regulatoryCompliance.stateCompliance}%` }}
                />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <Heading level={5} className="text-slate-900">
                  Local Compliance
                </Heading>
                {getTrendIcon(complianceData.regulatoryCompliance.localCompliance, 85)}
              </div>
              
              <Heading level={3} className="text-yellow-900 font-bold mb-2">
                {complianceData.regulatoryCompliance.localCompliance}%
              </Heading>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${complianceData.regulatoryCompliance.localCompliance}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chemical Usage Monitoring */}
        <div className="mb-8">
          <Heading level={4} className="text-slate-900 mb-4">
            Chemical Usage Monitoring
          </Heading>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Heading level={5} className="text-slate-900 mb-2">
                  Total Applications
                </Heading>
                <Heading level={3} className="text-purple-900 font-bold">
                  {complianceData.chemicalUsage.totalApplications}
                </Heading>
                <Text variant="small" className="text-slate-600">
                  This quarter
                </Text>
              </div>
              
              <div>
                <Heading level={5} className="text-slate-900 mb-2">
                  Chemicals Used
                </Heading>
                <div className="space-y-1">
                  {complianceData.chemicalUsage.chemicalsUsed.map((chemical, index) => (
                    <Badge key={index} variant="default" className="bg-purple-100 text-purple-800">
                      {chemical}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Heading level={5} className="text-slate-900 mb-2">
                  Safety Record
                </Heading>
                <Heading level={3} className="text-green-900 font-bold">
                  {complianceData.chemicalUsage.safetyIncidents}
                </Heading>
                <Text variant="small" className="text-slate-600">
                  Safety incidents
                </Text>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-purple-200">
              <Text variant="small" className="text-slate-600">
                Last inspection: {formatDate(complianceData.chemicalUsage.lastInspection)}
              </Text>
            </div>
          </div>
        </div>

        {/* Compliance Records */}
        <div>
          <Heading level={4} className="text-slate-900 mb-4">
            Compliance Records
          </Heading>
          
          <div className="space-y-4">
            {complianceRecords.map((record) => {
              const daysUntilDue = getDaysUntilDue(record.due_date);
              
              return (
                <div
                  key={record.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    record.is_critical ? 'border-red-200 bg-red-50' : 'border-slate-200'
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
                        <Heading level={5} className="text-slate-900">
                          {record.record_type}
                        </Heading>
                        <Text variant="small" className="text-slate-600">
                          {record.regulatory_body}
                        </Text>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                                  <Badge
              variant="default"
            >
              {record.status}
            </Badge>
                      <Badge
                        variant="default"
                        className={getPriorityColor(record.priority) === 'red' ? 'bg-red-100 text-red-800' : 
                                   getPriorityColor(record.priority) === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
                                   'bg-green-100 text-green-800'}
                      >
                        {record.priority}
                      </Badge>
                      {record.is_critical && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  <Text variant="body" className="text-slate-800 mb-3">
                    {record.description}
                  </Text>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
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
                        daysUntilDue <= 7 ? 'text-yellow-600' : 'text-slate-600'
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

      {/* Compliance Record Detail Dialog */}
      <Dialog open={showRecordModal} onOpenChange={(open) => !open && setShowRecordModal(false)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Compliance Record - {selectedRecord?.record_type}</DialogTitle>
          </DialogHeader>
        {selectedRecord && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="small" className="text-slate-600">Status</Text>
                <Badge variant="default" className={
                  getStatusColor(selectedRecord.status) === 'green' ? 'bg-green-100 text-green-800' :
                  getStatusColor(selectedRecord.status) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  getStatusColor(selectedRecord.status) === 'red' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {selectedRecord.status}
                </Badge>
              </div>
              <div>
                <Text variant="small" className="text-slate-600">Priority</Text>
                <Badge variant="default" className={
                  getPriorityColor(selectedRecord.priority) === 'red' ? 'bg-red-100 text-red-800' :
                  getPriorityColor(selectedRecord.priority) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }>
                  {selectedRecord.priority}
                </Badge>
              </div>
              <div>
                <Text variant="small" className="text-slate-600">Regulatory Body</Text>
                <Text variant="body">{selectedRecord.regulatory_body}</Text>
              </div>
              <div>
                <Text variant="small" className="text-slate-600">Due Date</Text>
                <Text variant="body">{formatDate(selectedRecord.due_date)}</Text>
              </div>
            </div>

            <div>
              <Text variant="small" className="text-slate-600 mb-2">Description</Text>
              <Text variant="body">{selectedRecord.description}</Text>
            </div>

            {selectedRecord.chemical_used && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text variant="small" className="text-slate-600">Chemical Used</Text>
                  <Text variant="body">{selectedRecord.chemical_used}</Text>
                </div>
                <div>
                  <Text variant="small" className="text-slate-600">Application Rate</Text>
                  <Text variant="body">{selectedRecord.application_rate}</Text>
                </div>
              </div>
            )}

            {selectedRecord.safety_measures && (
              <div>
                <Text variant="small" className="text-slate-600 mb-2">Safety Measures</Text>
                <div className="space-y-1">
                  {selectedRecord.safety_measures.map((measure, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Text variant="small">{measure}</Text>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRecord.is_critical && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-1">Critical Compliance Issue</h3>
                <p className="text-sm text-yellow-700">
                  This record requires immediate attention to maintain regulatory compliance.
                </p>
              </div>
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
        </DialogContent>
      </Dialog>
    </>
  );
}
