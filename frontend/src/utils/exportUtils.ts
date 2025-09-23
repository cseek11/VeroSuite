import { DrillDownLevel } from '@/hooks/useDrillDown';

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includeFilters?: boolean;
  includeMetadata?: boolean;
  filename?: string;
}

export interface ExportData {
  title: string;
  level: DrillDownLevel;
  data: any[];
  filters?: Record<string, any>;
  metadata?: {
    exportedAt: string;
    exportedBy: string;
    totalRecords: number;
    filteredRecords: number;
  };
}

// Export to CSV
export function exportToCSV(exportData: ExportData, options: ExportOptions = { format: 'csv' }) {
  const { data, title, level, filters, metadata } = exportData;
  
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // Get headers from first row
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = '';
  
  // Add title
  if (options.includeMetadata) {
    csvContent += `"${title}"\n`;
    csvContent += `"Exported: ${metadata?.exportedAt || new Date().toISOString()}"\n`;
    csvContent += `"Level: ${level.name}"\n`;
    csvContent += `"Records: ${metadata?.filteredRecords || data.length} of ${metadata?.totalRecords || data.length}"\n`;
    csvContent += '\n';
  }
  
  // Add filters info
  if (options.includeFilters && filters) {
    csvContent += '"Applied Filters"\n';
    Object.entries(filters).forEach(([key, value]) => {
      csvContent += `"${key}: ${value}"\n`;
    });
    csvContent += '\n';
  }
  
  // Add headers
  csvContent += headers.map(header => `"${header}"`).join(',') + '\n';
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes
      return `"${String(value || '').replace(/"/g, '""')}"`;
    });
    csvContent += values.join(',') + '\n';
  });
  
  // Download file
  downloadFile(csvContent, `${options.filename || title}.csv`, 'text/csv');
}

// Export to Excel (using a simple approach - in production, use a library like xlsx)
export function exportToExcel(exportData: ExportData, options: ExportOptions = { format: 'excel' }) {
  const { data, title, level, filters, metadata } = exportData;
  
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // For now, we'll create a CSV with .xlsx extension
  // In a real implementation, you'd use a library like 'xlsx'
  exportToCSV(exportData, { ...options, format: 'csv' });
  
  // Rename the downloaded file to .xlsx
  setTimeout(() => {
    const link = document.createElement('a');
    link.download = `${options.filename || title}.xlsx`;
    link.href = URL.createObjectURL(new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    link.click();
  }, 100);
}

// Export to PDF
export function exportToPDF(exportData: ExportData, options: ExportOptions = { format: 'pdf' }) {
  const { data, title, level, filters, metadata } = exportData;
  
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // Create HTML content for PDF
  const htmlContent = generatePDFHTML(exportData, options);
  
  // For now, we'll create a simple HTML file that can be printed to PDF
  // In a real implementation, you'd use a library like 'jspdf' or 'puppeteer'
  downloadFile(htmlContent, `${options.filename || title}.html`, 'text/html');
}

// Generate HTML content for PDF
function generatePDFHTML(exportData: ExportData, options: ExportOptions): string {
  const { data, title, level, filters, metadata } = exportData;
  
  const headers = Object.keys(data[0]);
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .metadata { font-size: 12px; color: #666; margin-bottom: 20px; }
        .filters { margin-bottom: 20px; }
        .filters h3 { font-size: 16px; margin-bottom: 10px; }
        .filter-item { margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { margin-top: 30px; font-size: 10px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${title}</div>
        ${options.includeMetadata ? `
          <div class="metadata">
            <div>Exported: ${metadata?.exportedAt || new Date().toISOString()}</div>
            <div>Level: ${level.name}</div>
            <div>Records: ${metadata?.filteredRecords || data.length} of ${metadata?.totalRecords || data.length}</div>
          </div>
        ` : ''}
      </div>
      
      ${options.includeFilters && filters ? `
        <div class="filters">
          <h3>Applied Filters</h3>
          ${Object.entries(filters).map(([key, value]) => 
            `<div class="filter-item"><strong>${key}:</strong> ${value}</div>`
          ).join('')}
        </div>
      ` : ''}
      
      <table>
        <thead>
          <tr>
            ${headers.map(header => `<th>${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <div>Generated by VeroCardsV2 Dashboard</div>
      </div>
    </body>
    </html>
  `;
  
  return html;
}

// Download file utility
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

// Chart export utilities
export interface ChartExportOptions {
  format: 'png' | 'svg' | 'jpg';
  width?: number;
  height?: number;
  quality?: number;
}

export function exportChartToImage(canvas: HTMLCanvasElement, options: ChartExportOptions = { format: 'png' }) {
  const { format, width, height, quality = 0.9 } = options;
  
  // Resize canvas if needed
  if (width || height) {
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    
    const newWidth = width || originalWidth;
    const newHeight = height || originalHeight;
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (tempCtx) {
      tempCanvas.width = newWidth;
      tempCanvas.height = newHeight;
      tempCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
      
      return exportCanvasToImage(tempCanvas, format, quality);
    }
  }
  
  return exportCanvasToImage(canvas, format, quality);
}

function exportCanvasToImage(canvas: HTMLCanvasElement, format: string, quality: number) {
  const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;
  const dataURL = canvas.toDataURL(mimeType, quality);
  
  const link = document.createElement('a');
  link.download = `chart.${format}`;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Batch export multiple datasets
export function exportBatch(exportDatas: ExportData[], options: ExportOptions) {
  if (exportDatas.length === 0) {
    throw new Error('No data to export');
  }
  
  if (exportDatas.length === 1) {
    // Single export
    switch (options.format) {
      case 'csv':
        exportToCSV(exportDatas[0], options);
        break;
      case 'excel':
        exportToExcel(exportDatas[0], options);
        break;
      case 'pdf':
        exportToPDF(exportDatas[0], options);
        break;
    }
    return;
  }
  
  // Multiple exports - create a zip file (would need a library like JSZip)
  console.log('Batch export not yet implemented - exporting individually');
  
  exportDatas.forEach((exportData, index) => {
    setTimeout(() => {
      switch (options.format) {
        case 'csv':
          exportToCSV(exportData, { ...options, filename: `${exportData.title}_${index + 1}` });
          break;
        case 'excel':
          exportToExcel(exportData, { ...options, filename: `${exportData.title}_${index + 1}` });
          break;
        case 'pdf':
          exportToPDF(exportData, { ...options, filename: `${exportData.title}_${index + 1}` });
          break;
      }
    }, index * 500); // Stagger exports
  });
}
