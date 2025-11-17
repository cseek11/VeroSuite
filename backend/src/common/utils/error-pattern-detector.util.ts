/**
 * Error pattern detection utilities
 * Helps detect silent failures, empty catch blocks, missing awaits, etc.
 */

export interface SilentFailureDetection {
  file: string;
  line: number;
  type: 'empty_catch' | 'missing_await' | 'swallowed_promise' | 'console_log' | 'conditional_failure';
  code: string;
  suggestion: string;
}

/**
 * Detect empty catch blocks in code
 * Pattern: catch (error) { } or catch (error) { // comment }
 */
export function detectEmptyCatchBlocks(code: string, filePath: string): SilentFailureDetection[] {
  const detections: SilentFailureDetection[] = [];
  const lines = code.split('\n');

  // Pattern: catch block with only whitespace/comments
  const catchBlockRegex = /catch\s*\([^)]*\)\s*\{([^}]*)\}/g;
  let match;
  let lineNumber = 1;

  while ((match = catchBlockRegex.exec(code)) !== null) {
    const catchBody = match[1];
    const bodyWithoutComments = catchBody.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();

    if (!bodyWithoutComments || bodyWithoutComments.length === 0) {
      // Find line number
      const beforeMatch = code.substring(0, match.index);
      lineNumber = beforeMatch.split('\n').length;

      detections.push({
        file: filePath,
        line: lineNumber,
        type: 'empty_catch',
        code: match[0],
        suggestion: 'Add error logging and handling. Use logger.error() with context, operation, errorCode, and rootCause.',
      });
    }
  }

  return detections;
}

/**
 * Detect missing await in async functions
 * Pattern: async function with non-awaited promises
 */
export function detectMissingAwaits(code: string, filePath: string): SilentFailureDetection[] {
  const detections: SilentFailureDetection[] = [];
  const lines = code.split('\n');

  // Pattern: async function with function calls that return promises but aren't awaited
  // This is a simplified detection - full AST parsing would be more accurate
  const asyncFunctionRegex = /async\s+(?:function\s+\w+|\([^)]*\)\s*=>)/g;
  const promiseCallRegex = /(\w+)\s*\([^)]*\)(?!\s*\.(?:then|catch|finally))/g;

  // Note: This is a basic implementation. A full AST parser would be more accurate.
  // For now, we'll focus on common patterns.

  lines.forEach((line, index) => {
    // Check for common promise-returning functions without await
    const commonPromisePatterns = [
      /fetch\s*\(/,
      /axios\.(get|post|put|delete|patch)\s*\(/,
      /prisma\.\w+\.(findMany|findFirst|create|update|delete)\s*\(/,
      /\.then\s*\(/,
    ];

    const isAsyncLine = /async/.test(line);
    const hasAwait = /await\s+/.test(line);

    if (isAsyncLine || hasAwait) {
      // This line is in an async context
      commonPromisePatterns.forEach((pattern) => {
        if (pattern.test(line) && !hasAwait) {
          detections.push({
            file: filePath,
            line: index + 1,
            type: 'missing_await',
            code: line.trim(),
            suggestion: 'Add await before promise-returning function call to handle errors properly.',
          });
        }
      });
    }
  });

  return detections;
}

/**
 * Detect swallowed promises
 * Pattern: .catch(() => {}) or .catch(() => { empty })
 */
export function detectSwallowedPromises(code: string, filePath: string): SilentFailureDetection[] {
  const detections: SilentFailureDetection[] = [];
  const lines = code.split('\n');

  // Pattern: .catch(() => {}) or .catch(() => { /* empty */ })
  const swallowedPromiseRegex = /\.catch\s*\(\s*(?:\([^)]*\)\s*=>\s*)?\{([^}]*)\}\s*\)/g;
  let match;
  let lineNumber = 1;

  while ((match = swallowedPromiseRegex.exec(code)) !== null) {
    const catchBody = match[1];
    const bodyWithoutComments = catchBody.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();

    if (!bodyWithoutComments || bodyWithoutComments.length === 0) {
      const beforeMatch = code.substring(0, match.index);
      lineNumber = beforeMatch.split('\n').length;

      detections.push({
        file: filePath,
        line: lineNumber,
        type: 'swallowed_promise',
        code: match[0],
        suggestion: 'Add error logging in catch block. Use logger.error() with context, operation, errorCode, and rootCause.',
      });
    }
  }

  return detections;
}

/**
 * Detect console.log/error instead of structured logging
 */
export function detectConsoleLogs(code: string, filePath: string): SilentFailureDetection[] {
  const detections: SilentFailureDetection[] = [];
  const lines = code.split('\n');

  const consolePatterns = [
    /console\.(log|error|warn|info|debug)\s*\(/,
  ];

  lines.forEach((line, index) => {
    consolePatterns.forEach((pattern) => {
      if (pattern.test(line)) {
        detections.push({
          file: filePath,
          line: index + 1,
          type: 'console_log',
          code: line.trim(),
          suggestion: 'Replace console.log/error with structured logger. Use logger.error() with context, operation, severity, errorCode, and rootCause.',
        });
      }
    });
  });

  return detections;
}

/**
 * Detect all silent failures in code
 */
export function detectAllSilentFailures(code: string, filePath: string): SilentFailureDetection[] {
  return [
    ...detectEmptyCatchBlocks(code, filePath),
    ...detectMissingAwaits(code, filePath),
    ...detectSwallowedPromises(code, filePath),
    ...detectConsoleLogs(code, filePath),
  ];
}

/**
 * Format detection results for reporting
 */
export function formatDetectionResults(detections: SilentFailureDetection[]): string {
  if (detections.length === 0) {
    return 'No silent failures detected.';
  }

  const grouped = detections.reduce((acc, detection) => {
    if (!acc[detection.file]) {
      acc[detection.file] = [];
    }
    acc[detection.file].push(detection);
    return acc;
  }, {} as Record<string, SilentFailureDetection[]>);

  let report = `Found ${detections.length} silent failure(s):\n\n`;

  Object.entries(grouped).forEach(([file, fileDetections]) => {
    report += `File: ${file}\n`;
    fileDetections.forEach((detection) => {
      report += `  Line ${detection.line}: ${detection.type}\n`;
      report += `    Code: ${detection.code.substring(0, 80)}${detection.code.length > 80 ? '...' : ''}\n`;
      report += `    Suggestion: ${detection.suggestion}\n\n`;
    });
  });

  return report;
}

