/**
 * Migration Script: backend/ → apps/api/
 * 
 * This script migrates the backend directory to the new monorepo structure.
 * 
 * ⚠️ CRITICAL: Run this script on a feature branch and test thoroughly before merging.
 * 
 * Usage:
 *   npx ts-node scripts/migrate-backend-to-apps-api.ts [--dry-run]
 * 
 * Options:
 *   --dry-run: Show what would be migrated without making changes
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const DRY_RUN = process.argv.includes('--dry-run');
// Get root directory (parent of scripts/)
const ROOT_DIR = path.resolve(process.cwd());

interface MigrationTask {
  name: string;
  source: string;
  destination: string;
  type: 'copy' | 'move';
  transform?: (content: string) => string;
}

const tasks: MigrationTask[] = [
  // Source code
  {
    name: 'Move source files',
    source: 'backend/src',
    destination: 'apps/api/src',
    type: 'move',
  },
  
  // Prisma
  {
    name: 'Move Prisma schema',
    source: 'backend/prisma',
    destination: 'libs/common/prisma',
    type: 'move',
  },
  
  // Configuration files
  {
    name: 'Move nest-cli.json',
    source: 'backend/nest-cli.json',
    destination: 'apps/api/nest-cli.json',
    type: 'move',
  },
  
  {
    name: 'Move jest.config.js',
    source: 'backend/jest.config.js',
    destination: 'apps/api/jest.config.js',
    type: 'move',
    transform: (content) => {
      // Update paths in jest config
      return content
        .replace(/backend\/src/g, 'apps/api/src')
        .replace(/backend\/test/g, 'apps/api/test')
        .replace(/backend\/prisma/g, 'libs/common/prisma');
    },
  },
  
  {
    name: 'Move tsconfig.build.json',
    source: 'backend/tsconfig.build.json',
    destination: 'apps/api/tsconfig.build.json',
    type: 'move',
  },
  
  // Test files
  {
    name: 'Move test files',
    source: 'backend/test',
    destination: 'apps/api/test',
    type: 'move',
  },
  
  // Scripts
  {
    name: 'Move scripts',
    source: 'backend/scripts',
    destination: 'apps/api/scripts',
    type: 'move',
  },
  
  // Environment files
  {
    name: 'Copy env.example',
    source: 'backend/env.example',
    destination: 'apps/api/env.example',
    type: 'copy',
  },
  
  // Documentation
  {
    name: 'Move backend docs',
    source: 'backend/docs',
    destination: 'apps/api/docs',
    type: 'move',
  },
];

function log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
  const prefix = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
  }[type];
  
  console.log(`${prefix} ${message}`);
}

function copyFile(source: string, dest: string, transform?: (content: string) => string) {
  const sourcePath = path.join(ROOT_DIR, source);
  const destPath = path.join(ROOT_DIR, dest);
  
  if (!fs.existsSync(sourcePath)) {
    log(`Source not found: ${source}`, 'warning');
    return false;
  }
  
  // Create destination directory
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    if (!DRY_RUN) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    log(`Created directory: ${destDir}`, 'info');
  }
  
  if (fs.statSync(sourcePath).isDirectory()) {
    // Copy directory recursively
    if (!DRY_RUN) {
      copyDirectory(sourcePath, destPath);
    }
    log(`Would copy directory: ${source} → ${dest}`, 'info');
    return true;
  }
  
  // Copy file
  if (DRY_RUN) {
    log(`Would copy: ${source} → ${dest}`, 'info');
    if (transform) {
      log(`  Would transform content`, 'info');
    }
    return true;
  }
  
  let content = fs.readFileSync(sourcePath, 'utf8');
  if (transform) {
    content = transform(content);
  }
  fs.writeFileSync(destPath, content, 'utf8');
  log(`Copied: ${source} → ${dest}`, 'success');
  return true;
}

function copyDirectory(source: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

function moveFile(source: string, dest: string, transform?: (content: string) => string) {
  if (copyFile(source, dest, transform)) {
    if (!DRY_RUN) {
      const sourcePath = path.join(ROOT_DIR, source);
      if (fs.existsSync(sourcePath)) {
        if (fs.statSync(sourcePath).isDirectory()) {
          fs.rmSync(sourcePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(sourcePath);
        }
        log(`Removed source: ${source}`, 'info');
      }
    } else {
      log(`Would remove source: ${source}`, 'info');
    }
    return true;
  }
  return false;
}

async function main() {
  console.log('🚀 Starting backend → apps/api migration...\n');
  
  if (DRY_RUN) {
    log('DRY RUN MODE - No files will be modified', 'warning');
    console.log('');
  }
  
  // Verify prerequisites
  log('Checking prerequisites...', 'info');
  
  if (!fs.existsSync(path.join(ROOT_DIR, 'backend'))) {
    log('ERROR: backend/ directory not found', 'error');
    process.exit(1);
  }
  
  if (!fs.existsSync(path.join(ROOT_DIR, 'apps/api'))) {
    log('ERROR: apps/api/ directory not found. Create it first.', 'error');
    process.exit(1);
  }
  
  if (!fs.existsSync(path.join(ROOT_DIR, 'libs/common'))) {
    log('ERROR: libs/common/ directory not found. Create it first.', 'error');
    process.exit(1);
  }
  
  log('Prerequisites OK', 'success');
  console.log('');
  
  // Execute migration tasks
  let successCount = 0;
  let errorCount = 0;
  
  for (const task of tasks) {
    log(`Processing: ${task.name}`, 'info');
    
    try {
      const success = task.type === 'move'
        ? moveFile(task.source, task.destination, task.transform)
        : copyFile(task.source, task.destination, task.transform);
      
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    } catch (error) {
      log(`Error processing ${task.name}: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      errorCount++;
    }
    
    console.log('');
  }
  
  // Summary
  console.log('='.repeat(60));
  log('Migration Summary', 'info');
  console.log('='.repeat(60));
  log(`Total tasks: ${tasks.length}`, 'info');
  log(`Successful: ${successCount}`, 'success');
  log(`Errors: ${errorCount}`, errorCount > 0 ? 'error' : 'info');
  
  if (DRY_RUN) {
    console.log('');
    log('This was a DRY RUN. No files were modified.', 'warning');
    log('Run without --dry-run to execute the migration.', 'info');
  } else {
    console.log('');
    log('Migration complete!', 'success');
    log('Next steps:', 'info');
    log('1. Update import paths (run update-import-paths.ts)', 'info');
    log('2. Update build configurations', 'info');
    log('3. Run tests to verify', 'info');
    log('4. Update CI/CD workflows', 'info');
  }
}

main().catch((error) => {
  log(`Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
  process.exit(1);
});

