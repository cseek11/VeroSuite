import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AgreementForm } from '@/components/agreements/AgreementForm';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CreateAgreementPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigate back to agreements list
    navigate('/agreements');
  };

  const handleCancel = () => {
    navigate('/agreements');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/agreements')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Agreements
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Agreement</h1>
            <p className="text-sm text-gray-600">Create a new service agreement for a customer</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <AgreementForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
