// tests/pipeline/generate-spec.test.ts

import { describe, it, expect, afterEach } from 'vitest';
import { mkdtemp, readFile, access } from 'fs/promises';
import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import path from 'path';
import os from 'os';
import { generateSpecs } from '../../src/pipeline/generate-spec.js';
import { MockProvider } from '../helpers/mock-provider.js';
import type { ScanResult } from '../../src/scanner/types.js';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeScanResult(): ScanResult {
  return {
    context: {
      techStack: {
        languages: ['typescript'],
        frameworks: ['express'],
        packageManager: 'npm',
        testFrameworks: ['vitest'],
        buildTools: ['tsup'],
      },
      architecture: {
        pattern: 'monolith',
        entryPoints: ['src/index.ts'],
        sourceDirectories: ['src/'],
        hasApi: true,
        hasFrontend: false,
        hasDatabase: false,
      },
      routes: { routes: [], framework: 'express' },
      docs: { readme: null, existingSpecs: [], otherDocs: [] },
      metrics: { totalFiles: 15, totalLines: 500, sourceFiles: 12, testFiles: 3, testCoverage: null },
    },
    suggestedDepth: 'standard',
    complexityScore: 35,
    summary: 'A small TypeScript/Express API.',
    reasoning: 'Medium complexity — standard spec recommended.',
  };
}

const tmpDirs: string[] = [];

async function makeTmpDir(): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'lsp-test-'));
  tmpDirs.push(dir);
  return dir;
}

afterEach(async () => {
  for (const dir of tmpDirs.splice(0)) {
    await rm(dir, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('generateSpecs', () => {
  it('generates micro spec to temp dir with mock provider', async () => {
    const outputDir = await makeTmpDir();
    const provider = new MockProvider();
    const scanResult = makeScanResult();

    const result = await generateSpecs({
      projectPath: '/fake/project',
      depth: 'micro',
      outputDir,
      provider,
      scanResult,
    });

    expect(result.depth).toBe('micro');
    expect(result.provider).toBe('mock');
    expect(result.files).toHaveLength(1);
    expect(result.files[0]).toContain('spec.md');
    expect(result.durationMs).toBeGreaterThanOrEqual(0);

    // File should exist on disk
    expect(existsSync(result.files[0])).toBe(true);

    // Content should include our mock content
    const content = await readFile(result.files[0], 'utf-8');
    expect(content).toContain('Mock Project');
  });

  it('generates standard spec to temp dir', async () => {
    const outputDir = await makeTmpDir();
    const provider = new MockProvider();
    const scanResult = { ...makeScanResult(), suggestedDepth: 'standard' as const };

    const result = await generateSpecs({
      projectPath: '/fake/project',
      depth: 'standard',
      outputDir,
      provider,
      scanResult,
    });

    expect(result.depth).toBe('standard');
    expect(result.files).toHaveLength(1);
    expect(result.files[0]).toContain('spec.md');

    const content = await readFile(result.files[0], 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });

  it('writes .meta.json with correct fields', async () => {
    const outputDir = await makeTmpDir();
    const provider = new MockProvider();
    const scanResult = makeScanResult();

    await generateSpecs({
      projectPath: '/fake/project',
      depth: 'micro',
      outputDir,
      provider,
      scanResult,
    });

    const metaPath = path.join(outputDir, '.meta.json');
    expect(existsSync(metaPath)).toBe(true);

    const meta = JSON.parse(await readFile(metaPath, 'utf-8'));
    expect(meta.version).toBe('0.1.0');
    expect(meta.depth).toBe('micro');
    expect(meta.provider).toBe('mock');
    expect(meta.projectPath).toBe('/fake/project');
    expect(meta.complexityScore).toBe(35);
    expect(Array.isArray(meta.files)).toBe(true);
    expect(typeof meta.generated).toBe('string');
    expect(typeof meta.durationMs).toBe('number');
  });

  it('dry run returns empty files array without writing', async () => {
    const outputDir = await makeTmpDir();
    const provider = new MockProvider();
    const scanResult = makeScanResult();

    const result = await generateSpecs({
      projectPath: '/fake/project',
      depth: 'standard',
      outputDir,
      provider,
      scanResult,
      dryRun: true,
    });

    expect(result.files).toHaveLength(0);
    expect(result.durationMs).toBe(0);

    // spec.md should NOT exist
    expect(existsSync(path.join(outputDir, 'spec.md'))).toBe(false);
  });
});
