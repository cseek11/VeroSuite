#!/usr/bin/env node
"use strict";
/**
 * TypeScript Error Analysis Script
 * Analyzes all TypeScript errors and generates a comprehensive report
 *
 * Usage: npx ts-node scripts/analyze-ts-errors.ts
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var logger_1 = require("../src/utils/logger");
// Error code to category mapping
var ERROR_CATEGORIES = {
    'TS6133': 'Unused Variables/Imports',
    'TS2322': 'Type Mismatch (Assignment)',
    'TS2345': 'Type Mismatch (Argument)',
    'TS7006': 'Implicit Any Type',
    'TS2339': 'Property Access Error',
    'TS2323': 'Export Conflict',
    'TS2484': 'Export Declaration Conflict',
    'TS1005': 'Syntax Error (Expected Token)',
    'TS1109': 'Syntax Error (Expression)',
    'TS1128': 'Syntax Error (Declaration)',
    'TS2375': 'Optional Property Type Error',
    'TS2379': 'Optional Property Assignment Error',
    'TS2503': 'Namespace Not Found',
    'TS2717': 'Property Declaration Conflict',
};
function analyzeTypeScriptErrors() {
    var _a;
    logger_1.logger.info('Running TypeScript compiler...');
    var output;
    try {
        (0, child_process_1.execSync)('npx tsc --noEmit', { encoding: 'utf-8', stdio: 'pipe' });
        logger_1.logger.info('No TypeScript errors found!');
        process.exit(0);
    }
    catch (error) {
        output = error.stdout || error.stderr || '';
    }
    logger_1.logger.info('Analyzing errors...');
    var errors = [];
    var lines = output.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var line = (_a = lines[i]) !== null && _a !== void 0 ? _a : '';
        // Match error pattern: src/file.tsx:10:5 - error TS2322: Message
        var match = line.match(/^(.+\.tsx?):(\d+):(\d+)\s+-\s+error\s+(TS\d+):\s+(.+)$/);
        if (match) {
            var file = match[1], lineStr = match[2], colStr = match[3], code = match[4], message = match[5];
            errors.push({
                file: file !== null && file !== void 0 ? file : '',
                line: parseInt(lineStr !== null && lineStr !== void 0 ? lineStr : '0'),
                column: parseInt(colStr !== null && colStr !== void 0 ? colStr : '0'),
                code: code !== null && code !== void 0 ? code : '',
                message: message !== null && message !== void 0 ? message : '',
            });
        }
    }
    // Calculate statistics
    var stats = {
        totalErrors: errors.length,
        errorsByCode: new Map(),
        errorsByFile: new Map(),
        errorsByCategory: new Map(),
        criticalFiles: [],
    };
    errors.forEach(function (error) {
        // Count by error code
        stats.errorsByCode.set(error.code, (stats.errorsByCode.get(error.code) || 0) + 1);
        // Count by file
        stats.errorsByFile.set(error.file, (stats.errorsByFile.get(error.file) || 0) + 1);
        // Count by category
        var category = ERROR_CATEGORIES[error.code] || 'Other';
        stats.errorsByCategory.set(category, (stats.errorsByCategory.get(category) || 0) + 1);
    });
    // Find critical files (10+ errors)
    stats.criticalFiles = Array.from(stats.errorsByFile.entries())
        .filter(function (_a) {
        var _ = _a[0], count = _a[1];
        return count >= 10;
    })
        .map(function (_a) {
        var file = _a[0], count = _a[1];
        return ({ file: file, count: count });
    })
        .sort(function (a, b) { return b.count - a.count; });
    return stats;
}
function generateReport(stats) {
    var report = [];
    report.push('# TypeScript Error Analysis Report\n');
    report.push("**Generated:** ".concat(new Date().toISOString(), "\n"));
    report.push("**Total Errors:** ".concat(stats.totalErrors, "\n"));
    report.push('---\n\n');
    // Errors by category
    report.push('## Errors by Category\n\n');
    report.push('| Category | Count | Percentage |\n');
    report.push('|----------|-------|------------|\n');
    var sortedCategories = Array.from(stats.errorsByCategory.entries())
        .sort(function (a, b) { return b[1] - a[1]; });
    sortedCategories.forEach(function (_a) {
        var category = _a[0], count = _a[1];
        var percentage = ((count / stats.totalErrors) * 100).toFixed(1);
        report.push("| ".concat(category, " | ").concat(count, " | ").concat(percentage, "% |\n"));
    });
    report.push('\n---\n\n');
    // Errors by code
    report.push('## Errors by Error Code\n\n');
    report.push('| Error Code | Category | Count |\n');
    report.push('|------------|----------|-------|\n');
    var sortedCodes = Array.from(stats.errorsByCode.entries())
        .sort(function (a, b) { return b[1] - a[1]; })
        .slice(0, 20);
    sortedCodes.forEach(function (_a) {
        var code = _a[0], count = _a[1];
        var category = ERROR_CATEGORIES[code] || 'Other';
        report.push("| ".concat(code, " | ").concat(category, " | ").concat(count, " |\n"));
    });
    report.push('\n---\n\n');
    // Critical files
    report.push('## Critical Files (10+ errors)\n\n');
    report.push('| File | Error Count |\n');
    report.push('|------|-------------|\n');
    stats.criticalFiles.slice(0, 30).forEach(function (_a) {
        var file = _a.file, count = _a.count;
        var shortPath = file.replace(/^src\//, '');
        report.push("| ".concat(shortPath, " | ").concat(count, " |\n"));
    });
    report.push('\n---\n\n');
    // Recommendations
    report.push('## Quick Win Opportunities\n\n');
    var unusedCount = stats.errorsByCategory.get('Unused Variables/Imports') || 0;
    var syntaxCount = (stats.errorsByCategory.get('Syntax Error (Expected Token)') || 0) +
        (stats.errorsByCategory.get('Syntax Error (Expression)') || 0) +
        (stats.errorsByCategory.get('Syntax Error (Declaration)') || 0);
    report.push('### Quick Wins (Auto-fixable)\n\n');
    report.push("1. **Unused Variables/Imports:** ".concat(unusedCount, " errors\n"));
    report.push('   - Run: `npx eslint src --ext .ts,.tsx --fix`\n');
    report.push('   - Estimated time: 30 minutes\n\n');
    report.push("2. **Syntax Errors:** ".concat(syntaxCount, " errors\n"));
    report.push('   - Manual fixes needed\n');
    report.push('   - Estimated time: 2-3 hours\n\n');
    return report.join('');
}
function main() {
    try {
        var stats = analyzeTypeScriptErrors();
        var report = generateReport(stats);
        // Write to file
        var outputPath = path.join(__dirname, '../docs/TS_ERROR_ANALYSIS.md');
        var outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync(outputPath, report);
        logger_1.logger.info('Analysis complete!', {
            reportPath: outputPath,
            totalErrors: stats.totalErrors,
            filesAffected: stats.errorsByFile.size,
            criticalFiles: stats.criticalFiles.length
        });
    }
    catch (error) {
        logger_1.logger.error('Error during analysis', {
            error: error instanceof Error ? error.message : String(error)
        });
        process.exit(1);
    }
}
main();
