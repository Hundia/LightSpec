// tests/commands/graduate.test.ts

import { describe, it, expect, afterEach } from 'vitest';
import { mkdtemp, rm, writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SAMPLE_SPEC_MD = `---
generated_by: lightspec
version: 0.1.0
depth: standard
date: 2026-03-27
---
# My Project — Specification

## Overview
This is a sample project for testing graduation.
It demonstrates a basic REST API.

## Technical Design

### Architecture
Monolithic Node.js application.

### API / Endpoints
- GET /api/items
- POST /api/items

### Data Model
Items with id, name, and createdAt fields.

## Frontend
Single-page React application.

## Testing Strategy
Unit tests with Vitest.

## Task List
| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 1 | Setup | High | 2h |
| 2 | Implement | Medium | 4h |
`;

const tmpDirs: string[] = [];

async function makeTmpDir(): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'lsp-graduate-test-'));
  tmpDirs.push(dir);
  return dir;
}

/**
 * Run graduate logic extracted for testing (without process.cwd() dependency).
 * We replicate the core logic from graduateCommand here to test it independently.
 */
async function runGraduateInDir(baseDir: string, specContent: string): Promise<void> {
  const lspDir = path.join(baseDir, '.lsp');
  const specsDir = path.join(baseDir, 'specs');

  await mkdir(lspDir, { recursive: true });
  await mkdir(specsDir, { recursive: true });

  // Write sample spec
  await writeFile(path.join(lspDir, 'spec.md'), specContent, 'utf-8');

  // Write tasks.md
  const tasksContent = `---
generated_by: lightspec
---
# Task List

| # | Task | Priority | Estimate | Status |
|---|------|----------|----------|--------|
| 1 | Setup | High | 2h | [ ] |
| 2 | Implement | Medium | 4h | [ ] |
`;
  await writeFile(path.join(lspDir, 'tasks.md'), tasksContent, 'utf-8');

  // Import and use the section extractor logic
  const { graduateLogic } = await import('../helpers/graduate-logic.js');
  await graduateLogic(baseDir, specContent);
}

afterEach(async () => {
  for (const dir of tmpDirs.splice(0)) {
    await rm(dir, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('graduate command logic', () => {
  it('creates all 10 spec files from a sample .lsp/spec.md', async () => {
    const baseDir = await makeTmpDir();
    await runGraduateInDir(baseDir, SAMPLE_SPEC_MD);

    const specsDir = path.join(baseDir, 'specs');
    const expectedFiles = [
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

    for (const file of expectedFiles) {
      expect(existsSync(path.join(specsDir, file)), `Missing: ${file}`).toBe(true);
    }
  });

  it('each spec has correct YAML frontmatter', async () => {
    const baseDir = await makeTmpDir();
    await runGraduateInDir(baseDir, SAMPLE_SPEC_MD);

    const specsDir = path.join(baseDir, 'specs');
    const specFiles = [
      '01_product_manager.md',
      '02_backend_lead.md',
      '05_qa_lead.md',
      '06_devops_lead.md',
    ];

    for (const file of specFiles) {
      const content = await readFile(path.join(specsDir, file), 'utf-8');
      expect(content, `${file} missing frontmatter`).toContain('---');
      expect(content, `${file} missing role field`).toContain('role:');
      expect(content, `${file} missing generated_by`).toContain('generated_by: lightspec-graduate');
      expect(content, `${file} missing status`).toContain('status: draft');
    }
  });

  it('creates backlog.md and CLAUDE.md', async () => {
    const baseDir = await makeTmpDir();
    await runGraduateInDir(baseDir, SAMPLE_SPEC_MD);

    const specsDir = path.join(baseDir, 'specs');
    expect(existsSync(path.join(specsDir, 'backlog.md'))).toBe(true);
    expect(existsSync(path.join(baseDir, 'CLAUDE.md'))).toBe(true);

    const claudeMd = await readFile(path.join(baseDir, 'CLAUDE.md'), 'utf-8');
    expect(claudeMd).toContain('Claude Code Memory');
    expect(claudeMd).toContain('specs/');

    const backlog = await readFile(path.join(specsDir, 'backlog.md'), 'utf-8');
    expect(backlog).toContain('# Project Backlog');
    expect(backlog).toContain('Graduated from LightSpec');
  });
});
