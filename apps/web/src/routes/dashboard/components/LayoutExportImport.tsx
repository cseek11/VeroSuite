import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { DashboardRegion } from '@/routes/dashboard/types/region.types';

interface LayoutExportImportProps {
  layoutId: string;
  regions: DashboardRegion[];
  onImport?: (regions: DashboardRegion[]) => void;
}

export const LayoutExportImport: React.FC<LayoutExportImportProps> = ({
  layoutId,
  regions,
  onImport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const layoutData = {
      layoutId,
      regions,
      version: '1.0',
      exportedAt: new Date().toISOString(),
      metadata: {
        regionCount: regions.length,
        regionTypes: [...new Set(regions.map(r => r.region_type))]
      }
    };

    const blob = new Blob([JSON.stringify(layoutData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-layout-${layoutId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const layoutData = JSON.parse(e.target?.result as string);
        
        if (layoutData.regions && Array.isArray(layoutData.regions)) {
          // Validate imported regions
          const validRegions = layoutData.regions.filter((r: any) => 
            r.id && r.region_type && typeof r.grid_row === 'number' && typeof r.grid_col === 'number'
          );

          if (validRegions.length > 0) {
            onImport?.(validRegions);
          } else {
            alert('Invalid layout file: No valid regions found');
          }
        } else {
          alert('Invalid layout file: Missing regions array');
        }
      } catch (error) {
        console.error('Failed to import layout:', error);
        alert('Failed to import layout: Invalid JSON file');
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        title="Export layout to JSON file"
      >
        <Download className="w-4 h-4" />
        Export
      </button>
      
      <label className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors cursor-pointer">
        <Upload className="w-4 h-4" />
        Import
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
};




