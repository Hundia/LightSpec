import { describe, it, expect } from 'vitest';
import { scoreComplexity } from '../../src/scanner/complexity-scorer.js';
import type { BrownfieldContext } from '../../src/scanner/types.js';

// ---------------------------------------------------------------------------
// Helpers for building test contexts
// ---------------------------------------------------------------------------

function makeContext(overrides: Partial<{
  totalFiles: number;
  totalLines: number;
  sourceFiles: number;
  testFiles: number;
  languages: string[];
  frameworks: string[];
  pattern: BrownfieldContext['architecture']['pattern'];
  hasApi: boolean;
  hasFrontend: boolean;
  hasDatabase: boolean;
}>): BrownfieldContext {
  return {
    techStack: {
      languages: overrides.languages ?? [],
      frameworks: overrides.frameworks ?? [],
      packageManager: null,
      testFrameworks: [],
      buildTools: [],
    },
    architecture: {
      pattern: overrides.pattern ?? 'unknown',
      entryPoints: [],
      sourceDirectories: [],
      hasApi: overrides.hasApi ?? false,
      hasFrontend: overrides.hasFrontend ?? false,
      hasDatabase: overrides.hasDatabase ?? false,
    },
    routes: { routes: [], framework: null },
    docs: { readme: null, existingSpecs: [], otherDocs: [] },
    metrics: {
      totalFiles: overrides.totalFiles ?? 0,
      totalLines: overrides.totalLines ?? 0,
      sourceFiles: overrides.sourceFiles ?? 0,
      testFiles: overrides.testFiles ?? 0,
      testCoverage: null,
    },
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('scoreComplexity', () => {
  it('returns micro for a completely empty context', () => {
    const result = scoreComplexity(makeContext({}));
    expect(result.suggestedDepth).toBe('micro');
    // Minimum score: file(2) + line(1) = 3
    expect(result.complexityScore).toBe(3);
  });

  it('returns micro for a small simple project (score <= 25)', () => {
    const result = scoreComplexity(makeContext({
      totalFiles: 5,
      totalLines: 300,
      languages: ['javascript'],
      frameworks: [],
      pattern: 'monolith',
    }));
    expect(result.suggestedDepth).toBe('micro');
    // score: file(2) + line(1) + arch(5) + stack(3) = 11
    expect(result.complexityScore).toBeLessThanOrEqual(25);
  });

  it('returns standard for a medium project (26-65)', () => {
    const result = scoreComplexity(makeContext({
      totalFiles: 60,
      totalLines: 5000,
      languages: ['typescript', 'javascript'],
      frameworks: ['express', 'react'],
      pattern: 'monolith',
      hasApi: true,
      hasFrontend: true,
      testFiles: 6,
    }));
    expect(result.suggestedDepth).toBe('standard');
    expect(result.complexityScore).toBeGreaterThan(25);
    expect(result.complexityScore).toBeLessThanOrEqual(65);
  });

  it('returns full for a complex project (> 65)', () => {
    const result = scoreComplexity(makeContext({
      totalFiles: 300,
      totalLines: 80000,
      languages: ['typescript', 'javascript', 'python'],
      frameworks: ['nestjs', 'react', 'express'],
      pattern: 'monorepo',
      hasApi: true,
      hasFrontend: true,
      hasDatabase: true,
      testFiles: 50,
    }));
    expect(result.suggestedDepth).toBe('full');
    expect(result.complexityScore).toBeGreaterThan(65);
  });

  it('score never exceeds 100', () => {
    // Max possible: 25 + 20 + 20 + 15 + 10 + 10 = 100
    const result = scoreComplexity(makeContext({
      totalFiles: 1000,
      totalLines: 200000,
      languages: ['typescript', 'javascript', 'python', 'go', 'rust'],
      frameworks: ['nestjs', 'react', 'express', 'flask', 'gin'],
      pattern: 'monorepo',
      hasApi: true,
      hasFrontend: true,
      hasDatabase: true,
      testFiles: 100,
    }));
    expect(result.complexityScore).toBeLessThanOrEqual(100);
  });

  it('generates correct reasoning string for micro depth', () => {
    const result = scoreComplexity(makeContext({ totalFiles: 3, totalLines: 100 }));
    expect(result.reasoning).toContain('micro');
  });

  it('generates correct reasoning string for standard depth', () => {
    const result = scoreComplexity(makeContext({
      totalFiles: 60,
      totalLines: 15000,
      languages: ['typescript'],
      frameworks: ['express'],
      pattern: 'modular',
      testFiles: 3,
    }));
    expect(result.suggestedDepth).toBe('standard');
    expect(result.reasoning).toContain('standard');
  });

  it('generates correct reasoning string for full depth', () => {
    const result = scoreComplexity(makeContext({
      totalFiles: 300,
      totalLines: 100000,
      languages: ['typescript', 'python'],
      frameworks: ['nestjs', 'react'],
      pattern: 'monorepo',
      hasApi: true,
      hasFrontend: true,
      hasDatabase: true,
      testFiles: 25,
    }));
    expect(result.suggestedDepth).toBe('full');
    expect(result.reasoning).toContain('full');
  });

  it('includes context in the result unchanged', () => {
    const ctx = makeContext({ totalFiles: 10, pattern: 'monolith' });
    const result = scoreComplexity(ctx);
    expect(result.context).toBe(ctx);
  });

  it('generates a non-empty summary string', () => {
    const result = scoreComplexity(makeContext({ totalFiles: 5, totalLines: 200 }));
    expect(typeof result.summary).toBe('string');
    expect(result.summary.length).toBeGreaterThan(10);
  });

  it('correctly accumulates stack breadth score (capped at 15)', () => {
    // 6 languages + 6 frameworks = 12 items × 3 = 36, capped at 15
    const result = scoreComplexity(makeContext({
      languages: ['ts', 'js', 'py', 'go', 'rs', 'rb'],
      frameworks: ['express', 'react', 'flask', 'gin', 'rails', 'nestjs'],
      totalFiles: 5,
      totalLines: 100,
    }));
    // file(2) + line(1) + arch(0) + stack(15) = 18 → micro
    expect(result.complexityScore).toBeGreaterThanOrEqual(15 + 2 + 1);
  });

  it('correctly scores test maturity — no tests contributes 0', () => {
    const withNoTests = scoreComplexity(makeContext({ testFiles: 0, totalFiles: 5, totalLines: 100 }));
    const withTests = scoreComplexity(makeContext({ testFiles: 3, totalFiles: 5, totalLines: 100 }));
    expect(withTests.complexityScore).toBeGreaterThan(withNoTests.complexityScore);
  });

  it('microservices gets higher arch score than monolith', () => {
    const monolith = scoreComplexity(makeContext({ pattern: 'monolith', totalFiles: 5, totalLines: 100 }));
    const micro = scoreComplexity(makeContext({ pattern: 'microservices', totalFiles: 5, totalLines: 100 }));
    expect(micro.complexityScore).toBeGreaterThan(monolith.complexityScore);
  });
});
