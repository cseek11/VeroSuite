/**
 * Check Port Availability Script
 * Usage: node scripts/check-port.js <port>
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function checkPort(port) {
  console.log(`🔍 Checking if port ${port} is available...\n`);

  try {
    const { stdout } = await execPromise(`netstat -ano | findstr :${port} | findstr LISTENING`);
    
    if (stdout && stdout.trim().length > 0) {
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

      console.log(`❌ Port ${port} is IN USE by:`);
      pids.forEach(async (pid) => {
        try {
          const { stdout: tasklist } = await execPromise(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`);
          if (tasklist && tasklist.trim()) {
            const [name] = tasklist.split(',');
            console.log(`   PID ${pid}: ${name.replace(/"/g, '')}`);
          } else {
            console.log(`   PID ${pid}: (unknown process)`);
          }
        } catch (e) {
          console.log(`   PID ${pid}: (could not get process info)`);
        }
      });
      console.log(`\n💡 To kill the process, run: node scripts/kill-port.js ${port}`);
      return false;
    } else {
      console.log(`✅ Port ${port} is AVAILABLE`);
      return true;
    }
  } catch (error) {
    // No output means port is free
    console.log(`✅ Port ${port} is AVAILABLE`);
    return true;
  }
}

const port = process.argv[2] || '3001';
checkPort(port);

