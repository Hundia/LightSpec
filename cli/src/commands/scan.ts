/**
 * lsp scan — run brownfield scanner only (no LLM calls)
 */

import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { scanProject } from '../scanner/complexity-scorer.js';
import type { ScanResult } from '../scanner/types.js';

// ---------------------------------------------------------------------------
// Confidence signals
// ---------------------------------------------------------------------------

export type ConfidenceLevel = 'HIGH' | 'LIMITED' | 'NONE' | 'UNKNOWN' | 'NA';

export interface ConfidenceSignals {
  routeExtraction: 'HIGH' | 'LIMITED' | 'NA';
  apiDetection: 'HIGH' | 'NONE';
  architecturePattern: 'HIGH' | 'UNKNOWN';
}

const NON_JS_BACKEND_FRAMEWORKS = [
  'gin', 'echo', 'fiber', 'chi',           // Go
  'actix', 'axum',                          // Rust
  'rails', 'sinatra',                       // Ruby
  'django', 'flask', 'fastapi',             // Python
];

const NON_JS_BACKEND_LANGUAGES = ['go', 'rust', 'ruby', 'python'];

export function buildConfidenceSignals(result: ScanResult): ConfidenceSignals {
  const { techStack, architecture, routes } = result.context;

  // Route extraction signal
  const nonJsFrameworks = (techStack.frameworks ?? []).filter(f =>
    NON_JS_BACKEND_FRAMEWORKS.includes(f.toLowerCase()),
  );
  const nonJsLangs = (techStack.languages ?? []).filter(l =>
    NON_JS_BACKEND_LANGUAGES.includes(l.toLowerCase()),
  );

  let routeExtraction: ConfidenceSignals['routeExtraction'];
  if (routes.routes.length > 0) {
    routeExtraction = 'HIGH';
  } else if (nonJsFrameworks.length > 0 || nonJsLangs.length > 0) {
    routeExtraction = 'LIMITED';
  } else {
    routeExtraction = 'NA';
  }

  // API detection signal
  const apiDetection: ConfidenceSignals['apiDetection'] = architecture.hasApi ? 'HIGH' : 'NONE';

  // Architecture pattern signal
  const architecturePattern: ConfidenceSignals['architecturePattern'] =
    architecture.pattern === 'unknown' ? 'UNKNOWN' : 'HIGH';

  return { routeExtraction, apiDetection, architecturePattern };
}

function confidenceColor(level: ConfidenceLevel): string {
  if (level === 'HIGH') return chalk.green(level);
  return chalk.yellow(level);
}

export function buildConfidenceLines(result: ScanResult): string[] {
  const { techStack, routes } = result.context;
  const signals = buildConfidenceSignals(result);
  const lines: string[] = [];

  // Route extraction line
  if (signals.routeExtraction === 'HIGH') {
    const fw = routes.framework ?? 'detected framework';
    lines.push(
      `  Route extraction:     ${confidenceColor('HIGH')} — ${routes.routes.length} routes found via ${fw}`,
    );
  } else if (signals.routeExtraction === 'LIMITED') {
    const nonJsLangs = (techStack.languages ?? []).filter(l =>
      NON_JS_BACKEND_LANGUAGES.includes(l.toLowerCase()),
    );
    const nonJsFrameworks = (techStack.frameworks ?? []).filter(f =>
      NON_JS_BACKEND_FRAMEWORKS.includes(f.toLowerCase()),
    );
    const label = nonJsLangs[0] ?? nonJsFrameworks[0] ?? 'non-JS';
    lines.push(
      `  Route extraction:     ${confidenceColor('LIMITED')} — no routes found for ${label} project` +
        chalk.dim(' (consider --srs to provide API documentation)'),
    );
  } else {
    lines.push(
      `  Route extraction:     ${confidenceColor('NA')} — no HTTP framework detected`,
    );
  }

  // API detection line
  if (signals.apiDetection === 'HIGH') {
    lines.push(`  API detection:        ${confidenceColor('HIGH')}`);
  } else {
    lines.push(
      `  API detection:        ${confidenceColor('NONE')} — no API entry points found` +
        chalk.dim(' (would detect: routes/ controllers/ handlers/ api/ or main.go)'),
    );
  }

  // Architecture pattern line (only show if UNKNOWN)
  if (signals.architecturePattern === 'UNKNOWN') {
    lines.push(
      `  Architecture pattern: ${confidenceColor('UNKNOWN')} — no recognized structure` +
        chalk.dim(' (would detect: monorepo/modular/microservices/monolith patterns)'),
    );
  }

  return lines;
}

export async function scanCommand(
  projectPath: string | undefined,
  opts: Record<string, unknown>,
): Promise<void> {
  const targetPath = projectPath ? path.resolve(projectPath) : process.cwd();
  const scope = typeof opts['scope'] === 'string' ? opts['scope'] : undefined;
  const asJson = opts['json'] === true;

  const spinner = asJson ? null : ora('Scanning project...').start();

  let result;
  try {
    result = await scanProject(targetPath, scope);
    spinner?.succeed('Scan complete');
  } catch (err) {
    spinner?.fail('Scan failed');
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`Error: ${message}`));
    process.exit(1);
  }

  if (asJson) {
    const signals = buildConfidenceSignals(result);
    const output = {
      ...result,
      confidence: {
        routeExtraction: signals.routeExtraction,
        apiDetection: signals.apiDetection,
        architecturePattern: signals.architecturePattern,
      },
    };
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  // Pretty-print scan results
  console.log('');
  console.log(chalk.bold.cyan('  LightSpec Brownfield Scan Results'));
  console.log(chalk.gray('  ' + '─'.repeat(50)));
  console.log('');

  // Summary
  console.log(chalk.bold('  Summary'));
  console.log(`  ${result.summary}`);
  console.log('');

  // Complexity
  const scoreColor =
    result.complexityScore <= 25
      ? chalk.green
      : result.complexityScore <= 65
        ? chalk.yellow
        : chalk.red;

  console.log(chalk.bold('  Complexity'));
  console.log(`  Score:      ${scoreColor(result.complexityScore + '/100')}`);
  console.log(`  Depth:      ${chalk.bold(result.suggestedDepth)}`);
  console.log(`  Reasoning:  ${chalk.gray(result.reasoning)}`);
  console.log('');

  // Tech stack
  const { techStack } = result.context;
  console.log(chalk.bold('  Tech Stack'));
  if (techStack.languages.length > 0) {
    console.log(`  Languages:  ${chalk.cyan(techStack.languages.join(', '))}`);
  }
  if (techStack.frameworks.length > 0) {
    console.log(`  Frameworks: ${chalk.cyan(techStack.frameworks.join(', '))}`);
  }
  if (techStack.testFrameworks.length > 0) {
    console.log(`  Tests:      ${chalk.cyan(techStack.testFrameworks.join(', '))}`);
  }
  if (techStack.buildTools.length > 0) {
    console.log(`  Build:      ${chalk.cyan(techStack.buildTools.join(', '))}`);
  }
  if (techStack.packageManager) {
    console.log(`  Package:    ${chalk.cyan(techStack.packageManager)}`);
  }
  console.log('');

  // Architecture
  const { architecture } = result.context;
  console.log(chalk.bold('  Architecture'));
  console.log(`  Pattern:    ${chalk.cyan(architecture.pattern)}`);
  const flags = [
    architecture.hasApi && 'API',
    architecture.hasFrontend && 'Frontend',
    architecture.hasDatabase && 'Database',
  ].filter(Boolean);
  if (flags.length > 0) {
    console.log(`  Features:   ${chalk.cyan(flags.join(', '))}`);
  }
  if (architecture.entryPoints.length > 0) {
    console.log(`  Entry:      ${chalk.gray(architecture.entryPoints.slice(0, 3).join(', '))}`);
  }
  console.log('');

  // Metrics
  const { metrics } = result.context;
  console.log(chalk.bold('  Metrics'));
  console.log(`  Files:      ${chalk.cyan(metrics.totalFiles)}`);
  console.log(`  Lines:      ${chalk.cyan(metrics.totalLines.toLocaleString())}`);
  console.log(`  Source:     ${chalk.cyan(metrics.sourceFiles)}`);
  console.log(`  Tests:      ${chalk.cyan(metrics.testFiles)}`);
  console.log('');

  // Detection Confidence
  console.log(chalk.bold('  Detection Confidence'));
  const confidenceLines = buildConfidenceLines(result);
  for (const line of confidenceLines) {
    console.log(line);
  }
  console.log('');
}
