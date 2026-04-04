/**
 * lsp init — scan project, detect complexity, generate specs
 */

import path from 'path';
import readline from 'readline';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import { scanProject } from '../scanner/complexity-scorer.js';
import { planDepth } from '../pipeline/depth-router.js';
import { generateSpecs } from '../pipeline/generate-spec.js';
import { extractTasks, formatTasksMarkdown } from '../pipeline/task-extractor.js';
import { resolveProvider } from '../providers/index.js';
import type { ComplexityLevel } from '../scanner/types.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function confirm(question: string): Promise<boolean> {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase() !== 'n' && answer.trim().toLowerCase() !== 'no');
    });
  });
}

function isValidDepth(d: string): d is ComplexityLevel {
  return d === 'micro' || d === 'standard' || d === 'full';
}

function formatEstimate(seconds: number): string {
  if (seconds < 60) return `~${seconds}s`;
  return `~${Math.round(seconds / 60)}m`;
}

// ---------------------------------------------------------------------------
// Main command
// ---------------------------------------------------------------------------

export async function initCommand(
  projectPath: string | undefined,
  opts: Record<string, unknown>,
): Promise<void> {
  const start = Date.now();

  // 1. Resolve project path
  const targetPath = projectPath ? path.resolve(projectPath) : process.cwd();
  const scope = typeof opts['scope'] === 'string' ? opts['scope'] : undefined;
  const outputDir = path.resolve(
    targetPath,
    typeof opts['output'] === 'string' ? opts['output'] : '.lsp',
  );
  const skipConfirm = opts['yes'] === true;
  const dryRun = opts['dryRun'] === true || opts['dry-run'] === true;
  const depthOverride =
    typeof opts['depth'] === 'string' && isValidDepth(opts['depth'])
      ? opts['depth']
      : undefined;
  const providerOverride =
    typeof opts['provider'] === 'string' ? opts['provider'] : undefined;
  const modelOverride =
    typeof opts['model'] === 'string' ? opts['model'] : undefined;
  const srsFile =
    typeof opts['srs'] === 'string' ? opts['srs'] : undefined;

  console.log('');
  console.log(chalk.bold.cyan('  LightSpec — lsp init'));
  console.log(chalk.gray(`  Project: ${targetPath}`));
  if (scope) console.log(chalk.gray(`  Scope:   ${scope}`));
  console.log('');

  // 2. Run brownfield scanner
  const scanSpinner = ora('Scanning project...').start();
  let scanResult;
  try {
    scanResult = await scanProject(targetPath, scope);
    scanSpinner.succeed('Scan complete');
  } catch (err) {
    scanSpinner.fail('Scan failed');
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`  Error: ${message}`));
    process.exit(1);
  }

  // 3. Print scan results
  console.log('');
  const scoreColor =
    scanResult.complexityScore <= 25
      ? chalk.green
      : scanResult.complexityScore <= 65
        ? chalk.yellow
        : chalk.red;

  console.log(chalk.bold('  Scan Results'));
  console.log(`  ${scanResult.summary}`);
  console.log('');
  console.log(`  Complexity score:  ${scoreColor(scanResult.complexityScore + '/100')}`);
  console.log(`  Suggested depth:   ${chalk.bold(scanResult.suggestedDepth)}`);
  console.log(`  Reasoning:         ${chalk.gray(scanResult.reasoning)}`);

  if (scanResult.context.techStack.languages.length > 0) {
    console.log(
      `  Stack:             ${chalk.cyan(
        [
          ...scanResult.context.techStack.languages,
          ...scanResult.context.techStack.frameworks,
        ]
          .slice(0, 5)
          .join(', '),
      )}`,
    );
  }

  // 4. Apply depth override
  const depth = depthOverride ?? scanResult.suggestedDepth;
  if (depthOverride) {
    console.log('');
    console.log(chalk.yellow(`  Depth override: ${depthOverride} (was: ${scanResult.suggestedDepth})`));
  }

  // 5. Print generation plan
  const plan = planDepth(depth);
  console.log('');
  console.log(chalk.bold('  Generation Plan'));
  console.log(`  Depth:       ${chalk.bold(depth)}`);
  console.log(`  Output:      ${chalk.cyan(outputDir)}`);
  console.log(`  Files:       ${chalk.cyan(plan.outputFiles.join(', ') + ', tasks.md')}`);
  console.log(`  Tokens/call: ${chalk.cyan(plan.maxTokensPerCall.toLocaleString())}`);
  console.log(`  Estimated:   ${chalk.cyan(formatEstimate(plan.estimatedSeconds))}`);
  if (srsFile) console.log(`  SRS:         ${chalk.cyan(srsFile)}`);

  // 6. Dry run — exit here
  if (dryRun) {
    console.log('');
    console.log(chalk.yellow('  Dry run — no files written.'));
    console.log('');
    return;
  }

  // 7. Confirm
  if (!skipConfirm) {
    console.log('');
    const ok = await confirm(chalk.bold('  Proceed with generation? [Y/n] '));
    if (!ok) {
      console.log(chalk.yellow('  Aborted.'));
      console.log('');
      return;
    }
  }

  // 8. Read SRS file if provided
  let srsContent: string | undefined;
  if (srsFile) {
    const srsPath = path.resolve(srsFile);
    if (!existsSync(srsPath)) {
      console.error(chalk.red(`  SRS file not found: ${srsPath}`));
      process.exit(1);
    }
    srsContent = await readFile(srsPath, 'utf-8');
  }

  // 9. Resolve provider
  const providerSpinner = ora('Resolving LLM provider...').start();
  let provider;
  try {
    provider = await resolveProvider(providerOverride);
    providerSpinner.succeed(`Using provider: ${chalk.bold(provider.name)}`);
  } catch (err) {
    providerSpinner.fail('No LLM provider available');
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`\n${message}`));
    process.exit(1);
  }

  // 10. Ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  // 11. Generate specs
  console.log('');
  const genSpinner = ora(`Generating ${depth} spec...`).start();
  let genResult;
  try {
    genResult = await generateSpecs({
      projectPath: targetPath,
      depth,
      outputDir,
      provider,
      model: modelOverride,
      srsContent,
      scanResult,
    });
    genSpinner.succeed(`Spec generated (${genResult.durationMs}ms)`);
  } catch (err) {
    genSpinner.fail('Generation failed');
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`  Error: ${message}`));
    process.exit(1);
  }

  // 12. Extract tasks and write tasks.md
  const taskSpinner = ora('Extracting tasks...').start();
  try {
    // Read spec content for task extraction
    const { readFile: readSpecFile } = await import('fs/promises');
    const specFiles = genResult.files;
    let allSpecContent = '';
    for (const f of specFiles) {
      allSpecContent += await readSpecFile(f, 'utf-8');
    }

    const tasks = extractTasks(allSpecContent);
    const tasksMarkdown = formatTasksMarkdown(tasks);
    await writeFile(path.join(outputDir, 'tasks.md'), tasksMarkdown, 'utf-8');
    taskSpinner.succeed(`Tasks extracted: ${tasks.length} task(s) written to tasks.md`);
  } catch (err) {
    taskSpinner.fail('Task extraction failed (non-fatal)');
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.yellow(`  Warning: ${message}`));
  }

  // 13. Summary
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log('');
  console.log(chalk.bold.green('  Done!'));
  console.log(chalk.gray('  ' + '─'.repeat(50)));
  console.log(`  Time:     ${chalk.cyan(elapsed + 's')}`);
  console.log(`  Depth:    ${chalk.cyan(depth)}`);
  console.log(`  Provider: ${chalk.cyan(genResult.provider)}`);
  console.log(`  Output:   ${chalk.cyan(outputDir)}`);
  console.log('');
  console.log(chalk.bold('  Next steps:'));
  console.log(`  ${chalk.cyan('1.')} Review your spec: ${chalk.gray(path.join(outputDir, plan.outputFiles[0]))}`);
  console.log(`  ${chalk.cyan('2.')} Check tasks:      ${chalk.gray('lsp status')}`);
  console.log(
    `  ${chalk.cyan('3.')} Grow into AutoSpec: ${chalk.gray('lsp graduate')} (when ready)`,
  );
  console.log('');
}
