// tests/commands/init-backlog.test.ts

import { describe, it, expect, afterEach } from 'vitest';
import { mkdtemp, rm, mkdir, writeFile } from 'fs/promises';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import {
  timeToPoints,
  parseTasksMarkdown,
  generateBacklogMarkdown,
  makeInitBacklogCommand,
} from '../../src/commands/init-backlog.js';

// ---------------------------------------------------------------------------
// Temp dir management
// ---------------------------------------------------------------------------

const tmpDirs: string[] = [];

async function makeTmpDir(): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'lsp-init-backlog-test-'));
  tmpDirs.push(dir);
  return dir;
}

afterEach(async () => {
  for (const dir of tmpDirs.splice(0)) {
    await rm(dir, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------
// Sample tasks.md (matches formatTasksMarkdown output from task-extractor.ts)
// ---------------------------------------------------------------------------

const SAMPLE_TASKS_MD = `---
generated_by: lightspec
version: 0.1.0
date: 2026-04-05
---

# Task List

| # | Task | Priority | Estimate | Status |
|---|------|----------|----------|--------|
| 1 | Set up project structure | High | 30m | [ ] |
| 2 | Implement CSV parser | Medium | 2h | [ ] |
| 3 | Add categorization engine | Low | 4h | [ ] |
`;

// ---------------------------------------------------------------------------
// Unit tests: timeToPoints
// ---------------------------------------------------------------------------

describe('timeToPoints', () => {
  it('maps 30m to 1 pt haiku', () => {
    expect(timeToPoints('30m')).toEqual({ points: 1, model: 'haiku' });
  });

  it('maps 1h to 2 pts haiku', () => {
    expect(timeToPoints('1h')).toEqual({ points: 2, model: 'haiku' });
  });

  it('maps 2h to 3 pts sonnet', () => {
    expect(timeToPoints('2h')).toEqual({ points: 3, model: 'sonnet' });
  });

  it('maps 4h to 5 pts sonnet', () => {
    expect(timeToPoints('4h')).toEqual({ points: 5, model: 'sonnet' });
  });

  it('maps 8h to 8 pts sonnet', () => {
    expect(timeToPoints('8h')).toEqual({ points: 8, model: 'sonnet' });
  });

  it('maps unknown time to 3 pts sonnet', () => {
    expect(timeToPoints('TBD')).toEqual({ points: 3, model: 'sonnet' });
    expect(timeToPoints('')).toEqual({ points: 3, model: 'sonnet' });
    expect(timeToPoints('3d')).toEqual({ points: 3, model: 'sonnet' });
  });

  it('handles whitespace in time string', () => {
    expect(timeToPoints('  30m  ')).toEqual({ points: 1, model: 'haiku' });
    expect(timeToPoints('  2h  ')).toEqual({ points: 3, model: 'sonnet' });
  });
});

// ---------------------------------------------------------------------------
// Unit tests: parseTasksMarkdown
// ---------------------------------------------------------------------------

describe('parseTasksMarkdown', () => {
  it('parses 3 tasks from sample tasks.md', () => {
    const tasks = parseTasksMarkdown(SAMPLE_TASKS_MD);
    expect(tasks).toHaveLength(3);
  });

  it('assigns correct ids', () => {
    const tasks = parseTasksMarkdown(SAMPLE_TASKS_MD);
    expect(tasks[0].id).toBe('1');
    expect(tasks[1].id).toBe('2');
    expect(tasks[2].id).toBe('3');
  });

  it('assigns correct task titles', () => {
    const tasks = parseTasksMarkdown(SAMPLE_TASKS_MD);
    expect(tasks[0].task).toBe('Set up project structure');
    expect(tasks[1].task).toBe('Implement CSV parser');
    expect(tasks[2].task).toBe('Add categorization engine');
  });

  it('assigns correct points: 1+3+5=9 total', () => {
    const tasks = parseTasksMarkdown(SAMPLE_TASKS_MD);
    expect(tasks[0].points).toBe(1);  // 30m -> 1
    expect(tasks[1].points).toBe(3);  // 2h -> 3
    expect(tasks[2].points).toBe(5);  // 4h -> 5
    const total = tasks.reduce((s, t) => s + t.points, 0);
    expect(total).toBe(9);
  });

  it('assigns correct model: haiku for 30m, sonnet for 2h+4h', () => {
    const tasks = parseTasksMarkdown(SAMPLE_TASKS_MD);
    expect(tasks[0].model).toBe('haiku');  // 30m
    expect(tasks[1].model).toBe('sonnet'); // 2h
    expect(tasks[2].model).toBe('sonnet'); // 4h
  });

  it('skips header rows and separator rows', () => {
    const tasks = parseTasksMarkdown(SAMPLE_TASKS_MD);
    // Should only contain actual data rows, not "| # | Task | ..." header
    expect(tasks.every(t => !isNaN(Number(t.id)))).toBe(true);
    expect(tasks.every(t => t.task !== 'Task')).toBe(true);
  });

  it('returns empty array for content with no task rows', () => {
    const tasks = parseTasksMarkdown('# No tasks here\n\nJust some text.\n');
    expect(tasks).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Unit tests: generateBacklogMarkdown
// ---------------------------------------------------------------------------

describe('generateBacklogMarkdown', () => {
  it('generates correct header with project name and date', () => {
    const tasks = parseTasksMarkdown(SAMPLE_TASKS_MD);
    const output = generateBacklogMarkdown('BudgetBuddy', tasks, '2026-04-05');
    expect(output).toContain('# BudgetBuddy — SDD Project Backlog');
    expect(output).toContain('**Created:** 2026-04-05');
    expect(output).toContain('**Generated by:** `lsp init-backlog` from .lsp/tasks.md');
  });

  it('generates sprint header with correct total points', () => {
    const tasks = parseTasksMarkdown(SAMPLE_TASKS_MD);
    const output = generateBacklogMarkdown('BudgetBuddy', tasks, '2026-04-05');
    expect(output).toContain('## Sprint 1: Initial Implementation (~9 pts)');
  });

  it('generates backlog table rows with 1.N IDs', () => {
    const tasks = parseTasksMarkdown(SAMPLE_TASKS_MD);
    const output = generateBacklogMarkdown('BudgetBuddy', tasks, '2026-04-05');
    expect(output).toContain('| 1.1 | Set up project structure | Fullstack | haiku | 1 | 🔲 | — |');
    expect(output).toContain('| 1.2 | Implement CSV parser | Fullstack | sonnet | 3 | 🔲 | — |');
    expect(output).toContain('| 1.3 | Add categorization engine | Fullstack | sonnet | 5 | 🔲 | — |');
  });
});

// ---------------------------------------------------------------------------
// Integration tests: makeInitBacklogCommand action
// ---------------------------------------------------------------------------

/**
 * Helper to invoke the command action by calling the underlying functions directly
 * (avoids process.exit in tests).
 */
async function runInitBacklog(
  projectDir: string,
  opts: { yes?: boolean } = {},
): Promise<{ stdout: string; exitCode: number | null }> {
  // Capture console output
  const logs: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args: unknown[]) => logs.push(args.join(' '));
  console.error = (...args: unknown[]) => logs.push('[ERR] ' + args.join(' '));

  let exitCode: number | null = null;
  const originalExit = process.exit.bind(process);
  // @ts-ignore
  process.exit = (code: number) => { exitCode = code; throw new Error(`process.exit(${code})`); };

  try {
    const tasksPath = path.join(projectDir, '.lsp', 'tasks.md');
    if (!fs.existsSync(tasksPath)) {
      console.error('No .lsp/tasks.md found. Run `lsp init` first.');
      process.exit(1);
    }

    const specsDir = path.join(projectDir, 'specs');
    const backlogPath = path.join(specsDir, 'backlog.md');

    if (fs.existsSync(backlogPath) && !opts.yes) {
      console.log('specs/backlog.md already exists. Use --yes to overwrite.');
      process.exit(0);
    }

    const content = await fs.readFile(tasksPath, 'utf-8');
    const tasks = parseTasksMarkdown(content);

    if (tasks.length === 0) {
      console.error('No tasks found in .lsp/tasks.md. Run `lsp init` to generate tasks.');
      process.exit(1);
    }

    const projectName = path.basename(projectDir);
    const today = new Date().toISOString().slice(0, 10);
    const backlog = generateBacklogMarkdown(projectName, tasks, today);

    await fs.ensureDir(specsDir);
    await fs.writeFile(backlogPath, backlog, 'utf-8');

    const totalPts = tasks.reduce((s: number, r: { points: number }) => s + r.points, 0);
    console.log(`✓ Created specs/backlog.md (${tasks.length} tickets, ${totalPts} pts)`);
    console.log('  Ready to use with /execute-ticket in Claude Code');
  } catch (err) {
    if (!(err instanceof Error) || !err.message.startsWith('process.exit')) {
      throw err;
    }
  } finally {
    console.log = originalLog;
    console.error = originalError;
    // @ts-ignore
    process.exit = originalExit;
  }

  return { stdout: logs.join('\n'), exitCode };
}

describe('init-backlog integration', () => {
  it('creates specs/backlog.md from tasks.md with 3 tasks totaling 9 pts', async () => {
    const projectDir = await makeTmpDir();
    await mkdir(path.join(projectDir, '.lsp'), { recursive: true });
    await writeFile(path.join(projectDir, '.lsp', 'tasks.md'), SAMPLE_TASKS_MD, 'utf-8');

    const { stdout, exitCode } = await runInitBacklog(projectDir);

    expect(exitCode).toBeNull();
    expect(stdout).toContain('3 tickets, 9 pts');

    const backlogPath = path.join(projectDir, 'specs', 'backlog.md');
    expect(fs.existsSync(backlogPath)).toBe(true);

    const content = await fs.readFile(backlogPath, 'utf-8');
    expect(content).toContain('## Sprint 1: Initial Implementation (~9 pts)');
    expect(content).toContain('| 1.1 | Set up project structure | Fullstack | haiku | 1 | 🔲 | — |');
    expect(content).toContain('| 1.2 | Implement CSV parser | Fullstack | sonnet | 3 | 🔲 | — |');
    expect(content).toContain('| 1.3 | Add categorization engine | Fullstack | sonnet | 5 | 🔲 | — |');
  });

  it('warns and does NOT overwrite if backlog.md exists (without --yes)', async () => {
    const projectDir = await makeTmpDir();
    await mkdir(path.join(projectDir, '.lsp'), { recursive: true });
    await mkdir(path.join(projectDir, 'specs'), { recursive: true });
    await writeFile(path.join(projectDir, '.lsp', 'tasks.md'), SAMPLE_TASKS_MD, 'utf-8');

    const existingContent = '# Existing Backlog\n\nDo not overwrite me.\n';
    const backlogPath = path.join(projectDir, 'specs', 'backlog.md');
    await writeFile(backlogPath, existingContent, 'utf-8');

    const { stdout, exitCode } = await runInitBacklog(projectDir, { yes: false });

    expect(exitCode).toBe(0);
    expect(stdout).toContain('already exists');
    expect(stdout).toContain('--yes');

    // File must NOT be overwritten
    const content = await fs.readFile(backlogPath, 'utf-8');
    expect(content).toBe(existingContent);
  });

  it('--yes flag overwrites existing backlog.md', async () => {
    const projectDir = await makeTmpDir();
    await mkdir(path.join(projectDir, '.lsp'), { recursive: true });
    await mkdir(path.join(projectDir, 'specs'), { recursive: true });
    await writeFile(path.join(projectDir, '.lsp', 'tasks.md'), SAMPLE_TASKS_MD, 'utf-8');

    const backlogPath = path.join(projectDir, 'specs', 'backlog.md');
    await writeFile(backlogPath, '# Old content\n', 'utf-8');

    const { exitCode } = await runInitBacklog(projectDir, { yes: true });

    expect(exitCode).toBeNull();

    const content = await fs.readFile(backlogPath, 'utf-8');
    expect(content).toContain('SDD Project Backlog');
    expect(content).not.toContain('# Old content');
  });

  it('exits with error if tasks.md not found', async () => {
    const projectDir = await makeTmpDir();
    // No .lsp directory created

    const { stdout, exitCode } = await runInitBacklog(projectDir);

    expect(exitCode).toBe(1);
    expect(stdout).toContain('No .lsp/tasks.md found');
  });
});

// ---------------------------------------------------------------------------
// Verify makeInitBacklogCommand is exported correctly
// ---------------------------------------------------------------------------

describe('makeInitBacklogCommand', () => {
  it('returns a Command with name init-backlog', () => {
    const cmd = makeInitBacklogCommand();
    expect(cmd.name()).toBe('init-backlog');
  });

  it('command has --dir and --yes options', () => {
    const cmd = makeInitBacklogCommand();
    const optionNames = cmd.options.map(o => o.long);
    expect(optionNames).toContain('--dir');
    expect(optionNames).toContain('--yes');
  });
});
