// tests/integration/scan-integration.test.ts
// Integration tests for scanProject() on real fixture directories

import { describe, it, expect } from 'vitest';
import { scanProject } from '../../src/scanner/complexity-scorer.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, '../fixtures');

describe('scanProject integration', () => {
  it('detects Node.js project correctly', async () => {
    const result = await scanProject(path.join(fixturesDir, 'node-project'));
    expect(result.context.techStack.languages).toContain('typescript');
    expect(result.context.techStack.frameworks).toContain('express');
    expect(result.context.techStack.testFrameworks).toContain('vitest');
    expect(result.suggestedDepth).toBe('micro'); // small fixture
  });

  it('detects Python project correctly', async () => {
    const result = await scanProject(path.join(fixturesDir, 'python-project'));
    expect(result.context.techStack.languages).toContain('python');
    expect(result.context.techStack.frameworks).toContain('flask');
  });

  it('handles empty project gracefully', async () => {
    const result = await scanProject(path.join(fixturesDir, 'empty-project'));
    expect(result.suggestedDepth).toBe('micro');
    expect(result.complexityScore).toBeLessThan(10);
  });

  it('detects Go project correctly', async () => {
    const result = await scanProject(path.join(fixturesDir, 'go-project'));
    expect(result.context.techStack.languages).toContain('go');
  });

  it('scan with --scope restricts to subdirectory', async () => {
    // Scan the lsp project itself, scoped to src/scanner/
    const result = await scanProject(
      path.join(__dirname, '../..'),
      'src/scanner'
    );
    expect(result.context.metrics.totalFiles).toBeGreaterThan(0);
    // Scoped scan should have fewer files than full project
    const fullResult = await scanProject(path.join(__dirname, '../..'));
    expect(result.context.metrics.totalFiles).toBeLessThan(
      fullResult.context.metrics.totalFiles
    );
  });

  it('returns a valid ScanResult shape', async () => {
    const result = await scanProject(path.join(fixturesDir, 'node-project'));
    // Shape validation
    expect(result).toHaveProperty('context');
    expect(result).toHaveProperty('suggestedDepth');
    expect(result).toHaveProperty('complexityScore');
    expect(result).toHaveProperty('summary');
    expect(result).toHaveProperty('reasoning');
    expect(['micro', 'standard', 'full']).toContain(result.suggestedDepth);
    expect(result.complexityScore).toBeGreaterThanOrEqual(0);
    expect(result.complexityScore).toBeLessThanOrEqual(100);
    expect(typeof result.summary).toBe('string');
    expect(typeof result.reasoning).toBe('string');
  });

  it('returns correct nested context structure', async () => {
    const result = await scanProject(path.join(fixturesDir, 'node-project'));
    const { context } = result;
    // techStack
    expect(Array.isArray(context.techStack.languages)).toBe(true);
    expect(Array.isArray(context.techStack.frameworks)).toBe(true);
    expect(Array.isArray(context.techStack.testFrameworks)).toBe(true);
    expect(Array.isArray(context.techStack.buildTools)).toBe(true);
    // architecture
    expect(['monolith', 'modular', 'monorepo', 'microservices', 'unknown']).toContain(context.architecture.pattern);
    expect(typeof context.architecture.hasApi).toBe('boolean');
    expect(typeof context.architecture.hasFrontend).toBe('boolean');
    expect(typeof context.architecture.hasDatabase).toBe('boolean');
    // metrics
    expect(context.metrics.totalFiles).toBeGreaterThanOrEqual(0);
    expect(context.metrics.totalLines).toBeGreaterThanOrEqual(0);
  });
});
