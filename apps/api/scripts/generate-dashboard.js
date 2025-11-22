#!/usr/bin/env node

/**
 * Dashboard Generation Script
 * Generates HTML dashboard from test results
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Generating VeroField Enterprise Testing Dashboard...\n');

try {
  // Run the dashboard generator
  const dashboardPath = path.join(__dirname, '../test/dashboard/html-dashboard-generator.ts');
  
  // Use ts-node to run the TypeScript file
  execSync(`npx ts-node "${dashboardPath}"`, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('\n✅ Dashboard generation completed successfully!');
  console.log('📊 Open coverage/testing-dashboard.html in your browser to view the dashboard');
  
} catch (error) {
  console.error('❌ Error generating dashboard:', error.message);
  process.exit(1);
}






