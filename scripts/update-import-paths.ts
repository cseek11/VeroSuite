/**
 * Update Import Paths Script
 * 
 * Updates all import paths that reference backend/ to use new monorepo paths.
 * 
 * ⚠️ CRITICAL: Run this AFTER migrate-backend-to-apps-api.ts
 * 
 * Usage:
 *   npx ts-node scripts/update-import-paths.ts [--dry-run] [--path=<directory>]
 * 
 * Options:
 *   --dry-run: Show what would be changed without making changes
 *   --path: Specific directory to update (default: apps/api)
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const DRY_RUN = process.argv.includes('--dry-run');
const TARGET_PATH = process.argv.find(arg => arg.startsWith('--path='))?.split('=')[1] || 'apps/api';
// Get root directory
const ROOT_DIR = path.resolve(process.cwd());

interface ImportUpdate {
  file: string;
  line: number;
  oldImport: string;
  newImport: string;
}

const updates: ImportUpdate[] = [];

function log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
  const prefix = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
  }[type];
  
  console.log(`${prefix} ${message}`);
}

function updateImportsInFile(filePath: string): number {
  if (!fs.existsSync(filePath)) {
    return 0;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let modified = false;
  let updateCount = 0;
  
  const newLines = lines.map((line, index) => {
    // Match import/require statements
    const importPatterns = [
      // ES6 imports
      /(import\s+.*?\s+from\s+['"])(\.\.\/)*backend\/(.*?)(['"])/g,
      /(import\s+['"])(\.\.\/)*backend\/(.*?)(['"])/g,
      // require statements
      /(require\(['"])(\.\.\/)*backend\/(.*?)(['"])\)/g,
      // Dynamic imports
      /(import\(['"])(\.\.\/)*backend\/(.*?)(['"])\)/g,
    ];
    
    let newLine = line;
    
    for (const pattern of importPatterns) {
      const matches = [...line.matchAll(pattern)];
      
      for (const match of matches) {
        const fullMatch = match[0];
        const prefix = match[1];
        const relativePath = match[2] || '';
        const rest = match[3];
        const suffix = match[4];
        
        // Determine new path
        let newPath = '';
        
        if (rest.startsWith('prisma/')) {
          // Prisma imports → libs/common/prisma/
          newPath = `${relativePath}../../libs/common/${rest}`;
        } else if (rest.startsWith('src/')) {
          // Source imports → apps/api/src/
          newPath = `${relativePath}${rest}`;
        } else {
          // Other backend/ imports → apps/api/
          newPath = `${relativePath}apps/api/${rest}`;
        }
        
        const newImport = `${prefix}${newPath}${suffix}`;
        newLine = newLine.replace(fullMatch, newImport);
        
        updates.push({
          file: filePath,
          line: index + 1,
          oldImport: fullMatch,
          newImport: newImport,
        });
        
        modified = true;
        updateCount++;
      }
    }
    
    return newLine;
  });
  
  if (modified && !DRY_RUN) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
  }
  
  return updateCount;
}

function processDirectory(dirPath: string): number {
  let totalUpdates = 0;
  
  if (!fs.existsSync(dirPath)) {
    log(`Directory not found: ${dirPath}`, 'warning');
    return 0;
  }
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    // Skip node_modules, dist, coverage, etc.
    if (entry.name === 'node_modules' || 
        entry.name === 'dist' || 
        entry.name === 'coverage' ||
        entry.name === '.git') {
      continue;
    }
    
    if (entry.isDirectory()) {
      totalUpdates += processDirectory(fullPath);
    } else if (entry.name.endsWith('.ts') || 
               entry.name.endsWith('.tsx') || 
               entry.name.endsWith('.js') ||
               entry.name.endsWith('.jsx') ||
               entry.name.endsWith('.json')) {
      const updates = updateImportsInFile(fullPath);
      if (updates > 0) {
        log(`Updated ${updates} imports in: ${path.relative(ROOT_DIR, fullPath)}`, 'success');
        totalUpdates += updates;
      }
    }
  }
  
  return totalUpdates;
}

async function main() {
  console.log('🔍 Starting import path updates...\n');
  
  if (DRY_RUN) {
    log('DRY RUN MODE - No files will be modified', 'warning');
    console.log('');
  }
  
  const targetDir = path.join(ROOT_DIR, TARGET_PATH);
  
  if (!fs.existsSync(targetDir)) {
    log(`ERROR: Target directory not found: ${TARGET_PATH}`, 'error');
    process.exit(1);
  }
  
  log(`Processing directory: ${TARGET_PATH}`, 'info');
  console.log('');
  
  const totalUpdates = processDirectory(targetDir);
  
  // Summary
  console.log('');
  console.log('='.repeat(60));
  log('Update Summary', 'info');
  console.log('='.repeat(60));
  log(`Total imports updated: ${totalUpdates}`, 'success');
  log(`Files modified: ${updates.length > 0 ? new Set(updates.map(u => u.file)).size : 0}`, 'info');
  
  if (DRY_RUN && updates.length > 0) {
    console.log('');
    log('Sample changes (first 10):', 'info');
    updates.slice(0, 10).forEach(update => {
      console.log(`  ${path.relative(ROOT_DIR, update.file)}:${update.line}`);
      console.log(`    - ${update.oldImport}`);
      console.log(`    + ${update.newImport}`);
    });
    
    if (updates.length > 10) {
      log(`  ... and ${updates.length - 10} more`, 'info');
    }
  }
  
  if (DRY_RUN) {
    console.log('');
    log('This was a DRY RUN. No files were modified.', 'warning');
    log('Run without --dry-run to apply changes.', 'info');
  } else {
    console.log('');
    log('Import path updates complete!', 'success');
    log('Next steps:', 'info');
    log('1. Review changes with git diff', 'info');
    log('2. Run tests to verify', 'info');
    log('3. Check for any remaining backend/ references', 'info');
  }
}

main().catch((error) => {
  log(`Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
  process.exit(1);
});

