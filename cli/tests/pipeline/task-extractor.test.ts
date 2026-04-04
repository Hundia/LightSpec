// tests/pipeline/task-extractor.test.ts

import { describe, it, expect } from 'vitest';
import { extractTasks, formatTasksMarkdown } from '../../src/pipeline/task-extractor.js';

const TABLE_SPEC = `
# My Project — Specification

## Overview
Some overview text here.

## Task List
| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 1 | Setup project | High | 2h |
| 2 | Implement API | Medium | 4h |
| 3 | Write tests | Low | 1h |
`;

const CHECKLIST_SPEC = `
# My Project — Micro Spec

## Acceptance Criteria
- [x] Project compiles without errors
- [ ] API returns 200 on health check
- [ ] Tests pass with coverage > 80%
`;

const EMPTY_SPEC = `
# My Project — Spec

## Overview
Just some text, no tasks here at all.

## Notes
Nothing to track.
`;

describe('extractTasks', () => {
  it('extracts tasks from markdown table format', () => {
    const tasks = extractTasks(TABLE_SPEC);
    expect(tasks).toHaveLength(3);
    expect(tasks[0].id).toBe(1);
    expect(tasks[0].title).toBe('Setup project');
    expect(tasks[0].priority).toBe('high');
    expect(tasks[0].estimate).toBe('2h');
    expect(tasks[0].done).toBe(false);
    expect(tasks[1].title).toBe('Implement API');
    expect(tasks[2].title).toBe('Write tests');
    expect(tasks[2].priority).toBe('low');
  });

  it('extracts tasks from checklist format', () => {
    const tasks = extractTasks(CHECKLIST_SPEC);
    expect(tasks).toHaveLength(3);
    expect(tasks[0].done).toBe(true);
    expect(tasks[0].title).toBe('Project compiles without errors');
    expect(tasks[1].done).toBe(false);
    expect(tasks[1].title).toBe('API returns 200 on health check');
    expect(tasks[2].done).toBe(false);
  });

  it('returns empty array for spec with no tasks', () => {
    const tasks = extractTasks(EMPTY_SPEC);
    expect(tasks).toHaveLength(0);
  });
});

describe('formatTasksMarkdown', () => {
  it('produces valid markdown with YAML frontmatter and table', () => {
    const tasks = extractTasks(TABLE_SPEC);
    const md = formatTasksMarkdown(tasks);

    // Should have YAML frontmatter
    expect(md).toContain('---');
    expect(md).toContain('generated_by: lightspec');

    // Should have header
    expect(md).toContain('# Task List');

    // Should have table header
    expect(md).toContain('| # | Task |');

    // Should have task rows
    expect(md).toContain('Setup project');
    expect(md).toContain('Implement API');
    expect(md).toContain('Write tests');
  });

  it('handles empty task list gracefully', () => {
    const md = formatTasksMarkdown([]);
    expect(md).toContain('# Task List');
    expect(md).toContain('No tasks found');
  });
});
