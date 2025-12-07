import React from 'react';
import Card from '@/components/ui/Card';
import { Badge, Heading, Text } from '@/components/ui';
import { Package, AlertTriangle, CheckCircle, Clock, Thermometer, Shield, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';

interface InventoryComplianceData {
  totalItems: number;
  lowStock: number;
  outOfStock: number;
  expiringSoon: number;
  complianceRate: number;
  safetyScore: number;
}

interface InventoryCategory {
  name: string;
  compliance: number;
  total: number;
  lowStock: number;
  outOfStock: number;
}

interface ComplianceAlert {
  id: string;
  item: string;
  message: string;
  date: string | Date;
  severity: 'high' | 'medium' | 'low' | string;
  type: 'expiration' | 'low_stock' | 'temperature' | 'maintenance' | string;
}

interface Inspection {
  id: string;
  inspector: string;
  date: string | Date;
  score: number;
  status: string;
  notes: string;
}

const defaultInventoryData: InventoryComplianceData = {
  totalItems: 0,
  lowStock: 0,
  outOfStock: 0,
  expiringSoon: 0,
  complianceRate: 0,
  safetyScore: 0,
};

const InventoryCompliancePanel: React.FC = () => {
  const { data: inventoryData = defaultInventoryData } = useQuery({
    queryKey: ['inventory', 'compliance'],
    queryFn: async (): Promise<InventoryComplianceData> => {
      if (enhancedApi.inventory && typeof enhancedApi.inventory.getComplianceData === 'function') {
        return await enhancedApi.inventory.getComplianceData();
      }
      return defaultInventoryData;
    },
  });

  const { data: inventoryCategories = [] } = useQuery({
    queryKey: ['inventory', 'categories'],
    queryFn: async (): Promise<InventoryCategory[]> => {
      if (enhancedApi.inventory && typeof enhancedApi.inventory.getCategories === 'function') {
        return await enhancedApi.inventory.getCategories();
      }
      return [];
    },
  });

  const { data: complianceAlerts = [] } = useQuery({
    queryKey: ['inventory', 'alerts'],
    queryFn: async (): Promise<ComplianceAlert[]> => {
      if (enhancedApi.inventory && typeof enhancedApi.inventory.getComplianceAlerts === 'function') {
        return await enhancedApi.inventory.getComplianceAlerts();
      }
      return [];
    },
  });

  const { data: recentInspections = [] } = useQuery({
    queryKey: ['inventory', 'inspections'],
    queryFn: async (): Promise<Inspection[]> => {
      if (enhancedApi.inventory && typeof enhancedApi.inventory.getRecentInspections === 'function') {
        return await enhancedApi.inventory.getRecentInspections();
      }
      return [];
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            <Heading level={3} className="font-bold text-blue-600">
              {inventoryData.totalItems}
            </Heading>
            <Text variant="small" className="text-gray-600">
              Total Items
            </Text>
          </div>

          <div className="text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
            <Heading level={3} className="font-bold text-yellow-600">
              {inventoryData.lowStock}
            </Heading>
            <Text variant="small" className="text-gray-600">
              Low Stock
            </Text>
          </div>

          <div className="text-center">
            <Shield className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <Heading level={3} className="font-bold text-green-600">
              {inventoryData.complianceRate}%
            </Heading>
            <Text variant="small" className="text-gray-600">
              Compliance Rate
            </Text>
          </div>

          <div className="text-center">
            <CheckCircle className="mx-auto h-8 w-8 text-purple-500 mb-2" />
            <Heading level={3} className="font-bold text-purple-600">
              {inventoryData.safetyScore}%
            </Heading>
            <Text variant="small" className="text-gray-600">
              Safety Score
            </Text>
          </div>
        </div>
      </Card>

      {/* Inventory Categories */}
      <Card title="Inventory by Category">
        <div className="space-y-4">
          {inventoryCategories.map((category: InventoryCategory, index: number) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <Text variant="body" className="font-medium">
                  {category.name}
                </Text>
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className={category.compliance >= 95 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {category.compliance}%
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <Text variant="small" className="font-medium text-blue-600">
                    {category.total}
                  </Text>
                  <Text variant="small" className="text-gray-500">
                    Total Items
                  </Text>
                </div>
                <div className="text-center">
                  <Text variant="small" className="font-medium text-yellow-600">
                    {category.lowStock}
                  </Text>
                  <Text variant="small" className="text-gray-500">
                    Low Stock
                  </Text>
                </div>
                <div className="text-center">
                  <Text variant="small" className="font-medium text-red-600">
                    {category.outOfStock}
                  </Text>
                  <Text variant="small" className="text-gray-500">
                    Out of Stock
                  </Text>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${category.compliance >= 95 ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${category.compliance}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 text-center">
                {category.compliance}%
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Compliance Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Compliance Alerts">
          <div className="space-y-4">
            {complianceAlerts.map((alert: ComplianceAlert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <Text variant="body" className="font-medium">
                      {alert.item}
                    </Text>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <Text variant="small" className="text-gray-600 mb-1">
                    {alert.message}
                  </Text>
                  <div className="flex items-center justify-between">
                    <Text variant="small" className="text-gray-500">
                      {new Date(alert.date).toLocaleDateString()}
                    </Text>
                    <Badge variant="default" className={getSeverityColor(alert.severity)}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Inspections">
          <div className="space-y-4">
            {recentInspections.map((inspection: Inspection) => (
              <div key={inspection.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Text variant="body" className="font-medium">
                      {inspection.inspector}
                    </Text>
                    <Text variant="small" className="text-gray-500">
                      {new Date(inspection.date).toLocaleDateString()}
                    </Text>
                  </div>
                  <div className="text-right">
                    <Heading level={4} className="font-bold text-green-600">
                      {inspection.score}%
                    </Heading>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <Text variant="small" className="text-gray-600">
                  {inspection.notes}
                </Text>
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
            <Heading level={3} className="font-bold text-green-600">
              {inventoryData.complianceRate}%
            </Heading>
            <Text variant="small" className="text-gray-600">
              Overall Compliance
            </Text>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${inventoryData.complianceRate}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 text-center mt-1">
              {inventoryData.complianceRate}%
            </div>
          </div>

          <div className="text-center">
            <CheckCircle className="mx-auto h-8 w-8 text-blue-500 mb-2" />
            <Heading level={3} className="font-bold text-blue-600">
              {inventoryData.safetyScore}%
            </Heading>
            <Text variant="small" className="text-gray-600">
              Safety Score
            </Text>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${inventoryData.safetyScore}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 text-center mt-1">
              {inventoryData.safetyScore}%
            </div>
          </div>

          <div className="text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-orange-500 mb-2" />
            <Heading level={3} className="font-bold text-orange-600">
              {inventoryData.expiringSoon}
            </Heading>
            <Text variant="small" className="text-gray-600">
              Items Expiring Soon
            </Text>
            <Text variant="small" className="text-gray-500">
              Requires immediate attention
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InventoryCompliancePanel;

