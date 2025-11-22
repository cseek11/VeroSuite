/**
 * Test Runner Script
 * Runs all test suites with proper error handling and reporting
 * 
 * Usage: node scripts/run-tests.js [unit|integration|all]
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runCommand(command, description) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`Running: ${description}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
  log(`Command: ${command}\n`, 'yellow');

  try {
    const { stdout, stderr } = await execPromise(command, {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'test' },
    });

    if (stdout) {
      console.log(stdout);
    }
    if (stderr && !stderr.includes('Warning')) {
      console.error(stderr);
    }

    return { success: true, output: stdout };
  } catch (error) {
    log(`\n❌ Error running ${description}`, 'red');
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    return { success: false, error: error.message, output: error.stdout };
  }
}

async function runTests() {
  const testType = process.argv[2] || 'all';
  
  log('\n🧪 VeroField Test Suite Runner', 'bright');
  log('='.repeat(60), 'cyan');

  const results = {
    unit: null,
    integration: null,
  };

  // Run unit tests
  if (testType === 'unit' || testType === 'all') {
    results.unit = await runCommand(
      'npm run test:unit',
      'Backend Unit Tests'
    );
  }

  // Run integration tests
  if (testType === 'integration' || testType === 'all') {
    results.integration = await runCommand(
      'npm run test:integration',
      'Backend Integration Tests'
    );
  }

  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('📊 Test Results Summary', 'bright');
  log('='.repeat(60), 'cyan');

  if (results.unit !== null) {
    if (results.unit.success) {
      log('✅ Unit Tests: PASSED', 'green');
    } else {
      log('❌ Unit Tests: FAILED', 'red');
    }
  }

  if (results.integration !== null) {
    if (results.integration.success) {
      log('✅ Integration Tests: PASSED', 'green');
    } else {
      log('❌ Integration Tests: FAILED', 'red');
    }
  }

  // Exit code
  const allPassed = Object.values(results)
    .filter(r => r !== null)
    .every(r => r.success);

  if (allPassed) {
    log('\n🎉 All tests passed!', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Some tests failed. Please review the output above.', 'yellow');
    process.exit(1);
  }
}

runTests().catch((error) => {
  log(`\n💥 Fatal error: ${error.message}`, 'red');
  process.exit(1);
});

