#!/usr/bin/env node

/**
 * Documentation Table of Contents Generator
 * 
 * Auto-generates table of contents for markdown files.
 * Can be run manually or integrated into CI/CD.
 */

const fs = require('fs');
const path = require('path');

function extractHeadings(content) {
  const headings = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      headings.push({
        level,
        text,
        id,
        line: index + 1,
      });
    }
  });
  
  return headings;
}

function generateTOC(headings, minLevel = 2, maxLevel = 4) {
  if (headings.length === 0) return '';
  
  const filtered = headings.filter(h => h.level >= minLevel && h.level <= maxLevel);
  if (filtered.length === 0) return '';
  
  let toc = '## Table of Contents\n\n';
  let currentLevel = minLevel;
  
  filtered.forEach(heading => {
    const indent = '  '.repeat(heading.level - minLevel);
    toc += `${indent}- [${heading.text}](#${heading.id})\n`;
  });
  
  return toc + '\n';
}

function insertTOC(content, toc) {
  // Find frontmatter end
  let insertPosition = 0;
  
  if (content.startsWith('---')) {
    const endIndex = content.indexOf('---', 3);
    if (endIndex !== -1) {
      insertPosition = endIndex + 3;
      // Skip newline after frontmatter
      if (content[insertPosition] === '\n') {
        insertPosition++;
      }
    }
  }
  
  // Check if TOC already exists
  const tocMarker = '## Table of Contents';
  const existingTOCIndex = content.indexOf(tocMarker);
  
  if (existingTOCIndex !== -1 && existingTOCIndex < insertPosition + 100) {
    // Replace existing TOC
    const nextHeading = content.indexOf('\n## ', existingTOCIndex + tocMarker.length);
    if (nextHeading !== -1) {
      return content.substring(0, existingTOCIndex) + 
             toc + 
             content.substring(nextHeading + 1);
    }
  }
  
  // Insert new TOC
  return content.substring(0, insertPosition) + 
         toc + 
         content.substring(insertPosition);
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const headings = extractHeadings(content);
  
  if (headings.length === 0) {
    console.log(`  ⚠️  No headings found in ${path.basename(filePath)}`);
    return false;
  }
  
  const toc = generateTOC(headings);
  if (!toc) {
    console.log(`  ⚠️  No suitable headings for TOC in ${path.basename(filePath)}`);
    return false;
  }
  
  const updated = insertTOC(content, toc);
  fs.writeFileSync(filePath, updated, 'utf8');
  return true;
}

function main() {
  const args = process.argv.slice(2);
  const targetFile = args[0];
  
  if (targetFile) {
    // Process single file
    if (fs.existsSync(targetFile)) {
      console.log(`Generating TOC for ${targetFile}...`);
      processFile(targetFile);
      console.log('✅ Done.');
    } else {
      console.error(`File not found: ${targetFile}`);
      process.exit(1);
    }
  } else {
    console.log('Usage: node docs-toc-generator.js <file.md>');
    console.log('Example: node docs-toc-generator.js docs/README.md');
  }
}

if (require.main === module) {
  main();
}

module.exports = { extractHeadings, generateTOC, insertTOC, processFile };






