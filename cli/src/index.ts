#!/usr/bin/env node
/**
 * LightSpec (LSP) CLI entry point
 */

import { Command } from 'commander';
import { makeDoneCommand } from './commands/done.js';
import { makeInitBacklogCommand } from './commands/init-backlog.js';

const program = new Command()
  .name('lsp')
  .description('LightSpec — Just enough spec, just fast enough')
  .version('0.1.0');

program
  .command('init [path]')
  .description('Scan project, detect complexity, generate specs')
  .option('--depth <level>', 'Override depth: micro | standard | full')
  .option('--scope <dir>', 'Scope analysis to a subdirectory')
  .option('--srs <file>', 'Provide an SRS/PRD document as input')
  .option('--provider <name>', 'Force LLM provider')
  .option('--model <name>', 'Override model')
  .option('-o, --output <dir>', 'Output directory', '.lsp')
  .option('-y, --yes', 'Skip confirmation prompt')
  .option('--dry-run', 'Show plan without generating')
  .action(async (_path: string | undefined, _opts: Record<string, unknown>) => {
    const { initCommand } = await import('./commands/init.js');
    await initCommand(_path, _opts);
  });

program
  .command('scan [path]')
  .description('Run brownfield scanner only (no LLM calls)')
  .option('--json', 'Output as JSON')
  .option('--scope <dir>', 'Scope to subdirectory')
  .action(async (_path: string | undefined, _opts: Record<string, unknown>) => {
    const { scanCommand } = await import('./commands/scan.js');
    await scanCommand(_path, _opts);
  });

program
  .command('status')
  .description('Show task list progress from .lsp/tasks.md')
  .action(async () => {
    const { statusCommand } = await import('./commands/status.js');
    await statusCommand();
  });

program
  .command('graduate')
  .description('Convert LSP output to full AutoSpec project')
  .option('--srs <file>', 'Use existing SRS for AutoSpec generation')
  .option('--roles <roles>', 'Comma-separated roles to include (e.g. pm,backend,qa)')
  .option('--dry-run', 'Preview what graduate would generate without writing files')
  .option('-y, --yes', 'Skip confirmation prompts (overwrite CLAUDE.md if it exists)')
  .action(async (_opts: Record<string, unknown>) => {
    const { graduateCommand } = await import('./commands/graduate.js');
    await graduateCommand(_opts);
  });

program.addCommand(makeDoneCommand(false));
program.addCommand(makeDoneCommand(true));
program.addCommand(makeInitBacklogCommand());

program.parse(process.argv);
