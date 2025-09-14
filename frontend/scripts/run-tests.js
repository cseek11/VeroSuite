#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Test categories and their corresponding commands
const testCategories = {
  unit: 'npm run test:unit',
  integration: 'npm run test:integration',
  e2e: 'npm run test:e2e',
  security: 'npm run test:security',
  performance: 'npm run test:performance',
};

// Get command line arguments
const args = process.argv.slice(2);
const category = args[0] || 'all';
const workingDir = args[1] || process.cwd();

console.log(`Running tests in: ${workingDir}`);
console.log(`Category: ${category}`);

async function runTestCategory(categoryId) {
  const command = testCategories[categoryId];
  if (!command) {
    throw new Error(`Unknown test category: ${categoryId}`);
  }

  console.log(`\n=== Running ${categoryId.toUpperCase()} Tests ===`);
  console.log(`Command: ${command}`);

  return new Promise((resolve, reject) => {
    const [cmd, ...cmdArgs] = command.split(' ');
    const process = spawn(cmd, cmdArgs, {
      cwd: workingDir,
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(text);
    });

    process.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      console.error(text);
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${categoryId.toUpperCase()} tests completed successfully`);
        resolve({ success: true, output, error: errorOutput });
      } else {
        console.log(`\n❌ ${categoryId.toUpperCase()} tests failed with code ${code}`);
        reject({ success: false, code, output, error: errorOutput });
      }
    });

    process.on('error', (error) => {
      console.error(`\n❌ Error running ${categoryId} tests:`, error.message);
      reject({ success: false, error: error.message });
    });
  });
}

async function runAllTests() {
  console.log('\n🚀 Running all test categories...\n');
  
  const results = {};
  
  for (const [categoryId, command] of Object.entries(testCategories)) {
    try {
      results[categoryId] = await runTestCategory(categoryId);
      // Brief pause between categories
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results[categoryId] = error;
      console.error(`Failed to run ${categoryId} tests:`, error);
    }
  }
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const [categoryId, result] of Object.entries(results)) {
    if (result.success) {
      console.log(`✅ ${categoryId.toUpperCase()}: PASSED`);
      totalPassed++;
    } else {
      console.log(`❌ ${categoryId.toUpperCase()}: FAILED`);
      totalFailed++;
    }
  }
  
  console.log(`\nTotal: ${totalPassed} passed, ${totalFailed} failed`);
  
  if (totalFailed > 0) {
    process.exit(1);
  }
}

// Main execution
async function main() {
  try {
    if (category === 'all') {
      await runAllTests();
    } else {
      await runTestCategory(category);
    }
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

main();






