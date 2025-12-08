"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutExportImport = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var LayoutExportImport = function (_a) {
    var layoutId = _a.layoutId, regions = _a.regions, onImport = _a.onImport;
    var fileInputRef = (0, react_1.useRef)(null);
    var handleExport = function () {
        var layoutData = {
            layoutId: layoutId,
            regions: regions,
            version: '1.0',
            exportedAt: new Date().toISOString(),
            metadata: {
                regionCount: regions.length,
                regionTypes: __spreadArray([], new Set(regions.map(function (r) { return r.region_type; })), true)
            }
        };
        var blob = new Blob([JSON.stringify(layoutData, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "dashboard-layout-".concat(layoutId, "-").concat(Date.now(), ".json");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    var handleImport = function (event) {
        var _a;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            try {
                var layoutData = JSON.parse((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
                if (layoutData.regions && Array.isArray(layoutData.regions)) {
                    // Validate imported regions
                    var validRegions = layoutData.regions.filter(function (r) {
                        return r.id && r.region_type && typeof r.grid_row === 'number' && typeof r.grid_col === 'number';
                    });
                    if (validRegions.length > 0) {
                        onImport === null || onImport === void 0 ? void 0 : onImport(validRegions);
                    }
                    else {
                        alert('Invalid layout file: No valid regions found');
                    }
                }
                else {
                    alert('Invalid layout file: Missing regions array');
                }
            }
            catch (error) {
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: handleExport, className: "flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors", title: "Export layout to JSON file", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4" }), "Export"] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-2 px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "w-4 h-4" }), "Import", (0, jsx_runtime_1.jsx)("input", { ref: fileInputRef, type: "file", accept: ".json", onChange: handleImport, className: "hidden" })] })] }));
};
exports.LayoutExportImport = LayoutExportImport;
