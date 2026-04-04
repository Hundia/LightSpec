/**
 * lsp status — show task list progress from .lsp/tasks.md
 */

import path from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import chalk from 'chalk';

interface TaskEntry {
  id: string;
  title: string;
  priority: string;
  estimate: string;
  done: boolean;
}

function parseTasksMarkdown(content: string): TaskEntry[] {
  const tasks: TaskEntry[] = [];
  const lines = content.split('\n');

  // Table format: | # | Task | Priority | Estimate | Done |
  const tableRowRegex = /^\s*\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]*)\s*\|/;

  for (const line of lines) {
    const match = tableRowRegex.exec(line);
    if (!match) continue;

    const id = match[1].trim();
    const title = match[2].trim();
    const priority = match[3].trim();
    const estimate = match[4].trim();
    const doneCell = match[5].trim();

    // Skip header row
    if (title.toLowerCase() === 'task' || title.includes('---')) continue;

    const done =
      doneCell.toLowerCase().includes('[x]') ||
      doneCell.toLowerCase() === 'true' ||
      doneCell.toLowerCase() === 'done';

    tasks.push({ id, title, priority, estimate, done });
  }

  return tasks;
}

export async function statusCommand(): Promise<void> {
  const tasksPath = path.join(process.cwd(), '.lsp', 'tasks.md');

  if (!existsSync(tasksPath)) {
    console.log('');
    console.log(chalk.yellow('  No LightSpec output found.'));
    console.log(chalk.gray(`  Expected: ${tasksPath}`));
    console.log('');
    console.log(`  Run ${chalk.cyan('lsp init')} to generate a spec and task list.`);
    console.log('');
    return;
  }

  const content = await readFile(tasksPath, 'utf-8');
  const tasks = parseTasksMarkdown(content);

  if (tasks.length === 0) {
    console.log('');
    console.log(chalk.yellow('  No tasks found in tasks.md'));
    console.log(chalk.gray(`  File: ${tasksPath}`));
    console.log('');
    return;
  }

  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct = Math.round((done / total) * 100);

  // Progress bar
  const barWidth = 30;
  const filled = Math.round((done / total) * barWidth);
  const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);
  const barColor = pct === 100 ? chalk.green : pct >= 50 ? chalk.yellow : chalk.cyan;

  console.log('');
  console.log(chalk.bold.cyan('  LightSpec Task Status'));
  console.log(chalk.gray('  ' + '─'.repeat(50)));
  console.log('');
  console.log(`  Progress: ${barColor(bar)} ${chalk.bold(pct + '%')} (${done}/${total} done)`);
  console.log('');
  console.log(chalk.bold('  Tasks:'));
  console.log('');

  for (const task of tasks) {
    const check = task.done ? chalk.green('✓') : chalk.gray('○');
    const titleStr = task.done ? chalk.gray(task.title) : chalk.white(task.title);
    const priorityFn =
      task.priority.toLowerCase() === 'high'
        ? chalk.red
        : task.priority.toLowerCase() === 'medium'
          ? chalk.yellow
          : chalk.gray;
    const priorityLabel = priorityFn(`[${task.priority}]`);
    const meta = `${priorityLabel} ${chalk.gray(task.estimate)}`;

    console.log(`  ${check} ${chalk.gray('#' + task.id).padEnd(8)} ${titleStr.padEnd(40)} ${meta}`);
  }

  console.log('');

  if (pct === 100) {
    console.log(chalk.bold.green('  All tasks complete!'));
    console.log(`  Consider graduating to AutoSpec: ${chalk.cyan('lsp graduate')}`);
  } else {
    const remaining = total - done;
    console.log(chalk.gray(`  ${remaining} task(s) remaining.`));
    console.log(
      chalk.gray(
        `  Mark tasks done by editing ${chalk.cyan('.lsp/tasks.md')} (change [ ] to [x])`,
      ),
    );
  }

  console.log('');
}
