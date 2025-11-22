/**
 * Kill Process on Port Script
 * Usage: node scripts/kill-port.js 3001
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function killPort(port) {
  console.log(`🔍 Finding process using port ${port}...`);

  try {
    // Find process using the port (Windows)
    const { stdout } = await execPromise(`netstat -ano | findstr :${port} | findstr LISTENING`);
    
    if (!stdout || stdout.trim().length === 0) {
      console.log(`❌ No process found using port ${port}`);
      return;
    }

    // Extract PID (last column)
    const lines = stdout.trim().split('\n');
    const pids = new Set();
    
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length > 0) {
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid)) {
          pids.add(pid);
        }
      }
    });

    if (pids.size === 0) {
      console.log(`❌ Could not extract PID from netstat output`);
      return;
    }

    console.log(`✅ Found ${pids.size} process(es) using port ${port}:`);
    pids.forEach(pid => console.log(`   PID: ${pid}`));

    // Kill each process
    for (const pid of pids) {
      try {
        // Get process info first
        try {
          const { stdout: tasklist } = await execPromise(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`);
          if (tasklist && tasklist.trim()) {
            const [name] = tasklist.split(',');
            console.log(`   Process: ${name.replace(/"/g, '')}`);
          }
        } catch (e) {
          // Process might not exist
        }

        // Kill the process
        await execPromise(`taskkill /PID ${pid} /F`);
        console.log(`✅ Killed process ${pid}`);
      } catch (error) {
        if (error.message.includes('not found')) {
          console.log(`⚠️  Process ${pid} not found (may have already ended)`);
        } else {
          console.error(`❌ Error killing process ${pid}:`, error.message);
        }
      }
    }

    console.log(`\n✅ Port ${port} should now be free. Try starting your server again.`);

  } catch (error) {
    if (error.message.includes('findstr')) {
      console.log(`❌ No process found using port ${port}`);
    } else {
      console.error(`❌ Error:`, error.message);
    }
  }
}

// Get port from command line argument
const port = process.argv[2];

if (!port) {
  console.error('❌ Usage: node scripts/kill-port.js <port>');
  console.error('   Example: node scripts/kill-port.js 3001');
  process.exit(1);
}

if (isNaN(port)) {
  console.error(`❌ Invalid port: ${port}`);
  process.exit(1);
}

killPort(parseInt(port));

