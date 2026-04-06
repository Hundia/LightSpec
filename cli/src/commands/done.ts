/**
 * lsp done / lsp undone — mark a task as done or not-done in .lsp/tasks.md
 */

import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
 * Walk up from startDir until a .lsp/ directory is found.
 * Returns the full path to .lsp/ or null if not found.
 */
export function findLspDir(startDir: string): string | null {
  let dir = startDir;
  while (true) {
    const candidate = path.join(dir, '.lsp');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function makeDoneCommand(undo = false): Command {
  const cmd = new Command(undo ? 'undone' : 'done');
  cmd
    .description(
      undo
        ? 'Mark a task as not done in .lsp/tasks.md'
        : 'Mark a task as done in .lsp/tasks.md',
    )
    .argument('<id>', 'Task number (e.g. 3)')
    .option('--dir <path>', 'Path to project directory')
    .action(async (id: string, opts: { dir?: string }) => {
      const lspDir = opts.dir
        ? path.join(path.resolve(opts.dir), '.lsp')
        : findLspDir(process.cwd());

      if (!lspDir || !fs.existsSync(path.join(lspDir, 'tasks.md'))) {
        console.error(chalk.red('No .lsp/tasks.md found. Run `lsp init` first.'));
        process.exit(1);
      }

      const tasksPath = path.join(lspDir, 'tasks.md');
      const content = await fs.readFile(tasksPath, 'utf-8');

      const taskNum = parseInt(id, 10);
      if (isNaN(taskNum)) {
        console.error(chalk.red(`Invalid task ID: ${id}`));
        process.exit(1);
      }

      let found = false;
      const lines = content.split('\n').map(line => {
        const match = line.match(/^\|\s*(\d+)\s*\|/);
        if (match && parseInt(match[1], 10) === taskNum) {
          found = true;
          return undo
            ? line.replace(/\[x\]/gi, '[ ]')
            : line.replace(/\[ \]/, '[x]');
        }
        return line;
      });

      if (!found) {
        console.error(chalk.red(`Task ${taskNum} not found in tasks.md`));
        process.exit(1);
      }

      await fs.writeFile(tasksPath, lines.join('\n'));
      console.log(chalk.green(`✓ Task ${taskNum} ${undo ? 'unmarked' : 'marked done'}`));
    });

  return cmd;
}
