// tests/commands/scan.test.ts
// Tests for the Detection Confidence section added in Ticket 41.4

import { describe, it, expect } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildConfidenceSignals,
  buildConfidenceLines,
  type ConfidenceSignals,
} from '../../src/commands/scan.js';
import type { ScanResult } from '../../src/scanner/types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, '../fixtures');

// ---------------------------------------------------------------------------
// Helpers to build minimal ScanResult objects for unit-testing the helpers
// ---------------------------------------------------------------------------

function makeScanResult(overrides: {
  languages?: string[];
  frameworks?: string[];
  routes?: Array<{ method: string; path: string; file: string }>;
  routeFramework?: string | null;
  hasApi?: boolean;
  architecturePattern?: 'monolith' | 'modular' | 'monorepo' | 'microservices' | 'unknown';
}): ScanResult {
  return {
    context: {
      techStack: {
        languages: overrides.languages ?? [],
        frameworks: overrides.frameworks ?? [],
        packageManager: null,
        testFrameworks: [],
        buildTools: [],
      },
      architecture: {
        pattern: overrides.architecturePattern ?? 'monolith',
        entryPoints: [],
        sourceDirectories: [],
        hasApi: overrides.hasApi ?? true,
        hasFrontend: false,
        hasDatabase: false,
      },
      routes: {
        routes: overrides.routes ?? [],
        framework: overrides.routeFramework ?? null,
      },
      docs: { readme: null, existingSpecs: [], otherDocs: [] },
      metrics: { totalFiles: 10, totalLines: 500, sourceFiles: 8, testFiles: 2, testCoverage: null },
    },
    suggestedDepth: 'standard',
    complexityScore: 45,
    summary: 'Test project.',
    reasoning: 'Standard depth chosen.',
  };
}

// ---------------------------------------------------------------------------
// buildConfidenceSignals unit tests
// ---------------------------------------------------------------------------

describe('buildConfidenceSignals', () => {
  it('returns LIMITED route extraction for Go project with gin but no routes', () => {
    const result = makeScanResult({
      languages: ['go'],
      frameworks: ['gin'],
      routes: [],
    });
    const signals = buildConfidenceSignals(result);
    expect(signals.routeExtraction).toBe('LIMITED');
  });

  it('returns LIMITED route extraction for Go project with no routes (language only)', () => {
    const result = makeScanResult({
      languages: ['go'],
      frameworks: [],
      routes: [],
    });
    const signals = buildConfidenceSignals(result);
    expect(signals.routeExtraction).toBe('LIMITED');
  });

  it('returns HIGH route extraction for TypeScript/Express project with routes', () => {
    const result = makeScanResult({
      languages: ['typescript', 'javascript'],
      frameworks: ['express'],
      routes: [
        { method: 'GET', path: '/users', file: 'src/routes/users.ts' },
        { method: 'POST', path: '/users', file: 'src/routes/users.ts' },
      ],
      routeFramework: 'express',
    });
    const signals = buildConfidenceSignals(result);
    expect(signals.routeExtraction).toBe('HIGH');
  });

  it('returns NA route extraction when no HTTP framework detected', () => {
    const result = makeScanResult({
      languages: ['typescript'],
      frameworks: [],
      routes: [],
    });
    const signals = buildConfidenceSignals(result);
    expect(signals.routeExtraction).toBe('NA');
  });

  it('returns NONE api detection when hasApi is false', () => {
    const result = makeScanResult({ hasApi: false });
    const signals = buildConfidenceSignals(result);
    expect(signals.apiDetection).toBe('NONE');
  });

  it('returns HIGH api detection when hasApi is true', () => {
    const result = makeScanResult({ hasApi: true });
    const signals = buildConfidenceSignals(result);
    expect(signals.apiDetection).toBe('HIGH');
  });

  it('returns UNKNOWN architecture pattern when pattern is unknown', () => {
    const result = makeScanResult({ architecturePattern: 'unknown' });
    const signals = buildConfidenceSignals(result);
    expect(signals.architecturePattern).toBe('UNKNOWN');
  });

  it('returns HIGH architecture pattern for recognized patterns', () => {
    for (const pattern of ['monolith', 'modular', 'monorepo', 'microservices'] as const) {
      const result = makeScanResult({ architecturePattern: pattern });
      const signals = buildConfidenceSignals(result);
      expect(signals.architecturePattern).toBe('HIGH');
    }
  });

  it('returns LIMITED for rust project with no routes', () => {
    const result = makeScanResult({
      languages: ['rust'],
      frameworks: ['actix'],
      routes: [],
    });
    const signals = buildConfidenceSignals(result);
    expect(signals.routeExtraction).toBe('LIMITED');
  });

  it('returns LIMITED for ruby project with rails but no routes', () => {
    const result = makeScanResult({
      languages: ['ruby'],
      frameworks: ['rails'],
      routes: [],
    });
    const signals = buildConfidenceSignals(result);
    expect(signals.routeExtraction).toBe('LIMITED');
  });
});

// ---------------------------------------------------------------------------
// buildConfidenceLines unit tests (text content, strip ANSI for matching)
// ---------------------------------------------------------------------------

function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*m/g, '');
}

describe('buildConfidenceLines', () => {
  it('contains "LIMITED" for Go+gin project with no routes', () => {
    const result = makeScanResult({
      languages: ['go'],
      frameworks: ['gin'],
      routes: [],
    });
    const lines = buildConfidenceLines(result);
    const raw = lines.map(stripAnsi).join('\n');
    expect(raw).toContain('LIMITED');
    expect(raw).toContain('go');
  });

  it('mentions --srs hint for LIMITED route extraction', () => {
    const result = makeScanResult({
      languages: ['go'],
      frameworks: ['gin'],
      routes: [],
    });
    const lines = buildConfidenceLines(result);
    const raw = lines.map(stripAnsi).join('\n');
    expect(raw).toContain('--srs');
  });

  it('contains "HIGH" for TypeScript/Express project with routes', () => {
    const result = makeScanResult({
      languages: ['typescript'],
      frameworks: ['express'],
      routes: [
        { method: 'GET', path: '/users', file: 'routes/users.ts' },
        { method: 'POST', path: '/users', file: 'routes/users.ts' },
      ],
      routeFramework: 'express',
    });
    const lines = buildConfidenceLines(result);
    const raw = lines.map(stripAnsi).join('\n');
    expect(raw).toContain('HIGH');
    expect(raw).toContain('2 routes');
    expect(raw).toContain('express');
  });

  it('includes UNKNOWN warning when architecture.pattern is unknown', () => {
    const result = makeScanResult({ architecturePattern: 'unknown' });
    const lines = buildConfidenceLines(result);
    const raw = lines.map(stripAnsi).join('\n');
    expect(raw).toContain('UNKNOWN');
    expect(raw).toContain('Architecture pattern');
  });

  it('does NOT include Architecture pattern line when pattern is recognized', () => {
    const result = makeScanResult({ architecturePattern: 'monolith' });
    const lines = buildConfidenceLines(result);
    const raw = lines.map(stripAnsi).join('\n');
    expect(raw).not.toContain('UNKNOWN');
    // Architecture pattern line not shown at all for HIGH
    expect(raw).not.toContain('Architecture pattern');
  });

  it('shows api detection NONE hint listing trigger dirs', () => {
    const result = makeScanResult({ hasApi: false });
    const lines = buildConfidenceLines(result);
    const raw = lines.map(stripAnsi).join('\n');
    expect(raw).toContain('NONE');
    expect(raw).toContain('routes/');
  });
});

// ---------------------------------------------------------------------------
// buildConfidenceSignals JSON shape test
// ---------------------------------------------------------------------------

describe('confidence object shape for --json output', () => {
  it('produces correct keys matching ConfidenceSignals interface', () => {
    const result = makeScanResult({
      languages: ['go'],
      frameworks: ['gin'],
      routes: [],
      hasApi: true,
      architecturePattern: 'unknown',
    });
    const signals: ConfidenceSignals = buildConfidenceSignals(result);

    // Verify all 3 required keys are present
    expect(Object.keys(signals)).toEqual(
      expect.arrayContaining(['routeExtraction', 'apiDetection', 'architecturePattern']),
    );
    expect(signals.routeExtraction).toBe('LIMITED');
    expect(signals.apiDetection).toBe('HIGH');
    expect(signals.architecturePattern).toBe('UNKNOWN');
  });

  it('serializes confidence signals correctly to JSON', () => {
    const result = makeScanResult({
      languages: ['typescript'],
      frameworks: ['express'],
      routes: [{ method: 'GET', path: '/health', file: 'src/app.ts' }],
      routeFramework: 'express',
      hasApi: true,
      architecturePattern: 'monolith',
    });
    const signals = buildConfidenceSignals(result);
    const json = JSON.stringify({ confidence: signals });
    const parsed = JSON.parse(json) as { confidence: ConfidenceSignals };

    expect(parsed.confidence.routeExtraction).toBe('HIGH');
    expect(parsed.confidence.apiDetection).toBe('HIGH');
    expect(parsed.confidence.architecturePattern).toBe('HIGH');
  });
});
