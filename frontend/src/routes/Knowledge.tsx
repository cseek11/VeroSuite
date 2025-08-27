import React from 'react';
import { Card, Typography } from '@/components/ui/EnhancedUI';

const KnowledgePage: React.FC = () => {
  return (
    <div className="p-6">
      <Card className="p-6 bg-white">
        <Typography variant="h1" className="text-2xl font-bold text-gray-900 mb-6">
          Knowledge Base
        </Typography>
        <div className="text-center py-12">
          <Typography variant="body1" className="text-gray-600">
            Knowledge base module coming soon...
          </Typography>
        </div>
      </Card>
    </div>
  );
};

export default KnowledgePage;
