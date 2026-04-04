// tests/integration/e2e-autospec.test.ts
// E2E: LSP scanning the LightSpec repo (the project scanning itself)

import { describe, it, expect } from 'vitest';
import { scanProject } from '../../src/scanner/complexity-scorer.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lightspecRoot = '/opt/LightSpec';

// E2E tests scan a real repo — allow generous timeouts
const E2E_TIMEOUT = 60_000; // 60s

describe('E2E: LSP scanning LightSpec repo', () => {
  it('correctly identifies LightSpec as a non-trivial project', async () => {
    const result = await scanProject(lightspecRoot);

    // LightSpec root has no package.json (it's a standalone repo),
    // so language detection uses directory/file scanning, not manifest parsing.
    // Architecture detection without a root manifest returns unknown or modular.
    expect(['monorepo', 'modular', 'unknown']).toContain(result.context.architecture.pattern);

    // Should have at least some complexity (the cli/ subdir has TypeScript)
    expect(result.context.metrics.totalFiles).toBeGreaterThan(10);
  }, E2E_TIMEOUT);

  it('scoped scan of cli/ directory works correctly', async () => {
    const [fullResult, cliResult] = await Promise.all([
      scanProject(lightspecRoot),
      scanProject(lightspecRoot, 'cli'),
    ]);

    expect(cliResult.context.techStack.languages).toContain('typescript');
    // CLI by itself should be less complex than the full repo
    expect(cliResult.complexityScore).toBeLessThanOrEqual(fullResult.complexityScore);
  }, E2E_TIMEOUT);

  it('scoped scan of cli/ detects the LSP project itself', async () => {
    const result = await scanProject(lightspecRoot, 'cli');
    expect(result.context.techStack.languages).toContain('typescript');
    expect(result.context.techStack.testFrameworks).toContain('vitest');
  }, E2E_TIMEOUT);

  it('full scan detects test files', async () => {
    const result = await scanProject(lightspecRoot);
    // LightSpec has test files in cli/tests/
    expect(result.context.metrics.testFiles).toBeGreaterThan(5);
  }, E2E_TIMEOUT);

  it('full scan has meaningful file count', async () => {
    const result = await scanProject(lightspecRoot);
    expect(result.context.metrics.totalFiles).toBeGreaterThan(20);
  }, E2E_TIMEOUT);
});
