import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import * as path from 'path';

export interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  error?: string;
  output?: string;
  coverage?: number;
}

export interface TestCategory {
  id: string;
  name: string;
  description: string;
  tests: TestResult[];
  status: 'pending' | 'running' | 'completed';
  totalTests: number;
  passedTests: number;
  failedTests: number;
}

export class TestExecutionService extends EventEmitter {
  private processes: Map<string, ChildProcess> = new Map();
  private testResults: Map<string, TestResult[]> = new Map();

  constructor() {
    super();
  }

  async runTestCategory(categoryId: string, workingDir: string = process.cwd()): Promise<void> {
    this.emit('testCategoryStarted', categoryId);

    return new Promise((resolve, reject) => {
      // Use the test runner script
      const scriptPath = path.join(workingDir, 'frontend', 'scripts', 'run-tests.js');
      const process = spawn('node', [scriptPath, categoryId, workingDir], {
        cwd: workingDir,
        shell: true,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      this.processes.set(categoryId, process);

      let output = '';
      let errorOutput = '';

      process.stdout?.on('data', (data) => {
        const text = data.toString();
        output += text;
        this.emit('testOutput', categoryId, text);
        this.parseTestOutput(categoryId, text);
      });

      process.stderr?.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        this.emit('testError', categoryId, text);
      });

      process.on('close', (code) => {
        this.processes.delete(categoryId);
        
        if (code === 0) {
          this.emit('testCategoryCompleted', categoryId, output);
          resolve();
        } else {
          this.emit('testCategoryFailed', categoryId, errorOutput);
          reject(new Error(`Test category ${categoryId} failed with code ${code}`));
        }
      });

      process.on('error', (error) => {
        this.processes.delete(categoryId);
        this.emit('testCategoryError', categoryId, error.message);
        reject(error);
      });
    });
  }

  async runAllTests(workingDir: string = process.cwd()): Promise<void> {
    const categories = ['unit', 'integration', 'e2e', 'security', 'performance'];
    
    this.emit('allTestsStarted');

    for (const category of categories) {
      try {
        await this.runTestCategory(category, workingDir);
        // Brief pause between categories
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        this.emit('testCategoryError', category, error);
        // Continue with other categories even if one fails
      }
    }

    this.emit('allTestsCompleted');
  }

  private parseTestOutput(categoryId: string, output: string): void {
    // Parse Jest/Vitest output to extract test results
    const lines = output.split('\n');
    
    for (const line of lines) {
      // Parse test results (this is a simplified parser)
      if (line.includes('PASS') || line.includes('✓')) {
        const testName = this.extractTestName(line);
        if (testName) {
          this.updateTestResult(categoryId, testName, 'passed');
        }
      } else if (line.includes('FAIL') || line.includes('✗')) {
        const testName = this.extractTestName(line);
        if (testName) {
          this.updateTestResult(categoryId, testName, 'failed');
        }
      } else if (line.includes('RUNS') || line.includes('●')) {
        const testName = this.extractTestName(line);
        if (testName) {
          this.updateTestResult(categoryId, testName, 'running');
        }
      }
    }
  }

  private extractTestName(line: string): string | null {
    // Extract test name from output line
    const match = line.match(/(?:PASS|FAIL|RUNS|✓|✗|●)\s+(.+?)(?:\s|$)/);
    return match ? match[1].trim() : null;
  }

  private updateTestResult(categoryId: string, testName: string, status: TestResult['status']): void {
    const results = this.testResults.get(categoryId) || [];
    let test = results.find(t => t.name === testName);
    
    if (!test) {
      test = {
        id: `${categoryId}-${testName}`,
        name: testName,
        status: 'pending',
      };
      results.push(test);
    }
    
    test.status = status;
    if (status === 'passed' || status === 'failed') {
      test.duration = Math.floor(Math.random() * 5000) + 1000; // Mock duration
    }
    
    this.testResults.set(categoryId, results);
    this.emit('testResultUpdated', categoryId, test);
  }

  getTestResults(categoryId: string): TestResult[] {
    return this.testResults.get(categoryId) || [];
  }

  stopTestCategory(categoryId: string): void {
    const process = this.processes.get(categoryId);
    if (process) {
      process.kill();
      this.processes.delete(categoryId);
      this.emit('testCategoryStopped', categoryId);
    }
  }

  stopAllTests(): void {
    for (const [categoryId, process] of this.processes) {
      process.kill();
      this.emit('testCategoryStopped', categoryId);
    }
    this.processes.clear();
  }

  isRunning(categoryId?: string): boolean {
    if (categoryId) {
      return this.processes.has(categoryId);
    }
    return this.processes.size > 0;
  }
}

export const testExecutionService = new TestExecutionService();
