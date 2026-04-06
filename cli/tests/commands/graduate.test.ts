// tests/commands/graduate.test.ts

import { describe, it, expect, afterEach } from 'vitest';
import { mkdtemp, rm, writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import type { ScanResult } from '../../src/scanner/types.js';

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
async function runGraduateInDir(
  baseDir: string,
  specContent: string,
  opts: { scanResult?: ScanResult | null; roles?: string; dryRun?: boolean } = {},
): Promise<unknown> {
  const lspDir = path.join(baseDir, '.lsp');

  await mkdir(lspDir, { recursive: true });
  // Note: do NOT pre-create specs/ — graduateLogic creates it (unless dryRun)

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
  return graduateLogic(baseDir, specContent, {
    scanResult: opts.scanResult,
    roles: opts.roles,
    dryRun: opts.dryRun,
    projectName: path.basename(baseDir),
  });
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

  // ── Ticket 41.7: Role Filtering ───────────────────────────────────────────

  it('skips 03_frontend_lead when hasFrontend is false in scan result', async () => {
    const baseDir = await makeTmpDir();
    const mockScanResult = {
      context: {
        architecture: { hasFrontend: false, hasDatabase: true },
      },
    } as unknown as ScanResult;

    await runGraduateInDir(baseDir, SAMPLE_SPEC_MD, { scanResult: mockScanResult });

    const specsDir = path.join(baseDir, 'specs');
    expect(existsSync(path.join(specsDir, '03_frontend_lead.md')), '03_frontend_lead.md should be skipped').toBe(false);
    expect(existsSync(path.join(specsDir, '04_db_architect.md')), '04_db_architect.md should exist').toBe(true);
    expect(existsSync(path.join(specsDir, '01_product_manager.md')), '01_product_manager.md should exist').toBe(true);
  });

  it('skips 04_db_architect when hasDatabase is false in scan result', async () => {
    const baseDir = await makeTmpDir();
    const mockScanResult = {
      context: {
        architecture: { hasFrontend: true, hasDatabase: false },
      },
    } as unknown as ScanResult;

    await runGraduateInDir(baseDir, SAMPLE_SPEC_MD, { scanResult: mockScanResult });

    const specsDir = path.join(baseDir, 'specs');
    expect(existsSync(path.join(specsDir, '04_db_architect.md')), '04_db_architect.md should be skipped').toBe(false);
    expect(existsSync(path.join(specsDir, '03_frontend_lead.md')), '03_frontend_lead.md should exist').toBe(true);
  });

  it('skips both frontend and db roles for CLI-only project (hasFrontend:false, hasDatabase:false)', async () => {
    const baseDir = await makeTmpDir();
    const mockScanResult = {
      context: {
        architecture: { hasFrontend: false, hasDatabase: false },
      },
    } as unknown as ScanResult;

    await runGraduateInDir(baseDir, SAMPLE_SPEC_MD, { scanResult: mockScanResult });

    const specsDir = path.join(baseDir, 'specs');
    expect(existsSync(path.join(specsDir, '03_frontend_lead.md'))).toBe(false);
    expect(existsSync(path.join(specsDir, '04_db_architect.md'))).toBe(false);
    // PM, Backend, QA should still be created
    expect(existsSync(path.join(specsDir, '01_product_manager.md'))).toBe(true);
    expect(existsSync(path.join(specsDir, '02_backend_lead.md'))).toBe(true);
    expect(existsSync(path.join(specsDir, '05_qa_lead.md'))).toBe(true);
  });

  // ── Ticket 41.7: Project Name Substitution ────────────────────────────────

  it('CLAUDE.md contains actual project directory name (not [Project Name])', async () => {
    const baseDir = await makeTmpDir();
    await runGraduateInDir(baseDir, SAMPLE_SPEC_MD);

    const claudeMd = await readFile(path.join(baseDir, 'CLAUDE.md'), 'utf-8');
    // Must NOT contain the literal placeholder
    expect(claudeMd).not.toContain('[Project Name]');
    // Must contain the actual directory name
    const projectName = path.basename(baseDir);
    expect(claudeMd).toContain(projectName);
    expect(claudeMd).toContain(`Claude Code Memory — ${projectName}`);
  });

  // ── Ticket 41.7: Dry Run ──────────────────────────────────────────────────

  it('--dry-run: no files are written, preview array is returned', async () => {
    const baseDir = await makeTmpDir();
    const preview = await runGraduateInDir(baseDir, SAMPLE_SPEC_MD, { dryRun: true });

    // No files should have been created
    expect(existsSync(path.join(baseDir, 'CLAUDE.md')), 'CLAUDE.md must not be written in dry-run').toBe(false);
    expect(existsSync(path.join(baseDir, 'specs')), 'specs/ must not be created in dry-run').toBe(false);

    // Preview array should contain entries
    expect(Array.isArray(preview)).toBe(true);
    const items = preview as Array<{ file: string; action: string }>;
    expect(items.length).toBeGreaterThan(0);
  });

  it('--dry-run: preview contains EXTRACTED and SKIPPED actions', async () => {
    const baseDir = await makeTmpDir();
    const mockScanResult = {
      context: {
        architecture: { hasFrontend: false, hasDatabase: false },
      },
    } as unknown as ScanResult;

    const preview = await runGraduateInDir(baseDir, SAMPLE_SPEC_MD, {
      dryRun: true,
      scanResult: mockScanResult,
    });

    const items = preview as Array<{ file: string; action: string }>;
    const actions = items.map(i => i.action);

    expect(actions).toContain('EXTRACTED');
    expect(actions).toContain('SKIPPED');
    expect(actions).toContain('WRITE'); // for backlog.md and CLAUDE.md

    // Verify skipped files
    const skipped = items.filter(i => i.action === 'SKIPPED').map(i => i.file);
    expect(skipped).toContain('03_frontend_lead.md');
    expect(skipped).toContain('04_db_architect.md');
  });
});
