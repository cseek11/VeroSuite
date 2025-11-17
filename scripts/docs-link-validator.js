#!/usr/bin/env node

/**
 * Documentation Link Validator
 * 
 * Validates internal documentation links and checks for broken references.
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');

function extractLinks(content, filePath) {
  const links = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const linkText = match[1];
    const linkUrl = match[2];
    
    // Only check internal links (relative paths)
    if (linkUrl.startsWith('../') || linkUrl.startsWith('./') || 
        (linkUrl.startsWith('docs/') && !linkUrl.startsWith('http'))) {
      links.push({
        text: linkText,
        url: linkUrl,
        file: filePath,
      });
    }
  }
  
  return links;
}

function resolveLink(linkUrl, fromFile) {
  const fromDir = path.dirname(fromFile);
  
  // Handle different link formats
  let targetPath;
  if (linkUrl.startsWith('docs/')) {
    targetPath = path.join(__dirname, '..', linkUrl);
  } else if (linkUrl.startsWith('../')) {
    targetPath = path.resolve(fromDir, linkUrl);
  } else if (linkUrl.startsWith('./')) {
    targetPath = path.resolve(fromDir, linkUrl);
  } else {
    // Relative to current file
    targetPath = path.resolve(fromDir, linkUrl);
  }
  
  // Try with .md extension if not present
  if (!targetPath.endsWith('.md')) {
    const withMd = targetPath + '.md';
    if (fs.existsSync(withMd)) {
      return withMd;
    }
  }
  
  return targetPath;
}

function scanDirectory(dir, allLinks = [], allFiles = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanDirectory(filePath, allLinks, allFiles);
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const links = extractLinks(content, filePath);
      allLinks.push(...links);
      allFiles.push(filePath);
    }
  });
  
  return { links: allLinks, files: allFiles };
}

function main() {
  console.log(`Validating documentation links in ${DOCS_DIR}...\n`);
  
  const { links, files } = scanDirectory(DOCS_DIR);
  const brokenLinks = [];
  
  links.forEach(link => {
    const targetPath = resolveLink(link.url, link.file);
    const relativeFile = path.relative(DOCS_DIR, link.file);
    
    if (!fs.existsSync(targetPath)) {
      brokenLinks.push({
        file: relativeFile,
        link: link.text,
        url: link.url,
        resolved: path.relative(DOCS_DIR, targetPath),
      });
    }
  });
  
  if (brokenLinks.length === 0) {
    console.log(`✅ All ${links.length} internal links are valid.`);
    return;
  }
  
  console.log(`❌ Found ${brokenLinks.length} broken link(s):\n`);
  
  brokenLinks.forEach(broken => {
    console.log(`  📄 ${broken.file}`);
    console.log(`     Link: [${broken.link}](${broken.url})`);
    console.log(`     Resolved to: ${broken.resolved}\n`);
  });
  
  process.exit(brokenLinks.length > 0 ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = { extractLinks, resolveLink, scanDirectory };






