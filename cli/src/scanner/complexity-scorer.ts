// lsp/src/scanner/complexity-scorer.ts — Heuristic 0-100 complexity scorer

import { stat } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';
import type { BrownfieldContext, ComplexityLevel, ProjectMetrics, ScanResult } from './types.js';
import { detectStack } from './detect-stack.js';
import { detectArchitecture } from './detect-architecture.js';
import { detectRoutes } from './detect-routes.js';
import { detectDocs } from './detect-docs.js';
import { detectTests } from './detect-tests.js';

// ---------------------------------------------------------------------------
// Core scoring function
// ---------------------------------------------------------------------------

export function scoreComplexity(context: BrownfieldContext): ScanResult {
  let score = 0;

  const { totalFiles, testFiles } = context.metrics;

  // File count (0-25 points)
  if (totalFiles > 200) score += 25;
  else if (totalFiles > 50) score += 15;
  else if (totalFiles > 10) score += 8;
  else score += 2;

  // Line count (0-20 points)
  const { totalLines } = context.metrics;
  if (totalLines > 50000) score += 20;
  else if (totalLines > 10000) score += 12;
  else if (totalLines > 2000) score += 6;
  else score += 1;

  // Architecture complexity (0-20 points)
  if (context.architecture.pattern === 'monorepo') score += 20;
  else if (context.architecture.pattern === 'microservices') score += 18;
  else if (context.architecture.pattern === 'modular') score += 10;
  else if (context.architecture.pattern === 'monolith') score += 5;
  // 'unknown' contributes 0

  // Tech stack breadth (0-15 points)
  const stackCount =
    context.techStack.languages.length + context.techStack.frameworks.length;
  score += Math.min(stackCount * 3, 15);

  // Has API + Frontend + DB (0-10 points)
  if (context.architecture.hasApi) score += 4;
  if (context.architecture.hasFrontend) score += 3;
  if (context.architecture.hasDatabase) score += 3;

  // Test maturity (0-10 points)
  if (testFiles > 20) score += 10;
  else if (testFiles > 5) score += 6;
  else if (testFiles > 0) score += 3;

  // Cap at 100
  score = Math.min(score, 100);

  // Map to depth level
  let suggestedDepth: ComplexityLevel;
  let reasoning: string;

  if (score <= 25) {
    suggestedDepth = 'micro';
    reasoning = 'Small project with minimal complexity — micro spec is sufficient';
  } else if (score <= 65) {
    suggestedDepth = 'standard';
    reasoning = 'Medium complexity project — standard unified spec recommended';
  } else {
    suggestedDepth = 'full';
    reasoning =
      'Complex project with multiple concerns — full 3-spec decomposition recommended';
  }

  // Build a human-readable summary
  const summary = buildSummary(context, score, suggestedDepth);

  return { context, suggestedDepth, complexityScore: score, summary, reasoning };
}

// ---------------------------------------------------------------------------
// Summary builder
// ---------------------------------------------------------------------------

function buildSummary(
  context: BrownfieldContext,
  score: number,
  depth: ComplexityLevel,
): string {
  const { techStack, architecture, metrics } = context;

  // Language/framework description
  const langList = techStack.languages.length
    ? techStack.languages.join('/').toUpperCase()
    : 'unknown-language';
  const fwList =
    techStack.frameworks.length > 0
      ? ` using ${techStack.frameworks.slice(0, 3).join(', ')}`
      : '';

  // Architecture description
  const archDesc =
    architecture.pattern === 'unknown'
      ? 'a project'
      : `a ${architecture.pattern} project`;

  // Presence descriptor
  const presences: string[] = [];
  if (architecture.hasApi) presences.push('API');
  if (architecture.hasFrontend) presences.push('frontend');
  if (architecture.hasDatabase) presences.push('database');
  const presenceDesc =
    presences.length > 0 ? ` with ${presences.join(', ')}` : '';

  // Size descriptor
  const sizeDesc =
    metrics.totalFiles > 200
      ? 'large'
      : metrics.totalFiles > 50
        ? 'medium'
        : metrics.totalFiles > 10
          ? 'small'
          : 'minimal';

  const sentence1 = `This is ${archDesc} written in ${langList}${fwList}${presenceDesc}.`;
  const sentence2 = `It has ${metrics.totalFiles} files and approximately ${metrics.totalLines.toLocaleString()} lines of code, making it a ${sizeDesc} codebase (complexity score: ${score}/100).`;
  const sentence3 =
    depth === 'micro'
      ? 'A focused micro spec will cover the essentials without overhead.'
      : depth === 'standard'
        ? 'A standard spec provides a balanced level of documentation for this scope.'
        : 'A full 3-spec decomposition (product + technical + quality) is recommended given the complexity.';

  return `${sentence1} ${sentence2} ${sentence3}`;
}

// ---------------------------------------------------------------------------
// Metrics gathering
// ---------------------------------------------------------------------------

export async function gatherMetrics(targetPath: string): Promise<ProjectMetrics> {
  const SOURCE_EXTENSIONS = [
    'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs',
    'py', 'go', 'rs', 'rb', 'java', 'kt', 'swift',
    'c', 'cpp', 'h', 'hpp', 'cs', 'php',
  ];

  const TEST_PATTERNS = [
    '**/*.test.ts', '**/*.test.js', '**/*.test.tsx', '**/*.test.jsx',
    '**/*.spec.ts', '**/*.spec.js', '**/*.spec.tsx', '**/*.spec.jsx',
    '**/*.test.py', '**/test_*.py', '**/*_test.go', '**/*.test.rb',
  ];

  const IGNORE_PATTERNS = [
    'node_modules/**', 'dist/**', 'build/**', '.git/**',
    'coverage/**', '.next/**', '.nuxt/**', '__pycache__/**',
    'vendor/**', 'target/**',
  ];

  // Count all files
  const allFiles = await glob('**/*', {
    cwd: targetPath,
    ignore: IGNORE_PATTERNS,
    nodir: true,
  });

  // Count source files
  const sourceGlobs = SOURCE_EXTENSIONS.map(ext => `**/*.${ext}`);
  let sourceFiles = 0;
  for (const pattern of sourceGlobs) {
    const matches = await glob(pattern, {
      cwd: targetPath,
      ignore: IGNORE_PATTERNS,
    });
    sourceFiles += matches.length;
  }

  // Count test files
  let testFiles = 0;
  for (const pattern of TEST_PATTERNS) {
    const matches = await glob(pattern, {
      cwd: targetPath,
      ignore: IGNORE_PATTERNS,
    });
    testFiles += matches.length;
  }

  // Approximate line count using file sizes (avg ~50 bytes per line as heuristic)
  // This avoids reading every file for large projects
  let totalBytes = 0;
  const sampleSize = Math.min(allFiles.length, 200);
  const sampleFiles = allFiles.slice(0, sampleSize);

  for (const file of sampleFiles) {
    try {
      const fileStat = await stat(path.join(targetPath, file));
      totalBytes += fileStat.size;
    } catch {
      // ignore
    }
  }

  // Scale bytes to approximate total if we sampled
  const scaleFactor = allFiles.length > sampleSize ? allFiles.length / sampleSize : 1;
  const estimatedTotalBytes = totalBytes * scaleFactor;
  const totalLines = Math.round(estimatedTotalBytes / 50); // ~50 bytes per line heuristic

  return {
    totalFiles: allFiles.length,
    totalLines,
    sourceFiles,
    testFiles,
    testCoverage: null,
  };
}

// ---------------------------------------------------------------------------
// Convenience: scanProject
// ---------------------------------------------------------------------------

export async function scanProject(
  projectPath: string,
  scope?: string,
): Promise<ScanResult> {
  const targetPath = scope ? path.join(projectPath, scope) : projectPath;

  const techStack = await detectStack(targetPath);
  const architecture = await detectArchitecture(targetPath);
  const routes = await detectRoutes(targetPath, techStack);
  const docs = await detectDocs(targetPath);
  const testInfo = await detectTests(targetPath, techStack);
  const metrics = await gatherMetrics(targetPath);

  // Merge test file count from metrics (more accurate glob count)
  const mergedMetrics: ProjectMetrics = {
    ...metrics,
    testFiles: testInfo.testFiles,
    testCoverage: null,
  };

  const context: BrownfieldContext = {
    techStack,
    architecture,
    routes,
    docs,
    metrics: mergedMetrics,
  };

  return scoreComplexity(context);
}
