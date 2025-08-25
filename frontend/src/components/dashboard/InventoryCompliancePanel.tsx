import React from 'react';
import { Card, Typography, Chip, ProgressBar } from '@/components/ui/EnhancedUI';
import { Package, AlertTriangle, CheckCircle, Clock, Thermometer, Shield, Zap } from 'lucide-react';

const InventoryCompliancePanel: React.FC = () => {
  // Mock data - would come from API
  const inventoryData = {
    totalItems: 247,
    lowStock: 12,
    outOfStock: 3,
    expiringSoon: 8,
    complianceRate: 96.8,
    safetyScore: 98.2
  };

  const inventoryCategories = [
    {
      name: 'Pesticides',
      total: 89,
      lowStock: 4,
      outOfStock: 1,
      compliance: 98.5
    },
    {
      name: 'Safety Equipment',
      total: 67,
      lowStock: 3,
      outOfStock: 0,
      compliance: 100.0
    },
    {
      name: 'Tools & Equipment',
      total: 45,
      lowStock: 2,
      outOfStock: 1,
      compliance: 95.2
    },
    {
      name: 'PPE Supplies',
      total: 46,
      lowStock: 3,
      outOfStock: 1,
      compliance: 97.8
    }
  ];

  const complianceAlerts = [
    {
      id: 1,
      type: 'expiration',
      item: 'Termite Control Solution',
      severity: 'high',
      message: 'Expires in 15 days',
      date: '2024-01-30'
    },
    {
      id: 2,
      type: 'low_stock',
      item: 'Safety Gloves',
      severity: 'medium',
      message: 'Only 5 units remaining',
      date: '2024-01-20'
    },
    {
      id: 3,
      type: 'temperature',
      item: 'Chemical Storage',
      severity: 'low',
      message: 'Temperature slightly above recommended',
      date: '2024-01-18'
    },
    {
      id: 4,
      type: 'maintenance',
      item: 'Spray Equipment',
      severity: 'medium',
      message: 'Scheduled maintenance due',
      date: '2024-01-25'
    }
  ];

  const recentInspections = [
    {
      id: 1,
      inspector: 'John Smith',
      date: '2024-01-15',
      score: 98,
      status: 'passed',
      notes: 'All safety protocols followed correctly'
    },
    {
      id: 2,
      inspector: 'Maria Garcia',
      date: '2024-01-08',
      score: 95,
      status: 'passed',
      notes: 'Minor improvement needed in storage labeling'
    },
    {
      id: 3,
      inspector: 'David Chen',
      date: '2024-01-01',
      score: 100,
      status: 'passed',
      notes: 'Perfect compliance score achieved'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'expiration':
        return <Clock className="h-5 w-5 text-red-500" />;
      case 'low_stock':
        return <Package className="h-5 w-5 text-yellow-500" />;
      case 'temperature':
        return <Thermometer className="h-5 w-5 text-blue-500" />;
      case 'maintenance':
        return <Zap className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Inventory Overview */}
      <Card title="Inventory & Compliance Overview">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <Package className="mx-auto h-8 w-8 text-blue-500 mb-2" />
            <Typography variant="h3" className="font-bold text-blue-600">
              {inventoryData.totalItems}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Total Items
            </Typography>
          </div>

          <div className="text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
            <Typography variant="h3" className="font-bold text-yellow-600">
              {inventoryData.lowStock}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Low Stock
            </Typography>
          </div>

          <div className="text-center">
            <Shield className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <Typography variant="h3" className="font-bold text-green-600">
              {inventoryData.complianceRate}%
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Compliance Rate
            </Typography>
          </div>

          <div className="text-center">
            <CheckCircle className="mx-auto h-8 w-8 text-purple-500 mb-2" />
            <Typography variant="h3" className="font-bold text-purple-600">
              {inventoryData.safetyScore}%
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Safety Score
            </Typography>
          </div>
        </div>
      </Card>

      {/* Inventory Categories */}
      <Card title="Inventory by Category">
        <div className="space-y-4">
          {inventoryCategories.map((category, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <Typography variant="body1" className="font-medium">
                  {category.name}
                </Typography>
                <div className="flex items-center space-x-2">
                  <Chip variant={category.compliance >= 95 ? 'success' : 'warning' as any}>
                    {category.compliance}%
                  </Chip>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <Typography variant="body2" className="font-medium text-blue-600">
                    {category.total}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    Total Items
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography variant="body2" className="font-medium text-yellow-600">
                    {category.lowStock}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    Low Stock
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography variant="body2" className="font-medium text-red-600">
                    {category.outOfStock}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    Out of Stock
                  </Typography>
                </div>
              </div>

              <ProgressBar
                value={category.compliance}
                color={category.compliance >= 95 ? 'success' : 'warning' as any}
                showLabel
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Compliance Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Compliance Alerts">
          <div className="space-y-4">
            {complianceAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <Typography variant="body1" className="font-medium">
                      {alert.item}
                    </Typography>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <Typography variant="body2" className="text-gray-600 mb-1">
                    {alert.message}
                  </Typography>
                  <div className="flex items-center justify-between">
                    <Typography variant="caption" className="text-gray-500">
                      {new Date(alert.date).toLocaleDateString()}
                    </Typography>
                    <Chip variant={getSeverityColor(alert.severity) as any}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </Chip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Inspections">
          <div className="space-y-4">
            {recentInspections.map((inspection) => (
              <div key={inspection.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Typography variant="body1" className="font-medium">
                      {inspection.inspector}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                      {new Date(inspection.date).toLocaleDateString()}
                    </Typography>
                  </div>
                  <div className="text-right">
                    <Typography variant="h4" className="font-bold text-green-600">
                      {inspection.score}%
                    </Typography>
                    <Chip variant="success">
                      {inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
                    </Chip>
                  </div>
                </div>
                <Typography variant="body2" className="text-gray-600">
                  {inspection.notes}
                </Typography>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Safety Metrics */}
      <Card title="Safety & Compliance Metrics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Shield className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <Typography variant="h3" className="font-bold text-green-600">
              {inventoryData.complianceRate}%
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Overall Compliance
            </Typography>
            <ProgressBar
              value={inventoryData.complianceRate}
              color="success"
              showLabel
            />
          </div>

          <div className="text-center">
            <CheckCircle className="mx-auto h-8 w-8 text-blue-500 mb-2" />
            <Typography variant="h3" className="font-bold text-blue-600">
              {inventoryData.safetyScore}%
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Safety Score
            </Typography>
            <ProgressBar
              value={inventoryData.safetyScore}
              color="primary"
              showLabel
            />
          </div>

          <div className="text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-orange-500 mb-2" />
            <Typography variant="h3" className="font-bold text-orange-600">
              {inventoryData.expiringSoon}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Items Expiring Soon
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              Requires immediate attention
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InventoryCompliancePanel;

