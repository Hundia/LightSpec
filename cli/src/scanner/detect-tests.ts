/**
 * detect-tests.ts
 * Detects test files and frameworks in a project.
 * Pure function — no LLM calls, only file system reads.
 */

import { glob } from 'glob';
import path from 'path';
import type { TechStack } from './types.js';

/** Glob patterns that match test files across ecosystems */
const TEST_PATTERNS = [
  // TypeScript / JavaScript
  '**/*.test.ts',
  '**/*.spec.ts',
  '**/*.test.js',
  '**/*.spec.js',
  '**/*.test.mjs',
  '**/*.spec.mjs',
  // Python
  'test_*.py',
  '**/test_*.py',
  '**/*_test.py',
  // Go
  '**/*_test.go',
  // Rust
  // Rust tests are inline; detect test files via test directories
  '**/tests/**/*.rs',
  // Generic
  '**/test/**/*.ts',
  '**/tests/**/*.ts',
  '**/test/**/*.js',
  '**/tests/**/*.js',
];

const IGNORE_DIRS = [
  'node_modules/**',
  '.git/**',
  'dist/**',
  'build/**',
  '.next/**',
  '.nuxt/**',
  'coverage/**',
];

/**
 * Detect test files and frameworks in a project.
 * Re-uses testFrameworks from the stack detection but also cross-checks file
 * existence to catch frameworks not declared in package.json.
 */
export async function detectTests(
  projectPath: string,
  techStack: TechStack,
): Promise<{ testFiles: number; testFrameworks: string[] }> {
  let testFiles = 0;

  try {
    const matches = await glob(TEST_PATTERNS, {
      cwd: projectPath,
      ignore: IGNORE_DIRS,
      nodir: true,
    });
    testFiles = matches.length;
  } catch {
    // glob failure — return empty
  }

  // Seed from already-detected frameworks, deduplicate
  const frameworks = new Set<string>(techStack.testFrameworks);

  // Additional heuristic: check for pytest.ini / jest.config.* / vitest.config.*
  const configSignals: Array<[string, string]> = [
    ['pytest.ini', 'pytest'],
    ['setup.cfg', 'pytest'],          // may contain [tool:pytest]
    ['jest.config.js', 'jest'],
    ['jest.config.ts', 'jest'],
    ['jest.config.mjs', 'jest'],
    ['vitest.config.ts', 'vitest'],
    ['vitest.config.js', 'vitest'],
  ];

  for (const [file, fw] of configSignals) {
    try {
      await import('fs').then(async fs => {
        const { existsSync } = fs;
        if (existsSync(path.join(projectPath, file))) {
          frameworks.add(fw);
        }
      });
    } catch {
      // ignore
    }
  }

  return {
    testFiles,
    testFrameworks: Array.from(frameworks),
  };
}
