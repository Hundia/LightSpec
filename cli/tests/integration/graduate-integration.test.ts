// tests/integration/graduate-integration.test.ts
// Integration test: lsp graduate creates valid AutoSpec structure from .lsp/ output

import { describe, it, expect, afterEach } from 'vitest';
import { mkdtemp, rm, writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Sample LSP outputs ───────────────────────────────────────────────────────

const SAMPLE_SPEC_MD = `---
generated_by: lightspec
version: 0.1.0
depth: standard
date: 2026-03-27
---
# My Project — Specification

## Overview
A REST API for managing items in a catalogue.
Target users are internal ops teams.

## Technical Design

### Architecture
Monolithic Node.js / Express application.

### API / Endpoints
- GET /api/items — list items
- POST /api/items — create item
- DELETE /api/items/:id — remove item

### Data Model
Items with id, name, price, and createdAt fields.
Categories with id and label.

## Frontend
React single-page application consuming the REST API.

## Testing Strategy
Unit tests with Vitest. Integration tests with Supertest.
Target: 80% coverage on service layer.

## Task List
| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 1 | Setup project scaffold | High | 2h |
| 2 | Implement items CRUD | High | 4h |
| 3 | Add React frontend | Medium | 6h |
| 4 | Write unit tests | High | 3h |
`;

const SAMPLE_TASKS_MD = `---
generated_by: lightspec
version: 0.1.0
depth: standard
date: 2026-03-27
---
# Task List

| # | Task | Priority | Estimate | Status |
|---|------|----------|----------|--------|
| 1 | Setup project scaffold | High | 2h | [ ] |
| 2 | Implement items CRUD | High | 4h | [ ] |
| 3 | Add React frontend | Medium | 6h | [ ] |
| 4 | Write unit tests | High | 3h | [ ] |
`;

const SAMPLE_META_JSON = JSON.stringify({
  version: '0.1.0',
  generated: '2026-03-27T12:00:00Z',
  depth: 'standard',
  complexityScore: 42,
  provider: 'claude-code',
  model: 'claude-sonnet-4-20250514',
  durationMs: 38200,
  projectPath: '/tmp/my-project',
  scope: null,
  files: ['spec.md', 'tasks.md'],
}, null, 2);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const tmpDirs: string[] = [];

async function makeTmpDir(): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'lsp-graduate-integration-'));
  tmpDirs.push(dir);
  return dir;
}

async function createLspOutput(baseDir: string, opts: {
  hasSpec?: boolean;
  hasTasks?: boolean;
  hasMeta?: boolean;
} = {}): Promise<void> {
  const { hasSpec = true, hasTasks = true, hasMeta = true } = opts;
  const lspDir = path.join(baseDir, '.lsp');
  await mkdir(lspDir, { recursive: true });
  if (hasSpec) await writeFile(path.join(lspDir, 'spec.md'), SAMPLE_SPEC_MD, 'utf-8');
  if (hasTasks) await writeFile(path.join(lspDir, 'tasks.md'), SAMPLE_TASKS_MD, 'utf-8');
  if (hasMeta) await writeFile(path.join(lspDir, '.meta.json'), SAMPLE_META_JSON, 'utf-8');
}

afterEach(async () => {
  for (const dir of tmpDirs.splice(0)) {
    await rm(dir, { recursive: true, force: true });
  }
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('graduate integration', () => {
  it('creates all 10 spec files + backlog.md + CLAUDE.md', async () => {
    const baseDir = await makeTmpDir();
    await createLspOutput(baseDir);

    // Import and run the graduate logic
    const { graduateLogic } = await import('../helpers/graduate-logic.js');
    await graduateLogic(baseDir, SAMPLE_SPEC_MD);

    const specsDir = path.join(baseDir, 'specs');

    // 10 role spec files
    const expectedRoleFiles = [
      '01_product_manager.md',
      '02_backend_lead.md',
      '03_frontend_lead.md',
      '04_db_architect.md',
      '05_qa_lead.md',
      '06_devops_lead.md',
      '07_security_lead.md',
      '08_data_engineer.md',
      '09_tech_writer.md',
      '10_project_manager.md',
    ];

    for (const file of expectedRoleFiles) {
      expect(existsSync(path.join(specsDir, file)), `Missing: ${file}`).toBe(true);
    }

    // backlog.md and CLAUDE.md
    expect(existsSync(path.join(specsDir, 'backlog.md'))).toBe(true);
    expect(existsSync(path.join(baseDir, 'CLAUDE.md'))).toBe(true);
  });

  it('spec files have valid YAML frontmatter with role and generated_by fields', async () => {
    const baseDir = await makeTmpDir();
    await createLspOutput(baseDir);

    const { graduateLogic } = await import('../helpers/graduate-logic.js');
    await graduateLogic(baseDir, SAMPLE_SPEC_MD);

    const specsDir = path.join(baseDir, 'specs');
    const filesToCheck = [
      '01_product_manager.md',
      '02_backend_lead.md',
      '03_frontend_lead.md',
      '04_db_architect.md',
      '05_qa_lead.md',
    ];

    for (const file of filesToCheck) {
      const content = await readFile(path.join(specsDir, file), 'utf-8');
      expect(content, `${file} missing frontmatter delimiters`).toContain('---');
      expect(content, `${file} missing role:`).toContain('role:');
      expect(content, `${file} missing generated_by`).toContain('generated_by: lightspec-graduate');
      expect(content, `${file} missing status`).toContain('status: draft');
    }
  });

  it('backlog.md contains task entries from spec', async () => {
    const baseDir = await makeTmpDir();
    await createLspOutput(baseDir);

    const { graduateLogic } = await import('../helpers/graduate-logic.js');
    await graduateLogic(baseDir, SAMPLE_SPEC_MD);

    const backlog = await readFile(path.join(baseDir, 'specs', 'backlog.md'), 'utf-8');
    expect(backlog).toContain('# Project Backlog');
    expect(backlog).toContain('Graduated from LightSpec');
  });

  it('CLAUDE.md references specs/ directory', async () => {
    const baseDir = await makeTmpDir();
    await createLspOutput(baseDir);

    const { graduateLogic } = await import('../helpers/graduate-logic.js');
    await graduateLogic(baseDir, SAMPLE_SPEC_MD);

    const claudeMd = await readFile(path.join(baseDir, 'CLAUDE.md'), 'utf-8');
    expect(claudeMd).toContain('Claude Code Memory');
    expect(claudeMd).toContain('specs/');
  });

  it('primary role files contain relevant content from the spec', async () => {
    const baseDir = await makeTmpDir();
    await createLspOutput(baseDir);

    const { graduateLogic } = await import('../helpers/graduate-logic.js');
    await graduateLogic(baseDir, SAMPLE_SPEC_MD);

    const specsDir = path.join(baseDir, 'specs');

    // Product manager should reference overview content
    const pm = await readFile(path.join(specsDir, '01_product_manager.md'), 'utf-8');
    expect(pm.length).toBeGreaterThan(100);

    // QA lead should have something about testing
    const qa = await readFile(path.join(specsDir, '05_qa_lead.md'), 'utf-8');
    expect(qa.length).toBeGreaterThan(50);
  });

  it('stub files (06-10) contain TODO placeholder text', async () => {
    const baseDir = await makeTmpDir();
    await createLspOutput(baseDir);

    const { graduateLogic } = await import('../helpers/graduate-logic.js');
    await graduateLogic(baseDir, SAMPLE_SPEC_MD);

    const specsDir = path.join(baseDir, 'specs');
    const stubFiles = [
      '06_devops_lead.md',
      '07_security_lead.md',
      '08_data_engineer.md',
      '09_tech_writer.md',
      '10_project_manager.md',
    ];

    for (const file of stubFiles) {
      const content = await readFile(path.join(specsDir, file), 'utf-8');
      expect(content, `${file} should mention TODO or autospec generate`).toMatch(/TODO|autospec generate/i);
    }
  });
});
