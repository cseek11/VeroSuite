#!/usr/bin/env ts-node

/**
 * Comprehensive observability audit script
 * 
 * Usage: ts-node scripts/audit-observability.ts [path]
 * 
 * Reports:
 * - Missing logs
 * - Missing trace IDs
 * - Missing error handling
 * - Silent failures
 * - Compliance report
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  detectAllSilentFailures,
  SilentFailureDetection,
} from '../backend/src/common/utils/error-pattern-detector.util';

interface AuditResult {
  file: string;
  issues: {
    missingLogs: number;
    missingTraceIds: number;
    missingErrorHandling: number;
    silentFailures: SilentFailureDetection[];
  };
}

const DEFAULT_SCAN_PATHS = ['backend/src', 'frontend/src', 'apps'];

const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  '*.test.ts',
  '*.test.tsx',
  '*.spec.ts',
  '*.spec.tsx',
];

const INCLUDE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

/**
 * Check if file should be excluded
 */
function shouldExcludeFile(filePath: string): boolean {
  return EXCLUDE_PATTERNS.some((pattern) => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(filePath);
    }
    return filePath.includes(pattern);
  });
}

/**
 * Check if file should be included
 */
function shouldIncludeFile(filePath: string): boolean {
  return INCLUDE_EXTENSIONS.some((ext) => filePath.endsWith(ext));
}

/**
 * Audit file for observability compliance
 */
function auditFile(filePath: string, code: string): AuditResult['issues'] {
  const silentFailures = detectAllSilentFailures(code, filePath);

  // Check for missing logs (simplified - would need AST parsing for full accuracy)
  const hasLoggerImport = /import.*logger|from.*logger/.test(code);
  const hasLogCalls = /logger\.(log|info|warn|error|debug)/.test(code);
  const missingLogs = hasLoggerImport && !hasLogCalls ? 1 : 0;

  // Check for missing trace IDs (simplified)
  const hasTraceId = /traceId|trace-id|x-trace-id/.test(code);
  const missingTraceIds = hasLogCalls && !hasTraceId ? 1 : 0;

  // Check for missing error handling (simplified)
  const hasTryCatch = /try\s*\{/.test(code);
  const hasErrorHandling = /catch\s*\(/.test(code);
  const missingErrorHandling = hasTryCatch && !hasErrorHandling ? 1 : 0;

  return {
    missingLogs,
    missingTraceIds,
    missingErrorHandling,
    silentFailures,
  };
}

/**
 * Recursively scan directory for files
 */
function scanDirectory(
  dirPath: string,
  results: AuditResult[]
): void {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory does not exist: ${dirPath}`);
    return;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (shouldExcludeFile(fullPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      scanDirectory(fullPath, results);
    } else if (entry.isFile() && shouldIncludeFile(fullPath)) {
      try {
        const code = fs.readFileSync(fullPath, 'utf-8');
        const issues = auditFile(fullPath, code);

        // Only add to results if there are issues
        if (
          issues.missingLogs > 0 ||
          issues.missingTraceIds > 0 ||
          issues.missingErrorHandling > 0 ||
          issues.silentFailures.length > 0
        ) {
          results.push({
            file: fullPath,
            issues,
          });
        }
      } catch (error) {
        console.error(`Error reading file ${fullPath}:`, error);
      }
    }
  }
}

/**
 * Generate compliance report
 */
function generateReport(results: AuditResult[]): string {
  if (results.length === 0) {
    return '✅ Observability audit passed. No issues found.';
  }

  let report = `\n📊 Observability Audit Report\n`;
  report += `═══════════════════════════════════════════════════════════\n\n`;
  report += `Found ${results.length} file(s) with observability issues:\n\n`;

  let totalMissingLogs = 0;
  let totalMissingTraceIds = 0;
  let totalMissingErrorHandling = 0;
  let totalSilentFailures = 0;

  results.forEach((result) => {
    report += `File: ${result.file}\n`;
    
    if (result.issues.missingLogs > 0) {
      report += `  ❌ Missing logs: ${result.issues.missingLogs}\n`;
      totalMissingLogs += result.issues.missingLogs;
    }
    
    if (result.issues.missingTraceIds > 0) {
      report += `  ❌ Missing trace IDs: ${result.issues.missingTraceIds}\n`;
      totalMissingTraceIds += result.issues.missingTraceIds;
    }
    
    if (result.issues.missingErrorHandling > 0) {
      report += `  ❌ Missing error handling: ${result.issues.missingErrorHandling}\n`;
      totalMissingErrorHandling += result.issues.missingErrorHandling;
    }
    
    if (result.issues.silentFailures.length > 0) {
      report += `  ❌ Silent failures: ${result.issues.silentFailures.length}\n`;
      result.issues.silentFailures.forEach((failure) => {
        report += `    - Line ${failure.line}: ${failure.type}\n`;
        report += `      ${failure.suggestion}\n`;
      });
      totalSilentFailures += result.issues.silentFailures.length;
    }
    
    report += `\n`;
  });

  report += `\nSummary:\n`;
  report += `  - Missing logs: ${totalMissingLogs}\n`;
  report += `  - Missing trace IDs: ${totalMissingTraceIds}\n`;
  report += `  - Missing error handling: ${totalMissingErrorHandling}\n`;
  report += `  - Silent failures: ${totalSilentFailures}\n`;
  report += `  - Total issues: ${totalMissingLogs + totalMissingTraceIds + totalMissingErrorHandling + totalSilentFailures}\n`;

  return report;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const scanPaths = args.length > 0 ? args : DEFAULT_SCAN_PATHS;

  console.log('Running observability audit...\n');
  console.log(`Scan paths: ${scanPaths.join(', ')}\n`);

  const results: AuditResult[] = [];

  scanPaths.forEach((scanPath) => {
    const fullPath = path.resolve(scanPath);
    if (fs.existsSync(fullPath)) {
      scanDirectory(fullPath, results);
    } else {
      console.warn(`Path does not exist: ${fullPath}`);
    }
  });

  const report = generateReport(results);
  console.log(report);

  // Exit with error code if issues found
  if (results.length > 0) {
    console.log(`\n❌ Observability audit failed. Please fix issues before committing.`);
    process.exit(1);
  } else {
    console.log(`\n✅ Observability audit passed.`);
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main };

