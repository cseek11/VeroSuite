#!/usr/bin/env node
/**
 * TypeScript Error Analysis Script
 * Analyzes all TypeScript errors and generates a comprehensive report
 * 
 * Usage: npx ts-node scripts/analyze-ts-errors.ts
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface ErrorEntry {
  file: string;
  line: number;
  column: number;
  code: string;
  message: string;
}

interface ErrorStats {
  totalErrors: number;
  errorsByCode: Map<string, number>;
  errorsByFile: Map<string, number>;
  errorsByCategory: Map<string, number>;
  criticalFiles: Array<{ file: string; count: number }>;
}

// Error code to category mapping
const ERROR_CATEGORIES: Record<string, string> = {
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

function analyzeTypeScriptErrors(): ErrorStats {
  console.log('Running TypeScript compiler...\n');
  
  let output: string;
  try {
    execSync('npx tsc --noEmit', { encoding: 'utf-8', stdio: 'pipe' });
    console.log('No TypeScript errors found!');
    process.exit(0);
  } catch (error: any) {
    output = error.stdout || error.stderr || '';
  }

  console.log('Analyzing errors...\n');

  const errors: ErrorEntry[] = [];
  const lines = output.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match error pattern: src/file.tsx:10:5 - error TS2322: Message
    const match = line.match(/^(.+\.tsx?):(\d+):(\d+)\s+-\s+error\s+(TS\d+):\s+(.+)$/);
    
    if (match) {
      errors.push({
        file: match[1],
        line: parseInt(match[2]),
        column: parseInt(match[3]),
        code: match[4],
        message: match[5],
      });
    }
  }

  // Calculate statistics
  const stats: ErrorStats = {
    totalErrors: errors.length,
    errorsByCode: new Map(),
    errorsByFile: new Map(),
    errorsByCategory: new Map(),
    criticalFiles: [],
  };

  errors.forEach(error => {
    // Count by error code
    stats.errorsByCode.set(error.code, (stats.errorsByCode.get(error.code) || 0) + 1);
    
    // Count by file
    stats.errorsByFile.set(error.file, (stats.errorsByFile.get(error.file) || 0) + 1);
    
    // Count by category
    const category = ERROR_CATEGORIES[error.code] || 'Other';
    stats.errorsByCategory.set(category, (stats.errorsByCategory.get(category) || 0) + 1);
  });

  // Find critical files (10+ errors)
  stats.criticalFiles = Array.from(stats.errorsByFile.entries())
    .filter(([_, count]) => count >= 10)
    .map(([file, count]) => ({ file, count }))
    .sort((a, b) => b.count - a.count);

  return stats;
}

function generateReport(stats: ErrorStats): string {
  const report: string[] = [];
  
  report.push('# TypeScript Error Analysis Report\n');
  report.push(`**Generated:** ${new Date().toISOString()}\n`);
  report.push(`**Total Errors:** ${stats.totalErrors}\n`);
  report.push('---\n\n');

  // Errors by category
  report.push('## Errors by Category\n\n');
  report.push('| Category | Count | Percentage |\n');
  report.push('|----------|-------|------------|\n');
  
  const sortedCategories = Array.from(stats.errorsByCategory.entries())
    .sort((a, b) => b[1] - a[1]);
  
  sortedCategories.forEach(([category, count]) => {
    const percentage = ((count / stats.totalErrors) * 100).toFixed(1);
    report.push(`| ${category} | ${count} | ${percentage}% |\n`);
  });
  
  report.push('\n---\n\n');

  // Errors by code
  report.push('## Errors by Error Code\n\n');
  report.push('| Error Code | Category | Count |\n');
  report.push('|------------|----------|-------|\n');
  
  const sortedCodes = Array.from(stats.errorsByCode.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
  
  sortedCodes.forEach(([code, count]) => {
    const category = ERROR_CATEGORIES[code] || 'Other';
    report.push(`| ${code} | ${category} | ${count} |\n`);
  });
  
  report.push('\n---\n\n');

  // Critical files
  report.push('## Critical Files (10+ errors)\n\n');
  report.push('| File | Error Count |\n');
  report.push('|------|-------------|\n');
  
  stats.criticalFiles.slice(0, 30).forEach(({ file, count }) => {
    const shortPath = file.replace(/^src\//, '');
    report.push(`| ${shortPath} | ${count} |\n`);
  });
  
  report.push('\n---\n\n');

  // Recommendations
  report.push('## Quick Win Opportunities\n\n');
  
  const unusedCount = stats.errorsByCategory.get('Unused Variables/Imports') || 0;
  const syntaxCount = (stats.errorsByCategory.get('Syntax Error (Expected Token)') || 0) +
                     (stats.errorsByCategory.get('Syntax Error (Expression)') || 0) +
                     (stats.errorsByCategory.get('Syntax Error (Declaration)') || 0);
  
  report.push('### Quick Wins (Auto-fixable)\n\n');
  report.push(`1. **Unused Variables/Imports:** ${unusedCount} errors\n`);
  report.push('   - Run: `npx eslint src --ext .ts,.tsx --fix`\n');
  report.push('   - Estimated time: 30 minutes\n\n');
  
  report.push(`2. **Syntax Errors:** ${syntaxCount} errors\n`);
  report.push('   - Manual fixes needed\n');
  report.push('   - Estimated time: 2-3 hours\n\n');

  return report.join('');
}

function main() {
  try {
    const stats = analyzeTypeScriptErrors();
    const report = generateReport(stats);
    
    // Write to file
    const outputPath = path.join(__dirname, '../docs/TS_ERROR_ANALYSIS.md');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, report);
    
    console.log(`\n✅ Analysis complete!`);
    console.log(`📊 Report saved to: ${outputPath}\n`);
    console.log(`Summary:`);
    console.log(`  Total errors: ${stats.totalErrors}`);
    console.log(`  Files affected: ${stats.errorsByFile.size}`);
    console.log(`  Critical files (10+ errors): ${stats.criticalFiles.length}\n`);
    
  } catch (error) {
    console.error('Error during analysis:', error);
    process.exit(1);
  }
}

main();


