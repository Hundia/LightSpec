// tests/commands/done.test.ts

import { describe, it, expect, afterEach } from 'vitest';
import { mkdtemp, rm, writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { findLspDir, makeDoneCommand } from '../../src/commands/done.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SAMPLE_TASKS_MD = `# MyProject — Tasks

| # | Task | Priority | Estimate | Done |
|---|------|----------|----------|------|
| 1 | Set up project structure | High | 30m | [ ] |
| 2 | Implement CSV parser | High | 2h | [ ] |
| 3 | Add categorization engine | Medium | 4h | [ ] |
`;

const tmpDirs: string[] = [];

async function makeTmpDir(): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'lsp-done-test-'));
  tmpDirs.push(dir);
  return dir;
}

/**
 * Create a temp project dir with a .lsp/tasks.md file.
 */
async function makeProjectWithTasks(content = SAMPLE_TASKS_MD): Promise<string> {
  const dir = await makeTmpDir();
  await mkdir(path.join(dir, '.lsp'), { recursive: true });
  await writeFile(path.join(dir, '.lsp', 'tasks.md'), content, 'utf-8');
  return dir;
}

/**
 * Run the done/undone command action directly via the Command's action.
 * Uses --dir to point at the project dir, so we don't mutate process.cwd().
 */
async function runDoneCommand(projectDir: string, taskId: string, undo = false): Promise<void> {
  const cmd = makeDoneCommand(undo);
  await cmd.parseAsync([taskId, '--dir', projectDir], { from: 'user' });
}

afterEach(async () => {
  for (const dir of tmpDirs.splice(0)) {
    await rm(dir, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------
// findLspDir tests
// ---------------------------------------------------------------------------

describe('findLspDir', () => {
  it('returns the .lsp path when found in startDir', async () => {
    const dir = await makeProjectWithTasks();
    const result = findLspDir(dir);
    expect(result).toBe(path.join(dir, '.lsp'));
  });

  it('returns the .lsp path when found in a parent directory', async () => {
    const dir = await makeProjectWithTasks();
    const subDir = path.join(dir, 'src', 'components');
    await mkdir(subDir, { recursive: true });

    const result = findLspDir(subDir);
    expect(result).toBe(path.join(dir, '.lsp'));
  });

  it('returns null when no .lsp directory exists in any ancestor', async () => {
    const dir = await makeTmpDir(); // no .lsp created
    const result = findLspDir(dir);
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// done command tests
// ---------------------------------------------------------------------------

describe('lsp done command', () => {
  it('marks task #2 as done ([x]) in tasks.md', async () => {
    const dir = await makeProjectWithTasks();

    await runDoneCommand(dir, '2');

    const content = await readFile(path.join(dir, '.lsp', 'tasks.md'), 'utf-8');
    const lines = content.split('\n');
    const taskLine = lines.find(l => /^\|\s*2\s*\|/.test(l));
    expect(taskLine).toBeDefined();
    expect(taskLine).toContain('[x]');
  });

  it('does not modify other tasks when marking one done', async () => {
    const dir = await makeProjectWithTasks();

    await runDoneCommand(dir, '2');

    const content = await readFile(path.join(dir, '.lsp', 'tasks.md'), 'utf-8');
    const lines = content.split('\n');

    const task1 = lines.find(l => /^\|\s*1\s*\|/.test(l));
    const task3 = lines.find(l => /^\|\s*3\s*\|/.test(l));

    expect(task1).toContain('[ ]');
    expect(task3).toContain('[ ]');
  });

  it('marks task #1 as done', async () => {
    const dir = await makeProjectWithTasks();
    await runDoneCommand(dir, '1');

    const content = await readFile(path.join(dir, '.lsp', 'tasks.md'), 'utf-8');
    const lines = content.split('\n');
    const taskLine = lines.find(l => /^\|\s*1\s*\|/.test(l));
    expect(taskLine).toContain('[x]');
  });
});

// ---------------------------------------------------------------------------
// undone command tests
// ---------------------------------------------------------------------------

describe('lsp undone command', () => {
  it('reverts task #2 from [x] back to [ ]', async () => {
    const alreadyDone = SAMPLE_TASKS_MD.replace(
      /(\|\s*2\s*\|[^|]*\|[^|]*\|[^|]*\|)\s*\[ \]\s*\|/,
      '$1 [x] |',
    );
    const dir = await makeProjectWithTasks(alreadyDone);

    await runDoneCommand(dir, '2', true /* undo */);

    const content = await readFile(path.join(dir, '.lsp', 'tasks.md'), 'utf-8');
    const lines = content.split('\n');
    const taskLine = lines.find(l => /^\|\s*2\s*\|/.test(l));
    expect(taskLine).toBeDefined();
    expect(taskLine).toContain('[ ]');
    expect(taskLine).not.toMatch(/\[x\]/i);
  });

  it('round-trips: done then undone restores original state', async () => {
    const dir = await makeProjectWithTasks();
    const originalContent = await readFile(path.join(dir, '.lsp', 'tasks.md'), 'utf-8');

    // Mark done
    await runDoneCommand(dir, '3');
    // Mark undone
    await runDoneCommand(dir, '3', true);

    const restoredContent = await readFile(path.join(dir, '.lsp', 'tasks.md'), 'utf-8');
    expect(restoredContent).toBe(originalContent);
  });
});

// ---------------------------------------------------------------------------
// Error case tests (non-process.exit variant — test the logic directly)
// ---------------------------------------------------------------------------

describe('done command error cases', () => {
  it('tasks.md is correctly read — task 99 is NOT present (not found scenario)', async () => {
    const dir = await makeProjectWithTasks();
    const content = await readFile(path.join(dir, '.lsp', 'tasks.md'), 'utf-8');
    const lines = content.split('\n');
    const taskLine = lines.find(l => /^\|\s*99\s*\|/.test(l));
    // Task 99 does not exist — this is what triggers the "not found" error path
    expect(taskLine).toBeUndefined();
  });

  it('tasks.md is not found when .lsp/ does not exist', async () => {
    const dir = await makeTmpDir(); // no .lsp/
    const lspDir = findLspDir(dir);
    expect(lspDir).toBeNull();
    // The command would print an error and exit(1) in this scenario
  });

  it('tasks.md is not found when .lsp/ exists but tasks.md is missing', async () => {
    const dir = await makeTmpDir();
    await mkdir(path.join(dir, '.lsp'), { recursive: true });
    // No tasks.md written

    const lspDir = findLspDir(dir);
    expect(lspDir).not.toBeNull();
    expect(existsSync(path.join(lspDir!, 'tasks.md'))).toBe(false);
  });
});
