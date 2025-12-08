import React, { useState } from 'react';
import { Save, X, Eye } from 'lucide-react';
import { enhancedApi } from '@/lib/enhanced-api';

interface WidgetBuilderProps {
  onClose?: () => void;
  onSave?: () => void;
}

export const WidgetBuilder: React.FC<WidgetBuilderProps> = ({ onClose, onSave }) => {
  const [widgetName, setWidgetName] = useState('');
  const [widgetId, setWidgetId] = useState('');
  const [widgetVersion, setWidgetVersion] = useState('1.0.0');
  const [widgetCode, setWidgetCode] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSave = async () => {
    try {
      // Validate widget
      if (!widgetName || !widgetId || !widgetCode) {
        alert('Please fill in all required fields');
        return;
      }

      // Register widget
      await enhancedApi.dashboardLayouts.registerWidget({
        widget_id: widgetId,
        name: widgetName,
        version: widgetVersion,
        code: widgetCode,
        is_public: isPublic
      });

      alert('Widget registered successfully! It will be reviewed by an administrator.');
      onSave?.();
      onClose?.();
    } catch (error) {
      console.error('Failed to register widget:', error);
      alert('Failed to register widget. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Widget Builder</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          )}
        </div>
      </div>

      {!previewMode ? (
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Widget Name *
              </label>
              <input
                type="text"
                value={widgetName}
                onChange={(e) => setWidgetName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="My Custom Widget"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Widget ID *
              </label>
              <input
                type="text"
                value={widgetId}
                onChange={(e) => setWidgetId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="my-custom-widget"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Version *
              </label>
              <input
                type="text"
                value={widgetVersion}
                onChange={(e) => setWidgetVersion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="1.0.0"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Make widget public</span>
              </label>
            </div>
          </div>

          {/* Code Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Widget Code (React Component) *
            </label>
            <textarea
              value={widgetCode}
              onChange={(e) => setWidgetCode(e.target.value)}
              className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="export default function MyWidget(props) {&#10;  return (&#10;    <div>Hello World</div>&#10;  );&#10;}"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Register Widget
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="bg-white rounded-md p-4 min-h-[200px]">
            {widgetCode ? (
              <div className="text-sm text-gray-600">
                Preview would render the widget code here. In production, this would use a sandboxed iframe.
              </div>
            ) : (
              <div className="text-sm text-gray-400">Enter widget code to see preview</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};




