import React from 'react';
import { useSmartKPIs } from '@/hooks/useSmartKPIs';
import Card from '@/components/ui/Card';

const SmartKPITest: React.FC = () => {
  const smartKPIs = useSmartKPIs();

  return (
    <Card title="Smart KPIs Test">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Debug Information:</h3>
          <p>Loading: {smartKPIs.isLoading ? 'Yes' : 'No'}</p>
          <p>KPI Data Count: {smartKPIs.kpiData?.length || 0}</p>
          <p>Enhanced Metrics Count: {smartKPIs.enhancedMetrics?.length || 0}</p>
        </div>
        
        <div>
          <h3 className="font-semibold">KPI Data:</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(smartKPIs.kpiData, null, 2)}
          </pre>
        </div>
        
        <div>
          <h3 className="font-semibold">Enhanced Metrics:</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(smartKPIs.enhancedMetrics, null, 2)}
          </pre>
        </div>
      </div>
    </Card>
  );
};

export default SmartKPITest;
