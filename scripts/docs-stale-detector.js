#!/usr/bin/env node

/**
 * Documentation Stale Detector
 * 
 * Scans documentation files and flags those not modified within the threshold days.
 * Reports stale documentation for review by owners.
 */

const fs = require('fs');
const path = require('path');

const STALE_THRESHOLD_DAYS = 90;
const DOCS_DIR = path.join(__dirname, '..', 'docs');

function getDaysSinceModified(filePath) {
  const stats = fs.statSync(filePath);
  const now = new Date();
  const modified = stats.mtime;
  const diffTime = Math.abs(now - modified);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function extractFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  
  const endIndex = content.indexOf('---', 3);
  if (endIndex === -1) return null;
  
  const frontmatterText = content.substring(3, endIndex);
  const frontmatter = {};
  
  frontmatterText.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      frontmatter[key] = value;
    }
  });
  
  return frontmatter;
}

function scanDirectory(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanDirectory(filePath, results);
    } else if (file.endsWith('.md')) {
      const daysSinceModified = getDaysSinceModified(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatter = extractFrontmatter(content);
      
      if (daysSinceModified > STALE_THRESHOLD_DAYS) {
        results.push({
          file: path.relative(DOCS_DIR, filePath),
          daysSinceModified,
          lastModified: stat.mtime.toISOString().split('T')[0],
          owner: frontmatter?.owner || 'unknown',
          status: frontmatter?.status || 'unknown',
        });
      }
    }
  });
  
  return results;
}

function main() {
  console.log(`Scanning documentation in ${DOCS_DIR}...`);
  console.log(`Stale threshold: ${STALE_THRESHOLD_DAYS} days\n`);
  
  const staleDocs = scanDirectory(DOCS_DIR);
  
  if (staleDocs.length === 0) {
    console.log('✅ No stale documentation found.');
    return;
  }
  
  console.log(`⚠️  Found ${staleDocs.length} stale documentation file(s):\n`);
  
  staleDocs.forEach(doc => {
    console.log(`  📄 ${doc.file}`);
    console.log(`     Last modified: ${doc.lastModified} (${doc.daysSinceModified} days ago)`);
    console.log(`     Owner: ${doc.owner}`);
    console.log(`     Status: ${doc.status}\n`);
  });
  
  console.log('\n💡 Action required:');
  console.log('   - Review stale documentation');
  console.log('   - Update if still accurate');
  console.log('   - Archive if no longer relevant');
  console.log('   - Transfer ownership if needed');
  
  process.exit(staleDocs.length > 0 ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = { scanDirectory, getDaysSinceModified };






