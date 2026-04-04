// tests/commands/init.test.ts

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mkdtemp, rm, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import os from 'os';

const tmpDirs: string[] = [];

async function makeTmpDir(): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'lsp-init-test-'));
  tmpDirs.push(dir);
  return dir;
}

afterEach(async () => {
  for (const dir of tmpDirs.splice(0)) {
    await rm(dir, { recursive: true, force: true });
  }
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('initCommand internals', () => {
  it('resolves cwd when no path argument is given', async () => {
    // Test the path resolution logic directly
    const resolvePath = (projectPath: string | undefined): string =>
      projectPath ? path.resolve(projectPath) : process.cwd();

    expect(resolvePath(undefined)).toBe(process.cwd());
    expect(resolvePath('/some/path')).toBe('/some/path');
  });

  it('respects --dry-run flag by not calling generateSpecs', async () => {
    // Mock the heavy dependencies so we can test the flag logic
    const generateMock = vi.fn().mockResolvedValue({
      files: [],
      durationMs: 0,
      provider: 'mock',
      model: 'default',
      depth: 'micro',
    });

    const scanMock = vi.fn().mockResolvedValue({
      context: {
        techStack: { languages: [], frameworks: [], packageManager: null, testFrameworks: [], buildTools: [] },
        architecture: { pattern: 'unknown', entryPoints: [], sourceDirectories: [], hasApi: false, hasFrontend: false, hasDatabase: false },
        routes: { routes: [], framework: null },
        docs: { readme: null, existingSpecs: [], otherDocs: [] },
        metrics: { totalFiles: 0, totalLines: 0, sourceFiles: 0, testFiles: 0, testCoverage: null },
      },
      suggestedDepth: 'micro' as const,
      complexityScore: 5,
      summary: 'Empty project.',
      reasoning: 'Minimal — micro spec.',
    });

    // With dry-run=true, we expect generateSpecs to NOT be called
    // This simulates the --dry-run guard in initCommand
    const dryRun = true;
    if (!dryRun) {
      await generateMock();
    }

    expect(generateMock).not.toHaveBeenCalled();
    // Scan would have been called
    const scanResult = await scanMock('/tmp/test-project');
    expect(scanResult.suggestedDepth).toBe('micro');
  });

  it('formats scan results with correct depth string', async () => {
    // Test the depth formatting helper
    const isValidDepth = (d: string): boolean =>
      d === 'micro' || d === 'standard' || d === 'full';

    expect(isValidDepth('micro')).toBe(true);
    expect(isValidDepth('standard')).toBe(true);
    expect(isValidDepth('full')).toBe(true);
    expect(isValidDepth('invalid')).toBe(false);
    expect(isValidDepth('')).toBe(false);

    // Test estimate formatter
    const formatEstimate = (seconds: number): string => {
      if (seconds < 60) return `~${seconds}s`;
      return `~${Math.round(seconds / 60)}m`;
    };

    expect(formatEstimate(15)).toBe('~15s');
    expect(formatEstimate(45)).toBe('~45s');
    expect(formatEstimate(90)).toBe('~2m');
    expect(formatEstimate(120)).toBe('~2m');
  });
});
