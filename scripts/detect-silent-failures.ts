#!/usr/bin/env ts-node

/**
 * CLI tool to scan codebase for silent failures
 * Usage: ts-node scripts/detect-silent-failures.ts [path]
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  detectAllSilentFailures,
  formatDetectionResults,
  SilentFailureDetection,
} from '../backend/src/common/utils/error-pattern-detector.util';

const DEFAULT_SCAN_PATHS = [
  'backend/src',
  'frontend/src',
  'apps',
];

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
 * Recursively scan directory for files
 */
function scanDirectory(dirPath: string, allDetections: SilentFailureDetection[]): void {
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
      scanDirectory(fullPath, allDetections);
    } else if (entry.isFile() && shouldIncludeFile(fullPath)) {
      try {
        const code = fs.readFileSync(fullPath, 'utf-8');
        const detections = detectAllSilentFailures(code, fullPath);
        allDetections.push(...detections);
      } catch (error) {
        console.error(`Error reading file ${fullPath}:`, error);
      }
    }
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const scanPaths = args.length > 0 ? args : DEFAULT_SCAN_PATHS;

  console.log('Scanning for silent failures...\n');
  console.log(`Scan paths: ${scanPaths.join(', ')}\n`);

  const allDetections: SilentFailureDetection[] = [];

  scanPaths.forEach((scanPath) => {
    const fullPath = path.resolve(scanPath);
    if (fs.existsSync(fullPath)) {
      scanDirectory(fullPath, allDetections);
    } else {
      console.warn(`Path does not exist: ${fullPath}`);
    }
  });

  const report = formatDetectionResults(allDetections);
  console.log(report);

  // Exit with error code if detections found
  if (allDetections.length > 0) {
    console.log(`\n❌ Found ${allDetections.length} silent failure(s). Please fix before committing.`);
    process.exit(1);
  } else {
    console.log('\n✅ No silent failures detected.');
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main };

