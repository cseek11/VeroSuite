import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Edit, Calendar, AlertTriangle, Loader2 } from 'lucide-react';
import { enhancedApi } from '@/lib/enhanced-api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { toast } from 'sonner';

interface RecurringSeriesManagerProps {
  templateId: string;
  onEdit?: (templateId: string) => void;
  onClose?: () => void;
}

export const RecurringSeriesManager: React.FC<RecurringSeriesManagerProps> = ({
  templateId,
  onEdit,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const defaultGenerateUntilDate = new Date();
  defaultGenerateUntilDate.setMonth(defaultGenerateUntilDate.getMonth() + 3); // Default to 3 months ahead
  const defaultGenerateUntilParts = defaultGenerateUntilDate.toISOString().split('T');
  const defaultGenerateUntil: string =
    defaultGenerateUntilParts[0] ?? new Date().toISOString().split('T')[0] ?? '';
  const [generateUntil, setGenerateUntil] = useState<string>(defaultGenerateUntil);

  // Fetch template
  const { data: template, isLoading, error } = useQuery({
    queryKey: ['recurringTemplate', templateId],
    queryFn: () => enhancedApi.jobs.recurring.get(templateId),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (deleteAllJobs: boolean) =>
      enhancedApi.jobs.recurring.delete(templateId, deleteAllJobs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringTemplates'] });
      toast.success('Recurring series deleted successfully');
      onClose?.();
    },
    onError: (error: any) => {
      toast.error('Failed to delete series', { description: error.message });
    },
  });

  // Generate jobs mutation
  const generateMutation = useMutation({
    mutationFn: () => enhancedApi.jobs.recurring.generate(templateId, generateUntil),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['recurringTemplate', templateId] });
      toast.success(
        `Generated ${result.generated} jobs${result.skipped > 0 ? `, skipped ${result.skipped} existing` : ''}`
      );
      setGenerateDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error('Failed to generate jobs', { description: error.message });
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading series details..." />;
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <p>Error loading series: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </Card>
    );
  }

  if (!template) {
    return (
      <Card className="p-4">
        <p className="text-gray-500">Series not found</p>
      </Card>
    );
  }

  const handleDelete = (deleteAllJobs: boolean) => {
    deleteMutation.mutate(deleteAllJobs);
    setDeleteDialogOpen(false);
  };

  const handleGenerate = () => {
    generateMutation.mutate();
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                template.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {template.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Pattern Details */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
          <div>
            <p className="text-xs text-gray-500">Pattern Type</p>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {template.recurrence_type}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Interval</p>
            <p className="text-sm font-medium text-gray-900">
              Every {template.recurrence_interval || 1}{' '}
              {template.recurrence_type === 'daily' && 'day(s)'}
              {template.recurrence_type === 'weekly' && 'week(s)'}
              {template.recurrence_type === 'monthly' && 'month(s)'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Start Date</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(template.start_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">End Date</p>
            <p className="text-sm font-medium text-gray-900">
              {template.end_date
                ? new Date(template.end_date).toLocaleDateString()
                : 'No end date'}
            </p>
          </div>
          {template.last_generated_date && (
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Last Generated</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(template.last_generated_date).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit?.(templateId)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Series
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setGenerateDialogOpen(true)}
            className="flex items-center gap-2"
            disabled={!template.is_active}
          >
            <Calendar className="w-4 h-4" />
            Generate Jobs
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Series
          </Button>
        </div>
      </div>

      {/* Generate Jobs Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Jobs</DialogTitle>
            <DialogDescription>
              Generate job instances from this recurring template up to the specified date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Generate Until
              </label>
              <input
                type="date"
                value={generateUntil}
                onChange={(e) => setGenerateUntil(e.target.value)}
                min={template.start_date}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <p className="text-xs text-gray-500">
              Jobs will be generated from{' '}
              {template.last_generated_date
                ? new Date(template.last_generated_date).toLocaleDateString()
                : new Date(template.start_date).toLocaleDateString()}{' '}
              until {new Date(generateUntil).toLocaleDateString()}
            </p>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Jobs'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recurring Series</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this recurring series? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                This will delete the template. You can choose to delete all generated jobs or keep
                them.
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="secondary" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleDelete(false)}
              disabled={deleteMutation.isPending}
            >
              Delete Template Only
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(true)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Template & All Jobs'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};






