"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToCSV = exportToCSV;
exports.exportToExcel = exportToExcel;
exports.exportToPDF = exportToPDF;
exports.exportChartToImage = exportChartToImage;
exports.exportBatch = exportBatch;
var logger_1 = require("@/utils/logger");
// Export to CSV
function exportToCSV(exportData, options) {
    if (options === void 0) { options = { format: 'csv' }; }
    var data = exportData.data, title = exportData.title, level = exportData.level, metadata = exportData.metadata, filters = exportData.filters;
    if (data.length === 0) {
        throw new Error('No data to export');
    }
    // Get headers from first row
    var headers = Object.keys(data[0]);
    // Create CSV content
    var csvContent = '';
    // Add title
    if (options.includeMetadata) {
        csvContent += "\"".concat(title, "\"\n");
        csvContent += "\"Exported: ".concat((metadata === null || metadata === void 0 ? void 0 : metadata.exportedAt) || new Date().toISOString(), "\"\n");
        csvContent += "\"Level: ".concat(level.name, "\"\n");
        csvContent += "\"Records: ".concat((metadata === null || metadata === void 0 ? void 0 : metadata.filteredRecords) || data.length, " of ").concat((metadata === null || metadata === void 0 ? void 0 : metadata.totalRecords) || data.length, "\"\n");
        csvContent += '\n';
    }
    // Add filters info
    if (options.includeFilters && filters) {
        csvContent += '"Applied Filters"\n';
        Object.entries(filters).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            csvContent += "\"".concat(key, ": ").concat(value, "\"\n");
        });
        csvContent += '\n';
    }
    // Add headers
    csvContent += headers.map(function (header) { return "\"".concat(header, "\""); }).join(',') + '\n';
    // Add data rows
    data.forEach(function (row) {
        var values = headers.map(function (header) {
            var value = row[header];
            // Escape quotes and wrap in quotes
            return "\"".concat(String(value || '').replace(/"/g, '""'), "\"");
        });
        csvContent += values.join(',') + '\n';
    });
    // Download file
    downloadFile(csvContent, "".concat(options.filename || title, ".csv"), 'text/csv');
}
// Export to Excel (using a simple approach - in production, use a library like xlsx)
function exportToExcel(exportData, options) {
    if (options === void 0) { options = { format: 'excel' }; }
    var data = exportData.data, title = exportData.title;
    if (data.length === 0) {
        throw new Error('No data to export');
    }
    // For now, we'll create a CSV with .xlsx extension
    // In a real implementation, you'd use a library like 'xlsx'
    exportToCSV(exportData, __assign(__assign({}, options), { format: 'csv' }));
    // Rename the downloaded file to .xlsx
    setTimeout(function () {
        var link = document.createElement('a');
        link.download = "".concat(options.filename || title, ".xlsx");
        link.href = URL.createObjectURL(new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        link.click();
    }, 100);
}
// Export to PDF
function exportToPDF(exportData, options) {
    if (options === void 0) { options = { format: 'pdf' }; }
    var data = exportData.data, title = exportData.title;
    if (data.length === 0) {
        throw new Error('No data to export');
    }
    // Create HTML content for PDF
    var htmlContent = generatePDFHTML(exportData, options);
    // For now, we'll create a simple HTML file that can be printed to PDF
    // In a real implementation, you'd use a library like 'jspdf' or 'puppeteer'
    downloadFile(htmlContent, "".concat(options.filename || title, ".html"), 'text/html');
}
// Generate HTML content for PDF
function generatePDFHTML(exportData, options) {
    var data = exportData.data, title = exportData.title, level = exportData.level, metadata = exportData.metadata, filters = exportData.filters;
    var headers = Object.keys(data[0]);
    var html = "\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <title>".concat(title, "</title>\n      <style>\n        body { font-family: Arial, sans-serif; margin: 20px; }\n        .header { margin-bottom: 30px; }\n        .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }\n        .metadata { font-size: 12px; color: #666; margin-bottom: 20px; }\n        .filters { margin-bottom: 20px; }\n        .filters h3 { font-size: 16px; margin-bottom: 10px; }\n        .filter-item { margin-bottom: 5px; }\n        table { width: 100%; border-collapse: collapse; margin-top: 20px; }\n        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\n        th { background-color: #f2f2f2; font-weight: bold; }\n        tr:nth-child(even) { background-color: #f9f9f9; }\n        .footer { margin-top: 30px; font-size: 10px; color: #666; }\n      </style>\n    </head>\n    <body>\n      <div class=\"header\">\n        <div class=\"title\">").concat(title, "</div>\n        ").concat(options.includeMetadata ? "\n          <div class=\"metadata\">\n            <div>Exported: ".concat((metadata === null || metadata === void 0 ? void 0 : metadata.exportedAt) || new Date().toISOString(), "</div>\n            <div>Level: ").concat(level.name, "</div>\n            <div>Records: ").concat((metadata === null || metadata === void 0 ? void 0 : metadata.filteredRecords) || data.length, " of ").concat((metadata === null || metadata === void 0 ? void 0 : metadata.totalRecords) || data.length, "</div>\n          </div>\n        ") : '', "\n      </div>\n      \n      ").concat(options.includeFilters && filters ? "\n        <div class=\"filters\">\n          <h3>Applied Filters</h3>\n          ".concat(Object.entries(filters).map(function (_a) {
        var key = _a[0], value = _a[1];
        return "<div class=\"filter-item\"><strong>".concat(key, ":</strong> ").concat(value, "</div>");
    }).join(''), "\n        </div>\n      ") : '', "\n      \n      <table>\n        <thead>\n          <tr>\n            ").concat(headers.map(function (header) { return "<th>".concat(header, "</th>"); }).join(''), "\n          </tr>\n        </thead>\n        <tbody>\n          ").concat(data.map(function (row) { return "\n            <tr>\n              ".concat(headers.map(function (header) { return "<td>".concat(row[header] || '', "</td>"); }).join(''), "\n            </tr>\n          "); }).join(''), "\n        </tbody>\n      </table>\n      \n      <div class=\"footer\">\n        <div>Generated by VeroCardsV3 Dashboard</div>\n      </div>\n    </body>\n    </html>\n  ");
    return html;
}
// Download file utility
function downloadFile(content, filename, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Clean up
    URL.revokeObjectURL(url);
}
function exportChartToImage(canvas, options) {
    if (options === void 0) { options = { format: 'png' }; }
    var format = options.format, width = options.width, height = options.height, _a = options.quality, quality = _a === void 0 ? 0.9 : _a;
    // Resize canvas if needed
    if (width || height) {
        var originalWidth = canvas.width;
        var originalHeight = canvas.height;
        var newWidth = width || originalWidth;
        var newHeight = height || originalHeight;
        var tempCanvas = document.createElement('canvas');
        var tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
            tempCanvas.width = newWidth;
            tempCanvas.height = newHeight;
            tempCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
            return exportCanvasToImage(tempCanvas, format, quality);
        }
    }
    return exportCanvasToImage(canvas, format, quality);
}
function exportCanvasToImage(canvas, format, quality) {
    var mimeType = "image/".concat(format === 'jpg' ? 'jpeg' : format);
    var dataURL = canvas.toDataURL(mimeType, quality);
    var link = document.createElement('a');
    link.download = "chart.".concat(format);
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
// Batch export multiple datasets
function exportBatch(exportDatas, options) {
    if (exportDatas.length === 0) {
        throw new Error('No data to export');
    }
    if (exportDatas.length === 1) {
        // Single export
        var firstExport = exportDatas[0];
        if (!firstExport) {
            throw new Error('No export data provided');
        }
        switch (options.format) {
            case 'csv':
                exportToCSV(firstExport, options);
                break;
            case 'excel':
                exportToExcel(firstExport, options);
                break;
            case 'pdf':
                exportToPDF(firstExport, options);
                break;
        }
        return;
    }
    // Multiple exports - create a zip file (would need a library like JSZip)
    logger_1.logger.warn('Batch export not yet implemented - exporting individually', {}, 'exportUtils');
    exportDatas.forEach(function (exportData, index) {
        setTimeout(function () {
            switch (options.format) {
                case 'csv':
                    exportToCSV(exportData, __assign(__assign({}, options), { filename: "".concat(exportData.title, "_").concat(index + 1) }));
                    break;
                case 'excel':
                    exportToExcel(exportData, __assign(__assign({}, options), { filename: "".concat(exportData.title, "_").concat(index + 1) }));
                    break;
                case 'pdf':
                    exportToPDF(exportData, __assign(__assign({}, options), { filename: "".concat(exportData.title, "_").concat(index + 1) }));
                    break;
            }
        }, index * 500); // Stagger exports
    });
}
